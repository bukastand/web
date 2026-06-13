"use client";

import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import PricingSection from "@/components/PricingSection";
import ServicesSection from "@/components/ServicesSection";
import WhyUsSection from "@/components/WhyUsSection";
import LocationSection from "@/components/LocationSection";
import PortfolioSection from "@/components/PortfolioSection";
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
        <HeroBuilderCTA />
        <PricingSection />
        <ServicesSection />
        <WhyUsSection />
        <PortfolioSection />
        <LocationSection />
        <Footer />
      </div>
    </main>
  );
}
