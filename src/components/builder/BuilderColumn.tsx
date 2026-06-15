"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useBuilder } from "@/lib/builder/store";
import { createElement } from "@/lib/builder/defaults";
import BuilderElement from "./BuilderElement";
import type { BuilderColumn as BuilderColumnType, ElementType } from "@/lib/builder/types";

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
  const [showElementPicker, setShowElementPicker] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: `col-${column.id}`,
    data: { type: "column", sectionId, columnIndex, columnId: column.id },
  });

  const section = currentPage?.sections.find((s) => s.id === sectionId);

  const addElement = (type: ElementType) => {
    const element = createElement(type);
    dispatch({
      type: "ADD_ELEMENT",
      pageId,
      sectionId,
      columnIndex,
      element,
    });
    dispatch({ type: "SELECT_ELEMENT", elementId: element.id });
    setShowElementPicker(false);
  };

  // Element types shown in the inline picker (most commonly used first)
  const QUICK_ELEMENTS = [
    { type: "heading" as ElementType, icon: "H", label: "Heading" },
    { type: "text" as ElementType, icon: "¶", label: "Text" },
    { type: "image" as ElementType, icon: "🖼", label: "Image" },
    { type: "button" as ElementType, icon: "▣", label: "Button" },
    { type: "divider" as ElementType, icon: "―", label: "Divider" },
    { type: "spacer" as ElementType, icon: "⬜", label: "Spacer" },
    { type: "features" as ElementType, icon: "📊", label: "Features" },
    { type: "cta" as ElementType, icon: "📢", label: "CTA" },
    { type: "testimonial" as ElementType, icon: "💬", label: "Testimonial" },
  ];

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

      {/* Empty state / Add button — opens picker */}
      {column.elements.length === 0 && !showElementPicker && (
        <button
          onClick={() => setShowElementPicker(true)}
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

      {/* Inline element picker (shown when picker is open) */}
      {showElementPicker && (
        <div className={column.elements.length === 0 ? "p-2" : "px-2 pb-2"}>
          <div className="p-3 rounded-xl border border-white/10 bg-[#0f172a]/80 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Pilih Element</span>
              <button
                onClick={() => setShowElementPicker(false)}
                className="text-gray-500 hover:text-white text-xs transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {QUICK_ELEMENTS.map((item) => (
                <button
                  key={item.type}
                  onClick={() => addElement(item.type)}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl border border-white/10 bg-white/5 hover:border-[#22c55e]/40 hover:bg-[#22c55e]/5 transition-all active:scale-95"
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="text-[10px] text-gray-300 font-medium leading-tight text-center">{item.label}</span>
                </button>
              ))}
              <button
                onClick={() => setShowElementPicker(false)}
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl border border-dashed border-white/10 text-gray-500 hover:text-gray-300 hover:border-white/20 transition-all text-[10px]"
              >
                Batal
              </button>
            </div>
          </div>
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

      {/* Add element button at bottom — hidden when picker is open */}
      {column.elements.length > 0 && !showElementPicker && (
        <div className="px-2 pb-2">
          <button
            onClick={() => setShowElementPicker(true)}
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
