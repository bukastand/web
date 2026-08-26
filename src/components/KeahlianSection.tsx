"use client";

import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowUpRightIcon } from "@/lib/icons";

interface KeahlianItem {
  title: string;
  desc: string;
  cta: string;
  href: string;
  external: boolean;
}

const WA_LINK = "https://wa.me/6282210099969";

const keahlian: KeahlianItem[] = [
  {
    title: "Aplikasi Kasir (POS)",
    desc: "Sistem kasir modern untuk toko, kafe, dan bisnis retail — kelola transaksi, stok, dan laporan penjualan secara real-time.",
    cta: "Konsultasi",
    href: WA_LINK,
    external: true,
  },
  {
    title: "Aplikasi Laundry",
    desc: "Kelola order, pelanggan, layanan, dan laporan bisnis laundry Anda dalam satu aplikasi yang mudah digunakan.",
    cta: "Live Demo",
    href: "https://www.londrihub.my.id/",
    external: true,
  },
  {
    title: "Aplikasi KDS Restoran & Cafe",
    desc: "Kitchen Display System untuk restoran dan cafe — pesanan dapur tampil otomatis, antrean masak lebih teratur dan cepat.",
    cta: "Live Demo",
    href: "https://kulinerin-ecru.vercel.app/",
    external: true,
  },
];

export default function KeahlianSection() {
  return (
    <section id="keahlian" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          index="02"
          eyebrow="Keahlian Kami"
          title={
            <>
              Aplikasi yang <span className="text-muted">kami bangun</span>
            </>
          }
          description="Solusi aplikasi siap pakai untuk mengembangkan bisnis Anda — dari kasir hingga sistem dapur restoran."
          className="mb-14"
        />

        <div>
          {keahlian.map((item, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <a
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="group grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-4 md:gap-10 border-t border-line py-8 md:py-10 transition-colors duration-300 hover:bg-surface/60 -mx-4 px-4 rounded-lg"
              >
                <span className="font-mono text-sm text-faint tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-ink tracking-tight mb-2 transition-colors duration-300 group-hover:text-accent">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed max-w-xl text-pretty">
                    {item.desc}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent whitespace-nowrap justify-self-start md:justify-self-end">
                  {item.cta}
                  <ArrowUpRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            </Reveal>
          ))}
          <div className="border-t border-line" />
        </div>
      </div>
    </section>
  );
}
