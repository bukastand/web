"use client";

import { useEffect, useRef } from "react";

const testimonials = [
  {
    quote: "Website kami selesai tepat waktu dan hasilnya melebihi ekspektasi. Penjualan online meningkat signifikan setelah website baru diluncurkan.",
    name: "James Clarke",
    role: "Owner, Shop The Paws",
    result: "300%",
    resultLabel: "Peningkatan Revenue",
    initial: "JC",
  },
  {
    quote: "Pelayanan sangat profesional. Tim PAGODA STUDIO benar-benar paham apa yang kami butuhkan untuk website perusahaan.",
    name: "Sarah Wijaya",
    role: "CEO, TechBiz Solutions",
    result: "20%",
    resultLabel: "Kenaikan Session Duration",
    initial: "SW",
  },
  {
    quote: "Mulai dari konsultasi sampai launch, semuanya berjalan lancar. Website kami sekarang tampil lebih modern dan profesional.",
    name: "Budi Santoso",
    role: "Direktur, GreenHill Residence",
    result: "150+",
    resultLabel: "Lead per Bulan",
    initial: "BS",
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            const items = entry.target.querySelectorAll(".reveal");
            items.forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 150);
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
      className="relative py-24 sm:py-32 bg-[#0a0f1e] overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#22c55e]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative container mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Hasil Nyata dari{" "}
            <span className="gradient-text">Klien Kami</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Kepuasan klien adalah prioritas utama kami
          </p>
        </div>

        {/* Stats row */}
        <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { value: "50+", label: "Project Terselesaikan" },
            { value: "98%", label: "Klien Puas" },
            { value: "2+ Tahun", label: "Pengalaman" },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
            >
              <div className="text-4xl md:text-5xl font-extrabold text-[#22c55e] mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="reveal group relative p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-[#22c55e]/30 transition-all duration-500 hover:bg-white/[0.06]"
            >
              {/* Quote icon */}
              <svg
                className="w-10 h-10 text-[#22c55e]/20 mb-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
              </svg>

              {/* Quote */}
              <p className="text-gray-400 leading-relaxed mb-6 text-sm">
                &ldquo;{item.quote}&rdquo;
              </p>

              {/* Result highlight */}
              <div className="mb-6 p-3 rounded-xl bg-[#22c55e]/5 border border-[#22c55e]/10">
                <div className="text-xl font-extrabold text-[#22c55e]">{item.result}</div>
                <div className="text-[11px] text-gray-500 uppercase tracking-wider">{item.resultLabel}</div>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#22c55e]/20 flex items-center justify-center text-xs font-bold text-[#22c55e]">
                  {item.initial}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
