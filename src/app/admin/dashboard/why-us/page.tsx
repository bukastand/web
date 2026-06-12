"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface WhyUsItem {
  id?: number;
  title: string;
  description: string;
  icon_name: string;
  gradient: string;
  sort_order: number;
  is_active: boolean;
}

const emptyItem: WhyUsItem = {
  title: "",
  description: "",
  icon_name: "star",
  gradient: "from-emerald-500/20 to-emerald-500/5",
  sort_order: 0,
  is_active: true,
};

const iconOptions = ["star", "image", "smartphone", "zap", "settings", "shield", "heart", "globe"];
const gradientOptions = [
  "from-emerald-500/20 to-emerald-500/5",
  "from-blue-500/20 to-blue-500/5",
  "from-yellow-500/20 to-yellow-500/5",
  "from-purple-500/20 to-purple-500/5",
  "from-rose-500/20 to-rose-500/5",
  "from-cyan-500/20 to-cyan-500/5",
  "from-orange-500/20 to-orange-500/5",
  "from-pink-500/20 to-pink-500/5",
];

const iconMap: Record<string, string> = {
  star: "⭐", image: "🖼️", smartphone: "📱", zap: "⚡",
  settings: "⚙️", shield: "🛡️", heart: "❤️", globe: "🌐",
};

export default function WhyUsEditor() {
  const [items, setItems] = useState<WhyUsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<WhyUsItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    const { data } = await supabase.from("why_us").select("*").order("sort_order", { ascending: true });
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
      const { error } = await supabase.from("why_us").update(payload).eq("id", editing.id);
      if (error) setMessage("Error: " + error.message);
      else setMessage("Berhasil disimpan!");
    } else {
      const { error } = await supabase.from("why_us").insert([payload]);
      if (error) setMessage("Error: " + error.message);
      else setMessage("Berhasil ditambahkan!");
    }

    setSaving(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus item ini?")) return;
    await supabase.from("why_us").delete().eq("id", id);
    load();
  };

  if (loading) return <div className="text-gray-400 text-center py-12">Memuat...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Kenapa Kami</h1>
          <p className="text-gray-400">Kelola daftar keunggulan</p>
        </div>
        <button onClick={() => setEditing(emptyItem)}
          className="px-4 py-2 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-colors text-sm">
          + Tambah
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 w-full max-w-lg">
            <h2 className="text-lg font-bold text-white mb-4">{editing.id ? "Edit" : "Tambah"} Keunggulan</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Judul</label>
                <input type="text" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#22c55e]/50" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Deskripsi</label>
                <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={3} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#22c55e]/50 resize-y" />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Icon</label>
                <div className="flex gap-2 flex-wrap">
                  {iconOptions.map((icon) => (
                    <button key={icon} onClick={() => setEditing({ ...editing, icon_name: icon })}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                        editing.icon_name === icon ? "bg-[#22c55e]/20 border border-[#22c55e]/40" : "bg-white/5 border border-white/10 hover:border-white/30"
                      }`}>
                      {iconMap[icon]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Warna Gradient</label>
                <div className="flex gap-2 flex-wrap">
                  {gradientOptions.map((g) => (
                    <button key={g} onClick={() => setEditing({ ...editing, gradient: g })}
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${g} border transition-all ${
                        editing.gradient === g ? "border-white scale-110" : "border-white/10"
                      }`} />
                  ))}
                </div>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#22c55e]/40 transition-all duration-300">
            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl`} />
            <div className="relative z-10">
              <div className="text-3xl mb-3">{iconMap[item.icon_name] || "⭐"}</div>
              <h4 className="text-white font-bold mb-2">{item.title}</h4>
              <p className="text-sm text-gray-400">{item.description}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => setEditing(item)} className="text-xs text-[#22c55e] hover:text-[#4ade80] transition-colors">Edit</button>
                <button onClick={() => item.id && handleDelete(item.id)} className="text-xs text-red-400 hover:text-red-300 transition-colors">Hapus</button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">Belum ada data</div>
        )}
      </div>
    </div>
  );
}
