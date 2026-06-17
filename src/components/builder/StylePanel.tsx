"use client";

import { useRef, useState, useEffect } from "react";
import { useBuilder } from "@/lib/builder/store";
import { useAuth } from "@/components/auth/AuthProvider";
import { SOCIAL_PLATFORMS, SocialIcon } from "@/lib/builder/social-platforms";
import { compressAndUploadImage } from "@/lib/upload-image";
import { AnimatedHeadlineEditor, BlockquoteEditor, CodeHighlightEditor, FlipBoxEditor, HotspotEditor, ProgressTrackerEditor, ShareButtonsEditor, ChecklistEditor, GalleryEditor, LottieEditor, StarRatingEditor, SearchEditor, FloatingButtonsEditor, BreadcrumbsEditor, OffCanvasEditor, SlidesEditor, NestedCarouselEditor, VideoPlaylistEditor, TableOfContentsEditor, SocialEmbedEditor } from "./PremiumElementEditors";

const elementLabels: Record<string, string> = {
  heading: "Heading", text: "Teks", image: "Gambar", button: "Tombol",
  video: "Video", spacer: "Spacer", divider: "Divider", icon: "Ikon",
  features: "Features Grid", pricing: "Pricing Table", testimonial: "Testimonial",
  cta: "CTA Section", stats: "Stats Counter", contactForm: "Contact Form",
  maps: "Google Maps", navbar: "Navbar", footer: "Footer",
  carousel: "Carousel", accordion: "FAQ Accordion", team: "Tim", countdown: "Countdown",
  // Premium Elements (Elementor Pro)
  "animated-headline": "Animated Headline",
  blockquote: "Blockquote",
  "code-highlight": "Code Highlight",
  "flip-box": "Flip Box",
  hotspot: "Hotspot",
  "progress-tracker": "Progress Tracker",
  "share-buttons": "Share Buttons",
  checklist: "Checklist",
  gallery: "Gallery",
  lottie: "Lottie Animation",
  "star-rating": "Star Rating",
  search: "Search",
  "floating-buttons": "Floating Buttons",
  breadcrumbs: "Breadcrumbs",
  "off-canvas": "Off Canvas",
  slides: "Slides",
  "nested-carousel": "Nested Carousel",
  "video-playlist": "Video Playlist",
  "table-of-contents": "Table of Contents",
  "social-embed": "Social Embed",
};

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

const fontOptions = [
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
  return (
    <div className="mb-3">
      <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg bg-transparent border border-white/10 cursor-pointer flex-shrink-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50 font-mono"
          placeholder="#000000"
        />
      </div>
      <div className="flex gap-1.5 mt-1.5 flex-wrap">
        {commonColors.map((c) => (
          <button
            key={c.value}
            onClick={() => onChange(c.value)}
            className="w-6 h-6 rounded-md border border-white/10 hover:scale-110 transition-transform"
            style={{ backgroundColor: c.value }}
            title={c.label}
          />
        ))}
      </div>
    </div>
  );
}

