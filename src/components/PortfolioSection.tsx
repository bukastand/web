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
  { title: "SMA Nusantara", category: "Website Sekolah", gradient: "from-blue-50 to-blue-100", description: "Website sekolah lengkap dengan sistem PPDB online, info akademik, dan galeri kegiatan." },
  { title: "GreenHill Residence", category: "Website Property", gradient: "from-cyan-50 to-cyan-100", description: "Landing page modern untuk perumahan dengan virtual tour 3D dan booking unit online." },
  { title: "WarungBahagia", category: "Toko Online", gradient: "from-amber-50 to-amber-100", description: "E-commerce dengan payment gateway, manajemen stok, dan dashboard admin lengkap." },
  { title: "Klinik Sehati", category: "Klinik & RS", gradient: "from-sky-50 to-sky-100", description: "Sistem reservasi online, jadwal dokter, dan rekam medis pasien terintegrasi." },
  { title: "Java Adventure", category: "Website Travel", gradient: "from-indigo-50 to-indigo-100", description: "Portal travel dengan paket wisata, booking online, dan galeri destinasi interaktif." },
  { title: "Hotel Grand Palace", category: "Website Hotel", gradient: "from-rose-50 to-rose-100", description: "Website hotel dengan fitur reservasi kamar, menu restoran, dan virtual tour." },
  { title: "BeritaKota", category: "Portal Berita", gradient: "from-gray-50 to-gray-100", description: "Portal berita modern dengan sistem kategori, tag, dan artikel multimedia." },
  { title: "TechBiz Solutions", category: "Company Profile", gradient: "from-emerald-50 to-emerald-100", description: "Company profile interaktif dengan portfolio digital, tim, dan fitur inquiry." },
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

  const getProjectSlug = (title: string) => slugify(title);

  return (
    <section id="portfolio" ref={sectionRef} className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 reveal">
          <span className="badge-premium mb-4 inline-flex">Portfolio</span>
          <h2 className="heading-lg mb-4">
            Portfolio <span className="text-[#2563eb]">Kami</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Beberapa project yang telah kami kerjakan untuk berbagai klien
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12 reveal">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-[#111111] text-white"
                  : "bg-[#f8f8f8] text-[#666666] border border-[#eeeeee] hover:bg-[#eeeeee] hover:text-[#111111]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project, index) => (
            <Link
              href={`/projects/${getProjectSlug(project.title)}`}
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
                  <span className="text-[#111111] text-sm font-semibold px-4 py-2 bg-white/90 rounded-lg backdrop-blur-sm">
                    Lihat Detail
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
            </Link>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 text-[#999999]">
            <p className="text-lg">Belum ada project di kategori ini</p>
          </div>
        )}

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
