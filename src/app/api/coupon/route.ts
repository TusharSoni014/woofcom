import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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
