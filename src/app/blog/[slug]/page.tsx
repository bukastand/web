"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { type Article, fetchPublishedArticleBySlug } from "@/lib/supabase/articles";

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
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: "https://pagodastudio.my.id",
    },
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
      <main className="min-h-screen bg-[#08080f] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Artikel Tidak Ditemukan</h1>
          <p className="text-gray-400 mb-6">Artikel yang kamu cari tidak tersedia atau belum dipublikasikan.</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#a78bfa]/20 text-[#a78bfa] font-semibold rounded-xl border border-[#a78bfa]/30 hover:bg-[#a78bfa]/30 transition-all"
          >
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
      <main className="min-h-screen bg-[#08080f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#a78bfa] border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08080f]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#08080f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold text-white">
            PAGODA<span className="text-[#a78bfa]"> STUDIO</span>
          </Link>
          <Link
            href="/blog"
            className="text-sm text-gray-400 hover:text-[#a78bfa] transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Blog
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-[#a78bfa] transition-colors">Beranda</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#a78bfa] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-gray-400 truncate max-w-[200px]">{article.title}</span>
        </nav>

        {/* Cover Image */}
        {article.cover_image && (
          <div className="aspect-[21/9] rounded-2xl overflow-hidden mb-8 border border-white/10 shadow-lg shadow-black/30">
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#a78bfa]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {article.author}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-[#2dd4bf]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          {article.title}
        </h1>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-lg text-gray-300 mb-8 leading-relaxed border-l-4 border-[#a78bfa]/50 pl-4">
            {article.excerpt}
          </p>
        )}

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-[#a78bfa]/50 via-white/10 to-transparent mb-8" />

        {/* Content - Rendered HTML */}
        {article.content ? (
          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:text-white prose-headings:font-bold
              prose-p:text-gray-200 prose-p:leading-relaxed
              prose-a:text-[#a78bfa] prose-a:no-underline hover:prose-a:underline prose-a:font-medium
              prose-img:rounded-xl prose-img:border prose-img:border-white/10 prose-img:shadow-lg
              prose-blockquote:border-[#a78bfa] prose-blockquote:text-gray-300 prose-blockquote:bg-[#a78bfa]/5 prose-blockquote:rounded-r-xl
              prose-strong:text-white
              prose-code:text-[#a78bfa] prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10
              prose-li:text-gray-200
              prose-ul:my-4 prose-ol:my-4
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        ) : (
          <p className="text-gray-400 italic">Tidak ada konten artikel.</p>
        )}

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-12" />

        {/* Share */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">Bagikan artikel:</span>
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
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white hover:border-[#a78bfa]/30 hover:bg-[#a78bfa]/10 transition-all"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Artikel <span className="gradient-text">Terkait</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((related) => (
              <Link
                key={related.id}
                href={`/blog/${related.slug}`}
                className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-[#a78bfa]/30 transition-all duration-300 hover:-translate-y-1"
              >
                {related.cover_image ? (
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={related.cover_image}
                      alt={related.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/9] bg-[#0d0d1a] flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                )}
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">
                    {related.created_at
                      ? new Date(related.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : ""}
                  </p>
                  <h3 className="text-white font-semibold line-clamp-2 group-hover:text-[#a78bfa] transition-colors">
                    {related.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

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
