"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function Footer() {
  const { t } = useTranslation();

  const socialLinks = [
    {
      name: "WhatsApp",
      href: "https://wa.me/6282210099969",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://instagram.com/pagodastudio999",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={1.5} />
          <circle cx="12" cy="12" r="5" strokeWidth={1.5} />
          <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      href: "https://tiktok.com/@pagoda.studio",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-white border-t border-[#eeeeee]">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* ── Brand ── */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-[#111111]">PAGODA</span>
              <span className="text-lg text-[#999999] font-medium ml-1">STUDIO</span>
            </Link>
            <p className="text-[#666666] text-sm leading-relaxed mb-6 max-w-xs">
              {t("footer.brand_desc")}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-[#f8f8f8] border border-[#eeeeee] flex items-center justify-center text-[#666666] hover:text-[#111111] hover:border-[#dddddd] transition-all duration-200"
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Halaman ── */}
          <div>
            <h4 className="text-xs font-semibold text-[#999999] uppercase tracking-widest mb-5">
              Halaman
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Beranda", href: "/" },
                { label: "Tentang", href: "/tentang" },
                { label: "Layanan", href: "/layanan" },
                { label: "Portofolio", href: "/portofolio" },
                { label: "Blog", href: "/blog" },
                { label: "Kontak", href: "/kontak" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-[#666666] hover:text-[#111111] transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Kontak ── */}
          <div>
            <h4 className="text-xs font-semibold text-[#999999] uppercase tracking-widest mb-5">
              {t("footer.contact_title")}
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-[#999999] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <a href="/kontak" className="text-[#666666] hover:text-[#111111] transition-colors">
                  {t("footer.address")}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-[#999999] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="https://wa.me/6282210099969" target="_blank" rel="noopener noreferrer" className="text-[#666666] hover:text-[#111111] transition-colors">
                  +62 822-1009-9969
                </a>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-[#999999] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="/kontak" className="text-[#666666] hover:text-[#111111] transition-colors">info@pagodastudio.com</a>
              </li>
            </ul>
          </div>

          {/* ── CTA ── */}
          <div>
            <h4 className="text-xs font-semibold text-[#999999] uppercase tracking-widest mb-5">
              Mulai Project
            </h4>
            <p className="text-sm text-[#666666] leading-relaxed mb-5">
              Siap membangun website impian? Hubungi kami untuk konsultasi gratis.
            </p>
            <a
              href="https://wa.me/6282210099969"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#111111] text-white text-sm font-semibold rounded-xl hover:bg-black transition-all duration-300"
            >
              {t("footer.cta")}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="mt-16 pt-8 border-t border-[#eeeeee] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#999999]">
            &copy; {new Date().getFullYear()} <span className="text-[#111111] font-semibold">PAGODA STUDIO</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/tentang" className="text-xs text-[#999999] hover:text-[#111111] transition-colors">Tentang</Link>
            <Link href="/layanan" className="text-xs text-[#999999] hover:text-[#111111] transition-colors">Layanan</Link>
            <Link href="/kontak" className="text-xs text-[#999999] hover:text-[#111111] transition-colors">Kontak</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
