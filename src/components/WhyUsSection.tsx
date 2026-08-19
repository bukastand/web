"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

interface WhyUsItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const iconSvg: Record<string, React.ReactNode> = {
  image: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  smartphone: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  zap: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  settings: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const defaultWhyUs: WhyUsItem[] = [
  { icon: iconSvg.image, title: "Modern Design", desc: "Elegant and professional appearance to increase customer trust." },
  { icon: iconSvg.smartphone, title: "Mobile Friendly", desc: "Websites display optimally on phones, tablets, and desktops." },
  { icon: iconSvg.zap, title: "Fast Loading", desc: "Lightweight and fast-loading websites for a better user experience." },
  { icon: iconSvg.settings, title: "Quick Support", desc: "We're ready to help with any issues or website updates." },
];

export default function WhyUsSection() {
  const [reasons, setReasons] = useState<WhyUsItem[]>(defaultWhyUs);
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    supabase
      .from("why_us")
      .select("title, description, icon_name")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setReasons(
            data.map((r) => ({
              icon: iconSvg[r.icon_name] || iconSvg.image,
              title: r.title,
              desc: r.description,
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
    <section ref={sectionRef} className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <span className="badge-premium mb-4 inline-flex">Why Us</span>
          <h2 className="heading-lg mb-4">
            {t("whyus.heading")}{" "}
            <span className="text-[#2563eb]">{t("whyus.heading_highlight")}</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">{t("whyus.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="reveal card-premium p-8 hover-lift group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 h-full w-1 bg-[#2563eb] origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500" />
              <div className="w-[52px] h-[52px] rounded-xl bg-[#f8f8f8] border border-[#eeeeee] flex items-center justify-center text-[#666666] group-hover:text-[#2563eb] group-hover:border-[#2563eb]/30 mb-6 transition-all duration-300">
                {reason.icon}
              </div>
              <h4 className="text-xl font-semibold text-[#111111] mb-3 group-hover:text-[#2563eb] transition-colors">
                {reason.title}
              </h4>
              <p className="text-sm text-[#666666] leading-relaxed">
                {reason.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}