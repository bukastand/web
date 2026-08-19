"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

interface PricingItem {
  name: string;
  features: string[];
  is_popular: boolean;
}

const defaultPackages: PricingItem[] = [
  { name: "Landing Page", features: ["1 Professional Page","Mobile Responsive","WhatsApp Button","Basic Copywriting","Fast Loading","Basic SEO","Free Domain 1 Year","2x Revisions"], is_popular: false },
  { name: "Starter UMKM", features: ["1–5 Pages","Mobile Responsive","WhatsApp Chat","Google Maps","Basic SEO","Free Domain 1 Year","Free Hosting 1 Year","2x Revisions"], is_popular: false },
  { name: "Business Pro", features: ["All Starter Features","Semi Custom Design","SEO Optimization","Blog / Articles","Speed Optimization","Admin Training","Website Backup","4x Revisions"], is_popular: true },
  { name: "Premium Custom", features: ["UI/UX Full Custom","Admin Dashboard","Member Login","Payment Gateway","API Integration","Advanced Security","Priority Support","3 Months Maintenance"], is_popular: false },
  { name: "Android & iOS App", features: ["Android & iOS App","Modern UI/UX","User Login","Push Notification","API Integration","Admin Dashboard","1 Month Maintenance","Full Source Code"], is_popular: false },
];

export default function PricingSection() {
  const [packages, setPackages] = useState<PricingItem[]>(defaultPackages);
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    supabase
      .from("pricing")
      .select("name, features, is_popular")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setPackages(
            data.map((p) => ({
              name: p.name,
              features: Array.isArray(p.features) ? p.features : JSON.parse(p.features as string),
              is_popular: p.is_popular,
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
              setTimeout(() => card.classList.add("visible"), i * 100);
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
    <section id="paket" ref={sectionRef} className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <span className="badge-premium mb-4 inline-flex">Packages</span>
          <h2 className="heading-lg mb-4">
            {t("pricing.heading")} <span className="text-[#2563eb]">{t("pricing.heading_highlight")}</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">{t("pricing.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-stretch">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`reveal card-premium p-6 flex flex-col ${
                pkg.is_popular
                  ? "border-2 border-[#2563eb] relative"
                  : ""
              }`}
            >
              {pkg.is_popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#2563eb] text-white text-xs font-bold rounded-full whitespace-nowrap">
                  Popular
                </div>
              )}

              <div className={`flex flex-col h-full ${pkg.is_popular ? "mt-2" : ""}`}>
                <h3 className="text-lg font-semibold text-[#111111] mb-5">{t(pkg.name)}</h3>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {pkg.features.map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-2.5 text-sm text-[#666666]">
                      <svg className="w-4 h-4 text-[#2563eb] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{t(feature)}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="https://wa.me/6282210099969"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block text-center py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    pkg.is_popular
                      ? "bg-[#111111] text-white hover:bg-black hover:shadow-lg active:scale-[0.98]"
                      : "bg-[#f8f8f8] text-[#111111] border border-[#eeeeee] hover:bg-[#eeeeee] active:scale-[0.98]"
                  }`}
                >
                  {t("pricing.consult")}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}