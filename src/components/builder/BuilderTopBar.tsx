"use client";

import { useState } from "react";
import { useBuilder } from "@/lib/builder/store";
import Link from "next/link";

export default function BuilderTopBar({
  showStylePanel,
  onToggleStylePanel,
}: {
  showStylePanel: boolean;
  onToggleStylePanel: () => void;
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

      <div className="flex items-center gap-3">
        {/* Undo/Redo placeholder */}
        <div className="flex items-center gap-1 text-gray-600">
          <button className="p-2 hover:text-white transition-colors" title="Undo">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>
          <button className="p-2 hover:text-white transition-colors" title="Redo">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
            </svg>
          </button>
        </div>

        <div className="w-px h-6 bg-white/10" />

        <button
          onClick={onToggleStylePanel}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${showStylePanel ? "bg-[#22c55e]/20 text-[#22c55e]" : "text-gray-400 hover:text-white"}`}
        >
          Styles
        </button>

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
