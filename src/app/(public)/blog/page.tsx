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
    <main className="min-h-dvh bg-white">
      <div className="max-w-7xl mx-auto px-6 pt-40 pb-24">
        {/* Page Title */}
        <div className="mb-16 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-faint mb-8">
            <span className="text-accent">Blog</span> · Artikel &amp; Informasi
          </p>
          <h1 className="heading-xl">
            Wawasan seputar <span className="text-accent">website</span> dan bisnis digital
          </h1>
          <p className="text-lg text-muted leading-relaxed mt-7 text-pretty">
            Temukan tips, trik, dan wawasan terbaru seputar website, digital marketing,
            dan teknologi.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-line rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[16/9] bg-surface2" />
                <div className="p-5 space-y-3 bg-white">
                  <div className="w-3/4 h-4 bg-surface2 rounded" />
                  <div className="w-full h-3 bg-surface2 rounded" />
                  <div className="w-1/2 h-3 bg-surface2 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && articles.length === 0 && (
          <div className="text-center py-20 border-t border-line">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-surface border border-line flex items-center justify-center mt-16">
              <svg className="w-10 h-10 text-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h2 className="heading-md mb-2">Belum ada artikel</h2>
            <p className="text-muted">Artikel baru sedang disiapkan. Kunjungi lagi nanti.</p>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && articles.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, idx) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group flex flex-col border-t border-line pt-5"
                >
                  <p className="text-xs text-faint mb-3 tabular-nums">
                    {article.created_at
                      ? new Date(article.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : ""}
                  </p>
                  <div className="overflow-hidden rounded-xl border border-line aspect-[16/9] mb-4">
                    {article.cover_image ? (
                      <img
                        src={article.cover_image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        loading={idx < 3 ? "eager" : "lazy"}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-surface">
                        <svg className="w-12 h-12 text-fainter" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h2 className="text-lg font-semibold text-ink tracking-tight mb-2 group-hover:text-accent transition-colors line-clamp-2 text-balance">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="text-sm text-muted line-clamp-2 leading-relaxed">{article.excerpt}</p>
                  )}
                </Link>
              ))}
            </div>

            <p className="text-sm text-faint mt-14 pt-6 border-t border-line">
              Menampilkan {articles.length} artikel
            </p>
          </>
        )}
      </div>
    </main>
  );
}
