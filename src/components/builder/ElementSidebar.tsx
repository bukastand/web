"use client";

import { useDraggable } from "@dnd-kit/core";
import type { ElementType } from "@/lib/builder/types";

interface ElementItem {
  type: ElementType;
  label: string;
  icon: string;
  category: string;
}

const elements: ElementItem[] = [
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

  // Structure
  { type: "navbar", label: "Navbar", icon: "⊞", category: "Struktur" },
  { type: "footer", label: "Footer", icon: "⊟", category: "Struktur" },
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

  return (
    <aside className="w-60 flex-shrink-0 bg-[#0f172a] border-r border-white/10 overflow-y-auto">
      <div className="p-4 border-b border-white/10">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Elements</h3>
        <p className="text-[10px] text-gray-500 mt-0.5">Drag ke canvas untuk menambahkan</p>
      </div>
      <div className="p-3 space-y-4">
        {categories.map((cat) => (
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
      </div>
    </aside>
  );
}
