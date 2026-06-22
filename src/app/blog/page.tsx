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
    <main className="min-h-screen bg-[#08080f]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#08080f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl font-extrabold tracking-tight text-white">
              PAGODA<span className="text-[#a78bfa]"> STUDIO</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-[#a78bfa] transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-28 pb-16">
        {/* Page Title */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-[#a78bfa]/10 text-[#a78bfa] text-sm font-medium rounded-full border border-[#a78bfa]/20 mb-4">
            Blog & Artikel
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Artikel & <span className="gradient-text">Informasi</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Temukan tips, trik, dan wawasan terbaru seputar website, digital marketing, dan teknologi.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[16/9] bg-white/5" />
                <div className="p-5 space-y-3">
                  <div className="w-3/4 h-4 bg-white/5 rounded" />
                  <div className="w-full h-3 bg-white/5 rounded" />
                  <div className="w-1/2 h-3 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && articles.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Belum Ada Artikel</h2>
            <p className="text-gray-500">Belum ada artikel yang dipublikasikan. Kunjungi lagi nanti.</p>
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
                  className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-[#a78bfa]/30 hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-[#0d0d1a]">
                    {article.cover_image ? (
                      <img
                        src={article.cover_image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-gray-400 mb-2">
                      {article.created_at
                        ? new Date(article.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : ""}
                    </p>
                    <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-[#a78bfa] transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                    {article.excerpt && (
                      <p className="text-sm text-gray-300 line-clamp-2 mb-4 leading-relaxed">{article.excerpt}</p>
                    )}
                    <div className="flex items-center gap-1.5 text-[#a78bfa] text-sm font-medium group/link">
                      <span>Baca Selengkapnya</span>
                      <svg className="w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Article count */}
            <p className="text-center text-sm text-gray-400 mt-10">
              Menampilkan {articles.length} artikel
            </p>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center">
        <Link
          href="/"
          className="text-xs text-gray-500 hover:text-[#a78bfa] transition-colors"
        >
          &copy; {new Date().getFullYear()} PAGODA STUDIO &mdash; Jasa Pembuatan Website Profesional
        </Link>
      </footer>
    </main>
  );
}
