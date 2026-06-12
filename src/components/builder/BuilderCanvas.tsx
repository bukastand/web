"use client";

import { useBuilder } from "@/lib/builder/store";
import BuilderSection from "./BuilderSection";

export default function BuilderCanvas() {
  const { currentPage, dispatch } = useBuilder();

  if (!currentPage) return null;

  const handleAddSection = () => {
    dispatch({ type: "ADD_SECTION", pageId: currentPage.id });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0a0f1e]">
      <div className="min-h-full flex flex-col items-center py-8">
        {/* Canvas frame */}
        <div className="w-full max-w-[1200px]">
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
