"use client";

import { useBuilder } from "@/lib/builder/store";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { templates } from "@/lib/builder/templates";

export default function BuilderPages() {
  const router = useRouter();
  const { state, dispatch, createNewPage } = useBuilder();
  const { user, loading } = useAuth();
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleCreate = () => {
    createNewPage(title || undefined);
    setShowNew(false);
    setTitle("");
  };

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

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
        <div className="text-center max-w-lg">
          <h1 className="text-3xl font-bold text-white mb-3">Login Diperlukan</h1>
          <p className="text-gray-400 mb-8">Silakan login untuk mengakses halaman ini</p>
          <Link
            href="/auth/login"
            className="px-8 py-3 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-all"
          >
            Masuk
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0f172a]/80 backdrop-blur-lg">
        <div className="container mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/builder" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <Link href="/" className="text-xl font-bold text-white">
              PAGODA<span className="text-[#22c55e]"> STUDIO</span>
            </Link>
            <span className="text-sm text-gray-500 font-medium hidden sm:block">/ Halaman Saya</span>
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
          <div className="flex items-center gap-3">
            <Link
              href="/builder/ai"
              className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all text-sm"
            >
              ✨ AI Builder
            </Link>
            <button
              onClick={() => setShowNew(true)}
              className="px-5 py-2.5 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-all text-sm"
            >
              + Buat Halaman Baru
            </button>
          </div>
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
            <p className="text-gray-400 mb-6">Buat halaman baru atau gunakan AI untuk memulai</p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setShowNew(true)}
                className="px-6 py-3 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-all"
              >
                + Buat Halaman Baru
              </button>
              <Link
                href="/builder/ai"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                ✨ Bangun dengan AI
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {state.pages.map((page) => (
              <div key={page.id} className="group relative rounded-2xl border border-white/10 bg-white/5 hover:border-[#22c55e]/40 transition-all overflow-hidden cursor-pointer" onClick={() => router.push(`/builder/${page.id}`)}>
                <div className="p-6 pb-3">
                  <div className="w-full h-32 rounded-xl bg-gradient-to-br from-[#22c55e]/10 to-blue-500/10 border border-white/10 flex items-center justify-center mb-4 relative">
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
                </div>
                {/* Action buttons - stopPropagation prevents card click */}
                <div className="px-6 pb-4 flex items-center gap-2">
                  <Link
                    href={`/builder/${page.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30 hover:bg-[#22c55e]/30 hover:border-[#22c55e]/50 transition-all"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                    </svg>
                    Drag & Drop
                  </Link>
                  <Link
                    href={`/builder/ai?pageId=${page.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30 hover:border-purple-500/50 transition-all"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    AI Builder
                  </Link>
                </div>
                {/* Delete button */}
                <button
                  onClick={(e) => { e.preventDefault(); setDeleteConfirm(page.id); }}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-red-500/80 backdrop-blur-sm text-white md:opacity-0 md:group-hover:opacity-100 hover:bg-red-500 transition-all shadow-lg"
                  title="Hapus proyek"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6">
            <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
              <div className="text-center mb-4">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                  <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Hapus Proyek?</h3>
                <p className="text-sm text-gray-400">
                  Proyek <span className="text-white font-semibold">{state.pages.find(p => p.id === deleteConfirm)?.title}</span> akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 text-sm text-gray-400 border border-white/10 rounded-xl hover:bg-white/5 hover:text-white transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    dispatch({ type: "DELETE_PAGE", pageId: deleteConfirm });
                    setDeleteConfirm(null);
                  }}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-all"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
