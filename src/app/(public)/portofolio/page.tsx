export default function PortofolioPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="w-full h-full" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #111111 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>

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
          <p className="text-lg sm:text-xl text-[#666666] max-w-3xl mx-auto leading-relaxed mb-8">
            Project portfolio kami akan segera hadir. Pantau terus update terbaru dari kami.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://wa.me/6282210099969"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex"
            >
              Diskusikan Project
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] text-[#999999] tracking-[0.2em] uppercase">Scroll</span>
          <svg className="w-4 h-4 text-[#999999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </div>
      </section>
    </main>
  );
}
