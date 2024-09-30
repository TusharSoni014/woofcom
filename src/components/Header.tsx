"use client";

import { FaShoppingBag } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { BiLoaderCircle } from "react-icons/bi";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function Header() {
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const { data: session, status } = useSession();

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
          <div className="__menu">
            <Button onClick={() => signIn("google")}>Login</Button>
          </div>
        ) : (
          <div className="flex gap-3 justify-center items-center">
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
