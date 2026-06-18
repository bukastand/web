"use client";

import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import type { ElementType } from "@/lib/builder/types";
import TemplatePicker from "./TemplatePicker";

interface ElementItem {
  type: ElementType;
  label: string;
  icon: string;
  category: string;
}

// Export for reuse in mobile drawer
const MOBILE_ELEMENTS: Array<{ type: ElementType; label: string; icon: string }> = [
  // Layout containers — Paling Atas
  { type: "container", label: "Container Grid", icon: "⊞" },
  { type: "flexbox", label: "Flexbox", icon: "≋" },
  { type: "heading", label: "Heading", icon: "H" },
  { type: "text", label: "Text", icon: "¶" },
  { type: "image", label: "Image", icon: "🖼" },
  { type: "button", label: "Button", icon: "▣" },
  { type: "video", label: "Video", icon: "▶" },
  { type: "divider", label: "Divider", icon: "―" },
  { type: "spacer", label: "Spacer", icon: "⬜" },
  { type: "icon", label: "Icon", icon: "⭐" },
  { type: "features", label: "Features", icon: "📊" },
  { type: "pricing", label: "Pricing", icon: "💰" },
  { type: "testimonial", label: "Testimonial", icon: "💬" },
  { type: "cta", label: "CTA", icon: "📢" },
  { type: "stats", label: "Stats", icon: "📈" },
  { type: "contactForm", label: "Contact", icon: "📝" },
  { type: "maps", label: "Maps", icon: "📍" },
  { type: "navbar", label: "Navbar", icon: "⊞" },
  { type: "footer", label: "Footer", icon: "⊟" },
  { type: "carousel", label: "Carousel", icon: "🎠" },
  { type: "accordion", label: "FAQ", icon: "📋" },
  { type: "team", label: "Team", icon: "👥" },
  { type: "countdown", label: "Countdown", icon: "⏱" },
  // Premium Elements
  { type: "animated-headline", label: "Animated Headline", icon: "✨" },
  { type: "blockquote", label: "Blockquote", icon: "❝" },
  { type: "code-highlight", label: "Code Highlight", icon: "💻" },
  { type: "flip-box", label: "Flip Box", icon: "🔄" },
  { type: "hotspot", label: "Hotspot", icon: "🔍" },
  { type: "progress-tracker", label: "Progress Tracker", icon: "📊" },
  { type: "share-buttons", label: "Share Buttons", icon: "📣" },
  { type: "checklist", label: "Checklist", icon: "✅" },
  { type: "gallery", label: "Gallery", icon: "🖼️" },
  { type: "lottie", label: "Lottie Animasi", icon: "🎬" },
  { type: "star-rating", label: "Star Rating", icon: "⭐" },
  { type: "search", label: "Search", icon: "🔎" },
  { type: "floating-buttons", label: "Floating Button", icon: "💬" },
  { type: "breadcrumbs", label: "Breadcrumbs", icon: "🔗" },
  { type: "off-canvas", label: "Off Canvas", icon: "📋" },
  { type: "slides", label: "Hero Slides", icon: "📽️" },
  { type: "nested-carousel", label: "Nested Carousel", icon: "🔄" },
  { type: "video-playlist", label: "Video Playlist", icon: "▶️" },
  { type: "table-of-contents", label: "Table of Contents", icon: "📑" },
  { type: "social-embed", label: "Social Embed", icon: "🌐" },
];

export { MOBILE_ELEMENTS };

