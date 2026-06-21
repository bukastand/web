"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function HeroBuilderCTA() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const reveals = entry.target.querySelectorAll(".reveal");
            reveals.forEach((el, i) => {
              setTimeout(() => {
                (el as HTMLElement).classList.add("visible");
              }, i * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden pt-20 sm:pt-28 pb-16 sm:pb-24">
      <div className="absolute inset-0 bg-gradient-to-b from-[#22c55e]/10 via-[#0f172a] to-[#0f172a] z-0" />

      <div
        className="absolute inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,197,94,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="absolute top-20 left-1/4 w-72 h-72 bg-[#22c55e]/20 rounded-full blur-[120px] animate-pulse z-0" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#22c55e]/10 rounded-full blur-[150px] animate-pulse z-0" />

      <div ref={sectionRef} className="relative z-10 container mx-auto px-6 max-w-5xl text-center">
        <div className="reveal inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 text-[#4ade80] text-sm font-medium mb-6 backdrop-blur-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {t("cta.badge")}
        </div>

        <h1 className="reveal reveal-delay-1 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          <span className="text-white">{t("cta.heading1")}</span>
          <br />
          <span className="gradient-text">{t("cta.heading2")}</span>
        </h1>

        <div className="reveal reveal-delay-2 max-w-3xl mx-auto mb-10">
          <p className="text-lg sm:text-xl text-gray-400 leading-relaxed">
            {t("cta.subtitle")}{" "}
            <span className="text-white font-semibold">{t("cta.subtitle_bold")}</span>
          </p>
        </div>

        <div className="reveal reveal-delay-2 flex flex-wrap items-center justify-center gap-3 mb-10">
          {[
            { icon: "🎨", label: t("cta.feature1") },
            { icon: "📱", label: t("cta.feature2") },
            { icon: "⚡", label: t("cta.feature3") },
            { icon: "🎯", label: t("cta.feature4") },
            { icon: "🖼", label: t("cta.feature5") },
          ].map((feat, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300"
            >
              <span className="text-base">{feat.icon}</span>
              {feat.label}
            </span>
          ))}
        </div>

        <div className="reveal reveal-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/auth/register"
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-[#22c55e] text-white font-bold rounded-xl text-lg transition-all duration-300 hover:bg-[#16a34a] hover:scale-105 animate-pulse-glow"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {t("cta.cta1")}
            <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold rounded-xl text-lg transition-all duration-300 hover:bg-white/10 hover:border-white/40"
          >
            {t("cta.cta2")}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="reveal reveal-delay-4 mt-12 pt-8 border-t border-white/5">
          <p className="text-xs text-gray-600 uppercase tracking-widest mb-4">{t("cta.trust")}</p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {[
              { value: t("cta.trust1_val"), label: t("cta.trust1_label") },
              { value: t("cta.trust2_val"), label: t("cta.trust2_label") },
              { value: t("cta.trust3_val"), label: t("cta.trust3_label") },
              { value: t("cta.trust4_val"), label: t("cta.trust4_label") },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-sm font-bold text-[#22c55e]">{stat.value}</div>
                <div className="text-[10px] text-gray-600 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 text-sm text-[#22c55e] hover:text-[#4ade80] transition-colors font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              {t("cta.templates_link")}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
