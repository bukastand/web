"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Service {
  id?: number;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
}

const emptyService: Service = {
  title: "",
  description: "",
  icon: "💻",
  sort_order: 0,
  is_active: true,
};

export default function ServicesEditor() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    const { data } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setServices(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setMessage("");

    if (editing.id) {
      const { error } = await supabase
        .from("services")
        .update({ ...editing, updated_at: new Date().toISOString() })
        .eq("id", editing.id);
      if (error) setMessage("Error: " + error.message);
      else setMessage("Berhasil disimpan!");
    } else {
      const { error } = await supabase.from("services").insert([editing]);
      if (error) setMessage("Error: " + error.message);
      else setMessage("Berhasil ditambahkan!");
    }

    setSaving(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus layanan ini?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (!error) load();
  };

  if (loading)
    return <div className="text-gray-400 text-center py-12">Memuat...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Layanan</h1>
          <p className="text-gray-400">Kelola daftar layanan website</p>
        </div>
        <button
          onClick={() => setEditing(emptyService)}
          className="px-4 py-2 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-colors text-sm"
        >
          + Tambah Layanan
        </button>
      </div>

      {/* Edit/Create Form */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-white mb-4">
              {editing.id ? "Edit Layanan" : "Tambah Layanan"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Icon (emoji)</label>
                <input
                  type="text"
                  value={editing.icon}
                  onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#22c55e]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Judul</label>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#22c55e]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Deskripsi</label>
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#22c55e]/50 resize-y"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Urutan</label>
                <input
                  type="number"
                  value={editing.sort_order}
                  onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#22c55e]/50"
                />
              </div>
            </div>
            {message && (
              <div className={`mt-4 p-2 text-sm rounded-lg ${message.includes("Berhasil") ? "text-[#22c55e] bg-[#22c55e]/10" : "text-red-400 bg-red-500/10"}`}>
                {message}
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving || !editing.title}
                className="px-6 py-2 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-colors disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
              <button
                onClick={() => {
                  setEditing(null);
                  setMessage("");
                }}
                className="px-6 py-2 bg-white/10 text-gray-300 font-semibold rounded-xl hover:bg-white/20 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-gray-400">
                <th className="text-left p-4 font-medium">Urutan</th>
                <th className="text-left p-4 font-medium">Icon</th>
                <th className="text-left p-4 font-medium">Judul</th>
                <th className="text-left p-4 font-medium">Deskripsi</th>
                <th className="text-right p-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-white/5 text-white hover:bg-white/5 transition-colors"
                >
                  <td className="p-4 text-gray-400">{s.sort_order}</td>
                  <td className="p-4 text-2xl">{s.icon}</td>
                  <td className="p-4 font-medium">{s.title}</td>
                  <td className="p-4 text-gray-400 max-w-xs truncate">
                    {s.description}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setEditing(s)}
                      className="text-[#22c55e] hover:text-[#4ade80] transition-colors mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => s.id && handleDelete(s.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Belum ada layanan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
