"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

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
            <div key={index} className="reveal card-premium p-8 hover-lift">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, ri) => (
                  <svg key={ri} className="w-4 h-4 text-[#2563eb]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-[#666666] leading-relaxed mb-6 text-sm">
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

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f8f8f8] border border-[#eeeeee] flex items-center justify-center text-xs font-bold text-[#666666]">
                  {["JC", "SW", "BS"][index]}
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
