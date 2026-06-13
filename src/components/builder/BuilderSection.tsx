"use client";

import { useDroppable } from "@dnd-kit/core";
import { useBuilder } from "@/lib/builder/store";
import BuilderColumn from "./BuilderColumn";
import type { BuilderSection as BuilderSectionType } from "@/lib/builder/types";

function SectionControls({
  sectionId,
  pageId,
  sectionIndex,
  totalSections,
}: {
  sectionId: string;
  pageId: string;
  sectionIndex: number;
  totalSections: number;
}) {
  const { dispatch } = useBuilder();

  return (
    <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#1e293b] border border-white/10 shadow-lg">
        <button
          onClick={() => dispatch({ type: "ADD_COLUMN", pageId, sectionId })}
          className="p-1 text-gray-400 hover:text-white transition-colors"
          title="Tambah Kolom"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <div className="w-px h-4 bg-white/10" />
        <button
          onClick={() => dispatch({ type: "DUPLICATE_SECTION", pageId, sectionId })}
          className="p-1 text-gray-400 hover:text-white transition-colors"
          title="Duplikat Section"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        <div className="w-px h-4 bg-white/10" />
        <button
          onClick={() => {
            if (sectionIndex > 0) {
              dispatch({ type: "MOVE_SECTION", pageId, sectionId, toIndex: sectionIndex - 1 });
            }
          }}
          disabled={sectionIndex === 0}
          className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Pindah ke Atas"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          onClick={() => {
            if (sectionIndex < totalSections - 1) {
              dispatch({ type: "MOVE_SECTION", pageId, sectionId, toIndex: sectionIndex + 1 });
            }
          }}
          disabled={sectionIndex === totalSections - 1}
          className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Pindah ke Bawah"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className="w-px h-4 bg-white/10" />
        <button
          onClick={() => dispatch({ type: "REMOVE_SECTION", pageId, sectionId })}
          className="p-1 text-red-400 hover:text-red-300 transition-colors"
          title="Hapus Section"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function BuilderSectionComponent({
  section,
  sectionIndex,
  pageId,
}: {
  section: BuilderSectionType;
  sectionIndex: number;
  pageId: string;
}) {
  const { currentPage, dispatch } = useBuilder();
  const totalSections = currentPage?.sections.length ?? 0;
  const { setNodeRef, isOver } = useDroppable({
    id: `section-${section.id}`,
    data: { type: "section", sectionId: section.id },
  });

  const bgStyle: React.CSSProperties = {};
  if (section.styles.backgroundColor && section.styles.backgroundColor !== "transparent") {
    bgStyle.backgroundColor = section.styles.backgroundColor;
  }
  if (section.styles.backgroundImage) {
    bgStyle.backgroundImage = section.styles.backgroundImage as React.CSSProperties['backgroundImage'];
  }
  if (section.styles.backgroundSize) {
    bgStyle.backgroundSize = section.styles.backgroundSize as React.CSSProperties['backgroundSize'];
  }
  if (section.styles.backgroundPosition) {
    bgStyle.backgroundPosition = section.styles.backgroundPosition as React.CSSProperties['backgroundPosition'];
  }

  return (
    <div
      ref={setNodeRef}
      className={`group relative rounded-xl border-2 transition-all ${
        isOver ? "border-[#22c55e]/50 bg-[#22c55e]/5" : "border-transparent hover:border-gray-200"
      }`}
    >
      <SectionControls
        sectionId={section.id}
        pageId={pageId}
        sectionIndex={sectionIndex}
        totalSections={totalSections}
      />

      {/* Section Style Controls */}
      <div className="absolute -right-10 top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <div className="p-2 rounded-lg bg-[#1e293b] border border-white/10 shadow-lg">
          {/* Background Color */}
          <div className="flex items-center gap-1 mb-1.5">
            <input
              type="color"
              value={section.styles.backgroundColor && section.styles.backgroundColor !== "transparent" ? section.styles.backgroundColor : "#0f172a"}
              onChange={(e) => dispatch({ type: "UPDATE_SECTION_STYLES", pageId, sectionId: section.id, styles: { backgroundColor: e.target.value } })}
              className="w-6 h-6 rounded cursor-pointer border-0 p-0"
              title="Warna Background"
            />
            <input
              type="text"
              value={section.styles.backgroundColor === "transparent" ? "" : section.styles.backgroundColor || ""}
              onChange={(e) => dispatch({ type: "UPDATE_SECTION_STYLES", pageId, sectionId: section.id, styles: { backgroundColor: e.target.value || "transparent" } })}
              className="w-16 px-1 py-0.5 rounded bg-white/10 text-white text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-[#22c55e]/50"
              placeholder="#hex"
            />
          </div>
          {/* Quick colors */}
          <div className="flex gap-0.5 flex-wrap mb-1.5">
            {["#0f172a", "#1e293b", "#f8fafc", "#ffffff", "transparent"].map((c) => (
              <button
                key={c}
                onClick={() => dispatch({ type: "UPDATE_SECTION_STYLES", pageId, sectionId: section.id, styles: { backgroundColor: c } })}
                className={`w-3.5 h-3.5 rounded-sm border ${c === "transparent" ? "border-dashed border-white/30 bg-transparent" : "border-white/10"}`}
                style={{ backgroundColor: c === "transparent" ? "transparent" : c }}
                title={c}
              />
            ))}
          </div>
          {/* Background Image URL */}
          <input
            type="text"
            value={section.styles.backgroundImage || ""}
            onChange={(e) => dispatch({ type: "UPDATE_SECTION_STYLES", pageId, sectionId: section.id, styles: { backgroundImage: e.target.value || undefined } })}
            className="w-full px-1.5 py-0.5 rounded bg-white/10 text-white text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-[#22c55e]/50 placeholder:text-gray-600"
            placeholder="url(...) atau gradient(...)"
          />
          {/* Background Size */}
          <div className="flex items-center gap-1 mt-1.5">
            <span className="text-[9px] text-gray-500 flex-shrink-0">Size:</span>
            <select
              value={section.styles.backgroundSize || ""}
              onChange={(e) => dispatch({ type: "UPDATE_SECTION_STYLES", pageId, sectionId: section.id, styles: { backgroundSize: e.target.value || undefined } })}
              className="flex-1 px-1 py-0.5 rounded bg-white/10 text-white text-[10px] focus:outline-none focus:ring-1 focus:ring-[#22c55e]/50"
              style={{ colorScheme: 'dark' }}
            >
              <option value="" className="bg-[#1e293b] text-white">Default</option>
              <option value="cover" className="bg-[#1e293b] text-white">Cover</option>
              <option value="contain" className="bg-[#1e293b] text-white">Contain</option>
              <option value="auto" className="bg-[#1e293b] text-white">Auto</option>
            </select>
          </div>
          {/* Background Position */}
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[9px] text-gray-500 flex-shrink-0">Pos:</span>
            <input
              type="text"
              value={section.styles.backgroundPosition || ""}
              onChange={(e) => dispatch({ type: "UPDATE_SECTION_STYLES", pageId, sectionId: section.id, styles: { backgroundPosition: e.target.value || undefined } })}
              className="flex-1 px-1 py-0.5 rounded bg-white/10 text-white text-[10px] font-mono focus:outline-none focus:ring-1 focus:ring-[#22c55e]/50 placeholder:text-gray-600"
              placeholder="center"
            />
          </div>
        </div>
      </div>

      {/* Section content with padding */}
      <div
        style={bgStyle}
        className="rounded-xl"
      >
        {/* Section Padding Controls */}
        <div className="flex items-center justify-center gap-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => {
              const current = parseInt(section.styles.padding || "80px") || 80;
              dispatch({
                type: "UPDATE_SECTION_STYLES",
                pageId,
                sectionId: section.id,
                styles: { padding: `${Math.max(20, current - 20)}px 0` },
              });
            }}
            className="text-[10px] text-gray-500 hover:text-white transition-colors"
            title="Kurangi Padding"
          >
            ▲ Kurangi
          </button>
          <span className="text-[10px] text-gray-600">{section.styles.padding || "80px 0"}</span>
          <button
            onClick={() => {
              const current = parseInt(section.styles.padding || "80px") || 80;
              dispatch({
                type: "UPDATE_SECTION_STYLES",
                pageId,
                sectionId: section.id,
                styles: { padding: `${Math.min(200, current + 20)}px 0` },
              });
            }}
            className="text-[10px] text-gray-500 hover:text-white transition-colors"
            title="Tambah Padding"
          >
            ▼ Tambah
          </button>
        </div>

        {/* Columns */}
        <div
          className="mx-auto"
          style={{ maxWidth: section.styles.containerWidth === "full" ? "100%" : "1200px", paddingLeft: "16px", paddingRight: "16px" }}
        >
          <div className="flex gap-4" style={{ minHeight: "60px", flexWrap: "wrap" }}>
            {section.columns.map((column, colIndex) => (
              <div key={column.id} className="flex-1" style={{ maxWidth: `${(column.width / 12) * 100}%`, minWidth: "280px" }}>
                <BuilderColumn
                  column={column}
                  columnIndex={colIndex}
                  sectionId={section.id}
                  pageId={pageId}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="h-2 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
