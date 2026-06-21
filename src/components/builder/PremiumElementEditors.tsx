"use client";

import { compressAndUploadImage } from "@/lib/upload-image";
import { useState, useEffect } from "react";

// ── Shared UI Components ──

const commonColors = [
  { label: "Hijau", value: "#22c55e" },
  { label: "Biru", value: "#3b82f6" },
  { label: "Ungu", value: "#8b5cf6" },
  { label: "Merah", value: "#ef4444" },
  { label: "Kuning", value: "#eab308" },
  { label: "Pink", value: "#ec4899" },
  { label: "Orange", value: "#f97316" },
  { label: "Teal", value: "#14b8a6" },
  { label: "Putih", value: "#ffffff" },
  { label: "Hitam", value: "#000000" },
  { label: "Abu-abu", value: "#64748b" },
  { label: "Dark", value: "#0f172a" },
];

const fontFamilyOptions = [
  { label: "Inter (Default)", value: "Inter, sans-serif" },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Courier New", value: "'Courier New', monospace" },
  { label: "Roboto", value: "'Roboto', sans-serif" },
  { label: "Open Sans", value: "'Open Sans', sans-serif" },
  { label: "Lato", value: "'Lato', sans-serif" },
  { label: "Montserrat", value: "'Montserrat', sans-serif" },
  { label: "Playfair Display", value: "'Playfair Display', serif" },
  { label: "Poppins", value: "'Poppins', sans-serif" },
  { label: "Merriweather", value: "'Merriweather', serif" },
];

function ColorPicker({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const [internalValue, setInternalValue] = useState(value || "#000000");

  useEffect(() => {
    setInternalValue(value || "#000000");
  }, [value]);

  const handleChange = (v: string) => {
    setInternalValue(v);
    onChange(v);
  };

  return (
    <div className="mb-3">
      <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={internalValue}
          onChange={(e) => handleChange(e.target.value)}
          className="w-10 h-10 rounded-lg bg-transparent border border-white/10 cursor-pointer flex-shrink-0"
        />
        <input
          type="text"
          value={internalValue}
          onChange={(e) => handleChange(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50 font-mono"
          placeholder="#000000"
        />
      </div>
      <div className="flex gap-1.5 mt-1.5 flex-wrap">
        {commonColors.map((c) => (
          <button
            key={c.value}
            onClick={() => handleChange(c.value)}
            className="w-6 h-6 rounded-md border border-white/10 hover:scale-110 transition-transform"
            style={{ backgroundColor: c.value }}
            title={c.label}
          />
        ))}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-4 h-px bg-white/10" />
        <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{title}</h4>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

interface EditorProps {
  element: any;
  updateContent: (key: string, value: any) => void;
  handleAddItem: (field: string, defaultItem: any) => void;
  handleRemoveItem: (field: string, index: number) => void;
  handleItemChange: (field: string, index: number, key: string, value: any) => void;
  userId: string | null;
}

// ── Helper Input Components ──

function TextInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50"
        placeholder={placeholder || label}
      />
    </div>
  );
}

function SelectInput({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50"
        style={{ colorScheme: "dark" } as any}
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#1e293b] text-white">{opt}</option>
        ))}
      </select>
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50 resize-none"
        rows={3}
      />
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 mb-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded bg-white/5 border-white/20"
      />
      <span className="text-xs text-gray-400">{label}</span>
    </label>
  );
}

// ── Style Input Components ──

