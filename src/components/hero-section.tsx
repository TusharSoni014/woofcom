"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection({ backgroundImg = "" }: { backgroundImg: string }) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('${backgroundImg}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.7)",
        }}
        role="img"
        aria-label="Aesthetic clothing showcase"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
          Elevate Your Style with Woofcom
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl text-gray-200 mb-8">
          Discover aesthetic clothing that speaks volumes
        </p>
        <Button
          asChild
          size="lg"
          className="bg-white w-fit mx-auto text-black hover:bg-gray-200 hover:text-black transition-colors font-bold text-xl max-h-full h-full !py-3"
        >
          <Link className="font-bold text-3xl" href="#shop">Shop Now</Link>
        </Button>
      </div>

      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black opacity-30 z-5" />
    </section>
  );
}
