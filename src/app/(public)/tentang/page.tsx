"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const values = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    label: "Design Modern",
    desc: "Setiap website dirancang dengan estetika terkini dan user experience terbaik.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    label: "Responsive",
    desc: "Tampil sempurna di semua perangkat — desktop, tablet, dan smartphone.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    label: "Fast & SEO",
    desc: "Kecepatan loading optimal dan struktur SEO-friendly untuk ranking lebih baik.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Support 24/7",
    desc: "Tim kami siap membantu kapanpun untuk maintenance dan update website.",
  },
];

const steps = [
  { num: "01", title: "Konsultasi", desc: "Kami diskusi kebutuhan, tujuan, dan target audiens website Anda secara detail." },
  { num: "02", title: "Desain", desc: "Tim kreatif kami merancang wireframe dan mockup sesuai branding Anda." },
  { num: "03", title: "Development", desc: "Kami membangun website dengan teknologi modern dan coding berkualitas tinggi." },
  { num: "04", title: "Launch", desc: "Website diuji, dioptimasi, dan diluncurkan ke publik dengan dukungan penuh." },
];

const stats = [
  { value: "50+", label: "Project Selesai" },
  { value: "30+", label: "Klien Puas" },
  { value: "12", label: "Bulan Pengalaman" },
  { value: "98%", label: "Kepuasan Klien" },
];

const team = [
  { name: "Tim Creative", role: "Design & UI/UX", initials: "TC" },
  { name: "Tim Developer", role: "Frontend & Backend", initials: "TD" },
  { name: "Tim Support", role: "Maintenance & Care", initials: "TS" },
];

