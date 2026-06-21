"use client";

import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import PricingSection from "@/components/PricingSection";
import ServicesSection from "@/components/ServicesSection";
import WhyUsSection from "@/components/WhyUsSection";
import LocationSection from "@/components/LocationSection";
import Footer from "@/components/Footer";
import HeroBuilderCTA from "@/components/HeroBuilderCTA";

// Load 3D background dynamically (client-side only)
const ThreeBackground = dynamic(
  () => import("@/components/ThreeBackground"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="relative bg-[#0f172a] min-h-screen">
      {/* Fixed 3D Background */}
      <ThreeBackground />

      {/* Content overlay */}
      <div className="relative z-10">
        <HeroSection />

        {/* Section transition gradient */}
        <div className="h-32 bg-gradient-to-b from-[#0f172a] to-[#0a0f1e]" />

        <ServicesSection />

        {/* Section transition gradient */}
        <div className="h-32 bg-gradient-to-b from-[#0a0f1e] to-[#0f172a]" />

        <WhyUsSection />

        {/* Section transition gradient */}
        <div className="h-32 bg-gradient-to-b from-[#0f172a] to-[#0a0f1e]" />

        <PricingSection />

        {/* Section transition gradient */}
        <div className="h-32 bg-gradient-to-b from-[#0a0f1e] to-[#0f172a]" />

        <HeroBuilderCTA />

        {/* Section transition gradient */}
        <div className="h-32 bg-gradient-to-b from-[#0f172a] to-[#0a0f1e]" />

        <LocationSection />

        {/* Section transition gradient */}
        <div className="h-32 bg-gradient-to-b from-[#0a0f1e] to-[#060a14]" />

        <Footer />
      </div>
    </main>
  );
}
