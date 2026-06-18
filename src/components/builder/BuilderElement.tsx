"use client";

import { useState, useCallback } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
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
  rowIndex = 0,
}: {
  element: BuilderElementType;
  elementIndex: number;
  columnIndex: number;
  sectionId: string;
  pageId: string;
  totalElements: number;
  rowIndex?: number;
}) {
  const { dispatch, state } = useBuilder();
  const isSelected = state.selectedElementId === element.id;
  const [inlineEditing, setInlineEditing] = useState(false);
  const isTouchDevice = typeof window !== "undefined" && 'ontouchstart' in window;

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `el-${element.id}`,
    data: { type: "element", elementId: element.id, sectionId, columnIndex, index: elementIndex, rowIndex },
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `drop-${element.id}`,
    data: { type: "element", elementId: element.id, sectionId, columnIndex, index: elementIndex, rowIndex },
  });

  // Merge draggable + droppable refs onto the same outer element to avoid nested issues
  const mergedRef = useCallback((node: HTMLDivElement | null) => {
    setNodeRef(node);
    setDroppableRef(node);
  }, [setNodeRef, setDroppableRef]);

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: "SELECT_ELEMENT", elementId: element.id });
  };

  const editableTypes = [
    "heading", "text", "button", "cta", "navbar",
    "animated-headline", "blockquote", "code-highlight", "flip-box", "hotspot",
    "progress-tracker", "share-buttons", "checklist", "gallery", "lottie",
    "star-rating", "search", "floating-buttons", "breadcrumbs",
    "off-canvas", "slides", "nested-carousel", "video-playlist", "table-of-contents", "social-embed",
  ];

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editableTypes.includes(element.type)) {
      setInlineEditing(true);
    }
  };

  const handleInlineEdit = useCallback((content: Record<string, any>) => {
    dispatch({
      type: "UPDATE_ELEMENT",
      pageId,
      sectionId,
      columnIndex,
      elementId: element.id,
      content,
      rowIndex,
    } as any);
    setInlineEditing(false);
  }, [dispatch, pageId, sectionId, columnIndex, rowIndex, element.id]);

  const handleBlur = () => {
    // Small delay to allow click events to fire
    setTimeout(() => setInlineEditing(false), 200);
  };

  const isHidden = element.content.hidden === true;

  const handleToggleHidden = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: "UPDATE_ELEMENT",
      pageId,
      sectionId,
      columnIndex,
      elementId: element.id,
      content: { hidden: !isHidden },
      rowIndex,
    } as any);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: "SELECT_ELEMENT", elementId: element.id });
    // Toggle inline editing for editable types
    if (editableTypes.includes(element.type)) {
      setInlineEditing(prev => !prev);
    }
  };

  return (
    <div
      ref={mergedRef}
      style={style}
      className={`group/element relative rounded-lg transition-all ${
        isDragging ? "opacity-50 z-50" : ""
      } ${isOver ? "!ring-2 !ring-[#22c55e]/50 !bg-[#22c55e]/5" : ""} ${isSelected ? "ring-2 ring-[#22c55e] ring-offset-2 ring-offset-gray-100" : "hover:ring-1 hover:ring-gray-300"} ${isHidden ? "opacity-30" : ""}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Drag handle & controls - desktop: hover, mobile: only when selected/hidden */}
      <div className={`absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 transition-opacity z-10 ${isHidden || isSelected ? "opacity-100" : "opacity-0 md:group-hover/element:opacity-100"}`}>
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
          </button>          {/* Move up / down */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: "MOVE_ELEMENT", pageId, from: { sectionId, columnIndex, elementId: element.id, rowIndex }, to: { sectionId, columnIndex, index: elementIndex - 1, rowIndex } } as any);
              }}
              disabled={elementIndex === 0}
              className={`p-0.5 transition-colors ${elementIndex === 0 ? "text-gray-700 cursor-not-allowed" : "text-gray-400 hover:text-white"}`}
              title="Pindah ke atas"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: "MOVE_ELEMENT", pageId, from: { sectionId, columnIndex, elementId: element.id, rowIndex }, to: { sectionId, columnIndex, index: elementIndex + 1, rowIndex } } as any);
              }}
              disabled={elementIndex >= totalElements - 1}
              className={`p-0.5 transition-colors ${elementIndex >= totalElements - 1 ? "text-gray-700 cursor-not-allowed" : "text-gray-400 hover:text-white"}`}
              title="Pindah ke bawah"
            >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className="w-px h-3 bg-white/10" />
          <span className="text-[10px] text-gray-500 uppercase font-medium px-1">{element.type}</span>
          <div className="w-px h-3 bg-white/10" />
          <div className="w-px h-3 bg-white/10" />
          {/* Edit button */}
          <button
            onClick={handleEditClick}
            className="p-0.5 text-gray-400 hover:text-[#22c55e] transition-colors"
            title="Edit element"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          {/* Hide/Show button */}
          <button
            onClick={handleToggleHidden}
            className={`p-0.5 transition-colors ${isHidden ? "text-yellow-400 hover:text-yellow-300" : "text-gray-400 hover:text-white"}`}
            title={isHidden ? "Tampilkan element" : "Sembunyikan element"}
          >
            {isHidden ? (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
          <div className="w-px h-3 bg-white/10" />            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: "DUPLICATE_ELEMENT", pageId, sectionId, columnIndex, elementId: element.id, rowIndex } as any);
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
                dispatch({ type: "REMOVE_ELEMENT", pageId, sectionId, columnIndex, elementId: element.id, rowIndex } as any);
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

      {/* Hidden badge */}
      {isHidden && (
        <div className="absolute top-2 right-2 z-10">
          <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-md font-medium">
            Disembunyikan
          </span>
        </div>
      )}

      {/* Inline editing hint */}
      {isSelected && editableTypes.includes(element.type) && !inlineEditing && !isHidden && (
        <div className="absolute top-2 right-2 opacity-0 group-hover/element:opacity-100 transition-opacity z-10">
          <span className="text-[10px] bg-[#22c55e]/20 text-[#22c55e] px-2 py-0.5 rounded-md">
            {isTouchDevice ? "Tap to edit" : "Double-click to edit"}
          </span>
        </div>
      )}

      {/* Element content */}
      <div className={`p-3 ${isHidden ? "pointer-events-none select-none" : ""}`}>
        {isHidden ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <svg className="w-8 h-8 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              <p className="text-xs text-gray-600">Element disembunyikan</p>
              <p className="text-[10px] text-gray-700">Klik ikon mata untuk tampilkan</p>
            </div>
          </div>
        ) : (
          <ElementRenderer
            element={element}
            editing={inlineEditing}
            onEdit={handleInlineEdit}
            onBlurEditing={handleBlur}
          />
        )}
      </div>
    </div>
  );
}
