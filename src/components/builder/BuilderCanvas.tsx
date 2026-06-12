"use client";

import { useBuilder } from "@/lib/builder/store";
import BuilderSection from "./BuilderSection";

const viewportWidths: Record<string, string> = {
  desktop: "max-w-[1200px]",
  tablet: "max-w-[768px]",
  mobile: "max-w-[375px]",
};

export default function BuilderCanvas({
  viewport = "desktop",
  isFullscreen = false,
  onExitFullscreen,
}: {
  viewport?: "desktop" | "tablet" | "mobile";
  isFullscreen?: boolean;
  onExitFullscreen?: () => void;
}) {
  const { currentPage, dispatch } = useBuilder();

  if (!currentPage) return null;

  const handleAddSection = () => {
    dispatch({ type: "ADD_SECTION", pageId: currentPage.id });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0a0f1e] relative">
      {/* Fullscreen exit button */}
      {isFullscreen && onExitFullscreen && (
        <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
          <button
            onClick={onExitFullscreen}
            className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] border border-white/10 text-white text-sm font-medium rounded-xl hover:bg-[#334155] transition-all shadow-xl backdrop-blur-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Keluar Preview
          </button>
        </div>
      )}

      {/* Viewport indicator in fullscreen */}
      {isFullscreen && (
        <div className="fixed top-4 right-4 z-50">
          <span className="px-3 py-1.5 bg-[#1e293b] border border-white/10 text-[10px] text-gray-400 rounded-lg uppercase tracking-wider shadow-xl backdrop-blur-sm">
            {viewport === "desktop" ? "Desktop" : viewport === "tablet" ? "Tablet" : "Mobile"}
          </span>
        </div>
      )}

      <div className={`min-h-full flex flex-col items-center py-8 ${isFullscreen ? "pt-16" : ""}`}>
        {/* Canvas frame with responsive width */}
        <div className={`w-full ${viewportWidths[viewport] || "max-w-[1200px]"} transition-all duration-300 ${isFullscreen ? "" : ""}`}>
          {/* Viewport frame in fullscreen */}
          {isFullscreen && viewport !== "desktop" && (
            <div className="mb-4 px-4">
              <div className="rounded-2xl border border-white/10 bg-[#0f172a] px-3 py-2 flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs text-gray-600 ml-2">{viewportWidths[viewport]?.replace("max-w-", "")}</span>
              </div>
            </div>
          )}

          {/* Empty state */}
          {currentPage.sections.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-24 h-24 rounded-3xl bg-white/5 border border-dashed border-white/20 flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Mulai Membangun Halaman</h3>
              <p className="text-gray-400 max-w-md mb-8">
                Drag element dari sidebar ke canvas, atau klik tombol di bawah untuk menambahkan section pertama
              </p>
              <button
                onClick={handleAddSection}
                className="px-6 py-3 bg-[#22c55e]/20 text-[#22c55e] font-semibold rounded-xl border border-[#22c55e]/30 hover:bg-[#22c55e]/30 transition-all"
              >
                + Tambah Section
              </button>
            </div>
          )}

          {/* Sections */}
          {currentPage.sections.map((section, index) => (
            <div key={section.id} className="mb-4">
              <BuilderSection section={section} sectionIndex={index} pageId={currentPage.id} />
            </div>
          ))}

          {/* Add section button */}
          {currentPage.sections.length > 0 && (
            <div className="flex justify-center py-6">
              <button
                onClick={handleAddSection}
                className="group flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-dashed border-white/10 text-gray-500 hover:text-[#22c55e] hover:border-[#22c55e]/40 transition-all text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Tambah Section
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
