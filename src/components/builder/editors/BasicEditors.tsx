"use client";

import { useRef } from "react";
import { compressAndUploadImage } from "@/lib/upload-image";

type RenderField = (label: string, key: string, type: "text" | "color" | "number" | "select" | "textarea", options?: string[]) => React.ReactNode;

// ─── TEXT ───
export function TextEditor({ renderField }: { renderField: RenderField }) {
  return (
    <>
      <p className="text-[10px] text-gray-600 mb-2">Double-click teks di canvas untuk edit langsung, atau edit di sini:</p>
      {renderField("Teks Paragraf", "text", "textarea")}
    </>
  );
}

// ─── IMAGE ───
export function ImageEditor({ element, updateContent, renderField, userId }: {
  element: any;
  updateContent: (key: string, value: any) => void;
  renderField: RenderField;
  userId: string | null;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await compressAndUploadImage(file, userId);
      updateContent("src", url);
    } catch {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        updateContent("src", dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="mb-3">
        <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Preview</label>
        <div className="relative rounded-lg overflow-hidden bg-white/5 border border-white/10">
          <img
            src={element.content.src || "https://placehold.co/800x500/1e293b/64748b?text=No+Image"}
            alt="preview"
            className="w-full h-32 object-cover"
          />
        </div>
      </div>
      {renderField("URL Gambar", "src", "text")}
      <div className="mb-3">
        <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Upload Gambar</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#22c55e]/20 file:text-[#22c55e] file:text-xs file:font-medium hover:file:bg-[#22c55e]/30"
        />
      </div>
      {renderField("Alt Text", "alt", "text")}
      {renderField("Caption", "caption", "text")}
    </>
  );
}

// ─── BUTTON ───
export function ButtonEditor({ renderField }: { renderField: RenderField }) {
  return (
    <>
      {renderField("Teks Tombol", "text", "text")}
      {renderField("Link / URL", "href", "text")}
      {renderField("Variant", "variant", "select", ["primary", "secondary", "outline"])}
      {renderField("Target", "target", "select", ["_self", "_blank"])}
    </>
  );
}

// ─── VIDEO ───
export function VideoEditor({ renderField }: { renderField: RenderField }) {
  return (
    <>
      <p className="text-[10px] text-gray-600 mb-2">Masukkan URL embed YouTube/Vimeo:</p>
      <div className="mb-2 p-2 rounded-lg bg-white/5 border border-white/10">
        <code className="text-[10px] text-gray-500">Contoh: https://www.youtube.com/embed/VIDEO_ID</code>
      </div>
      {renderField("URL Video (Embed)", "url", "text")}
      {renderField("Caption", "caption", "text")}
    </>
  );
}

// ─── SPACER ───
export function SpacerEditor({ renderField }: { renderField: RenderField }) {
  return <>{renderField("Tinggi Spacer (px)", "height", "text")}</>;
}

// ─── DIVIDER ───
export function DividerEditor({ renderField }: { renderField: RenderField }) {
  return (
    <>
      {renderField("Style Garis", "style", "select", ["solid", "dashed", "dotted"])}
      {renderField("Warna", "color", "color")}
    </>
  );
}

// ─── ICON ───
export function IconEditor({ renderField }: { renderField: RenderField }) {
  return (
    <>
      {renderField("Ikon", "icon", "select", ["star", "heart", "rocket", "globe", "lightbulb", "shield", "chart", "users", "cog", "check"])}
      {renderField("Ukuran", "size", "text")}
      {renderField("Warna", "color", "color")}
    </>
  );
}
