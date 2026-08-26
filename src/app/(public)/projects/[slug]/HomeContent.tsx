"use client";

import Link from "next/link";
import type { ProjectData } from "@/lib/projects-data";
import ThreeScene from "@/components/projects/ThreeScene";

const CTA_LINK = "https://wa.me/6282210099969";

export default function HomeContent({
  project,
  otherProjects,
}: {
  project: ProjectData;
  otherProjects: ProjectData[];
}) {

  const stats = [
    { val: "50+", label: "Project Selesai" },
    { val: "30+", label: "Klien Puas" },
    { val: project.features.length + "+", label: "Fitur Premium" },
    { val: "24/7", label: "Support Teknis" },
  ];

  const workSteps = [
    { num: "01", title: "Konsultasi", desc: "Diskusi kebutuhan & tujuan project Anda" },
    { num: "02", title: "Desain", desc: "Pembuatan mockup & konsep visual" },
    { num: "03", title: "Development", desc: "Coding & integrasi fitur" },
    { num: "04", title: "Launch", desc: "Deploy & go live!" },
  ];

  const testimonials = [
    {
      name: "Ahmad Fauzi", role: "Direktur " + project.title,
      text: "Sangat puas dengan hasil kerja tim. Website yang diberikan melebihi ekspektasi kami.", rating: 5,
    },
    {
      name: "Siti Rahma", role: "Manajer Operasional",
      text: "Prosesnya cepat dan komunikatif. Hasilnya profesional dan sesuai kebutuhan.", rating: 5,
    },
    {
      name: "Bambang Hartono", role: "Founder",
      text: "Website kami sekarang terlihat jauh lebih modern dan profesional. Terima kasih!", rating: 5,
    },
  ];

  return (
    <>
      {/* ===== 1. HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden ">
        <ThreeScene />
        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-15`} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}
              className="absolute border border-white/[0.07] rounded-full animate-pulse"
              style={{
                width: `${80 + i * 90}px`, height: `${80 + i * 90}px`,
                top: `${15 + i * 12}%`, right: `${8 + i * 6}%`,
                animationDuration: `${5 + i * 2}s`, animationDelay: `${i * 0.7}s`,
              }} />
          ))}
        </div>
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="relative z-10 container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface backdrop-blur-sm border border-line text-ink text-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                {project.industry}
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-ink leading-tight mb-6">
                {project.title}
              </h1>
              <p className="text-lg sm:text-xl text-muted leading-relaxed mb-8 max-w-xl">
                {project.longDescription.slice(0, 200)}...
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href={CTA_LINK} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-ink font-semibold rounded-xl text-lg hover:bg-accent-hover transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent/25">
                  Buat Project Serupa
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <Link href={`/projects/${project.slug}/about`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-line text-ink font-semibold rounded-xl text-lg hover:bg-surface transition-all duration-300">
                  Pelajari Lebih
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className={`relative w-80 h-96 rounded-3xl bg-gradient-to-br ${project.gradient} p-1`}>
                <div className="w-full h-full rounded-3xl bg-white/90 flex items-center justify-center overflow-hidden relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-20`} />
                  <div className="text-center relative z-10 p-8">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-surface flex items-center justify-center border border-line">
                      <svg className="w-10 h-10 text-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-ink mb-2">{project.title}</h3>
                    <p className="text-sm text-muted">{project.category}</p>
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      {project.techStack.slice(0, 3).map((t) => (
                        <span key={t} className="px-2 py-1 text-[10px] bg-surface text-muted rounded-md">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce z-10">
          <span className="text-[10px] text-faint tracking-[0.2em] uppercase">Scroll</span>
          <svg className="w-4 h-4 text-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </div>
      </section>

      {/* ===== 2. STATS SECTION ===== */}
      <section className="relative py-16 bg-surface border-y border-line">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 reveal-section opacity-0 translate-y-8 transition-all duration-700">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-accent mb-1">{s.val}</div>
                <div className="text-sm text-faint">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3. ABOUT PREVIEW ===== */}
      <section className="relative py-24 sm:py-32 bg-white">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center reveal-section opacity-0 translate-y-8 transition-all duration-700">
            <div>
              <span className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 block">Tentang</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-6">
                Tentang <span className="text-accent">{project.title}</span>
              </h2>
              <p className="text-muted leading-relaxed mb-6">{project.aboutSection.story}</p>
              <Link href={`/projects/${project.slug}/about`}
                className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-4 transition-all">
                Selengkapnya
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {project.aboutSection.values.map((v, i) => (
                <div key={i} className="p-4 rounded-xl bg-surface border border-line backdrop-blur-sm">
                  <p className="text-ink font-semibold text-sm">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4. FEATURES ===== */}
      <section className="relative py-24 sm:py-32 bg-surface">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.02] via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 reveal-section opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 block">Fitur Premium</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-4">
              Keunggulan <span className="text-accent">Website</span> Ini
            </h2>
            <p className="text-muted max-w-2xl mx-auto">Fitur-fitur unggulan yang membuat website ini standout</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.features.map((feat, i) => (
              <div key={i}
                className="reveal-section group relative p-6 sm:p-8 rounded-2xl bg-surface border border-line hover:border-accent/40 transition-all duration-500 hover:-translate-y-1 opacity-0 translate-y-8"
                style={{ transitionDelay: `${i * 80}ms`, transitionDuration: "700ms" }}>
                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-ink mb-3">{feat}</h4>
                <p className="text-sm text-muted leading-relaxed line-clamp-3">{project.longDescription}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 5. TECH STACK ===== */}
      <section className="relative py-24 bg-white">
        <div className="container mx-auto px-6 text-center reveal-section opacity-0 translate-y-8 transition-all duration-700">
          <span className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 block">Teknologi</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-4">
            Tech <span className="text-accent">Stack</span>
          </h2>
          <p className="text-muted mb-12">Teknologi modern yang digunakan</p>
          <div className="flex flex-wrap justify-center gap-4">
            {project.techStack.map((tech) => (
              <div key={tech}
                className="px-6 py-4 rounded-2xl bg-surface border border-line hover:border-accent/40 transition-all duration-300 hover:-translate-y-1">
                <span className="text-ink font-semibold">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 6. HOW IT WORKS ===== */}
      <section className="relative py-24 sm:py-32 bg-surface">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 reveal-section opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 block">Alur Kerja</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-4">
              Bagaimana <span className="text-accent">Prosesnya</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {workSteps.map((step, i) => (
              <div key={i}
                className="reveal-section relative text-center opacity-0 translate-y-8 transition-all duration-700"
                style={{ transitionDelay: `${i * 150}ms` }}>
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${project.gradient} flex items-center justify-center text-2xl font-bold text-ink`}>
                  {step.num}
                </div>
                <h4 className="text-xl font-bold text-ink mb-3">{step.title}</h4>
                <p className="text-muted leading-relaxed">{step.desc}</p>
                {i < workSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-accent/40 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 7. TESTIMONIALS ===== */}
      <section className="relative py-24 sm:py-32 bg-white">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 reveal-section opacity-0 translate-y-8 transition-all duration-700">
            <span className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 block">Testimonial</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-4">
              Apa Kata <span className="text-accent">Klien</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i}
                className="reveal-section p-6 sm:p-8 rounded-2xl bg-surface border border-line hover:border-accent/30 transition-all duration-500 opacity-0 translate-y-8"
                style={{ transitionDelay: `${i * 150}ms`, transitionDuration: "700ms" }}>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, ri) => (
                    <svg key={ri} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-muted mb-6 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="text-ink font-bold">{t.name}</p>
                  <p className="text-sm text-faint">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 8. CTA ===== */}
      <section className="relative py-24 sm:py-32 bg-surface overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-5`} />
        <ThreeScene />
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="reveal-section max-w-3xl mx-auto opacity-0 translate-y-8 transition-all duration-700">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-ink mb-6">
              Ingin Membuat Website<br /><span className="text-accent">Seperti Ini?</span>
            </h2>
            <p className="text-lg text-muted mb-10 max-w-2xl mx-auto">
              Konsultasi gratis dengan tim kami. Diskusikan kebutuhan website Anda dan dapatkan solusi terbaik.
            </p>
            <a href={CTA_LINK} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 bg-ink text-white font-bold rounded-2xl text-xl hover:bg-accent-hover transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent/30 ">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Konsultasi Gratis Sekarang
            </a>
          </div>
        </div>
      </section>

      {/* ===== 9. OTHER PROJECTS ===== */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 reveal-section opacity-0 translate-y-8 transition-all duration-700">
            <h2 className="text-3xl sm:text-4xl font-bold text-ink mb-4">
              Project <span className="text-accent">Lainnya</span>
            </h2>
            <p className="text-muted">Lihat project lain yang telah kami kerjakan</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherProjects.map((p) => (
              <Link key={p.slug} href={`/projects/${p.slug}`}
                className="group rounded-2xl overflow-hidden border border-line hover:border-accent/40 transition-all duration-500 hover:-translate-y-2">
                <div className={`h-40 bg-gradient-to-br ${p.gradient} flex items-center justify-center relative`}>
                  <span className="absolute top-3 left-3 px-2 py-0.5 bg-white/80 text-muted text-xs rounded-full border border-line">{p.category}</span>
                  <svg className="w-10 h-10 text-ink/30 group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="p-5 bg-white">
                  <h3 className="text-ink font-bold group-hover:text-accent transition-colors">{p.title}</h3>
                  <p className="text-xs text-muted mt-1 line-clamp-2">{p.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
