"use client";

import { FaShoppingBag } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { BiLoaderCircle } from "react-icons/bi";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FaCartShopping } from "react-icons/fa6";
import { CiShop } from "react-icons/ci";
import { IoMdLogOut } from "react-icons/io";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CartItem, Product } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";

export default function Header() {
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [cartView, setCartView] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<
    (CartItem & { product: Product })[]
  >([]);
  const [cartLoading, setCartLoading] = useState<boolean>(false);
  const { data: session, status } = useSession();

  const fetchCartItems = async () => {
    try {
      setCartLoading(true);
      const response = await fetch("/api/cart/get");
      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }
      const cartItems = await response.json();
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
    if (cartView) {
      fetchCartItems();
    }
  }, [cartView]);

  useEffect(() => {
    if (status !== "loading") {
      setInitialLoading(false);
    }
  }, [status, session]);

  return (
    <div className="w-full h-[64px] bg-black/60 backdrop-blur-md text-white fixed z-50 top-0 p-3 flex justify-between items-center">
      <Link href="/">
        <div className="flex justify-center items-center gap-1 text-xl font-bold">
          <FaShoppingBag />
          WoofCom
        </div>
      </Link>
      <div className="__menu flex justify-center items-center gap-1">
        {initialLoading && status === "loading" ? (
          <BiLoaderCircle className="animate-spin" />
        ) : !session ? (
          <Button
            className="bg-white text-black hover:bg-gray-300 hover:text-black"
            onClick={() => signIn("google")}
          >
            Login
          </Button>
        ) : (
          <div className="flex gap-3 justify-center items-center">
            <Sheet open={cartView} onOpenChange={setCartView}>
              <SheetTrigger asChild>
                <Button
                  size="icon"
                  className="rounded-full bg-blue-600 shadow-md text-white hover:text-white"
                >
                  <FaCartShopping />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full flex flex-col gap-2">
                <SheetHeader>
                  <SheetTitle>Your Cart</SheetTitle>
                </SheetHeader>
                <div className="w-full flex-grow h-[calc(100%-70px)] flex gap-3 overflow-y-auto">
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
                      <div
                        key="cart-items"
                        className="flex gap-1.5 flex-col w-full"
                      >
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
                                <p className="text-sm font-medium">
                                  {item.product.name}
                                </p>
                                <p className="text-sm text-red-500 font-bold">
                                  {item.quantity} x ₹
                                  {String(item.product.price)} ={" "}
                                  {"₹" +
                                    String(
                                      item.quantity * Number(item.product.price)
                                    )}
                                </p>
                              </div>
                              <RxCross2
                                onClick={() =>
                                  handleRemoveFromCart(item.productId)
                                }
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
                {cartItems.length > 0 && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      filter: "blur(5px)",
                    }}
                    exit={{
                      opacity: 0,
                      filter: "blur(5px)",
                    }}
                    animate={{
                      opacity: 1,
                      filter: "blur(0px)",
                    }}
                  >
                    <Link href="/checkout">
                      <Button
                        onClick={() => setCartView(false)}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Checkout
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </SheetContent>
            </Sheet>
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={session.user?.image || ""} />
                  <AvatarFallback className="capitalize text-black select-none">
                    {session.user.name?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-[180px] p-2 flex flex-col gap-2">
                <Button className="w-full" variant="outline">
                  <CiShop />
                  <Link href="/orders">Orders</Link>
                </Button>
                <Button
                  className="w-full"
                  onClick={() => signOut()}
                  variant="destructive"
                >
                  <IoMdLogOut />
                  Logout
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </div>
  );
}
