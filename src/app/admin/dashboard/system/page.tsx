"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface StorageInfo {
  bucketName: string;
  fileCount: number;
  totalSizeMB: number;
}

export default function SystemPage() {
  const [loading, setLoading] = useState(true);
  const [migrating, setMigrating] = useState(false);
  const [migrateResult, setMigrateResult] = useState("");
  const [storage, setStorage] = useState<StorageInfo[]>([]);

  useEffect(() => {
    async function load() {
      try {
        // Try to get storage info
        const { data: files } = await supabase.storage.from("page-images").list("", { limit: 1000 });
        const fileCount = files?.length || 0;
        const totalBytes = files?.reduce((sum, f) => sum + (f.metadata?.size || 0), 0) || 0;

        setStorage([{
          bucketName: "page-images",
          fileCount,
          totalSizeMB: Math.round((totalBytes / (1024 * 1024)) * 100) / 100,
        }]);
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  const runMigration = async () => {
    setMigrating(true);
    setMigrateResult("");
    try {
      const res = await fetch("/api/migrate", { method: "POST" });
      const data = await res.json();
      setMigrateResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setMigrateResult(`Error: ${err.message}`);
    }
    setMigrating(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Sistem</h1>
      <p className="text-gray-400 mb-8">Storage, migrasi database, dan log</p>

      <div className="space-y-6 max-w-3xl">
        {/* Storage */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">💾 Storage Usage</h2>
          {loading ? (
            <p className="text-gray-500 text-sm">Memuat...</p>
          ) : storage.length > 0 ? (
            <div className="space-y-3">
              {storage.map((s) => (
                <div key={s.bucketName} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <p className="text-white font-medium text-sm">{s.bucketName}</p>
                    <p className="text-xs text-gray-500">{s.fileCount} file</p>
                  </div>
                  <span className="text-lg font-bold text-[#22c55e]">{s.totalSizeMB} MB</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Gagal memuat data storage</p>
          )}
        </div>

        {/* Database Migration */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-2">🗄️ Database Migration</h2>
          <p className="text-xs text-gray-500 mb-4">Jalankan migrasi SQL untuk memperbarui struktur database</p>
          <button onClick={runMigration} disabled={migrating}
            className="px-5 py-2.5 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors text-sm disabled:opacity-50 flex items-center gap-2">
            {migrating ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Migrating...</>
            ) : "Jalankan Migrasi DB"}
          </button>
          {migrateResult && (
            <div className="mt-4 p-3 rounded-xl bg-[#0f172a] border border-white/10 font-mono text-xs text-gray-300 max-h-48 overflow-y-auto">
              <pre className="whitespace-pre-wrap">{migrateResult}</pre>
            </div>
          )}
        </div>

        {/* WebP Compression Log */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-2">🖼️ WebP Compression</h2>
          <p className="text-xs text-gray-500 mb-4">
            Semua gambar yang diupload via builder dikompresi ke format WebP (quality 0.8, max 1920px)
            sebelum diupload ke Supabase Storage. Jika gagal upload, gambar disimpan sebagai base64.
          </p>
          <div className="bg-[#0f172a] rounded-xl p-4 text-xs text-gray-400">
            <p><span className="text-[#22c55e]">✓</span> Format: WebP</p>
            <p><span className="text-[#22c55e]">✓</span> Kualitas: 0.8 (80%)</p>
            <p><span className="text-[#22c55e]">✓</span> Max dimensi: 1920px</p>
            <p><span className="text-[#22c55e]">✓</span> Bucket: page-images</p>
            <p className="mt-2 text-gray-600">Untuk melihat log detail, cek browser console di halaman builder saat upload gambar.</p>
          </div>
        </div>

        {/* Environment */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-2">🔧 Environment</h2>
          <div className="bg-[#0f172a] rounded-xl p-4 text-xs text-gray-400 font-mono">
            <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 40)}...</p>
            <p>Service Key: {process.env.SUPABASE_SERVICE_ROLE_KEY ? "✓ Configured" : "✗ Not configured"}</p>
            <p>Resend API: {process.env.RESEND_API_KEY ? "✓ Configured" : "✗ Not configured"}</p>
            <p>Mode: {process.env.NODE_ENV}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