function FontSizeSlider({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const match = value?.match(/^([\d.]+)(\s*)(\S*)$/) || [];
  const num = parseFloat(match[1]) || 16;
  const unit = match[3] || "px";

  const presets = [
    { label: "8px", value: "8px" },
    { label: "12px", value: "12px" },
    { label: "14px", value: "14px" },
    { label: "16px", value: "16px" },
    { label: "18px", value: "18px" },
    { label: "20px", value: "20px" },
    { label: "24px", value: "24px" },
    { label: "28px", value: "28px" },
    { label: "32px", value: "32px" },
    { label: "36px", value: "36px" },
    { label: "40px", value: "40px" },
    { label: "48px", value: "48px" },
    { label: "56px", value: "56px" },
    { label: "64px", value: "64px" },
    { label: "72px", value: "72px" },
  ];

  return (
    <div className="mb-3">
      <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Font</label>
      <div className="flex items-center gap-2 mb-2">
        <input
          type="range"
          min={8} max={100} step={1}
          value={Math.min(100, Math.max(8, Math.round(num)))}
          onChange={(e) => onChange(`${parseInt(e.target.value)}${unit}`)}
          className="flex-1 h-1.5 rounded-full appearance-none bg-white/10 cursor-pointer accent-[#22c55e]
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#22c55e] [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing
            [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#22c55e] [&::-moz-range-thumb]:border-0"
        />
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm text-center focus:outline-none focus:border-[#22c55e]/50 font-mono"
        />
      </div>
      <div className="flex gap-1 flex-wrap">
        {presets.map((p) => (
          <button
            key={p.value}
            onClick={() => onChange(p.value)}
            className={`px-1.5 py-0.5 text-[10px] rounded-md border transition-all ${
              value === p.value
                ? "bg-[#22c55e]/20 border-[#22c55e]/40 text-[#22c55e]"
                : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function FontWeightSelect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">{label || "Tebal Font"}</label>
      <select
        value={value || "400"}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50"
        style={{ colorScheme: "dark" } as any}
      >
        <option value="300" className="bg-[#1e293b] text-white">Light (300)</option>
        <option value="400" className="bg-[#1e293b] text-white">Normal (400)</option>
        <option value="500" className="bg-[#1e293b] text-white">Medium (500)</option>
        <option value="600" className="bg-[#1e293b] text-white">Semi Bold (600)</option>
        <option value="700" className="bg-[#1e293b] text-white">Bold (700)</option>
        <option value="800" className="bg-[#1e293b] text-white">Extra Bold (800)</option>
        <option value="900" className="bg-[#1e293b] text-white">Black (900)</option>
      </select>
    </div>
  );
}

function FontFamilySelect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">{label || "Jenis Font"}</label>
      <select
        value={value || "Inter, sans-serif"}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50"
        style={{ colorScheme: "dark" } as any}
      >
        {fontFamilyOptions.map((f) => (
          <option key={f.value} value={f.value} className="bg-[#1e293b] text-white" style={{ fontFamily: f.value }}>{f.label}</option>
        ))}
      </select>
    </div>
  );
}

// ── Individual Editors ──

export function AnimatedHeadlineEditor({ element, updateContent }: EditorProps) {
  const c = element.content;
  return (
    <div>
      <TextInput label="Teks Sebelum" value={c.beforeText} onChange={(v) => updateContent("beforeText", v)} />
      <div className="h-px bg-white/10 my-3" />
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Teks Sebelum</p>
      <ColorPicker value={c.beforeTextColor || "#ffffff"} onChange={(v) => updateContent("beforeTextColor", v)} label="Warna" />
      <FontFamilySelect label="Font" value={c.beforeTextFont} onChange={(v) => updateContent("beforeTextFont", v)} />
      <FontSizeSlider value={c.beforeTextSize} onChange={(v) => updateContent("beforeTextSize", v)} />
      <FontWeightSelect label="Tebal" value={c.beforeTextWeight} onChange={(v) => updateContent("beforeTextWeight", v)} />
      
      <div className="h-px bg-white/10 my-3" />
      <TextInput label="Teks Highlight" value={c.highlightedText} onChange={(v) => updateContent("highlightedText", v)} />
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Teks Highlight</p>
      <ColorPicker value={c.highlightTextColor || "#22c55e"} onChange={(v) => updateContent("highlightTextColor", v)} label="Warna" />
      <FontFamilySelect label="Font" value={c.highlightTextFont} onChange={(v) => updateContent("highlightTextFont", v)} />
      <FontSizeSlider value={c.highlightTextSize} onChange={(v) => updateContent("highlightTextSize", v)} />
      <FontWeightSelect label="Tebal" value={c.highlightTextWeight} onChange={(v) => updateContent("highlightTextWeight", v)} />

      <div className="h-px bg-white/10 my-3" />
      <TextInput label="Teks Setelah" value={c.afterText} onChange={(v) => updateContent("afterText", v)} />
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Teks Setelah</p>
      <ColorPicker value={c.afterTextColor || "#ffffff"} onChange={(v) => updateContent("afterTextColor", v)} label="Warna" />
      <FontFamilySelect label="Font" value={c.afterTextFont} onChange={(v) => updateContent("afterTextFont", v)} />
      <FontSizeSlider value={c.afterTextSize} onChange={(v) => updateContent("afterTextSize", v)} />
      <FontWeightSelect label="Tebal" value={c.afterTextWeight} onChange={(v) => updateContent("afterTextWeight", v)} />
      
      <div className="h-px bg-white/10 my-3" />
      <SelectInput label="Style" value={c.style} onChange={(v) => updateContent("style", v)} options={["highlight", "rotating"]} />
      {c.style === "highlight" && (
        <SelectInput label="Animasi" value={c.animationType} onChange={(v) => updateContent("animationType", v)} options={["underline", "circle", "curly"]} />
      )}
      <SelectInput label="Tag HTML" value={c.tag} onChange={(v) => updateContent("tag", v)} options={["h1", "h2", "h3", "h4", "h5", "h6", "p"]} />
      {c.style === "rotating" && (
        <div className="mb-3">
          <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Rotating Texts</label>
          <p className="text-[9px] text-gray-600 mb-1">Pisahkan dengan koma</p>
          <input
            type="text"
            defaultValue={(c.rotatingTexts || []).join(", ")}
            onBlur={(e) => updateContent("rotatingTexts", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50"
            placeholder="Kreatif, Inovatif, Profesional"
          />
        </div>
      )}
    </div>
  );
}

export function BlockquoteEditor({ element, updateContent }: EditorProps) {
  const c = element.content;
  return (
    <div>
      <TextArea label="Kutipan" value={c.quoteText} onChange={(v) => updateContent("quoteText", v)} />
      <div className="h-px bg-white/10 my-3" />
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Kutipan</p>
      <ColorPicker value={c.quoteTextColor || "#d1d5db"} onChange={(v) => updateContent("quoteTextColor", v)} label="Warna Kutipan" />
      <FontFamilySelect label="Font" value={c.quoteFontFamily} onChange={(v) => updateContent("quoteFontFamily", v)} />
      <FontSizeSlider value={c.quoteTextSize} onChange={(v) => updateContent("quoteTextSize", v)} />
      <FontWeightSelect label="Tebal" value={c.quoteTextWeight} onChange={(v) => updateContent("quoteTextWeight", v)} />
      <SelectInput label="Font Style" value={c.quoteFontStyle || "italic"} onChange={(v) => updateContent("quoteFontStyle", v)} options={["italic", "normal", "oblique"]} />
      <TextInput label="Nama Author" value={c.authorName} onChange={(v) => updateContent("authorName", v)} />
      <div className="h-px bg-white/10 my-3" />
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Author</p>
      <ColorPicker value={c.authorNameColor || "#22c55e"} onChange={(v) => updateContent("authorNameColor", v)} label="Warna Author" />
      <FontFamilySelect label="Font" value={c.authorNameFont} onChange={(v) => updateContent("authorNameFont", v)} />
      <FontSizeSlider value={c.authorNameSize} onChange={(v) => updateContent("authorNameSize", v)} />
      <FontWeightSelect label="Tebal" value={c.authorNameWeight} onChange={(v) => updateContent("authorNameWeight", v)} />
      <SelectInput label="Skin" value={c.skin} onChange={(v) => updateContent("skin", v)} options={["border", "quotation", "boxed", "clean"]} />
      <div className="h-px bg-white/10 my-3" />
      <Checkbox label="Tampilkan Tweet Button" checked={!!c.tweetButton} onChange={(v) => updateContent("tweetButton", v)} />
      {c.tweetButton && <TextInput label="Label Tweet" value={c.tweetLabel} onChange={(v) => updateContent("tweetLabel", v)} />}
    </div>
  );
}

export function CodeHighlightEditor({ element, updateContent }: EditorProps) {
  const c = element.content;
  return (
    <div>
      <TextInput label="Bahasa" value={c.language} onChange={(v) => updateContent("language", v)} />
      <div className="mb-3">
        <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Kode</label>
        <textarea
          value={c.code || ""}
          onChange={(e) => updateContent("code", e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50 font-mono"
          rows={6}
          placeholder="console.log('Hello World');"
          style={{ fontFamily: "monospace", fontSize: "12px" }}
        />
      </div>
      <Checkbox label="Tampilkan Nomor Baris" checked={!!c.showLineNumbers} onChange={(v) => updateContent("showLineNumbers", v)} />
      <Checkbox label="Tombol Copy" checked={!!c.copyButton} onChange={(v) => updateContent("copyButton", v)} />
    </div>
  );
}

const iconOptions = [
  { label: "Star", value: "star" },
  { label: "Heart", value: "heart" },
  { label: "Rocket", value: "rocket" },
  { label: "Globe", value: "globe" },
  { label: "Lightbulb", value: "lightbulb" },
  { label: "Shield", value: "shield" },
  { label: "Chart", value: "chart" },
  { label: "Users", value: "users" },
  { label: "Cog", value: "cog" },
  { label: "Check", value: "check" },
];

function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const icons: Record<string, React.ReactNode> = {
    star: <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
    heart: <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
    rocket: <path d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />,
    globe: <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    lightbulb: <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
    shield: <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    chart: <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    users: <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
    cog: <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
    check: <path d="M5 13l4 4L19 7" />,
  };

  return (
    <div className="mb-3">
      <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Icon</label>
      <div className="grid grid-cols-5 gap-1.5">
        {iconOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex items-center justify-center w-full aspect-square rounded-lg border transition-all ${
              value === opt.value
                ? "border-[#22c55e] bg-[#22c55e]/20 text-[#22c55e]"
                : "border-white/10 bg-white/5 text-gray-400 hover:border-white/30 hover:text-white"
            }`}
            title={opt.label}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              {icons[opt.value]}
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

export function FlipBoxEditor({ element, updateContent, userId }: EditorProps) {
  const c = element.content;
  const frontGraphic = c.frontGraphic || "icon";

  const handleFrontImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await compressAndUploadImage(file, userId);
      updateContent("frontImage", url);
    } catch {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        updateContent("frontImage", dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await compressAndUploadImage(file, userId);
      updateContent("backImage", url);
    } catch {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        updateContent("backImage", dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <Section title="Front">
        <SelectInput label="Tipe Grafis" value={frontGraphic} onChange={(v) => updateContent("frontGraphic", v)} options={["icon", "image", "none"]} />
        {frontGraphic === "icon" && (
          <>
            <IconPicker value={c.frontIcon || "star"} onChange={(v) => updateContent("frontIcon", v)} />
            <ColorPicker value={c.frontIconColor || "#22c55e"} onChange={(v) => updateContent("frontIconColor", v)} label="Warna Icon" />
          </>
        )}
        {frontGraphic === "image" && (
          <div className="mb-3">
            <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Upload Gambar Depan</label>
            {c.frontImage && (
              <div className="relative mb-2 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                <img src={c.frontImage} alt="" className="w-full h-20 object-cover" />
                <button onClick={() => updateContent("frontImage", "")} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 text-white text-xs flex items-center justify-center hover:bg-red-500">×</button>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleFrontImageUpload} className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#22c55e]/20 file:text-[#22c55e] file:text-xs file:font-medium hover:file:bg-[#22c55e]/30 mb-1" />
            <input value={c.frontImage || ""} onChange={(v) => updateContent("frontImage", v.target.value)} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="URL Gambar Depan" />
          </div>
        )}
        <TextInput label="Judul Depan" value={c.frontTitle} onChange={(v) => updateContent("frontTitle", v)} />
        <div className="h-px bg-white/10 my-2" />
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Judul Depan</p>
        <ColorPicker value={c.frontTitleColor || "#ffffff"} onChange={(v) => updateContent("frontTitleColor", v)} label="Warna Judul" />
        <FontFamilySelect label="Font" value={c.frontTitleFont} onChange={(v) => updateContent("frontTitleFont", v)} />
        <FontSizeSlider value={c.frontTitleSize} onChange={(v) => updateContent("frontTitleSize", v)} />
        <FontWeightSelect label="Tebal" value={c.frontTitleWeight} onChange={(v) => updateContent("frontTitleWeight", v)} />
        <TextArea label="Deskripsi Depan" value={c.frontDescription} onChange={(v) => updateContent("frontDescription", v)} />
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Deskripsi Depan</p>
        <ColorPicker value={c.frontDescColor || "#94a3b8"} onChange={(v) => updateContent("frontDescColor", v)} label="Warna Deskripsi" />
        <FontFamilySelect label="Font" value={c.frontDescFont} onChange={(v) => updateContent("frontDescFont", v)} />
        <FontSizeSlider value={c.frontDescSize} onChange={(v) => updateContent("frontDescSize", v)} />
        <FontWeightSelect label="Tebal" value={c.frontDescWeight} onChange={(v) => updateContent("frontDescWeight", v)} />
        <ColorPicker value={c.frontBackground || "#1e293b"} onChange={(v) => updateContent("frontBackground", v)} label="Background Depan" />
      </Section>
      <Section title="Back">
        <div className="mb-3">
          <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Upload Gambar Belakang</label>
          {c.backImage && (
            <div className="relative mb-2 rounded-lg overflow-hidden bg-white/5 border border-white/10">
              <img src={c.backImage} alt="" className="w-full h-20 object-cover" />
              <button onClick={() => updateContent("backImage", "")} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 text-white text-xs flex items-center justify-center hover:bg-red-500">×</button>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleBackImageUpload} className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#22c55e]/20 file:text-[#22c55e] file:text-xs file:font-medium hover:file:bg-[#22c55e]/30 mb-1" />
          <input value={c.backImage || ""} onChange={(v) => updateContent("backImage", v.target.value)} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="URL Gambar Belakang" />
        </div>
        <TextInput label="Judul Belakang" value={c.backTitle} onChange={(v) => updateContent("backTitle", v)} />
        <div className="h-px bg-white/10 my-2" />
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Judul Belakang</p>
        <ColorPicker value={c.backTitleColor || "#ffffff"} onChange={(v) => updateContent("backTitleColor", v)} label="Warna Judul" />
        <FontFamilySelect label="Font" value={c.backTitleFont} onChange={(v) => updateContent("backTitleFont", v)} />
        <FontSizeSlider value={c.backTitleSize} onChange={(v) => updateContent("backTitleSize", v)} />
        <FontWeightSelect label="Tebal" value={c.backTitleWeight} onChange={(v) => updateContent("backTitleWeight", v)} />
        <TextArea label="Deskripsi Belakang" value={c.backDescription} onChange={(v) => updateContent("backDescription", v)} />
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Deskripsi Belakang</p>
        <ColorPicker value={c.backDescColor || "rgba(255,255,255,0.8)"} onChange={(v) => updateContent("backDescColor", v)} label="Warna Deskripsi" />
        <FontFamilySelect label="Font" value={c.backDescFont} onChange={(v) => updateContent("backDescFont", v)} />
        <FontSizeSlider value={c.backDescSize} onChange={(v) => updateContent("backDescSize", v)} />
        <FontWeightSelect label="Tebal" value={c.backDescWeight} onChange={(v) => updateContent("backDescWeight", v)} />
        <ColorPicker value={c.backBackground || "#22c55e"} onChange={(v) => updateContent("backBackground", v)} label="Background Belakang" />
        <div className="h-px bg-white/10 my-2" />
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Tombol</p>
        <TextInput label="Teks Tombol" value={c.backButtonText} onChange={(v) => updateContent("backButtonText", v)} />
        <TextInput label="Link Tombol" value={c.backButtonLink} onChange={(v) => updateContent("backButtonLink", v)} />
        <ColorPicker value={c.backButtonBg || "#ffffff"} onChange={(v) => updateContent("backButtonBg", v)} label="Background Tombol" />
        <ColorPicker value={c.backButtonTextColor || "#1e293b"} onChange={(v) => updateContent("backButtonTextColor", v)} label="Warna Teks Tombol" />
        <FontFamilySelect label="Font" value={c.backButtonFont} onChange={(v) => updateContent("backButtonFont", v)} />
        <FontSizeSlider value={c.backButtonSize} onChange={(v) => updateContent("backButtonSize", v)} />
        <FontWeightSelect label="Tebal" value={c.backButtonWeight} onChange={(v) => updateContent("backButtonWeight", v)} />
      </Section>
    </div>
  );
}

export function HotspotEditor({ element, updateContent, handleAddItem, handleRemoveItem, handleItemChange, userId }: EditorProps) {
  const c = element.content;
  const items = c.items || [];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await compressAndUploadImage(file, userId);
      updateContent("imageSrc", url);
    } catch {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        updateContent("imageSrc", dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="mb-3">
        <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Gambar Hotspot</label>
        {c.imageSrc && (
          <div className="relative mb-2 rounded-lg overflow-hidden bg-white/5 border border-white/10">
            <img src={c.imageSrc} alt="hotspot preview" className="w-full h-24 object-cover" />
            <button onClick={() => updateContent("imageSrc", "")} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 text-white text-xs flex items-center justify-center hover:bg-red-500">×</button>
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#22c55e]/20 file:text-[#22c55e] file:text-xs file:font-medium hover:file:bg-[#22c55e]/30" />
      </div>
      <TextInput label="URL Gambar" value={c.imageSrc} onChange={(v) => updateContent("imageSrc", v)} />
      
      <div className="h-px bg-white/10 my-3" />
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Marker</p>
      <ColorPicker value={c.markerColor || "#22c55e"} onChange={(v) => updateContent("markerColor", v)} label="Warna Marker" />
      <TextInput label="Ukuran Marker" value={c.markerSize} onChange={(v) => updateContent("markerSize", v)} />
      <ColorPicker value={c.markerTextColor || "#ffffff"} onChange={(v) => updateContent("markerTextColor", v)} label="Warna Teks Marker" />
      <FontFamilySelect label="Font" value={c.markerTextFont} onChange={(v) => updateContent("markerTextFont", v)} />
      <FontSizeSlider value={c.markerTextSize} onChange={(v) => updateContent("markerTextSize", v)} />
      <FontWeightSelect label="Tebal" value={c.markerTextWeight} onChange={(v) => updateContent("markerTextWeight", v)} />
      
      <div className="h-px bg-white/10 my-3" />
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Popup</p>
      <ColorPicker value={c.popupBg || "#1e293b"} onChange={(v) => updateContent("popupBg", v)} label="Background Popup" />
      <ColorPicker value={c.popupBorder || "rgba(255,255,255,0.1)"} onChange={(v) => updateContent("popupBorder", v)} label="Border Popup" />
      <TextInput label="Lebar Popup" value={c.popupWidth} onChange={(v) => updateContent("popupWidth", v)} />
      <TextInput label="Padding Popup" value={c.popupPadding} onChange={(v) => updateContent("popupPadding", v)} />
      <TextInput label="Radius Popup" value={c.popupRadius} onChange={(v) => updateContent("popupRadius", v)} />
      
      <div className="h-px bg-white/10 my-3" />
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Label</p>
      <ColorPicker value={c.labelColor || "#22c55e"} onChange={(v) => updateContent("labelColor", v)} label="Warna Label" />
      <FontFamilySelect label="Font" value={c.labelFont} onChange={(v) => updateContent("labelFont", v)} />
      <FontSizeSlider value={c.labelSize} onChange={(v) => updateContent("labelSize", v)} />
      <FontWeightSelect label="Tebal" value={c.labelWeight} onChange={(v) => updateContent("labelWeight", v)} />
      
      <div className="h-px bg-white/10 my-3" />
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Deskripsi</p>
      <ColorPicker value={c.descColor || "#94a3b8"} onChange={(v) => updateContent("descColor", v)} label="Warna Deskripsi" />
      <FontFamilySelect label="Font" value={c.descFont} onChange={(v) => updateContent("descFont", v)} />
      <FontSizeSlider value={c.descSize} onChange={(v) => updateContent("descSize", v)} />
      <FontWeightSelect label="Tebal" value={c.descWeight} onChange={(v) => updateContent("descWeight", v)} />
      
      <div className="h-px bg-white/10 my-3" />
      <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Markers ({items.length})</label>
      {items.map((item: any, i: number) => (
        <div key={i} className="mb-2 p-2 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-400">Marker #{i + 1}</span>
            <button onClick={() => handleRemoveItem("items", i)} className="text-red-400 hover:text-red-300 text-xs">Hapus</button>
          </div>
          <input value={item.label || ""} onChange={(e) => handleItemChange("items", i, "label", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Label" />
          <div className="flex gap-1 mb-1">
            <input value={item.x || "50%"} onChange={(e) => handleItemChange("items", i, "x", e.target.value)} className="flex-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="X%" />
            <input value={item.y || "50%"} onChange={(e) => handleItemChange("items", i, "y", e.target.value)} className="flex-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Y%" />
          </div>
          <textarea value={item.description || ""} onChange={(e) => handleItemChange("items", i, "description", e.target.value)} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs resize-none" rows={2} placeholder="Deskripsi" />
        </div>
      ))}
      <button onClick={() => handleAddItem("items", { label: "Point Baru", x: "50%", y: "50%", description: "" })} className="w-full py-1.5 text-xs text-[#22c55e] border border-dashed border-[#22c55e]/30 rounded-lg hover:bg-[#22c55e]/10 transition-colors">+ Tambah Marker</button>
    </div>
  );
}

export function ProgressTrackerEditor({ element, updateContent }: EditorProps) {
  const c = element.content;
  return (
    <div>
      <SelectInput label="Tipe" value={c.type} onChange={(v) => updateContent("type", v)} options={["horizontal", "circular"]} />
      <div className="mb-3">
        <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Progress ({c.progress || 50}%)</label>
        <input type="range" min={0} max={100} step={1} value={c.progress || 50} onChange={(e) => updateContent("progress", parseInt(e.target.value))} className="w-full h-1.5 rounded-full appearance-none bg-white/10 cursor-pointer accent-[#22c55e]" />
      </div>
      <TextInput label="Label" value={c.label} onChange={(v) => updateContent("label", v)} />
      <Checkbox label="Tampilkan Persentase" checked={!!c.percentage} onChange={(v) => updateContent("percentage", v)} />
      
      <div className="h-px bg-white/10 my-3" />
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Label</p>
      <ColorPicker value={c.labelColor || "#94a3b8"} onChange={(v) => updateContent("labelColor", v)} label="Warna Label" />
      <FontFamilySelect label="Font" value={c.labelFont} onChange={(v) => updateContent("labelFont", v)} />
      <FontSizeSlider value={c.labelSize} onChange={(v) => updateContent("labelSize", v)} />
      <FontWeightSelect label="Tebal" value={c.labelWeight} onChange={(v) => updateContent("labelWeight", v)} />
      
      <div className="h-px bg-white/10 my-3" />
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Persentase</p>
      <ColorPicker value={c.percentageColor || "#22c55e"} onChange={(v) => updateContent("percentageColor", v)} label="Warna Angka" />
      <FontFamilySelect label="Font" value={c.percentageFont} onChange={(v) => updateContent("percentageFont", v)} />
      <FontSizeSlider value={c.percentageSize} onChange={(v) => updateContent("percentageSize", v)} />
      <FontWeightSelect label="Tebal" value={c.percentageWeight} onChange={(v) => updateContent("percentageWeight", v)} />
      
      <div className="h-px bg-white/10 my-3" />
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Bar</p>
      <ColorPicker value={c.barColor || "#22c55e"} onChange={(v) => updateContent("barColor", v)} label="Warna Bar Aktif" />
      <ColorPicker value={c.trackColor || "#1e293b"} onChange={(v) => updateContent("trackColor", v)} label="Warna Track" />
      <TextInput label="Tinggi Bar" value={c.barHeight} onChange={(v) => updateContent("barHeight", v)} />
      <TextInput label="Radius Bar" value={c.barRadius} onChange={(v) => updateContent("barRadius", v)} />

      {c.type === "circular" && (
        <>
          <div className="h-px bg-white/10 my-3" />
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Circular</p>
          <TextInput label="Ukuran Lingkaran" value={c.circleSize} onChange={(v) => updateContent("circleSize", v)} />
          <TextInput label="Tebal Stroke" value={c.strokeWidth} onChange={(v) => updateContent("strokeWidth", v)} />
        </>
      )}
    </div>
  );
}

export function ShareButtonsEditor({ element, updateContent, handleAddItem, handleRemoveItem, handleItemChange }: EditorProps) {
  const c = element.content;
  const networks = c.networks || [];
  return (
    <div>
      <SelectInput label="Tampilan" value={c.view} onChange={(v) => updateContent("view", v)} options={["icon-text", "icon", "text"]} />
      <SelectInput label="Skin" value={c.skin} onChange={(v) => updateContent("skin", v)} options={["gradient", "minimal", "framed", "boxed-icon", "flat"]} />
      <div className="mb-3">
        <div className="h-px bg-white/10 mb-3" />
        <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Jaringan ({networks.length})</label>
        {networks.map((net: any, i: number) => (
          <div key={i} className="mb-2 p-2 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">#{i + 1}</span>
              <button onClick={() => handleRemoveItem("networks", i)} className="text-red-400 hover:text-red-300 text-xs">Hapus</button>
            </div>
            <select value={net.name || "facebook"} onChange={(e) => handleItemChange("networks", i, "name", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" style={{ colorScheme: "dark" } as any}>
              <option value="facebook" className="bg-[#1e293b] text-white">Facebook</option>
              <option value="twitter" className="bg-[#1e293b] text-white">Twitter</option>
              <option value="linkedin" className="bg-[#1e293b] text-white">LinkedIn</option>
              <option value="whatsapp" className="bg-[#1e293b] text-white">WhatsApp</option>
              <option value="telegram" className="bg-[#1e293b] text-white">Telegram</option>
            </select>
            <input value={net.text || ""} onChange={(e) => handleItemChange("networks", i, "text", e.target.value)} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Label (opsional)" />
          </div>
        ))}
        <button onClick={() => handleAddItem("networks", { name: "facebook", text: "Facebook" })} className="w-full py-1.5 text-xs text-[#22c55e] border border-dashed border-[#22c55e]/30 rounded-lg hover:bg-[#22c55e]/10 transition-colors">+ Tambah Jaringan</button>
      </div>
    </div>
  );
}

export function ChecklistEditor({ element, updateContent, handleAddItem, handleRemoveItem, handleItemChange }: EditorProps) {
  const c = element.content;
  const items = c.items || [];
  return (
    <div>
      <TextInput label="Judul" value={c.title} onChange={(v) => updateContent("title", v)} />
      <div className="h-px bg-white/10 my-3" />
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Judul</p>
      <ColorPicker value={c.titleColor || "#ffffff"} onChange={(v) => updateContent("titleColor", v)} label="Warna Judul" />
      <FontFamilySelect label="Font" value={c.titleFont} onChange={(v) => updateContent("titleFont", v)} />
      <FontSizeSlider value={c.titleSize} onChange={(v) => updateContent("titleSize", v)} />
      <FontWeightSelect label="Tebal" value={c.titleWeight} onChange={(v) => updateContent("titleWeight", v)} />
      <div className="h-px bg-white/10 my-3" />
      <ColorPicker value={c.checkedColor || "#22c55e"} onChange={(v) => updateContent("checkedColor", v)} label="Warna Checklist" />
      <ColorPicker value={c.textColor || "#ffffff"} onChange={(v) => updateContent("textColor", v)} label="Warna Teks" />
      <FontFamilySelect label="Font Teks" value={c.textFont} onChange={(v) => updateContent("textFont", v)} />
      <FontSizeSlider value={c.textSize} onChange={(v) => updateContent("textSize", v)} />
      <FontWeightSelect label="Tebal Teks" value={c.textWeight} onChange={(v) => updateContent("textWeight", v)} />
      <TextInput label="Ukuran Icon" value={c.iconSize} onChange={(v) => updateContent("iconSize", v)} />
      <div className="mb-3">
        <div className="h-px bg-white/10 mb-3" />
        <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Items ({items.length})</label>
        {items.map((item: any, i: number) => (
          <div key={i} className="mb-2 p-2 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">#{i + 1}</span>
              <button onClick={() => handleRemoveItem("items", i)} className="text-red-400 hover:text-red-300 text-xs">Hapus</button>
            </div>
            <input value={item.text || ""} onChange={(e) => handleItemChange("items", i, "text", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Teks" />
            <label className="flex items-center gap-2 mt-1">
              <input type="checkbox" checked={item.checked !== false} onChange={(e) => handleItemChange("items", i, "checked", e.target.checked)} className="rounded bg-white/5 border-white/20" />
              <span className="text-xs text-gray-400">Checked</span>
            </label>
          </div>
        ))}
        <button onClick={() => handleAddItem("items", { text: "Item Baru", checked: true })} className="w-full py-1.5 text-xs text-[#22c55e] border border-dashed border-[#22c55e]/30 rounded-lg hover:bg-[#22c55e]/10 transition-colors">+ Tambah Item</button>
      </div>
    </div>
  );
}

export function GalleryEditor({ element, updateContent, handleAddItem, handleRemoveItem, handleItemChange, userId }: EditorProps) {
  const c = element.content;
  const images = c.images || [];

  const handleImageUpload = async (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await compressAndUploadImage(file, userId);
      handleItemChange("images", i, "src", url);
    } catch {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        handleItemChange("images", i, "src", dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <TextInput label="Judul Galeri" value={c.title} onChange={(v) => updateContent("title", v)} />
      <div className="h-px bg-white/10 my-3" />
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Judul</p>
      <ColorPicker value={c.titleColor || "#ffffff"} onChange={(v) => updateContent("titleColor", v)} label="Warna Judul" />
      <FontFamilySelect label="Font" value={c.titleFont} onChange={(v) => updateContent("titleFont", v)} />
      <FontSizeSlider value={c.titleSize} onChange={(v) => updateContent("titleSize", v)} />
      <FontWeightSelect label="Tebal" value={c.titleWeight} onChange={(v) => updateContent("titleWeight", v)} />
      <div className="h-px bg-white/10 my-3" />
      <TextInput label="Jumlah Kolom" value={String(c.columns || 3)} onChange={(v) => updateContent("columns", parseInt(v) || 3)} />
      <Checkbox label="Lightbox" checked={!!c.lightbox} onChange={(v) => updateContent("lightbox", v)} />
      <div className="h-px bg-white/10 my-3" />
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Caption</p>
      <ColorPicker value={c.captionColor || "#ffffff"} onChange={(v) => updateContent("captionColor", v)} label="Warna Caption" />
      <FontFamilySelect label="Font" value={c.captionFont} onChange={(v) => updateContent("captionFont", v)} />
      <FontSizeSlider value={c.captionSize} onChange={(v) => updateContent("captionSize", v)} />
      <FontWeightSelect label="Tebal" value={c.captionWeight} onChange={(v) => updateContent("captionWeight", v)} />
      <div className="mb-3">
        <div className="h-px bg-white/10 mb-3" />
        <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Gambar ({images.length})</label>
        {images.map((img: any, i: number) => (
          <div key={i} className="mb-3 p-2 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">#{i + 1}</span>
              <button onClick={() => handleRemoveItem("images", i)} className="text-red-400 hover:text-red-300 text-xs">Hapus</button>
            </div>
            {img.src && (
              <div className="relative mb-2 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                <img src={img.src} alt="" className="w-full h-20 object-cover" />
                <button onClick={() => handleItemChange("images", i, "src", "")} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 text-white text-xs flex items-center justify-center hover:bg-red-500">×</button>
              </div>
            )}
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(i, e)} className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#22c55e]/20 file:text-[#22c55e] file:text-xs file:font-medium hover:file:bg-[#22c55e]/30 mb-1" />
            <input value={img.src || ""} onChange={(e) => handleItemChange("images", i, "src", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="URL Gambar" />
            <input value={img.caption || ""} onChange={(e) => handleItemChange("images", i, "caption", e.target.value)} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Caption" />
          </div>
        ))}
        <button onClick={() => handleAddItem("images", { src: "https://placehold.co/600x400/1e293b/64748b?text=Image", caption: "", alt: "" })} className="w-full py-1.5 text-xs text-[#22c55e] border border-dashed border-[#22c55e]/30 rounded-lg hover:bg-[#22c55e]/10 transition-colors">+ Tambah Gambar</button>
      </div>
    </div>
  );
}

export function LottieEditor({ element, updateContent }: EditorProps) {
  const c = element.content;
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      updateContent("src", dataUrl);
    };
    reader.readAsDataURL(file);
  };
  const isDataUrl = c.src && c.src.startsWith("data:");

  return (
    <div>
      <div className="mb-3">
        <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Upload File .json</label>
        {c.src && (
          <div className="relative mb-2 rounded-lg overflow-hidden bg-white/5 border border-white/10">
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#22c55e" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-medium" style={{ color: "#22c55e" }}>
                  {isDataUrl ? "Animation diupload" : "Animation dari URL"}
                </span>
              </div>
              <button onClick={() => updateContent("src", "")} className="w-5 h-5 rounded-full bg-red-500/80 text-white text-xs flex items-center justify-center hover:bg-red-500 flex-shrink-0">×</button>
            </div>
          </div>
        )}
        <input type="file" accept=".json,application/json" onChange={handleFileUpload} className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#22c55e]/20 file:text-[#22c55e] file:text-xs file:font-medium hover:file:bg-[#22c55e]/30" />
      </div>
      <TextInput label="URL Animation JSON" value={c.src || ""} onChange={(v) => updateContent("src", v)} />
      <Checkbox label="Loop" checked={c.loop !== false} onChange={(v) => updateContent("loop", v)} />
      <Checkbox label="Auto Play" checked={c.autoplay !== false} onChange={(v) => updateContent("autoplay", v)} />
      <TextInput label="Lebar" value={c.width} onChange={(v) => updateContent("width", v)} />
      <TextInput label="Tinggi" value={c.height} onChange={(v) => updateContent("height", v)} />
    </div>
  );
}

export function StarRatingEditor({ element, updateContent }: EditorProps) {
  const c = element.content;
  return (
    <div>
      <TextInput label="Judul" value={c.title} onChange={(v) => updateContent("title", v)} />
      <div className="mb-3">
        <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Rating ({c.rating || 5})</label>
        <input type="range" min={0} max={5} step={0.5} value={c.rating || 5} onChange={(e) => updateContent("rating", parseFloat(e.target.value))} className="w-full h-1.5 rounded-full appearance-none bg-white/10 cursor-pointer accent-[#f59e0b]" />
      </div>
      <TextInput label="Skala" value={String(c.scale || 5)} onChange={(v) => updateContent("scale", parseInt(v) || 5)} />
      <ColorPicker value={c.starColor || "#f59e0b"} onChange={(v) => updateContent("starColor", v)} label="Warna Bintang" />
      <ColorPicker value={c.emptyColor || "#374151"} onChange={(v) => updateContent("emptyColor", v)} label="Warna Bintang Kosong" />
      <Checkbox label="Tampilkan Nilai" checked={!!c.showValue} onChange={(v) => updateContent("showValue", v)} />
      <div className="h-px bg-white/10 my-3" />
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Judul</p>
      <ColorPicker value={c.titleColor || "#94a3b8"} onChange={(v) => updateContent("titleColor", v)} label="Warna Judul" />
      <FontFamilySelect label="Font" value={c.titleFont} onChange={(v) => updateContent("titleFont", v)} />
      <FontSizeSlider value={c.titleSize} onChange={(v) => updateContent("titleSize", v)} />
      <FontWeightSelect label="Tebal" value={c.titleWeight} onChange={(v) => updateContent("titleWeight", v)} />
      <TextInput label="Ukuran Bintang" value={c.size} onChange={(v) => updateContent("size", v)} />
      <SelectInput label="Posisi" value={c.align} onChange={(v) => updateContent("align", v)} options={["left", "center", "right"]} />
    </div>
  );
}

export function SearchEditor({ element, updateContent }: EditorProps) {
  const c = element.content;
  return (
    <div>
      <TextInput label="Placeholder" value={c.placeholder} onChange={(v) => updateContent("placeholder", v)} />
      <div className="h-px bg-white/10 my-3" />
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Placeholder</p>
      <ColorPicker value={c.textColor || "#ffffff"} onChange={(v) => updateContent("textColor", v)} label="Warna Teks" />
      <FontFamilySelect label="Font" value={c.textFont} onChange={(v) => updateContent("textFont", v)} />
      <FontSizeSlider value={c.textSize} onChange={(v) => updateContent("textSize", v)} />
      <FontWeightSelect label="Tebal" value={c.textWeight} onChange={(v) => updateContent("textWeight", v)} />
      <TextInput label="Teks Tombol" value={c.buttonText} onChange={(v) => updateContent("buttonText", v)} />
      <Checkbox label="Icon pada Tombol" checked={!!c.buttonIcon} onChange={(v) => updateContent("buttonIcon", v)} />
      <SelectInput label="Skin" value={c.skin} onChange={(v) => updateContent("skin", v)} options={["classic", "minimal", "fill"]} />
      <div className="h-px bg-white/10 my-3" />
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Tombol</p>
      <ColorPicker value={c.buttonColor || "#22c55e"} onChange={(v) => updateContent("buttonColor", v)} label="Warna Tombol" />
      <ColorPicker value={c.buttonTextColor || "#ffffff"} onChange={(v) => updateContent("buttonTextColor", v)} label="Warna Teks Tombol" />
      <FontFamilySelect label="Font" value={c.buttonFont} onChange={(v) => updateContent("buttonFont", v)} />
      <FontSizeSlider value={c.buttonTextSize} onChange={(v) => updateContent("buttonTextSize", v)} />
      <FontWeightSelect label="Tebal" value={c.buttonWeight} onChange={(v) => updateContent("buttonWeight", v)} />
      <ColorPicker value={c.backgroundColor || "rgba(255,255,255,0.05)"} onChange={(v) => updateContent("backgroundColor", v)} label="Background Input" />
      <ColorPicker value={c.borderColor || "rgba(255,255,255,0.1)"} onChange={(v) => updateContent("borderColor", v)} label="Border" />
    </div>
  );
}

export function FloatingButtonsEditor({ element, updateContent, handleAddItem, handleRemoveItem, handleItemChange }: EditorProps) {
  const c = element.content;
  const buttons = c.buttons || [];
  return (
    <div>
      <div className="mb-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
        <p className="text-xs text-yellow-400 font-medium mb-1">💡 Floating Buttons</p>
        <p className="text-[10px] text-yellow-500/70">Tombol akan muncul di pojok halaman (fixed position) saat dipreview/dipublikasi.</p>
      </div>
      <SelectInput label="Posisi" value={c.position} onChange={(v) => updateContent("position", v)} options={["bottom-right", "bottom-left", "top-right", "top-left"]} />
      <div className="mb-3">
        <div className="h-px bg-white/10 mb-3" />
        <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Tombol ({buttons.length})</label>
        {buttons.map((btn: any, i: number) => (
          <div key={i} className="mb-2 p-2 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">#{i + 1}</span>
              <button onClick={() => handleRemoveItem("buttons", i)} className="text-red-400 hover:text-red-300 text-xs">Hapus</button>
            </div>
            <select value={btn.icon || "chat"} onChange={(e) => handleItemChange("buttons", i, "icon", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" style={{ colorScheme: "dark" } as any}>
              <option value="chat" className="bg-[#1e293b] text-white">Chat</option>
              <option value="phone" className="bg-[#1e293b] text-white">Phone</option>
              <option value="mail" className="bg-[#1e293b] text-white">Email</option>
              <option value="whatsapp" className="bg-[#1e293b] text-white">WhatsApp</option>
            </select>
            <input value={btn.link || ""} onChange={(e) => handleItemChange("buttons", i, "link", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Link" />
            <ColorPicker value={btn.color || "#22c55e"} onChange={(v) => handleItemChange("buttons", i, "color", v)} label="Warna" />
          </div>
        ))}
        <button onClick={() => handleAddItem("buttons", { icon: "chat", label: "", link: "#", color: "#22c55e" })} className="w-full py-1.5 text-xs text-[#22c55e] border border-dashed border-[#22c55e]/30 rounded-lg hover:bg-[#22c55e]/10 transition-colors">+ Tambah Tombol</button>
      </div>
    </div>
  );
}

export function BreadcrumbsEditor({ element, updateContent, handleAddItem, handleRemoveItem, handleItemChange }: EditorProps) {
  const c = element.content;
  const items = c.items || [];
  return (
    <div>
      <SelectInput label="Separator" value={c.separator} onChange={(v) => updateContent("separator", v)} options={["/", ">", "|", "•", "→"]} />
      <ColorPicker value={c.textColor || "#94a3b8"} onChange={(v) => updateContent("textColor", v)} label="Warna Teks" />
      <ColorPicker value={c.activeColor || "#ffffff"} onChange={(v) => updateContent("activeColor", v)} label="Warna Aktif" />
      <ColorPicker value={c.separatorColor || "#4b5563"} onChange={(v) => updateContent("separatorColor", v)} label="Warna Separator" />
      <FontFamilySelect label="Font" value={c.fontFamily} onChange={(v) => updateContent("fontFamily", v)} />
      <FontSizeSlider value={c.textSize} onChange={(v) => updateContent("textSize", v)} />
      <FontWeightSelect label="Tebal" value={c.fontWeight} onChange={(v) => updateContent("fontWeight", v)} />
      <div className="mb-3">
        <div className="h-px bg-white/10 mb-3" />
        <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Items ({items.length})</label>
        {items.map((item: any, i: number) => (
          <div key={i} className="mb-2 p-2 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">#{i + 1}</span>
              <button onClick={() => handleRemoveItem("items", i)} className="text-red-400 hover:text-red-300 text-xs">Hapus</button>
            </div>
            <input value={item.label || ""} onChange={(e) => handleItemChange("items", i, "label", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Label" />
            <input value={item.href || ""} onChange={(e) => handleItemChange("items", i, "href", e.target.value)} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="/link" />
          </div>
        ))}
        <button onClick={() => handleAddItem("items", { label: "Halaman Baru", href: "#" })} className="w-full py-1.5 text-xs text-[#22c55e] border border-dashed border-[#22c55e]/30 rounded-lg hover:bg-[#22c55e]/10 transition-colors">+ Tambah Item</button>
      </div>
    </div>
  );
}

export function OffCanvasEditor({ element, updateContent, handleAddItem, handleRemoveItem, handleItemChange }: EditorProps) {
  const c = element.content;
  const items = c.items || [];
  return (
    <div>
      <TextInput label="Judul Panel" value={c.title} onChange={(v) => updateContent("title", v)} />
      <SelectInput label="Posisi" value={c.position} onChange={(v) => updateContent("position", v)} options={["right", "left"]} />
      <TextInput label="Lebar Panel" value={c.width} onChange={(v) => updateContent("width", v)} />
      <Checkbox label="Overlay" checked={!!c.overlay} onChange={(v) => updateContent("overlay", v)} />
      {c.overlay && <ColorPicker value={c.overlayColor || "rgba(0,0,0,0.5)"} onChange={(v) => updateContent("overlayColor", v)} label="Warna Overlay" />}
      <Checkbox label="Tombol Tutup" checked={c.closeButton !== false} onChange={(v) => updateContent("closeButton", v)} />
      <ColorPicker value={c.panelBg || "#0f172a"} onChange={(v) => updateContent("panelBg", v)} label="Background Panel" />
      <ColorPicker value={c.panelTextColor || "#ffffff"} onChange={(v) => updateContent("panelTextColor", v)} label="Warna Teks" />
      <FontFamilySelect label="Font" value={c.panelTextFont} onChange={(v) => updateContent("panelTextFont", v)} />
      <FontSizeSlider value={c.panelTextSize} onChange={(v) => updateContent("panelTextSize", v)} />
      <FontWeightSelect label="Tebal" value={c.panelTextWeight} onChange={(v) => updateContent("panelTextWeight", v)} />
      <div className="h-px bg-white/10 my-3" />
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Link</p>
      <FontFamilySelect label="Font" value={c.panelLinkFont} onChange={(v) => updateContent("panelLinkFont", v)} />
      <FontSizeSlider value={c.panelLinkSize} onChange={(v) => updateContent("panelLinkSize", v)} />
      <FontWeightSelect label="Tebal" value={c.panelLinkWeight} onChange={(v) => updateContent("panelLinkWeight", v)} />
      <ColorPicker value={c.panelLinkColor || "#94a3b8"} onChange={(v) => updateContent("panelLinkColor", v)} label="Warna Link" />
      <ColorPicker value={c.panelLinkHoverColor || "#22c55e"} onChange={(v) => updateContent("panelLinkHoverColor", v)} label="Warna Hover Link" />
      <div className="mb-3">
        <div className="h-px bg-white/10 mb-3" />
        <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Menu Items ({items.length})</label>
        {items.map((item: any, i: number) => (
          <div key={i} className="mb-2 p-2 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">#{i + 1}</span>
              <button onClick={() => handleRemoveItem("items", i)} className="text-red-400 hover:text-red-300 text-xs">Hapus</button>
            </div>
            <input value={item.label || ""} onChange={(e) => handleItemChange("items", i, "label", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Label" />
            <input value={item.href || ""} onChange={(e) => handleItemChange("items", i, "href", e.target.value)} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="/link" />
          </div>
        ))}
        <button onClick={() => handleAddItem("items", { label: "Link Baru", href: "#" })} className="w-full py-1.5 text-xs text-[#22c55e] border border-dashed border-[#22c55e]/30 rounded-lg hover:bg-[#22c55e]/10 transition-colors">+ Tambah Item</button>
      </div>
    </div>
  );
}

export function SlidesEditor({ element, updateContent, handleAddItem, handleRemoveItem, handleItemChange, userId }: EditorProps) {
  const c = element.content;
  const slides = c.slides || [];

  const handleImageUpload = async (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await compressAndUploadImage(file, userId);
      handleItemChange("slides", i, "image", url);
    } catch {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        handleItemChange("slides", i, "image", dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <TextInput label="Tinggi Slide" value={c.slideHeight} onChange={(v) => updateContent("slideHeight", v)} />
      <Checkbox label="Auto Play" checked={c.autoplay !== false} onChange={(v) => updateContent("autoplay", v)} />
      <Checkbox label="Ken Burns Effect" checked={c.kenBurns !== false} onChange={(v) => updateContent("kenBurns", v)} />
      <SelectInput label="Navigasi" value={c.navigation} onChange={(v) => updateContent("navigation", v)} options={["arrows", "none"]} />
      <ColorPicker value={c.arrowColor || "#ffffff"} onChange={(v) => updateContent("arrowColor", v)} label="Warna Panah" />
      <ColorPicker value={c.dotActiveColor || "#22c55e"} onChange={(v) => updateContent("dotActiveColor", v)} label="Warna Dot Aktif" />
      <div className="h-px bg-white/10 my-3" />
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Judul Slide</p>
      <ColorPicker value={c.slideTitleColor || "#ffffff"} onChange={(v) => updateContent("slideTitleColor", v)} label="Warna Judul" />
      <FontFamilySelect label="Font" value={c.slideTitleFont} onChange={(v) => updateContent("slideTitleFont", v)} />
      <FontSizeSlider value={c.slideTitleSize} onChange={(v) => updateContent("slideTitleSize", v)} />
      <FontWeightSelect label="Tebal" value={c.slideTitleWeight} onChange={(v) => updateContent("slideTitleWeight", v)} />
      <div className="h-px bg-white/10 my-3" />
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Deskripsi Slide</p>
      <ColorPicker value={c.slideDescColor || "rgba(255,255,255,0.8)"} onChange={(v) => updateContent("slideDescColor", v)} label="Warna Deskripsi" />
      <FontFamilySelect label="Font" value={c.slideDescFont} onChange={(v) => updateContent("slideDescFont", v)} />
      <FontSizeSlider value={c.slideDescSize} onChange={(v) => updateContent("slideDescSize", v)} />
      <FontWeightSelect label="Tebal" value={c.slideDescWeight} onChange={(v) => updateContent("slideDescWeight", v)} />
      <ColorPicker value={c.buttonBg || "#22c55e"} onChange={(v) => updateContent("buttonBg", v)} label="Background Tombol" />
      <ColorPicker value={c.buttonTextColor || "#ffffff"} onChange={(v) => updateContent("buttonTextColor", v)} label="Warna Teks Tombol" />
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Tombol</p>
      <FontFamilySelect label="Font" value={c.buttonFont} onChange={(v) => updateContent("buttonFont", v)} />
      <FontSizeSlider value={c.buttonSize} onChange={(v) => updateContent("buttonSize", v)} />
      <FontWeightSelect label="Tebal" value={c.buttonWeight} onChange={(v) => updateContent("buttonWeight", v)} />
      <div className="mb-3">
        <div className="h-px bg-white/10 mb-3" />
        <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Slides ({slides.length})</label>
        {slides.map((slide: any, i: number) => (
          <div key={i} className="mb-2 p-2 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Slide #{i + 1}</span>
              <button onClick={() => handleRemoveItem("slides", i)} className="text-red-400 hover:text-red-300 text-xs">Hapus</button>
            </div>
            {slide.image && (
              <div className="relative mb-2 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                <img src={slide.image} alt="" className="w-full h-20 object-cover" />
                <button onClick={() => handleItemChange("slides", i, "image", "")} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 text-white text-xs flex items-center justify-center hover:bg-red-500">×</button>
              </div>
            )}
            <input value={slide.title || ""} onChange={(e) => handleItemChange("slides", i, "title", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Judul" />
            <textarea value={slide.description || ""} onChange={(e) => handleItemChange("slides", i, "description", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs resize-none" rows={2} placeholder="Deskripsi" />
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(i, e)} className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#22c55e]/20 file:text-[#22c55e] file:text-xs file:font-medium hover:file:bg-[#22c55e]/30 mb-1" />
            <input value={slide.image || ""} onChange={(e) => handleItemChange("slides", i, "image", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="URL Gambar" />
            <input value={slide.buttonText || ""} onChange={(e) => handleItemChange("slides", i, "buttonText", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Teks Tombol" />
            <input value={slide.buttonLink || ""} onChange={(e) => handleItemChange("slides", i, "buttonLink", e.target.value)} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Link Tombol" />
          </div>
        ))}
        <button onClick={() => handleAddItem("slides", { title: "Slide Baru", description: "", image: "https://placehold.co/1400x600/1e293b/64748b?text=Slide", buttonText: "Pelajari", buttonLink: "#" })} className="w-full py-1.5 text-xs text-[#22c55e] border border-dashed border-[#22c55e]/30 rounded-lg hover:bg-[#22c55e]/10 transition-colors">+ Tambah Slide</button>
      </div>
    </div>
  );
}

export function NestedCarouselEditor({ element, updateContent, handleAddItem, handleRemoveItem, handleItemChange, userId }: EditorProps) {
  const c = element.content;
  const slides = c.slides || [];

  const handleImageUpload = async (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await compressAndUploadImage(file, userId);
      handleItemChange("slides", i, "image", url);
    } catch {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        handleItemChange("slides", i, "image", dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <TextInput label="Judul" value={c.title} onChange={(v) => updateContent("title", v)} />
      <TextInput label="Slide Per View" value={String(c.slidesPerView || 3)} onChange={(v) => updateContent("slidesPerView", Math.min(6, Math.max(1, parseInt(v) || 3)))} />
      <TextInput label="Gap (px)" value={String(c.gap || 20)} onChange={(v) => updateContent("gap", parseInt(v) || 20)} />
      <Checkbox label="Auto Play" checked={c.autoplay !== false} onChange={(v) => updateContent("autoplay", v)} />
      <Checkbox label="Loop" checked={c.loop !== false} onChange={(v) => updateContent("loop", v)} />
      <SelectInput label="Navigasi" value={c.navigation} onChange={(v) => updateContent("navigation", v)} options={["arrows", "none"]} />
      <ColorPicker value={c.dotActiveColor || "#22c55e"} onChange={(v) => updateContent("dotActiveColor", v)} label="Warna Dot Aktif" />
      <ColorPicker value={c.slideBg || "rgba(255,255,255,0.05)"} onChange={(v) => updateContent("slideBg", v)} label="Background Card" />
      <ColorPicker value={c.slideBorder || "rgba(255,255,255,0.1)"} onChange={(v) => updateContent("slideBorder", v)} label="Border Card" />
      <div className="h-px bg-white/10 my-3" />
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Judul Card</p>
      <ColorPicker value={c.cardTitleColor || "#ffffff"} onChange={(v) => updateContent("cardTitleColor", v)} label="Warna Judul" />
      <FontFamilySelect label="Font" value={c.cardTitleFont} onChange={(v) => updateContent("cardTitleFont", v)} />
      <FontSizeSlider value={c.cardTitleSize} onChange={(v) => updateContent("cardTitleSize", v)} />
      <FontWeightSelect label="Tebal" value={c.cardTitleWeight} onChange={(v) => updateContent("cardTitleWeight", v)} />
      <div className="h-px bg-white/10 my-3" />
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Deskripsi Card</p>
      <ColorPicker value={c.cardDescColor || "#94a3b8"} onChange={(v) => updateContent("cardDescColor", v)} label="Warna Deskripsi" />
      <FontFamilySelect label="Font" value={c.cardDescFont} onChange={(v) => updateContent("cardDescFont", v)} />
      <FontSizeSlider value={c.cardDescSize} onChange={(v) => updateContent("cardDescSize", v)} />
      <FontWeightSelect label="Tebal" value={c.cardDescWeight} onChange={(v) => updateContent("cardDescWeight", v)} />
      <div className="mb-3">
        <div className="h-px bg-white/10 mb-3" />
        <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Cards ({slides.length})</label>
        {slides.map((slide: any, i: number) => (
          <div key={i} className="mb-2 p-2 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Card #{i + 1}</span>
              <button onClick={() => handleRemoveItem("slides", i)} className="text-red-400 hover:text-red-300 text-xs">Hapus</button>
            </div>
            {slide.image && (
              <div className="relative mb-2 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                <img src={slide.image} alt="" className="w-full h-20 object-cover" />
                <button onClick={() => handleItemChange("slides", i, "image", "")} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 text-white text-xs flex items-center justify-center hover:bg-red-500">×</button>
              </div>
            )}
            <input value={slide.title || ""} onChange={(e) => handleItemChange("slides", i, "title", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Judul" />
            <textarea value={slide.description || ""} onChange={(e) => handleItemChange("slides", i, "description", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs resize-none" rows={2} placeholder="Deskripsi" />
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(i, e)} className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#22c55e]/20 file:text-[#22c55e] file:text-xs file:font-medium hover:file:bg-[#22c55e]/30 mb-1" />
            <input value={slide.image || ""} onChange={(e) => handleItemChange("slides", i, "image", e.target.value)} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="URL Gambar" />
          </div>
        ))}
        <button onClick={() => handleAddItem("slides", { title: "Card Baru", description: "", image: "https://placehold.co/400x300/1e293b/64748b?text=Card" })} className="w-full py-1.5 text-xs text-[#22c55e] border border-dashed border-[#22c55e]/30 rounded-lg hover:bg-[#22c55e]/10 transition-colors">+ Tambah Card</button>
      </div>
    </div>
  );
}

export function VideoPlaylistEditor({ element, updateContent, handleAddItem, handleRemoveItem, handleItemChange }: EditorProps) {
  const c = element.content;
  const videos = c.videos || [];
  return (
    <div>
      <TextInput label="Judul Playlist" value={c.title} onChange={(v) => updateContent("title", v)} />
      <div className="h-px bg-white/10 my-3" />
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Judul Playlist</p>
      <ColorPicker value={c.titleColor || "#ffffff"} onChange={(v) => updateContent("titleColor", v)} label="Warna Judul" />
      <FontFamilySelect label="Font" value={c.titleFont} onChange={(v) => updateContent("titleFont", v)} />
      <FontSizeSlider value={c.titleSize} onChange={(v) => updateContent("titleSize", v)} />
      <FontWeightSelect label="Tebal" value={c.titleWeight} onChange={(v) => updateContent("titleWeight", v)} />
      <ColorPicker value={c.playlistBg || "#0f172a"} onChange={(v) => updateContent("playlistBg", v)} label="Background Playlist" />
      <div className="h-px bg-white/10 my-3" />
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Video Item</p>
      <ColorPicker value={c.playlistTitleColor || "#ffffff"} onChange={(v) => updateContent("playlistTitleColor", v)} label="Warna Judul Video" />
      <FontFamilySelect label="Font" value={c.playlistTitleFont} onChange={(v) => updateContent("playlistTitleFont", v)} />
      <FontSizeSlider value={c.playlistTitleSize} onChange={(v) => updateContent("playlistTitleSize", v)} />
      <FontWeightSelect label="Tebal" value={c.playlistTitleWeight} onChange={(v) => updateContent("playlistTitleWeight", v)} />
      <ColorPicker value={c.playlistDescColor || "#94a3b8"} onChange={(v) => updateContent("playlistDescColor", v)} label="Warna Deskripsi" />
      <FontFamilySelect label="Font" value={c.playlistDescFont} onChange={(v) => updateContent("playlistDescFont", v)} />
      <FontSizeSlider value={c.playlistDescSize} onChange={(v) => updateContent("playlistDescSize", v)} />
      <FontWeightSelect label="Tebal" value={c.playlistDescWeight} onChange={(v) => updateContent("playlistDescWeight", v)} />
      <ColorPicker value={c.playerBg || "#000000"} onChange={(v) => updateContent("playerBg", v)} label="Background Player" />
      <ColorPicker value={c.accentColor || "#22c55e"} onChange={(v) => updateContent("accentColor", v)} label="Warna Accent" />
      <div className="mb-3">
        <div className="h-px bg-white/10 mb-3" />
        <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Video ({videos.length})</label>
        {videos.map((vid: any, i: number) => (
          <div key={i} className="mb-2 p-2 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Video #{i + 1}</span>
              <button onClick={() => handleRemoveItem("videos", i)} className="text-red-400 hover:text-red-300 text-xs">Hapus</button>
            </div>
            <input value={vid.title || ""} onChange={(e) => handleItemChange("videos", i, "title", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Judul" />
            <input value={vid.description || ""} onChange={(e) => handleItemChange("videos", i, "description", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Deskripsi" />
            <input value={vid.url || ""} onChange={(e) => handleItemChange("videos", i, "url", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="URL Embed YouTube" />
            <input value={vid.duration || ""} onChange={(e) => handleItemChange("videos", i, "duration", e.target.value)} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Durasi (3:45)" />
          </div>
        ))}
        <button onClick={() => handleAddItem("videos", { title: "Video Baru", description: "", type: "youtube", url: "https://www.youtube.com/embed/...", duration: "0:00" })} className="w-full py-1.5 text-xs text-[#22c55e] border border-dashed border-[#22c55e]/30 rounded-lg hover:bg-[#22c55e]/10 transition-colors">+ Tambah Video</button>
      </div>
    </div>
  );
}

export function TableOfContentsEditor({ element, updateContent, handleAddItem, handleRemoveItem, handleItemChange }: EditorProps) {
  const c = element.content;
  const items = c.items || [];
  return (
    <div>
      <TextInput label="Judul" value={c.title} onChange={(v) => updateContent("title", v)} />
      <SelectInput label="Marker" value={c.markers} onChange={(v) => updateContent("markers", v)} options={["numbers", "bullets"]} />
      <Checkbox label="Bisa Diminimalkan" checked={c.minimizeBox !== false} onChange={(v) => updateContent("minimizeBox", v)} />
      <div className="h-px bg-white/10 my-3" />
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Judul</p>
      <ColorPicker value={c.titleColor || "#ffffff"} onChange={(v) => updateContent("titleColor", v)} label="Warna Judul" />
      <FontFamilySelect label="Font" value={c.titleFont} onChange={(v) => updateContent("titleFont", v)} />
      <FontSizeSlider value={c.titleSize} onChange={(v) => updateContent("titleSize", v)} />
      <FontWeightSelect label="Tebal" value={c.titleWeight} onChange={(v) => updateContent("titleWeight", v)} />
      <div className="h-px bg-white/10 my-3" />
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Link</p>
      <ColorPicker value={c.linkColor || "#94a3b8"} onChange={(v) => updateContent("linkColor", v)} label="Warna Link" />
      <FontFamilySelect label="Font" value={c.linkFont} onChange={(v) => updateContent("linkFont", v)} />
      <FontSizeSlider value={c.linkSize} onChange={(v) => updateContent("linkSize", v)} />
      <FontWeightSelect label="Tebal" value={c.linkWeight} onChange={(v) => updateContent("linkWeight", v)} />
      <ColorPicker value={c.linkActiveColor || "#22c55e"} onChange={(v) => updateContent("linkActiveColor", v)} label="Warna Link Aktif" />
      <ColorPicker value={c.markerColor || "#22c55e"} onChange={(v) => updateContent("markerColor", v)} label="Warna Marker" />
      <ColorPicker value={c.backgroundColor || "rgba(255,255,255,0.03)"} onChange={(v) => updateContent("backgroundColor", v)} label="Background" />
      <div className="mb-3">
        <div className="h-px bg-white/10 mb-3" />
        <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Daftar Isi ({items.length})</label>
        {items.map((item: any, i: number) => (
          <div key={i} className="mb-2 p-2 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">#{i + 1}</span>
              <button onClick={() => handleRemoveItem("items", i)} className="text-red-400 hover:text-red-300 text-xs">Hapus</button>
            </div>
            <input value={item.text || ""} onChange={(e) => handleItemChange("items", i, "text", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Teks" />
            <div className="flex gap-1">
              <input value={String(item.level || 2)} onChange={(e) => handleItemChange("items", i, "level", parseInt(e.target.value) || 2)} className="w-16 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Level" />
              <input value={item.href || ""} onChange={(e) => handleItemChange("items", i, "href", e.target.value)} className="flex-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="#anchor" />
            </div>
          </div>
        ))}
        <button onClick={() => handleAddItem("items", { text: "Heading Baru", level: 2, href: "#" })} className="w-full py-1.5 text-xs text-[#22c55e] border border-dashed border-[#22c55e]/30 rounded-lg hover:bg-[#22c55e]/10 transition-colors">+ Tambah Item</button>
      </div>
    </div>
  );
}

// ─── 3D Element Editors ───

export function ThreeBackgroundEditor({ element, updateContent }: EditorProps) {
  const c = element.content;
  return (
    <div>
      <p className="text-[10px] text-gray-500 leading-relaxed mb-3">
        🌌 Element 3D Background menggunakan CSS efek. Letakkan dalam section sebagai overlay — element ini menggunakan <code>position: absolute</code> dan akan menutupi seluruh section.
      </p>
      <ColorPicker value={c.color || "#22c55e"} onChange={(v) => updateContent("color", v)} label="Warna Akcent" />
      <div className="mb-3">
        <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Intensitas ({c.intensity || 0.5})</label>
        <input
          type="range"
          min={0.1} max={1} step={0.1}
          value={c.intensity || 0.5}
          onChange={(e) => updateContent("intensity", parseFloat(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none bg-white/10 cursor-pointer accent-[#22c55e]"
        />
      </div>
      <Checkbox label="Animasi" checked={c.animated !== false} onChange={(v) => updateContent("animated", v)} />
    </div>
  );
}

export function ThreeSceneEditor({ element, updateContent }: EditorProps) {
  const c = element.content;
  return (
    <div>
      <Section title="3D Scene">
        <ColorPicker value={c.color || "#22c55e"} onChange={(v) => updateContent("color", v)} label="Warna Akcent" />
        <div className="mb-3">
          <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Jumlah Shape ({c.shapes || 6})</label>
          <input
            type="range"
            min={2} max={12} step={1}
            value={c.shapes || 6}
            onChange={(e) => updateContent("shapes", parseInt(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none bg-white/10 cursor-pointer accent-[#22c55e]"
          />
        </div>
        <div className="mb-3">
          <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Kecepatan Animasi ({c.rotateSpeed || 0.5})</label>
          <input
            type="range"
            min={0.1} max={2} step={0.1}
            value={c.rotateSpeed || 0.5}
            onChange={(e) => updateContent("rotateSpeed", parseFloat(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none bg-white/10 cursor-pointer accent-[#22c55e]"
          />
        </div>
      </Section>

      <Section title="Teks Overlay">
        <p className="text-[10px] text-gray-500 leading-relaxed mb-3">Teks akan tampil di atas scene 3D. Gunakan style panel untuk mengatur warna, ukuran, dan posisi.</p>
        <TextInput label="Judul" value={c.title} onChange={(v) => updateContent("title", v)} />
        <TextArea label="Subtitle" value={c.subtitle} onChange={(v) => updateContent("subtitle", v)} />
        <TextInput label="Teks Tombol" value={c.buttonText} onChange={(v) => updateContent("buttonText", v)} />
        <TextInput label="Link Tombol" value={c.buttonHref} onChange={(v) => updateContent("buttonHref", v)} />
        <SelectInput label="Posisi Teks" value={c.textPosition || "center"} onChange={(v) => updateContent("textPosition", v)} options={["center", "left", "right", "top-left", "top-center", "top-right", "bottom-left", "bottom-center", "bottom-right"]} />
      </Section>
    </div>
  );
}

export function ThreeParticlesEditor({ element, updateContent }: EditorProps) {
  const c = element.content;
  return (
    <div>
      <Section title="3D Particles">
        <ColorPicker value={c.color || "#22c55e"} onChange={(v) => updateContent("color", v)} label="Warna Partikel" />
        <div className="mb-3">
          <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Jumlah Partikel ({c.particleCount || 300})</label>
          <input
            type="range"
            min={50} max={1000} step={50}
            value={c.particleCount || 300}
            onChange={(e) => updateContent("particleCount", parseInt(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none bg-white/10 cursor-pointer accent-[#22c55e]"
          />
        </div>
        <div className="mb-3">
          <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Kecepatan ({c.speed || 0.5})</label>
          <input
            type="range"
            min={0.1} max={2} step={0.1}
            value={c.speed || 0.5}
            onChange={(e) => updateContent("speed", parseFloat(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none bg-white/10 cursor-pointer accent-[#22c55e]"
          />
        </div>
      </Section>
    </div>
  );
}

// ─── End 3D Editors ───

export function SocialEmbedEditor({ element, updateContent }: EditorProps) {
  const c = element.content;
  return (
    <div>
      <TextInput label="Judul" value={c.title} onChange={(v) => updateContent("title", v)} />
      <SelectInput label="Tipe" value={c.type} onChange={(v) => updateContent("type", v)} options={["facebook-page", "facebook-post", "facebook-comments", "facebook-button"]} />
      <TextInput label="URL" value={c.url} onChange={(v) => updateContent("url", v)} />
      <SelectInput label="Layout" value={c.layout} onChange={(v) => updateContent("layout", v)} options={["timeline", "events", "messages"]} />
      <SelectInput label="Color Scheme" value={c.colorScheme} onChange={(v) => updateContent("colorScheme", v)} options={["light", "dark"]} />
      <Checkbox label="Small Header" checked={!!c.smallHeader} onChange={(v) => updateContent("smallHeader", v)} />
      <Checkbox label="Hide Cover" checked={!!c.hideCover} onChange={(v) => updateContent("hideCover", v)} />
      <Checkbox label="Show Facepile" checked={c.showFacepile !== false} onChange={(v) => updateContent("showFacepile", v)} />
      <TextInput label="Lebar" value={c.width} onChange={(v) => updateContent("width", v)} />
      <TextInput label="Tinggi" value={c.height} onChange={(v) => updateContent("height", v)} />
      <ColorPicker value={c.titleColor || "#ffffff"} onChange={(v) => updateContent("titleColor", v)} label="Warna Judul" />
      <FontFamilySelect label="Font" value={c.titleFont} onChange={(v) => updateContent("titleFont", v)} />
      <FontSizeSlider value={c.titleSize} onChange={(v) => updateContent("titleSize", v)} />
      <FontWeightSelect label="Tebal" value={c.titleWeight} onChange={(v) => updateContent("titleWeight", v)} />
    </div>
  );
}
