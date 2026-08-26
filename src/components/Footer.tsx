"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { WhatsAppIcon, InstagramIcon, TikTokIcon, MailIcon } from "@/lib/icons";

export default function Footer() {
  const { t } = useTranslation();

  const socialLinks = [
    { name: "WhatsApp", href: "https://wa.me/6282210099969", icon: <WhatsAppIcon /> },
    { name: "Instagram", href: "https://instagram.com/pagodastudio999", icon: <InstagramIcon /> },
    { name: "TikTok", href: "https://tiktok.com/@pagoda.studio", icon: <TikTokIcon /> },
  ];

  const pageLinks = [
    { label: "Beranda", href: "/" },
    { label: "Tentang", href: "/tentang" },
    { label: "Layanan", href: "/layanan" },
    { label: "Portofolio", href: "/portofolio" },
    { label: "Blog", href: "/blog" },
    { label: "Kontak", href: "/kontak" },
  ];

  return (
    <footer className="bg-white border-t border-line">
      <div className="max-w-7xl mx-auto px-6 pt-16 md:pt-20 pb-10">
        {/* Giant wordmark */}
        <Link
          href="/"
          aria-label="PAGODA STUDIO — Beranda"
          className="block mb-14 md:mb-20 group"
        >
          <span className="block font-bold tracking-[-0.04em] leading-[0.95] text-ink text-[clamp(2.75rem,9vw,7.5rem)]">
            PAGODA<span className="text-accent">.</span>
          </span>
          <span className="font-mono text-xs md:text-sm uppercase tracking-[0.28em] text-faint mt-2 block">
            Studio — Web Development
          </span>
        </Link>

        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-8 gap-y-12 pb-14 border-b border-line">
          {/* Brand blurb */}
          <div className="col-span-2 md:col-span-4">
            <p className="text-sm text-muted leading-relaxed max-w-xs text-pretty">
              {t("footer.brand_desc")}
            </p>
            <div className="flex gap-2.5 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="w-10 h-10 rounded-xl bg-surface border border-line flex items-center justify-center text-muted hover:text-ink hover:border-line-hover active:scale-95 transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Pages */}
          <nav className="md:col-span-3" aria-label="Navigasi footer">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint mb-5">
              Halaman
            </h4>
            <ul className="space-y-2.5">
              {pageLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted hover:text-accent transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint mb-5">
              {t("footer.contact_title")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="mailto:info@pagodastudio.com" className="text-muted hover:text-accent transition-colors duration-200 inline-flex items-center gap-2">
                  <MailIcon className="w-3.5 h-3.5" />
                  info@pagodastudio.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/6282210099969"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-accent transition-colors duration-200"
                >
                  +62 822-1009-9969
                </a>
              </li>
              <li className="text-faint leading-relaxed pt-1 max-w-[220px]">
                Jl. Ade Irma Suryani No.6A, Payakumbuh, Sumatera Barat
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="col-span-2 md:col-span-2">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint mb-5">
              Mulai Project
            </h4>
            <p className="text-sm text-muted leading-relaxed mb-5 text-pretty">
              Ceritakan kebutuhan Anda, kami bantu wujudkan.
            </p>
            <a
              href="https://wa.me/6282210099969"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-ink text-white text-sm font-semibold rounded-xl hover:bg-black active:scale-[0.98] transition-all duration-300"
            >
              {t("footer.cta")}
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-faint">
            &copy; {new Date().getFullYear()} PAGODA STUDIO. Hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privasi" className="text-xs text-faint hover:text-ink transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/syarat" className="text-xs text-faint hover:text-ink transition-colors">
              Syarat &amp; Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
