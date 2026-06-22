"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import PortfolioSection from "@/components/PortfolioSection";
import HeroBuilderCTA from "@/components/HeroBuilderCTA";


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

        <PortfolioSection />

        <div className="h-8 sm:h-16 bg-gradient-to-b from-[#0d0d1a] to-[#08080f]" />

        <HeroBuilderCTA />

        <div className="h-8 sm:h-16 bg-gradient-to-b from-[#0d0d1a] to-[#08080f]" />

        {/* ├─ Featured Articles ── */}
        <section className="relative py-12 sm:py-16">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <span className="inline-block px-3 py-1 rounded-full bg-[#a78bfa]/10 border border-[#a78bfa]/20 text-[#a78bfa] text-xs font-semibold mb-4">
                Blog
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Artikel & <span className="gradient-text">Informasi</span>
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Tips, trik, dan informasi terbaru seputar website dan digital marketing.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 hover:border-[#a78bfa]/30 hover:text-[#a78bfa] transition-all"
              >
                Lihat Semua Artikel
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <div className="h-8 sm:h-16 bg-gradient-to-b from-[#08080f] to-[#0d0d1a]" />
      </div>
    </main>
  );
}
