"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const stepIcons = [
  (
    <svg key="1" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  ),
  (
    <svg key="2" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  (
    <svg key="3" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  (
    <svg key="4" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
    </svg>
  ),
  (
    <svg key="5" className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
];

export default function ProcessSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
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
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32 bg-[#0f172a] overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#22c55e]/[0.02] via-transparent to-transparent pointer-events-none" />

      <div className="relative container mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {t("process.heading")} <span className="gradient-text">{t("process.heading_highlight")}</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {t("process.subtitle")}
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-28 left-[calc(10%+36px)] right-[calc(10%+36px)] h-[2px] bg-gradient-to-r from-[#22c55e]/10 via-[#22c55e]/40 to-[#22c55e]/10 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {[1, 2, 3, 4, 5].map((num, index) => (
              <div key={num} className="reveal group relative flex flex-col items-center text-center">
                {/* Step circle */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e] group-hover:bg-[#22c55e] group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#22c55e]/25">
                    {stepIcons[index]}
                  </div>
                  {/* Number label */}
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#0f172a] border border-[#22c55e]/30 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-[#22c55e]">{"0" + num}</span>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#22c55e] transition-colors duration-300">
                  {t(`process.step${num}_title`)}
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed max-w-[240px]">
                  {t(`process.step${num}_desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="reveal reveal-delay-3 text-center mt-16">
          <a
            href="https://wa.me/6282210099969"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#22c55e] text-white font-bold rounded-xl text-lg transition-all duration-300 hover:bg-[#16a34a] hover:scale-105 hover:shadow-lg hover:shadow-[#22c55e]/25"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {t("process.cta")}
          </a>
        </div>
      </div>
    </section>
  );
}
