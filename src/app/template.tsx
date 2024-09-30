"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" key={pathname}>
      <motion.div
        initial={{ opacity: 0, filter: "blur(5px)", scale: 0.95 }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0)" }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
