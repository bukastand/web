"use client";

import { useState } from "react";
import { useBuilder } from "@/lib/builder/store";
import Link from "next/link";

export default function BuilderTopBar({
  showSidebar,
  onToggleSidebar,
  showStylePanel,
  onToggleStylePanel,
  viewport,
  onViewportChange,
  isFullscreen,
  onToggleFullscreen,
}: {
  showSidebar: boolean;
  onToggleSidebar: () => void;
  showStylePanel: boolean;
  onToggleStylePanel: () => void;
  viewport: "desktop" | "tablet" | "mobile";
  onViewportChange: (v: "desktop" | "tablet" | "mobile") => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}) {
  const { currentPage, dispatch } = useBuilder();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");

  if (!currentPage) return null;

  const handleTitleClick = () => {
    setTitle(currentPage.title);
    setEditing(true);
  };

  const handleTitleSave = () => {
    if (title.trim()) {
      dispatch({ type: "UPDATE_PAGE_TITLE", pageId: currentPage.id, title: title.trim() });
    }
    setEditing(false);
  };

  const handlePublish = () => {
    dispatch({ type: "PUBLISH_PAGE", pageId: currentPage.id });
  };

  return (
    <header className="h-14 flex items-center justify-between px-4 bg-[#0f172a] border-b border-white/10 flex-shrink-0">
      <div className="flex items-center gap-4">
        <Link href="/builder" className="text-lg font-bold text-white/60 hover:text-white transition-colors">
          ←
        </Link>
        {editing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => e.key === "Enter" && handleTitleSave()}
            className="bg-transparent text-white font-semibold text-lg outline-none border-b border-[#22c55e] px-1 py-0.5"
            autoFocus
          />
        ) : (
          <button onClick={handleTitleClick} className="text-white font-semibold text-lg hover:text-[#22c55e] transition-colors">
            {currentPage.title}
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Toggle Sidebar */}
        <button
          onClick={onToggleSidebar}
          className={`p-1.5 rounded-lg transition-colors ${showSidebar ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-[#22c55e] bg-[#22c55e]/20"}`}
          title={showSidebar ? "Sembunyikan Sidebar" : "Tampilkan Sidebar"}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Toggle Style Panel */}
        <button
          onClick={onToggleStylePanel}
          className={`p-1.5 rounded-lg transition-colors ${showStylePanel ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-[#22c55e] bg-[#22c55e]/20"}`}
          title={showStylePanel ? "Sembunyikan Style Panel" : "Tampilkan Style Panel"}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-white/10 mx-1" />

        {/* Viewport Selector */}
        <div className="flex items-center bg-white/5 rounded-lg p-0.5">
          <button
            onClick={() => onViewportChange("desktop")}
            className={`p-1.5 rounded-md transition-all ${viewport === "desktop" ? "bg-[#22c55e]/20 text-[#22c55e]" : "text-gray-500 hover:text-white"}`}
            title="Desktop"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={() => onViewportChange("tablet")}
            className={`p-1.5 rounded-md transition-all ${viewport === "tablet" ? "bg-[#22c55e]/20 text-[#22c55e]" : "text-gray-500 hover:text-white"}`}
            title="Tablet"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={() => onViewportChange("mobile")}
            className={`p-1.5 rounded-md transition-all ${viewport === "mobile" ? "bg-[#22c55e]/20 text-[#22c55e]" : "text-gray-500 hover:text-white"}`}
            title="Mobile"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-white/10 mx-1" />

        {/* Fullscreen Toggle */}
        <button
          onClick={onToggleFullscreen}
          className={`p-1.5 rounded-lg transition-colors hover:text-white hover:bg-white/5 text-gray-400`}
          title="Fullscreen Preview"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-white/10 mx-1" />

        <Link
          href={`/builder/preview/${currentPage.id}`}
          target="_blank"
          className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          Preview
        </Link>

        <button
          onClick={handlePublish}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            currentPage.published
              ? "bg-[#22c55e]/20 text-[#22c55e] hover:bg-[#22c55e]/30"
              : "bg-[#22c55e] text-white hover:bg-[#16a34a]"
          }`}
        >
          {currentPage.published ? "Published" : "Publish"}
        </button>
      </div>
    </header>
  );
}
