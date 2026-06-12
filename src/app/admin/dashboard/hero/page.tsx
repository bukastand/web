"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface HeroData {
  id: number;
  badge_text: string;
  title_line1: string;
  title_line2: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  secondary_cta_text: string;
  secondary_cta_link: string;
}

const defaults: HeroData = {
  id: 1,
  badge_text: "PAGODA STUDIO — Since 2024",
  title_line1: "Jasa Pembuatan",
  title_line2: "Website Profesional",
  subtitle:
    "Website modern, cepat, mobile friendly, dan siap membantu bisnis Anda tampil lebih profesional dan mendapatkan lebih banyak pelanggan.",
  cta_text: "Konsultasi Gratis",
  cta_link: "https://wa.me/6282210099969",
  secondary_cta_text: "Lihat Paket",
  secondary_cta_link: "#paket",
};

export default function HeroEditor() {
  const [data, setData] = useState<HeroData>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase
      .from("hero_content")
      .select("*")
      .eq("id", 1)
      .single()
      .then(({ data: d, error }) => {
        if (d) setData(d);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    const { error } = await supabase
      .from("hero_content")
      .upsert({ ...data, updated_at: new Date().toISOString() });

    if (error) {
      setMessage("Gagal menyimpan: " + error.message);
    } else {
      setMessage("Berhasil disimpan!");
    }
    setSaving(false);
  };

  if (loading)
    return (
      <div className="text-gray-400 text-center py-12">Memuat data...</div>
    );

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Hero Section</h1>
      <p className="text-gray-400 mb-8">Edit teks utama di halaman depan</p>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5 max-w-3xl">
        <Field
          label="Badge Text"
          value={data.badge_text}
          onChange={(v) => setData({ ...data, badge_text: v })}
        />
        <Field
          label="Judul Baris 1"
          value={data.title_line1}
          onChange={(v) => setData({ ...data, title_line1: v })}
        />
        <Field
          label="Judul Baris 2"
          value={data.title_line2}
          onChange={(v) => setData({ ...data, title_line2: v })}
        />
        <FieldTextarea
          label="Subtitle"
          value={data.subtitle}
          onChange={(v) => setData({ ...data, subtitle: v })}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Teks Tombol CTA"
            value={data.cta_text}
            onChange={(v) => setData({ ...data, cta_text: v })}
          />
          <Field
            label="Link Tombol CTA"
            value={data.cta_link}
            onChange={(v) => setData({ ...data, cta_link: v })}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Teks Tombol Kedua"
            value={data.secondary_cta_text}
            onChange={(v) => setData({ ...data, secondary_cta_text: v })}
          />
          <Field
            label="Link Tombol Kedua"
            value={data.secondary_cta_link}
            onChange={(v) => setData({ ...data, secondary_cta_link: v })}
          />
        </div>

        <div className="pt-4 border-t border-white/10">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-colors disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          {message && (
            <span
              className={`ml-4 text-sm ${
                message.includes("Berhasil")
                  ? "text-[#22c55e]"
                  : "text-red-400"
              }`}
            >
              {message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#22c55e]/50 transition-colors"
      />
    </div>
  );
}

function FieldTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#22c55e]/50 transition-colors resize-y"
      />
    </div>
  );
}
