"use client";

import { useBuilder } from "@/lib/builder/store";
import { useState } from "react";

const elementLabels: Record<string, string> = {
  heading: "Heading", text: "Teks", image: "Gambar", button: "Tombol",
  video: "Video", spacer: "Spacer", divider: "Divider", icon: "Ikon",
  features: "Features Grid", pricing: "Pricing Table", testimonial: "Testimonial",
  cta: "CTA Section", stats: "Stats Counter", contactForm: "Contact Form",
  maps: "Google Maps", navbar: "Navbar", footer: "Footer",
};

export default function StylePanel({ onClose }: { onClose: () => void }) {
  const { currentPage, dispatch, state } = useBuilder();
  const [tab, setTab] = useState<"content" | "style">("content");

  if (!currentPage) return null;
  if (!state.selectedElementId) {
    return (
      <aside className="w-72 flex-shrink-0 bg-[#0f172a] border-l border-white/10 p-4 overflow-y-auto">
        <p className="text-sm text-gray-500 text-center mt-20">Klik element untuk mengedit</p>
      </aside>
    );
  }

  // Find the selected element
  let selectedElement: any = null;
  let sectionId = "";
  let columnIndex = 0;

  for (const sec of currentPage.sections) {
    for (let ci = 0; ci < sec.columns.length; ci++) {
      const found = sec.columns[ci].elements.find((e) => e.id === state.selectedElementId);
      if (found) {
        selectedElement = found;
        sectionId = sec.id;
        columnIndex = ci;
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

  const renderField = (label: string, key: string, type: "text" | "color" | "number" | "select" | "textarea", options?: string[]) => {
    const value = selectedElement.content[key] ?? "";
    return (
      <div className="mb-3">
        <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
        {type === "select" ? (
          <select
            value={value}
            onChange={(e) => updateContent(key, e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50"
          >
            {options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => updateContent(key, e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50 resize-none"
            rows={3}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => type === "color" ? updateContent(key, e.target.value) : updateContent(key, e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50"
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
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value || "#000000"}
              onChange={(e) => updateStyle(key, e.target.value)}
              className="w-10 h-10 rounded-lg bg-transparent border border-white/10 cursor-pointer"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => updateStyle(key, e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50 font-mono"
              placeholder="#000000"
            />
          </div>
        ) : type === "select" ? (
          <select
            value={value}
            onChange={(e) => updateStyle(key, e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50"
          >
            {options?.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
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

  return (
    <aside className="w-72 flex-shrink-0 bg-[#0f172a] border-l border-white/10 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-[#0f172a] z-10 p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">{elementLabels[selectedElement.type] || selectedElement.type}</h3>
            <p className="text-[10px] text-gray-500 mt-0.5">ID: {selectedElement.id.slice(0, 8)}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
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
            {selectedElement.type === "heading" && (
              <>
                {renderField("Teks", "text", "text")}
                {renderField("Level", "level", "select", ["h1", "h2", "h3", "h4", "h5", "h6"])}
                {renderField("Alignment", "align", "select", ["left", "center", "right"])}
              </>
            )}
            {selectedElement.type === "text" && renderField("Teks", "text", "textarea")}
            {selectedElement.type === "image" && (
              <>
                {renderField("URL Gambar", "src", "text")}
                {renderField("Alt Text", "alt", "text")}
                {renderField("Caption", "caption", "text")}
              </>
            )}
            {selectedElement.type === "button" && (
              <>
                {renderField("Teks", "text", "text")}
                {renderField("Link", "href", "text")}
                {renderField("Variant", "variant", "select", ["primary", "secondary", "outline"])}
              </>
            )}
            {selectedElement.type === "video" && (
              <>
                {renderField("URL Video (Embed)", "url", "text")}
                {renderField("Caption", "caption", "text")}
              </>
            )}
            {selectedElement.type === "spacer" && renderField("Height (px)", "height", "text")}
            {selectedElement.type === "divider" && (
              <>
                {renderField("Style", "style", "select", ["solid", "dashed", "dotted"])}
                {renderField("Color", "color", "color")}
              </>
            )}
            {selectedElement.type === "icon" && (
              <>
                {renderField("Icon Name", "icon", "select", ["star", "heart", "rocket", "globe", "lightbulb", "shield", "chart", "users", "cog", "check"])}
                {renderField("Size", "size", "text")}
                {renderField("Color", "color", "color")}
              </>
            )}
            {selectedElement.type === "features" && renderField("Title", "title", "text")}
            {selectedElement.type === "pricing" && renderField("Title", "title", "text")}
            {selectedElement.type === "testimonial" && renderField("Title", "title", "text")}
            {selectedElement.type === "cta" && (
              <>
                {renderField("Title", "title", "text")}
                {renderField("Subtitle", "subtitle", "text")}
                {renderField("Button Text", "buttonText", "text")}
                {renderField("Button Link", "buttonHref", "text")}
              </>
            )}
            {selectedElement.type === "stats" && renderField("Title (opsional)", "title", "text")}
            {selectedElement.type === "contactForm" && (
              <>
                {renderField("Title", "title", "text")}
                {renderField("Subtitle", "subtitle", "text")}
                {renderField("No. WhatsApp", "whatsappNumber", "text")}
              </>
            )}
            {selectedElement.type === "maps" && (
              <>
                {renderField("Title", "title", "text")}
                {renderField("Address", "address", "text")}
                {renderField("Latitude", "lat", "text")}
                {renderField("Longitude", "lng", "text")}
              </>
            )}
            {selectedElement.type === "navbar" && (
              <>
                {renderField("Logo Text", "logo", "text")}
                {renderField("CTA Text", "ctaText", "text")}
                {renderField("CTA Link", "ctaHref", "text")}
              </>
            )}
            {selectedElement.type === "footer" && renderField("Copyright", "copyright", "text")}
          </div>
        ) : (
          <div>
            {renderStyleField("Text Color", "color", "color")}
            {renderStyleField("Background", "backgroundColor", "color")}
            {renderStyleField("Font Size", "fontSize", "text")}
            {renderStyleField("Font Weight", "fontWeight", "text")}
            {renderStyleField("Text Align", "textAlign", "select", ["left", "center", "right"])}
            {renderStyleField("Padding", "padding", "text")}
            {renderStyleField("Margin", "margin", "text")}
            {renderStyleField("Border Radius", "borderRadius", "text")}
          </div>
        )}
      </div>
    </aside>
  );
}