const elements: ElementItem[] = [
  // Layout containers — Paling Atas
  { type: "container", label: "Container Grid", icon: "⊞", category: "Layout" },
  { type: "flexbox", label: "Flexbox", icon: "≋", category: "Layout" },

  // Layout category
  { type: "heading", label: "Heading", icon: "H", category: "Teks" },
  { type: "text", label: "Text", icon: "¶", category: "Teks" },
  { type: "spacer", label: "Spacer", icon: "⬜", category: "Layout" },
  { type: "divider", label: "Divider", icon: "―", category: "Layout" },

  // Media
  { type: "image", label: "Image", icon: "🖼", category: "Media" },
  { type: "video", label: "Video", icon: "▶", category: "Media" },
  { type: "icon", label: "Icon", icon: "⭐", category: "Media" },

  // Interactive
  { type: "button", label: "Button", icon: "▣", category: "Interaktif" },

  // Content sections
  { type: "features", label: "Features Grid", icon: "📊", category: "Konten" },
  { type: "pricing", label: "Pricing Table", icon: "💰", category: "Konten" },
  { type: "testimonial", label: "Testimonial", icon: "💬", category: "Konten" },
  { type: "cta", label: "CTA Section", icon: "📢", category: "Konten" },
  { type: "stats", label: "Stats Counter", icon: "📈", category: "Konten" },
  { type: "contactForm", label: "Contact Form", icon: "📝", category: "Konten" },
  { type: "maps", label: "Google Maps", icon: "📍", category: "Konten" },
  { type: "accordion", label: "FAQ Accordion", icon: "📋", category: "Konten" },
  { type: "team", label: "Tim Kami", icon: "👥", category: "Konten" },
  { type: "carousel", label: "Carousel", icon: "🎠", category: "Konten" },
  { type: "countdown", label: "Countdown", icon: "⏱", category: "Konten" },

  // Structure
  { type: "navbar", label: "Navbar", icon: "⊞", category: "Struktur" },
  { type: "footer", label: "Footer", icon: "⊟", category: "Struktur" },

  // ── Premium Elements (Elementor Pro ports) ──
  { type: "animated-headline", label: "Animated Headline", icon: "✨", category: "Premium" },
  { type: "blockquote", label: "Blockquote", icon: "❝", category: "Premium" },
  { type: "code-highlight", label: "Code Highlight", icon: "💻", category: "Premium" },
  { type: "flip-box", label: "Flip Box", icon: "🔄", category: "Premium" },
  { type: "hotspot", label: "Hotspot", icon: "🔍", category: "Premium" },
  { type: "progress-tracker", label: "Progress Tracker", icon: "📊", category: "Premium" },
  { type: "share-buttons", label: "Share Buttons", icon: "📣", category: "Premium" },
  { type: "checklist", label: "Checklist", icon: "✅", category: "Premium" },
  { type: "gallery", label: "Gallery", icon: "🖼️", category: "Premium" },
  { type: "lottie", label: "Lottie Animasi", icon: "🎬", category: "Premium" },
  { type: "star-rating", label: "Star Rating", icon: "⭐", category: "Premium" },
  { type: "search", label: "Search", icon: "🔎", category: "Premium" },
  { type: "floating-buttons", label: "Floating Button", icon: "💬", category: "Premium" },
  { type: "breadcrumbs", label: "Breadcrumbs", icon: "🔗", category: "Premium" },
  { type: "off-canvas", label: "Off Canvas", icon: "📋", category: "Premium" },
  { type: "slides", label: "Hero Slides", icon: "📽️", category: "Premium" },
  { type: "nested-carousel", label: "Nested Carousel", icon: "🔄", category: "Premium" },
  { type: "video-playlist", label: "Video Playlist", icon: "▶️", category: "Premium" },
  { type: "table-of-contents", label: "Table of Contents", icon: "📑", category: "Premium" },
  { type: "social-embed", label: "Social Embed", icon: "🌐", category: "Premium" },
];

function DraggableItem({ item }: { item: ElementItem }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${item.type}`,
    data: { type: "sidebar-element", elementType: item.type },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-3 p-3 rounded-xl border cursor-grab active:cursor-grabbing transition-all ${
        isDragging
          ? "opacity-50 border-[#22c55e]/50 bg-[#22c55e]/10"
          : "border-white/10 bg-white/5 hover:border-[#22c55e]/30 hover:bg-[#22c55e]/5"
      }`}
    >
      <span className="text-lg w-7 h-7 flex items-center justify-center">{item.icon}</span>
      <span className="text-xs font-medium text-white">{item.label}</span>
    </div>
  );
}

export default function ElementSidebar() {
  const categories = [...new Set(elements.map((e) => e.category))];
  const [showTemplates, setShowTemplates] = useState(false);

  return (
    <aside className="w-60 flex-shrink-0 bg-[#0f172a] border-r border-white/10 overflow-y-auto">
      {/* Tab buttons */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setShowTemplates(false)}
          className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
            !showTemplates
              ? "text-[#22c55e] border-b-2 border-[#22c55e]"
              : "text-gray-500 hover:text-white"
          }`}
        >
          Elements
        </button>
        <button
          onClick={() => setShowTemplates(true)}
          className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
            showTemplates
              ? "text-[#22c55e] border-b-2 border-[#22c55e]"
              : "text-gray-500 hover:text-white"
          }`}
        >
          Templates
        </button>
      </div>

      {showTemplates ? (
        <div className="p-3">
          <p className="text-[10px] text-gray-500 mb-3">Klik untuk tambah section lengkap</p>
          <TemplatePicker onClose={undefined} compact />
        </div>
      ) : (
        <div className="p-3 space-y-4">
          <p className="text-[10px] text-gray-500">Drag ke canvas untuk menambahkan</p>
          {categories
            .filter((cat) => cat !== "Premium")
            .map((cat) => (
              <div key={cat}>
                <h4 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">{cat}</h4>
                <div className="space-y-1">
                  {elements
                    .filter((e) => e.category === cat)
                    .map((item) => (
                      <DraggableItem key={item.type} item={item} />
                    ))}
                </div>
              </div>
            ))}

          {/* Premium Elements Section */}
          {categories.includes("Premium") && (
            <div>
              <div className="flex items-center gap-2 mb-3 px-1 mt-6 border-t border-[#f59e0b]/20 pt-4">
                <span className="text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider">✨ Premium Elements</span>
                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] font-medium">Pro</span>
              </div>
              <div className="space-y-1 relative">
                {elements
                  .filter((e) => e.category === "Premium")
                  .map((item) => (
                    <div key={item.type} className="relative group">
                      <div className="absolute -left-1 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#f59e0b] to-[#22c55e] opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                      <DraggableItem item={item} />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
