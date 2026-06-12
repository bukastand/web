"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Service {
  icon: string;
  title: string;
  description: string;
}

const defaultServices: Service[] = [
  { icon: "🎓", title: "Website Universitas", description: "Portal kampus, informasi akademik, pendaftaran mahasiswa, dan sistem pendidikan modern." },
  { icon: "📚", title: "Website Sekolah", description: "Website sekolah modern lengkap dengan informasi, galeri, PPDB, dan berita sekolah." },
  { icon: "🏢", title: "Website Property", description: "Website property untuk perumahan, apartemen, agen properti, dan listing rumah." },
  { icon: "🏬", title: "Company Profile", description: "Tampilan profesional untuk meningkatkan branding dan kepercayaan bisnis Anda." },
  { icon: "✈️", title: "Website Travel", description: "Website travel dan tour lengkap dengan paket wisata dan booking online." },
  { icon: "🏥", title: "Klinik & RS", description: "Sistem informasi kesehatan, jadwal dokter, dan layanan pasien online." },
  { icon: "🛒", title: "Toko Online", description: "Website e-commerce modern untuk menjual produk secara online." },
  { icon: "🏨", title: "Website Hotel", description: "Website hotel dan penginapan dengan fitur booking dan reservasi online." },
  { icon: "🍽️", title: "Restaurant & Cafe", description: "Website menu digital, reservasi meja, dan promosi cafe atau restaurant." },
  { icon: "🏛️", title: "Pemerintahan", description: "Portal informasi instansi pemerintahan dan pelayanan publik digital." },
  { icon: "📰", title: "Portal Berita", description: "Portal media online dan berita dengan sistem kategori dan artikel lengkap." },
  { icon: "💻", title: "Custom Web App", description: "Sistem dashboard, ERP, CRM, booking system, dan aplikasi berbasis web custom." },
];

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>(defaultServices);
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
            const cards = entry.target.querySelectorAll(".reveal");
            cards.forEach((card, i) => {
              setTimeout(() => card.classList.add("visible"), i * 60);
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
      ref={sectionRef}
      className="relative py-24 sm:py-32 bg-[#0a0f1e]"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#22c55e]/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative container mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Jenis Website Yang Kami{" "}
            <span className="gradient-text">Kerjakan</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Kami melayani berbagai kebutuhan website dan sistem digital
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {services.map((service, index) => (
            <div
              key={index}
              className="reveal group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#22c55e]/40 transition-all duration-500 hover:bg-white/[0.07] hover:-translate-y-1"
            >
              <div className="text-4xl mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                {service.icon}
              </div>
              <h4 className="text-lg font-bold text-white mb-2">
                {service.title}
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                {service.description}
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#22c55e]/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
