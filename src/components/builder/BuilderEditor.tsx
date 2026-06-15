"use client";

import { useState, useEffect } from "react";
import { DndContext, DragOverlay, PointerSensor, TouchSensor, useSensor, useSensors, type DragStartEvent, type DragEndEvent } from "@dnd-kit/core";
import { useBuilder } from "@/lib/builder/store";
import { createElement } from "@/lib/builder/defaults";
import BuilderTopBar from "./BuilderTopBar";
import ElementSidebar, { MOBILE_ELEMENTS } from "./ElementSidebar";
import BuilderCanvas from "./BuilderCanvas";
import StylePanel from "./StylePanel";
import type { ElementType } from "@/lib/builder/types";

export default function BuilderEditor() {
  const { currentPage, dispatch, state, undo, redo } = useBuilder();
  const [activeDragType, setActiveDragType] = useState<ElementType | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showMobilePanel, setShowMobilePanel] = useState<"none" | "style" | "elements">("style");
  const [closingPanel, setClosingPanel] = useState<"style" | "elements" | null>(null);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Auto-hide sidebar on mobile
  useEffect(() => {
    if (isMobile) setShowSidebar(false);
  }, [isMobile]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  // ── Keyboard shortcuts for Undo/Redo ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  // Auto-show style panel when element is selected on mobile
  // Close when element is deselected
  useEffect(() => {
    if (isMobile && !closingPanel) {
      if (state.selectedElementId) {
        setShowMobilePanel("style");
      } else if (showMobilePanel === "style") {
        setShowMobilePanel("none");
      }
    }
  }, [state.selectedElementId, closingPanel]);

  const closeWithAnimation = (panel: "style" | "elements") => {
    setClosingPanel(panel);
    setTimeout(() => {
      setShowMobilePanel("none");
      setClosingPanel(null);
    }, 280);
  };

  if (!currentPage) return null;

  // On mobile, find the first section/column for tap-to-add
  const findFirstColumn = () => {
    if (currentPage.sections.length === 0) {
      dispatch({ type: "ADD_SECTION", pageId: currentPage.id });
      return null;
    }
    const firstSec = currentPage.sections[0];
    if (firstSec.columns.length > 0) {
      return { sectionId: firstSec.id, columnIndex: 0 };
    }
    return null;
  };

  const handleAddElement = (type: ElementType) => {
    const col = state.selectedElementId
      ? findColumnOfElement(state.selectedElementId)
      : findFirstColumn();
    if (!col) return;
    const element = createElement(type);
    dispatch({
      type: "ADD_ELEMENT",
      pageId: currentPage.id,
      sectionId: col.sectionId,
      columnIndex: col.columnIndex,
      element,
    });
    dispatch({ type: "SELECT_ELEMENT", elementId: element.id });
    if (isMobile && showMobilePanel === "elements") closeWithAnimation("elements");
  };

  const findColumnOfElement = (elementId: string) => {
    for (const sec of currentPage.sections) {
      for (let ci = 0; ci < sec.columns.length; ci++) {
        if (sec.columns[ci].elements.find((e) => e.id === elementId)) {
          return { sectionId: sec.id, columnIndex: ci };
        }
      }
    }
    return findFirstColumn();
  };

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

  // On mobile, sidebar and style panel are rendered as floating bottom drawers
  // Desktop: standard sidebar + panel layout
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
            isMobile={isMobile}
            onShowElements={() => setShowMobilePanel(showMobilePanel === "elements" ? "none" : "elements")}
            onShowStyle={() => setShowMobilePanel(showMobilePanel === "style" ? "none" : "style")}
            showStylePanel={!!state.selectedElementId}
          />
        )}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Desktop sidebar */}
          {showSidebar && !isFullscreen && !isMobile && <ElementSidebar />}
          
          <BuilderCanvas viewport={viewport} isFullscreen={isFullscreen} onExitFullscreen={() => setIsFullscreen(false)} />
          
          {/* Desktop style panel */}
          {state.selectedElementId && !isFullscreen && !isMobile && <StylePanel />}
        </div>

        {/* ─── MOBILE BOTTOM PANELS ─── */}
        
        {/* Mobile Elements Drawer */}
        {(isMobile && (showMobilePanel === "elements" || closingPanel === "elements")) && (
          <>
            <div 
              className={`fixed inset-0 z-30 ${closingPanel === "elements" ? "animate-backdropOut" : "animate-backdropIn"}`} 
              style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
              onClick={() => closeWithAnimation("elements")} 
            />
            <div className={`fixed bottom-0 left-0 right-0 z-40 bg-[#0f172a] border-t border-white/10 rounded-t-2xl max-h-[60vh] overflow-y-auto shadow-2xl ${closingPanel === "elements" ? "animate-slideDown" : "animate-slideUp"}`}>
              <div className="sticky top-0 bg-[#0f172a] z-10 px-4 py-3 border-b border-white/10 flex items-center justify-between rounded-t-2xl">
                <h3 className="text-sm font-semibold text-white">Tambah Element</h3>
                <button onClick={() => closeWithAnimation("elements")} className="p-1 text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-3 grid grid-cols-2 gap-2">
                {MOBILE_ELEMENTS.map((item) => (
                  <button
                    key={item.type}
                    onClick={() => handleAddElement(item.type)}
                    className="flex items-center gap-2 p-3 rounded-xl border border-white/10 bg-white/5 hover:border-[#22c55e]/40 hover:bg-[#22c55e]/5 transition-all active:scale-95"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-xs font-medium text-white">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Mobile Style Drawer — tanpa backdrop agar builder tetap bisa di-scroll */}
        {(isMobile && (showMobilePanel === "style" || closingPanel === "style")) && state.selectedElementId && (
          <>
            <div className={`fixed bottom-0 left-0 right-0 z-40 bg-[#0f172a] border-t border-white/10 rounded-t-2xl max-h-[70vh] overflow-y-auto shadow-2xl ${closingPanel === "style" ? "animate-slideDown" : "animate-slideUp"}`}>
              <div className="sticky top-0 bg-[#0f172a] z-10 px-4 py-3 border-b border-white/10 flex items-center justify-between rounded-t-2xl">
                <h3 className="text-sm font-semibold text-white">Style Element</h3>
                <button onClick={() => closeWithAnimation("style")} className="p-1 text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <StylePanel />
            </div>
            {/* Half-transparent overlay agar canvas tetap terlihat tapi tidak bisa diklik — pointer-events-none agar scroll tetap jalan */}
            <div 
              className={`fixed inset-0 z-30 pointer-events-none ${closingPanel === "style" ? "animate-backdropOut" : "animate-backdropIn"}`}
              style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            />
          </>
        )}

        {/* Mobile bottom toolbar */}
        {isMobile && !isFullscreen && (
          <div className="flex items-center justify-around px-4 py-2 bg-[#0f172a] border-t border-white/10 flex-shrink-0">
            <button
              onClick={() => {
                if (closingPanel) return;
                if (showMobilePanel === "elements") closeWithAnimation("elements");
                else setShowMobilePanel("elements");
              }}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${showMobilePanel === "elements" ? "text-[#22c55e]" : "text-gray-400"}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-[10px]">Element</span>
            </button>
          {state.selectedElementId && (
              <button
                onClick={() => {
                  if (closingPanel) return;
                  if (showMobilePanel === "style") closeWithAnimation("style");
                  else setShowMobilePanel("style");
                }}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${showMobilePanel === "style" ? "text-[#22c55e]" : "text-gray-400"}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <span className="text-[10px]">Style</span>
              </button>
            )}
          </div>
        )}

        {/* Mobile add section button (floating) */}
        {isMobile && currentPage.sections.length === 0 && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20">
            <button
              onClick={() => dispatch({ type: "ADD_SECTION", pageId: currentPage.id })}
              className="px-6 py-3 bg-[#22c55e]/20 text-[#22c55e] font-semibold rounded-xl border border-[#22c55e]/30"
            >
              + Tambah Section
            </button>
          </div>
        )}
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
