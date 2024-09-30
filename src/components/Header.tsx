"use client";

import { FaShoppingBag } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { BiLoaderCircle } from "react-icons/bi";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FaCartShopping } from "react-icons/fa6";
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
      console.log(cartItems);
      setCartItems(cartItems);
    } catch (error) {
      console.error("Error fetching cart items:", error);
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
    <div className="w-full h-[64px] shadow-md bg-white fixed z-50 top-0 p-3 flex justify-between items-center">
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
          <Button onClick={() => signIn("google")}>Login</Button>
        ) : (
          <div className="flex gap-3 justify-center items-center">
            <Sheet open={cartView} onOpenChange={setCartView}>
              <SheetTrigger asChild>
                <Button
                  size="icon"
                  className="rounded-full bg-white shadow-md text-black hover:text-white"
                >
                  <FaCartShopping />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Your Cart</SheetTitle>
                </SheetHeader>
                <div className="w-full h-[calc(100%-30px)] flex gap-3 overflow-y-auto">
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
                      <div key="cart-items" className="flex gap-1.5 flex-col">
                        {cartItems.map((item) => (
                          <motion.div
                            key={item.id}
                            className="p-3 rounded-md bg-black/5 flex items-center gap-2 h-fit"
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

                            <div>
                              <p className="text-sm font-medium">
                                {item.product.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.quantity} x ₹{String(item.product.price)}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </SheetContent>
            </Sheet>
            <Button onClick={() => signOut()} variant="destructive">
              Logout
            </Button>
            <Avatar>
              <AvatarImage src={session.user?.image || ""} />
              <AvatarFallback className="capitalize">
                {session.user.name?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </div>
  );
}
