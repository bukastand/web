"use client";

import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import WhyUsSection from "@/components/WhyUsSection";
import ProcessSection from "@/components/ProcessSection";
import PortfolioSection from "@/components/PortfolioSection";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import ArticlesSection from "@/components/ArticlesSection";
import LocationSection from "@/components/LocationSection";
import HeroBuilderCTA from "@/components/HeroBuilderCTA";

export default function Home() {
  return (
    <main className="bg-white min-h-screen">
      <HeroSection />
      <ServicesSection />
      <WhyUsSection />
      <ProcessSection />
      <PortfolioSection />
      <PricingSection />
      <TestimonialsSection />
      <ArticlesSection />
      <FAQSection />
      <HeroBuilderCTA />
      <LocationSection />
    </main>
  );
}
