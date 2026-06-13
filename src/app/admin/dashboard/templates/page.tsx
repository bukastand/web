"use client";

import { useEffect, useState } from "react";
import { fetchAllTemplates, approveTemplate, rejectTemplate, type CommunityTemplate } from "@/lib/supabase/community-templates";
import { createPageFromTemplate } from "@/lib/builder/templates";

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<CommunityTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [preview, setPreview] = useState<CommunityTemplate | null>(null);

  const loadTemplates = async () => {
    setLoading(true);
    const data = await fetchAllTemplates();
    setTemplates(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    await approveTemplate(id);
    await loadTemplates();
    setActionLoading(null);
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    await rejectTemplate(id);
    await loadTemplates();
    setActionLoading(null);
  };

  const pending = templates.filter((t) => !t.is_approved);
  const approved = templates.filter((t) => t.is_approved);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Kelola Template</h1>
      <p className="text-gray-400 mb-8">Atur template dari komunitas pengguna</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-white/10 p-5">
          <p className="text-3xl font-bold text-white mb-1">{templates.length}</p>
          <p className="text-sm text-gray-400">Total Template</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-white/10 p-5">
          <p className="text-3xl font-bold text-amber-400 mb-1">{pending.length}</p>
          <p className="text-sm text-gray-400">Menunggu Persetujuan</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-white/10 p-5">
          <p className="text-3xl font-bold text-emerald-400 mb-1">{approved.length}</p>
          <p className="text-sm text-gray-400">Disetujui</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <p className="text-gray-500">Belum ada template dari komunitas</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Section */}
          {pending.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Menunggu Persetujuan ({pending.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pending.map((t) => (
                  <TemplateCard
                    key={t.id}
                    template={t}
                    actionLoading={actionLoading}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onPreview={setPreview}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Approved Section */}
          {approved.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-emerald-400 mb-4">
                Disetujui ({approved.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {approved.map((t) => (
                  <TemplateCard
                    key={t.id}
                    template={t}
                    actionLoading={actionLoading}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onPreview={setPreview}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6">
          <div className="bg-[#1e293b] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-[#1e293b] z-10 p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-white font-semibold">{preview.title}</h3>
              <button onClick={() => setPreview(null)} className="text-gray-400 hover:text-white p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-400 mb-4">{preview.description}</p>
              <div className="space-y-2 mb-4">
                <p className="text-xs text-gray-500">Kategori: {preview.category}</p>
                <p className="text-xs text-gray-500">Section: {preview.data?.sections?.length || 0}</p>
                <p className="text-xs text-gray-500">Dibuat: {new Date(preview.created_at).toLocaleDateString("id-ID")}</p>
              </div>
              {preview.data?.sections?.slice(0, 3).map((sec: any, i: number) => (
                <div key={i} className="mb-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-gray-400 font-medium mb-1">Section {i + 1}</p>
                  <p className="text-[10px] text-gray-500">
                    {sec.columns?.length || 0} kolom • {sec.columns?.reduce((s: number, c: any) => s + (c.elements?.length || 0), 0) || 0} element
                  </p>
                </div>
              ))}
              {preview.data?.sections?.length > 3 && (
                <p className="text-xs text-gray-600 text-center">...dan {preview.data.sections.length - 3} section lainnya</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TemplateCard({
  template,
  actionLoading,
  onApprove,
  onReject,
  onPreview,
}: {
  template: CommunityTemplate;
  actionLoading: string | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onPreview: (t: CommunityTemplate | null) => void;
}) {
  const isLoading = actionLoading === template.id;

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all ${
      template.is_approved ? "border-emerald-500/20 bg-emerald-500/5" : "border-amber-500/20 bg-amber-500/5"
    }`}>
      <div className={`h-24 bg-gradient-to-br ${template.preview_color} flex items-center justify-center`}>
        <span className="text-4xl">{template.icon}</span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white font-semibold text-sm">{template.title}</h3>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
            template.is_approved
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-amber-500/20 text-amber-400"
          }`}>
            {template.is_approved ? "Disetujui" : "Pending"}
          </span>
        </div>
        <p className="text-[11px] text-gray-500 line-clamp-2 mb-3">{template.description}</p>
        <div className="flex items-center gap-2 mb-3 text-[10px] text-gray-600">
          <span>{template.category}</span>
          <span>•</span>
          <span>{template.data?.sections?.length || 0} section</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onPreview(template)}
            className="flex-1 py-1.5 text-xs text-gray-400 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
          >
            Preview
          </button>
          {!template.is_approved ? (
            <>
              <button
                onClick={() => onApprove(template.id)}
                disabled={!!actionLoading}
                className="flex-1 py-1.5 text-xs bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {isLoading ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Setujui"
                )}
              </button>
              <button
                onClick={() => onReject(template.id)}
                disabled={!!actionLoading}
                className="flex-1 py-1.5 text-xs bg-red-500/20 text-red-400 font-semibold rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"
              >
                Tolak
              </button>
            </>
          ) : (
            <button
              onClick={() => onReject(template.id)}
              disabled={!!actionLoading}
              className="flex-1 py-1.5 text-xs border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              Hapus
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
