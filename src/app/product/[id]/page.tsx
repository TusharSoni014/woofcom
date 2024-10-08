"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@prisma/client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, ShoppingCart } from "lucide-react";
import { BiLoaderCircle } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { AnimatePresence, AnimationProps, motion } from "framer-motion";

export default function Page() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const [cartAddLoading, setCartAddLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  /**
   * Handles adding a product to the user's cart.
   * 
   * If the user is not logged in, it displays a toast message asking them to log in.
   * Otherwise, it sends a POST request to the "/api/cart/add" endpoint with the product ID.
   * If the request is successful, it displays a toast message indicating the item was added to the cart.
   * If there is an error, it displays a toast message with the error.
   * Finally, it sets the `cartAddLoading` state to false.
   */
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

  useEffect(() => {
    /**
     * Fetches the product data from the server based on the provided `id`.
     * 
     * If the fetch is successful, the product data is stored in the `product` state.
     * If there is an error, a toast message is displayed with the error description.
     * Finally, the `loading` state is set to `false` to indicate the fetch is complete.
     */
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/product/${id}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data: Product = await response.json();
        setProduct(data);
      } catch {
        toast({
          variant: "destructive",
          description: "some error occured while fetching the product",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, toast]);

  const initialAnimation: AnimationProps["initial"] = {
    opacity: 0,
    filter: "blur(5px)",
  };

  const finalAnimation: AnimationProps["animate"] = {
    opacity: 1,
    filter: "blur(0px)",
  };

  const exitAnimation: AnimationProps["exit"] = {
    opacity: 0,
    filter: "blur(5px)",
  };

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loading"
          initial={initialAnimation}
          animate={finalAnimation}
          exit={exitAnimation}
          className="w-full min-h-dvh flex justify-center items-center"
        >
          <BiLoaderCircle className="animate-spin" />
        </motion.div>
      ) : !product ? (
        <motion.div
          key="product-not-found"
          initial={initialAnimation}
          animate={finalAnimation}
          exit={exitAnimation}
          className="w-full min-h-dvh flex justify-center items-center"
        >
          Product not found
        </motion.div>
      ) : (
        <motion.div
          key="product-loaded"
          initial={initialAnimation}
          animate={finalAnimation}
          exit={exitAnimation}
          transition={{ duration: 0.3 }}
          className="max-w-6xl min-h-dvh mx-auto p-4 md:p-6 lg:p-8 !pt-[76px] "
        >
          <div className="flex flex-col md:flex-row justify-between gap-12">
            {/* Image Section */}
            <div className="w-full md:w-1/2 relative aspect-square bg-white rounded-lg overflow-hidden">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-contain w-full h-full"
                onLoadingComplete={() => setImageLoading(false)}
              />
            </div>

            {/* Product Details Section */}
            <div className="w-full md:w-1/2 flex flex-col">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary mb-4">
                  {product.name}
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  {product.description}
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-2xl font-bold text-primary">
                    ₹{String(product.price)}
                  </div>
                </div>
              </div>
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full sm:w-auto rounded-none"
                loading={cartAddLoading}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
