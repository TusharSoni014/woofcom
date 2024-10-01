import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { couponCode } = await req.json(); // Extract coupon code from request body

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
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode },
      });
      if (coupon) {
        couponId = coupon.id;
        total = total * (1 - coupon.percentageOff / 100); // Apply discount
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
      { order, message: "Order Created Successfully!" },
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
