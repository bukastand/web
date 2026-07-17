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

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section-padding bg-white">
      <div
        ref={sectionRef}
        className="max-w-4xl mx-auto px-6 text-center"
      >
        <div className="reveal badge-premium mb-6 inline-flex">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {t("cta.badge")}
        </div>

        <h2 className="reveal reveal-delay-1 heading-xl mb-6">
          {t("cta.heading1")}
          <br />
          <span className="text-[#2563eb]">{t("cta.heading2")}</span>
        </h2>

        <div className="reveal reveal-delay-2 max-w-3xl mx-auto mb-8">
          <p className="body-lg">
            {t("cta.subtitle")}{" "}
            <span className="text-[#111111] font-semibold">{t("cta.subtitle_bold")}</span>
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
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f8f8f8] border border-[#eeeeee] text-sm text-[#666666]"
            >
              <span className="text-base">{feat.icon}</span>
              {feat.label}
            </span>
          ))}
        </div>

        <div className="reveal reveal-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#111111] text-white font-semibold rounded-xl text-lg transition-all duration-300 hover:bg-black hover:scale-[1.02] hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {t("cta.cta1")}
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#eeeeee] text-[#111111] font-semibold rounded-xl text-lg transition-all duration-300 hover:border-[#111111] hover:scale-[1.02]"
          >
            {t("cta.cta2")}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="reveal reveal-delay-4 mt-14 pt-10 border-t border-[#eeeeee]">
          <p className="text-xs text-[#999999] uppercase tracking-widest mb-5">{t("cta.trust")}</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {[
              { value: t("cta.trust1_val"), label: t("cta.trust1_label") },
              { value: t("cta.trust2_val"), label: t("cta.trust2_label") },
              { value: t("cta.trust3_val"), label: t("cta.trust3_label") },
              { value: t("cta.trust4_val"), label: t("cta.trust4_label") },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-lg font-bold text-[#111111]">{stat.value}</div>
                <div className="text-xs text-[#999999] uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 text-sm text-[#2563eb] hover:text-[#1d4ed8] transition-colors font-medium"
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
