import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

/**
 * Fetches analytics data for the admin dashboard, including the total number of items purchased, the total purchase amount, and information about discount codes and their total discount amount.
 *
 * This API endpoint is protected and can only be accessed by users with the 'isAdmin' flag set to true in their session.
 *
 * @returns {Promise<NextResponse<{
 *   itemsPurchasedCount: number;
 *   totalPurchaseAmount: number;
 *   discountCodes: { code: string; percentageOff: number; totalDiscountAmount: number }[];
 *   totalDiscountAmount: number;
 * }>>} The analytics data.
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !(session.user).isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    // Count of items purchased
    const itemsPurchasedCount = await prisma.orderItem.count();

    // Total purchase amount
    const totalPurchaseAmount = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
    });

    // List of discount codes and total discount amount
    const coupons = await prisma.coupon.findMany({
      select: {
        code: true,
        percentageOff: true,
        orders: {
          select: {
            total: true,
          },
        },
      },
    });

    const discountInfo = coupons.map((coupon) => {
      const totalDiscountAmount = coupon.orders.reduce((sum, order) => {
        return sum + (order.total.toNumber() * coupon.percentageOff) / 100;
      }, 0);

      return {
        code: coupon.code,
        percentageOff: coupon.percentageOff,
        totalDiscountAmount: parseFloat(totalDiscountAmount.toFixed(2)),
      };
    });

    const totalDiscountAmount = discountInfo.reduce(
      (sum, info) => sum + info.totalDiscountAmount,
      0
    );

    return NextResponse.json({
      itemsPurchasedCount,
      totalPurchaseAmount: totalPurchaseAmount._sum.total?.toNumber() || 0,
      discountCodes: discountInfo,
      totalDiscountAmount: parseFloat(totalDiscountAmount.toFixed(2)),
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/*
Sample Output:
{
	"itemsPurchasedCount": 8,
	"totalPurchaseAmount": 27841.5,
	"discountCodes": [
		{
			"code": "tushar",
			"percentageOff": 10,
			"totalDiscountAmount": 0
		},
		{
			"code": "offer50",
			"percentageOff": 50,
			"totalDiscountAmount": 874.75
		}
	],
	"totalDiscountAmount": 874.75
}
*/
