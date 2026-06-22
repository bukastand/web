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
  { title: "SMA Nusantara", category: "Website Sekolah", gradient: "from-emerald-600 to-teal-700", description: "Website sekolah lengkap dengan sistem PPDB online, info akademik, dan galeri kegiatan." },
  { title: "GreenHill Residence", category: "Website Property", gradient: "from-blue-600 to-cyan-700", description: "Landing page modern untuk perumahan dengan virtual tour 3D dan booking unit online." },
  { title: "WarungBahagia", category: "Toko Online", gradient: "from-orange-600 to-amber-700", description: "E-commerce dengan payment gateway, manajemen stok, dan dashboard admin lengkap." },
  { title: "Klinik Sehati", category: "Klinik & RS", gradient: "from-sky-600 to-indigo-700", description: "Sistem reservasi online, jadwal dokter, dan rekam medis pasien terintegrasi." },
  { title: "Java Adventure", category: "Website Travel", gradient: "from-violet-600 to-purple-700", description: "Portal travel dengan paket wisata, booking online, dan galeri destinasi interaktif." },
  { title: "Hotel Grand Palace", category: "Website Hotel", gradient: "from-rose-600 to-pink-700", description: "Website hotel dengan fitur reservasi kamar, menu restoran, dan virtual tour." },
  { title: "BeritaKota", category: "Portal Berita", gradient: "from-slate-600 to-gray-700", description: "Portal berita modern dengan sistem kategori, tag, dan artikel multimedia." },
  { title: "TechBiz Solutions", category: "Company Profile", gradient: "from-green-700 to-emerald-800", description: "Company profile interaktif dengan portfolio digital, tim, dan fitur inquiry." },
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
];

export default function PortfolioSection() {
  const sectionRef = useRef<HTMLElement>(null);
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
            entry.target.classList.add("visible");
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

  useEffect(() => {
    setVisibleProjects([]);
    const timer = setTimeout(() => {
      filteredProjects.forEach((_, i) => {
        setTimeout(() => {
          setVisibleProjects((prev) => [...prev, i]);
        }, i * 80);
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  const getProjectSlug = (title: string) => slugify(title);

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="relative py-24 sm:py-32 bg-[#0d0d1a]"
    >
      {/* Background gradient */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#a78bfa]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 reveal">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Portfolio <span className="gradient-text">Kami</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Beberapa project yang telah kami kerjakan untuk berbagai klien
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 reveal reveal-delay-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-[#a78bfa] text-white shadow-lg shadow-[#a78bfa]/25"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project, index) => (
            <Link
              href={`/projects/${getProjectSlug(project.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              key={index}
              aria-label={`Lihat detail ${project.title}`}
              className={`group relative rounded-2xl overflow-hidden border border-white/10 hover:border-[#a78bfa]/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#a78bfa]/10 ${
                visibleProjects.includes(index)
                  ? "opacity-100 translate-y-0"
                  : ""
              }`}
              style={{
                opacity: visibleProjects.includes(index) ? 1 : 0,
                transform: visibleProjects.includes(index)
                  ? "translateY(0)"
                  : "translateY(40px)",
                transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
              }}
            >
              {/* Project Image / Gradient Placeholder */}
              <div
                className={`relative h-48 bg-gradient-to-br ${project.gradient} flex items-center justify-center overflow-hidden`}
              >
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-lg" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white/20 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full" />

                {/* Category badge */}
                <span className="absolute top-3 left-3 px-3 py-1 bg-black/40 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/10">
                  {project.category}
                </span>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold px-4 py-2 border border-white/30 rounded-lg backdrop-blur-sm bg-white/10">
                    Lihat Detail
                  </span>
                </div>

                {/* Project icon placeholder */}
                <svg
                  className="w-12 h-12 text-white/30 group-hover:scale-110 group-hover:text-white/50 transition-all duration-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              {/* Project Info */}
              <div className="p-5 bg-[#08080f]">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#a78bfa] transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
                  {project.description}
                </p>
              </div>

              {/* Hover border bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#a78bfa]/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </Link>
          ))}
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <svg
              className="w-16 h-16 mx-auto mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p className="text-lg">Belum ada project di kategori ini</p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12 reveal reveal-delay-2">
          <a
            href="https://wa.me/6282210099969"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#a78bfa] text-white font-semibold rounded-xl text-lg transition-all duration-300 hover:bg-[#7c3aed] hover:scale-105 hover:shadow-lg hover:shadow-[#a78bfa]/25"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Mulai Project Juga
          </a>
        </div>
      </div>
    </section>
  );
}
