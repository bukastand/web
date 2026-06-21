"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import {
  type Article,
  getEmptyArticle,
  generateSlug,
  fetchAllArticles,
  saveArticle,
  deleteArticle,
} from "@/lib/supabase/articles";

// Import Quill CSS (global, works with SSR since CSS is extracted by Next.js)
import "react-quill-new/dist/quill.snow.css";

// Dynamic import for rich text editor (SSR disabled)
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillFormats = [
  "header",
  "bold", "italic", "underline", "strike",
  "color", "background",
  "list", "bullet", "indent",
  "align",
  "blockquote", "code-block",
  "link", "image",
  "direction",
];

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Article | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [dbReady, setDbReady] = useState(true);
  const [showQuill, setShowQuill] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAllArticles();
      if (data) {
        setArticles(data);
        setDbReady(true);
      }
    } catch {
      setDbReady(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Show Quill only when modal is open (fix SSR hydration)
  useEffect(() => {
    if (editing) {
      // Delay mounting Quill to ensure DOM is ready
      const t = setTimeout(() => setShowQuill(true), 100);
      return () => { clearTimeout(t); setShowQuill(false); };
    } else {
      setShowQuill(false);
    }
  }, [editing]);

  const handleSave = async () => {
    if (!editing || !editing.title || !editing.slug) return;
    setSaving(true);
    setMessage("");

    const success = await saveArticle(editing);
    if (success) {
      setMessage("Berhasil disimpan!");
      setEditing(null);
      load();
    } else {
      setMessage("Gagal menyimpan artikel.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus artikel ini? Tindakan ini tidak dapat dibatalkan.")) return;
    const success = await deleteArticle(id);
    if (success) load();
  };

  const handleCreateNew = async () => {
    const empty = getEmptyArticle();
    const slug = await generateSlug("Judul Artikel");
    setEditing({ ...empty, slug });
  };

  const handleTitleChange = async (title: string) => {
    if (!editing) return;
    // Auto-generate slug only for new articles
    const updated = { ...editing, title };
    if (!editing.id) {
      updated.slug = await generateSlug(title);
    }
    setEditing(updated);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;

    setUploadingImage(true);
    try {
      const fileName = `articles/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
      const { error: uploadError } = await supabase.storage
        .from("page-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        setMessage("Gagal upload gambar: " + uploadError.message);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("page-images")
        .getPublicUrl(fileName);

      if (urlData?.publicUrl) {
        setEditing({ ...editing, cover_image: urlData.publicUrl });
      }
    } catch (err: any) {
      setMessage("Gagal upload: " + (err?.message || "Error"));
    } finally {
      setUploadingImage(false);
    }
  };
  const quillInstanceRef = useRef<any>(null);

  const handleEditorImageUpload = async () => {
    // Create a hidden file input for image upload in editor
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e: any) => {
      const file = e.target?.files?.[0];
      if (!file || !editing) return;

      setUploadingImage(true);
      try {
        const fileName = `articles/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
        const { error: uploadError } = await supabase.storage
          .from("page-images")
          .upload(fileName, file, { upsert: true });

        if (uploadError) {
          setMessage("Gagal upload: " + uploadError.message);
          return;
        }

        const { data: urlData } = supabase.storage
          .from("page-images")
          .getPublicUrl(fileName);

        if (urlData?.publicUrl) {
          // Insert image at cursor position using Quill API
          const quill = quillInstanceRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection(true);
            quill.clipboard.dangerouslyPasteHTML(range.index, `<img src="${urlData.publicUrl}" alt="gambar" />`);
          } else {
            // Fallback: append to content
            const imgTag = `<img src="${urlData.publicUrl}" alt="gambar" />`;
            setEditing({ ...editing, content: editing.content + imgTag });
          }
        }
      } catch (err: any) {
        setMessage("Gagal upload: " + (err?.message || "Error"));
      } finally {
        setUploadingImage(false);
      }
    };
    input.click();
  };

  // Build Quill modules with wired image handler
  const getQuillModules = () => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image"],
        [{ direction: "rtl" }],
        ["clean"],
      ],
      handlers: {
        image: handleEditorImageUpload,
      },
    },
  });

  const quillFormats = [
    "header",
    "bold", "italic", "underline", "strike",
    "color", "background",
    "list", "bullet", "indent",
    "align",
    "blockquote", "code-block",
    "link", "image",
    "direction",
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!dbReady) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Artikel / Blog</h1>
            <p className="text-gray-400">Kelola artikel blog website</p>
          </div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Database Table Belum Siap</h3>
          <p className="text-gray-400 text-sm mb-4 max-w-lg mx-auto">
            Tabel <code className="text-[#22c55e]">articles</code> belum ada di database Supabase.
            Jalankan SQL di bawah di Supabase SQL Editor.
          </p>
          <div className="bg-[#0f172a] rounded-xl p-4 text-left font-mono text-xs text-gray-300 mb-4 max-w-xl mx-auto overflow-x-auto">
            <pre className="whitespace-pre-wrap">{`CREATE TABLE IF NOT EXISTS articles (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  cover_image TEXT,
  author TEXT NOT NULL DEFAULT 'Admin',
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published articles" ON articles
  FOR SELECT USING (published = true);
CREATE POLICY "Admins can manage articles" ON articles
  FOR ALL USING (public.is_admin());`}</pre>
          </div>
          <a
            href="https://supabase.com/dashboard/project/ejyqtuzlcdnuuzgqfweo/sql/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2.5 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-colors text-sm"
          >
            Buka Supabase SQL Editor
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Artikel / Blog</h1>
          <p className="text-gray-400">
            {articles.length} artikel &bull; {articles.filter((a) => a.published).length} dipublikasikan
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-colors text-sm"
        >
          + Tulis Artikel
        </button>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 w-full max-w-4xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">
                {editing.id ? "Edit Artikel" : "Tulis Artikel Baru"}
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
              {/* Title */}
              <div>
                <label className="block text-sm text-gray-300 mb-1 font-medium">Judul Artikel</label>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Masukkan judul artikel..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#22c55e]/50 text-lg font-semibold"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm text-gray-300 mb-1 font-medium">URL Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">/blog/</span>
                  <input
                    type="text"
                    value={editing.slug}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                    placeholder="judul-artikel"
                    className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#22c55e]/50 text-sm font-mono"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm text-gray-300 mb-1 font-medium">Ringkasan (Excerpt)</label>
                <textarea
                  value={editing.excerpt}
                  onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                  placeholder="Ringkasan singkat artikel yang akan tampil di card..."
                  rows={2}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#22c55e]/50 resize-y"
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm text-gray-300 mb-1 font-medium">Gambar Sampul</label>
                <div className="flex items-start gap-4">
                  {editing.cover_image ? (
                    <div className="relative w-32 h-20 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                      <img
                        src={editing.cover_image}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setEditing({ ...editing, cover_image: null })}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500/80 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                      >
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-20 rounded-xl bg-white/5 border border-dashed border-white/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <label className="cursor-pointer px-4 py-2 bg-white/10 text-gray-300 rounded-xl hover:bg-white/20 transition-colors text-sm">
                    {uploadingImage ? "Mengupload..." : "Pilih Gambar"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm text-gray-300 mb-1 font-medium">Penulis</label>
                <input
                  type="text"
                  value={editing.author}
                  onChange={(e) => setEditing({ ...editing, author: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#22c55e]/50"
                />
              </div>

              {/* Published toggle */}
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.published}
                    onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#22c55e]" />
                </label>
                <span className="text-sm text-gray-300">
                  {editing.published ? "Dipublikasikan" : "Draft"}
                </span>
              </div>

              {/* Rich Text Editor */}
              <div>
                <label className="block text-sm text-gray-300 mb-2 font-medium">Konten Artikel</label>
                {showQuill && (
                  <div className="bg-white rounded-xl overflow-hidden min-h-[400px] quill-editor-container">
                    <ReactQuill
                      value={editing.content}
                      onChange={(content: string) => setEditing({ ...editing, content })}
                      // @ts-expect-error - ref works at runtime despite dynamic import types
                      ref={(el: any) => { quillInstanceRef.current = el; }}
                      modules={getQuillModules()}
                      formats={quillFormats}
                      placeholder="Tulis konten artikel di sini..."
                      theme="snow"
                    />
                  </div>
                )}
                {uploadingImage && (
                  <p className="text-xs text-[#22c55e] mt-1">Mengupload gambar...</p>
                )}
              </div>

              {/* Message */}
              {message && (
                <div
                  className={`p-3 text-sm rounded-lg ${
                    message.includes("Berhasil")
                      ? "text-[#22c55e] bg-[#22c55e]/10"
                      : "text-red-400 bg-red-500/10"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
              <button
                onClick={handleSave}
                disabled={saving || !editing.title || !editing.slug}
                className="px-6 py-2.5 bg-[#22c55e] text-white font-semibold rounded-xl hover:bg-[#16a34a] transition-colors disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan Artikel"}
              </button>
              <button
                onClick={() => {
                  setEditing(null);
                  setMessage("");
                }}
                className="px-6 py-2.5 bg-white/10 text-gray-300 font-semibold rounded-xl hover:bg-white/20 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Article List */}
      {articles.length === 0 ? (
        <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <p className="text-gray-500">Belum ada artikel. Klik &quot;Tulis Artikel&quot; untuk memulai.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {articles.map((a) => (
            <div
              key={a.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Cover thumbnail */}
                {a.cover_image ? (
                  <div className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                    <img src={a.cover_image} alt={a.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-white font-semibold truncate">{a.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        /blog/{a.slug} &bull; {a.author}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          a.published
                            ? "bg-[#22c55e]/10 text-[#22c55e]"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {a.published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                  {a.excerpt && (
                    <p className="text-sm text-gray-400 mt-1 line-clamp-1">{a.excerpt}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[11px] text-gray-600">
                      {a.created_at
                        ? new Date(a.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : ""}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setEditing(a)}
                    className="text-[#22c55e] hover:text-[#4ade80] transition-colors text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => a.id && handleDelete(a.id)}
                    className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
