"use client";

import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowUpRightIcon } from "@/lib/icons";

interface PortfolioItem {
  title: string;
  category: string;
  description: string;
  url: string;
}

const projects: PortfolioItem[] = [
  {
    title: "Aplikasi Laundry",
    category: "Aplikasi Laundry",
    description:
      "Aplikasi pengelolaan bisnis laundry — kelola order, pelanggan, layanan, dan laporan penjualan dalam satu sistem yang mudah digunakan.",
    url: "https://www.londrihub.my.id/",
  },
  {
    title: "Aplikasi KDS Restoran & Cafe",
    category: "Aplikasi Restoran",
    description:
      "Kitchen Display System untuk restoran dan cafe — pesanan dapur tampil otomatis, antrean masak lebih teratur, dan layanan lebih cepat.",
    url: "https://kulinerin-ecru.vercel.app/",
  },
];

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="space-y-16 md:space-y-24">
          {projects.map((project, index) => (
            <Reveal key={index}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Buka ${project.title}`}
                className="group block"
              >
                {/* Screenshot */}
                <div className="relative overflow-hidden rounded-2xl border border-line bg-surface aspect-[16/9] md:aspect-[21/9]">
                  <img
                    src={`https://picsum.photos/seed/pagoda-${project.category.replace(/\s+/g, "-").toLowerCase()}/1600/900`}
                    alt={`Tampilan aplikasi ${project.title}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors duration-500" />
                  <span className="absolute top-4 left-4 px-3 py-1.5 bg-white/95 text-ink text-xs font-semibold rounded-lg border border-line backdrop-blur-sm">
                    {project.category}
                  </span>
                  <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-4 py-2.5 bg-ink text-white text-sm font-semibold rounded-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    Kunjungi aplikasi
                    <ArrowUpRightIcon className="w-4 h-4" />
                  </span>
                </div>

                {/* Caption */}
                <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-baseline gap-x-10 gap-y-3 mt-7 border-t border-line pt-6">
                  <span className="font-mono text-sm text-faint tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-semibold text-ink tracking-tight mb-2 transition-colors duration-300 group-hover:text-accent">
                      {project.title}
                    </h2>
                    <p className="text-sm text-muted leading-relaxed max-w-2xl text-pretty">
                      {project.description}
                    </p>
                  </div>
                  <ArrowUpRightIcon className="hidden md:block w-5 h-5 text-faint transition-all duration-300 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 justify-self-end" />
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="border-t border-line mt-16 pt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <p className="text-muted max-w-md leading-relaxed text-pretty">
              Punya ide aplikasi atau website yang ingin dibangun? Ceritakan kebutuhan Anda.
            </p>
            <a
              href="https://wa.me/6282210099969"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex-shrink-0"
            >
              Mulai Project
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
