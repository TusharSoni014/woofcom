import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        coupon: true,
        items: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderDate: order.createdAt,
      status: order.status,
      totalPrice: order.total,
      discountedPrice: order.coupon
        ? Number(order.total) * (1 - order.coupon.percentageOff / 100)
        : null,
      couponCode: order.coupon?.code || null,
      products: order.items.map((item) => item.product.name),
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
