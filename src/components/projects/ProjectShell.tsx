"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ProjectData } from "@/lib/projects-data";
import { supabase } from "@/lib/supabase";
import ThreeScene from "./ThreeScene";

export default function ProjectShell({
  project,
  children,
}: {
  project: ProjectData;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroData, setHeroData] = useState({ cta_link: "https://wa.me/6282210099969" });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    supabase.from("hero_content").select("cta_link").eq("id", 1).single().then(({ data }) => {
      if (data) setHeroData(data);
    });
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0", "scale-100");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".reveal-section").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  const basePath = `/projects/${project.slug}`;
  const isActive = (p: string) => pathname === p;

  const navLinks = [
    { href: basePath, label: "Beranda" },
    { href: `${basePath}/about`, label: "Tentang" },
    { href: `${basePath}/services`, label: "Layanan" },
    { href: `${basePath}/contact`, label: "Kontak" },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans">
      {/* ===== NAVBAR ===== */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#0f172a]/90 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between h-16 md:h-20">
          <Link href={basePath} className="flex items-center gap-2 text-lg font-bold text-white">
            <span className="w-8 h-8 rounded-lg bg-[#22c55e]/20 flex items-center justify-center text-[#22c55e] text-sm font-bold">
              {project.title.charAt(0)}
            </span>
            <span className="hidden sm:inline">{project.title}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                  isActive(link.href)
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/#portfolio" className="text-sm text-gray-500 hover:text-white transition-colors">
              Portfolio
            </Link>
            <a
              href={heroData.cta_link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#22c55e] text-white text-sm font-semibold rounded-xl hover:bg-[#16a34a] transition-all hover:shadow-lg hover:shadow-[#22c55e]/25"
            >
              Konsultasi Gratis
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1.5">
              <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? "rotate-45 translate-y-1" : ""}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all ${menuOpen ? "-rotate-45 -translate-y-1" : ""}`} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 py-4 bg-[#0f172a]/95 backdrop-blur-xl border-t border-white/5 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 text-sm font-medium rounded-xl ${
                  isActive(link.href)
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/5">
              <a
                href={heroData.cta_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#22c55e] text-white text-sm font-semibold rounded-xl"
              >
                Konsultasi Gratis
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main>{children}</main>

      {/* ===== FOOTER ===== */}
      <footer className="relative py-12 bg-[#060a14] border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#22c55e]/[0.02] to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <Link href={basePath} className="text-xl font-bold text-white">
                <span className="text-[#22c55e]">{project.title.charAt(0)}</span>
                {project.title.slice(1)}
              </Link>
              <p className="text-sm text-gray-500 mt-2 max-w-md leading-relaxed">
                {project.longDescription.slice(0, 150)}...
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Navigasi</h4>
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="block text-sm text-gray-500 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Kontak</h4>
              <div className="space-y-2 text-sm text-gray-500">
                <p>{project.contactSection.phone}</p>
                <p>{project.contactSection.email}</p>
              </div>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} {project.title}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xs text-gray-600 hover:text-white transition-colors">
                PAGODA STUDIO
              </Link>
              <Link href="/#portfolio" className="text-xs text-gray-600 hover:text-white transition-colors">
                Portfolio
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
