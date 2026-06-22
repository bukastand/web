"use client";

import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import HeroBuilderCTA from "@/components/HeroBuilderCTA";
import ArticlesSection from "@/components/ArticlesSection";


const ThreeBackground = dynamic(() => import("@/components/ThreeBackground"), { ssr: false });

export default function Home() {
  return (
    <main className="relative bg-[#08080f] min-h-screen">
      <ThreeBackground />
      <div className="relative z-10">
        <HeroSection />

        {/* ── Section transition ── */}
        <div className="h-12 sm:h-20 bg-gradient-to-b from-[#08080f] to-[#0d0d1a]" />

        <ServicesSection />

        <div className="h-12 sm:h-20 bg-gradient-to-b from-[#0d0d1a] to-[#08080f]" />

        <HeroBuilderCTA />

        <div className="h-8 sm:h-16 bg-gradient-to-b from-[#0d0d1a] to-[#08080f]" />

        <ArticlesSection />

        <div className="h-8 sm:h-16 bg-gradient-to-b from-[#08080f] to-[#0d0d1a]" />
      </div>
    </main>
  );
}
