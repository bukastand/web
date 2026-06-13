"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { BuilderPage } from "@/lib/builder/types";
import { ElementRenderer } from "@/components/builder/elements/ElementRenderer";

export default function PreviewPage() {
  const params = useParams();
  const [page, setPage] = useState<BuilderPage | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("builder_pages");
      if (raw) {
        const pages: BuilderPage[] = JSON.parse(raw);
        const found = pages.find((p) => p.id === params.pageId);
        if (found) setPage(found);
        else setNotFound(true);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    }
  }, [params.pageId]);

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Halaman Tidak Ditemukan</h1>
          <a href="/builder" className="text-[#22c55e] hover:underline">Kembali ke Builder</a>
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
      st.backgroundColor = s.styles.backgroundColor;
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
    </div>
  );
}
