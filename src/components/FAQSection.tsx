"use client";

import { useEffect, useRef, useState } from "react";

const faqs = [
  {
    q: "Berapa lama proses pembuatan website?",
    a: "Tergantung kompleksitas. Landing page bisa selesai dalam 3–5 hari, website company profile 1–2 minggu, dan website dengan fitur custom 2–4 minggu. Kami akan memberikan estimasi waktu yang jelas saat konsultasi.",
  },
  {
    q: "Apakah website saya akan mobile-friendly?",
    a: "Tentu! Semua website yang kami buat menggunakan teknologi responsive design, sehingga tampil sempurna di HP, tablet, laptop, maupun desktop. Mobile-friendly adalah standar, bukan fitur tambahan.",
  },
  {
    q: "Apakah saya bisa mengedit konten website sendiri?",
    a: "Ya. Setiap project disertai sesi training 2 jam gratis untuk menunjukkan cara mengedit teks, gambar, dan konten lainnya. Untuk perubahan besar, tim kami siap membantu.",
  },
  {
    q: "Berapa biaya pembuatan website?",
    a: "Biaya mulai dari Rp1,2 juta untuk landing page hingga Rp15 juta+ untuk aplikasi mobile. Setiap paket sudah termasuk domain, hosting, dan fitur lengkap. Lihat halaman Paket Harga untuk detailnya.",
  },
  {
    q: "Apakah domain dan hosting sudah termasuk?",
    a: "Untuk paket Landing Page, Starter UMKM, dan Business Pro, domain dan hosting GRATIS 1 tahun. Untuk pakel Premium dan Aplikasi, domain dan hosting bisa diatur sesuai kebutuhan.",
  },
  {
    q: "Bagaimana cara memesan?",
    a: "Cukup hubungi kami via WhatsApp. Kami akan diskusikan kebutuhan Anda, berikan proposal, dan setelah deal, proses pengerjaan dimulai. Mudah dan tanpa ribet.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            const items = entry.target.querySelectorAll(".reveal");
            items.forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 100);
            });
          }
        });
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="relative py-24 sm:py-32 bg-[#0f172a] overflow-hidden"
    >
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#22c55e]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative container mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Pertanyaan{" "}
            <span className="gradient-text">Umum</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Hal-hal yang sering ditanyakan tentang layanan kami
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="reveal rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-300 hover:border-[#22c55e]/20"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left transition-colors duration-200"
              >
                <span className="text-sm sm:text-base font-semibold text-white pr-4">
                  {faq.q}
                </span>
                <svg
                  className={`w-5 h-5 flex-shrink-0 text-[#22c55e] transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-gray-400 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