export default function TentangPage() {
  const { t } = useTranslation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const reveals = entry.target.querySelectorAll(".reveal");
            reveals.forEach((el, i) => {
              setTimeout(() => (el as HTMLElement).classList.add("visible"), i * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    document.querySelectorAll(".observe-section").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="bg-white min-h-screen">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="w-full h-full" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #111111 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white to-transparent z-[2] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="badge-premium mb-6 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] mr-1.5" />
            PAGODA STUDIO
          </div>
          <h1 className="heading-xl mb-6">
            <span className="text-[#111111]">Kisah di Balik</span>
            <br />
            <span className="text-[#2563eb]">Setiap Website</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#666666] max-w-3xl mx-auto leading-relaxed">
            Kami adalah tim kreatif dan teknis yang percaya bahwa setiap bisnis berhak
            memiliki website profesional, modern, dan terjangkau.
          </p>
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section className="observe-section py-16 bg-[#f8f8f8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-white border border-[#eeeeee]">
                <div className="text-3xl md:text-4xl font-bold text-[#2563eb] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[#999999]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ STORY ═══════════════ */}
      <section className="observe-section section-padding bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="badge-premium mb-4 inline-flex">Our Story</span>
              <h2 className="heading-lg mb-6">
                Dari <span className="text-[#2563eb]">Payakumbuh</span> untuk Dunia
              </h2>
              <div className="space-y-4 text-[#666666] leading-relaxed">
                <p>
                  Berawal dari kecintaan terhadap teknologi dan desain, PAGODA STUDIO
                  lahir di Payakumbuh, Sumatera Barat. Kami melihat banyak UMKM dan bisnis
                  lokal yang ingin go-digital tapi terkendala biaya dan kurangnya akses ke
                  developer berkualitas.
                </p>
                <p>
                  Misi kami sederhana: menghadirkan website profesional dengan harga
                  terjangkau, tanpa mengorbankan kualitas. Setiap project adalah kebanggaan
                  — dari landing page simple hingga aplikasi web kompleks.
                </p>
                <p>
                  Dengan pengalaman menangani 50+ project dari berbagai industri (sekolah,
                  properti, travel, kuliner, kesehatan, dan lainnya), kami siap membantu
                  Anda membangun kehadiran digital yang impactful.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="relative p-8 rounded-3xl bg-[#f8f8f8] border border-[#eeeeee]">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: "🎨", label: "Design First" },
                    { icon: "⚡", label: "Fast Delivery" },
                    { icon: "🤝", label: "Client Focus" },
                    { icon: "📈", label: "Results Driven" },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white border border-[#eeeeee] text-center">
                      <span className="text-2xl mb-2 block">{item.icon}</span>
                      <span className="text-sm font-semibold text-[#111111]">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ VALUES / WHY US ═══════════════ */}
      <section className="observe-section section-padding bg-[#f8f8f8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <span className="badge-premium mb-4 inline-flex">Why Us</span>
            <h2 className="heading-lg mb-4">
              Kenapa Pilih <span className="text-[#2563eb]">Kami?</span>
            </h2>
            <p className="body-lg max-w-2xl mx-auto">
              Kami tidak hanya membuat website — kami membangun solusi digital yang tepat untuk bisnis Anda.
            </p>
          </div>

          <div className="reveal grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {values.map((val, i) => (
              <div key={i} className="card-premium p-6 sm:p-8 hover-lift group">
                <div className="w-12 h-12 rounded-xl bg-[#f8f8f8] border border-[#eeeeee] flex items-center justify-center text-[#2563eb] mb-5 group-hover:border-[#2563eb]/30 transition-all duration-300">
                  {val.icon}
                </div>
                <h4 className="text-xl font-semibold text-[#111111] mb-3 group-hover:text-[#2563eb] transition-colors">
                  {val.label}
                </h4>
                <p className="text-sm text-[#666666] leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PROCESS ═══════════════ */}
      <section className="observe-section section-padding bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <span className="badge-premium mb-4 inline-flex">Process</span>
            <h2 className="heading-lg mb-4">
              Cara Kami <span className="text-[#2563eb]">Bekerja</span>
            </h2>
            <p className="body-lg max-w-2xl mx-auto">
              Proses yang transparan dan terstruktur dari awal hingga website live.
            </p>
          </div>

          <div className="reveal relative max-w-5xl mx-auto">
            <div className="hidden lg:block absolute top-12 left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-[1px] bg-[#eeeeee] pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {steps.map((step, i) => (
                <div key={i} className="group relative flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full bg-[#f8f8f8] border-2 border-[#eeeeee] flex items-center justify-center group-hover:border-[#2563eb] group-hover:bg-white transition-all duration-500">
                      <span className="text-lg font-bold text-[#2563eb]">{step.num}</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-[#111111] mb-3 group-hover:text-[#2563eb] transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-sm text-[#666666] leading-relaxed max-w-[240px]">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ TEAM ═══════════════ */}
      <section className="observe-section section-padding bg-[#f8f8f8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <span className="badge-premium mb-4 inline-flex">Team</span>
            <h2 className="heading-lg mb-4">
              Tim <span className="text-[#2563eb]">Kami</span>
            </h2>
            <p className="body-lg max-w-2xl mx-auto">
              Orang-orang kreatif dan teknis di balik setiap website yang kami buat.
            </p>
          </div>

          <div className="reveal grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {team.map((member, i) => (
              <div key={i} className="card-premium p-8 text-center hover-lift group">
                <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-[#f8f8f8] border-2 border-[#eeeeee] flex items-center justify-center text-xl font-bold text-[#2563eb] group-hover:border-[#2563eb]/30 transition-all duration-300">
                  {member.initials}
                </div>
                <h4 className="text-lg font-semibold text-[#111111] mb-1">{member.name}</h4>
                <p className="text-sm text-[#666666]">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="observe-section section-padding bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="reveal max-w-3xl mx-auto text-center p-12 rounded-3xl bg-[#f8f8f8] border border-[#eeeeee]">
            <h2 className="heading-lg mb-4">
              Siap Membangun <span className="text-[#2563eb]">Website Impian?</span>
            </h2>
            <p className="text-[#666666] mb-8 max-w-xl mx-auto">
              Konsultasi gratis tanpa biaya. Ceritakan kebutuhan Anda, dan kami akan
              memberikan solusi terbaik.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://wa.me/6282210099969"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Konsultasi Gratis
              </a>
              <Link
                href="/portofolio"
                className="btn-secondary"
              >
                Lihat Portfolio
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
