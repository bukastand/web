"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const steps = [
  {
    num: "01",
    title: "Konsultasi",
    desc: "Diskusi kebutuhan & tujuan project Anda secara detail.",
  },
  {
    num: "02",
    title: "Desain",
    desc: "Pembuatan mockup & konsep visual sesuai branding.",
  },
  {
    num: "03",
    title: "Development",
    desc: "Coding & integrasi fitur dengan teknologi modern.",
  },
  {
    num: "04",
    title: "Launch",
    desc: "Deploy, testing, dan go live!",
  },
];

export default function ProcessSection() {
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
          <span className="badge-premium mb-4 inline-flex">Process</span>
          <h2 className="heading-lg mb-4">
            {t("process.heading")}{" "}
            <span className="text-[#2563eb]">{t("process.heading_highlight")}</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">{t("process.subtitle")}</p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Timeline line */}
          <div className="hidden lg:block absolute top-12 left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-[1px] bg-[#eeeeee] pointer-events-none" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, i) => (
              <div key={i} className="reveal group relative flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#f8f8f8] border-2 border-[#eeeeee] flex items-center justify-center group-hover:border-[#2563eb] group-hover:bg-white group-hover:shadow-[0_0_0_8px_rgba(37,99,235,0.08)] transition-all duration-500">
                    <span className="text-lg font-bold text-[#2563eb]">{step.num}</span>
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-[#111111] mb-3 group-hover:text-[#2563eb] transition-colors">
                  {t(`process.step${i + 1}_title`)}
                </h4>
                <p className="text-sm text-[#666666] leading-relaxed max-w-[240px]">
                  {t(`process.step${i + 1}_desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal text-center mt-14">
          <a
            href="https://wa.me/6282210099969"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#111111] text-white font-semibold rounded-xl text-lg transition-all duration-300 hover:bg-black hover:scale-[1.02] hover:shadow-lg"
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