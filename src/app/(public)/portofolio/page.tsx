import type { Metadata } from "next";
import PortfolioSection from "@/components/PortfolioSection";

export const metadata: Metadata = {
  title: "Portofolio",
  description:
    "Aplikasi yang telah kami bangun dan berjalan langsung untuk bisnis nyata — kasir, laundry, sistem restoran, dan lainnya.",
};

export default function PortofolioPage() {
  return (
    <main className="bg-white min-h-dvh">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden pt-40 pb-20 md:pt-48 md:pb-24">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #111111 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-faint mb-8">
            <span className="text-accent">Portofolio</span> · Karya Terpilih
          </p>
          <h1 className="heading-xl max-w-3xl">
            Aplikasi yang berjalan untuk <span className="text-accent">bisnis nyata</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted max-w-2xl leading-relaxed mt-7 text-pretty">
            Dari kasir laundry hingga sistem dapur restoran — setiap project di bawah ini
            dipakai langsung oleh penggunanya setiap hari.
          </p>
        </div>
      </section>

      {/* ═══════════════ PORTFOLIO GRID ═══════════════ */}
      <PortfolioSection />
    </main>
  );
}
