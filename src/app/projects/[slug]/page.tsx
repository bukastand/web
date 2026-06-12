"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useMemo, useState } from "react";
import Link from "next/link";
import { getProjectBySlug, getAllProjects } from "@/lib/projects-data";
import { supabase } from "@/lib/supabase";

// Dynamic import for Three.js components
const ThreeScene = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let animFrame: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", handleMouse);

    // Create floating orbs with CSS
    const orbs = Array.from({ length: 8 }, (_, i) => {
      const orb = document.createElement("div");
      orb.className = "absolute rounded-full pointer-events-none";
      const size = 60 + Math.random() * 120;
      orb.style.width = `${size}px`;
      orb.style.height = `${size}px`;
      orb.style.background = `radial-gradient(circle at 30% 30%, rgba(34,197,94,0.12), rgba(34,197,94,0.03) 60%, transparent)`;
      orb.style.left = `${Math.random() * 100}%`;
      orb.style.top = `${Math.random() * 100}%`;
      orb.style.animation = `float ${8 + Math.random() * 10}s ease-in-out infinite`;
      orb.style.animationDelay = `${Math.random() * 5}s`;
      orb.style.transform = `translate(-50%, -50%) scale(${0.5 + Math.random()})`;
      return orb;
    });
    orbs.forEach((o) => canvas.appendChild(o));

    // Mouse parallax effect
    const tick = () => {
      orbs.forEach((orb, i) => {
        const speed = 0.02 + i * 0.003;
        const mx = mouseRef.current.x * speed * 100;
        const my = mouseRef.current.y * speed * 100;
        orb.style.transform = `translate(calc(-50% + ${mx}px), calc(-50% + ${my}px)) scale(${0.5 + (i % 3) * 0.3})`;
      });
      animFrame = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      cancelAnimationFrame(animFrame);
      orbs.forEach((o) => o.remove());
    };
  }, []);

  return <div ref={canvasRef} className="absolute inset-0 overflow-hidden pointer-events-none" />;
};

