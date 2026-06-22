"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const services = [
  {
    icon: "🎓",
    title: "University Website",
    desc: "Campus portal, academic information, student registration, and modern education systems.",
    features: ["Akademik Portal", "Registrasi Online", "Info Jurusan", "E-Learning"],
    gradient: "from-violet-500/20 to-purple-500/5",
    color: "text-violet-400",
  },
  {
    icon: "📚",
    title: "School Website",
    desc: "Modern school website with information, gallery, PPDB, and school news.",
    features: ["Profil Sekolah", "PPDB Online", "Galeri Kegiatan", "Berita & Artikel"],
    gradient: "from-violet-500/20 to-purple-500/5",
    color: "text-violet-400",
  },
  {
    icon: "🏢",
    title: "Company Profile",
    desc: "Professional appearance to enhance your business branding and credibility.",
    features: ["Brand Identity", "Tim & Portofolio", "Layanan Detail", "Inquiry Form"],
    gradient: "from-teal-400/20 to-cyan-500/5",
    color: "text-teal-400",
  },
  {
    icon: "🏬",
    title: "Property Website",
    desc: "Property website for housing, apartments, real estate agents, and property listings.",
    features: ["List Properti", "Virtual Tour", "Booking Unit", "Agent Profile"],
    gradient: "from-violet-500/20 to-purple-500/5",
    color: "text-violet-400",
  },
  {
    icon: "✈️",
    title: "Travel Website",
    desc: "Travel and tour website with tour packages and online booking.",
    features: ["Paket Wisata", "Booking Online", "Destinasi Gallery", "Testimonial"],
    gradient: "from-teal-400/20 to-cyan-500/5",
    color: "text-teal-400",
  },
  {
    icon: "🏥",
    title: "Clinic & Hospital",
    desc: "Healthcare information system, doctor schedules, and online patient services.",
    features: ["Jadwal Dokter", "Reservasi Online", "Rekam Medis", "Info Layanan"],
    gradient: "from-violet-500/20 to-purple-500/5",
    color: "text-violet-400",
  },
  {
    icon: "🛒",
    title: "Online Store",
    desc: "Modern e-commerce website to sell products online.",
    features: ["Katalog Produk", "Payment Gateway", "Manajemen Stok", "Dashboard Admin"],
    gradient: "from-teal-400/20 to-cyan-500/5",
    color: "text-teal-400",
  },
  {
    icon: "🏨",
    title: "Hotel Website",
    desc: "Hotel and lodging website with online booking and reservation features.",
    features: ["Reservasi Kamar", "Menu Restoran", "Virtual Tour", "Fasilitas Hotel"],
    gradient: "from-violet-500/20 to-purple-500/5",
    color: "text-violet-400",
  },
  {
    icon: "🍽️",
    title: "Restaurant & Cafe",
    desc: "Digital menu website, table reservations, and cafe or restaurant promotions.",
    features: ["Menu Digital", "Reservasi Meja", "Promo & Event", "Lokasi & Jam"],
    gradient: "from-teal-400/20 to-cyan-500/5",
    color: "text-teal-400",
  },
  {
    icon: "🏛️",
    title: "Government",
    desc: "Government agency information portal and digital public services.",
    features: ["Portal Informasi", "Layanan Publik", "Berita & Pengumuman", "Dokumen"],
    gradient: "from-violet-500/20 to-purple-500/5",
    color: "text-violet-400",
  },
  {
    icon: "📰",
    title: "News Portal",
    desc: "Online media and news portal with complete category and article system.",
    features: ["Multi Kategori", "Artikel & Tag", "Multimedia", "Trending Topics"],
    gradient: "from-teal-400/20 to-cyan-500/5",
    color: "text-teal-400",
  },
  {
    icon: "💻",
    title: "Custom Web App",
    desc: "Dashboard systems, ERP, CRM, booking systems, and custom web-based applications.",
    features: ["Custom Fitur", "Dashboard Admin", "API Integration", "Scalable System"],
    gradient: "from-violet-500/20 to-purple-500/5",
    color: "text-violet-400",
  },
];

