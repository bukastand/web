"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/projects-data";

interface PortfolioItem {
  title: string;
  category: string;
  description: string;
  gradient: string;
}

const defaultProjects: PortfolioItem[] = [
  { title: "SMA Nusantara", category: "Website Sekolah", gradient: "from-violet-600 to-purple-700", description: "Website sekolah lengkap dengan sistem PPDB online, info akademik, dan galeri kegiatan." },
  { title: "GreenHill Residence", category: "Website Property", gradient: "from-teal-500 to-cyan-600", description: "Landing page modern untuk perumahan dengan virtual tour 3D dan booking unit online." },
  { title: "WarungBahagia", category: "Toko Online", gradient: "from-violet-500 to-indigo-600", description: "E-commerce dengan payment gateway, manajemen stok, dan dashboard admin lengkap." },
  { title: "Klinik Sehati", category: "Klinik & RS", gradient: "from-teal-400 to-emerald-500", description: "Sistem reservasi online, jadwal dokter, dan rekam medis pasien terintegrasi." },
  { title: "Java Adventure", category: "Website Travel", gradient: "from-violet-600 to-pink-600", description: "Portal travel dengan paket wisata, booking online, dan galeri destinasi interaktif." },
  { title: "Hotel Grand Palace", category: "Website Hotel", gradient: "from-amber-500 to-orange-600", description: "Website hotel dengan fitur reservasi kamar, menu restoran, dan virtual tour." },
  { title: "BeritaKota", category: "Portal Berita", gradient: "from-violet-500 to-blue-600", description: "Portal berita modern dengan sistem kategori, tag, dan artikel multimedia." },
  { title: "TechBiz Solutions", category: "Company Profile", gradient: "from-teal-500 to-green-600", description: "Company profile interaktif dengan portfolio digital, tim, dan fitur inquiry." },
  { title: "SMA Harapan Bangsa", category: "Website Sekolah", gradient: "from-violet-600 to-purple-800", description: "Website sekolah dengan sistem informasi akademik dan e-learning terintegrasi." },
  { title: "Cafe Kopi Nusantara", category: "Restaurant & Cafe", gradient: "from-teal-600 to-emerald-700", description: "Website cafe dengan menu digital, reservasi, dan galeri suasana." },
  { title: "RS Sejahtera", category: "Klinik & RS", gradient: "from-violet-500 to-indigo-700", description: "Sistem informasi rumah sakit lengkap dengan pendaftaran online." },
  { title: "Traveloka Partner", category: "Website Travel", gradient: "from-teal-400 to-cyan-500", description: "Platform travel partner dengan manajemen paket wisata dan booking." },
];

const categories = [
  "Semua",
  "Website Sekolah",
  "Website Property",
  "Toko Online",
  "Klinik & RS",
  "Website Travel",
  "Website Hotel",
  "Portal Berita",
  "Company Profile",
  "Restaurant & Cafe",
];

export default function PortofolioPage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<PortfolioItem[]>(defaultProjects);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [visibleProjects, setVisibleProjects] = useState<number[]>([]);

  const filteredProjects =
    activeCategory === "Semua"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  useEffect(() => {
    supabase
      .from("portfolio")
      .select("title, category, description, gradient_from, gradient_to")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setProjects(
            data.map((p) => ({
              title: p.title,
              category: p.category,
              description: p.description,
              gradient: `from-${p.gradient_from} to-${p.gradient_to}`,
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

  useEffect(() => {
    setVisibleProjects([]);
    const timer = setTimeout(() => {
      filteredProjects.forEach((_, i) => {
        setTimeout(() => {
          setVisibleProjects((prev) => [...prev, i]);
        }, i * 60);
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  const getProjectSlug = (title: string) => slugify(title);

  return (
    <main className="bg-[#08080f] min-h-screen">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-[#a78bfa]/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-[#2dd4bf]/15 rounded-full blur-[150px] animate-pulse pointer-events-none" style={{ animationDelay: "1.5s" }} />
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(167,139,250,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#08080f] to-transparent z-[2] pointer-events-none" />

        <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#a78bfa]/30 bg-[#a78bfa]/10 text-[#a78bfa] text-sm font-medium mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#a78bfa] animate-pulse" />
            Portfolio
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[0.95] tracking-tight mb-6">
            <span className="text-white">Karya</span>
            <br />
            <span className="gradient-text">Terbaik Kami</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Berbagai project yang telah kami selesaikan untuk klien dari berbagai industri —
            dari sekolah, properti, hingga aplikasi custom.
          </p>
        </div>
      </section>

      {/* ═══════════════ PORTFOLIO GRID ═══════════════ */}
      <section className="observe-section relative py-16 sm:py-24">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#a78bfa]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#2dd4bf]/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative container mx-auto px-6">
          {/* Category Filter */}
          <div className="reveal flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] text-white shadow-lg shadow-[#a78bfa]/25"
                    : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Project Grid */}
          <div className="reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProjects.map((project, index) => (
              <Link
                href={`/projects/${getProjectSlug(project.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                key={index}
                aria-label={`Lihat detail ${project.title}`}
                className={`group relative rounded-2xl overflow-hidden border border-white/10 hover:border-[#a78bfa]/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#a78bfa]/10 ${
                  visibleProjects.includes(index) ? "opacity-100 translate-y-0" : ""
                }`}
                style={{
                  opacity: visibleProjects.includes(index) ? 1 : 0,
                  transform: visibleProjects.includes(index) ? "translateY(0)" : "translateY(40px)",
                  transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
                }}
              >
                {/* Project Image */}
                <div className={`relative h-48 bg-gradient-to-br ${project.gradient} flex items-center justify-center overflow-hidden`}>
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-lg" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white/20 rounded-full" />

                  <span className="absolute top-3 left-3 px-3 py-1 bg-black/40 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/10">
                    {project.category}
                  </span>

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold px-4 py-2 border border-white/30 rounded-lg backdrop-blur-sm bg-white/10">
                      Lihat Detail
                    </span>
                  </div>

                  <svg className="w-12 h-12 text-white/30 group-hover:scale-110 group-hover:text-white/50 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>

                {/* Info */}
                <div className="p-5 bg-[#0d0d1a]">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#a78bfa] transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#a78bfa]/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </Link>
            ))}
          </div>

          {/* Empty state */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-lg">Belum ada project di kategori ini</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="observe-section relative py-16">
        <div className="container mx-auto px-6">
          <div className="reveal max-w-3xl mx-auto text-center p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-[#a78bfa]/10 to-[#2dd4bf]/5 border border-[#a78bfa]/20 glow-violet">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ingin Project <span className="gradient-text">Seperti Ini?</span>
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Ceritakan kebutuhan website Anda, dan kami akan buatkan solusi terbaiknya.
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
              Mulai Project Juga
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
