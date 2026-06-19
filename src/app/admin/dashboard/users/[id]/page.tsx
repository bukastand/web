"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "user";
  created_at: string;
}

interface BuilderPage {
  id: string;
  title: string;
  slug?: string;
  sections_count: number;
  published: boolean;
  updated_at: string;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<UserProfile | null>(null);
  const [pages, setPages] = useState<BuilderPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        // Load user info
        const userRes = await fetch(`/api/admin/users`);
        const userData = await userRes.json();
        const foundUser = (userData.users || []).find((u: any) => u.id === userId);
        if (foundUser) setUser(foundUser);
        else setError("User tidak ditemukan");

        // Load builder pages for this user
        const pagesRes = await fetch("/api/admin/users/builder-pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        if (pagesRes.ok) {
          const pagesData = await pagesRes.json();
          setPages(pagesData.pages || []);
        }
      } catch {
        setError("Gagal memuat data user");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div>
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">{error || "User tidak ditemukan"}</div>
        <Link href="/admin/dashboard/users" className="text-[#22c55e] hover:underline text-sm">&larr; Kembali ke daftar user</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back link */}
      <Link href="/admin/dashboard/users" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Kembali ke daftar user
      </Link>

      {/* User Profile Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-[#22c55e]/20 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-[#22c55e]">
              {(user.email?.charAt(0) || "?").toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white">{user.full_name || "Tanpa Nama"}</h1>
              {user.role === "admin" ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#22c55e]/15 text-[#22c55e] text-xs font-medium border border-[#22c55e]/25">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Admin
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 text-gray-400 text-xs font-medium border border-white/10">User</span>
              )}
            </div>
            <p className="text-gray-400 text-sm mb-3">{user.email}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Bergabung: {new Date(user.created_at).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}</span>
              <span>Halaman: {pages.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pages List */}
      <h2 className="text-lg font-semibold text-white mb-4">Halaman Builder</h2>

      {pages.length === 0 ? (
        <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 text-sm">User ini belum membuat halaman</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => (
            <div key={page.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-[#22c55e]/40 transition-all">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-white font-semibold text-sm truncate">{page.title}</h3>
                {page.published && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#22c55e]/20 text-[#22c55e] font-medium flex-shrink-0 ml-2">
                    Published
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-3">
                <span>{page.sections_count || 0} section{(page.sections_count || 0) !== 1 ? "s" : ""}</span>
                <span>•</span>
                <span>Diupdate: {new Date(page.updated_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
              </div>
              {page.slug && page.published && (
                <a
                  href={`https://pagodastudio.my.id/${page.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#22c55e] hover:underline"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {page.slug}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
