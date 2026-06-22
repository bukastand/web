"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const socials = [
  {
    name: "WhatsApp",
    href: "https://wa.me/6282210099969",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    color: "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 hover:text-emerald-300 border-emerald-500/25",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/pagodastudio",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={1.5} />
        <circle cx="12" cy="12" r="5" strokeWidth={1.5} />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
      </svg>
    ),
    color: "bg-pink-500/15 text-pink-400 hover:bg-pink-500/25 hover:text-pink-300 border-pink-500/25",
  },
  {
    name: "Facebook",
    href: "https://facebook.com/pagodastudio",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    color: "bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 hover:text-blue-300 border-blue-500/25",
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@pagodastudio",
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
    color: "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border-white/20",
  },
];

const contactInfo = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "Alamat",
    value: "Jl. Ade Irma Suryani No.6A, Labuh Baru, Payakumbuh Utara, Sumatera Barat",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: "Telepon",
    value: "+62 822-1009-9969",
    href: "https://wa.me/6282210099969",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: "Email",
    value: "info@pagodastudio.com",
  },
];

export default function KontakPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const reveals = entry.target.querySelectorAll(".reveal");
            reveals.forEach((el, i) => {
              setTimeout(() => (el as HTMLElement).classList.add("visible"), i * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    document.querySelectorAll(".observe-section").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await supabase
        .from("contacts")
        .insert([{ name: formData.name, email: formData.email, phone: formData.phone, message: formData.message }]);
      setSent(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="bg-[#08080f] min-h-screen">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-[#a78bfa]/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-[#2dd4bf]/15 rounded-full blur-[150px] animate-pulse pointer-events-none" style={{ animationDelay: "1.5s" }} />
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(167,139,250,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#08080f] to-transparent z-[2] pointer-events-none" />

        <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#a78bfa]/30 bg-[#a78bfa]/10 text-[#a78bfa] text-sm font-medium mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#a78bfa] animate-pulse" />
            Hubungi Kami
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[0.95] tracking-tight mb-6">
            <span className="text-white">Mari Diskusi</span>
            <br />
            <span className="gradient-text">Bersama Kami</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Punya pertanyaan atau ingin konsultasi? Kami siap membantu. Hubungi kami
            melalui form di bawah atau langsung chat WhatsApp.
          </p>
        </div>
      </section>

      {/* ═══════════════ CONTACT ═══════════════ */}
      <section className="observe-section relative py-16 sm:py-24">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#a78bfa]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#2dd4bf]/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative container mx-auto px-6">
          <div className="reveal grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* ─── CONTACT FORM ─── */}
            <div className="p-8 sm:p-10 rounded-2xl glass-card">
              <h3 className="text-2xl font-bold text-white mb-2">Kirim Pesan</h3>
              <p className="text-sm text-gray-500 mb-8">
                Isi form di bawah dan tim kami akan merespon dalam 1x24 jam.
              </p>

              {sent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#2dd4bf]/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#2dd4bf]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Pesan Terkirim! 🎉</h4>
                  <p className="text-gray-400 text-sm mb-6">Terima kasih! Kami akan segera menghubungi Anda.</p>
                  <button
                    onClick={() => setSent(false)}
                    className="px-6 py-3 bg-[#a78bfa]/10 text-[#a78bfa] rounded-xl font-semibold hover:bg-[#a78bfa]/20 transition-colors"
                  >
                    Kirim Pesan Lagi
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a78bfa]/50 focus:border-[#a78bfa]/50 transition-all"
                      placeholder="Masukkan nama Anda"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a78bfa]/50 focus:border-[#a78bfa]/50 transition-all"
                        placeholder="email@anda.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">No. WhatsApp</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a78bfa]/50 focus:border-[#a78bfa]/50 transition-all"
                        placeholder="08xxxxxxx"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Pesan</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a78bfa]/50 focus:border-[#a78bfa]/50 transition-all resize-none"
                      placeholder="Ceritakan kebutuhan website Anda..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-3.5 bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] text-white font-bold rounded-xl transition-all duration-300 hover:from-[#7c3aed] hover:to-[#6d28d9] hover:shadow-lg hover:shadow-[#a78bfa]/25 active:scale-[0.98] disabled:opacity-50"
                  >
                    {sending ? "Mengirim..." : "Kirim Pesan"}
                  </button>
                </form>
              )}
            </div>

            {/* ─── CONTACT INFO ─── */}
            <div className="space-y-6">
              {/* Info Cards */}
              {contactInfo.map((info, i) => (
                <div key={i} className="p-6 rounded-2xl glass-card hover:border-[#a78bfa]/20 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#a78bfa]/10 text-[#a78bfa] flex items-center justify-center flex-shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{info.label}</p>
                      {info.href ? (
                        <a
                          href={info.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white font-semibold hover:text-[#a78bfa] transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-white font-semibold">{info.value}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Social Links */}
              <div className="p-6 rounded-2xl glass-card hover:border-[#a78bfa]/20 transition-all duration-300">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Media Sosial</p>
                <div className="flex gap-3">
                  {socials.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${social.color}`}
                      title={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick CTA */}
              <a
                href="https://wa.me/6282210099969"
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 rounded-2xl bg-gradient-to-br from-[#a78bfa]/10 to-[#2dd4bf]/5 border border-[#a78bfa]/20 hover:border-[#a78bfa]/40 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold group-hover:text-[#a78bfa] transition-colors">Chat WhatsApp</p>
                    <p className="text-sm text-gray-500">Respon cepat dalam 1x24 jam</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-[#a78bfa] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ MAP ═══════════════ */}
      <section className="observe-section relative py-8">
        <div className="container mx-auto px-6">
          <div className="reveal max-w-5xl mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-lg shadow-black/20 min-h-[350px]">
            <iframe
              src="https://www.google.com/maps?q=Jl.%20Ade%20Irma%20Suryani%20No.6A%20Payakumbuh&output=embed"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="PAGODA STUDIO Location"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="observe-section relative py-16">
        <div className="container mx-auto px-6">
          <div className="reveal max-w-3xl mx-auto text-center p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-[#a78bfa]/10 to-[#2dd4bf]/5 border border-[#a78bfa]/20 glow-violet">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Siap <span className="gradient-text">Memulai?</span>
            </h2>
            <p className="text-gray-400 mb-6 max-w-lg mx-auto">
              Jangan tunda lagi! Hubungi kami sekarang dan dapatkan konsultasi gratis untuk website impian Anda.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://wa.me/6282210099969"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] text-white font-bold rounded-xl transition-all duration-300 hover:from-[#7c3aed] hover:to-[#6d28d9] hover:scale-105 hover:shadow-lg hover:shadow-[#a78bfa]/25"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Konsultasi Sekarang
              </a>
              <Link
                href="/layanan"
                className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold rounded-xl transition-all duration-300 hover:bg-white/10 hover:border-white/40"
              >
                Lihat Layanan
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
