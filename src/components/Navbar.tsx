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
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-[#eeeeee]"
          : "bg-white/0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* ── LOGO ── */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-tight text-[#111111]">
              PAGODA
            </span>
            <span className="w-px h-6 bg-[#eeeeee]" />
            <span className="text-sm text-[#666666] font-medium">
              STUDIO
            </span>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-[#2563eb] bg-[#dbeafe]"
                    : "text-[#666666] hover:text-[#111111] hover:bg-[#f8f8f8]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── RIGHT SIDE ── */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={() => setLocale(locale === "en" ? "id" : "en")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#eeeeee] bg-white text-xs font-semibold text-[#666666] hover:text-[#111111] hover:border-[#dddddd] transition-all duration-200"
            >
              <span className={locale === "en" ? "text-[#2563eb]" : ""}>EN</span>
              <span className="text-[#cccccc]">/</span>
              <span className={locale === "id" ? "text-[#2563eb]" : ""}>ID</span>
            </button>

            {/* CTA */}
            <a
              href="https://wa.me/6282210099969"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-[#111111] text-white text-sm font-semibold rounded-xl hover:bg-black transition-all duration-300 hover:scale-[1.02]"
            >
              {t("nav.consultation")}
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-[#666666] hover:text-[#111111] transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-6 border-t border-[#eeeeee] mt-2 pt-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 text-sm rounded-xl transition-colors ${
                  isActive(link.href)
                    ? "text-[#2563eb] bg-[#dbeafe]"
                    : "text-[#666666] hover:text-[#111111] hover:bg-[#f8f8f8]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-3 border-t border-[#eeeeee]">
              <a
                href="https://wa.me/6282210099969"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#111111] text-white text-sm font-semibold rounded-xl hover:bg-black transition-colors"
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
