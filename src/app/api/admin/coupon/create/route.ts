import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

/**
 * Handles the creation of a new coupon.
 *
 * This API endpoint is only accessible to admin users. It expects a request body with the following properties:
 *
 * - `code`: The coupon code to be created.
 * - `percentageOff`: The percentage discount the coupon offers.
 *
 * If the request is valid and the user is an admin, a new coupon is created in the database and returned in the response.
 * If the request is invalid or the user is not an admin, an appropriate error response is returned.
 *
 * @param request - The incoming NextRequest object.
 * @returns A NextResponse containing the created coupon or an error message.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !(session.user as any).isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized. Only admin users can create coupons." },
        { status: 401 }
      );
    }

    const { code, percentageOff } = await request.json();

    if (!code || !percentageOff) {
      return NextResponse.json(
        { error: "Code and percentageOff are required" },
        { status: 400 }
      );
    }

    const newCoupon = await prisma.coupon.create({
      data: {
        code,
        percentageOff,
      },
    });

    return NextResponse.json(newCoupon);
  } catch (error) {
    console.error("Error creating coupon:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
