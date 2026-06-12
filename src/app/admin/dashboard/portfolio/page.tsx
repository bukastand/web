"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface PortfolioItem {
  id?: number;
  title: string;
  category: string;
  description: string;
  image_url: string | null;
  gradient_from: string;
  gradient_to: string;
  project_url: string | null;
  sort_order: number;
  is_active: boolean;
}

const emptyPortfolio: PortfolioItem = {
  title: "",
  category: "Website Sekolah",
  description: "",
  image_url: null,
  gradient_from: "emerald-600",
  gradient_to: "teal-700",
  project_url: null,
  sort_order: 0,
  is_active: true,
};

const categories = [
  "Website Sekolah", "Website Property", "Toko Online", "Klinik & RS",
  "Website Travel", "Website Hotel", "Portal Berita", "Company Profile",
  "Restaurant & Cafe", "Pemerintahan", "Custom Web App",
];

export default function PortfolioEditor() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    const { data } = await supabase
      .from("portfolio")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setMessage("");

    const payload = { ...editing, updated_at: new Date().toISOString() };

    if (editing.id) {
      const { error } = await supabase.from("portfolio").update(payload).eq("id", editing.id);
      if (error) setMessage("Error: " + error.message);
      else setMessage("Berhasil disimpan!");
    } else {
      const { error } = await supabase.from("portfolio").insert([payload]);
      if (error) setMessage("Error: " + error.message);
      else setMessage("Berhasil ditambahkan!");
    }

    setSaving(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus project ini?")) return;
    await supabase.from("portfolio").delete().eq("id", id);
    load();
  };

  if (loading) return <div className="text-gray-400 text-center py-12">Memuat...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Portfolio</h1>
          <p className="text-gray-400">Kelola galeri project</p>
        </div>
        <button
          onClick={() => setEditing(emptyPortfolio)}
          className="px-4 py-2 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-colors text-sm"
        >
          + Tambah Project
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-white mb-4">
              {editing.id ? "Edit Project" : "Tambah Project"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Judul Project</label>
                <input type="text" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#22c55e]/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Kategori</label>
                <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-[#0f172a] border border-white/10 text-white focus:outline-none focus:border-[#22c55e]/50">
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Deskripsi</label>
                <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={3} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#22c55e]/50 resize-y" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Gradient From</label>
                  <input type="text" value={editing.gradient_from} onChange={(e) => setEditing({ ...editing, gradient_from: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#22c55e]/50" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Gradient To</label>
                  <input type="text" value={editing.gradient_to} onChange={(e) => setEditing({ ...editing, gradient_to: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#22c55e]/50" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">URL Project (opsional)</label>
                <input type="text" value={editing.project_url || ""} onChange={(e) => setEditing({ ...editing, project_url: e.target.value || null })}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#22c55e]/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Urutan</label>
                <input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#22c55e]/50" />
              </div>
            </div>
            {message && (
              <div className={`mt-4 p-2 text-sm rounded-lg ${message.includes("Berhasil") ? "text-[#22c55e] bg-[#22c55e]/10" : "text-red-400 bg-red-500/10"}`}>
                {message}
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving || !editing.title}
                className="px-6 py-2 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-colors disabled:opacity-50">
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
              <button onClick={() => { setEditing(null); setMessage(""); }}
                className="px-6 py-2 bg-white/10 text-gray-300 font-semibold rounded-xl hover:bg-white/20 transition-colors">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="group rounded-2xl overflow-hidden border border-white/10 hover:border-[#22c55e]/40 transition-all duration-300">
            <div className={`h-32 bg-gradient-to-br from-${item.gradient_from} to-${item.gradient_to} flex items-center justify-center relative`}>
              <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/40 text-white text-xs rounded-full">{item.category}</span>
              <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="p-4 bg-[#0f172a]">
              <h3 className="text-white font-bold mb-1">{item.title}</h3>
              <p className="text-xs text-gray-400 line-clamp-2">{item.description}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setEditing(item)} className="flex-1 py-1.5 text-xs bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">Edit</button>
                <button onClick={() => item.id && handleDelete(item.id)} className="px-3 py-1.5 text-xs bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">Hapus</button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">Belum ada project</div>
        )}
      </div>
    </div>
  );
}
