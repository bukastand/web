"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { type Article, fetchPublishedArticleBySlug } from "@/lib/supabase/articles";

function sanitizeArticleContent(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/[\s/]+on\w+\s*=\s*(['\"]).*?\1/gi, '')
    .replace(/[\s/]+on\w+\s*=\s*[^\s>]+/gi, '')
    .replace(/<\/?(?:script|iframe|object|embed|base)\b[^>]*>/gi, '');
}

function injectMetaTags(article: Article) {
  const siteName = "PAGODA STUDIO";
  const metaTitle = `${article.title} — ${siteName}`;
  const metaDesc = article.excerpt || `${article.title} — Artikel dan informasi dari ${siteName}`;
  const ogImage = article.cover_image || "https://pagodastudio.my.id/og-default.jpg";
  const canonical = `https://pagodastudio.my.id/blog/${article.slug}`;

  document.title = metaTitle;

  const setOrUpdate = (attr: string, value: string, content: string) => {
    let el = document.querySelector(`meta[${attr}="${value}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, value);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  };

  setOrUpdate("name", "description", metaDesc);
  setOrUpdate("property", "og:title", metaTitle);
  setOrUpdate("property", "og:description", metaDesc);
  setOrUpdate("property", "og:image", ogImage);
  setOrUpdate("property", "og:url", canonical);
  setOrUpdate("property", "og:type", "article");
  setOrUpdate("property", "og:site_name", siteName);
  setOrUpdate("property", "article:published_time", article.created_at || "");
  setOrUpdate("property", "article:author", article.author);
  setOrUpdate("name", "twitter:card", "summary_large_image");
  setOrUpdate("name", "twitter:title", metaTitle);
  setOrUpdate("name", "twitter:description", metaDesc);
  setOrUpdate("name", "twitter:image", ogImage);

  let canonEl = document.querySelector("link[rel='canonical']");
  if (!canonEl) {
    canonEl = document.createElement("link");
    canonEl.setAttribute("rel", "canonical");
    document.head.appendChild(canonEl);
  }
  canonEl.setAttribute("href", canonical);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: metaDesc,
    image: ogImage,
    author: { "@type": "Person", name: article.author },
    publisher: { "@type": "Organization", name: siteName, url: "https://pagodastudio.my.id" },
    datePublished: article.created_at,
    dateModified: article.updated_at || article.created_at,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
  };

  let scriptEl = document.getElementById("seo-jsonld");
  if (!scriptEl) {
    scriptEl = document.createElement("script");
    scriptEl.id = "seo-jsonld";
    scriptEl.setAttribute("type", "application/ld+json");
    document.head.appendChild(scriptEl);
  }
  scriptEl.textContent = JSON.stringify(jsonLd);
}

export default function ArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [currentUrl, setCurrentUrl] = useState("");
  const metaInjectedRef = useRef(false);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  useEffect(() => {
    const slug = params.slug as string;
    fetchPublishedArticleBySlug(slug).then(async (result) => {
      if (result) {
        setArticle(result);
        const { fetchPublishedArticles } = await import("@/lib/supabase/articles");
        const all = await fetchPublishedArticles();
        setRelatedArticles(all.filter((a) => a.slug !== slug).slice(0, 3));
      } else {
        setNotFound(true);
      }
    });
  }, [params.slug]);

  useEffect(() => {
    if (article && !metaInjectedRef.current) {
      injectMetaTags(article);
      metaInjectedRef.current = true;
    }
  }, [article]);

  if (notFound) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-3xl bg-surface border border-line flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="heading-md mb-2">Artikel Tidak Ditemukan</h1>
          <p className="text-muted mb-6">Artikel yang kamu cari tidak tersedia atau belum dipublikasikan.</p>
          <Link href="/blog" className="btn-primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Blog
          </Link>
        </div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <article className="max-w-4xl mx-auto px-6 pt-32 pb-12 sm:pt-40 sm:pb-16">
        <div className="bg-white border border-line rounded-2xl p-6 sm:p-8 lg:p-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted mb-6">
            <Link href="/" className="hover:text-accent transition-colors">Beranda</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-accent transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-faint truncate max-w-[200px]">{article.title}</span>
          </nav>

          {/* Cover Image */}
          {article.cover_image && (
            <div className="aspect-[21/9] rounded-2xl overflow-hidden mb-8 border border-line">
              <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-4">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {article.created_at
                ? new Date(article.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : ""}
            </span>
          </div>

          {/* Title */}
          <h1 className="heading-lg mb-6">
            {article.title}
          </h1>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-lg text-muted mb-8 leading-relaxed border-l-4 border-accent/50 pl-4">
              {article.excerpt}
            </p>
          )}

          {/* Divider */}
          <div className="h-px bg-line mb-8" />

          {/* Content */}
          {article.content ? (
            <div
              className="prose prose-lg max-w-none
                prose-headings:text-ink prose-headings:font-bold
                prose-p:text-[#444444] prose-p:leading-relaxed
                prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:border prose-img:border-line
                prose-blockquote:border-accent prose-blockquote:text-[#555555] prose-blockquote:bg-surface prose-blockquote:rounded-r-xl
                prose-strong:text-ink
                prose-code:text-accent prose-code:bg-surface prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-surface prose-pre:border prose-pre:border-line
                prose-li:text-[#444444]
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-ink
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-ink"
              dangerouslySetInnerHTML={{ __html: sanitizeArticleContent(article.content) }}
            />
          ) : (
            <p className="text-faint italic">Tidak ada konten artikel.</p>
          )}

          {/* Divider */}
          <div className="h-px bg-line my-12" />

          {/* Share */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">Bagikan artikel:</span>
            <div className="flex items-center gap-2">
              {[
                { label: "WhatsApp", url: `https://wa.me/?text=${encodeURIComponent(`${article.title} - ${currentUrl}`)}` },
                { label: "Facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}` },
                { label: "Twitter", url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(currentUrl)}` },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-surface border border-line rounded-lg text-xs text-muted hover:text-accent hover:border-accent/30 transition-all"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="h-px bg-line mb-12" />
          <h2 className="heading-md mb-8 text-center">
            Artikel <span className="text-accent">Terkait</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((related) => (
              <Link
                key={related.id}
                href={`/blog/${related.slug}`}
                className="group card-premium overflow-hidden"
              >
                {related.cover_image ? (
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={related.cover_image} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                ) : (
                  <div className="aspect-[16/9] bg-surface flex items-center justify-center">
                    <svg className="w-8 h-8 text-fainter" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                )}
                <div className="p-4 bg-white">
                  <p className="text-xs text-faint mb-1">
                    {related.created_at
                      ? new Date(related.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : ""}
                  </p>
                  <h3 className="text-ink font-semibold line-clamp-2 group-hover:text-accent transition-colors">
                    {related.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
