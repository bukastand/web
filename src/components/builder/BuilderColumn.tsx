"use client";

import { useDroppable } from "@dnd-kit/core";
import { useBuilder } from "@/lib/builder/store";
import { createElement } from "@/lib/builder/defaults";
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

  const handleAddElement = () => {
    const element = createElement("heading");
    dispatch({
      type: "ADD_ELEMENT",
      pageId,
      sectionId,
      columnIndex,
      element,
    });
    dispatch({ type: "SELECT_ELEMENT", elementId: element.id });
  };

  return (
    <div
      ref={setNodeRef}
      className={`group relative min-h-[80px] rounded-xl border-2 border-dashed transition-all ${
        isOver
          ? "border-[#22c55e] bg-[#22c55e]/10"
          : column.elements.length === 0
            ? "border-gray-200 bg-gray-50/50"
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

      {/* Empty column hint — now clickable */}
      {column.elements.length === 0 && (
        <button
          onClick={handleAddElement}
          className="w-full flex items-center justify-center h-20 text-gray-500 hover:text-[#22c55e] text-xs transition-colors"
        >
          {isOver ? (
            <span>‣ Letakkan di sini</span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Element
            </span>
          )}
        </button>
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

      {/* Add element area at bottom of column — always visible below elements */}
      {column.elements.length > 0 && (
        <div className="px-2 pb-2">
          <button
            onClick={handleAddElement}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-300/50 text-gray-400 hover:text-[#22c55e] hover:border-[#22c55e]/40 hover:bg-[#22c55e]/5 transition-all text-xs font-medium active:scale-[0.99]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Element
          </button>
        </div>
      )}
    </div>
  );
}
