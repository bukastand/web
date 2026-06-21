"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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
              setTimeout(() => el.classList.add("visible"), i * 100);
            });
          }
        });
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="relative py-24 sm:py-32 bg-[#0f172a] overflow-hidden"
    >
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#22c55e]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative container mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {t("faq.heading")}{" "}
            <span className="gradient-text">{t("faq.heading_highlight")}</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {t("faq.subtitle")}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {[1, 2, 3, 4, 5, 6].map((num, index) => (
            <div
              key={index}
              className="reveal rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-300 hover:border-[#22c55e]/20"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left transition-colors duration-200"
              >
                <span className="text-sm sm:text-base font-semibold text-white pr-4">
                  {t(`faq.q${num}`)}
                </span>
                <svg
                  className={`w-5 h-5 flex-shrink-0 text-[#22c55e] transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-gray-400 leading-relaxed">
                  {t(`faq.a${num}`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
