"use client";

import { useDroppable } from "@dnd-kit/core";
import { useBuilder } from "@/lib/builder/store";
import BuilderElement from "./BuilderElement";
import type { BuilderColumn as BuilderColumnType } from "@/lib/builder/types";

export default function BuilderColumnComponent({
  column,
  columnIndex,
  sectionId,
  pageId,
}: {
  column: BuilderColumnType;
  columnIndex: number;
  sectionId: string;
  pageId: string;
}) {
  const { dispatch, currentPage } = useBuilder();

  const { setNodeRef, isOver } = useDroppable({
    id: `col-${column.id}`,
    data: { type: "column", sectionId, columnIndex, columnId: column.id },
  });

  const section = currentPage?.sections.find((s) => s.id === sectionId);

  return (
    <div
      ref={setNodeRef}
      className={`group relative min-h-[80px] rounded-xl border-2 border-dashed transition-all ${
        isOver
          ? "border-[#22c55e] bg-[#22c55e]/10"
          : column.elements.length === 0
            ? "border-white/10 bg-white/[0.02]"
            : "border-transparent"
      }`}
    >
      {/* Column controls */}
      {section && section.columns.length > 1 && (
        <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => dispatch({ type: "REMOVE_COLUMN", pageId, sectionId, columnIndex })}
              className="p-1 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
              title="Hapus Kolom"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Empty column hint */}
      {column.elements.length === 0 && (
        <div className="flex items-center justify-center h-20 text-gray-600 text-xs">
          {isOver ? "‣ Letakkan di sini" : "Drop element here"}
        </div>
      )}

      {/* Elements */}
      <div className="space-y-1 p-2">
        {column.elements.map((element, elIndex) => (
          <BuilderElement
            key={element.id}
            element={element}
            elementIndex={elIndex}
            columnIndex={columnIndex}
            sectionId={sectionId}
            pageId={pageId}
            totalElements={column.elements.length}
          />
        ))}
      </div>
    </div>
  );
}
