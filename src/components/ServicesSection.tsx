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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { t, locale } = useTranslation();
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
            entry.target.classList.add("visible");
            const items = entry.target.querySelectorAll(".reveal");
            items.forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 40);
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
      className="relative py-24 sm:py-32 bg-[#0a0f1e] overflow-hidden"
    >
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#22c55e]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative container mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {t("services.heading")}{" "}
            <span className="gradient-text">{t("services.heading_highlight")}</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {t("services.subtitle")}
          </p>
        </div>

        {/* ── Compact Icon Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="reveal group relative"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onClick={() => setActiveIndex(activeIndex === index ? null : index)}
            >
              {/* Card */}
              <div
                className={`relative flex flex-col items-center text-center p-4 rounded-xl cursor-default transition-all duration-300 ${
                  activeIndex === index
                    ? "bg-[#22c55e]/10 border-[#22c55e]/40 scale-105"
                    : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/20"
                } border`}
              >
                <span className={`text-2xl mb-2 transition-transform duration-300 ${
                  activeIndex === index ? "scale-110" : ""
                }`}>
                  {service.icon}
                </span>
                <span className={`text-xs font-semibold leading-tight transition-colors duration-300 ${
                  activeIndex === index ? "text-[#22c55e]" : "text-gray-300"
                }`}>
                  {t(`services.item${index + 1}_title`)}
                </span>
              </div>

              {/* ── Tooltip on hover/tap ── */}
              <div
                className={`absolute z-20 left-1/2 -translate-x-1/2 top-full mt-2 w-56 p-3 rounded-xl bg-[#1a2332] border border-white/10 shadow-xl shadow-black/40 transition-all duration-200 ${
                  activeIndex === index
                    ? "opacity-100 visible"
                    : "opacity-0 invisible pointer-events-none"
                }`}
              >
                <p className="text-xs text-gray-300 leading-relaxed">
                  {t(`services.item${index + 1}_desc`)}
                </p>
                {/* Arrow */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-3 h-3 bg-[#1a2332] border-l border-t border-white/10 rotate-45 mb-[6px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
