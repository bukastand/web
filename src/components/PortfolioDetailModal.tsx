"use client";

import { useEffect, useRef, useMemo } from "react";

interface PortfolioItem {
  title: string;
  category: string;
  description: string;
  gradient: string;
}

interface PortfolioDetailModalProps {
  project: PortfolioItem;
  allProjects: PortfolioItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function PortfolioDetailModal({
  project,
  allProjects,
  index,
  onClose,
  onPrev,
  onNext,
}: PortfolioDetailModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Focus trap + keyboard nav + animate in
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    // Auto-focus close button for focus trap
    closeBtnRef.current?.focus();

    // Animate in
    requestAnimationFrame(() => {
      if (overlayRef.current) overlayRef.current.classList.add("opacity-100");
      if (contentRef.current) {
        contentRef.current.classList.add("opacity-100", "translate-y-0", "scale-100");
      }
    });

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  // Generate floating 3D orb positions based on project
  const orbs = useMemo(() => {
    const seed = index * 137.5;
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2 + seed;
      const radius = 150 + Math.sin(i * 2.7) * 60;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle * 1.3) * radius * 0.6,
        size: 40 + Math.sin(i * 1.1) * 25,
        delay: i * 0.15,
        duration: 4 + Math.sin(i * 0.8) * 2,
      };
    });
  }, [index]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center opacity-0 transition-opacity duration-500"
    >
      {/* Backdrop with gradient blur */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
        onClick={onClose}
      />

      {/* 3D Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {orbs.map((orb, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-float mix-blend-screen"
            style={{
              width: orb.size,
              height: orb.size,
              background: `radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 50%, transparent 70%)`,
              transform: `translate(calc(-50% + ${orb.x}px), calc(-50% + ${orb.y}px))`,
              animationDelay: `${orb.delay}s`,
              animationDuration: `${orb.duration}s`,
              boxShadow: `0 0 ${orb.size}px rgba(34,197,94,0.1)`,
            }}/>
        ))}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`p-${i}`}
            className="absolute w-1 h-1 bg-[#22c55e]/30 rounded-full"
            style={{
              top: `${10 + Math.random() * 80}%`,
              left: `${10 + Math.random() * 80}%`,
              animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: 0.3 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-4xl mx-4 opacity-0 translate-y-8 scale-95 transition-all duration-700 ease-out"
      >
        {/* Close button */}
        <button
          ref={closeBtnRef}
          onClick={onClose}
          className="absolute -top-12 right-0 text-gray-400 hover:text-white transition-colors z-20"
          aria-label="Close"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Card */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0f172a]/90 backdrop-blur-sm">
          {/* Gradient header */}
          <div className={`relative h-64 sm:h-80 bg-gradient-to-br ${project.gradient} overflow-hidden`}>
            {/* Animated geometric shapes */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/20 rounded-full animate-pulse" style={{ animationDuration: "4s" }} />
              <div className="absolute top-1/3 right-1/3 w-24 h-24 border border-white/15 rounded-full animate-pulse" style={{ animationDuration: "3s" }} />
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 border border-white/10 rotate-45 animate-pulse" style={{ animationDuration: "5s" }} />
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            </div>

            {/* Content on header */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/10">
                  {project.category}
                </span>
                <span className="text-white/40 text-xs">
                  Project {index + 1} dari {allProjects.length}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                {project.title}
              </h2>
            </div>

            {/* 3D icon overlay */}
            <div className="absolute top-8 right-8 w-16 h-16 border-2 border-white/20 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-white/20 rounded-full animate-ping" style={{ animationDuration: "3s" }} />
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            {/* Description */}
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              {project.description}
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                { label: "Kategori", value: project.category, icon: "📂" },
                { label: "Status", value: "Selesai & Online", icon: "✅" },
                { label: "Tipe", value: "Responsive Website", icon: "📱" },
                { label: "Layanan", value: "Design + Development", icon: "⚡" },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <p className="text-xs text-gray-500">{feature.label}</p>
                    <p className="text-sm font-medium text-white">{feature.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/6282210099969"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-all duration-300 hover:shadow-lg hover:shadow-[#22c55e]/25"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Buat Project Serupa
              </a>
              <button
                onClick={onClose}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/10"
              >
                Kembali ke Portfolio
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={onPrev}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {allProjects[index === 0 ? allProjects.length - 1 : index - 1]?.title}
          </button>
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors group"
          >
            {allProjects[(index + 1) % allProjects.length]?.title}
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
