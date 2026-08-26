"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";

interface WhyUsItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const iconSvg: Record<string, React.ReactNode> = {
  image: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  smartphone: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  zap: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

  return (
    <section className="section-padding bg-white border-t border-line">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          index="03"
          eyebrow="Kenapa Kami"
          title={
            <>
              {t("whyus.heading")}{" "}
              <span className="text-muted">{t("whyus.heading_highlight")}</span>
            </>
          }
          description={t("whyus.subtitle")}
          className="mb-14"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-20 max-w-4xl">
          {reasons.map((reason, index) => (
            <Reveal key={index} delay={(index % 2) * 0.1} className={index % 2 === 1 ? "sm:mt-14" : ""}>
              <div className="border-t border-line pt-7 pb-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-accent">{reason.icon}</span>
                  <span className="font-mono text-xs text-faint tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-ink tracking-tight mb-3">
                  {reason.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed max-w-sm text-pretty">
                  {reason.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
