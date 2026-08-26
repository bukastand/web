"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ProjectData } from "@/lib/projects-data";

export default function ProjectShell({
  project,
  children,
}: {
  project: ProjectData;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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

  const navLinks = [
    { href: basePath, label: "Beranda" },
    { href: `${basePath}/about`, label: "Tentang" },
    { href: `${basePath}/services`, label: "Layanan" },
    { href: `${basePath}/contact`, label: "Kontak" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ===== FLOATING WHATSAPP BUTTON ===== */}
      <a
        href="https://wa.me/6282210099969"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-ink flex items-center justify-center shadow-xl shadow-black/30 hover:bg-black hover:scale-110 transition-all duration-300 group"
        aria-label="Hubungi via WhatsApp"
      >
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        {/* Tooltip */}
        <span className="absolute right-16 bg-ink text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Konsultasi Gratis
        </span>
      </a>

      {/* ===== MAIN CONTENT ===== */}
      <main>{children}</main>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 bg-white border-t border-line">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <Link href={basePath} className="text-xl font-bold text-ink">
                <span className="text-accent">{project.title.charAt(0)}</span>
                {project.title.slice(1)}
              </Link>
              <p className="text-sm text-muted mt-2 max-w-md leading-relaxed">
                {project.longDescription.slice(0, 150)}...
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-faint uppercase tracking-widest mb-4">Navigasi</h4>
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="block text-sm text-muted hover:text-ink transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-faint uppercase tracking-widest mb-4">Kontak</h4>
              <div className="space-y-2 text-sm text-muted">
                <p>{project.contactSection.phone}</p>
                <p>{project.contactSection.email}</p>
              </div>
            </div>
          </div>
          <div className="h-px bg-line my-6" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-faint">
              &copy; {new Date().getFullYear()} {project.title}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xs text-faint hover:text-ink transition-colors">
                PAGODA STUDIO
              </Link>
              <Link href="/#portfolio" className="text-xs text-faint hover:text-ink transition-colors">
                Portfolio
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
