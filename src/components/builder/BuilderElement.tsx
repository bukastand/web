"use client";

import { useDraggable } from "@dnd-kit/core";
import { useBuilder } from "@/lib/builder/store";
import { ElementRenderer } from "./elements/ElementRenderer";
import type { BuilderElement as BuilderElementType } from "@/lib/builder/types";

export default function BuilderElementComponent({
  element,
  elementIndex,
  columnIndex,
  sectionId,
  pageId,
  totalElements,
}: {
  element: BuilderElementType;
  elementIndex: number;
  columnIndex: number;
  sectionId: string;
  pageId: string;
  totalElements: number;
}) {
  const { dispatch, state } = useBuilder();
  const isSelected = state.selectedElementId === element.id;

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `el-${element.id}`,
    data: { type: "element", elementId: element.id, sectionId, columnIndex, index: elementIndex },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: "SELECT_ELEMENT", elementId: element.id });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group/element relative rounded-lg transition-all ${
        isDragging ? "opacity-50 z-50" : ""
      } ${isSelected ? "ring-2 ring-[#22c55e] ring-offset-2 ring-offset-[#0f172a]" : "hover:ring-1 hover:ring-white/20"}`}
      onClick={handleClick}
    >
      {/* Drag handle & controls - appears on hover */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 opacity-0 group-hover/element:opacity-100 transition-opacity z-10">
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#1e293b] border border-white/10 shadow-lg">
          <button
            {...listeners}
            {...attributes}
            className="p-0.5 text-gray-400 hover:text-white cursor-grab active:cursor-grabbing transition-colors"
            title="Drag untuk memindahkan"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 6h2v2H8V6zm6 0h2v2h-2V6zM8 11h2v2H8v-2zm6 0h2v2h-2v-2zm-6 5h2v2H8v-2zm6 0h2v2h-2v-2z" />
            </svg>
          </button>
          <div className="w-px h-3 bg-white/10" />
          <span className="text-[10px] text-gray-500 uppercase font-medium px-1">{element.type}</span>
          <div className="w-px h-3 bg-white/10" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: "DUPLICATE_ELEMENT", pageId, sectionId, columnIndex, elementId: element.id });
            }}
            className="p-0.5 text-gray-400 hover:text-white transition-colors"
            title="Duplikat"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: "REMOVE_ELEMENT", pageId, sectionId, columnIndex, elementId: element.id });
            }}
            className="p-0.5 text-red-400 hover:text-red-300 transition-colors"
            title="Hapus"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Element content */}
      <div className="p-3">
        <ElementRenderer element={element} />
      </div>
    </div>
  );
}
