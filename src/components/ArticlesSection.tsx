"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { type Article, fetchPublishedArticles } from "@/lib/supabase/articles";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import { ArrowRightIcon } from "@/lib/icons";

function formatDate(date: string | undefined) {
  return date
    ? new Date(date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
}

function Cover({ article, eager = false }: { article: Article; eager?: boolean }) {
  return (
    <div className="aspect-[16/9] overflow-hidden bg-surface">
      {article.cover_image ? (
        <img
          src={article.cover_image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          loading={eager ? "eager" : "lazy"}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <svg className="w-12 h-12 text-fainter" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
      )}
    </div>
  );
}

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
      <section className="section-padding bg-white border-t border-line px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-14">
            <div className="w-28 h-3 bg-surface2 rounded-full" />
            <div className="w-72 h-9 bg-surface2 rounded-lg mt-5" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-line rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[16/9] bg-surface2" />
                <div className="p-5 space-y-3">
                  <div className="w-3/4 h-4 bg-surface2 rounded" />
                  <div className="w-full h-3 bg-surface2 rounded" />
                  <div className="w-1/2 h-3 bg-surface2 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (articles.length === 0) return null;

  const [featured, ...rest] = articles;

  return (
    <section className="section-padding bg-white border-t border-line">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          index="07"
          eyebrow="Blog"
          title={
            <>
              Artikel &amp; <span className="text-muted">Informasi</span>
            </>
          }
          description="Tips, trik, dan informasi terbaru seputar website, digital marketing, dan teknologi untuk mengembangkan bisnis Anda."
          action={
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-accent"
            >
              Semua artikel
              <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          }
          className="mb-14"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Featured article */}
          <Reveal>
            <Link
              href={`/blog/${featured.slug}`}
              className="group flex flex-col border-t border-line pt-6"
            >
              <p className="font-mono text-xs text-faint uppercase tracking-[0.14em] mb-4">
                {formatDate(featured.created_at)}
              </p>
              <h3 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight leading-snug mb-4 transition-colors duration-300 group-hover:text-accent text-balance">
                {featured.title}
              </h3>
              {featured.excerpt && (
                <p className="text-sm text-muted leading-relaxed line-clamp-3 mb-6 text-pretty">
                  {featured.excerpt}
                </p>
              )}
              <div className="mt-auto overflow-hidden rounded-xl border border-line">
                <Cover article={featured} eager />
              </div>
            </Link>
          </Reveal>

          {/* Remaining articles */}
          <div className="flex flex-col">
            {rest.slice(0, 4).map((article, idx) => (
              <Reveal key={article.id} delay={idx * 0.06} y={16}>
                <Link
                  href={`/blog/${article.slug}`}
                  className="group grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_180px] gap-5 items-start border-t border-line py-6 transition-colors duration-300"
                >
                  <div>
                    <p className="text-xs text-faint mb-2">{formatDate(article.created_at)}</p>
                    <h3 className="text-base font-semibold text-ink mb-1.5 transition-colors duration-300 group-hover:text-accent line-clamp-2">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-sm text-muted line-clamp-1">{article.excerpt}</p>
                    )}
                  </div>
                  <div className="hidden sm:block overflow-hidden rounded-lg border border-line w-[160px]">
                    <Cover article={article} />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
