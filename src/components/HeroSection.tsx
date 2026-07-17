"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import Logo from "./Logo";

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
  secondary_cta_link: "/layanan",
};

export default function HeroSection() {
  const [hero, setHero] = useState<HeroData>(defaultHero);
  const { t } = useTranslation();
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
            const reveals = entry.target.querySelectorAll(".reveal");
            reveals.forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 120);
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #111111 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Subtle accent glow */}
      <div className="absolute top-1/4 -left-32 w-[400px] h-[400px] bg-[#2563eb]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-[#2563eb]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="reveal inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f8f8f8] border border-[#eeeeee] text-[#666666] text-sm font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
            {t("hero.badge")}
          </div>

          {/* Main Title */}
          <h1 className="reveal reveal-delay-1">
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#111111] leading-[0.95] mb-4">
              {t("hero.title1")}
            </span>
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#2563eb] leading-[0.95]">
              {t("hero.title2")}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="reveal reveal-delay-2 text-lg sm:text-xl text-[#666666] max-w-2xl mx-auto mt-8 mb-10 leading-relaxed">
            {t("hero.subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="reveal reveal-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={hero.cta_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#111111] text-white font-semibold rounded-xl text-lg transition-all duration-300 hover:bg-black hover:scale-[1.02] hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t("hero.cta")}
            </a>
            <a
              href={hero.secondary_cta_link}
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#eeeeee] text-[#111111] font-semibold rounded-xl text-lg transition-all duration-300 hover:border-[#111111] hover:scale-[1.02]"
            >
              {t("hero.secondary_cta")}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </div>

          {/* Stats */}
          <div className="reveal reveal-delay-4 mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: "50+", label: t("hero.stat1") },
              { value: "30+", label: t("hero.stat2") },
              { value: "12", label: t("hero.stat3") },
              { value: "24/7", label: t("hero.stat4") },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#111111] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[#999999]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-[10px] text-[#cccccc] tracking-[0.2em] uppercase">Scroll</span>
        <svg className="w-4 h-4 text-[#cccccc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
        </svg>
      </div>
    </section>
  );
}
