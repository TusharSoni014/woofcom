import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

/**
 * Handles the POST request for the checkout API endpoint.
 *
 * This function performs the following tasks:
 * 1. Verifies the user's session and returns an error if the user is not authenticated.
 * 2. Retrieves the coupon code from the request body.
 * 3. Fetches the user's cart items, including the associated product information.
 * 4. Calculates the total cost of the cart items.
 * 5. Applies a discount if a valid coupon code is provided and the user has placed the required number of orders.
 * 6. Creates a new order in the database, including the cart items and the applied coupon (if any).
 * 7. Deletes the user's cart items after the order is created.
 * 8. Returns the created order, a success message, and the applied discount status (if any).
 *
 * @param req - The Next.js request object.
 * @returns A JSON response containing the created order, a success message, and the applied discount status (if any).
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { couponCode } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { cartItems: { include: { product: true } } },
    });

    if (!user || !user.cartItems) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const items = user.cartItems;
    let total = items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }

    let couponId = null;
    let discountApplied = false;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode },
      });

      if (coupon) {
        const orderCount = await prisma.order.count({
          where: { userId: session.user.id },
        });

        if ((orderCount + 1) % 3 === 0) {
          couponId = coupon.id;
          total = total * (1 - coupon.percentageOff / 100);
          discountApplied = true;
        } else {
          const ordersUntilNextCoupon = 3 - ((orderCount + 1) % 3);
          return NextResponse.json({
            valid: false,
            message: `You can apply this coupon after ${ordersUntilNextCoupon} more order(s).`,
          });
        }
      }
    }

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: total,
        status: "PENDING",
        couponId: couponId,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: true,
        coupon: true,
      },
    });

    await prisma.cartItem.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        valid: true,
        order,
        message: "Order Created Successfully!",
        discountApplied: discountApplied,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
