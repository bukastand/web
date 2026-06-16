"use client";

import { useBuilder } from "@/lib/builder/store";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import { useState } from "react";

export default function BuilderDashboard() {
  const { user, loading, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Memeriksa sesi...</p>
        </div>
      </div>
    );
  }

  // Not logged in - show login/register CTA
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
        <div className="text-center max-w-lg">
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-[#22c55e]/20 to-emerald-500/20 border border-[#22c55e]/30 flex items-center justify-center">
            <svg className="w-12 h-12 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 5h4a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h4m2 4l2-2m0 0l-2-2m2 2H8" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            PAGODA<span className="text-[#22c55e]"> STUDIO</span>
          </h1>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Buat website landing page profesional. Pilih cara Anda: Drag & Drop atau Dibantu AI.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/auth/login"
              className="px-8 py-3 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-all hover:shadow-lg hover:shadow-[#22c55e]/25"
            >
              Masuk
            </Link>
            <Link
              href="/auth/register"
              className="px-8 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition-all"
            >
              Daftar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0f172a]/80 backdrop-blur-lg">
        <div className="container mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-white">
            PAGODA<span className="text-[#22c55e]"> STUDIO</span>
          </Link>
          <div className="flex items-center gap-4">
            {/* User avatar */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#22c55e]/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-[#22c55e]">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <span className="text-sm text-gray-400 hidden sm:block truncate max-w-[150px]">
                  {user?.email || "User"}
                </span>
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#1e293b] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-white/10">
                      <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Builder User</p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={signOut}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Keluar
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Bangun Website Impian Anda
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto mb-12 text-lg">
          Dua cara mudah untuk membuat website profesional. Pilih yang paling cocok untuk Anda.
        </p>

        {/* Choice Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Option 1: Drag & Drop */}
          <Link
            href="/builder/pages"
            className="group relative p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 hover:from-emerald-500/10 hover:to-teal-500/10 hover:border-emerald-500/40 transition-all duration-500 text-left"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">Drag & Drop</h2>
                <p className="text-sm text-gray-500">Kontrol penuh, sesuaikan sendiri</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Bangun website dengan drag & drop visual. Pilih dari 20+ komponen, atur layout, warna, dan konten sendiri. 
              Cocok untuk yang ingin kendali penuh atas desain.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm">
              <span>Mulai Drag & Drop</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            {/* Features */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">20+ Komponen</span>
              <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Template Siap Pakai</span>
              <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Kontrol Penuh</span>
            </div>
          </Link>

          {/* Option 2: AI Builder */}
          <Link
            href="/builder/ai"
            className="group relative p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/5 to-pink-500/5 hover:from-purple-500/10 hover:to-pink-500/10 hover:border-purple-500/40 transition-all duration-500 text-left"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/5 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">Bangun dengan AI</h2>
                <p className="text-sm text-gray-500">Deskripsikan, AI yang kerjakan</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Cukup tulis deskripsi website yang Anda inginkan. AI akan: merencanakan → menulis konten → 
              membuat kode → memeriksa → memoles desain. Preview langsung terlihat!
            </p>
            <div className="flex items-center gap-2 text-purple-400 font-medium text-sm">
              <span>Coba AI Builder</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            {/* Features */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 text-xs rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">Multi-Agent AI</span>
              <span className="px-2.5 py-1 text-xs rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">Live Preview</span>
              <span className="px-2.5 py-1 text-xs rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">Belajar dari Proyek</span>
            </div>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { value: "50+", label: "Templates", icon: "📦" },
            { value: "20+", label: "Komponen", icon: "🧩" },
            { value: "AI", label: "Generator Cerdas", icon: "🤖" },
            { value: "100%", label: "Mobile Friendly", icon: "📱" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <span className="text-2xl mb-2 block">{stat.icon}</span>
              <p className="text-white font-bold text-lg">{stat.value}</p>
              <p className="text-gray-500 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Footer link */}
        <div className="mt-12">
          <Link
            href="/builder/pages"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Lihat halaman yang sudah Anda buat
          </Link>
        </div>
      </section>
    </div>
  );
}
