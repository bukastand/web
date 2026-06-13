"use client";

import { useBuilder } from "@/lib/builder/store";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import { useState } from "react";
import { templates } from "@/lib/builder/templates";

export default function BuilderHome() {
  const { state, createNewPage } = useBuilder();
  const { user, loading, signOut } = useAuth();
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleCreate = () => {
    createNewPage(title || undefined);
    setShowNew(false);
    setTitle("");
  };

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
            PAGODA<span className="text-[#22c55e]"> BUILDER</span>
          </h1>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Buat website landing page profesional dengan drag & drop. Login atau daftar untuk memulai.
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
            <h1 className="text-sm text-gray-400 font-medium hidden sm:block">Website Builder</h1>
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

              {/* User dropdown */}
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

      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white">Website Saya</h2>
            <p className="text-gray-400 mt-1">Kelola halaman website yang Anda buat</p>
          </div>
          <button
            onClick={() => setShowNew(true)}
            className="px-6 py-3 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-all hover:shadow-lg hover:shadow-[#22c55e]/25"
          >
            + Buat Halaman Baru
          </button>
        </div>

        {/* New Page Modal */}
        {showNew && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6">
            <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-8 w-full max-w-md">
              <h3 className="text-xl font-bold text-white mb-4">Buat Halaman Baru</h3>
              
              {/* Option 1: Empty page */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">Mulai dari Awal</p>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-white/10 hover:border-[#22c55e]/40 hover:bg-[#22c55e]/5 transition-all cursor-pointer group" onClick={() => setShowNew(false)}>
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-500 group-hover:text-[#22c55e] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Nama halaman (contoh: Landing Page Saya)"
                      className="w-full bg-transparent text-white text-sm outline-none placeholder-gray-500"
                      autoFocus
                      onKeyDown={(e) => { if (e.key === "Enter" && title.trim()) { handleCreate(); } }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <p className="text-[10px] text-gray-600 mt-0.5">Mulai dengan halaman kosong</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); if (title.trim()) handleCreate(); }}
                    disabled={!title.trim()}
                    className="px-4 py-1.5 bg-[#22c55e] text-white text-xs font-semibold rounded-lg hover:bg-[#16a34a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Buat
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[10px] text-gray-600 uppercase tracking-wider">atau</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Option 2: From Template */}
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">Mulai dari Template</p>
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                  {templates.map((t) => (
                    <Link
                      key={t.id}
                      href="/templates"
                      className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-white/10 hover:border-[#22c55e]/40 hover:bg-[#22c55e]/5 transition-all"
                    >
                      <div className={`w-full h-16 rounded-lg bg-gradient-to-br ${t.previewColor} flex items-center justify-center`}>
                        <span className="text-2xl">{t.icon}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 group-hover:text-white text-center leading-tight transition-colors">{t.title}</span>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/templates"
                  className="block w-full mt-3 py-2 text-center text-xs text-[#22c55e] border border-dashed border-[#22c55e]/30 rounded-lg hover:bg-[#22c55e]/10 transition-colors"
                >
                  Lihat Semua Template →
                </Link>
              </div>

              {/* Cancel button */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <button onClick={() => setShowNew(false)} className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors">
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page List */}
        {state.pages.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Belum Ada Halaman</h3>
            <p className="text-gray-400 mb-6">Klik tombol &quot;Buat Halaman Baru&quot; untuk memulai</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {state.pages.map((page) => (
              <div key={page.id} className="group rounded-2xl border border-white/10 bg-white/5 hover:border-[#22c55e]/40 transition-all overflow-hidden">
                <Link href={`/builder/${page.id}`} className="block p-6">
                  <div className="w-full h-32 rounded-xl bg-gradient-to-br from-[#22c55e]/10 to-blue-500/10 border border-white/10 flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-1 truncate">{page.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {page.sections.length} section{page.sections.length !== 1 ? "s" : ""}
                    </span>
                    {page.published && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#22c55e]/20 text-[#22c55e] font-medium">
                        Published
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
