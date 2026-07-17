"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { type Article, fetchPublishedArticles } from "@/lib/supabase/articles";

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublishedArticles().then((data) => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#eeeeee]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#111111]">
            PAGODA<span className="text-[#2563eb]"> STUDIO</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-[#666666] hover:text-[#2563eb] transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 pt-28 pb-16">
        {/* Page Title */}
        <div className="text-center mb-16">
          <span className="badge-premium mb-4 inline-flex">Blog & Artikel</span>
          <h1 className="heading-lg mb-4">
            Artikel & <span className="text-[#2563eb]">Informasi</span>
          </h1>
          <p className="text-[#666666] text-lg max-w-2xl mx-auto">
            Temukan tips, trik, dan wawasan terbaru seputar website, digital marketing, dan teknologi.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-[#eeeeee] rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[16/9] bg-[#f0f0f0]" />
                <div className="p-5 space-y-3 bg-white">
                  <div className="w-3/4 h-4 bg-[#f0f0f0] rounded" />
                  <div className="w-full h-3 bg-[#f0f0f0] rounded" />
                  <div className="w-1/2 h-3 bg-[#f0f0f0] rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && articles.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-[#f8f8f8] border border-[#eeeeee] flex items-center justify-center">
              <svg className="w-10 h-10 text-[#999999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h2 className="heading-md mb-2">Belum Ada Artikel</h2>
            <p className="text-[#666666]">Belum ada artikel yang dipublikasikan. Kunjungi lagi nanti.</p>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && articles.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group card-premium overflow-hidden"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-[#f8f8f8]">
                    {article.cover_image ? (
                      <img
                        src={article.cover_image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-[#cccccc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-5 bg-white">
                    <p className="text-xs text-[#999999] mb-2">
                      {article.created_at
                        ? new Date(article.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : ""}
                    </p>
                    <h2 className="text-lg font-semibold text-[#111111] mb-2 group-hover:text-[#2563eb] transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                    {article.excerpt && (
                      <p className="text-sm text-[#666666] line-clamp-2 mb-4 leading-relaxed">{article.excerpt}</p>
                    )}
                    <div className="flex items-center gap-1.5 text-[#2563eb] text-sm font-medium group/link">
                      <span>Baca Selengkapnya</span>
                      <svg className="w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <p className="text-center text-sm text-[#999999] mt-10">
              Menampilkan {articles.length} artikel
            </p>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#eeeeee] py-12 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Link href="/" className="inline-block mb-4">
            <span className="text-2xl font-bold text-[#111111]">
              PAGODA<span className="text-[#2563eb]"> STUDIO</span>
            </span>
          </Link>
          <p className="text-sm text-[#666666] max-w-md mx-auto mb-6">
            Jasa pembuatan website profesional untuk bisnis, UMKM, dan perusahaan. Solusi digital lengkap untuk kebutuhan online Anda.
          </p>
          <div className="flex items-center justify-center gap-6 mb-8">
            <Link href="/" className="text-sm text-[#666666] hover:text-[#111111] transition-colors">Beranda</Link>
            <Link href="/tentang" className="text-sm text-[#666666] hover:text-[#111111] transition-colors">Tentang</Link>
            <Link href="/layanan" className="text-sm text-[#666666] hover:text-[#111111] transition-colors">Layanan</Link>
            <Link href="/kontak" className="text-sm text-[#666666] hover:text-[#111111] transition-colors">Kontak</Link>
          </div>
          <div className="pt-6 border-t border-[#eeeeee]">
            <p className="text-sm text-[#999999]">
              &copy; {new Date().getFullYear()} <span className="text-[#111111] font-semibold">PAGODA STUDIO</span>. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
