"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

interface WhyUsItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
  gradient: string;
}

const iconSvg: Record<string, React.ReactNode> = {
  image: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  smartphone: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  zap: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  settings: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const defaultWhyUs: WhyUsItem[] = [
  {
    icon: iconSvg.image || null,
    title: "Modern Design",
    desc: "Elegant and professional appearance to increase customer trust.",
    gradient: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    icon: iconSvg.smartphone || null,
    title: "Mobile Friendly",
    desc: "Websites display optimally on phones, tablets, and desktops.",
    gradient: "from-blue-500/20 to-blue-500/5",
  },
  {
    icon: iconSvg.zap || null,
    title: "Fast Loading",
    desc: "Lightweight and fast-loading websites for a better user experience.",
    gradient: "from-yellow-500/20 to-yellow-500/5",
  },
  {
    icon: iconSvg.settings || null,
    title: "Quick Support",
    desc: "We're ready to help with any issues or website updates.",
    gradient: "from-purple-500/20 to-purple-500/5",
  },
];

const colorAccents = [
  { light: "bg-emerald-500/15", medium: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", glow: "shadow-emerald-500/10" },
  { light: "bg-blue-500/15", medium: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", glow: "shadow-blue-500/10" },
  { light: "bg-amber-500/15", medium: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", glow: "shadow-amber-500/10" },
  { light: "bg-purple-500/15", medium: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400", glow: "shadow-purple-500/10" },
];

export default function WhyUsSection() {
  const [reasons, setReasons] = useState<WhyUsItem[]>(defaultWhyUs);
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    supabase
      .from("why_us")
      .select("title, description, icon_name, gradient")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setReasons(
            data.map((r) => ({
              icon: iconSvg[r.icon_name] || iconSvg.image,
              title: r.title,
              desc: r.description,
              gradient: r.gradient,
            }))
          );
        }
      });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            const cards = entry.target.querySelectorAll(".reveal");
            cards.forEach((card, i) => {
              setTimeout(() => card.classList.add("visible"), i * 150);
            });
          }
        });
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32 bg-[#0f172a] overflow-hidden"
    >
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#22c55e]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative container mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            {t("whyus.label")}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {t("whyus.heading")}{" "}
            <span className="gradient-text">{t("whyus.heading_highlight")}</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {t("whyus.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {reasons.map((reason, index) => {
            const accent = colorAccents[index];
            return (
              <div
                key={index}
                className="reveal group relative p-6 sm:p-8 rounded-2xl border overflow-hidden transition-all duration-500 hover:-translate-y-1"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <div className={`absolute inset-0 ${accent.light} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <div className={`relative z-10 w-16 h-16 rounded-2xl ${accent.medium} ${accent.text} flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg ${accent.glow}`}>
                  {reason.icon}
                </div>

                <div className="relative z-10">
                  <h4 className="text-xl font-bold text-white mb-3 group-hover:text-[#22c55e] transition-colors duration-300">
                    {reason.title}
                  </h4>
                  <p className="text-gray-500 leading-relaxed text-sm">
                    {reason.desc}
                  </p>
                </div>

                <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${accent.medium} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                  style={{
                    background: `linear-gradient(to right, transparent, ${accent.text.replace('text-', '')}, transparent)`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
