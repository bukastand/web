"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
  const [error, setError] = useState("");
  const [dbReady, setDbReady] = useState(false);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        if (error.code === "PGRST116" || error.message?.includes("does not exist")) {
          setDbReady(false);
        } else {
          setError(error.message);
        }
        return;
      }
      if (data) {
        setContacts(data as Contact[]);
        setDbReady(true);
      }
    } catch {
      setDbReady(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadContacts(); }, []);

  const markAsRead = async (id: number) => {
    await supabase.from("contacts").update({ is_read: true }).eq("id", id);
    loadContacts();
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!dbReady) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Pesan Masuk</h1>
        <p className="text-gray-400 mb-8">Pesan dari form kontak website</p>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Database Table Belum Siap</h3>
          <p className="text-gray-400 text-sm mb-4 max-w-lg mx-auto">
            Tabel <code className="text-[#22c55e]">contacts</code> belum ada di database Supabase.
            Jalankan SQL di bawah di Supabase SQL Editor.
          </p>
          <div className="bg-[#0f172a] rounded-xl p-4 text-left font-mono text-xs text-gray-300 mb-4 max-w-xl mx-auto overflow-x-auto">
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
          <a href="https://supabase.com/dashboard/project/ejyqtuzlcdnuuzgqfweo/sql/new" target="_blank" rel="noopener noreferrer"
            className="inline-block px-6 py-2.5 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-colors text-sm">
            Buka Supabase SQL Editor
          </a>
        </div>
      </div>
    );
  }

  const unread = contacts.filter(c => !c.is_read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Pesan Masuk</h1>
          <p className="text-gray-400">{contacts.length} pesan • {unread} belum dibaca</p>
        </div>
        <button onClick={loadContacts} className="px-4 py-2 bg-white/10 text-gray-300 rounded-xl hover:bg-white/20 transition-colors text-sm">↻ Refresh</button>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-gray-500">Belum ada pesan masuk</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((c) => (
            <div key={c.id} className={`bg-white/5 border rounded-2xl p-5 transition-all ${c.is_read ? "border-white/10" : "border-[#22c55e]/30 bg-[#22c55e]/5"}`}
              onClick={() => !c.is_read && markAsRead(c.id)}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-white font-semibold">{c.name}</p>
                  <p className="text-xs text-gray-400">{c.email}{c.phone ? ` • ${c.phone}` : ""}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!c.is_read && <span className="w-2 h-2 rounded-full bg-[#22c55e]" />}
                  <span className="text-[10px] text-gray-500">{new Date(c.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              </div>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">{c.message}</p>
              {c.page_url && <p className="text-xs text-gray-500 mt-2">Dari halaman: {c.page_url}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
