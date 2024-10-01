import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code, percentageOff } = await request.json();

    if (!code || !percentageOff) {
      return new Response(
        JSON.stringify({ error: "Code and percentageOff are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
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
      {
        status: 500,
      }
    );
  }
}
