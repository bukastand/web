"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { createPageFromTemplate } from "@/lib/builder/templates";
import type { Template } from "@/lib/builder/templates";
import { fetchApprovedTemplates, communityToGalleryTemplate } from "@/lib/supabase/community-templates";

// ElementRenderer for preview
import { ElementRenderer } from "@/components/builder/elements/ElementRenderer";

const categories = ["Semua", "Bisnis", "Kreatif", "Event", "Lainnya"];

function Monogram({ title, className = "" }: { title: string; className?: string }) {
  return (
    <span
      className={`flex-shrink-0 w-10 h-10 rounded-xl bg-surface border border-line flex items-center justify-center text-base font-bold text-accent ${className}`}
    >
      {(title || "T").trim().charAt(0).toUpperCase()}
    </span>
  );
}

function TemplateCard({
  template,
  onSelect,
  isSelected,
  onPreview,
}: {
  template: Template;
  onSelect: (t: Template) => void;
  isSelected: boolean;
  onPreview: (t: Template) => void;
}) {
  return (
    <div
      className={`group relative w-full rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
        isSelected
          ? "border-accent ring-2 ring-accent/20 shadow-lg shadow-accent/10"
          : "border-line hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
      }`}
    >
      {/* Preview thumbnail - click to preview */}
      <button
        onClick={() => onPreview(template)}
        className="w-full text-left"
      >
        <div className="h-48 bg-surface relative overflow-hidden transition-colors group-hover:bg-white">
          {/* Mini website wireframe */}
          <div className="absolute inset-x-5 top-5 bottom-5 bg-white border border-line rounded-xl shadow-sm overflow-hidden">
            {/* Fake navbar */}
            <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-line">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="w-10 h-1 rounded-full bg-line-hover" />
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-6 h-1 rounded-full bg-line-hover" />
                <span className="w-6 h-1 rounded-full bg-line-hover" />
                <span className="w-8 h-2.5 rounded-full bg-accent" />
              </div>
            </div>
            {/* Fake hero */}
            <div className="px-3 pt-3 pb-2.5 space-y-1.5">
              <div className="h-1.5 w-3/4 rounded-full bg-line" />
              <div className="h-1.5 w-1/2 rounded-full bg-line" />
              <div className="h-1 w-1/3 rounded-full bg-[#f5f5f5]" />
              <div className="flex gap-1.5 pt-1.5">
                <span className="w-12 h-2.5 rounded-full bg-accent" />
                <span className="w-12 h-2.5 rounded-full border border-line" />
              </div>
            </div>
            {/* Fake feature cards */}
            <div className="grid grid-cols-3 gap-1.5 px-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-9 rounded-md bg-surface border border-surface2" />
              ))}
            </div>
          </div>
          {/* Category pill */}
          <span className="absolute top-3 left-3 text-[10px] font-medium text-muted bg-white border border-line px-2 py-0.5 rounded-full">
            {template.category}
          </span>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-ink text-white font-semibold text-xs px-5 py-2 rounded-xl flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </span>
          </div>
        </div>
      </button>

      {/* Info */}
      <div className="p-5 bg-white border-t border-line">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-ink font-semibold text-base leading-tight">{template.title}</h3>
          {isSelected && (
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent flex items-center justify-center ml-2">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </span>
          )}
        </div>
        <p className="text-xs text-muted line-clamp-2 leading-relaxed">{template.description}</p>
        <div className="mt-3 flex items-center gap-2 text-[10px] text-faint">
          <button
            onClick={() => onPreview(template)}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-surface hover:bg-accent/10 hover:text-accent transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </button>
          <span className="text-line-hover">|</span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {template.sections.length} section
          </span>
          {(template as any).isCommunity && (
            <span className="ml-auto flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-accent/10 text-accent text-[9px] font-medium">
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Komunitas
            </span>
          )}
        </div>
        {/* Select button */}
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(template); }}
          className={`mt-3 w-full py-2 text-xs font-semibold rounded-lg transition-all ${
            isSelected
              ? "bg-accent text-white"
              : "bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20"
          }`}
        >
          {isSelected ? (
            <span className="inline-flex items-center justify-center gap-1.5">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              Dipilih
            </span>
          ) : (
            "Pilih Template"
          )}
        </button>
      </div>
    </div>
  );
}

type GalleryTemplate = Template & { isCommunity?: boolean; createdAt?: string };

