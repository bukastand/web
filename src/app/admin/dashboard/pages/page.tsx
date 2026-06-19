"use client";

import { useEffect, useState } from "react";

interface PageItem {
  id: string;
  userId: string;
  userEmail: string;
  title: string;
  slug: string;
  sections: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const loadPages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/pages");
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setPages(data.pages || []);
    } catch {
      setError("Gagal memuat halaman");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPages(); }, []);

  const handleDelete = async () => {
    if (!deleteId || !deleteUserId) return;
    try {
      const res = await fetch("/api/admin/pages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId: deleteId, userId: deleteUserId }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setMessage("Halaman berhasil dihapus!");
      loadPages();
    } catch {
      setError("Gagal menghapus halaman");
    }
    setDeleteId(null);
    setDeleteUserId(null);
  };

  const filtered = pages.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.userEmail.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = pages.length;
  const totalPublished = pages.filter(p => p.published).length;
  const totalDraft = totalPages - totalPublished;
  const totalSections = pages.reduce((sum, p) => sum + p.sections, 0);

  if (loading) return <div className="text-center py-12 text-gray-400">Memuat...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Semua Halaman</h1>
          <p className="text-gray-400">Kelola halaman builder dari semua user</p>
        </div>
        <button onClick={loadPages} className="px-4 py-2 bg-white/10 text-gray-300 rounded-xl hover:bg-white/20 transition-colors text-sm">↻ Refresh</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4"><p className="text-2xl font-bold text-white">{totalPages}</p><p className="text-xs text-gray-500">Total Halaman</p></div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4"><p className="text-2xl font-bold text-[#22c55e]">{totalPublished}</p><p className="text-xs text-gray-500">Published</p></div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4"><p className="text-2xl font-bold text-amber-400">{totalDraft}</p><p className="text-xs text-gray-500">Draft</p></div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4"><p className="text-2xl font-bold text-blue-400">{totalSections}</p><p className="text-xs text-gray-500">Total Sections</p></div>
      </div>

      {/* Errors & Messages */}
      {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
      {message && <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">{message}</div>}

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Cari halaman atau email user..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#22c55e]/50" />
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-gray-400">
                <th className="text-left p-3 font-medium">Judul</th>
                <th className="text-left p-3 font-medium">User</th>
                <th className="text-center p-3 font-medium">Sections</th>
                <th className="text-center p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Diupdate</th>
                <th className="text-right p-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((page) => (
                <tr key={page.id} className="border-b border-white/5 text-white hover:bg-white/5 transition-colors">
                  <td className="p-3 font-medium truncate max-w-[180px]">{page.title}</td>
                  <td className="p-3 text-gray-400 text-xs">{page.userEmail}</td>
                  <td className="p-3 text-center text-gray-400">{page.sections}</td>
                  <td className="p-3 text-center">
                    {page.published
                      ? <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#22c55e]/20 text-[#22c55e] font-medium">Published</span>
                      : <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-500/20 text-gray-400 font-medium">Draft</span>}
                  </td>
                  <td className="p-3 text-xs text-gray-500">{new Date(page.updated_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => { setDeleteId(page.id); setDeleteUserId(page.userId); }}
                      className="px-2 py-1 text-xs bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Tidak ada halaman</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-white mb-2">Hapus Halaman?</h3>
            <p className="text-sm text-gray-300 mb-4">Halaman ini akan dihapus permanen. User tidak akan bisa mengaksesnya lagi.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors">Ya, Hapus</button>
              <button onClick={() => { setDeleteId(null); setDeleteUserId(null); }} className="flex-1 py-2.5 bg-white/10 text-gray-300 rounded-xl hover:bg-white/20 transition-colors">Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
