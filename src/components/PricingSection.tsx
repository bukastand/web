"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

interface PricingItem {
  name: string;
  price: string;
  features: string[];
  is_popular: boolean;
}

const defaultPackages: PricingItem[] = [
  { name: "Landing Page", price: "Rp1.2 Million", features: ["1 Professional Page","Mobile Responsive","WhatsApp Button","Basic Copywriting","Fast Loading","Basic SEO","Free Domain 1 Year","2x Revisions"], is_popular: false },
  { name: "Starter UMKM", price: "Rp2 Million", features: ["1–5 Pages","Mobile Responsive","WhatsApp Chat","Google Maps","Basic SEO","Free Domain 1 Year","Free Hosting 1 Year","2x Revisions"], is_popular: false },
  { name: "Business Pro", price: "Rp5 Million", features: ["All Starter Features","Semi Custom Design","SEO Optimization","Blog / Articles","Speed Optimization","Admin Training","Website Backup","4x Revisions"], is_popular: true },
  { name: "Premium Custom", price: "From Rp10 Million", features: ["UI/UX Full Custom","Admin Dashboard","Member Login","Payment Gateway","API Integration","Advanced Security","Priority Support","3 Months Maintenance"], is_popular: false },
  { name: "Android & iOS App", price: "From Rp15 Million", features: ["Android & iOS App","Modern UI/UX","User Login","Push Notification","API Integration","Admin Dashboard","1 Month Maintenance","Full Source Code"], is_popular: false },
];

export default function PricingSection() {
  const [packages, setPackages] = useState<PricingItem[]>(defaultPackages);
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    supabase
      .from("pricing")
      .select("name, price, features, is_popular")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setPackages(
            data.map((p) => ({
              name: p.name,
              price: p.price,
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
            entry.target.classList.add("visible");
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
    <section
      id="paket"
      ref={sectionRef}
      className="relative py-24 sm:py-32 bg-[#0a0f1e] overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#22c55e]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative container mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {t("pricing.heading")} <span className="gradient-text">{t("pricing.heading_highlight")}</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {t("pricing.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 items-start">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`reveal group relative rounded-2xl p-5 sm:p-6 lg:p-7 transition-all duration-500 ${
                pkg.is_popular
                  ? "bg-gradient-to-b from-[#22c55e]/20 via-[#22c55e]/10 to-transparent border-2 border-[#22c55e] shadow-[0_0_30px_rgba(34,197,94,0.15)] hover:-translate-y-2"
                  : "bg-white/[0.03] border border-white/[0.06] hover:border-[#22c55e]/30 hover:bg-white/[0.06] hover:-translate-y-1"
              }`}
            >
              {pkg.is_popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#22c55e] text-white text-[10px] font-bold rounded-full whitespace-nowrap shadow-lg shadow-[#22c55e]/30">
                  {t("pricing.popular")}
                </div>
              )}

              <div className={pkg.is_popular ? "mt-4" : ""}>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                  {pkg.name}
                </h3>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#22c55e] mb-5">
                  {pkg.price}
                </div>

                <ul className="space-y-2.5 mb-6 sm:mb-8">
                  {pkg.features.map((feature, fi) => (
                    <li
                      key={fi}
                      className="flex items-start gap-2.5 text-sm text-gray-400"
                    >
                      <svg className="w-4 h-4 text-[#22c55e] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="https://wa.me/6282210099969"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block text-center py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    pkg.is_popular
                      ? "bg-[#22c55e] text-white hover:bg-[#16a34a] hover:shadow-lg hover:shadow-[#22c55e]/25 active:scale-95"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/10 active:scale-95"
                  }`}
                >
                  {t("pricing.order")}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
