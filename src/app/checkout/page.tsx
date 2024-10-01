"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CartItem, Product } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";

export default function Page() {
  const [cartItems, setCartItems] = useState<
    (CartItem & { product: Product })[]
  >([]);
  const [cartLoading, setCartLoading] = useState<boolean>(false);
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();

  const handleConfirmOrder = async () => {
    try {
      setCheckoutLoading(true);
      const response = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ cartItems, couponCode }),
      });

      if (!response.ok) {
        throw new Error("Checkout failed");
      }

      const data = await response.json();
      console.log(data);

      toast({ description: "Order placed successfully!" });
      router.push("/");
    } catch (error) {
      console.error("Error during checkout:", error);
      toast({
        variant: "destructive",
        description: "Failed to place order. Please try again.",
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  const fetchCartItems = async () => {
    try {
      setCartLoading(true);
      const response = await fetch("/api/cart/get");
      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }
      const cartItems = await response.json();
      console.log(cartItems);
      setCartItems(cartItems);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setCartLoading(false);
    }
  };

  const handleRemoveFromCart = async (productId: string) => {
    try {
      setCartLoading(true);
      const response = await fetch("/api/cart/remove", {
        method: "POST",
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      await fetchCartItems();
    } catch (error) {
      console.error("Error removing item from cart:", error);
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <div className="w-full min-h-dvh p-5 pt-[72px]">
      <div className="__cart_items h-[300px] overflow-y-auto p-3 border w-full">
        <AnimatePresence mode="wait">
          {cartLoading ? (
            <motion.div
              key="loading-cart"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="size-full flex justify-center items-center"
            >
              <BiLoaderCircle className="animate-spin" />
            </motion.div>
          ) : (
            <div key="cart-items" className="flex gap-1.5 flex-col w-full">
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <motion.div
                    initial={{
                      opacity: 0,
                      filter: "blur(5px)",
                      scale: 0.95,
                    }}
                    exit={{
                      opacity: 0,
                      filter: "blur(5px)",
                      scale: 0.95,
                    }}
                    animate={{
                      opacity: 1,
                      filter: "blur(0px)",
                      scale: 1,
                    }}
                    transition={{ delay: index * 0.1 }}
                    key={item.id}
                    className="p-3 rounded-md bg-black/5 flex items-center gap-2 h-fit w-full relative group"
                  >
                    <div className="w-16 h-16 overflow-hidden bg-white relative aspect-square shrink-0 p-1 rounded-sm">
                      <Image
                        width={64}
                        height={64}
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium">{item.product.name}</p>
                      <p className="text-sm text-red-500 font-bold">
                        {item.quantity} x ₹{String(item.product.price)} ={" "}
                        {"₹" +
                          String(item.quantity * Number(item.product.price))}
                      </p>
                    </div>
                    <RxCross2
                      onClick={() => handleRemoveFromCart(item.productId)}
                      size={20}
                      className="absolute opacity-0 group-hover:opacity-100 top-2 right-2 text-gray-500 hover:text-red-500 transition-all cursor-pointer hover:bg-white rounded-full p-1"
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{
                    opacity: 0,
                    filter: "blur(5px)",
                    scale: 0.95,
                  }}
                  exit={{
                    opacity: 0,
                    filter: "blur(5px)",
                    scale: 0.95,
                  }}
                  animate={{
                    opacity: 1,
                    filter: "blur(0px)",
                    scale: 1,
                  }}
                  className="text-center text-black/60 text-sm flex justify-center items-center"
                >
                  Your cart is empty
                </motion.div>
              )}{" "}
            </div>
          )}
        </AnimatePresence>
      </div>
      <div className="__confirm_container">
        <h2 className="text-2xl font-bold mb-4">Confirm Order</h2>
        {cartItems.length > 0 ? (
          <>
            <div className="mb-4">
              <p className="text-lg font-semibold">Total Amount:</p>
              <p className="text-xl text-red-500 font-bold">
                ₹
                {cartItems
                  .reduce(
                    (total, item) =>
                      total + item.quantity * Number(item.product.price),
                    0
                  )
                  .toFixed(2)}
              </p>
            </div>
            <div className="mb-4">
              <label
                htmlFor="couponCode"
                className="block text-sm font-medium text-gray-700"
              >
                Coupon Code (optional):
              </label>
              <Input
                type="text"
                id="couponCode"
                name="couponCode"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <Button
              loading={checkoutLoading}
              onClick={handleConfirmOrder}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Order
            </Button>
          </>
        ) : (
          <p className="text-center text-gray-500">
            Add items to your cart to place an order.
          </p>
        )}
      </div>
    </div>
  );
}
