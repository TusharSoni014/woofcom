"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <div className="w-full min-h-dvh">
      hello <Button onClick={() => signIn("google")}>Login</Button>
    </div>
  );
}
