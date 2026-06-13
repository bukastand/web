"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { BuilderPage } from "@/lib/builder/types";
import { ElementRenderer } from "@/components/builder/elements/ElementRenderer";
import { fetchPublishedPage } from "@/lib/supabase/published";
import { applyBgOpacity } from "@/lib/builder/utils";

const SNAPSHOTS_PREFIX = "builder_published_snapshots_";

export default function PublishedPage() {
  const params = useParams();
  const [page, setPage] = useState<BuilderPage | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const slug = params.slug as string;

    // Option 1: Fetch from Supabase (public, accessible from any device)
    fetchPublishedPage(slug).then((result) => {
      if (result) {
        setPage(result);
        return;
      }

      // Option 2: Fallback to localStorage (backward compat, offline)
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (!key) continue;

          if (key.startsWith(SNAPSHOTS_PREFIX) || key === "builder_published_snapshots") {
            const raw = localStorage.getItem(key);
            if (!raw) continue;
            const snapshots: Record<string, BuilderPage> = JSON.parse(raw);
            const found = snapshots[slug];
            if (found?.published) {
              setPage(found);
              return;
            }
          }
        }

        // Legacy fallback
        const rawLegacy = localStorage.getItem("builder_pages_anonymous");
        if (rawLegacy) {
          const pages: BuilderPage[] = JSON.parse(rawLegacy);
          const found = pages.find((p) => p.slug === slug && p.published);
          if (found) {
            setPage(found);
            return;
          }
        }
        const rawOld = localStorage.getItem("builder_pages");
        if (rawOld) {
          const pages: BuilderPage[] = JSON.parse(rawOld);
          const found = pages.find((p) => p.slug === slug && p.published);
          if (found) {
            setPage(found);
            return;
          }
        }
      } catch {}

      setNotFound(true);
    });
  }, [params.slug]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Halaman Tidak Ditemukan</h1>
          <p className="text-gray-500 mb-6">Halaman yang kamu cari tidak tersedia atau belum dipublikasikan.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#22c55e]/20 text-[#22c55e] font-semibold rounded-xl border border-[#22c55e]/30 hover:bg-[#22c55e]/30 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  if (!page) {
    return <div className="min-h-screen bg-[#0f172a]" />;
  }

  const gs = page.globalStyles;
  const sectionBg = (s: any) => {
    const st: Record<string, string> = {};
    if (s.styles.backgroundColor && s.styles.backgroundColor !== "transparent") {
      st.backgroundColor = applyBgOpacity(s.styles.backgroundColor, s.styles.backgroundOpacity) || s.styles.backgroundColor;
    }
    if (s.styles.backgroundImage) {
      st.backgroundImage = s.styles.backgroundImage;
    }
    if (s.styles.backgroundSize) {
      st.backgroundSize = s.styles.backgroundSize;
    }
    if (s.styles.backgroundPosition) {
      st.backgroundPosition = s.styles.backgroundPosition;
    }
    return st;
  };

  const sectionPadding = (s: any) => {
    const p = s.styles.padding || "60px 0";
    return { padding: p };
  };

  return (
    <div
      style={{
        fontFamily: gs.fontFamily || "Inter, sans-serif",
        backgroundColor: gs.backgroundColor || "#ffffff",
        color: gs.textColor || "#1e293b",
        minHeight: "100vh",
      }}
    >
      {page.sections.map((section) => (
        <div key={section.id} style={{ ...sectionBg(section), ...sectionPadding(section) }}>
          <div
            style={{
              maxWidth: section.styles.containerWidth === "full" ? "100%" : `${gs.containerWidth || 1200}px`,
              margin: "0 auto",
              paddingLeft: "16px",
              paddingRight: "16px",
            }}
          >
            <div className="flex" style={{ gap: "16px", flexWrap: "wrap" }}>
              {section.columns.map((column) => (
                <div key={column.id} style={{ flex: `${(column.width / 12) * 100}%`, maxWidth: `${(column.width / 12) * 100}%`, minWidth: "280px" }}>
                  <div className="space-y-4">
                    {column.elements.map((element) => (
                      <div key={element.id}>
                        <ElementRenderer element={element} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Powered by footer */}
      <div className="text-center py-6 border-t border-gray-200">
        <Link
          href="https://pagodastudio.my.id"
          target="_blank"
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Dibuat dengan PAGODASTUDIO
        </Link>
      </div>
    </div>
  );
}
