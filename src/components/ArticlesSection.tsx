"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { type Article, fetchPublishedArticles } from "@/lib/supabase/articles";

export default function ArticlesSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublishedArticles().then((data) => {
      setArticles(data.slice(0, 6));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-24 h-3 bg-[#f0f0f0] rounded-full mx-auto animate-pulse" />
            <div className="w-48 h-8 bg-[#f0f0f0] rounded-full mx-auto mt-4 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-[#eeeeee] rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[16/9] bg-[#f0f0f0]" />
                <div className="p-5 space-y-3">
                  <div className="w-3/4 h-4 bg-[#f0f0f0] rounded" />
                  <div className="w-full h-3 bg-[#f0f0f0] rounded" />
                  <div className="w-1/2 h-3 bg-[#f0f0f0] rounded" />
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
    <section className="section-padding bg-[#f8f8f8]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12 reveal">
          <span className="badge-premium mb-4 inline-flex">Blog & Artikel</span>
          <h2 className="heading-lg mb-4">
            Artikel & <span className="text-[#2563eb]">Informasi</span>
          </h2>
          <p className="body-lg max-w-2xl mx-auto">
            Tips, trik, dan informasi terbaru seputar website, digital marketing, dan teknologi untuk mengembangkan bisnis Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, idx) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="reveal group card-premium overflow-hidden"
            >
              <div className="aspect-[16/9] overflow-hidden bg-[#f8f8f8]">
                {article.cover_image ? (
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading={idx < 3 ? "eager" : "lazy"}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-[#cccccc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="p-5">
                <p className="text-xs text-[#999999] mb-2">
                  {article.created_at
                    ? new Date(article.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : ""}
                </p>
                <h3 className="text-lg font-semibold text-[#111111] mb-2 group-hover:text-[#2563eb] transition-colors line-clamp-2">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-sm text-[#666666] line-clamp-2 mb-4">
                    {article.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-1.5 text-[#2563eb] text-sm font-medium group/link">
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

        {articles.length >= 6 && (
          <div className="text-center mt-10">
            <Link
              href="/blog"
              className="btn-secondary"
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
