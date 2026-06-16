"use client";

import { useState, useEffect, useMemo } from "react";
import { DndContext, DragOverlay, PointerSensor, TouchSensor, useSensor, useSensors, type DragStartEvent, type DragEndEvent } from "@dnd-kit/core";
import { useBuilder } from "@/lib/builder/store";
import { createElement, aiSectionToBuilder } from "@/lib/builder/defaults";
import BuilderTopBar from "./BuilderTopBar";
import ElementSidebar from "./ElementSidebar";
import BuilderCanvas from "./BuilderCanvas";
import StylePanel from "./StylePanel";
import AIGeneratorModal from "./AIGeneratorModal";
import type { ElementType } from "@/lib/builder/types";

const QUICK_SECTION_COLORS = ["#0f172a", "#1e293b", "#f8fafc", "#ffffff", "transparent"];

export default function BuilderEditor() {
  const { currentPage, dispatch, state, undo, redo } = useBuilder();
  const [activeDragType, setActiveDragType] = useState<ElementType | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [closingStyle, setClosingStyle] = useState(false);
  const [closingSection, setClosingSection] = useState(false);
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

  const closeSectionDrawer = () => {
    setClosingSection(true);
    dispatch({ type: "SELECT_SECTION", sectionId: null });
    setTimeout(() => {
      setClosingSection(false);
    }, 280);
  };

  // ── Data untuk section yang dipilih ──
  const selectedSection = currentPage?.sections.find(s => s.id === state.selectedSectionId);
  const selectedSectionIndex = currentPage?.sections.findIndex(s => s.id === state.selectedSectionId) ?? -1;
  const totalSections = currentPage?.sections.length ?? 0;
  const cw = selectedSection?.styles.containerWidth || "boxed";
  const gw = currentPage?.globalStyles.containerWidth || 1200;
  const containerOptions = useMemo(() => [
    { key: "narrow" as const, label: "N", desc: "Narrow" },
    { key: "boxed" as const, label: `${gw}px`, desc: `Boxed (${gw}px)` },
    { key: "wide" as const, label: "W", desc: "Wide" },
    { key: "full" as const, label: "F", desc: "Full Width" },
  ], [gw]);

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

        {/* ─── MOBILE SECTION CONTROLS DRAWER ─── */}
        {(isMobile && (state.selectedSectionId || closingSection)) && !state.selectedElementId && selectedSection && (
          <>
              <div className={`fixed bottom-0 left-0 right-0 z-40 bg-[#0f172a] border-t border-white/10 rounded-t-2xl shadow-2xl max-h-[55vh] overflow-y-auto transition-all duration-300 ${closingSection ? "animate-slideDown" : "animate-slideUp"}`}>
              <div className="sticky top-0 bg-[#0f172a] z-10 px-4 py-3 border-b border-white/10 flex items-center justify-between rounded-t-2xl">
                <h3 className="text-sm font-semibold text-white">Section Controls</h3>
                <button onClick={closeSectionDrawer} className="p-1 text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4 space-y-4">
                {/* Background Color */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">Background</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={selectedSection.styles.backgroundColor && selectedSection.styles.backgroundColor !== "transparent" ? selectedSection.styles.backgroundColor : "#0f172a"}
                      onChange={(e) => dispatch({ type: "UPDATE_SECTION_STYLES", pageId: currentPage.id, sectionId: state.selectedSectionId!, styles: { backgroundColor: e.target.value } })}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 flex-shrink-0"
                      title="Warna Background"
                    />
                    <div className="flex gap-1 flex-wrap">
                      {QUICK_SECTION_COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => dispatch({ type: "UPDATE_SECTION_STYLES", pageId: currentPage.id, sectionId: state.selectedSectionId!, styles: { backgroundColor: c } })}
                          className={`w-6 h-6 rounded-sm border ${c === "transparent" ? "border-dashed border-white/30 bg-transparent" : "border-white/10"}`}
                          style={{ backgroundColor: c === "transparent" ? "transparent" : c }}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Container Width */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">Container Width</label>
                  <div className="flex gap-1">
                    {containerOptions.map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => dispatch({ type: "UPDATE_SECTION_STYLES", pageId: currentPage.id, sectionId: state.selectedSectionId!, styles: { containerWidth: opt.key } })}
                        className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                          cw === opt.key
                            ? "bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30"
                            : "bg-white/5 text-gray-400 border border-white/10 hover:text-white"
                        }`}
                        title={opt.desc}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Padding */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">Padding</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const current = parseInt(selectedSection.styles.padding || "0") || 0;
                        dispatch({ type: "UPDATE_SECTION_STYLES", pageId: currentPage.id, sectionId: state.selectedSectionId!, styles: { padding: `${Math.max(0, current - 20)}px 0` } });
                      }}
                      className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center text-lg"
                    >
                      −
                    </button>
                    <span className="text-sm text-gray-400 font-mono min-w-[60px] text-center">{selectedSection.styles.padding || "0"}</span>
                    <button
                      onClick={() => {
                        const current = parseInt(selectedSection.styles.padding || "0") || 0;
                        dispatch({ type: "UPDATE_SECTION_STYLES", pageId: currentPage.id, sectionId: state.selectedSectionId!, styles: { padding: `${Math.min(200, current + 20)}px 0` } });
                      }}
                      className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action buttons grid */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">Actions</label>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => dispatch({ type: "ADD_COLUMN", pageId: currentPage.id, sectionId: state.selectedSectionId! })}
                      className="flex flex-col items-center gap-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                      title="Tambah Kolom"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-[9px]">Kolom</span>
                    </button>
                    <button
                      onClick={() => dispatch({ type: "DUPLICATE_SECTION", pageId: currentPage.id, sectionId: state.selectedSectionId! })}
                      className="flex flex-col items-center gap-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                      title="Duplikat Section"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[9px]">Duplikat</span>
                    </button>
                    <button
                      onClick={() => {
                        if (selectedSectionIndex > 0) dispatch({ type: "MOVE_SECTION", pageId: currentPage.id, sectionId: state.selectedSectionId!, toIndex: selectedSectionIndex - 1 });
                      }}
                      disabled={selectedSectionIndex === 0}
                      className="flex flex-col items-center gap-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                      title="Pindah ke Atas"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      <span className="text-[9px]">Naik</span>
                    </button>
                    <button
                      onClick={() => {
                        if (selectedSectionIndex < totalSections - 1) dispatch({ type: "MOVE_SECTION", pageId: currentPage.id, sectionId: state.selectedSectionId!, toIndex: selectedSectionIndex + 1 });
                      }}
                      disabled={selectedSectionIndex === totalSections - 1}
                      className="flex flex-col items-center gap-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                      title="Pindah ke Bawah"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      <span className="text-[9px]">Turun</span>
                    </button>
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => {
                    dispatch({ type: "REMOVE_SECTION", pageId: currentPage.id, sectionId: state.selectedSectionId! });
                    closeSectionDrawer();
                  }}
                  className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Hapus Section
                </button>
              </div>
            </div>
            <div 
              className={`fixed inset-0 z-30 transition-opacity duration-300 ${closingSection ? "opacity-0 pointer-events-none" : "opacity-100"}`}
              style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
              onClick={closeSectionDrawer}
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
