"use client";

import { useEffect, useState } from "react";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  page_url: string | null;
  created_at: string;
  is_read: boolean;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/contacts");
        const data = await res.json();
        setContacts(data.contacts || []);
        setStatus(data.status || "");
      } catch {
        setStatus("error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Pesan Masuk</h1>
          <p className="text-gray-400">Pesan dari form kontak website</p>
        </div>
      </div>

      {/* Info card - data belum disimpan ke DB */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">Contact Form via Email</h3>
            <p className="text-sm text-gray-400 mb-3">
              Saat ini pesan contact form langsung dikirim ke email via Resend dan belum disimpan ke database.
              Untuk melihat pesan masuk, cek email Anda.
            </p>
            <div className="bg-[#0f172a] rounded-xl p-4 font-mono text-xs text-gray-300">
              <p className="text-gray-500 mb-2">📋 SQL untuk simpan ke database:</p>
              <pre className="whitespace-pre-wrap">{`CREATE TABLE IF NOT EXISTS contacts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  page_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_read BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view contacts" ON contacts
  FOR ALL USING (public.is_admin());`}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Status - if no contacts stored */}
      {contacts.length === 0 && (
        <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Belum Ada Pesan Tersimpan</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Pesan contact form saat ini dikirim via email. Untuk menyimpannya di database, jalankan SQL di atas dan update endpoint <code className="text-[#22c55e]">/api/contact</code>.
          </p>
        </div>
      )}
    </div>
  );
}
