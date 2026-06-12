"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Pricing {
  id?: number;
  name: string;
  price: string;
  features: string[];
  is_popular: boolean;
  sort_order: number;
  is_active: boolean;
}

const emptyPricing: Pricing = {
  name: "",
  price: "",
  features: [""],
  is_popular: false,
  sort_order: 0,
  is_active: true,
};

export default function PricingEditor() {
  const [packages, setPackages] = useState<Pricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Pricing | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    const { data } = await supabase
      .from("pricing")
      .select("*")
      .order("sort_order", { ascending: true });
    if (data) setPackages(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setMessage("");
    const features = editing.features.filter((f) => f.trim());

    const payload = {
      ...editing,
      features: JSON.stringify(features),
      updated_at: new Date().toISOString(),
    };

    let error;
    if (editing.id) {
      const res = await supabase
        .from("pricing")
        .update(payload)
        .eq("id", editing.id);
      error = res.error;
    } else {
      const res = await supabase.from("pricing").insert([payload]);
      error = res.error;
    }

    if (error) setMessage("Error: " + error.message);
    else setMessage("Berhasil disimpan!");
    setSaving(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus paket ini?")) return;
    await supabase.from("pricing").delete().eq("id", id);
    load();
  };

  const addFeature = () => {
    if (!editing) return;
    setEditing({ ...editing, features: [...editing.features, ""] });
  };

  const updateFeature = (index: number, value: string) => {
    if (!editing) return;
    const features = [...editing.features];
    features[index] = value;
    setEditing({ ...editing, features });
  };

  const removeFeature = (index: number) => {
    if (!editing) return;
    setEditing({
      ...editing,
      features: editing.features.filter((_, i) => i !== index),
    });
  };

  if (loading)
    return <div className="text-gray-400 text-center py-12">Memuat...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Paket Harga</h1>
          <p className="text-gray-400">Kelola paket harga dan fitur</p>
        </div>
        <button
          onClick={() => setEditing(emptyPricing)}
          className="px-4 py-2 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-colors text-sm"
        >
          + Tambah Paket
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-white mb-4">
              {editing.id ? "Edit Paket" : "Tambah Paket"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Nama Paket</label>
                <input
                  type="text"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#22c55e]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Harga</label>
                <input
                  type="text"
                  value={editing.price}
                  onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#22c55e]/50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Fitur</label>
                <div className="space-y-2">
                  {editing.features.map((f, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={f}
                        onChange={(e) => updateFeature(i, e.target.value)}
                        className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#22c55e]/50"
                        placeholder="Nama fitur..."
                      />
                      <button
                        onClick={() => removeFeature(i)}
                        className="px-2 text-red-400 hover:text-red-300"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addFeature}
                    className="text-sm text-[#22c55e] hover:text-[#4ade80] transition-colors"
                  >
                    + Tambah fitur
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_popular"
                  checked={editing.is_popular}
                  onChange={(e) => setEditing({ ...editing, is_popular: e.target.checked })}
                  className="w-4 h-4 accent-[#22c55e]"
                />
                <label htmlFor="is_popular" className="text-sm text-gray-300">
                  Tandai sebagai paket populer
                </label>
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
                disabled={saving || !editing.name}
                className="px-6 py-2 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-colors disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
              <button
                onClick={() => { setEditing(null); setMessage(""); }}
                className="px-6 py-2 bg-white/10 text-gray-300 font-semibold rounded-xl hover:bg-white/20 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative rounded-2xl p-6 border transition-all duration-300 ${
              pkg.is_popular
                ? "bg-[#22c55e]/10 border-[#22c55e]/40"
                : "bg-white/5 border-white/10 hover:border-[#22c55e]/30"
            }`}
          >
            {pkg.is_popular && (
              <span className="absolute -top-2.5 right-4 px-3 py-0.5 bg-[#22c55e] text-white text-xs font-bold rounded-full">
                POPULER
              </span>
            )}
            <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
            <p className="text-2xl font-extrabold text-[#22c55e] mt-2 mb-4">
              {pkg.price}
            </p>
            <ul className="space-y-1.5 mb-6">
              {(Array.isArray(pkg.features) ? pkg.features : JSON.parse(pkg.features as string)).map(
                (f: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <svg className="w-4 h-4 text-[#22c55e] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                )
              )}
            </ul>
            <div className="flex gap-3">
              <button
                onClick={() => setEditing(pkg)}
                className="flex-1 py-2 text-sm bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => pkg.id && handleDelete(pkg.id)}
                className="px-3 py-2 text-sm bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
        {packages.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            Belum ada paket harga
          </div>
        )}
      </div>
    </div>
  );
}
