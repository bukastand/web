"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import { CheckIcon } from "@/lib/icons";

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

  return (
    <section id="paket" className="section-padding bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          index="06"
          eyebrow="Paket"
          title={
            <>
              {t("pricing.heading")}{" "}
              <span className="text-muted">{t("pricing.heading_highlight")}</span>
            </>
          }
          description={t("pricing.subtitle")}
          className="mb-14"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4 items-stretch">
          {packages.map((pkg, index) => {
            const popular = pkg.is_popular;
            return (
              <Reveal
                key={index}
                delay={index * 0.07}
                y={20}
                className={popular ? "sm:col-span-2 xl:col-span-2" : "xl:col-span-1"}
              >
                <div
                  className={`h-full flex flex-col p-7 rounded-2xl transition-transform duration-300 hover:-translate-y-1 ${
                    popular
                      ? "bg-ink text-white shadow-[0_24px_48px_-16px_rgba(17,17,17,0.35)]"
                      : "bg-white border border-line"
                  }`}
                >
                  <div className="flex items-center justify-between mb-5 min-h-[28px]">
                    <h3 className={`text-lg font-semibold ${popular ? "text-white" : "text-ink"}`}>
                      {t(pkg.name)}
                    </h3>
                    {popular && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 rounded-md bg-accent text-white whitespace-nowrap">
                        {t("pricing.popular")}
                      </span>
                    )}
                  </div>

                  <ul className="space-y-2.5 mb-8 flex-1">
                    {pkg.features.map((feature, fi) => (
                      <li
                        key={fi}
                        className={`flex items-start gap-2.5 text-sm ${popular ? "text-white/70" : "text-muted"}`}
                      >
                        <CheckIcon
                          className={`w-4 h-4 flex-shrink-0 mt-0.5 ${popular ? "text-accent-light" : "text-accent"}`}
                          strokeWidth={2.5}
                        />
                        <span>{t(feature)}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="https://wa.me/6282210099969"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block text-center py-3 px-6 rounded-xl font-semibold transition-all duration-300 active:scale-[0.98] ${
                      popular
                        ? "bg-white text-ink hover:bg-accent-light"
                        : "bg-ink text-white hover:bg-black"
                    }`}
                  >
                    {t("pricing.consult")}
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>

        <p className="text-xs text-faint mt-8 text-center">
          Semua paket termasuk konsultasi gratis dan garansi perbaikan bug.
        </p>
      </div>
    </section>
  );
}
