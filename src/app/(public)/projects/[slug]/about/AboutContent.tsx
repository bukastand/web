"use client";

import type { ProjectData } from "@/lib/projects-data";
import ThreeScene from "@/components/projects/ThreeScene";

export default function AboutContent({ project }: { project: ProjectData }) {
  const { aboutSection } = project;

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden ">
        <ThreeScene />
        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-15`} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-[#eeeeee] text-[#111111] text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#2563eb] animate-pulse" />
            Tentang Kami
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Tentang <span className="text-[#2563eb]">{project.title}</span>
          </h1>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Mengenal lebih dekat perjalanan, visi, dan tim di balik {project.title}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="relative py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto reveal-section opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-[#2563eb] text-sm font-semibold tracking-widest uppercase mb-4 block text-center">Cerita Kami</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
              Perjalanan <span className="text-[#2563eb]">{project.title}</span>
            </h2>
            <div className="relative p-8 sm:p-12 rounded-3xl bg-[#f8f8f8] border border-[#eeeeee]">
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${project.gradient} rounded-l-3xl`} />
              <p className="text-[#666666] leading-relaxed text-lg">{aboutSection.story}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative py-24 bg-[#f8f8f8]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2563eb]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="reveal-section p-8 sm:p-10 rounded-3xl bg-[#f8f8f8] border border-[#eeeeee] opacity-0 translate-y-8 transition-all duration-700">
              <div className="w-14 h-14 rounded-xl bg-[#2563eb]/20 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#2563eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Misi</h3>
              <p className="text-[#666666] leading-relaxed">{aboutSection.mission}</p>
            </div>
            <div className="reveal-section p-8 sm:p-10 rounded-3xl bg-[#f8f8f8] border border-[#eeeeee] opacity-0 translate-y-8 transition-all duration-700"
              style={{ transitionDelay: "150ms" }}>
              <div className="w-14 h-14 rounded-xl bg-[#2563eb]/20 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#2563eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Visi</h3>
              <p className="text-[#666666] leading-relaxed">{aboutSection.vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 reveal-section opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-[#2563eb] text-sm font-semibold tracking-widest uppercase mb-4 block">Nilai-Nilai</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Core <span className="text-[#2563eb]">Values</span>
            </h2>
            <p className="text-[#666666] max-w-2xl mx-auto">Prinsip yang menjadi fondasi setiap keputusan dan tindakan kami</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {aboutSection.values.map((value, i) => (
              <div key={i}
                className="reveal-section group p-6 rounded-2xl bg-[#f8f8f8] border border-[#eeeeee] hover:border-[#2563eb]/40 transition-all duration-500 hover:-translate-y-1 opacity-0 translate-y-8"
                style={{ transitionDelay: `${i * 100}ms`, transitionDuration: "700ms" }}>
                <div className="w-10 h-10 rounded-xl bg-[#2563eb]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-[#2563eb] font-bold text-lg">{i + 1}</span>
                </div>
                <h4 className="text-lg font-bold text-white">{value}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="relative py-24 bg-[#f8f8f8]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 reveal-section opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-[#2563eb] text-sm font-semibold tracking-widest uppercase mb-4 block">Tim Kami</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              <span className="text-[#2563eb]">Tim</span> Profesional
            </h2>
            <p className="text-[#666666] max-w-2xl mx-auto">Kenalan dengan orang-orang hebat di balik {project.title}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {aboutSection.teamMembers.map((member, i) => (
              <div key={i}
                className="reveal-section group text-center p-6 rounded-2xl bg-[#f8f8f8] border border-[#eeeeee] hover:border-[#2563eb]/30 transition-all duration-500 hover:-translate-y-2 opacity-0 translate-y-8"
                style={{ transitionDelay: `${i * 150}ms`, transitionDuration: "700ms" }}>
                <div className={`w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${project.gradient} flex items-center justify-center text-xl font-bold text-white group-hover:scale-110 transition-transform duration-500`}>
                  {member.avatar}
                </div>
                <h4 className="text-lg font-bold text-white mb-1">{member.name}</h4>
                <p className="text-sm text-[#2563eb] font-medium mb-3">{member.role}</p>
                <p className="text-sm text-[#666666] leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 bg-white overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-5`} />
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="reveal-section max-w-2xl mx-auto opacity-0 translate-y-8 transition-all duration-700">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Tertarik Bekerja Sama?
            </h2>
            <p className="text-lg text-[#666666] mb-8">
              Hubungi kami dan diskusikan kebutuhan Anda
            </p>
            <a href="https://wa.me/6282210099969" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#2563eb] text-[#111111] font-bold rounded-2xl text-lg hover:bg-[#16a34a] transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#2563eb]/25">
              Hubungi Kami
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
