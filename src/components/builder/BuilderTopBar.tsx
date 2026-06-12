"use client";

import { useState } from "react";
import { useBuilder } from "@/lib/builder/store";
import Link from "next/link";

export default function BuilderTopBar() {
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
