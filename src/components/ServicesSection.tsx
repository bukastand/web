"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { resolveServiceIcon } from "@/lib/service-icons";

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
  const sectionRef = useRef<HTMLElement>(null);

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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="reveal group card-premium p-6 hover-lift"
            >
              <div className="w-11 h-11 rounded-xl bg-[#f8f8f8] border border-[#eeeeee] flex items-center justify-center text-[#666666] group-hover:text-[#2563eb] group-hover:border-[#2563eb]/30 mb-4 transition-all duration-300">
                {resolveServiceIcon(service.title)}
              </div>
              <span className="block text-sm font-semibold text-[#111111] group-hover:text-[#2563eb] transition-colors mb-1.5 leading-tight">
                {service.title}
              </span>
              <span className="block text-xs text-[#666666] leading-relaxed">
                {service.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}