"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const services = [
  {
    icon: "🎓",
    title: "University Website",
    desc: "Campus portal, academic information, student registration, and modern education systems.",
    features: ["Akademik Portal", "Registrasi Online", "Info Jurusan", "E-Learning"],
  },
  {
    icon: "📚",
    title: "School Website",
    desc: "Modern school website with information, gallery, PPDB, and school news.",
    features: ["Profil Sekolah", "PPDB Online", "Galeri Kegiatan", "Berita & Artikel"],
  },
  {
    icon: "🏢",
    title: "Company Profile",
    desc: "Professional appearance to enhance your business branding and credibility.",
    features: ["Brand Identity", "Tim & Portofolio", "Layanan Detail", "Inquiry Form"],
  },
  {
    icon: "🏬",
    title: "Property Website",
    desc: "Property website for housing, apartments, real estate agents, and property listings.",
    features: ["List Properti", "Virtual Tour", "Booking Unit", "Agent Profile"],
  },
  {
    icon: "✈️",
    title: "Travel Website",
    desc: "Travel and tour website with tour packages and online booking.",
    features: ["Paket Wisata", "Booking Online", "Destinasi Gallery", "Testimonial"],
  },
  {
    icon: "🏥",
    title: "Clinic & Hospital",
    desc: "Healthcare information system, doctor schedules, and online patient services.",
    features: ["Jadwal Dokter", "Reservasi Online", "Rekam Medis", "Info Layanan"],
  },
  {
    icon: "🛒",
    title: "Online Store",
    desc: "Modern e-commerce website to sell products online.",
    features: ["Katalog Produk", "Payment Gateway", "Manajemen Stok", "Dashboard Admin"],
  },
  {
    icon: "🏨",
    title: "Hotel Website",
    desc: "Hotel and lodging website with online booking and reservation features.",
    features: ["Reservasi Kamar", "Menu Restoran", "Virtual Tour", "Fasilitas Hotel"],
  },
  {
    icon: "🍽️",
    title: "Restaurant & Cafe",
    desc: "Digital menu website, table reservations, and cafe or restaurant promotions.",
    features: ["Menu Digital", "Reservasi Meja", "Promo & Event", "Lokasi & Jam"],
  },
  {
    icon: "🏛️",
    title: "Government",
    desc: "Government agency information portal and digital public services.",
    features: ["Portal Informasi", "Layanan Publik", "Berita & Pengumuman", "Dokumen"],
  },
  {
    icon: "📰",
    title: "News Portal",
    desc: "Online media and news portal with complete category and article system.",
    features: ["Multi Kategori", "Artikel & Tag", "Multimedia", "Trending Topics"],
  },
  {
    icon: "💻",
    title: "Custom Web App",
    desc: "Dashboard systems, ERP, CRM, booking systems, and custom web-based applications.",
    features: ["Custom Fitur", "Dashboard Admin", "API Integration", "Scalable System"],
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
  { q: "Berapa lama proses pembuatan website?", a: "Tergantung kompleksitas. Landing page bisa selesai 3-5 hari, website multi-halaman 1-2 minggu, dan aplikasi custom 2-4 minggu." },
  { q: "Apakah domain dan hosting termasuk?", a: "Untuk paket Landing Page dan Starter UMKM, domain dan hosting gratis 1 tahun. Paket di atasnya bisa didiskusikan lebih lanjut." },
  { q: "Apakah website saya bisa diubah nanti?", a: "Tentu! Setiap paket termasuk revisi di awal. Untuk perubahan setelah launch, kami menyediakan layanan maintenance bulanan." },
  { q: "Saya tidak punya desain, apakah bisa?", a: "Bisa! Tim desain kami akan membuatkan desain profesional sesuai branding dan preferensi Anda. Anda tinggal memberikan referensi." },
  { q: "Bagaimana cara memulainya?", a: "Hubungi kami via WhatsApp untuk konsultasi gratis. Kami akan diskusikan kebutuhan, berikan quote, dan mulai pengerjaan setelah deal." },
  { q: "Apakah website saya akan SEO friendly?", a: "Ya, semua website yang kami buat dioptimasi untuk SEO — struktur HTML bersih, meta tags, kecepatan loading, dan responsive mobile." },
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
    <main className="bg-white min-h-screen">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="w-full h-full" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #111111 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white to-transparent z-[2] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="badge-premium mb-6 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] mr-1.5" />
            Layanan Kami
          </div>
          <h1 className="heading-xl mb-6">
            <span className="text-[#111111]">Solusi Website</span>
            <br />
            <span className="text-[#2563eb]">Untuk Semua Bisnis</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#666666] max-w-3xl mx-auto leading-relaxed">
            Dari landing page sederhana hingga aplikasi web kompleks — kami siap
            membantu Anda membangun kehadiran digital yang profesional dan efektif.
          </p>
        </div>
      </section>

      {/* ═══════════════ SERVICES GRID ═══════════════ */}
      <section className="observe-section section-padding bg-[#f8f8f8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <h2 className="heading-lg mb-4">
              Semua <span className="text-[#2563eb]">Layanan</span>
            </h2>
            <p className="body-lg max-w-2xl mx-auto">
              Berbagai jenis website yang bisa kami bangun untuk kebutuhan bisnis Anda.
            </p>
          </div>

          <div className="reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {services.map((service, i) => (
              <div key={i} className="card-premium p-5 hover-lift group">
                <span className="text-3xl mb-3 block">{service.icon}</span>
                <h4 className="text-base font-semibold text-[#111111] mb-2 group-hover:text-[#2563eb] transition-colors">
                  {service.title}
                </h4>
                <p className="text-xs text-[#666666] leading-relaxed mb-3 line-clamp-2">
                  {service.desc}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {service.features.map((f, fi) => (
                    <span key={fi} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#f8f8f8] text-[#666666] border border-[#eeeeee]">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PRICING ═══════════════ */}
      <section id="paket" className="observe-section section-padding bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <span className="badge-premium mb-4 inline-flex">Pricing</span>
            <h2 className="heading-lg mb-4">
              Paket <span className="text-[#2563eb]">Harga</span>
            </h2>
            <p className="body-lg max-w-2xl mx-auto">
              Harga transparan, tidak ada biaya tersembunyi. Pilih paket yang sesuai kebutuhan Anda.
            </p>
          </div>

          <div className="reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-start">
            {packages.map((pkg, i) => (
              <div
                key={i}
                className={`card-premium p-5 ${
                  pkg.isPopular ? "border-2 border-[#2563eb] relative" : ""
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#2563eb] text-white text-[10px] font-bold rounded-full whitespace-nowrap">
                    POPULER
                  </div>
                )}

                <div className={pkg.isPopular ? "mt-4" : ""}>
                  <h3 className="text-base font-semibold text-[#111111] mb-1">{pkg.name}</h3>
                  <div className="text-xl font-bold text-[#2563eb] mb-4">
                    {pkg.price}
                  </div>

                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2 text-xs text-[#666666]">
                        <svg className="w-3.5 h-3.5 text-[#2563eb] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        ? "bg-[#111111] text-white hover:bg-black active:scale-[0.98]"
                        : "bg-[#f8f8f8] text-[#111111] border border-[#eeeeee] hover:bg-[#eeeeee] active:scale-[0.98]"
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
      <section className="observe-section section-padding bg-[#f8f8f8]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <span className="badge-premium mb-4 inline-flex">FAQ</span>
            <h2 className="heading-lg mb-4">
              Pertanyaan <span className="text-[#2563eb]">Umum</span>
            </h2>
            <p className="body-lg max-w-2xl mx-auto">
              Jawaban untuk pertanyaan yang sering diajukan tentang layanan kami.
            </p>
          </div>

          <div className="reveal space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="group border border-[#eeeeee] rounded-xl overflow-hidden transition-all duration-300 hover:border-[#dddddd]">
                <summary className="flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer list-none bg-white hover:bg-[#f8f8f8] transition-colors">
                  <span className="text-sm sm:text-base font-medium text-[#111111] pr-4">{faq.q}</span>
                  <svg className="w-5 h-5 flex-shrink-0 text-[#2563eb] transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 bg-white">
                  <p className="text-sm text-[#666666] leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="observe-section section-padding bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="reveal max-w-3xl mx-auto text-center p-10 rounded-3xl bg-[#f8f8f8] border border-[#eeeeee]">
            <h2 className="heading-lg mb-4">
              Konsultasi <span className="text-[#2563eb]">Gratis</span>
            </h2>
            <p className="text-[#666666] mb-6 max-w-lg mx-auto">
              Tidak yakin paket mana yang cocok? Hubungi kami untuk konsultasi gratis.
            </p>
            <a
              href="https://wa.me/6282210099969"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Konsultasi Sekarang
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
