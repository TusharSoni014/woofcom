"use client";

import { FaShoppingBag } from "react-icons/fa";
import React from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  return (
    <div className="w-full h-[64px] shadow-md bg-white sticky top-0 p-3 flex justify-between items-center">
      <Link href="/">
        <div className="flex justify-center items-center gap-1 text-xl font-bold">
          <FaShoppingBag />
          WoofCom
        </div>
      </Link>
      <div className="__menu flex justify-center items-center gap-1">
        <Button onClick={() => signIn("google")}>Login</Button>
      </div>
    </div>
  );
}
