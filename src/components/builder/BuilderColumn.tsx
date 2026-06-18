"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useBuilder } from "@/lib/builder/store";
import { createElement } from "@/lib/builder/defaults";
import { MOBILE_ELEMENTS } from "./ElementSidebar";
import BuilderElement from "./BuilderElement";
import type { BuilderColumn as BuilderColumnType, ElementType } from "@/lib/builder/types";

export default function BuilderColumnComponent({
  column,
  columnIndex,
  sectionId,
  pageId,
  rowIndex = 0,
}: {
  column: BuilderColumnType;
  columnIndex: number;
  sectionId: string;
  pageId: string;
  rowIndex?: number;
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
      rowIndex,
    } as any);
    dispatch({ type: "SELECT_ELEMENT", elementId: element.id });
    setShowElementPicker(false);
  };

  // All element types from MOBILE_ELEMENTS (22 types), with scroll for long list

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
      {/* Column toolbar — muncul saat hover */}
      {(() => {
        const currentRow = (section?.rows || [{ columns: section?.columns || [], id: '' }])[rowIndex];
        const rowColumns = currentRow?.columns || [];
        return rowColumns.length > 1 && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-[#1e293b] border border-white/10 shadow-lg pointer-events-auto">
            {/* Lebar */}
            <button
              onClick={() => dispatch({ type: "UPDATE_COLUMN_WIDTH", pageId, sectionId, columnIndex, width: column.width - 1, rowIndex } as any)}
              disabled={column.width <= 1}
              className="p-0.5 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Kurangi Lebar"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="text-[9px] font-mono text-gray-300 min-w-[24px] text-center">{column.width}/12</span>
            <button
              onClick={() => dispatch({ type: "UPDATE_COLUMN_WIDTH", pageId, sectionId, columnIndex, width: column.width + 1, rowIndex } as any)}
              disabled={column.width >= 12}
              className="p-0.5 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Tambah Lebar"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <div className="w-px h-3 bg-white/10 mx-1" />
            {/* Pindah kiri */}
            <button
              onClick={() => {
                if (columnIndex <= 0) return;
                const cols = [...rowColumns];
                [cols[columnIndex - 1], cols[columnIndex]] = [cols[columnIndex], cols[columnIndex - 1]];
                dispatch({ type: "REORDER_COLUMNS", pageId, sectionId, columns: cols, rowIndex } as any);
              }}
              disabled={columnIndex === 0}
              className="p-0.5 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Pindah ke Kiri"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {/* Pindah kanan */}
            <button
              onClick={() => {
                if (columnIndex >= rowColumns.length - 1) return;
                const cols = [...rowColumns];
                [cols[columnIndex], cols[columnIndex + 1]] = [cols[columnIndex + 1], cols[columnIndex]];
                dispatch({ type: "REORDER_COLUMNS", pageId, sectionId, columns: cols, rowIndex } as any);
              }}
              disabled={columnIndex >= rowColumns.length - 1}
              className="p-0.5 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Pindah ke Kanan"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="w-px h-3 bg-white/10 mx-1" />
            {/* Hapus */}
            <button
              onClick={() => dispatch({ type: "REMOVE_COLUMN", pageId, sectionId, columnIndex, rowIndex } as any)}
              className="p-0.5 text-red-400 hover:text-red-300 transition-colors"
              title="Hapus Kolom"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      );
      })()}

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

      {/* Add element button / inline picker at bottom */}
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

      {/* Inline picker — muncul di tempat yang sama dengan tombol "Tambah Element" */}
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
            <div className="grid grid-cols-3 gap-1.5 max-h-[200px] overflow-y-auto pr-0.5">
              {MOBILE_ELEMENTS.map((item) => (
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
    </div>
  );
}
