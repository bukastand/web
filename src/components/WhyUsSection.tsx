"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

interface WhyUsItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
  gradient: string;
}

const iconSvg: Record<string, React.ReactNode> = {
  image: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  smartphone: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  zap: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  settings: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const defaultWhyUs: WhyUsItem[] = [
  {
    icon: iconSvg.image || null,
    title: "Desain Modern",
    desc: "Tampilan elegan dan profesional untuk meningkatkan kepercayaan customer.",
    gradient: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    icon: iconSvg.smartphone || null,
    title: "Mobile Friendly",
    desc: "Website tampil optimal di HP, tablet, maupun desktop.",
    gradient: "from-blue-500/20 to-blue-500/5",
  },
  {
    icon: iconSvg.zap || null,
    title: "Fast Loading",
    desc: "Website ringan dan cepat diakses untuk pengalaman pengguna yang lebih baik.",
    gradient: "from-yellow-500/20 to-yellow-500/5",
  },
  {
    icon: iconSvg.settings || null,
    title: "Support Cepat",
    desc: "Kami siap membantu jika ada kendala atau update website.",
    gradient: "from-purple-500/20 to-purple-500/5",
  },
];

export default function WhyUsSection() {
  const [reasons, setReasons] = useState<WhyUsItem[]>(defaultWhyUs);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    supabase
      .from("why_us")
      .select("title, description, icon_name, gradient")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setReasons(
            data.map((r) => ({
              icon: iconSvg[r.icon_name] || iconSvg.image,
              title: r.title,
              desc: r.description,
              gradient: r.gradient,
            }))
          );
        }
      });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            const cards = entry.target.querySelectorAll(".reveal");
            cards.forEach((card, i) => {
              setTimeout(() => card.classList.add("visible"), i * 150);
            });
          }
        });
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32 bg-[#0f172a] overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#22c55e]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative container mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Kenapa Pilih{" "}
            <span className="gradient-text">Kami?</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Kami membantu bisnis tampil profesional di internet
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="reveal group relative p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-[#22c55e]/30 transition-all duration-500 overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${reason.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

              {/* Icon */}
              <div className="relative z-10 w-14 h-14 rounded-xl bg-[#22c55e]/10 text-[#22c55e] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-[#22c55e] group-hover:text-white transition-all duration-500">
                {reason.icon}
              </div>

              <div className="relative z-10">
                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-[#22c55e] transition-colors duration-300">
                  {reason.title}
                </h4>
                <p className="text-gray-500 leading-relaxed">{reason.desc}</p>
              </div>

              {/* Bottom shine */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#22c55e]/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
