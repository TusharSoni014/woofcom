import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handles the POST request for a coupon code.
 *
 * This function first checks if the user is authenticated. If not, it returns a 401 Unauthorized response.
 * It then checks if a coupon code was provided in the request body. If not, it returns a 400 Bad Request response.
 *
 * If a valid coupon code is provided, the function checks if the coupon exists in the database. If not, it returns a 404 Not Found response.
 *
 * The function then checks the user's order count. If the next order (current order count + 1) is a multiple of 3, the function returns a valid response with the coupon's percentage off. Otherwise, it returns a response indicating the number of orders until the user can apply the coupon.
 *
 * If an error occurs during the processing, the function logs the error and returns a 500 Internal Server Error response.
 *
 * @param request - The NextRequest object containing the request data.
 * @returns A NextResponse object with the appropriate status code and response data.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Coupon code is required" },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      return NextResponse.json(
        { error: "Invalid coupon code" },
        { status: 404 }
      );
    }

    const orderCount = await prisma.order.count({
      where: { userId: session.user.id },
    });

    // This condition checks if the next order (current order count + 1) is a multiple of 3
    // It's used to determine if the user is eligible for a special offer or discount
    // that occurs every third order
    if ((orderCount + 1) % 3 === 0) {
      return NextResponse.json({
        valid: true,
        percentageOff: coupon.percentageOff,
      });
    } else {
      const ordersUntilNextCoupon = 3 - ((orderCount + 1) % 3);
      return NextResponse.json({
        valid: false,
        message: `You can apply this coupon after ${ordersUntilNextCoupon} more order(s).`,
      });
    }
  } catch (error) {
    console.error("Error processing coupon:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
