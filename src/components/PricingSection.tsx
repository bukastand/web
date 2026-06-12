"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

interface PricingItem {
  name: string;
  price: string;
  features: string[];
  is_popular: boolean;
}

const defaultPackages: PricingItem[] = [
  { name: "Landing Page", price: "Rp1,2 Juta", features: ["1 Halaman Profesional","Mobile Responsive","Tombol WhatsApp","Copywriting Basic","Fast Loading","Basic SEO","Gratis Domain 1 Tahun","Revisi 2x"], is_popular: false },
  { name: "Starter UMKM", price: "Rp2 Juta", features: ["1–5 Halaman","Mobile Responsive","WhatsApp Chat","Google Maps","Basic SEO","Gratis Domain 1 Tahun","Gratis Hosting 1 Tahun","Revisi 2x"], is_popular: false },
  { name: "Business Pro", price: "Rp5 Juta", features: ["Semua Fitur Starter","Desain Semi Custom","SEO Optimasi","Blog / Artikel","Optimasi Speed","Training Admin","Backup Website","Revisi 4x"], is_popular: true },
  { name: "Premium Custom", price: "Mulai Rp10 Juta", features: ["UI/UX Full Custom","Dashboard Admin","Login Member","Payment Gateway","Integrasi API","Advanced Security","Priority Support","Maintenance 3 Bulan"], is_popular: false },
  { name: "Aplikasi Android & iOS", price: "Mulai Rp15 Juta", features: ["Aplikasi Android & iOS","UI/UX Modern","Login User","Push Notification","Integrasi API","Dashboard Admin","Maintenance 1 Bulan","Source Code Full"], is_popular: false },
];

export default function PricingSection() {
  const [packages, setPackages] = useState<PricingItem[]>(defaultPackages);
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
      className="relative py-24 sm:py-32 bg-[#0f172a]"
    >
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#22c55e]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative container mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Paket Harga <span className="gradient-text">Website</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Pilih paket sesuai kebutuhan bisnis Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-start">
          {packages.map((pkg, index) => (
            <div
              key={index}
            className={`reveal group relative rounded-2xl p-6 sm:p-8 transition-all duration-500 ${
              pkg.is_popular
                  ? "bg-gradient-to-b from-[#22c55e]/20 via-[#22c55e]/10 to-transparent border-2 border-[#22c55e] shadow-[0_0_30px_rgba(34,197,94,0.15)]"
                  : "bg-white/5 border border-white/10 hover:border-[#22c55e]/40 hover:bg-white/[0.07]"
              }`}
            >
              {pkg.is_popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#22c55e] text-white text-xs font-bold rounded-full whitespace-nowrap">
                  Paling Laris ⭐
                </div>
              )}

              <div className={`${pkg.is_popular ? "mt-4" : ""}`}>
                <h3 className="text-xl font-bold text-white mb-1">
                  {pkg.name}
                </h3>
                <div className="text-3xl font-extrabold text-[#22c55e] mb-6">
                  {pkg.price}
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, fi) => (
                    <li
                      key={fi}
                      className="flex items-start gap-3 text-sm text-gray-300"
                    >
                      <svg
                        className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href="https://wa.me/6282210099969"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block text-center py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    pkg.is_popular
                      ? "bg-[#22c55e] text-white hover:bg-[#16a34a] hover:shadow-lg hover:shadow-[#22c55e]/25"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                  }`}
                >
                  Pesan Sekarang
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
