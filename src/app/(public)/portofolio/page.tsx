import PortfolioSection from "@/components/PortfolioSection";

export default function PortofolioPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="w-full h-full" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #111111 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white to-transparent z-[2] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="badge-premium mb-6 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] mr-1.5" />
            Portfolio
          </div>
          <h1 className="heading-xl mb-6">
            <span className="text-[#111111]">Portfolio</span>
            <br />
            <span className="text-[#2563eb]">Kami</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#666666] max-w-3xl mx-auto leading-relaxed">
            Beberapa project yang telah kami kerjakan untuk berbagai klien
            dari berbagai industri — sekolah, properti, travel, dan lainnya.
          </p>
        </div>
      </section>

      {/* ═══════════════ PORTFOLIO GRID ═══════════════ */}
      <PortfolioSection />
    </main>
  );
}