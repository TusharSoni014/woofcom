"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@prisma/client";

export default function ProductItem({ product }: { product: Product }) {
  const { id, name, price, imageUrl } = product;

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log(`Added ${name} to cart`);
  };

  return (
    <Card className="w-full h-full flex flex-col justify-between rounded-none shadow-none">
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-square relative mb-4">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover rounded-md"
          />
        </div>
        <p className="text-xl font-bold">₹{String(price)}</p>
      </CardContent>
      <CardFooter className="flex justify-between gap-1.5">
        <Button className="w-full rounded-none" onClick={handleAddToCart}>Add to Cart</Button>
        <Button className="w-full rounded-none" variant="outline" asChild>
          <Link href={`/product/${id}`}>Visit Product</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
