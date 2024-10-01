"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Product } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function ProductItem({ product }: { product: Product }) {
  const { id, name, price, imageUrl } = product;
  const { data: session } = useSession();
  const { toast } = useToast();
  const [cartAddLoading, setCartAddLoading] = useState<boolean>(false);

  const handleAddToCart = async () => {
    if (!session) {
      toast({
        variant: "destructive",
        description: "Please login to add items to cart",
      });
    } else {
      try {
        setCartAddLoading(true);
        const response = await fetch("/api/cart/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId: id }),
        });

        const data = await response.json();
        if (data.success) {
          toast({
            description: "Item added to cart!",
          });
        }
      } catch {
        toast({
          variant: "destructive",
          description: "Error adding to cart",
        });
      } finally {
        setCartAddLoading(false);
      }
    }
  };

  return (
    <Card className="w-full h-full flex flex-col justify-between rounded-none shadow-none p-3">
      <CardContent>
        <div className="aspect-square relative mb-4">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover rounded-md"
          />
        </div>
        <CardTitle className="text-lg">{name}</CardTitle>
        <p className="text-xl font-bold text-green-600">₹{String(price)}</p>
      </CardContent>
      <CardFooter className="flex justify-between gap-1.5">
        <Button
          loading={cartAddLoading}
          className="w-full rounded-none"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
        <Button className="w-full rounded-none" variant="outline" asChild>
          <Link href={`/product/${id}`}>Visit Product</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
