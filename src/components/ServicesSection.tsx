"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

interface Service {
  icon: string;
  title: string;
  description: string;
}

const defaultServices: Service[] = [
  { icon: "🎓", title: "University Website", description: "Campus portal, academic information, student registration, and modern education systems." },
  { icon: "📚", title: "School Website", description: "Modern school website with information, gallery, PPDB, and school news." },
  { icon: "🏢", title: "Property Website", description: "Property website for housing, apartments, real estate agents, and property listings." },
  { icon: "🏬", title: "Company Profile", description: "Professional appearance to enhance your business branding and credibility." },
  { icon: "✈️", title: "Travel Website", description: "Travel and tour website with tour packages and online booking." },
  { icon: "🏥", title: "Clinic & Hospital", description: "Healthcare information system, doctor schedules, and online patient services." },
  { icon: "🛒", title: "Online Store", description: "Modern e-commerce website to sell products online." },
  { icon: "🏨", title: "Hotel Website", description: "Hotel and lodging website with online booking and reservation features." },
  { icon: "🍽️", title: "Restaurant & Cafe", description: "Digital menu website, table reservations, and cafe or restaurant promotions." },
  { icon: "🏛️", title: "Government", description: "Government agency information portal and digital public services." },
  { icon: "📰", title: "News Portal", description: "Online media and news portal with complete category and article system." },
  { icon: "💻", title: "Custom Web App", description: "Dashboard systems, ERP, CRM, booking systems, and custom web-based applications." },
];

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>(defaultServices);
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    supabase
      .from("services")
      .select("title, description, icon")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setServices(
            data.map((s) => ({
              icon: s.icon || "💻",
              title: s.title,
              description: s.description,
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
            const items = entry.target.querySelectorAll(".reveal");
            items.forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 60);
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
      id="layanan"
      ref={sectionRef}
      className="section-padding bg-[#f8f8f8]"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <span className="badge-premium mb-4 inline-flex">
            Layanan
          </span>
          <h2 className="heading-lg mb-4">
            {t("services.heading")}{" "}
            <span className="text-[#2563eb]">{t("services.heading_highlight")}</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            {t("services.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="reveal group card-premium p-5 text-center cursor-default"
            >
              <span className="text-2xl mb-3 block">{service.icon}</span>
              <span className="text-xs font-semibold text-[#666666] group-hover:text-[#111111] transition-colors leading-tight block">
                {t(`services.item${index + 1}_title`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