export default function ProjectPage() {
  const params = useParams();
  const slug = params.slug as string;
  const project = getProjectBySlug(slug);
  const [heroData, setHeroData] = useState({ cta_link: "https://wa.me/6282210099969" });

  useEffect(() => {
    supabase.from("hero_content").select("cta_link").eq("id", 1).single().then(({ data }) => {
      if (data) setHeroData(data);
    });
  }, []);

  const otherProjects = useMemo(() => getAllProjects().filter((p) => p.slug !== slug).slice(0, 4), [slug]);

  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            const reveals = entry.target.querySelectorAll(".reveal-project");
            reveals.forEach((el, i) => {
              setTimeout(() => {
                (el as HTMLElement).classList.add("opacity-100", "translate-y-0");
              }, i * 100);
            });
          }
        });
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Project Tidak Ditemukan</h1>
          <Link href="/" className="text-[#22c55e] hover:underline">Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* 3D Background */}
        <ThreeScene />

        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-20`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute border border-white/10 rounded-full animate-pulse"
              style={{
                width: `${100 + i * 80}px`,
                height: `${100 + i * 80}px`,
                top: `${20 + i * 15}%`,
                right: `${10 + i * 8}%`,
                animationDuration: `${4 + i * 2}s`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 pt-24 pb-20">
          <div className="max-w-4xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 reveal-project opacity-0 translate-y-8 transition-all duration-700">
              <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
              <span>/</span>
              <Link href="/#portfolio" className="hover:text-white transition-colors">Portfolio</Link>
              <span>/</span>
              <span className="text-white">{project.title}</span>
            </div>

            {/* Category badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white text-sm mb-6 reveal-project opacity-0 translate-y-8 transition-all duration-700 delay-100">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
              {project.industry}
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white leading-tight mb-6 reveal-project opacity-0 translate-y-8 transition-all duration-700 delay-200">
              {project.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-300 max-w-2xl mb-10 reveal-project opacity-0 translate-y-8 transition-all duration-700 delay-300 leading-relaxed">
              {project.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 reveal-project opacity-0 translate-y-8 transition-all duration-700 delay-400">
              <a
                href={heroData.cta_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#22c55e] text-white font-semibold rounded-xl text-lg hover:bg-[#16a34a] transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#22c55e]/25"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Buat Project Serupa
              </a>
              <Link
                href="/#portfolio"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold rounded-xl text-lg hover:bg-white/10 hover:border-white/40 transition-all duration-300"
              >
                Lihat Portfolio Lain
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 reveal-project opacity-0 translate-y-8 transition-all duration-700 delay-500">
              {[
                { val: project.features.length + "+", label: "Fitur Unggulan" },
                { val: "Responsive", label: "Semua Perangkat" },
                { val: "SEO Ready", label: "Optimasi Google" },
                { val: "Fast", label: "Loading Cepat" },
              ].map((s, i) => (
                <div key={i} className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="text-2xl font-bold text-[#22c55e]">{s.val}</div>
                  <div className="text-sm text-gray-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce z-10">
          <span className="text-xs text-gray-500 tracking-widest uppercase">Scroll</span>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </div>
      </section>

      {/* ===== DETAIL SECTION ===== */}
      <section ref={sectionRef} className="relative py-24 bg-[#0a0f1e]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#22c55e]/[0.02] to-transparent" />

        <div className="relative container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="opacity-0 translate-y-8 transition-all duration-700">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                  Tentang Project Ini
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed mb-8">
                  {project.longDescription}
                </p>
              </div>

              {/* Features */}
              <div className="opacity-0 translate-y-8 transition-all duration-700 delay-100">
                <h3 className="text-2xl font-bold text-white mb-6">Fitur Unggulan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.features.map((feat, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#22c55e]/30 transition-all duration-300"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#22c55e]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-medium">{feat}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-6 opacity-0 translate-y-8 transition-all duration-700 delay-200">
                {/* Info Card */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">Informasi Project</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Klien", value: project.title },
                      { label: "Kategori", value: project.category },
                      { label: "Industri", value: project.industry },
                      { label: "Teknologi", value: project.techStack.join(", ") },
                    ].map((info, i) => (
                      <div key={i}>
                        <p className="text-xs text-gray-500">{info.label}</p>
                        <p className="text-sm text-white font-medium">{info.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 text-xs font-medium bg-[#22c55e]/10 text-[#22c55e] rounded-full border border-[#22c55e]/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <a
                  href={heroData.cta_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 px-6 bg-[#22c55e] text-white font-semibold rounded-xl text-center hover:bg-[#16a34a] transition-all duration-300 hover:shadow-lg hover:shadow-[#22c55e]/25"
                >
                  Buat Project Serupa →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== OTHER PROJECTS ===== */}
      <section className="py-24 bg-[#0f172a]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Project <span className="gradient-text">Lainnya</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Lihat project lain yang telah kami kerjakan
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherProjects.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="group rounded-2xl overflow-hidden border border-white/10 hover:border-[#22c55e]/40 transition-all duration-500 hover:-translate-y-1"
              >
                <div className={`h-36 bg-gradient-to-br ${p.gradient} flex items-center justify-center relative`}>
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/40 text-white text-xs rounded-full">
                    {p.category}
                  </span>
                  <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="p-4 bg-[#0f172a]">
                  <h3 className="text-white font-bold group-hover:text-[#22c55e] transition-colors">{p.title}</h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{p.description}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/#portfolio"
              className="inline-flex items-center gap-2 text-[#22c55e] hover:text-[#4ade80] transition-colors font-medium"
            >
              ← Kembali ke Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-8 bg-[#060a14] border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} PAGODA STUDIO — Jasa Website Profesional.
          </p>
        </div>
      </footer>
    </div>
  );
}
