"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { templates, createPageFromTemplate } from "@/lib/builder/templates";
import type { Template } from "@/lib/builder/templates";
import { fetchApprovedTemplates, communityToGalleryTemplate } from "@/lib/supabase/community-templates";

// ElementRenderer for preview
import { ElementRenderer } from "@/components/builder/elements/ElementRenderer";

const categories = ["Semua", "Bisnis", "Kreatif", "Event", "Lainnya"];

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
          ? "border-[#22c55e] ring-2 ring-[#22c55e]/30 shadow-lg shadow-[#22c55e]/10"
          : "border-white/10 hover:border-[#22c55e]/40 hover:shadow-lg hover:shadow-[#22c55e]/5"
      }`}
    >
      {/* Preview thumbnail - click to preview */}
      <button
        onClick={() => onPreview(template)}
        className="w-full text-left"
      >
        <div className={`h-48 bg-gradient-to-br ${template.previewColor} flex items-center justify-center relative overflow-hidden`}>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-white/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <span className="text-5xl mb-2">{template.icon}</span>
            <span className="text-white/60 text-xs font-medium uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
              {template.category}
            </span>
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-white/20 backdrop-blur-md px-6 py-2 rounded-xl">
              👁️ Preview
            </span>
          </div>
        </div>
      </button>

      {/* Info */}
      <div className="p-5 bg-[#1e293b]">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white font-semibold text-base leading-tight">{template.title}</h3>
          {isSelected && (
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#22c55e] flex items-center justify-center ml-2">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{template.description}</p>
        <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-500">
          <button
            onClick={() => onPreview(template)}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 hover:bg-[#22c55e]/20 hover:text-[#22c55e] transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview
          </button>
          <span className="text-gray-700">|</span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {template.sections.length} section
          </span>
          {(template as any).isCommunity && (
            <span className="ml-auto flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[9px] font-medium">
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
              ? "bg-[#22c55e] text-white"
              : "bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30 hover:bg-[#22c55e]/20"
          }`}
        >
          {isSelected ? "✓ Dipilih" : "Pilih Template"}
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

  // Combine built-in + community templates
  const allTemplates = [...templates, ...communityTemplates];

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
  const [previewSection, setPreviewSection] = useState(0);

  // Reset preview section when template changes
  useEffect(() => {
    setPreviewSection(0);
  }, [previewTemplate]);

  return (
    <div className="min-h-screen bg-[#0f172a] pt-24 pb-16">
      {/* Back button */}
      <div className="container mx-auto px-6 mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 text-[#4ade80] text-sm font-medium mb-4 backdrop-blur-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Pilih Template
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Mulai dengan{" "}
            <span className="gradient-text">Template Siap Pakai</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Pilih template landing page profesional, lalu kustomisasi dengan drag-and-drop builder kami.
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
                  ? "bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30"
                  : "text-gray-400 border border-white/10 hover:border-white/30 hover:text-white"
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
          <div className="text-center py-16">
            <p className="text-gray-500">Tidak ada template di kategori ini</p>
          </div>
        )}
      </div>

      {/* Selected template - floating action bar */}
      {selectedTemplate && !showConfirm && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#1e293b]/95 backdrop-blur-lg border-t border-white/10">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-2xl">{selectedTemplate.icon}</span>
              <div>
                <p className="text-white font-semibold text-sm">{selectedTemplate.title}</p>
                <p className="text-xs text-gray-500">{selectedTemplate.sections.length} section • {selectedTemplate.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                className="px-6 py-2.5 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-all flex items-center gap-2"
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
          <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-8 w-full max-w-md">
            <div className="text-center mb-6">
              <span className="text-4xl mb-3 block">{selectedTemplate.icon}</span>
              <h3 className="text-xl font-bold text-white mb-2">Gunakan Template</h3>
              <p className="text-sm text-gray-400">
                Template <span className="text-white font-semibold">{selectedTemplate.title}</span> akan digunakan sebagai dasar halaman baru Anda. Anda bisa mengeditnya nanti di builder.
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
                className="flex-1 py-3 border border-white/10 text-gray-300 rounded-xl hover:bg-white/5 transition-colors"
                disabled={loading}
              >
                Batal
              </button>
              <button
                onClick={handleUseTemplate}
                disabled={loading}
                className="flex-1 py-3 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
          <div className="flex items-center justify-between px-6 py-3 bg-[#0f172a] border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="w-px h-5 bg-white/10" />
              <span className="text-2xl">{previewTemplate.icon}</span>
              <div>
                <p className="text-white font-semibold text-sm">{previewTemplate.title}</p>
                <p className="text-[10px] text-gray-500">{previewTemplate.sections.length} section</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewSection(Math.max(0, previewSection - 1))}
                disabled={previewSection === 0}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-xs text-gray-500">{previewSection + 1}/{previewTemplate.sections.length}</span>
              <button
                onClick={() => setPreviewSection(Math.min(previewTemplate.sections.length - 1, previewSection + 1))}
                disabled={previewSection >= previewTemplate.sections.length - 1}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div className="w-px h-5 bg-white/10 mx-1" />
              <button
                onClick={() => {
                  const t = previewTemplate;
                  setPreviewTemplate(null);
                  setSelectedTemplate(t);
                  setShowConfirm(true);
                }}
                className="px-4 py-2 bg-[#22c55e] text-white text-xs font-semibold rounded-lg hover:bg-[#16a34a] transition-all"
              >
                Gunakan Template
              </button>
            </div>
          </div>

          {/* Preview content */}
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="max-w-[1200px] mx-auto">
              {previewTemplate.sections.map((section, idx) => {
                // Only show current section or all for a full preview
                if (previewSection >= 0 && idx !== previewSection) return null;
                return (
                  <div key={idx} className="border-b border-gray-100">
                    {section.columns.map((col, ci) => (
                      <div key={ci} className="max-w-[1200px] mx-auto px-4" style={{ paddingTop: "40px", paddingBottom: "40px" }}>
                        <div className="flex gap-4">
                          <div key={col.id} style={{ flex: col.width || 12, maxWidth: `${((col.width || 12) / 12) * 100}%` }}>
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
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
