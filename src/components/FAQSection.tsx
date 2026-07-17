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
    <section id="faq" ref={sectionRef} className="section-padding bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <span className="badge-premium mb-4 inline-flex">FAQ</span>
          <h2 className="heading-lg mb-4">
            {t("faq.heading")}{" "}
            <span className="text-[#2563eb]">{t("faq.heading_highlight")}</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">{t("faq.subtitle")}</p>
        </div>

        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((num, index) => (
            <div
              key={index}
              className="reveal border border-[#eeeeee] rounded-xl overflow-hidden transition-all duration-300 hover:border-[#dddddd]"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left transition-colors duration-200 bg-white hover:bg-[#f8f8f8]"
              >
                <span className="text-sm sm:text-base font-medium text-[#111111] pr-4">
                  {t(`faq.q${num}`)}
                </span>
                <svg
                  className={`w-5 h-5 flex-shrink-0 text-[#666666] transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-[#666666] leading-relaxed">
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
