"use client";

import { useEffect, useRef } from "react";
import Logo from "./Logo";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={ref}
      className="relative py-16 bg-[#060a14] border-t border-white/5"
    >
      <div className="container mx-auto px-6">
        <div className="reveal max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-3">
                <Logo className="w-10 h-10" />
                <div>
                  <h3 className="text-xl font-bold text-white leading-tight">
                    PAGODA<span className="text-[#22c55e]"> STUDIO</span>
                  </h3>
                  <span className="text-[10px] text-gray-600 tracking-[0.2em] uppercase">
                    Web Development
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Jasa pembuatan website profesional untuk bisnis, instansi, dan
                perusahaan. Siap membantu Anda tampil lebih baik di internet.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Layanan
              </h4>
              <ul className="space-y-2">
                {[
                  "Company Profile",
                  "Toko Online",
                  "Website Sekolah",
                  "Custom App",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-gray-500 hover:text-[#22c55e] transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Kontak
              </h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>Payakumbuh, Sumbar</li>
                <li>
                  <a
                    href="https://wa.me/6282210099969"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#22c55e] transition-colors"
                  >
                    +62 822-1009-9969
                  </a>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Ikuti Kami
              </h4>
              <div className="flex gap-3">
                {["whatsapp", "instagram", "facebook"].map((social) => (
                  <a
                    key={social}
                    href="https://wa.me/6282210099969"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#22c55e]/20 hover:text-[#22c55e] hover:border-[#22c55e]/30 transition-all duration-300"
                  >
                    <span className="text-xs uppercase font-bold">{social[0].toUpperCase()}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

          {/* Copyright */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} PAGODA STUDIO — Jasa Website Profesional.
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
