"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

interface HeroData {
  badge_text: string;
  title_line1: string;
  title_line2: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  secondary_cta_text: string;
  secondary_cta_link: string;
}

const defaultHero: HeroData = {
  badge_text: "PAGODA STUDIO — Since 2024",
  title_line1: "Professional",
  title_line2: "Website Development",
  subtitle:
    "Modern, fast, mobile-friendly websites ready to help your business look more professional and attract more customers.",
  cta_text: "Free Consultation",
  cta_link: "https://wa.me/6282210099969",
  secondary_cta_text: "View Packages",
  secondary_cta_link: "#paket",
};

export default function HeroSection() {
  const [hero, setHero] = useState<HeroData>(defaultHero);
  const { t, locale } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    supabase
      .from("hero_content")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (data) {
          setHero({
            badge_text: data.badge_text,
            title_line1: data.title_line1,
            title_line2: data.title_line2,
            subtitle: data.subtitle,
            cta_text: data.cta_text,
            cta_link: data.cta_link,
            secondary_cta_text: data.secondary_cta_text,
            secondary_cta_link: data.secondary_cta_link,
          });
        }
      });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            const reveals = entry.target.querySelectorAll(".reveal");
            reveals.forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-[#22c55e]/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-[150px] animate-pulse pointer-events-none" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#22c55e]/5 rounded-full blur-[200px] animate-pulse pointer-events-none" style={{ animationDelay: "3s" }} />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,197,94,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#0f172a] to-transparent z-[2] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 pt-24 pb-16">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="reveal inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 text-[#4ade80] text-sm font-medium mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            {t("hero.badge")}
          </div>

          {/* Main Title */}
          <h1 className="reveal reveal-delay-1 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[0.95] tracking-tight mb-6">
            <span className="text-white">{hero.title_line1}</span>
            <br />
            <span className="gradient-text">{hero.title_line2}</span>
          </h1>

          {/* Subtitle */}
          <p className="reveal reveal-delay-2 text-lg sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            {hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="reveal reveal-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={hero.cta_link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2.5 px-8 py-4 bg-[#22c55e] text-white font-bold rounded-xl text-lg transition-all duration-300 hover:bg-[#16a34a] hover:scale-105 animate-pulse-glow"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t("hero.cta")}
              <span className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <a
              href={hero.secondary_cta_link}
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold rounded-xl text-lg transition-all duration-300 hover:bg-white/10 hover:border-white/40"
            >
              {t("hero.secondary_cta")}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </div>

          {/* Stats */}
          <div className="reveal reveal-delay-4 mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { value: "50+", label: t("hero.stat1") },
              { value: "30+", label: t("hero.stat2") },
              { value: "12", label: t("hero.stat3") },
              { value: "24/7", label: t("hero.stat4") },
            ].map((stat, i) => (
              <div
                key={i}
                className="group relative p-5 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] hover:border-[#22c55e]/30 transition-all duration-500 hover:bg-white/[0.06]"
              >
                <div className="text-3xl md:text-4xl font-extrabold text-[#22c55e] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-[10px] text-gray-600 tracking-[0.2em] uppercase">{t("hero.scroll")}</span>
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
        </svg>
      </div>
    </section>
  );
}
