"use client";

import { useEffect, useRef } from "react";

interface PortfolioItem {
  title: string;
  category: string;
  description: string;
  gradient: string;
  url: string;
}

const projects: PortfolioItem[] = [
  {
    title: "Aplikasi Laundry",
    category: "Aplikasi Laundry",
    description: "Aplikasi pengelolaan bisnis laundry — kelola order, pelanggan, layanan, dan laporan penjualan dalam satu sistem yang mudah digunakan.",
    gradient: "from-sky-50 to-sky-100",
    url: "https://www.londrihub.my.id/",
  },
  {
    title: "Aplikasi KDS Restoran & Cafe",
    category: "Aplikasi Restoran",
    description: "Kitchen Display System untuk restoran dan cafe — pesanan dapur tampil otomatis, antrean masak lebih teratur, dan layanan lebih cepat.",
    gradient: "from-emerald-50 to-emerald-100",
    url: "https://kulinerin-ecru.vercel.app/",
  },
];

export default function PortfolioSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll(".reveal");
            cards.forEach((card, i) => {
              setTimeout(() => card.classList.add("visible"), i * 80);
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
    <section id="portfolio" ref={sectionRef} className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 reveal">
          <span className="badge-premium mb-4 inline-flex">Portfolio</span>
          <h2 className="heading-lg mb-4">
            Portfolio <span className="text-[#2563eb]">Kami</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Aplikasi yang telah kami bangun dan berjalan langsung untuk bisnis nyata
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {projects.map((project, index) => (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              key={index}
              aria-label={`Lihat detail ${project.title}`}
              className="reveal group card-premium overflow-hidden"
            >
              <div className={`relative h-48 bg-gradient-to-br ${project.gradient} flex items-center justify-center overflow-hidden`}>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/40 rounded-full" />
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/40 rounded-full" />

                <span className="absolute top-3 left-3 px-3 py-1 bg-white/80 backdrop-blur-sm text-[#666666] text-xs font-medium rounded-full border border-white">
                  {project.category}
                </span>

                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[#111111] text-sm font-semibold px-4 py-2 bg-white/90 rounded-lg backdrop-blur-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Kunjungi Aplikasi
                  </span>
                </div>

                <svg className="w-12 h-12 text-[#999999] group-hover:scale-110 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-[#111111] mb-2 group-hover:text-[#2563eb] transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-[#666666] leading-relaxed line-clamp-2">
                  {project.description}
                </p>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-12 reveal">
          <a
            href="https://wa.me/6282210099969"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex"
          >
            Mulai Project Juga
          </a>
        </div>
      </div>
    </section>
  );
}