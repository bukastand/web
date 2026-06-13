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
        <button
          onClick={() => {
            const newBg = section.styles.backgroundColor === "transparent" || !section.styles.backgroundColor
              ? "#f8fafc"
              : section.styles.backgroundColor === "#f8fafc"
                ? "#0f172a"
                : "transparent";
            dispatch({ type: "UPDATE_SECTION_STYLES", pageId, sectionId: section.id, styles: { backgroundColor: newBg } });
          }}
          className="p-1.5 rounded-lg bg-[#1e293b] border border-white/10 text-gray-400 hover:text-white transition-colors"
          title="Toggle Background"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
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
