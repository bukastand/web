"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { type Article, fetchPublishedArticles } from "@/lib/supabase/articles";

export default function ArticlesSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublishedArticles().then((data) => {
      setArticles(data.slice(0, 6)); // Max 6 articles on landing page
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className="relative py-20 sm:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-24 h-3 bg-white/5 rounded-full mx-auto animate-pulse" />
            <div className="w-48 h-8 bg-white/5 rounded-full mx-auto mt-4 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
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
        </div>
      </section>
    );
  }

  if (articles.length === 0) return null;

  return (
    <section className="relative py-20 sm:py-28 px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-transparent to-[#0f172a] opacity-60 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-[#a78bfa]/10 text-[#a78bfa] text-sm font-medium rounded-full border border-[#a78bfa]/20 mb-4">
            Blog & Artikel
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Artikel & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] to-[#c084fc]">Informasi</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Tips, trik, dan informasi terbaru seputar website, digital marketing, dan teknologi untuk mengembangkan bisnis Anda.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, idx) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#a78bfa]/30 hover:bg-white/[0.07] transition-all duration-300"
            >
              {/* Cover Image */}
              <div className="aspect-[16/9] overflow-hidden bg-[#0a0f1e]">
                {article.cover_image ? (
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading={idx < 3 ? "eager" : "lazy"}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Date */}
                <p className="text-xs text-gray-400 mb-2">
                  {article.created_at
                    ? new Date(article.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : ""}
                </p>

                {/* Title */}
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#a78bfa] transition-colors line-clamp-2">
                  {article.title}
                </h3>

                {/* Excerpt */}
                {article.excerpt && (
                  <p className="text-sm text-gray-300 line-clamp-2 mb-4">
                    {article.excerpt}
                  </p>
                )}

                {/* Read More */}
                <div className="flex items-center gap-1.5 text-[#a78bfa] text-sm font-medium group/link">
                  <span>Baca Selengkapnya</span>
                  <svg
                    className="w-4 h-4 transition-transform group-hover/link:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        {articles.length >= 6 && (
          <div className="text-center mt-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 hover:border-white/20 transition-all"
            >
              Lihat Semua Artikel
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
