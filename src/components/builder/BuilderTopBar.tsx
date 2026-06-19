"use client";

import { useState } from "react";
import { useBuilder } from "@/lib/builder/store";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { submitTemplate } from "@/lib/supabase/community-templates";
import { checkSlugExists } from "@/lib/supabase/published";

function MobileMenu({
  currentPage,
  signOut,
  hasPublishedSnapshot,
  hasUnsavedChanges,
  publishedUrl,
  handlePublish,
  handleUnpublish,
}: {
  currentPage: any;
  signOut: () => void;
  hasPublishedSnapshot: boolean;
  hasUnsavedChanges: boolean;
  publishedUrl: string;
  handlePublish: () => void;
  handleUnpublish: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>
      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-full mt-1 w-48 bg-[#1e293b] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden py-1">
            <Link
              href={`/builder/preview/${currentPage.id}`}
              target="_blank"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors"
              onClick={() => setShowMenu(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </Link>
            <div className="h-px bg-white/10 mx-3" />
            <button
              onClick={() => { handlePublish(); setShowMenu(false); }}
              className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors ${
                !hasPublishedSnapshot
                  ? "text-[#22c55e] hover:bg-[#22c55e]/10"
                  : hasUnsavedChanges
                  ? "text-amber-400 hover:bg-amber-500/10"
                  : "text-gray-400 hover:bg-white/5"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {!hasPublishedSnapshot ? "Publish" : hasUnsavedChanges ? "Publish Ulang" : "Published"}
            </button>
            {hasPublishedSnapshot && (
              <button
                onClick={() => { handleUnpublish(); setShowMenu(false); }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Unpublish
              </button>
            )}
            <div className="h-px bg-white/10 mx-3" />
            {currentPage.published && (
              <a
                href={publishedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors"
                onClick={() => setShowMenu(false)}
              >
                <svg className="w-4 h-4 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span className="truncate">{currentPage.slug}</span>
              </a>
            )}
            <div className="h-px bg-white/10 mx-3" />
            <button
              onClick={() => { setShowMenu(false); signOut(); }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Keluar
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function BuilderTopBar({
  showSidebar,
  onToggleSidebar,
  viewport,
  onViewportChange,
  isFullscreen,
  onToggleFullscreen,
  isMobile = false,
  onShowElements,
  onShowStyle,
  showStylePanel = false,
}: {
  showSidebar: boolean;
  onToggleSidebar: () => void;
  viewport: "desktop" | "tablet" | "mobile";
  onViewportChange: (v: "desktop" | "tablet" | "mobile") => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isMobile?: boolean;
  onShowElements?: () => void;
  onShowStyle?: () => void;
  showStylePanel?: boolean;
}) {
  const { currentPage, dispatch, undo, redo, canUndo, canRedo } = useBuilder();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [editingSlug, setEditingSlug] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showTemplateOption, setShowTemplateOption] = useState(false);
  const [templateDesc, setTemplateDesc] = useState("");
  const [templateCategory, setTemplateCategory] = useState("Bisnis");
  const [templateSubmitting, setTemplateSubmitting] = useState(false);
  const [templateError, setTemplateError] = useState("");
  const [templateSuccess, setTemplateSuccess] = useState("");
  const [publishError, setPublishError] = useState("");

  const publishedUrl = `https://pagodastudio.my.id/${currentPage?.slug || ""}`;

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

  const handleSlugClick = () => {
    setSlug(currentPage.slug);
    setEditingSlug(true);
  };

  const handleSlugSave = () => {
    if (slug.trim()) {
      dispatch({ type: "UPDATE_PAGE_SLUG", pageId: currentPage.id, slug: slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "") });
    }
    setEditingSlug(false);
  };

  const handlePublish = () => {
    // Show template option if this is a first publish or there are unsaved changes
    if (!hasPublishedSnapshot || hasUnsavedChanges) {
      setShowTemplateOption(true);
    } else {
      dispatch({ type: "PUBLISH_PAGE", pageId: currentPage.id });
    }
  };

  const handlePublishOnly = async () => {
    setPublishError("");

    // Cek apakah slug sudah dipakai oleh pengguna lain
    if (user) {
      const ownerId = await checkSlugExists(currentPage.slug, user.id);
      if (ownerId) {
        setPublishError(`Slug "${currentPage.slug}" sudah dipublikasikan oleh pengguna lain. Ganti slug di URL di atas, lalu coba lagi.`);
        return;
      }
    }

    dispatch({ type: "PUBLISH_PAGE", pageId: currentPage.id });
    setShowTemplateOption(false);
    setTemplateDesc("");
  };

  const handlePublishAndSubmitTemplate = async () => {
    if (!user) return;
    setTemplateSubmitting(true);
    setTemplateError("");
    setTemplateSuccess("");
    setPublishError("");

    try {
      // Cek apakah slug sudah dipakai oleh pengguna lain
      const ownerId = await checkSlugExists(currentPage.slug, user.id);
      if (ownerId) {
        setPublishError(`Slug "${currentPage.slug}" sudah dipublikasikan oleh pengguna lain. Ganti slug di URL di atas, lalu coba lagi.`);
        setTemplateSubmitting(false);
        return;
      }

      // First publish
      dispatch({ type: "PUBLISH_PAGE", pageId: currentPage.id });

      // Then submit as template
      const result = await submitTemplate(user.id, currentPage, {
        title: currentPage.title,
        description: templateDesc || `${currentPage.title} - Landing page profesional`,
        category: templateCategory,
        icon: getCategoryIcon(templateCategory),
        previewColor: getCategoryColor(templateCategory),
      });

      if (result.success) {
        setTemplateSuccess("Template berhasil dikirim! Menunggu persetujuan admin.");
        setTimeout(() => {
          setShowTemplateOption(false);
          setTemplateDesc("");
          setTemplateSuccess("");
        }, 2500);
      } else {
        setTemplateError(result.error || "Gagal mengirim template");
      }
    } catch (err: any) {
      setTemplateError(err.message || "Terjadi kesalahan");
    }
    setTemplateSubmitting(false);
  };

  const getCategoryIcon = (cat: string) => {
    const map: Record<string, string> = { Bisnis: "🏢", Kreatif: "🎨", Event: "📅", Lainnya: "📄" };
    return map[cat] || "📄";
  };

  const getCategoryColor = (cat: string) => {
    const map: Record<string, string> = {
      Bisnis: "from-blue-500 to-indigo-600",
      Kreatif: "from-purple-500 to-pink-600",
      Event: "from-orange-500 to-red-600",
      Lainnya: "from-gray-500 to-gray-600",
    };
    return map[cat] || "from-gray-500 to-gray-600";
  };

  const handleUnpublish = () => {
    dispatch({ type: "UNPUBLISH_PAGE", pageId: currentPage.id });
  };

  // Determine if there are unsaved changes since last publish
  const hasPublishedSnapshot = !!currentPage.publishedSnapshot;
  const ss = currentPage.publishedSnapshot;
  const hasUnsavedChanges = hasPublishedSnapshot && (
    currentPage.title !== ss?.title ||
    currentPage.slug !== ss?.slug ||
    JSON.stringify(currentPage.sections) !== JSON.stringify(ss?.sections) ||
    JSON.stringify(currentPage.globalStyles) !== JSON.stringify(ss?.globalStyles)
  );

  return (
    <header className="h-14 flex items-center justify-between px-4 bg-[#0f172a] border-b border-white/10 flex-shrink-0">
      <div className="flex items-center gap-3">
        <Link href="/builder" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-xs font-bold tracking-wider text-[#22c55e] group-hover:text-[#22c55e]/80">PAGODASTUDIO</span>
        </Link>
        <div className="w-px h-5 bg-white/10" />
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

      <div className="flex items-center gap-1.5 overflow-x-auto">
        {/* Undo / Redo - always visible */}
        <div className="flex items-center">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-1.5 rounded-lg transition-colors ${canUndo ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-gray-700 cursor-not-allowed"}`}
            title="Undo (Ctrl+Z)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 rounded-lg transition-colors ${canRedo ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-gray-700 cursor-not-allowed"}`}
            title="Redo (Ctrl+Shift+Z)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
            </svg>
          </button>
        </div>

        {/* Divider */}
        {!isMobile && <div className="w-px h-5 bg-white/10 mx-1" />}

        {/* ── DESKTOP: Standard buttons ── */}

        {/* Publish Link - slug (hide on mobile) */}
        {currentPage.published && !isMobile && (
          <a
            href={publishedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
          >
            <span className="text-[10px] text-gray-500 group-hover:text-gray-400 transition-colors">pagodastudio.my.id/</span>
            {editingSlug ? (
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                onBlur={(e) => { e.stopPropagation(); handleSlugSave(); }}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSlugSave(); } }}
                className="w-24 bg-transparent text-[#22c55e] text-xs font-medium outline-none border-b border-[#22c55e]"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <button onClick={(e) => { e.preventDefault(); handleSlugClick(); }} className="text-[#22c55e] text-xs font-medium hover:underline">
                {currentPage.slug}
              </button>
            )}
            <svg className="w-3 h-3 text-gray-600 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}

        {/* Toggle Sidebar - hide on mobile */}
        {!isMobile && (
          <>
            <div className="w-px h-5 bg-white/10 mx-1" />
            <button
              onClick={onToggleSidebar}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                showSidebar
                  ? "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  : "text-[#22c55e] bg-[#22c55e]/15 border border-[#22c55e]/30"
              }`}
              title={showSidebar ? "Sembunyikan Sidebar" : "Tampilkan Sidebar"}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>{showSidebar ? "Sidebar" : "Sidebar"}</span>
            </button>
          </>
        )}

        {/* Viewport Selector - hide on mobile */}
        {!isMobile && (
          <>
            <div className="w-px h-5 bg-white/10 mx-1" />
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
          </>
        )}

        {/* Fullscreen Toggle - hide on mobile */}
        {!isMobile && (
          <>
            <div className="w-px h-5 bg-white/10 mx-1" />
            <button
              onClick={onToggleFullscreen}
              className={`p-1.5 rounded-lg transition-colors hover:text-white hover:bg-white/5 text-gray-400`}
              title="Fullscreen Preview"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </>
        )}

        {/* Preview - hide on mobile */}
        {!isMobile && (
          <>
            <div className="w-px h-5 bg-white/10 mx-1" />
            <Link
              href={`/builder/preview/${currentPage.id}`}
              target="_blank"
              className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              Preview
            </Link>
          </>
        )}

        {/* Desktop: Publish/Unpublish */}
        {!isMobile && (
          <div className="flex items-center gap-1">
            <button
              onClick={handlePublish}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                !hasPublishedSnapshot
                  ? "bg-[#22c55e] text-white hover:bg-[#16a34a]"
                  : hasUnsavedChanges
                  ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30"
                  : "bg-[#22c55e]/20 text-[#22c55e] hover:bg-[#22c55e]/30"
              }`}
            >
              {!hasPublishedSnapshot
                ? "Publish"
                : hasUnsavedChanges
                ? "Publish"
                : "Published"}
            </button>
            {hasPublishedSnapshot && (
              <button
                onClick={handleUnpublish}
                className="px-3 py-1.5 text-xs font-medium text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                title="Unpublish"
              >
                Unpublish
              </button>
            )}
          </div>
        )}

        {/* Template option modal */}
        {showTemplateOption && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6">
            <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-6 w-full max-w-md">
              <div className="text-center mb-4">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#22c55e]/20 to-emerald-500/20 border border-[#22c55e]/30 flex items-center justify-center">
                  <svg className="w-7 h-7 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Publikasi Halaman</h3>
                <p className="text-sm text-gray-400">Halaman <span className="text-white font-semibold">{currentPage.title}</span> akan dipublikasikan.</p>
              </div>

              {templateSuccess ? (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center mb-4">
                  {templateSuccess}
                </div>
              ) : (
                <>
                  {/* Option A: Publish only */}
                  <button
                    onClick={handlePublishOnly}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-white/10 hover:border-[#22c55e]/40 hover:bg-[#22c55e]/5 transition-all mb-3 text-left group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#22c55e]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-[#22c55e] transition-colors">Publikasi Saja</p>
                      <p className="text-[11px] text-gray-500">Halaman live di URL Anda sendiri</p>
                    </div>
                  </button>

                  {/* Option B: Publish & submit as template */}
                  <div className="p-4 rounded-xl border border-dashed border-purple-500/30 bg-purple-500/5 mb-3">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-purple-400">Publikasi & Jadikan Template</p>
                        <p className="text-[11px] text-gray-500">Bagikan ke komunitas (butuh persetujuan admin)</p>
                      </div>
                    </div>

                    <input
                      type="text"
                      value={templateDesc}
                      onChange={(e) => setTemplateDesc(e.target.value)}
                      placeholder="Deskripsi template (opsional)"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500/50 mb-2"
                    />
                    <select
                      value={templateCategory}
                      onChange={(e) => setTemplateCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50 mb-2"
                      style={{ colorScheme: "dark" }}
                    >
                      <option value="Bisnis" className="bg-[#1e293b] text-white">🏢 Bisnis</option>
                      <option value="Kreatif" className="bg-[#1e293b] text-white">🎨 Kreatif</option>
                      <option value="Event" className="bg-[#1e293b] text-white">📅 Event</option>
                      <option value="Lainnya" className="bg-[#1e293b] text-white">📄 Lainnya</option>
                    </select>

                    <button
                      onClick={handlePublishAndSubmitTemplate}
                      disabled={templateSubmitting}
                      className="w-full py-2 bg-purple-500 text-white text-sm font-semibold rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {templateSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        "Ya, Publikasi & Jadikan Template"
                      )}
                    </button>
                  </div>

                      {publishError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-2">
                      {publishError}
                    </div>
                  )}

                  {templateError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-2">
                      {templateError}
                    </div>
                  )}

                  <button
                    onClick={() => { setShowTemplateOption(false); setTemplateDesc(""); setTemplateError(""); setPublishError(""); }}
                    className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors text-center"
                  >
                    Batal
                  </button>
                </>
              )}
            </div>
          </div>
        )}


      </div>

      {/* User avatar - dipindahkan KELUAR dari overflow-x-auto container */}
      {!isMobile && (
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <div className="w-px h-5 bg-white/10 mx-1" />
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-7 h-7 rounded-full bg-[#22c55e]/20 flex items-center justify-center hover:bg-[#22c55e]/30 transition-colors"
              title={user?.email || "User"}
            >
              <span className="text-xs font-bold text-[#22c55e]">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </span>
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#1e293b] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-white/10">
                    <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Builder User</p>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/builder"
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                      Halaman Saya
                    </Link>
                    <button
                      onClick={() => { setShowUserMenu(false); signOut(); }}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Keluar
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── MOBILE: Compact dropdown ── */}
      {isMobile && (
        <MobileMenu
          currentPage={currentPage}
          signOut={signOut}
          hasPublishedSnapshot={hasPublishedSnapshot}
          hasUnsavedChanges={hasUnsavedChanges}
          publishedUrl={publishedUrl}
          handlePublish={handlePublish}
          handleUnpublish={handleUnpublish}

        />
      )}
    </header>
  );
}