function GradientBuilder({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  // Parse existing gradient or use defaults
  const parseGradient = (val: string) => {
    const match = val?.match(/linear-gradient\(\s*([\d.]+deg|[\w-]+)?\s*,?\s*#?[\da-fA-F]*\s*\d*%?\s*,?\s*#?[\da-fA-F]*/);
    if (!val || !val.includes("linear-gradient")) {
      return { c1: "#22c55e", c2: "#16a34a", dir: "135deg" };
    }
    // Extract direction
    let dir = "135deg";
    const dirMatch = val.match(/linear-gradient\(\s*([^,]+)/);
    if (dirMatch) {
      const d = dirMatch[1].trim();
      if (d.includes("deg") || d.includes("to ") || d.includes("turn")) dir = d;
    }
    // Extract colors
    const colors = val.match(/#([\da-fA-F]{3,8})/g) || [];
    return {
      c1: colors[0] || "#22c55e",
      c2: colors[1] || "#16a34a",
      dir,
    };
  };

  const parsed = parseGradient(value);
  const [c1, setC1] = useState(parsed.c1);
  const [c2, setC2] = useState(parsed.c2);
  const [dir, setDir] = useState(parsed.dir);

  // Sync from props when value changes externally
  useEffect(() => {
    const p = parseGradient(value);
    setC1(p.c1);
    setC2(p.c2);
    setDir(p.dir);
  }, [value]);

  const buildGradient = (color1: string, color2: string, direction: string) => {
    return `linear-gradient(${direction}, ${color1} 0%, ${color2} 100%)`;
  };

  const applyGradient = (color1: string, color2: string, direction: string) => {
    onChange(buildGradient(color1, color2, direction));
  };

  const dirOptions = [
    { label: "↘", value: "135deg", title: "Diagonal" },
    { label: "↓", value: "180deg", title: "Ke Bawah" },
    { label: "→", value: "90deg", title: "Ke Kanan" },
    { label: "↗", value: "45deg", title: "Diagonal Kanan Atas" },
    { label: "←", value: "270deg", title: "Ke Kiri" },
    { label: "↑", value: "0deg", title: "Ke Atas" },
  ];

  const gradientPresets = [
    { label: "Sunset", c1: "#f093fb", c2: "#f5576c" },
    { label: "Ocean", c1: "#4facfe", c2: "#00f2fe" },
    { label: "Forest", c1: "#43e97b", c2: "#38f9d7" },
    { label: "Purple", c1: "#667eea", c2: "#764ba2" },
    { label: "Warm", c1: "#fa709a", c2: "#fee140" },
    { label: "Dark", c1: "#0f172a", c2: "#1e293b" },
    { label: "Hijau", c1: "#22c55e", c2: "#16a34a" },
    { label: "Biru", c1: "#3b82f6", c2: "#1d4ed8" },
  ];

  const previewStyle: React.CSSProperties = {
    background: buildGradient(c1, c2, dir),
    height: "36px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.1)",
    transition: "background 0.3s ease",
  };

  return (
    <div className="mb-3 space-y-2">
      {/* Color pickers side by side */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="block text-[9px] text-gray-600 mb-0.5">Warna 1</label>
          <input
            type="color"
            value={c1}
            onChange={(e) => { setC1(e.target.value); applyGradient(e.target.value, c2, dir); }}
            className="w-full h-8 rounded-lg bg-transparent border border-white/10 cursor-pointer"
          />
        </div>
        <span className="text-gray-500 mt-4 text-xs">+</span>
        <div className="flex-1">
          <label className="block text-[9px] text-gray-600 mb-0.5">Warna 2</label>
          <input
            type="color"
            value={c2}
            onChange={(e) => { setC2(e.target.value); applyGradient(c1, e.target.value, dir); }}
            className="w-full h-8 rounded-lg bg-transparent border border-white/10 cursor-pointer"
          />
        </div>
      </div>

      {/* Direction selector */}
      <div>
        <label className="block text-[9px] text-gray-600 mb-1">Arah Gradien</label>
        <div className="flex gap-1">
          {dirOptions.map((d) => (
            <button
              key={d.value}
              onClick={() => { setDir(d.value); applyGradient(c1, c2, d.value); }}
              className={`flex-1 py-1 text-xs rounded-md border transition-all ${
                dir === d.value
                  ? "bg-[#22c55e]/20 border-[#22c55e]/40 text-[#22c55e]"
                  : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
              }`}
              title={d.title}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div style={previewStyle} />

      {/* Presets */}
      <div>
        <label className="block text-[9px] text-gray-600 mb-1">Presets</label>
        <div className="flex flex-wrap gap-1">
          {gradientPresets.map((g) => (
            <button
              key={g.label}
              onClick={() => { setC1(g.c1); setC2(g.c2); applyGradient(g.c1, g.c2, dir); }}
              className="flex items-center gap-1 px-2 py-1 text-[10px] rounded-md border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:border-white/20 transition-all"
            >
              <span
                className="w-3 h-3 rounded-sm inline-block flex-shrink-0"
                style={{ background: `linear-gradient(${dir}, ${g.c1}, ${g.c2})` }}
              />
              {g.label}
            </button>
          ))}
          <button
            onClick={() => { setC1("#000000"); setC2("#000000"); onChange(""); }}
            className="px-2 py-1 text-[10px] rounded-md border border-dashed border-red-400/30 text-red-400 hover:border-red-400/60 transition-all"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

function FontSizeSlider({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  // Parse value to extract numeric part and unit (e.g. "1rem" -> 1, "rem")
  const match = value?.match(/^([\d.]+)(\s*)(\S*)$/) || [];
  const num = parseFloat(match[1]) || 16;
  const unit = match[3] || "px";

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNum = parseInt(e.target.value, 10);
    onChange(`${newNum}${unit}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

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
          min={8}
          max={100}
          step={1}
          value={Math.min(100, Math.max(8, Math.round(num)))}
          onChange={handleSlider}
          className="flex-1 h-1.5 rounded-full appearance-none bg-white/10 cursor-pointer
            accent-[#22c55e]
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[#22c55e]
            [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:active:cursor-grabbing
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-[#22c55e]
            [&::-moz-range-thumb]:border-0"
        />
        <input
          type="text"
          value={value || ""}
          onChange={handleInputChange}
          className="w-16 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm text-center focus:outline-none focus:border-[#22c55e]/50 font-mono"
          placeholder="16px"
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

export default function StylePanel() {
  const { currentPage, dispatch, state } = useBuilder();
  const { user } = useAuth();
  const [tab, setTab] = useState<"content" | "style">("content");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentPage) return null;

  if (!state.selectedElementId) {
    return (
      <aside className="w-72 flex-shrink-0 bg-[#0f172a] border-l border-white/10 p-4 overflow-y-auto">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 5h4a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h4m2 4l2-2m0 0l-2-2m2 2H8" />
            </svg>
          </div>
          <p className="text-sm text-gray-400 font-medium">Klik element di canvas</p>
          <p className="text-xs text-gray-600 mt-1">untuk mengedit konten & style</p>
        </div>
      </aside>
    );
  }

  // Find the selected element
  let selectedElement: any = null;
  let sectionId = "";
  let columnIndex = 0;
  let elementIndex = -1;
  let totalElements = 0;

  for (const sec of currentPage.sections) {
    for (let ci = 0; ci < sec.columns.length; ci++) {
      const idx = sec.columns[ci].elements.findIndex((e) => e.id === state.selectedElementId);
      if (idx !== -1) {
        selectedElement = sec.columns[ci].elements[idx];
        sectionId = sec.id;
        columnIndex = ci;
        elementIndex = idx;
        totalElements = sec.columns[ci].elements.length;
        break;
      }
    }
    if (selectedElement) break;
  }

  if (!selectedElement) {
    return (
      <aside className="w-72 flex-shrink-0 bg-[#0f172a] border-l border-white/10 p-4 overflow-y-auto">
        <p className="text-sm text-gray-500 text-center mt-20">Element tidak ditemukan</p>
      </aside>
    );
  }

  const updateContent = (key: string, value: any) => {
    dispatch({ type: "UPDATE_ELEMENT", pageId: currentPage.id, sectionId, columnIndex, elementId: selectedElement.id, content: { [key]: value } });
  };

  const updateStyle = (key: string, value: string) => {
    dispatch({ type: "UPDATE_ELEMENT", pageId: currentPage.id, sectionId, columnIndex, elementId: selectedElement.id, content: {}, styles: { [key]: value } });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await compressAndUploadImage(file, user?.id ?? null);
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

  const handleAddItem = (field: string, defaultItem: any) => {
    const items = [...(selectedElement.content[field] || []), defaultItem];
    updateContent(field, items);
  };

  const handleRemoveItem = (field: string, index: number) => {
    const items = [...(selectedElement.content[field] || [])];
    items.splice(index, 1);
    updateContent(field, items);
  };

  const handleItemChange = (field: string, index: number, key: string, value: any) => {
    const items = [...(selectedElement.content[field] || [])];
    items[index] = { ...items[index], [key]: value };
    updateContent(field, items);
  };

  const handleAddLink = () => {
    const links = [...(selectedElement.content.links || []), { label: "Link Baru", href: "#" }];
    updateContent("links", links);
  };

  const handleRemoveLink = (index: number) => {
    const links = [...(selectedElement.content.links || [])];
    links.splice(index, 1);
    updateContent("links", links);
  };

  const renderField = (label: string, key: string, type: "text" | "color" | "number" | "select" | "textarea", options?: string[]) => {
    const value = selectedElement.content[key] ?? "";
    const id = `field-${key}`;
    return (
      <div className="mb-3">
        <label htmlFor={id} className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
        {type === "select" ? (
          <select
            id={id}
            value={value}
            onChange={(e) => updateContent(key, e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50"
            style={{ colorScheme: 'dark' }}
          >
            {options?.map((opt) => (
              <option key={opt} value={opt} className="bg-[#1e293b] text-white">{opt}</option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea
            id={id}
            value={value}
            onChange={(e) => updateContent(key, e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50 resize-none"
            rows={3}
          />
        ) : type === "color" ? (
          <ColorPicker value={value} onChange={(v) => updateContent(key, v)} label="" />
        ) : (
          <input
            id={id}
            type={type === "number" ? "number" : "text"}
            value={value}
            onChange={(e) => updateContent(key, e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50"
            placeholder={label}
          />
        )}
      </div>
    );
  };

  const renderStyleField = (label: string, key: string, type: "text" | "color" | "number" | "select", options?: string[]) => {
    const value = selectedElement.styles[key] ?? "";
    return (
      <div className="mb-3">
        <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
        {type === "color" ? (
          <ColorPicker value={value} onChange={(v) => updateStyle(key, v)} label="" />
        ) : type === "select" ? (
          <select
            value={value}
            onChange={(e) => updateStyle(key, e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50"
            style={{ colorScheme: 'dark' }}
          >
            {options?.map((opt) => (
              <option key={opt} value={opt} className="bg-[#1e293b] text-white">{opt}</option>
            ))}
          </select>
        ) : (
          <input
            type={type === "number" ? "number" : "text"}
            value={value}
            onChange={(e) => updateStyle(key, e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50"
            placeholder={label}
          />
        )}
      </div>
    );
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <div className="mb-4">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">{title}</h4>
      <div className="space-y-1">{children}</div>
    </div>
  );

  const renderSpacingFields = (labelPrefix: string, keys: { top: string; bottom: string; left: string; right: string }) => {
    const val = (k: string) => selectedElement.styles[k] ?? "";
    return (
      <div className="mb-3">
        <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">{labelPrefix}</label>
        <div className="grid grid-cols-2 gap-1.5">
          <div>
            <span className="text-[9px] text-gray-600 block mb-0.5">Top</span>
            <input
              type="text"
              value={val(keys.top)}
              onChange={(e) => updateStyle(keys.top, e.target.value)}
              className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#22c55e]/50"
              placeholder="0px"
            />
          </div>
          <div>
            <span className="text-[9px] text-gray-600 block mb-0.5">Bottom</span>
            <input
              type="text"
              value={val(keys.bottom)}
              onChange={(e) => updateStyle(keys.bottom, e.target.value)}
              className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#22c55e]/50"
              placeholder="0px"
            />
          </div>
          <div>
            <span className="text-[9px] text-gray-600 block mb-0.5">Left</span>
            <input
              type="text"
              value={val(keys.left)}
              onChange={(e) => updateStyle(keys.left, e.target.value)}
              className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#22c55e]/50"
              placeholder="0px"
            />
          </div>
          <div>
            <span className="text-[9px] text-gray-600 block mb-0.5">Right</span>
            <input
              type="text"
              value={val(keys.right)}
              onChange={(e) => updateStyle(keys.right, e.target.value)}
              className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#22c55e]/50"
              placeholder="0px"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <aside className="w-72 flex-shrink-0 bg-[#0f172a] border-l border-white/10 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-[#0f172a] z-10 p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
            <div>
              <h3 className="text-sm font-semibold text-white">{elementLabels[selectedElement.type] || selectedElement.type}</h3>
              <p className="text-[10px] text-gray-500 mt-0.5">Klik element lain atau double-click teks untuk edit langsung</p>
            </div>
          </div>
        </div>

        {/* Action buttons for mobile — always visible */}
        <div className="flex items-center gap-1 mb-2">
          <button
            onClick={() => dispatch({ type: "MOVE_ELEMENT", pageId: currentPage.id, from: { sectionId, columnIndex, elementId: selectedElement.id }, to: { sectionId, columnIndex, index: elementIndex - 1 } })}
            disabled={elementIndex <= 0}
            className="flex-1 py-1 text-[10px] font-medium rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ▲ Atas
          </button>
          <button
            onClick={() => dispatch({ type: "MOVE_ELEMENT", pageId: currentPage.id, from: { sectionId, columnIndex, elementId: selectedElement.id }, to: { sectionId, columnIndex, index: elementIndex + 1 } })}
            disabled={elementIndex >= totalElements - 1}
            className="flex-1 py-1 text-[10px] font-medium rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ▼ Bawah
          </button>
          <button
            onClick={() => dispatch({ type: "DUPLICATE_ELEMENT", pageId: currentPage.id, sectionId, columnIndex, elementId: selectedElement.id })}
            className="flex-1 py-1 text-[10px] font-medium rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-[#22c55e] hover:bg-[#22c55e]/10 transition-all"
          >
            📋 Duplikat
          </button>
          <button
            onClick={() => dispatch({ type: "REMOVE_ELEMENT", pageId: currentPage.id, sectionId, columnIndex, elementId: selectedElement.id })}
            className="flex-1 py-1 text-[10px] font-medium rounded-lg bg-white/5 border border-red-400/20 text-red-400 hover:bg-red-500/10 hover:border-red-400/40 transition-all"
          >
            🗑 Hapus
          </button>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => setTab("content")}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${tab === "content" ? "bg-[#22c55e]/20 text-[#22c55e]" : "text-gray-400 hover:text-white"}`}
          >
            Konten
          </button>
          <button
            onClick={() => setTab("style")}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${tab === "style" ? "bg-[#22c55e]/20 text-[#22c55e]" : "text-gray-400 hover:text-white"}`}
          >
            Style
          </button>
        </div>
      </div>

      <div className="p-4">
        {tab === "content" ? (
          <div>
            {/* --- HEADING --- */}
            {selectedElement.type === "heading" && (
              <>
                {renderField("Teks Heading", "text", "text")}
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Level Heading</label>
                  <select
                    value={selectedElement.content.level || "h2"}
                    onChange={(e) => {
                      updateContent("level", e.target.value);
                      // Clear custom fontSize so the heading level's native size takes effect
                      if (selectedElement.styles.fontSize) {
                        updateStyle("fontSize", "");
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="h1" className="bg-[#1e293b] text-white">H1 - Paling Besar</option>
                    <option value="h2" className="bg-[#1e293b] text-white">H2 - Besar</option>
                    <option value="h3" className="bg-[#1e293b] text-white">H3 - Sedang</option>
                    <option value="h4" className="bg-[#1e293b] text-white">H4 - Kecil</option>
                    <option value="h5" className="bg-[#1e293b] text-white">H5 - Lebih Kecil</option>
                    <option value="h6" className="bg-[#1e293b] text-white">H6 - Terkecil</option>
                  </select>
                </div>
              </>
            )}

            {/* --- TEXT --- */}
            {selectedElement.type === "text" && (
              <>
                <p className="text-[10px] text-gray-600 mb-2">Double-click teks di canvas untuk edit langsung, atau edit di sini:</p>
                {renderField("Teks Paragraf", "text", "textarea")}
              </>
            )}

            {/* --- IMAGE --- */}
            {selectedElement.type === "image" && (
              <>
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Preview</label>
                  <div className="relative rounded-lg overflow-hidden bg-white/5 border border-white/10">
                    <img
                      src={selectedElement.content.src || "https://placehold.co/800x500/1e293b/64748b?text=No+Image"}
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
            )}

            {/* --- BUTTON --- */}
            {selectedElement.type === "button" && (
              <>
                {renderField("Teks Tombol", "text", "text")}
                {renderField("Link / URL", "href", "text")}
                {renderField("Variant", "variant", "select", ["primary", "secondary", "outline"])}
                {renderField("Target", "target", "select", ["_self", "_blank"])}
              </>
            )}

            {/* --- VIDEO --- */}
            {selectedElement.type === "video" && (
              <>
                <p className="text-[10px] text-gray-600 mb-2">Masukkan URL embed YouTube/Vimeo:</p>
                <div className="mb-2 p-2 rounded-lg bg-white/5 border border-white/10">
                  <code className="text-[10px] text-gray-500">Contoh: https://www.youtube.com/embed/VIDEO_ID</code>
                </div>
                {renderField("URL Video (Embed)", "url", "text")}
                {renderField("Caption", "caption", "text")}
              </>
            )}

            {/* --- SPACER --- */}
            {selectedElement.type === "spacer" && (
              renderField("Tinggi Spacer (px)", "height", "text")
            )}

            {/* --- DIVIDER --- */}
            {selectedElement.type === "divider" && (
              <>
                {renderField("Style Garis", "style", "select", ["solid", "dashed", "dotted"])}
                {renderField("Warna", "color", "color")}
              </>
            )}

            {/* --- ICON --- */}
            {selectedElement.type === "icon" && (
              <>
                {renderField("Ikon", "icon", "select", ["star", "heart", "rocket", "globe", "lightbulb", "shield", "chart", "users", "cog", "check"])}
                {renderField("Ukuran", "size", "text")}
                {renderField("Warna", "color", "color")}
              </>
            )}

            {/* --- FEATURES --- */}
            {selectedElement.type === "features" && (
              <>
                {renderField("Judul Section", "title", "text")}
                {renderField("Subtitle", "subtitle", "text")}
                <div className="mb-3 mt-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Judul</h4>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Font Judul</label>
                    <select value={selectedElement.content.titleFont || "Inter, sans-serif"} onChange={(e) => updateContent("titleFont", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" style={{ colorScheme: 'dark' }}>
                      {fontOptions.map(f => <option key={f.value} value={f.value} className="bg-[#1e293b] text-white">{f.label}</option>)}
                    </select>
                  </div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.titleColor || "#ffffff"} onChange={(v) => updateContent("titleColor", v)} label="Warna Judul" /></div>
                  <div className="mb-2"><FontSizeSlider value={selectedElement.content.titleSize || "30px"} onChange={(v) => updateContent("titleSize", v)} /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ketebalan Judul</label>
                    <select value={selectedElement.content.titleWeight || "700"} onChange={(e) => updateContent("titleWeight", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" style={{ colorScheme: 'dark' }}>
                      <option value="300" className="bg-[#1e293b] text-white">Light (300)</option>
                      <option value="400" className="bg-[#1e293b] text-white">Normal (400)</option>
                      <option value="500" className="bg-[#1e293b] text-white">Medium (500)</option>
                      <option value="600" className="bg-[#1e293b] text-white">Semi Bold (600)</option>
                      <option value="700" className="bg-[#1e293b] text-white">Bold (700)</option>
                      <option value="800" className="bg-[#1e293b] text-white">Extra Bold (800)</option>
                      <option value="900" className="bg-[#1e293b] text-white">Black (900)</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Subtitle</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.subtitleColor || "#94a3b8"} onChange={(v) => updateContent("subtitleColor", v)} label="Warna Subtitle" /></div>                  <div className="mb-2"><FontSizeSlider value={selectedElement.content.subtitleSize || "16px"} onChange={(v) => updateContent("subtitleSize", v)} /></div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Kartu</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.itemBg || "rgba(255,255,255,0.05)"} onChange={(v) => updateContent("itemBg", v)} label="Background Kartu" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.itemBorder || "rgba(255,255,255,0.1)"} onChange={(v) => updateContent("itemBorder", v)} label="Border Kartu" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.itemTitleColor || "#ffffff"} onChange={(v) => updateContent("itemTitleColor", v)} label="Warna Judul Item" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.itemTextColor || "#94a3b8"} onChange={(v) => updateContent("itemTextColor", v)} label="Warna Teks Item" /></div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Items ({selectedElement.content.items?.length || 0})</label>
                  {selectedElement.content.items?.map((item: any, i: number) => (
                    <div key={i} className="mb-2 p-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">#{i + 1}</span>
                        <button onClick={() => handleRemoveItem("items", i)} className="text-red-400 hover:text-red-300 text-xs">Hapus</button>
                      </div>
                      <select value={item.icon || ""} onChange={(e) => handleItemChange("items", i, "icon", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#22c55e]/50" style={{ colorScheme: 'dark' }}>
                        <option value="" className="bg-[#1e293b] text-white">Pilih Icon</option>
                        <option value="star" className="bg-[#1e293b] text-white">⭐ Star</option>
                        <option value="heart" className="bg-[#1e293b] text-white">❤️ Heart</option>
                        <option value="rocket" className="bg-[#1e293b] text-white">🚀 Rocket</option>
                        <option value="globe" className="bg-[#1e293b] text-white">🌍 Globe</option>
                        <option value="lightbulb" className="bg-[#1e293b] text-white">💡 Lightbulb</option>
                        <option value="shield" className="bg-[#1e293b] text-white">🛡️ Shield</option>
                        <option value="chart" className="bg-[#1e293b] text-white">📊 Chart</option>
                        <option value="users" className="bg-[#1e293b] text-white">👥 Users</option>
                        <option value="cog" className="bg-[#1e293b] text-white">⚙️ Cog</option>
                        <option value="check" className="bg-[#1e293b] text-white">✓ Check</option>
                      </select>
                      <input value={item.title || ""} onChange={(e) => handleItemChange("items", i, "title", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Judul" />
                      <textarea value={item.desc || ""} onChange={(e) => handleItemChange("items", i, "desc", e.target.value)} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs resize-none" rows={2} placeholder="Deskripsi" />
                    </div>
                  ))}
                  <button onClick={() => handleAddItem("items", { icon: "🚀", title: "Fitur Baru", desc: "Deskripsi fitur" })} className="w-full py-1.5 text-xs text-[#22c55e] border border-dashed border-[#22c55e]/30 rounded-lg hover:bg-[#22c55e]/10 transition-colors">+ Tambah Item</button>
                </div>
              </>
            )}

            {/* --- PRICING --- */}
            {selectedElement.type === "pricing" && (
              <>
                {renderField("Judul Section", "title", "text")}
                {renderField("Subtitle", "subtitle", "text")}
                <div className="mb-3 mt-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Judul</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.titleColor || "#ffffff"} onChange={(v) => updateContent("titleColor", v)} label="Warna Judul" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Judul</label>
                    <input type="text" value={selectedElement.content.titleSize || "30px"} onChange={(e) => updateContent("titleSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Subtitle</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.subtitleColor || "#94a3b8"} onChange={(v) => updateContent("subtitleColor", v)} label="Warna Subtitle" /></div>                  <div className="mb-2"><FontSizeSlider value={selectedElement.content.subtitleSize || "16px"} onChange={(v) => updateContent("subtitleSize", v)} /></div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Kartu</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.cardBg || "rgba(255,255,255,0.05)"} onChange={(v) => updateContent("cardBg", v)} label="Background Kartu" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.cardBorder || "rgba(255,255,255,0.1)"} onChange={(v) => updateContent("cardBorder", v)} label="Border Kartu" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.highlightBg || "rgba(34,197,94,0.05)"} onChange={(v) => updateContent("highlightBg", v)} label="Background Highlight" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.highlightBorder || "#22c55e"} onChange={(v) => updateContent("highlightBorder", v)} label="Border Highlight" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.cardNameColor || "#ffffff"} onChange={(v) => updateContent("cardNameColor", v)} label="Warna Nama Paket" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.cardPriceColor || "#ffffff"} onChange={(v) => updateContent("cardPriceColor", v)} label="Warna Harga" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.cardDescColor || "#94a3b8"} onChange={(v) => updateContent("cardDescColor", v)} label="Warna Deskripsi" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.cardFeatureColor || "#d1d5db"} onChange={(v) => updateContent("cardFeatureColor", v)} label="Warna Fitur" /></div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Paket ({selectedElement.content.items?.length || 0})</label>
                  {selectedElement.content.items?.map((item: any, i: number) => (
                    <div key={i} className="mb-2 p-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">#{i + 1}</span>
                        <button onClick={() => handleRemoveItem("items", i)} className="text-red-400 hover:text-red-300 text-xs">Hapus</button>
                      </div>
                      <input value={item.name || ""} onChange={(e) => handleItemChange("items", i, "name", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Nama Paket" />
                      <input value={item.price || ""} onChange={(e) => handleItemChange("items", i, "price", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Harga" />
                      <input value={item.desc || ""} onChange={(e) => handleItemChange("items", i, "desc", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Deskripsi" />
                      <textarea value={(item.features || []).join("\n")} onChange={(e) => handleItemChange("items", i, "features", e.target.value.split("\n"))} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs resize-none" rows={3} placeholder="Fitur (pisahkan dengan enter)" />
                      <label className="flex items-center gap-2 mt-1">
                        <input type="checkbox" checked={item.highlighted || false} onChange={(e) => handleItemChange("items", i, "highlighted", e.target.checked)} className="rounded bg-white/5 border-white/20" />
                        <span className="text-xs text-gray-400">Highlight (unggulan)</span>
                      </label>
                    </div>
                  ))}
                  <button onClick={() => handleAddItem("items", { name: "Paket Baru", price: "Rp 0", desc: "Deskripsi", features: ["Fitur 1"], highlighted: false, cta: "Pilih Paket" })} className="w-full py-1.5 text-xs text-[#22c55e] border border-dashed border-[#22c55e]/30 rounded-lg hover:bg-[#22c55e]/10 transition-colors">+ Tambah Paket</button>
                </div>
              </>
            )}

            {/* --- TESTIMONIAL --- */}
            {selectedElement.type === "testimonial" && (
              <>
                {renderField("Judul Section", "title", "text")}
                <div className="mb-3 mt-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Judul</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.titleColor || "#ffffff"} onChange={(v) => updateContent("titleColor", v)} label="Warna Judul" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Judul</label>
                    <input type="text" value={selectedElement.content.titleSize || "30px"} onChange={(e) => updateContent("titleSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Kartu</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.cardBg || "rgba(255,255,255,0.05)"} onChange={(v) => updateContent("cardBg", v)} label="Background Kartu" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.cardBorder || "rgba(255,255,255,0.1)"} onChange={(v) => updateContent("cardBorder", v)} label="Border Kartu" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.cardTextColor || "#d1d5db"} onChange={(v) => updateContent("cardTextColor", v)} label="Warna Teks Testimonial" /></div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Nama Author</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.authorNameColor || "#ffffff"} onChange={(v) => updateContent("authorNameColor", v)} label="Warna Nama" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Nama</label>
                    <input type="text" value={selectedElement.content.authorNameSize || "14px"} onChange={(e) => updateContent("authorNameSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ketebalan Nama</label>
                    <select value={selectedElement.content.authorNameWeight || "600"} onChange={(e) => updateContent("authorNameWeight", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" style={{ colorScheme: 'dark' }}>
                      {["400","500","600","700","800","900"].map(w => <option key={w} value={w} className="bg-[#1e293b] text-white">{w}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Jabatan</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.authorRoleColor || "#6b7280"} onChange={(v) => updateContent("authorRoleColor", v)} label="Warna Jabatan" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Jabatan</label>
                    <input type="text" value={selectedElement.content.authorRoleSize || "12px"} onChange={(e) => updateContent("authorRoleSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Avatar</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.avatarBg || "rgba(34,197,94,0.2)"} onChange={(v) => updateContent("avatarBg", v)} label="Background Avatar" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.avatarColor || "#22c55e"} onChange={(v) => updateContent("avatarColor", v)} label="Warna Teks Avatar" /></div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Testimonial ({selectedElement.content.items?.length || 0})</label>
                  {selectedElement.content.items?.map((item: any, i: number) => (
                    <div key={i} className="mb-2 p-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">#{i + 1}</span>
                        <button onClick={() => handleRemoveItem("items", i)} className="text-red-400 hover:text-red-300 text-xs">Hapus</button>
                      </div>
                      <textarea value={item.text || ""} onChange={(e) => handleItemChange("items", i, "text", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs resize-none" rows={2} placeholder="Testimonial text" />
                      <input value={item.name || ""} onChange={(e) => handleItemChange("items", i, "name", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Nama" />
                      <input value={item.role || ""} onChange={(e) => handleItemChange("items", i, "role", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Role / Jabatan" />
                    </div>
                  ))}
                  <button onClick={() => handleAddItem("items", { name: "Klien Baru", role: "CEO", text: "Testimonial...", rating: 5, avatar: "KB" })} className="w-full py-1.5 text-xs text-[#22c55e] border border-dashed border-[#22c55e]/30 rounded-lg hover:bg-[#22c55e]/10 transition-colors">+ Tambah Testimonial</button>
                </div>
              </>
            )}

            {/* --- CTA --- */}
            {selectedElement.type === "cta" && (
              <>
                {renderField("Title", "title", "text")}
                {renderField("Subtitle", "subtitle", "text")}
                {renderField("Teks Tombol", "buttonText", "text")}
                {renderField("Link Tombol", "buttonHref", "text")}
                <div className="mb-3 mt-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Judul</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.titleColor || "#ffffff"} onChange={(v) => updateContent("titleColor", v)} label="Warna Judul" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Judul</label>
                    <input type="text" value={selectedElement.content.titleSize || "36px"} onChange={(e) => updateContent("titleSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Subtitle</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.subtitleColor || "rgba(255,255,255,0.8)"} onChange={(v) => updateContent("subtitleColor", v)} label="Warna Subtitle" /></div>                  <div className="mb-2"><FontSizeSlider value={selectedElement.content.subtitleSize || "16px"} onChange={(v) => updateContent("subtitleSize", v)} /></div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Tombol</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.buttonBg || "#ffffff"} onChange={(v) => updateContent("buttonBg", v)} label="Background Tombol" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.buttonTextColor || "#1e293b"} onChange={(v) => updateContent("buttonTextColor", v)} label="Warna Teks Tombol" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Padding Horizontal (px)</label>
                    <input type="text" value={selectedElement.content.buttonPaddingX || "32px"} onChange={(e) => updateContent("buttonPaddingX", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" placeholder="32px" />
                  </div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Padding Vertikal (px)</label>
                    <input type="text" value={selectedElement.content.buttonPaddingY || "16px"} onChange={(e) => updateContent("buttonPaddingY", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" placeholder="16px" />
                  </div>
                </div>
              </>
            )}

            {/* --- STATS --- */}
            {selectedElement.type === "stats" && (
              <>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Angka</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.valueColor || "#22c55e"} onChange={(v) => updateContent("valueColor", v)} label="Warna Angka" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Angka</label>
                    <input type="text" value={selectedElement.content.valueSize || "36px"} onChange={(e) => updateContent("valueSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ketebalan Angka</label>
                    <select value={selectedElement.content.valueWeight || "800"} onChange={(e) => updateContent("valueWeight", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" style={{ colorScheme: 'dark' }}>
                      {["400","500","600","700","800","900"].map(w => <option key={w} value={w} className="bg-[#1e293b] text-white">{w}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Label</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.labelColor || "#94a3b8"} onChange={(v) => updateContent("labelColor", v)} label="Warna Label" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Label</label>
                    <input type="text" value={selectedElement.content.labelSize || "14px"} onChange={(e) => updateContent("labelSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Statistik ({selectedElement.content.items?.length || 0})</label>
                  {selectedElement.content.items?.map((item: any, i: number) => (
                    <div key={i} className="mb-2 p-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">#{i + 1}</span>
                        <button onClick={() => handleRemoveItem("items", i)} className="text-red-400 hover:text-red-300 text-xs">Hapus</button>
                      </div>
                      <input value={item.value || ""} onChange={(e) => handleItemChange("items", i, "value", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Nilai (50+)" />
                      <input value={item.label || ""} onChange={(e) => handleItemChange("items", i, "label", e.target.value)} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Label" />
                    </div>
                  ))}
                  <button onClick={() => handleAddItem("items", { value: "0", label: "Item Baru" })} className="w-full py-1.5 text-xs text-[#22c55e] border border-dashed border-[#22c55e]/30 rounded-lg hover:bg-[#22c55e]/10 transition-colors">+ Tambah Statistik</button>
                </div>
              </>
            )}

            {/* --- CONTACT FORM --- */}
            {selectedElement.type === "contactForm" && (
              <>
                {renderField("Title", "title", "text")}
                {renderField("Subtitle", "subtitle", "text")}
                {renderField("No. WhatsApp", "whatsappNumber", "text")}
                <div className="mb-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <label className="block text-[11px] font-medium text-yellow-400 uppercase tracking-wider mb-1.5">📧 Email Penerima</label>
                  <input
                    type="email"
                    value={selectedElement.content.recipientEmail || ""}
                    onChange={(e) => updateContent("recipientEmail", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50"
                    placeholder="email@anda.com"
                  />
                  <p className="text-[10px] text-yellow-500/70 mt-1">Pesan akan dikirim ke email ini. Dapatkan <strong>Resend API key</strong> di resend.com</p>
                  {renderField("Nama Website", "siteName", "text")}
                </div>
                <div className="mb-3 mt-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Judul</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.titleColor || "#ffffff"} onChange={(v) => updateContent("titleColor", v)} label="Warna Judul" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Judul</label>
                    <input type="text" value={selectedElement.content.titleSize || "30px"} onChange={(e) => updateContent("titleSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Subtitle</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.subtitleColor || "#94a3b8"} onChange={(v) => updateContent("subtitleColor", v)} label="Warna Subtitle" /></div>                  <div className="mb-2"><FontSizeSlider value={selectedElement.content.subtitleSize || "16px"} onChange={(v) => updateContent("subtitleSize", v)} /></div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Input</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.inputBg || "rgba(255,255,255,0.05)"} onChange={(v) => updateContent("inputBg", v)} label="Background Input" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.inputBorder || "rgba(255,255,255,0.1)"} onChange={(v) => updateContent("inputBorder", v)} label="Border Input" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.inputText || "#ffffff"} onChange={(v) => updateContent("inputText", v)} label="Warna Teks Input" /></div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Tombol</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.buttonBg || "#22c55e"} onChange={(v) => updateContent("buttonBg", v)} label="Background Tombol" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.buttonText || "#ffffff"} onChange={(v) => updateContent("buttonText", v)} label="Warna Teks Tombol" /></div>
                </div>
              </>
            )}

            {/* --- MAPS --- */}
            {selectedElement.type === "maps" && (
              <>
                {renderField("Title", "title", "text")}
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Link Google Maps</label>
                  <p className="text-[9px] text-gray-600 mb-1.5">Share dari Google Maps, lalu paste link di sini. Contoh: <code className="text-[#22c55e]">maps.google.com?q=-6.2088,106.8456</code></p>
                  <input
                    type="text"
                    value={selectedElement.content.embedUrl || ""}
                    onChange={(e) => updateContent("embedUrl", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50"
                    placeholder="https://maps.google.com/maps?q=..."
                  />
                </div>
                {renderField("Alamat", "address", "text")}
                <div className="mb-3 mt-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Judul</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.titleColor || "#ffffff"} onChange={(v) => updateContent("titleColor", v)} label="Warna Judul" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Judul</label>
                    <input type="text" value={selectedElement.content.titleSize || "30px"} onChange={(e) => updateContent("titleSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Placeholder</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.cardBg || "rgba(255,255,255,0.05)"} onChange={(v) => updateContent("cardBg", v)} label="Background" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.cardBorder || "rgba(255,255,255,0.1)"} onChange={(v) => updateContent("cardBorder", v)} label="Border" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.addressColor || "#94a3b8"} onChange={(v) => updateContent("addressColor", v)} label="Warna Alamat" /></div>
                </div>
              </>
            )}

            {/* --- NAVBAR --- */}
            {selectedElement.type === "navbar" && (
              <>
                {/* ── LOGO ── */}
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-2 px-1 flex items-center gap-2">
                  <span className="w-4 h-px bg-white/10" />
                  LOGO
                </h4>
                {renderField("Teks Logo", "logo", "text")}
                {renderField("Tinggi (px)", "logoHeight", "text")}
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Warna Teks Logo</label>
                  <ColorPicker value={selectedElement.content.logoColor || "#ffffff"} onChange={(v) => updateContent("logoColor", v)} label="" />
                </div>
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ketebalan Logo</label>
                  <select
                    value={selectedElement.content.logoFontWeight || "700"}
                    onChange={(e) => updateContent("logoFontWeight", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="400" className="bg-[#1e293b] text-white">Normal (400)</option>
                    <option value="500" className="bg-[#1e293b] text-white">Medium (500)</option>
                    <option value="600" className="bg-[#1e293b] text-white">Semi Bold (600)</option>
                    <option value="700" className="bg-[#1e293b] text-white">Bold (700)</option>
                    <option value="800" className="bg-[#1e293b] text-white">Extra Bold (800)</option>
                    <option value="900" className="bg-[#1e293b] text-white">Black (900)</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Posisi Logo</label>
                  <select
                    value={selectedElement.content.logoAlign || "start"}
                    onChange={(e) => updateContent("logoAlign", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="start" className="bg-[#1e293b] text-white">Kiri</option>
                    <option value="center" className="bg-[#1e293b] text-white">Tengah</option>
                    <option value="end" className="bg-[#1e293b] text-white">Kanan</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Upload Logo Gambar</label>
                  {selectedElement.content.logoImage && (
                    <div className="relative mb-2 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                      <img src={selectedElement.content.logoImage} alt="logo preview" className="w-full h-20 object-contain" />
                      <button
                        onClick={() => updateContent("logoImage", "")}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 text-white text-xs flex items-center justify-center hover:bg-red-500"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const url = await compressAndUploadImage(file, user?.id ?? null);
                        updateContent("logoImage", url);
                      } catch {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const dataUrl = ev.target?.result as string;
                          updateContent("logoImage", dataUrl);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#22c55e]/20 file:text-[#22c55e] file:text-xs file:font-medium hover:file:bg-[#22c55e]/30"
                  />
                </div>

                {/* ── MENU ── */}
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4 px-1 flex items-center gap-2">
                  <span className="w-4 h-px bg-white/10" />
                  MENU
                </h4>
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Warna Teks Menu</label>
                  <ColorPicker value={selectedElement.content.menuColor || "#94a3b8"} onChange={(v) => updateContent("menuColor", v)} label="" />
                </div>
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Warna Hover Menu</label>
                  <ColorPicker value={selectedElement.content.menuHoverColor || "#22c55e"} onChange={(v) => updateContent("menuHoverColor", v)} label="" />
                  <p className="text-[9px] text-gray-600 mt-1">Warna saat cursor diarahkan ke menu link + garis underline</p>
                </div>
                <FontSizeSlider
                  value={selectedElement.content.menuFontSize || "14px"}
                  onChange={(v) => updateContent("menuFontSize", v)}
                />
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ketebalan Menu</label>
                  <select
                    value={selectedElement.content.menuFontWeight || "500"}
                    onChange={(e) => updateContent("menuFontWeight", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="300" className="bg-[#1e293b] text-white">Light (300)</option>
                    <option value="400" className="bg-[#1e293b] text-white">Normal (400)</option>
                    <option value="500" className="bg-[#1e293b] text-white">Medium (500)</option>
                    <option value="600" className="bg-[#1e293b] text-white">Semi Bold (600)</option>
                    <option value="700" className="bg-[#1e293b] text-white">Bold (700)</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Posisi Menu</label>
                  <select
                    value={selectedElement.content.menuAlign || "center"}
                    onChange={(e) => updateContent("menuAlign", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="start" className="bg-[#1e293b] text-white">Kiri</option>
                    <option value="center" className="bg-[#1e293b] text-white">Tengah</option>
                    <option value="end" className="bg-[#1e293b] text-white">Kanan</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Menu Links ({selectedElement.content.links?.length || 0})</label>
                  {selectedElement.content.links?.map((link: any, i: number) => (
                    <div key={i} className="flex items-center gap-1 mb-1">
                      <input value={link.label || ""} onChange={(e) => handleItemChange("links", i, "label", e.target.value)} className="flex-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Label" />
                      <input value={link.href || ""} onChange={(e) => handleItemChange("links", i, "href", e.target.value)} className="flex-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="/link" />
                      <button onClick={() => handleRemoveLink(i)} className="text-red-400 hover:text-red-300 text-xs px-1">×</button>
                    </div>
                  ))}
                  <button onClick={handleAddLink} className="w-full py-1 text-xs text-[#22c55e] border border-dashed border-[#22c55e]/30 rounded-lg hover:bg-[#22c55e]/10 transition-colors">+ Tambah Link</button>
                </div>

                {/* ── CTA ── */}
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4 px-1 flex items-center gap-2">
                  <span className="w-4 h-px bg-white/10" />
                  CTA BUTTON
                </h4>
                {renderField("Teks CTA", "ctaText", "text")}
                {renderField("Link CTA", "ctaHref", "text")}
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Warna Background CTA</label>
                  <ColorPicker value={selectedElement.content.ctaBgColor || "#22c55e"} onChange={(v) => updateContent("ctaBgColor", v)} label="" />
                </div>
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Warna Teks CTA</label>
                  <ColorPicker value={selectedElement.content.ctaColor || "#ffffff"} onChange={(v) => updateContent("ctaColor", v)} label="" />
                </div>
                <FontSizeSlider
                  value={selectedElement.content.ctaFontSize || "14px"}
                  onChange={(v) => updateContent("ctaFontSize", v)}
                />
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ketebalan CTA</label>
                  <select
                    value={selectedElement.content.ctaFontWeight || "600"}
                    onChange={(e) => updateContent("ctaFontWeight", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="400" className="bg-[#1e293b] text-white">Normal (400)</option>
                    <option value="500" className="bg-[#1e293b] text-white">Medium (500)</option>
                    <option value="600" className="bg-[#1e293b] text-white">Semi Bold (600)</option>
                    <option value="700" className="bg-[#1e293b] text-white">Bold (700)</option>
                    <option value="800" className="bg-[#1e293b] text-white">Extra Bold (800)</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Posisi CTA</label>
                  <select
                    value={selectedElement.content.ctaAlign || "end"}
                    onChange={(e) => updateContent("ctaAlign", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="start" className="bg-[#1e293b] text-white">Kiri</option>
                    <option value="center" className="bg-[#1e293b] text-white">Tengah</option>
                    <option value="end" className="bg-[#1e293b] text-white">Kanan</option>
                  </select>
                </div>
              </>
            )}

            {/* --- FOOTER --- */}
            {selectedElement.type === "footer" && (
              <>
                {/* ── LOGO ── */}
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-2 px-1 flex items-center gap-2">
                  <span className="w-4 h-px bg-white/10" />
                  LOGO
                </h4>
                {renderField("Logo / Brand", "logo", "text")}
                {renderField("Tinggi Logo (px)", "logoHeight", "text")}
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Upload Logo Gambar</label>
                  {selectedElement.content.logoImage && (
                    <div className="relative mb-2 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                      <img src={selectedElement.content.logoImage} alt="logo preview" className="w-full h-20 object-contain" />
                      <button
                        onClick={() => updateContent("logoImage", "")}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 text-white text-xs flex items-center justify-center hover:bg-red-500"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const url = await compressAndUploadImage(file, user?.id ?? null);
                        updateContent("logoImage", url);
                      } catch {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const dataUrl = ev.target?.result as string;
                          updateContent("logoImage", dataUrl);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#22c55e]/20 file:text-[#22c55e] file:text-xs file:font-medium hover:file:bg-[#22c55e]/30"
                  />
                </div>
                <div className="mb-2"><ColorPicker value={selectedElement.content.logoColor || "#ffffff"} onChange={(v) => updateContent("logoColor", v)} label="Warna Logo" /></div>
                <div className="mb-2">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Logo</label>
                  <input type="text" value={selectedElement.content.logoFontSize || "20px"} onChange={(e) => updateContent("logoFontSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                </div>
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ketebalan Logo</label>
                  <select
                    value={selectedElement.content.logoFontWeight || "700"}
                    onChange={(e) => updateContent("logoFontWeight", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="400" className="bg-[#1e293b] text-white">Normal (400)</option>
                    <option value="500" className="bg-[#1e293b] text-white">Medium (500)</option>
                    <option value="600" className="bg-[#1e293b] text-white">Semi Bold (600)</option>
                    <option value="700" className="bg-[#1e293b] text-white">Bold (700)</option>
                    <option value="800" className="bg-[#1e293b] text-white">Extra Bold (800)</option>
                  </select>
                </div>

                {/* ── DESKRIPSI ── */}
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4 px-1 flex items-center gap-2">
                  <span className="w-4 h-px bg-white/10" />
                  DESKRIPSI
                </h4>
                {renderField("Deskripsi", "description", "textarea")}
                <div className="mb-2"><ColorPicker value={selectedElement.content.descColor || "#6b7280"} onChange={(v) => updateContent("descColor", v)} label="Warna Deskripsi" /></div>
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Deskripsi</label>
                  <input type="text" value={selectedElement.content.descSize || "14px"} onChange={(e) => updateContent("descSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                </div>

                {/* ── LINKS ── */}
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4 px-1 flex items-center gap-2">
                  <span className="w-4 h-px bg-white/10" />
                  MENU LINKS
                </h4>
                <div className="mb-2">{renderField("Judul Links", "linksHeading", "text")}</div>
                <div className="mb-2"><ColorPicker value={selectedElement.content.linkHeadingColor || "#9ca3af"} onChange={(v) => updateContent("linkHeadingColor", v)} label="Warna Judul Links" /></div>
                <div className="mb-2">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Judul Links</label>
                  <input type="text" value={selectedElement.content.linkHeadingSize || "12px"} onChange={(e) => updateContent("linkHeadingSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                </div>
                <div className="mb-2"><ColorPicker value={selectedElement.content.linkColor || "#6b7280"} onChange={(v) => updateContent("linkColor", v)} label="Warna Link" /></div>
                <div className="mb-2"><ColorPicker value={selectedElement.content.linkHoverColor || "#ffffff"} onChange={(v) => updateContent("linkHoverColor", v)} label="Warna Hover Link" /></div>
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Link</label>
                  <input type="text" value={selectedElement.content.linkSize || "14px"} onChange={(e) => updateContent("linkSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                </div>
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Footer Links ({selectedElement.content.links?.length || 0})</label>
                  {selectedElement.content.links?.map((link: any, i: number) => (
                    <div key={i} className="flex items-center gap-1 mb-1">
                      <input value={link.label || ""} onChange={(e) => handleItemChange("links", i, "label", e.target.value)} className="flex-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Label" />
                      <input value={link.href || ""} onChange={(e) => handleItemChange("links", i, "href", e.target.value)} className="flex-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="/link" />
                      <button onClick={() => handleRemoveLink(i)} className="text-red-400 hover:text-red-300 text-xs px-1">×</button>
                    </div>
                  ))}
                  <button onClick={handleAddLink} className="w-full py-1 text-xs text-[#22c55e] border border-dashed border-[#22c55e]/30 rounded-lg hover:bg-[#22c55e]/10 transition-colors">+ Tambah Link</button>
                </div>

                {/* ── SOSIAL MEDIA ── */}
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4 px-1 flex items-center gap-2">
                  <span className="w-4 h-px bg-white/10" />
                  SOSIAL MEDIA
                </h4>
                <div className="mb-2"><ColorPicker value={selectedElement.content.socialIconBg || "rgba(255,255,255,0.05)"} onChange={(v) => updateContent("socialIconBg", v)} label="Background Ikon" /></div>
                <div className="mb-2"><ColorPicker value={selectedElement.content.socialIconBorder || "rgba(255,255,255,0.1)"} onChange={(v) => updateContent("socialIconBorder", v)} label="Border Ikon" /></div>
                <div className="mb-2"><ColorPicker value={selectedElement.content.socialIconColor || "#9ca3af"} onChange={(v) => updateContent("socialIconColor", v)} label="Warna Ikon" /></div>
                <div className="mb-2"><ColorPicker value={selectedElement.content.socialIconHoverColor || "#22c55e"} onChange={(v) => updateContent("socialIconHoverColor", v)} label="Warna Hover Ikon" /></div>
                <div className="mb-3"><ColorPicker value={selectedElement.content.socialIconHoverBorder || "rgba(34,197,94,0.4)"} onChange={(v) => updateContent("socialIconHoverBorder", v)} label="Border Hover Ikon" /></div>
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Sosial Media ({selectedElement.content.socials?.length || 0})</label>
                  {selectedElement.content.socials?.map((s: any, i: number) => (
                    <div key={i} className="flex items-center gap-1 mb-1">
                      <select
                        value={s.platform || "instagram"}
                        onChange={(e) => handleItemChange("socials", i, "platform", e.target.value)}
                        className="flex-[0.4] px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#22c55e]/50"
                        style={{ colorScheme: 'dark' }}
                      >
                        {SOCIAL_PLATFORMS.map((p) => (
                          <option key={p.value} value={p.value} className="bg-[#1e293b] text-white">
                            {p.label}
                          </option>
                        ))}
                      </select>
                      <input
                        value={s.url || ""}
                        onChange={(e) => handleItemChange("socials", i, "url", e.target.value)}
                        className="flex-[0.6] px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs"
                        placeholder="https://..."
                      />
                      <button onClick={() => {
                        const items = [...(selectedElement.content.socials || [])];
                        items.splice(i, 1);
                        updateContent("socials", items);
                      }} className="text-red-400 hover:text-red-300 text-xs px-1">×</button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const items = [...(selectedElement.content.socials || []), { platform: "instagram", url: "#" }];
                      updateContent("socials", items);
                    }}
                    className="w-full py-1 text-xs text-[#22c55e] border border-dashed border-[#22c55e]/30 rounded-lg hover:bg-[#22c55e]/10 transition-colors"
                  >
                    + Tambah Sosial Media
                  </button>
                </div>

                {/* ── COPYRIGHT ── */}
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4 px-1 flex items-center gap-2">
                  <span className="w-4 h-px bg-white/10" />
                  COPYRIGHT
                </h4>
                {renderField("Copyright", "copyright", "text")}
                <div className="mb-2"><ColorPicker value={selectedElement.content.copyrightColor || "#4b5563"} onChange={(v) => updateContent("copyrightColor", v)} label="Warna Copyright" /></div>
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Copyright</label>
                  <input type="text" value={selectedElement.content.copyrightSize || "14px"} onChange={(e) => updateContent("copyrightSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                </div>
              </>
            )}

            {/* --- CAROUSEL --- */}
            {selectedElement.type === "carousel" && (
              <>
                {renderField("Judul Section", "title", "text")}
                {renderField("Subtitle", "subtitle", "text")}
                <div className="mb-3 mt-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Judul</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.titleColor || "#ffffff"} onChange={(v) => updateContent("titleColor", v)} label="Warna Judul" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Judul</label>
                    <input type="text" value={selectedElement.content.titleSize || "30px"} onChange={(e) => updateContent("titleSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Subtitle</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.subtitleColor || "#94a3b8"} onChange={(v) => updateContent("subtitleColor", v)} label="Warna Subtitle" /></div>                  <div className="mb-2"><FontSizeSlider value={selectedElement.content.subtitleSize || "16px"} onChange={(v) => updateContent("subtitleSize", v)} /></div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Carousel</h4>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Tinggi (px)</label>
                    <input type="text" value={selectedElement.content.height || "400px"} onChange={(e) => updateContent("height", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.dotColor || "rgba(255,255,255,0.3)"} onChange={(v) => updateContent("dotColor", v)} label="Warna Dot" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.dotActiveColor || "#22c55e"} onChange={(v) => updateContent("dotActiveColor", v)} label="Warna Dot Aktif" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.arrowColor || "#ffffff"} onChange={(v) => updateContent("arrowColor", v)} label="Warna Panah" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.arrowBg || "rgba(0,0,0,0.3)"} onChange={(v) => updateContent("arrowBg", v)} label="Background Panah" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.captionColor || "#ffffff"} onChange={(v) => updateContent("captionColor", v)} label="Warna Caption" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Caption</label>
                    <input type="text" value={selectedElement.content.captionSize || "14px"} onChange={(e) => updateContent("captionSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                  <label className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      checked={selectedElement.content.autoPlay !== false}
                      onChange={(e) => updateContent("autoPlay", e.target.checked)}
                      className="rounded bg-white/5 border-white/20"
                    />
                    <span className="text-xs text-gray-400">Auto Play</span>
                  </label>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Slides ({selectedElement.content.slides?.length || 0})</label>
                  {selectedElement.content.slides?.map((slide: any, i: number) => (
                    <div key={i} className="mb-2 p-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Slide #{i + 1}</span>
                        <button onClick={() => {
                          const items = [...(selectedElement.content.slides || [])];
                          items.splice(i, 1);
                          updateContent("slides", items);
                        }} className="text-red-400 hover:text-red-300 text-xs">Hapus</button>
                      </div>
                      {slide.image && (
                        <div className="relative mb-2 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                          <img src={slide.image} alt="" className="w-full h-24 object-cover" />
                          <button
                            onClick={() => handleItemChange("slides", i, "image", "")}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 text-white text-xs flex items-center justify-center hover:bg-red-500"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const url = await compressAndUploadImage(file, user?.id ?? null);
                            handleItemChange("slides", i, "image", url);
                          } catch {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const dataUrl = ev.target?.result as string;
                              handleItemChange("slides", i, "image", dataUrl);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full mb-1 text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#22c55e]/20 file:text-[#22c55e] file:text-xs file:font-medium hover:file:bg-[#22c55e]/30"
                      />
                      <input value={slide.caption || ""} onChange={(e) => handleItemChange("slides", i, "caption", e.target.value)} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Caption" />
                    </div>
                  ))}
                  <button onClick={() => handleAddItem("slides", { image: "https://placehold.co/800x500/1e293b/64748b?text=Slide+Baru", caption: "Slide Baru" })} className="w-full py-1.5 text-xs text-[#22c55e] border border-dashed border-[#22c55e]/30 rounded-lg hover:bg-[#22c55e]/10 transition-colors">+ Tambah Slide</button>
                </div>
              </>
            )}

            {/* --- ACCORDION --- */}
            {selectedElement.type === "accordion" && (
              <>
                {renderField("Judul Section", "title", "text")}
                {renderField("Subtitle", "subtitle", "text")}
                <div className="mb-3 mt-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Judul</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.titleColor || "#ffffff"} onChange={(v) => updateContent("titleColor", v)} label="Warna Judul" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Judul</label>
                    <input type="text" value={selectedElement.content.titleSize || "30px"} onChange={(e) => updateContent("titleSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Subtitle</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.subtitleColor || "#94a3b8"} onChange={(v) => updateContent("subtitleColor", v)} label="Warna Subtitle" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Subtitle</label>
                    <input type="text" value={selectedElement.content.subtitleSize || "16px"} onChange={(e) => updateContent("subtitleSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Item</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.itemBg || "rgba(255,255,255,0.05)"} onChange={(v) => updateContent("itemBg", v)} label="Background Item" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.itemBorder || "rgba(255,255,255,0.1)"} onChange={(v) => updateContent("itemBorder", v)} label="Border Item" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.questionColor || "#ffffff"} onChange={(v) => updateContent("questionColor", v)} label="Warna Pertanyaan" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Pertanyaan</label>
                    <input type="text" value={selectedElement.content.questionSize || "16px"} onChange={(e) => updateContent("questionSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ketebalan Pertanyaan</label>
                    <select value={selectedElement.content.questionWeight || "600"} onChange={(e) => updateContent("questionWeight", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" style={{ colorScheme: 'dark' }}>
                      {["400","500","600","700","800","900"].map(w => <option key={w} value={w} className="bg-[#1e293b] text-white">{w}</option>)}
                    </select>
                  </div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.answerColor || "#94a3b8"} onChange={(v) => updateContent("answerColor", v)} label="Warna Jawaban" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Jawaban</label>
                    <input type="text" value={selectedElement.content.answerSize || "14px"} onChange={(e) => updateContent("answerSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.iconColor || "#22c55e"} onChange={(v) => updateContent("iconColor", v)} label="Warna Ikon +/−" /></div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Items ({selectedElement.content.items?.length || 0})</label>
                  {selectedElement.content.items?.map((item: any, i: number) => (
                    <div key={i} className="mb-2 p-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">#{i + 1}</span>
                        <button onClick={() => handleRemoveItem("items", i)} className="text-red-400 hover:text-red-300 text-xs">Hapus</button>
                      </div>
                      <input value={item.question || ""} onChange={(e) => handleItemChange("items", i, "question", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Pertanyaan" />
                      <textarea value={item.answer || ""} onChange={(e) => handleItemChange("items", i, "answer", e.target.value)} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs resize-none" rows={2} placeholder="Jawaban" />
                    </div>
                  ))}
                  <button onClick={() => handleAddItem("items", { question: "Pertanyaan Baru?", answer: "Jawaban dari pertanyaan" })} className="w-full py-1.5 text-xs text-[#22c55e] border border-dashed border-[#22c55e]/30 rounded-lg hover:bg-[#22c55e]/10 transition-colors">+ Tambah Item</button>
                </div>
              </>
            )}

            {/* --- TEAM --- */}
            {selectedElement.type === "team" && (
              <>
                {renderField("Judul Section", "title", "text")}
                {renderField("Subtitle", "subtitle", "text")}
                <div className="mb-3 mt-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Judul</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.titleColor || "#ffffff"} onChange={(v) => updateContent("titleColor", v)} label="Warna Judul" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Judul</label>
                    <input type="text" value={selectedElement.content.titleSize || "30px"} onChange={(e) => updateContent("titleSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Subtitle</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.subtitleColor || "#94a3b8"} onChange={(v) => updateContent("subtitleColor", v)} label="Warna Subtitle" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Subtitle</label>
                    <input type="text" value={selectedElement.content.subtitleSize || "16px"} onChange={(e) => updateContent("subtitleSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Kartu</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.cardBg || "rgba(255,255,255,0.05)"} onChange={(v) => updateContent("cardBg", v)} label="Background Kartu" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.cardBorder || "rgba(255,255,255,0.1)"} onChange={(v) => updateContent("cardBorder", v)} label="Border Kartu" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Avatar</label>
                    <input type="text" value={selectedElement.content.avatarSize || "120px"} onChange={(e) => updateContent("avatarSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Nama</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.nameColor || "#ffffff"} onChange={(v) => updateContent("nameColor", v)} label="Warna Nama" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Nama</label>
                    <input type="text" value={selectedElement.content.nameSize || "18px"} onChange={(e) => updateContent("nameSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ketebalan Nama</label>
                    <select value={selectedElement.content.nameWeight || "700"} onChange={(e) => updateContent("nameWeight", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" style={{ colorScheme: 'dark' }}>
                      {["400","500","600","700","800","900"].map(w => <option key={w} value={w} className="bg-[#1e293b] text-white">{w}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Jabatan</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.roleColor || "#94a3b8"} onChange={(v) => updateContent("roleColor", v)} label="Warna Jabatan" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Jabatan</label>
                    <input type="text" value={selectedElement.content.roleSize || "14px"} onChange={(e) => updateContent("roleSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Sosial Media</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.socialIconColor || "#64748b"} onChange={(v) => updateContent("socialIconColor", v)} label="Warna Ikon" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.socialIconHoverColor || "#22c55e"} onChange={(v) => updateContent("socialIconHoverColor", v)} label="Warna Hover Ikon" /></div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Anggota Tim ({selectedElement.content.members?.length || 0})</label>
                  {selectedElement.content.members?.map((member: any, i: number) => (
                    <div key={i} className="mb-2 p-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">#{i + 1}</span>
                        <button onClick={() => {
                          const items = [...(selectedElement.content.members || [])];
                          items.splice(i, 1);
                          updateContent("members", items);
                        }} className="text-red-400 hover:text-red-300 text-xs">Hapus</button>
                      </div>
                      <input value={member.name || ""} onChange={(e) => handleItemChange("members", i, "name", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Nama" />
                      <input value={member.role || ""} onChange={(e) => handleItemChange("members", i, "role", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Jabatan" />
                      {member.image && (
                        <div className="relative mb-2 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                          <img src={member.image} alt="" className="w-full h-24 object-cover" />
                          <button
                            onClick={() => handleItemChange("members", i, "image", "")}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 text-white text-xs flex items-center justify-center hover:bg-red-500"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const url = await compressAndUploadImage(file, user?.id ?? null);
                            handleItemChange("members", i, "image", url);
                          } catch {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const dataUrl = ev.target?.result as string;
                              handleItemChange("members", i, "image", dataUrl);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full mb-1 text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#22c55e]/20 file:text-[#22c55e] file:text-xs file:font-medium hover:file:bg-[#22c55e]/30"
                      />
                      <div className="mb-1">
                        <label className="text-[9px] text-gray-600 block mb-0.5">Sosial Media</label>
                        {(Array.isArray(member.socials) ? member.socials : []).map((s: any, si: number) => (
                          <div key={si} className="flex items-center gap-1 mb-0.5">
                            <select
                              value={(s && s.platform) || "instagram"}
                              onChange={(e) => {
                                const items = [...(Array.isArray(member.socials) ? member.socials : [])];
                                items[si] = { ...items[si], platform: e.target.value };
                                handleItemChange("members", i, "socials", items);
                              }}
                              className="flex-[0.4] px-1.5 py-1 rounded bg-white/5 border border-white/10 text-white text-[10px] focus:outline-none focus:border-[#22c55e]/50"
                              style={{ colorScheme: "dark" }}
                            >
                              {SOCIAL_PLATFORMS.map((p) => (
                                <option key={p.value} value={p.value} className="bg-[#1e293b] text-white">
                                  {p.label}
                                </option>
                              ))}
                            </select>
                            <input
                              value={(s && s.url) || ""}
                              onChange={(e) => {
                                const items = [...(Array.isArray(member.socials) ? member.socials : [])];
                                items[si] = { ...items[si], url: e.target.value };
                                handleItemChange("members", i, "socials", items);
                              }}
                              className="flex-[0.6] px-1.5 py-1 rounded bg-white/5 border border-white/10 text-white text-[10px]"
                              placeholder="https://..."
                            />
                            <button onClick={() => {
                              const items = [...(Array.isArray(member.socials) ? member.socials : [])];
                              items.splice(si, 1);
                              handleItemChange("members", i, "socials", items);
                            }} className="text-red-400 hover:text-red-300 text-[10px] px-1">&times;</button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const items = [...(Array.isArray(member.socials) ? member.socials : []), { platform: "instagram", url: "#" }];
                            handleItemChange("members", i, "socials", items);
                          }}
                          className="w-full py-0.5 text-[10px] text-[#22c55e] border border-dashed border-[#22c55e]/30 rounded hover:bg-[#22c55e]/10 transition-colors mt-0.5"
                        >
                          + Tambah
                        </button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => handleAddItem("members", { name: "Anggota Baru", role: "Jabatan", image: "https://placehold.co/200x200/1e293b/64748b?text=Team", socials: [{ platform: "instagram", url: "#" }] })} className="w-full py-1.5 text-xs text-[#22c55e] border border-dashed border-[#22c55e]/30 rounded-lg hover:bg-[#22c55e]/10 transition-colors">+ Tambah Anggota</button>
                </div>
              </>
            )}

            {/* --- COUNTDOWN --- */}
            {selectedElement.type === "countdown" && (
              <>
                {renderField("Judul Section", "title", "text")}

          
                {renderField("Subtitle", "subtitle", "text")}
                <div className="mb-3 mt-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Judul</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.titleColor || "#ffffff"} onChange={(v) => updateContent("titleColor", v)} label="Warna Judul" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Judul</label>
                    <input type="text" value={selectedElement.content.titleSize || "30px"} onChange={(e) => updateContent("titleSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Subtitle</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.subtitleColor || "#94a3b8"} onChange={(v) => updateContent("subtitleColor", v)} label="Warna Subtitle" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Subtitle</label>
                    <input type="text" value={selectedElement.content.subtitleSize || "16px"} onChange={(e) => updateContent("subtitleSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Target</h4>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Tanggal Target</label>
                    <input
                      type="date"
                      value={selectedElement.content.targetDate || ""}
                      onChange={(e) => updateContent("targetDate", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="mb-2">{renderField("Label Hari", "labelDays", "text")}</div>
                    <div className="mb-2">{renderField("Label Jam", "labelHours", "text")}</div>
                    <div className="mb-2">{renderField("Label Menit", "labelMinutes", "text")}</div>
                    <div className="mb-2">{renderField("Label Detik", "labelSeconds", "text")}</div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Angka</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.numberColor || "#22c55e"} onChange={(v) => updateContent("numberColor", v)} label="Warna Angka" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Angka</label>
                    <input type="text" value={selectedElement.content.numberSize || "48px"} onChange={(e) => updateContent("numberSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ketebalan Angka</label>
                    <select value={selectedElement.content.numberWeight || "800"} onChange={(e) => updateContent("numberWeight", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" style={{ colorScheme: 'dark' }}>
                      {["400","500","600","700","800","900"].map(w => <option key={w} value={w} className="bg-[#1e293b] text-white">{w}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Label</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.labelColor || "#94a3b8"} onChange={(v) => updateContent("labelColor", v)} label="Warna Label" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Label</label>
                    <input type="text" value={selectedElement.content.labelSize || "14px"} onChange={(e) => updateContent("labelSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Kotak</h4>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.boxBg || "rgba(255,255,255,0.05)"} onChange={(v) => updateContent("boxBg", v)} label="Background Kotak" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.boxBorder || "rgba(255,255,255,0.1)"} onChange={(v) => updateContent("boxBorder", v)} label="Border Kotak" /></div>
                  <div className="mb-2"><ColorPicker value={selectedElement.content.separatorColor || "rgba(255,255,255,0.1)"} onChange={(v) => updateContent("separatorColor", v)} label="Warna Separator (:)" /></div>
                </div>
              </>
            )}
            {/* --- PREMIUM ELEMENTS --- */}
          {selectedElement.type === "animated-headline" && <AnimatedHeadlineEditor element={selectedElement} updateContent={updateContent} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} userId={user?.id ?? null} />}
          {selectedElement.type === "blockquote" && <BlockquoteEditor element={selectedElement} updateContent={updateContent} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} userId={user?.id ?? null} />}
          {selectedElement.type === "code-highlight" && <CodeHighlightEditor element={selectedElement} updateContent={updateContent} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} userId={user?.id ?? null} />}
          {selectedElement.type === "flip-box" && <FlipBoxEditor element={selectedElement} updateContent={updateContent} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} userId={user?.id ?? null} />}
          {selectedElement.type === "hotspot" && <HotspotEditor element={selectedElement} updateContent={updateContent} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} userId={user?.id ?? null} />}
          {selectedElement.type === "progress-tracker" && <ProgressTrackerEditor element={selectedElement} updateContent={updateContent} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} userId={user?.id ?? null} />}
          {selectedElement.type === "share-buttons" && <ShareButtonsEditor element={selectedElement} updateContent={updateContent} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} userId={user?.id ?? null} />}
          {selectedElement.type === "checklist" && <ChecklistEditor element={selectedElement} updateContent={updateContent} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} userId={user?.id ?? null} />}
          {selectedElement.type === "gallery" && <GalleryEditor element={selectedElement} updateContent={updateContent} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} userId={user?.id ?? null} />}
          {selectedElement.type === "lottie" && <LottieEditor element={selectedElement} updateContent={updateContent} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} userId={user?.id ?? null} />}
          {selectedElement.type === "star-rating" && <StarRatingEditor element={selectedElement} updateContent={updateContent} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} userId={user?.id ?? null} />}
          {selectedElement.type === "search" && <SearchEditor element={selectedElement} updateContent={updateContent} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} userId={user?.id ?? null} />}
          {selectedElement.type === "floating-buttons" && <FloatingButtonsEditor element={selectedElement} updateContent={updateContent} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} userId={user?.id ?? null} />}
          {selectedElement.type === "breadcrumbs" && <BreadcrumbsEditor element={selectedElement} updateContent={updateContent} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} userId={user?.id ?? null} />}
          {selectedElement.type === "off-canvas" && <OffCanvasEditor element={selectedElement} updateContent={updateContent} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} userId={user?.id ?? null} />}
          {selectedElement.type === "slides" && <SlidesEditor element={selectedElement} updateContent={updateContent} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} userId={user?.id ?? null} />}
          {selectedElement.type === "nested-carousel" && <NestedCarouselEditor element={selectedElement} updateContent={updateContent} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} userId={user?.id ?? null} />}
          {selectedElement.type === "video-playlist" && <VideoPlaylistEditor element={selectedElement} updateContent={updateContent} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} userId={user?.id ?? null} />}
          {selectedElement.type === "table-of-contents" && <TableOfContentsEditor element={selectedElement} updateContent={updateContent} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} userId={user?.id ?? null} />}
          {selectedElement.type === "social-embed" && <SocialEmbedEditor element={selectedElement} updateContent={updateContent} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} userId={user?.id ?? null} />}
          </div>
        ) : (
          <div>
            <p className="text-[10px] text-gray-600 mb-3">Style di bawah akan diterapkan ke element ini</p>
            
            {/* ALIGNMENT - for ALL elements (no label inside to avoid double text) */}
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">Alignment</h4>
              <select
                value={selectedElement.styles.textAlign ?? ""}
                onChange={(e) => updateStyle("textAlign", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50"
                style={{ colorScheme: 'dark' }}
              >
                <option value="" className="bg-[#1e293b] text-white">Default</option>
                <option value="left" className="bg-[#1e293b] text-white">Left</option>
                <option value="center" className="bg-[#1e293b] text-white">Center</option>
                <option value="right" className="bg-[#1e293b] text-white">Right</option>
              </select>
            </div>

            {/* OBJECT FIT - only for image */}
            {selectedElement.type === "image" && <div className="mb-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">Object Fit</h4>
              <select
                value={selectedElement.styles.objectFit ?? ""}
                onChange={(e) => updateStyle("objectFit", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50"
                style={{ colorScheme: 'dark' }}
              >
                <option value="" className="bg-[#1e293b] text-white">Default (cover)</option>
                <option value="cover" className="bg-[#1e293b] text-white">Cover</option>
                <option value="contain" className="bg-[#1e293b] text-white">Contain</option>
                <option value="fill" className="bg-[#1e293b] text-white">Fill</option>
                <option value="none" className="bg-[#1e293b] text-white">None</option>
              </select>
            </div>}

            {/* OPACITY - for image and video */}
            {["image", "video"].includes(selectedElement.type) && renderSection("Opacity", <>
              {(() => {
                const val = selectedElement.styles.opacity ?? "";
                const match = val?.match(/^([\d.]+)/) || [];
                const num = parseFloat(match[1]) * 100 || 100;
                return (
                  <div className="mb-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={Math.round(num)}
                        onChange={(e) => updateStyle("opacity", `${parseInt(e.target.value) / 100}`)}
                        className="flex-1 h-1.5 rounded-full appearance-none bg-white/10 cursor-pointer accent-[#22c55e]"
                      />
                      <input
                        type="text"
                        value={val || "1"}
                        onChange={(e) => updateStyle("opacity", e.target.value)}
                        className="w-14 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs text-center focus:outline-none focus:border-[#22c55e]/50 font-mono"
                        placeholder="1"
                      />
                    </div>
                  </div>
                );
              })()}
            </>)}

            {/* TEKS - only for text-containing elements */}
            {!["image", "video", "spacer", "divider", "icon"].includes(selectedElement.type) && renderSection("Teks", <>
              {renderStyleField("Warna Teks", "color", "color")}
              <FontSizeSlider
                value={selectedElement.styles.fontSize ?? ""}
                onChange={(v) => updateStyle("fontSize", v)}
              />
              {renderStyleField("Font Weight", "fontWeight", "select", ["100", "200", "300", "400", "500", "600", "700", "800", "900"])}
              {(() => {
                const val = selectedElement.styles.fontFamily ?? "";
                return (
                  <div className="mb-3">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Font Family</label>
                    <select
                      value={val}
                      onChange={(e) => updateStyle("fontFamily", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="" className="bg-[#1e293b] text-white">Default</option>
                      {fontOptions.map((f) => (
                        <option key={f.value} value={f.value} className="bg-[#1e293b] text-white">{f.label}</option>
                      ))}
                    </select>
                  </div>
                );
              })()}
            </>)}

            {renderSection("Background", <>
              {renderStyleField("Warna Background", "backgroundColor", "color")}
              {/* Background Opacity */}
              {(() => {
                const val = selectedElement.styles.backgroundOpacity ?? "";
                const num = parseFloat(val) * 100 || 100;
                return (
                  <div className="mb-3">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Opacity Background ({Math.round(num)}%)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={Math.round(num)}
                        onChange={(e) => updateStyle("backgroundOpacity", `${Math.round(parseInt(e.target.value)) / 100}`)}
                        className="flex-1 h-1.5 rounded-full appearance-none bg-white/10 cursor-pointer accent-[#22c55e]"
                      />
                      <input
                        type="text"
                        value={val || "1"}
                        onChange={(e) => updateStyle("backgroundOpacity", e.target.value)}
                        className="w-14 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs text-center focus:outline-none focus:border-[#22c55e]/50 font-mono"
                        placeholder="1"
                      />
                    </div>
                  </div>
                );
              })()}
              <div className="mb-3">
                <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Background Image / Gradient</label>
                <input
                  type="text"
                  value={selectedElement.styles.backgroundImage ?? ""}
                  onChange={(e) => updateStyle("backgroundImage", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50 font-mono text-xs"
                  placeholder="url(...) atau linear-gradient(...)"
                />
                <div className="mt-1">
                  <label className="block text-[10px] text-gray-600 mb-1">Upload Gambar Background</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const url = await compressAndUploadImage(file, user?.id ?? null);
                        updateStyle("backgroundImage", `url("${url}")`);
                      } catch {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const dataUrl = ev.target?.result as string;
                          updateStyle("backgroundImage", `url("${dataUrl}")`);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full text-xs text-gray-400 file:mr-3 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-[#22c55e]/20 file:text-[#22c55e] file:text-[10px] file:font-medium hover:file:bg-[#22c55e]/30"
                  />
                </div>
                {/* Background Size */}
                <div className="flex items-center gap-2 mt-2 mb-1">
                  <label className="block text-[10px] text-gray-600 flex-shrink-0">Ukuran:</label>
                  <select
                    value={selectedElement.styles.backgroundSize ?? ""}
                    onChange={(e) => updateStyle("backgroundSize", e.target.value)}
                    className="flex-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#22c55e]/50"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="" className="bg-[#1e293b] text-white">Default</option>
                    <option value="cover" className="bg-[#1e293b] text-white">Cover</option>
                    <option value="contain" className="bg-[#1e293b] text-white">Contain</option>
                    <option value="auto" className="bg-[#1e293b] text-white">Auto</option>
                  </select>
                </div>
                {/* Background Position */}
                <div className="flex items-center gap-2 mb-2">
                  <label className="block text-[10px] text-gray-600 flex-shrink-0">Posisi:</label>
                  <input
                    type="text"
                    value={selectedElement.styles.backgroundPosition ?? ""}
                    onChange={(e) => updateStyle("backgroundPosition", e.target.value)}
                    className="flex-1 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#22c55e]/50"
                    placeholder="center"
                  />
                </div>
                <div className="mt-2">
                  <div className="h-px bg-white/10 mb-3" />
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Gradient Builder</label>
                  <GradientBuilder
                    value={selectedElement.styles.backgroundImage ?? ""}
                    onChange={(v) => updateStyle("backgroundImage", v)}
                  />
                </div>
              </div>
            </>)}

            {renderSection("Padding", <>
              {renderSpacingFields("Padding", { top: "paddingTop", bottom: "paddingBottom", left: "paddingLeft", right: "paddingRight" })}
            </>)}

            {renderSection("Margin", <>
              {renderSpacingFields("Margin", { top: "marginTop", bottom: "marginBottom", left: "marginLeft", right: "marginRight" })}
            </>)}

            {renderSection("Border Radius", <>
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <span className="text-[9px] text-gray-600 block mb-0.5">Top-Left</span>
                  <input
                    type="text"
                    value={selectedElement.styles.borderTopLeftRadius ?? ""}
                    onChange={(e) => updateStyle("borderTopLeftRadius", e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#22c55e]/50"
                    placeholder="0px"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-gray-600 block mb-0.5">Top-Right</span>
                  <input
                    type="text"
                    value={selectedElement.styles.borderTopRightRadius ?? ""}
                    onChange={(e) => updateStyle("borderTopRightRadius", e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#22c55e]/50"
                    placeholder="0px"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-gray-600 block mb-0.5">Bottom-Left</span>
                  <input
                    type="text"
                    value={selectedElement.styles.borderBottomLeftRadius ?? ""}
                    onChange={(e) => updateStyle("borderBottomLeftRadius", e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#22c55e]/50"
                    placeholder="0px"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-gray-600 block mb-0.5">Bottom-Right</span>
                  <input
                    type="text"
                    value={selectedElement.styles.borderBottomRightRadius ?? ""}
                    onChange={(e) => updateStyle("borderBottomRightRadius", e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#22c55e]/50"
                    placeholder="0px"
                  />
                </div>
              </div>
            </>)}

            {renderSection("Lainnya", <>
              {renderStyleField("Width", "width", "text")}
              {renderStyleField("Height", "height", "text")}
            </>)}
          </div>
        )}
      </div>
    </aside>
  );
}