export default function TemplatesPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selectedTemplate, setSelectedTemplate] = useState<GalleryTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [communityTemplates, setCommunityTemplates] = useState<GalleryTemplate[]>([]);

  // Fetch community templates on mount
  useEffect(() => {
    fetchApprovedTemplates().then((cts) => {
      setCommunityTemplates(cts.map(communityToGalleryTemplate));
    });
  }, []);

  // Community templates (user-shared) only
  const allTemplates = communityTemplates;

  const filtered = activeCategory === "Semua"
    ? allTemplates
    : allTemplates.filter((t) => t.category === activeCategory);

  const handleSelect = (t: GalleryTemplate) => {
    setSelectedTemplate(t);
  };

  const handleUseTemplate = async () => {
    if (!selectedTemplate) return;

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      // Redirect to register page with template pre-selected
      router.push(`/auth/register?template=${selectedTemplate.id}`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create a new page from the template
      const page = createPageFromTemplate(selectedTemplate);

      // Save to Supabase (columns: id, user_id, data, created_at, updated_at)
      const { error: saveError } = await supabase
        .from("builder_pages")
        .insert({
          id: page.id,
          user_id: session.user.id,
          data: page,
          created_at: page.createdAt,
          updated_at: page.updatedAt,
        });

      if (saveError) throw saveError;

      // Redirect to builder editor
      router.push(`/builder/${page.id}`);
    } catch (err: any) {
      setError(err.message || "Gagal menggunakan template");
      setLoading(false);
    }
  };

  // Preview state
  const [previewTemplate, setPreviewTemplate] = useState<GalleryTemplate | null>(null);

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      {/* Back button */}
      <div className="container mx-auto px-6 mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Beranda
        </Link>
      </div>

      {/* Header */}
      <div className="container mx-auto px-6 mb-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="badge-premium mb-4 inline-flex">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Pilih Template
          </div>
          <h1            className="heading-lg mb-4">
            Template dari{" "}
            <span className="text-accent">Komunitas</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Template yang dibagikan oleh pengguna lain. Pilih template, lalu kustomisasi dengan drag-and-drop builder kami.
            Tidak perlu coding sama sekali.
          </p>
        </div>
      </div>

      {/* Category filter */}
      <div className="container mx-auto px-6 mb-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                activeCategory === cat
                  ? "bg-ink text-white"
                  : "bg-white text-muted border border-line hover:bg-surface hover:text-ink"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Template grid */}
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filtered.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={handleSelect}
              isSelected={selectedTemplate?.id === template.id}
              onPreview={(t) => setPreviewTemplate(t)}
            />
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-surface border border-line flex items-center justify-center">
              <svg className="w-8 h-8 text-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-ink font-semibold text-lg mb-2">Belum Ada Template dari Komunitas</h3>
            <p className="text-muted text-sm max-w-md mx-auto">
              {activeCategory === "Semua"
                ? "Ketika pengguna membagikan template mereka, template akan tampil di sini setelah disetujui."
                : "Belum ada template di kategori ini."}
            </p>
          </div>
        )}
      </div>

      {/* Selected template - floating action bar */}
      {selectedTemplate && !showConfirm && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-line">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Monogram title={selectedTemplate.title} />
              <div>
                <p className="text-ink font-semibold text-sm">{selectedTemplate.title}</p>
                <p className="text-xs text-faint">{selectedTemplate.sections.length} section • {selectedTemplate.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="px-4 py-2 text-sm text-muted hover:text-ink transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                className="px-6 py-2.5 bg-ink text-white font-semibold rounded-xl hover:bg-black transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Gunakan Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation modal */}
      {showConfirm && selectedTemplate && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6">
          <div className="bg-white border border-line rounded-2xl p-8 w-full max-w-md shadow-xl">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <Monogram title={selectedTemplate.title} className="w-14 h-14 text-xl" />
              </div>
              <h3 className="text-xl font-bold text-ink mb-2">Gunakan Template</h3>
              <p className="text-sm text-muted">
                Template <span className="text-ink font-semibold">{selectedTemplate.title}</span> akan digunakan sebagai dasar halaman baru Anda. Anda bisa mengeditnya nanti di builder.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 border border-line text-muted rounded-xl hover:bg-surface transition-colors"
                disabled={loading}
              >
                Batal
              </button>
              <button
                onClick={handleUseTemplate}
                disabled={loading}
                className="flex-1 py-3 bg-ink text-white font-semibold rounded-xl hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Ya, Gunakan!"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for mobile */}
      {selectedTemplate && <div className="h-24" />}

      {/* Full Website Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
          {/* Preview toolbar */}
          <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-line flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-1.5 text-muted hover:text-ink rounded-lg hover:bg-surface transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="w-px h-5 bg-line" />
              <Monogram title={previewTemplate.title} />
              <div>
                <p className="text-ink font-semibold text-sm">{previewTemplate.title}</p>
                <p className="text-[10px] text-faint">{previewTemplate.sections.length} section • Scroll untuk lihat semua</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const t = previewTemplate;
                  setPreviewTemplate(null);
                  setSelectedTemplate(t);
                  setShowConfirm(true);
                }}
                className="px-5 py-2 bg-ink text-white text-sm font-semibold rounded-lg hover:bg-black transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Gunakan Template
              </button>
            </div>
          </div>

          {/* Preview content - full website, scrollable */}
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="max-w-[1200px] mx-auto">
              {previewTemplate.sections.map((section, idx) => (
                <div key={section.id || idx}>
                  {section.columns.map((col, ci) => (
                    <div key={col.id || ci} className="max-w-[1200px] mx-auto px-4" style={{ paddingTop: "40px", paddingBottom: "40px" }}>
                      <div className="flex gap-4">
                        <div
                          key={col.id || ci}
                          style={{ flex: col.width || 12, maxWidth: `${((col.width || 12) / 12) * 100}%` }}
                        >
                          <div className="space-y-2">
                            {col.elements.map((el) => (
                              <div key={el.id}>
                                <ElementRenderer element={el} />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