const packages = [
  {
    name: "Landing Page",
    price: "Rp1,2 Juta",
    features: ["1 Halaman Profesional", "Mobile Responsive", "Tombol WhatsApp", "Copywriting Dasar", "Fast Loading", "SEO Dasar", "Free Domain 1 Tahun", "2x Revisi"],
    isPopular: false,
  },
  {
    name: "Starter UMKM",
    price: "Rp2 Juta",
    features: ["1–5 Halaman", "Mobile Responsive", "Chat WhatsApp", "Google Maps", "SEO Dasar", "Free Domain 1 Tahun", "Free Hosting 1 Tahun", "2x Revisi"],
    isPopular: false,
  },
  {
    name: "Business Pro",
    price: "Rp5 Juta",
    features: ["Semua Fitur Starter", "Semi Custom Design", "Optimasi SEO", "Blog / Artikel", "Speed Optimization", "Admin Training", "Backup Website", "4x Revisi"],
    isPopular: true,
  },
  {
    name: "Premium Custom",
    price: "Mulai Rp10 Juta",
    features: ["UI/UX Full Custom", "Admin Dashboard", "Member Login", "Payment Gateway", "API Integration", "Advanced Security", "Priority Support", "3 Mo Maintenance"],
    isPopular: false,
  },
  {
    name: "Aplikasi Mobile",
    price: "Mulai Rp15 Juta",
    features: ["Android & iOS App", "Modern UI/UX", "User Login", "Push Notification", "API Integration", "Admin Dashboard", "1 Mo Maintenance", "Full Source Code"],
    isPopular: false,
  },
];

const faqs = [
  {
    q: "Berapa lama proses pembuatan website?",
    a: "Tergantung kompleksitas. Landing page bisa selesai 3-5 hari, website multi-halaman 1-2 minggu, dan aplikasi custom 2-4 minggu.",
  },
  {
    q: "Apakah domain dan hosting termasuk?",
    a: "Untuk paket Landing Page dan Starter UMKM, domain dan hosting gratis 1 tahun. Paket di atasnya bisa didiskusikan lebih lanjut.",
  },
  {
    q: "Apakah website saya bisa diubah nanti?",
    a: "Tentu! Setiap paket termasuk revisi di awal. Untuk perubahan setelah launch, kami menyediakan layanan maintenance bulanan.",
  },
  {
    q: "Saya tidak punya desain, apakah bisa?",
    a: "Bisa! Tim desain kami akan membuatkan desain profesional sesuai branding dan preferensi Anda. Anda tinggal memberikan referensi.",
  },
  {
    q: "Bagaimana cara memulainya?",
    a: "Hubungi kami via WhatsApp untuk konsultasi gratis. Kami akan diskusikan kebutuhan, berikan quote, dan mulai pengerjaan setelah deal.",
  },
  {
    q: "Apakah website saya akan SEO friendly?",
    a: "Ya, semua website yang kami buat dioptimasi untuk SEO — struktur HTML bersih, meta tags, kecepatan loading, dan responsive mobile.",
  },
];

