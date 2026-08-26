"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTranslation, useLocale } from "@/lib/i18n/LanguageProvider";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/tentang", label: "Tentang" },
    { href: "/layanan", label: "Layanan" },
    { href: "/portofolio", label: "Portofolio" },
    { href: "/blog", label: "Blog" },
    { href: "/kontak", label: "Kontak" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? "bg-white/90 backdrop-blur-md border-b border-line"
          : "bg-white/0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-[76px]">
          {/* ── LOGO ── */}
          <Link href="/" className="group flex items-center gap-2.5" aria-label="PAGODA STUDIO — Beranda">
            <span className="text-lg font-bold tracking-tight text-ink">
              PAGODA
            </span>
            <span className="w-px h-5 bg-line group-hover:bg-accent transition-colors duration-300" />
            <span className="text-xs font-mono uppercase tracking-[0.14em] text-faint group-hover:text-muted transition-colors duration-300">
              Studio
            </span>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <nav className="hidden md:flex items-center gap-0.5" aria-label="Navigasi utama">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`relative px-3.5 py-2 text-sm transition-colors duration-200 ${
                  isActive(link.href)
                    ? "text-ink font-semibold"
                    : "text-muted hover:text-ink"
                }`}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={`absolute left-3.5 right-3.5 -bottom-px h-0.5 rounded-full bg-accent origin-left transition-transform duration-300 ${
                    isActive(link.href) ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* ── RIGHT SIDE ── */}
          <div className="flex items-center gap-2.5">
            {/* Language Toggle */}
            <button
              onClick={() => setLocale(locale === "en" ? "id" : "en")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-line bg-white text-xs font-semibold text-faint hover:text-ink hover:border-line-hover transition-all duration-200"
              aria-label="Ganti bahasa"
            >
              <span className={locale === "en" ? "text-accent" : ""}>EN</span>
              <span className="text-fainter">/</span>
              <span className={locale === "id" ? "text-accent" : ""}>ID</span>
            </button>

            {/* CTA */}
            <a
              href="https://wa.me/6282210099969"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-white text-sm font-semibold rounded-xl hover:bg-black active:scale-[0.98] transition-all duration-300"
            >
              {t("nav.consultation")}
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 -mr-2 text-ink transition-colors"
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={menuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-6 pt-2">
            <nav className="space-y-0.5" aria-label="Navigasi mobile">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`block px-4 py-3 text-[15px] rounded-xl transition-colors ${
                    isActive(link.href)
                      ? "text-accent font-semibold bg-surface"
                      : "text-muted hover:text-ink hover:bg-surface"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="pt-4 mt-3 border-t border-line">
              <a
                href="https://wa.me/6282210099969"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3.5 bg-ink text-white text-sm font-semibold rounded-xl hover:bg-black transition-colors"
              >
                {t("nav.consultation")}
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
