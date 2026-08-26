"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import { ArrowRightIcon } from "@/lib/icons";

interface Service {
  title: string;
  description: string;
}

const defaultServices: Service[] = [
  { title: "University Website", description: "Campus portal, academic information, student registration, and modern education systems." },
  { title: "School Website", description: "Modern school website with information, gallery, PPDB, and school news." },
  { title: "Property Website", description: "Property website for housing, apartments, real estate agents, and property listings." },
  { title: "Company Profile", description: "Professional appearance to enhance your business branding and credibility." },
  { title: "Travel Website", description: "Travel and tour website with tour packages and online booking." },
  { title: "Clinic & Hospital", description: "Healthcare information system, doctor schedules, and online patient services." },
  { title: "Online Store", description: "Modern e-commerce website to sell products online." },
  { title: "Hotel Website", description: "Hotel and lodging website with online booking and reservation features." },
  { title: "Restaurant & Cafe", description: "Digital menu website, table reservations, and cafe or restaurant promotions." },
  { title: "Government", description: "Government agency information portal and digital public services." },
  { title: "News Portal", description: "Online media and news portal with complete category and article system." },
  { title: "Custom Web App", description: "Dashboard systems, ERP, CRM, booking systems, and custom web-based applications." },
];

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>(defaultServices);
  const { t } = useTranslation();

  useEffect(() => {
    supabase
      .from("services")
      .select("title, description")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setServices(
            data.map((s) => ({
              title: s.title,
              description: s.description,
            }))
          );
        }
      });
  }, []);

  return (
    <section id="layanan" className="section-padding bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.7fr] gap-12 lg:gap-20">
          {/* Sticky intro */}
          <div className="lg:sticky lg:top-32 self-start">
            <SectionHeading
              index="01"
              eyebrow="Layanan"
              title={
                <>
                  {t("services.heading")}{" "}
                  <span className="text-muted">{t("services.heading_highlight")}</span>
                </>
              }
              description={t("services.subtitle")}
            />
            <Reveal delay={0.15}>
              <a
                href="https://wa.me/6282210099969"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 mt-8 text-sm font-semibold text-accent"
              >
                Diskusikan kebutuhan Anda
                <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Reveal>
          </div>

          {/* Service list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12">
            {services.map((service, index) => (
              <Reveal key={index} delay={Math.min(index % 6, 5) * 0.05} y={16}>
                <div className="group border-t border-line py-6 sm:py-7">
                  <div className="flex items-baseline gap-3 mb-1.5">
                    <span className="font-mono text-xs text-faint tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-base font-semibold text-ink transition-colors duration-300 group-hover:text-accent">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted leading-relaxed pl-7 text-pretty">
                    {service.description}
                  </p>
                </div>
              </Reveal>
            ))}
            <div className="border-t border-line" />
            <div className="border-t border-line hidden sm:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
