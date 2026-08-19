"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const initials = [
  { chars: "JC", bg: "bg-[#dbeafe] text-[#1d4ed8]" },
  { chars: "SW", bg: "bg-[#fce7f3] text-[#be185d]" },
  { chars: "BS", bg: "bg-[#d1fae5] text-[#047857]" },
];

export default function TestimonialsSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll(".reveal");
            items.forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 150);
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
    <section ref={sectionRef} className="section-padding bg-[#f8f8f8]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <span className="badge-premium mb-4 inline-flex">Testimonials</span>
          <h2 className="heading-lg mb-4">
            {t("testimonials.heading")}{" "}
            <span className="text-[#2563eb]">{t("testimonials.heading_highlight")}</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">{t("testimonials.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((num, index) => (
            <div key={index} className="reveal card-premium p-8 hover-lift flex flex-col">
              <svg className="w-8 h-8 text-[#2563eb]/20 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11 7H6a2 2 0 00-2 2v4a2 2 0 002 2h3v1a2 2 0 01-2 2H6v2h1a4 4 0 004-4V9a2 2 0 00-2-2zm10 0h-5a2 2 0 00-2 2v4a2 2 0 002 2h3v1a2 2 0 01-2 2h-1v2h1a4 4 0 004-4V9a2 2 0 00-2-2z" />
              </svg>

              <p className="text-[#666666] leading-relaxed mb-6 text-sm flex-1">
                &ldquo;{t(`testimonials.quote${num}`)}&rdquo;
              </p>

              <div className="mb-6 p-3 rounded-xl bg-[#f8f8f8] border border-[#eeeeee]">
                <div className="text-xl font-bold text-[#2563eb]">
                  {["300%", "20%", "150+"][index]}
                </div>
                <div className="text-xs text-[#999999] uppercase tracking-wider">
                  {t(`testimonials.result${num}`)}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-5 border-t border-[#eeeeee]">
                <div className={`w-10 h-10 rounded-full ${initials[index].bg} flex items-center justify-center text-xs font-bold`}>
                  {initials[index].chars}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#111111]">
                    {["James Clarke", "Sarah Wijaya", "Budi Santoso"][index]}
                  </div>
                  <div className="text-xs text-[#999999]">
                    {["Owner, Shop The Paws", "CEO, TechBiz Solutions", "Direktur, GreenHill Residence"][index]}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}