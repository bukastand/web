"use client";

import { useDroppable } from "@dnd-kit/core";
import { useBuilder } from "@/lib/builder/store";
import BuilderColumn from "./BuilderColumn";
import type { BuilderSection as BuilderSectionType } from "@/lib/builder/types";
import { applyBgOpacity, getContainerWidth } from "@/lib/builder/utils";
import { genId } from "@/lib/builder/defaults";

const SECTION_QUICK_COLORS = [
  { label: "Dark", value: "#0f172a" },
  { label: "Slate", value: "#1e293b" },
  { label: "Light", value: "#f8fafc" },
  { label: "Putih", value: "#ffffff" },
  { label: "Hijau", value: "#22c55e" },
  { label: "Biru", value: "#3b82f6" },
  { label: "Ungu", value: "#8b5cf6" },
  { label: "Merah", value: "#ef4444" },
  { label: "Kuning", value: "#eab308" },
  { label: "Pink", value: "#ec4899" },
  { label: "Orange", value: "#f97316" },
  { label: "Teal", value: "#14b8a6" },
  { label: "Abu", value: "#64748b" },
  { label: "Hitam", value: "#000000" },
];

function SectionControls({
  section,
  pageId,
  sectionIndex,
  totalSections,
  isSelected,
}: {
  section: BuilderSectionType;
  pageId: string;
  sectionIndex: number;
  totalSections: number;
  isSelected: boolean;
}) {
  const { dispatch, currentPage } = useBuilder();

  const cw = section.styles.containerWidth || "boxed";
  const gw = currentPage?.globalStyles.containerWidth || 1200;

  const containerOptions: { key: "narrow" | "boxed" | "wide" | "full"; label: string; desc: string }[] = [
    { key: "narrow", label: "N", desc: "Narrow" },
    { key: "boxed", label: `${gw}px`, desc: `Boxed (${gw}px)` },
    { key: "wide", label: "W", desc: "Wide" },
    { key: "full", label: "F", desc: "Full Width" },
  ];

  return (
    <div className={`flex items-center gap-1 transition-opacity z-20 ${isSelected ? "opacity-100 mb-2 flex-wrap" : "opacity-60 mb-2 flex-wrap md:opacity-0 md:group-hover:opacity-100 md:absolute md:-top-10 md:left-1/2 md:-translate-x-1/2"}`}>
      <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#1e293b] border border-white/10 shadow-lg">
        {/* Background Color */}
        <input
          type="color"
          value={section.styles.backgroundColor && section.styles.backgroundColor !== "transparent" ? section.styles.backgroundColor : "#0f172a"}
          onChange={(e) => dispatch({ type: "UPDATE_SECTION_STYLES", pageId, sectionId: section.id, styles: { backgroundColor: e.target.value } })}
          className="w-8 h-8 md:w-5 md:h-5 rounded-lg md:rounded cursor-pointer border-0 p-0 flex-shrink-0"
          title="Warna Background (pilih dengan pen)"
        />
        <div className="hidden md:flex gap-0.5 flex-wrap">
          {SECTION_QUICK_COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => dispatch({ type: "UPDATE_SECTION_STYLES", pageId, sectionId: section.id, styles: { backgroundColor: c.value } })}
              className="w-5 h-5 md:w-3 md:h-3 rounded-md md:rounded-sm border border-white/10 hover:scale-110 transition-transform"
              style={{ backgroundColor: c.value }}
              title={c.label}
            />
          ))}
        </div>
        <div className="w-px h-4 bg-white/10" />
        {/* Container Width */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {containerOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => dispatch({ type: "UPDATE_SECTION_STYLES", pageId, sectionId: section.id, styles: { containerWidth: opt.key } })}
              className={`px-2.5 py-1.5 md:px-1.5 md:py-0.5 text-[10px] md:text-[9px] font-medium rounded-lg md:rounded-sm transition-all ${
                cw === opt.key
                  ? "bg-[#22c55e]/20 text-[#22c55e]"
                  : "text-gray-500 hover:text-white"
              }`}
              title={opt.desc}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="w-px h-4 bg-white/10" />
        {/* Tambah Kolom */}
        <button
          onClick={() => dispatch({ type: "ADD_COLUMN", pageId, sectionId: section.id })}
          className="p-1.5 md:p-1 text-gray-400 hover:text-white transition-colors"
          title="Tambah Kolom"
        >
          <svg className="w-5 h-5 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <div className="w-px h-4 bg-white/10" />
        {/* Tambah Row */}
        <button
          onClick={() => dispatch({ type: "ADD_ROW", pageId, sectionId: section.id })}
          className="p-1.5 md:p-1 text-gray-400 hover:text-[#22c55e] transition-colors"
          title="Tambah Row"
        >
          <svg className="w-5 h-5 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="7" rx="1" strokeWidth={1.5} />
            <rect x="3" y="14" width="18" height="7" rx="1" strokeWidth={1.5} />
          </svg>
        </button>
        <div className="w-px h-4 bg-white/10" />
        {/* Duplicate */}
        <button
          onClick={() => dispatch({ type: "DUPLICATE_SECTION", pageId, sectionId: section.id })}
          className="p-1.5 md:p-1 text-gray-400 hover:text-white transition-colors"
          title="Duplikat Section"
        >
          <svg className="w-5 h-5 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        <div className="w-px h-4 bg-white/10" />
        {/* Pindah */}
        <button
          onClick={() => {
            if (sectionIndex > 0) {
              dispatch({ type: "MOVE_SECTION", pageId, sectionId: section.id, toIndex: sectionIndex - 1 });
            }
          }}
          disabled={sectionIndex === 0}
          className="p-1.5 md:p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Pindah ke Atas"
        >
          <svg className="w-5 h-5 md:w-3 md:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          onClick={() => {
            if (sectionIndex < totalSections - 1) {
              dispatch({ type: "MOVE_SECTION", pageId, sectionId: section.id, toIndex: sectionIndex + 1 });
            }
          }}
          disabled={sectionIndex === totalSections - 1}
          className="p-1.5 md:p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Pindah ke Bawah"
        >
          <svg className="w-5 h-5 md:w-3 md:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className="w-px h-4 bg-white/10" />
        {/* Hapus */}
        <button
          onClick={() => dispatch({ type: "REMOVE_SECTION", pageId, sectionId: section.id })}
          className="p-1.5 md:p-1 text-red-400 hover:text-red-300 transition-colors"
          title="Hapus Section"
        >
          <svg className="w-5 h-5 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  const { state, currentPage, dispatch } = useBuilder();
  const totalSections = currentPage?.sections.length ?? 0;
  const isSelected = state.selectedSectionId === section.id;
  const { setNodeRef, isOver } = useDroppable({
    id: `section-${section.id}`,
    data: { type: "section", sectionId: section.id },
  });

  const bgStyle: React.CSSProperties = {};
  if (section.styles.backgroundColor && section.styles.backgroundColor !== "transparent") {
    bgStyle.backgroundColor = applyBgOpacity(section.styles.backgroundColor, section.styles.backgroundOpacity) || section.styles.backgroundColor;
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
      id={`section-${section.id}`}
      onClick={(e) => {
        // Only select section if no element was clicked (element handles stopPropagation)
        dispatch({ type: "SELECT_SECTION", sectionId: section.id });
      }}
      className={`group relative rounded-xl border-2 transition-all cursor-pointer ${
        isOver ? "border-[#22c55e]/50 bg-[#22c55e]/5" : isSelected ? "border-[#22c55e]/30 ring-1 ring-[#22c55e]/10" : "border-transparent hover:border-gray-200"
      }`}
    >
      <SectionControls
        section={section}
        pageId={pageId}
        sectionIndex={sectionIndex}
        totalSections={totalSections}
        isSelected={isSelected}
      />

      {/* Section content with padding */}
      <div
        style={bgStyle}
        className="rounded-xl"
      >
        {/* Section Padding Controls */}
        <div className={`flex items-center justify-center gap-4 py-2 transition-opacity ${isSelected ? "opacity-100" : "opacity-60 md:opacity-0 md:group-hover:opacity-100"}`}>
          <button
            onClick={() => {
              const current = parseInt(section.styles.padding || "0") || 0;
              dispatch({
                type: "UPDATE_SECTION_STYLES",
                pageId,
                sectionId: section.id,
                styles: { padding: `${Math.max(0, current - 20)}px 0` },
              });
            }}
            className="text-[10px] text-gray-500 hover:text-white transition-colors"
            title="Kurangi Padding"
          >
            ▲ Kurangi
          </button>
          <span className="text-[10px] text-gray-600">{section.styles.padding || "0"}</span>
          <button
            onClick={() => {
              const current = parseInt(section.styles.padding || "0") || 0;
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

        {/* Rows */}
        <div
          className="mx-auto"
          style={{ maxWidth: getContainerWidth(section.styles.containerWidth, currentPage?.globalStyles.containerWidth || 1200), paddingLeft: "16px", paddingRight: "16px" }}
        >
          {(section.rows || [{ id: genId("row"), columns: section.columns }]).map((row, rowIndex) => (
            <div key={row.id || `row-${rowIndex}`} className="mb-4 last:mb-0">
              <div className="flex gap-4" style={{ minHeight: "60px", flexWrap: "wrap" }}>
                {row.columns.map((column, colIndex) => (
                  <div key={column.id} className="flex-1" style={{ maxWidth: `${(column.width / 12) * 100}%`, minWidth: "280px" }}>
                    <BuilderColumn
                      column={column}
                      columnIndex={colIndex}
                      sectionId={section.id}
                      pageId={pageId}
                      rowIndex={rowIndex}
                    />
                  </div>
                ))}
              </div>
              {/* Row Controls */}
              <div className={`flex items-center justify-center gap-2 mt-2 transition-opacity ${isSelected ? "opacity-100" : "opacity-60 md:opacity-0 md:group-hover:opacity-100"}`}>
                <button
                  onClick={(e) => { e.stopPropagation(); dispatch({ type: "ADD_ROW", pageId, sectionId: section.id, index: rowIndex + 1 }); }}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium bg-white/5 border border-white/10 text-gray-400 hover:text-[#22c55e] hover:border-[#22c55e]/30 transition-all"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Row
                </button>
                {(section.rows?.length || 1) > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); dispatch({ type: "REMOVE_ROW", pageId, sectionId: section.id, rowIndex }); }}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Hapus
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="h-2 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
