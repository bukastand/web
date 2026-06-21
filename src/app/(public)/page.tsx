"use client";

import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import WhyUsSection from "@/components/WhyUsSection";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import LocationSection from "@/components/LocationSection";
import Footer from "@/components/Footer";
import HeroBuilderCTA from "@/components/HeroBuilderCTA";
import ArticlesSection from "@/components/ArticlesSection";

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

        {/* Section transition */}
        <div className="h-12 sm:h-20 bg-gradient-to-b from-[#0f172a] to-[#0a0f1e]" />

        <ServicesSection />

        {/* Section transition */}
        <div className="h-12 sm:h-20 bg-gradient-to-b from-[#0a0f1e] to-[#0f172a]" />

        <ProcessSection />

        {/* Section transition */}
        <div className="h-12 sm:h-20 bg-gradient-to-b from-[#0f172a] to-[#0a0f1e]" />

        <WhyUsSection />

        {/* Section transition */}
        <div className="h-12 sm:h-20 bg-gradient-to-b from-[#0a0f1e] to-[#0f172a]" />

        <PricingSection />

        {/* Section transition */}
        <div className="h-12 sm:h-20 bg-gradient-to-b from-[#0f172a] to-[#0a0f1e]" />

        <TestimonialsSection />

        {/* Section transition */}
        <div className="h-12 sm:h-20 bg-gradient-to-b from-[#0a0f1e] to-[#0f172a]" />

        <HeroBuilderCTA />

        {/* Section transition */}
        <div className="h-12 sm:h-20 bg-gradient-to-b from-[#0f172a] to-[#0a0f1e]" />

        <FAQSection />

        {/* Section transition */}
        <div className="h-12 sm:h-20 bg-gradient-to-b from-[#0a0f1e] to-[#0f172a]" />

        <LocationSection />

        {/* Final transition to footer */}
        {/* Blog / Articles */}
        <ArticlesSection />

        {/* Section transition */}
        <div className="h-12 sm:h-20 bg-gradient-to-b from-[#0a0f1e] to-[#0f172a]" />

        <Footer />
      </div>
    </main>
  );
}