export default function LayananPage() {
  const { t } = useTranslation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const reveals = entry.target.querySelectorAll(".reveal");
            reveals.forEach((el, i) => {
              setTimeout(() => (el as HTMLElement).classList.add("visible"), i * 80);
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
    <main className="bg-[#08080f] min-h-screen">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-[#a78bfa]/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/3 -right-32 w-[600px] h-[600px] bg-[#2dd4bf]/15 rounded-full blur-[150px] animate-pulse pointer-events-none" style={{ animationDelay: "1.5s" }} />
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(167,139,250,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#08080f] to-transparent z-[2] pointer-events-none" />

        <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#a78bfa]/30 bg-[#a78bfa]/10 text-[#a78bfa] text-sm font-medium mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#a78bfa] animate-pulse" />
            Layanan Kami
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[0.95] tracking-tight mb-6">
            <span className="text-white">Solusi Website</span>
            <br />
            <span className="gradient-text">Untuk Semua Bisnis</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Dari landing page sederhana hingga aplikasi web kompleks — kami siap
            membantu Anda membangun kehadiran digital yang profesional dan efektif.
          </p>
        </div>
      </section>

      {/* ═══════════════ SERVICES GRID ═══════════════ */}
      <section className="observe-section relative py-20 sm:py-28">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#a78bfa]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#2dd4bf]/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative container mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Semua <span className="gradient-text">Layanan</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Berbagai jenis website yang bisa kami bangun untuk kebutuhan bisnis Anda.
            </p>
          </div>

          <div className="reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {services.map((service, i) => (
              <div
                key={i}
                className="group relative p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-[#a78bfa]/30 transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.04]"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                <div className="relative z-10">
                  <span className="text-3xl mb-3 block">{service.icon}</span>
                  <h4 className="text-base font-bold text-white mb-2 group-hover:text-[#a78bfa] transition-colors">
                    {service.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
                    {service.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {service.features.map((f, fi) => (
                      <span key={fi} className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${i % 2 === 0 ? "bg-[#a78bfa]/10 text-[#a78bfa]" : "bg-[#2dd4bf]/10 text-[#2dd4bf]"}`}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PRICING ═══════════════ */}
      <section id="paket" className="observe-section relative py-20 sm:py-28 bg-[#0d0d1a]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#a78bfa]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative container mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <span className="inline-block px-3 py-1 rounded-full bg-[#2dd4bf]/10 border border-[#2dd4bf]/20 text-[#2dd4bf] text-xs font-semibold mb-4">
              Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Paket <span className="gradient-text">Harga</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Harga transparan, tidak ada biaya tersembunyi. Pilih paket yang sesuai kebutuhan Anda.
            </p>
          </div>

          <div className="reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-start max-w-7xl mx-auto">
            {packages.map((pkg, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-5 transition-all duration-500 ${
                  pkg.isPopular
                    ? "bg-gradient-to-b from-[#a78bfa]/20 via-[#a78bfa]/10 to-transparent border-2 border-[#a78bfa] shadow-[0_0_30px_rgba(167,139,250,0.15)] hover:-translate-y-2"
                    : "glass-card hover:border-[#a78bfa]/30 hover:-translate-y-1"
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] text-white text-[10px] font-bold rounded-full whitespace-nowrap shadow-lg shadow-[#a78bfa]/30">
                    POPULER
                  </div>
                )}

                <div className={pkg.isPopular ? "mt-4" : ""}>
                  <h3 className="text-base font-bold text-white mb-1">{pkg.name}</h3>
                  <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-br from-[#a78bfa] to-[#2dd4bf] bg-clip-text text-transparent mb-4">
                    {pkg.price}
                  </div>

                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2 text-xs text-gray-400">
                        <svg className="w-3.5 h-3.5 text-[#a78bfa] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="https://wa.me/6282210099969"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      pkg.isPopular
                        ? "bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] text-white hover:from-[#7c3aed] hover:to-[#6d28d9] hover:shadow-lg hover:shadow-[#a78bfa]/25 active:scale-95"
                        : "bg-white/10 text-white hover:bg-white/20 border border-white/10 active:scale-95"
                    }`}
                  >
                    Pilih Paket
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="observe-section relative py-20 sm:py-28">
        <div className="absolute -top-40 right-0 w-[400px] h-[400px] bg-[#2dd4bf]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative container mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <span className="inline-block px-3 py-1 rounded-full bg-[#a78bfa]/10 border border-[#a78bfa]/20 text-[#a78bfa] text-xs font-semibold mb-4">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Pertanyaan <span className="gradient-text">Umum</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Jawaban untuk pertanyaan yang sering diajukan tentang layanan kami.
            </p>
          </div>

          <div className="reveal max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-300 hover:border-[#a78bfa]/20">
                <summary className="flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer list-none">
                  <span className="text-sm sm:text-base font-semibold text-white pr-4">{faq.q}</span>
                  <svg className="w-5 h-5 flex-shrink-0 text-[#a78bfa] transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                  <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="observe-section relative py-16">
        <div className="container mx-auto px-6">
          <div className="reveal max-w-3xl mx-auto text-center p-10 rounded-3xl bg-gradient-to-br from-[#a78bfa]/10 to-[#2dd4bf]/5 border border-[#a78bfa]/20 glow-violet">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Konsultasi <span className="gradient-text">Gratis</span>
            </h2>
            <p className="text-gray-400 mb-6 max-w-lg mx-auto">
              Tidak yakin paket mana yang cocok? Hubungi kami untuk konsultasi gratis.
            </p>
            <a
              href="https://wa.me/6282210099969"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] text-white font-bold rounded-xl transition-all duration-300 hover:from-[#7c3aed] hover:to-[#6d28d9] hover:scale-105 hover:shadow-lg hover:shadow-[#a78bfa]/25"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Konsultasi Sekarang
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
