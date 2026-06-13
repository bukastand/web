"use client";

import { useState, useEffect } from "react";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragStartEvent, type DragEndEvent } from "@dnd-kit/core";
import { useBuilder } from "@/lib/builder/store";
import { createElement } from "@/lib/builder/defaults";
import BuilderTopBar from "./BuilderTopBar";
import ElementSidebar from "./ElementSidebar";
import BuilderCanvas from "./BuilderCanvas";
import StylePanel from "./StylePanel";
import type { ElementType } from "@/lib/builder/types";

export default function BuilderEditor() {
  const { currentPage, dispatch, state, undo, redo } = useBuilder();
  const [activeDragType, setActiveDragType] = useState<ElementType | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // ── Keyboard shortcuts for Undo/Redo ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't hijack undo/redo when user is typing in an input/textarea/contentEditable
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  if (!currentPage) return null;

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current;
    if (data?.type === "sidebar-element") {
      setActiveDragType(data.elementType as ElementType);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragType(null);
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Drag from sidebar to canvas
    if (activeData?.type === "sidebar-element" && overData?.type === "column") {
      const element = createElement(activeData.elementType as ElementType);
      dispatch({
        type: "ADD_ELEMENT",
        pageId: currentPage.id,
        sectionId: overData.sectionId,
        columnIndex: overData.columnIndex,
        element,
      });
      return;
    }

    // Move element within or between columns
    if (activeData?.type === "element" && overData?.type === "element") {
      dispatch({
        type: "MOVE_ELEMENT",
        pageId: currentPage.id,
        from: {
          sectionId: activeData.sectionId,
          columnIndex: activeData.columnIndex,
          elementId: activeData.elementId,
        },
        to: {
          sectionId: overData.sectionId,
          columnIndex: overData.columnIndex,
          index: overData.index,
        },
      });
      return;
    }

    // Drop element on a column (when no specific element overlap)
    if (activeData?.type === "element" && overData?.type === "column") {
      dispatch({
        type: "MOVE_ELEMENT",
        pageId: currentPage.id,
        from: {
          sectionId: activeData.sectionId,
          columnIndex: activeData.columnIndex,
          elementId: activeData.elementId,
        },
        to: {
          sectionId: overData.sectionId,
          columnIndex: overData.columnIndex,
          index: 999,
        },
      });
      return;
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
        {!isFullscreen && (
          <BuilderTopBar
            showSidebar={showSidebar}
            onToggleSidebar={() => setShowSidebar(!showSidebar)}
            viewport={viewport}
            onViewportChange={setViewport}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          />
        )}
        <div className="flex-1 flex overflow-hidden">
          {showSidebar && !isFullscreen && <ElementSidebar />}
          <BuilderCanvas viewport={viewport} isFullscreen={isFullscreen} onExitFullscreen={() => setIsFullscreen(false)} />
          {state.selectedElementId && !isFullscreen && <StylePanel />}
        </div>
      </div>
      <DragOverlay>
        {activeDragType && (
          <div className="px-4 py-2 bg-[#22c55e] text-white text-sm font-medium rounded-xl shadow-xl">
            + {activeDragType}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
