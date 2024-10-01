import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Handles the GET request for a specific product by its ID.
 *
 * @param request - The incoming HTTP request.
 * @param params - The route parameters, containing the product ID.
 * @returns A JSON response with the product data, or an error message if the product is not found or an internal error occurs.
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
