"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { aiSectionToBuilder } from "@/lib/builder/defaults";
import { ElementRenderer } from "@/components/builder/elements/ElementRenderer";
import { applyBgOpacity, getContainerWidth } from "@/lib/builder/utils";
import type { BuilderSection } from "@/lib/builder/types";

interface SandboxPreviewProps {
  sectionsJson: string;
  showPreview: boolean;
}

export function SandboxPreview({ sectionsJson, showPreview }: SandboxPreviewProps) {
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [previewError, setPreviewError] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse JSON to BuilderSection[]
  const sections = useMemo(() => {
    if (!sectionsJson) return [];
    try {
      const data = JSON.parse(sectionsJson);
      const arr = Array.isArray(data) ? data : [data];
      return arr
        .filter((s: any) => s && typeof s === "object")
        .map((s: any) => {
          try {
            return aiSectionToBuilder(s);
          } catch {
            return null;
          }
        })
        .filter(Boolean) as BuilderSection[];
    } catch (e) {
      setPreviewError("Gagal parse JSON");
      return [];
    }
  }, [sectionsJson]);

  const viewportWidths: Record<string, string> = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  const sectionBg = (s: BuilderSection): React.CSSProperties => {
    const st: React.CSSProperties = {};
    if (s.styles.backgroundColor && s.styles.backgroundColor !== "transparent") {
      st.backgroundColor = applyBgOpacity(s.styles.backgroundColor, s.styles.backgroundOpacity) || s.styles.backgroundColor;
    }
    if (s.styles.padding) st.padding = s.styles.padding;
    return st;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-[#0f172a]/80">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-[10px] text-gray-600 ml-2">Preview</span>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Viewport buttons */}
          {(["desktop", "tablet", "mobile"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setViewport(v)}
              className={`p-1.5 rounded-md transition-all ${
                viewport === v
                  ? "bg-purple-500/20 text-purple-400"
                  : "text-gray-600 hover:text-gray-400"
              }`}
              title={v.charAt(0).toUpperCase() + v.slice(1)}
            >
              {v === "desktop" ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ) : v === "tablet" ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          ))}
          <div className="w-px h-4 bg-white/10 mx-1" />
          <span className="text-[9px] text-gray-600">
            {sections.length > 0 ? `${sections.length} section` : "Menunggu..."}
          </span>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-y-auto bg-gray-100">
        <div className="min-h-full flex justify-center py-8 px-4">
          {/* Viewport Frame */}
          <div
            ref={containerRef}
            className={`bg-white shadow-2xl rounded-2xl transition-all duration-300 ${
              viewport === "mobile" ? "overflow-x-hidden" : "overflow-hidden"
            }`}
            style={{
              width: viewportWidths[viewport],
              maxWidth: "100%",
              minHeight: "400px",
            }}
          >
            {!showPreview ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
                <div className="w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Preview Akan Muncul di Sini</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Tulis deskripsi website di panel kiri, lalu klik "Generate" untuk melihat preview langsung.
                </p>
                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                  {["📐 Planner", "✍️ Writer", "⚡ Coder", "✅ Reviewer", "🎨 Stylist"].map((agent) => (
                    <span key={agent} className="px-2.5 py-1 text-[10px] rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/20">
                      {agent}
                    </span>
                  ))}
                </div>
              </div>
            ) : sections.length === 0 ? (
              /* Loading state */
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
                <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm text-gray-600">AI sedang membangun website...</p>
                <p className="text-xs text-gray-400 mt-1">Preview akan muncul secara real-time</p>
              </div>
            ) : (
              /* Rendered sections */
              <div>
                {sections.map((section) => (
                  <div key={section.id} style={sectionBg(section)}>
                    <div
                      style={{
                        maxWidth: getContainerWidth(section.styles.containerWidth, 1200),
                        margin: "0 auto",
                        paddingLeft: "16px",
                        paddingRight: "16px",
                      }}
                    >
                      <div className="flex" style={{ gap: "16px", flexWrap: "wrap" }}>
                        {section.columns.map((col) => (
                          <div
                            key={col.id}
                            style={{
                              flex: `${(col.width / 12) * 100}%`,
                              maxWidth: `${(col.width / 12) * 100}%`,
                              minWidth: viewport === "mobile" ? "100%" : "280px",
                            }}
                          >
                            <div className="space-y-4">
                              {col.elements.map((el) => (
                                <div key={el.id}>
                                  <ElementRenderer element={el} />
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
            )}

            {/* Error state */}
            {previewError && (
              <div className="p-3 m-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                {previewError}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info bar */}
      {showPreview && sections.length > 0 && (
        <div className="px-4 py-2 border-t border-white/5 bg-[#0f172a]/80">
          <div className="flex items-center justify-between text-[10px] text-gray-600">
            <span>
              💡 Scroll untuk melihat hasil lengkap • Gunakan tombol viewport untuk responsive test
            </span>
            <span className="text-purple-400/50">
              {viewport === "desktop" ? "🖥️ Desktop" : viewport === "tablet" ? "📱 Tablet" : "📱 Mobile"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
