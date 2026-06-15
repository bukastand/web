"use client";

import { useState, useEffect } from "react";
import { DndContext, DragOverlay, PointerSensor, TouchSensor, useSensor, useSensors, type DragStartEvent, type DragEndEvent } from "@dnd-kit/core";
import { useBuilder } from "@/lib/builder/store";
import { createElement, aiSectionToBuilder } from "@/lib/builder/defaults";
import BuilderTopBar from "./BuilderTopBar";
import ElementSidebar from "./ElementSidebar";
import BuilderCanvas from "./BuilderCanvas";
import StylePanel from "./StylePanel";
import AIGeneratorModal from "./AIGeneratorModal";
import type { ElementType } from "@/lib/builder/types";

export default function BuilderEditor() {
  const { currentPage, dispatch, state, undo, redo } = useBuilder();
  const [activeDragType, setActiveDragType] = useState<ElementType | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [closingStyle, setClosingStyle] = useState(false);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [aiGeneratorOpen, setAiGeneratorOpen] = useState(false);
  const [aiGeneratorMode, setAiGeneratorMode] = useState<"section" | "website">("section");

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

  // Auto-show style drawer when element is selected on mobile
  useEffect(() => {
    if (isMobile && !closingStyle) {
      setShowStylePanel(!!state.selectedElementId);
    }
  }, [state.selectedElementId, closingStyle]);

  const closeStyleDrawer = () => {
    setClosingStyle(true);
    dispatch({ type: "SELECT_ELEMENT", elementId: null });
    setTimeout(() => {
      setShowStylePanel(false);
      setClosingStyle(false);
    }, 280);
  };

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

  // On mobile: hanya style drawer yang muncul otomatis
  // Desktop: sidebar + panel
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
            showStylePanel={!!state.selectedElementId}
            onOpenWebsiteAI={() => {
              setAiGeneratorMode("website");
              setAiGeneratorOpen(true);
            }}
            onOpenSectionAI={() => {
              setAiGeneratorMode("section");
              setAiGeneratorOpen(true);
            }}
          />
        )}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Desktop sidebar */}
          {showSidebar && !isFullscreen && !isMobile && <ElementSidebar />}
          
          <BuilderCanvas viewport={viewport} isFullscreen={isFullscreen} onExitFullscreen={() => setIsFullscreen(false)} />
          
          {/* Desktop style panel */}
          {state.selectedElementId && !isFullscreen && !isMobile && <StylePanel />}
        </div>

        {/* ─── MOBILE STYLE DRAWER ─── */}
        {(isMobile && (showStylePanel || closingStyle)) && state.selectedElementId && (
          <>
            <div className={`fixed bottom-0 left-0 right-0 z-40 bg-[#0f172a] border-t border-white/10 rounded-t-2xl max-h-[70vh] overflow-y-auto shadow-2xl ${closingStyle ? "animate-slideDown" : "animate-slideUp"}`}>
              <div className="sticky top-0 bg-[#0f172a] z-10 px-4 py-3 border-b border-white/10 flex items-center justify-between rounded-t-2xl">
                <h3 className="text-sm font-semibold text-white">Style Element</h3>
                <button onClick={closeStyleDrawer} className="p-1 text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <StylePanel />
            </div>
            <div 
              className={`fixed inset-0 z-30 pointer-events-none ${closingStyle ? "animate-backdropOut" : "animate-backdropIn"}`}
              style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            />
          </>
        )}

        {/* AI Generate Section button (floating, always visible) - hide on mobile */}
        {!isFullscreen && !isMobile && (
          <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-2">
            <button
              onClick={() => {
                setAiGeneratorMode("section");
                setAiGeneratorOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold rounded-xl shadow-lg hover:from-emerald-600 hover:to-teal-600 transition-all hover:scale-105 active:scale-95"
              title="Generate Section dengan AI"
            >
              <span>🧩</span>
              <span>AI Section</span>
            </button>
            <button
              onClick={() => {
                setAiGeneratorMode("website");
                setAiGeneratorOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all hover:scale-105 active:scale-95"
              title="Generate Full Website dengan AI"
            >
              <span>🌐</span>
              <span>AI Website</span>
            </button>
          </div>
        )}

        {/* AI Generator Modal */}
        <AIGeneratorModal
          isOpen={aiGeneratorOpen}
          onClose={() => setAiGeneratorOpen(false)}
          mode={aiGeneratorMode}
          onApplySection={(sectionJson) => {
            try {
              const sectionData = JSON.parse(sectionJson);
              const builderSection = aiSectionToBuilder(sectionData);
              dispatch({
                type: "ADD_TEMPLATE_SECTION",
                pageId: currentPage.id,
                section: builderSection,
              });
            } catch (e) {
              console.warn("AI section apply failed:", e);
            }
          }}
          onApplyWebsite={(sectionsJson) => {
            try {
              const sectionsData = JSON.parse(sectionsJson);
              const sections = Array.isArray(sectionsData) ? sectionsData : [sectionsData];
              const builderSections = sections.map((s: any) => aiSectionToBuilder(s));
              for (const sec of builderSections) {
                dispatch({
                  type: "ADD_TEMPLATE_SECTION",
                  pageId: currentPage.id,
                  section: sec,
                });
              }
            } catch (e) {
              console.warn("AI website apply failed:", e);
            }
          }}
        />

        {/* Mobile add section button (hanya saat belum ada section) */}
        {isMobile && currentPage.sections.length === 0 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20">
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
