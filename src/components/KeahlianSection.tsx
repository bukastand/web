"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface KeahlianItem {
  title: string;
  desc: string;
  cta: string;
  href: string;
  external: boolean;
  icon: ReactNode;
}

const WA_LINK = "https://wa.me/6282210099969";

const keahlian: KeahlianItem[] = [
  {
    title: "Aplikasi Kasir (POS)",
    desc: "Sistem kasir modern untuk toko, kafe, dan bisnis retail — kelola transaksi, stok, dan laporan penjualan secara real-time.",
    cta: "Konsultasi",
    href: WA_LINK,
    external: true,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M5 6h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2zm1 10h2v2H6v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zM3 6l2-3h14l2 3" />
      </svg>
    ),
  },
  {
    title: "Aplikasi Laundry",
    desc: "Kelola order, pelanggan, layanan, dan laporan bisnis laundry Anda dalam satu aplikasi yang mudah digunakan.",
    cta: "Live Demo",
    href: "https://www.londrihub.my.id/",
    external: true,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 3h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2zm3 4h6m-6 7a3 3 0 006 0 3 3 0 00-6 0z" />
      </svg>
    ),
  },
  {
    title: "Aplikasi KDS Restoran & Cafe",
    desc: "Kitchen Display System untuk restoran dan cafe — pesanan dapur tampil otomatis, antrean masak lebih teratur dan cepat.",
    cta: "Live Demo",
    href: "https://kulinerin-ecru.vercel.app/",
    external: true,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function KeahlianSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll(".reveal");
            items.forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 80);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="keahlian" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <span className="badge-premium mb-4 inline-flex">Keahlian Kami</span>
          <h2 className="heading-lg mb-4">
            Aplikasi yang <span className="text-[#2563eb]">Kami Bangun</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Solusi aplikasi siap pakai untuk mengembangkan bisnis Anda — dari kasir hingga sistem dapur restoran.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {keahlian.map((item, i) => (
            <div key={i} className="reveal group card-premium p-8 hover-lift flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-[#f8f8f8] border border-[#eeeeee] flex items-center justify-center text-[#666666] group-hover:text-[#2563eb] group-hover:border-[#2563eb]/30 mb-5 transition-all duration-300">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-[#111111] mb-2.5 group-hover:text-[#2563eb] transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-[#666666] leading-relaxed mb-6 flex-1">
                {item.desc}
              </p>
              <a
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563eb] hover:gap-3 transition-all"
              >
                {item.cta}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}