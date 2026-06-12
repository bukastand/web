"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Settings {
  site_name: string;
  tagline: string;
  description: string;
  whatsapp_number: string;
  email: string;
  address: string;
}

const defaults: Settings = {
  site_name: "PAGODA STUDIO",
  tagline: "Jasa Pembuatan Website Profesional",
  description: "Website modern, cepat, mobile friendly...",
  whatsapp_number: "6282210099969",
  email: "info@pagodastudio.com",
  address: "Payakumbuh, Sumbar",
};

export default function SettingsEditor() {
  const [data, setData] = useState<Settings>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.from("site_settings").select("*").eq("id", 1).single().then(({ data: d }) => {
      if (d) setData(d);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    const { error } = await supabase
      .from("site_settings")
      .upsert({ id: 1, ...data, updated_at: new Date().toISOString() });

    if (error) setMessage("Gagal: " + error.message);
    else setMessage("Berhasil disimpan!");
    setSaving(false);
  };

  if (loading) return <div className="text-gray-400 text-center py-12">Memuat...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Pengaturan</h1>
      <p className="text-gray-400 mb-8">Pengaturan umum website</p>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5 max-w-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nama Website" value={data.site_name} onChange={(v) => setData({ ...data, site_name: v })} />
          <Field label="Tagline" value={data.tagline} onChange={(v) => setData({ ...data, tagline: v })} />
        </div>
        <FieldTextarea label="Deskripsi" value={data.description} onChange={(v) => setData({ ...data, description: v })} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="No. WhatsApp" value={data.whatsapp_number} onChange={(v) => setData({ ...data, whatsapp_number: v })} />
          <Field label="Email" value={data.email} onChange={(v) => setData({ ...data, email: v })} />
        </div>
        <Field label="Alamat" value={data.address} onChange={(v) => setData({ ...data, address: v })} />

        <div className="pt-4 border-t border-white/10">
          <button onClick={handleSave} disabled={saving}
            className="px-6 py-3 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-colors disabled:opacity-50">
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          {message && (
            <span className={`ml-4 text-sm ${message.includes("Berhasil") ? "text-[#22c55e]" : "text-red-400"}`}>{message}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#22c55e]/50 transition-colors" />
    </div>
  );
}

function FieldTextarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3}
        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#22c55e]/50 transition-colors resize-y" />
    </div>
  );
}
