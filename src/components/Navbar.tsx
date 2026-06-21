"use client";

import Link from "next/link";
import Logo from "./Logo";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "#layanan", label: "Layanan" },
    { href: "#paket", label: "Paket" },
    { href: "#lokasi", label: "Kontak" },
    { href: "https://wa.me/6282210099969", label: "WhatsApp", external: true },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/80 backdrop-blur-lg border-b border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* ── LOGO – bold, prominent, brand-first ── */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <Logo className="w-9 h-9 transition-transform duration-300 group-hover:scale-110" />
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white leading-tight">
                PAGODA<span className="text-[#22c55e]"> STUDIO</span>
              </span>
              <span className="text-[9px] text-gray-500 tracking-[0.25em] uppercase leading-tight">
                Web Development
              </span>
            </div>
          </Link>

          {/* ── MENU – muted, clean, hover-underline effect ── */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-slate-400 hover:text-[#22c55e] transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#22c55e] rounded-full transition-all duration-300 group-hover:w-full" />
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-slate-400 hover:text-[#22c55e] transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#22c55e] rounded-full transition-all duration-300 group-hover:w-full" />
                </Link>
              )
            )}
          </nav>

          {/* ── CTA – bold green button with WhatsApp icon ── */}
          <div className="hidden md:flex items-center flex-shrink-0">
            <a
              href="https://wa.me/6282210099969"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white text-sm font-bold rounded-xl hover:from-[#16a34a] hover:to-[#15803d] transition-all duration-300 hover:shadow-lg hover:shadow-[#22c55e]/30 active:scale-95"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Konsultasi Gratis
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-white/5 mt-2 pt-4 space-y-2">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
            <a
              href="https://wa.me/6282210099969"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#22c55e]/10 text-[#22c55e] text-sm font-semibold rounded-xl hover:bg-[#22c55e]/20 transition-colors mx-1"
            >
              Konsultasi Gratis
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
