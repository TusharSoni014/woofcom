import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Fetches all products from the database and returns them as a JSON response.
 *
 * @returns {Promise<NextResponse>} A JSON response containing all the products.
 */
export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
