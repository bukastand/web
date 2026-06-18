"use client";

import { ColorPicker, FontSizeSlider } from "@/components/builder/helpers";

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


function ContentEditorShell({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


export function FeaturesEditor({ element, updateContent, renderField, handleAddItem, handleRemoveItem, handleItemChange }: {
  element: any;
  updateContent: (key: string, value: any) => void;
  renderField: (label: string, key: string, type: "text" | "color" | "number" | "select" | "textarea", options?: string[]) => React.ReactNode;
  handleAddItem: (field: string, defaultItem: any) => void;
  handleRemoveItem: (field: string, index: number) => void;
  handleItemChange: (field: string, index: number, key: string, value: any) => void;
}) {
  return (
    <ContentEditorShell>
      <>
                {renderField("Judul Section", "title", "text")}
                {renderField("Subtitle", "subtitle", "text")}
                <div className="mb-3 mt-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Judul</h4>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Font Judul</label>
                    <select value={element.content.titleFont || "Inter, sans-serif"} onChange={(e) => updateContent("titleFont", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" style={{ colorScheme: 'dark' }}>
                      {fontOptions.map(f => <option key={f.value} value={f.value} className="bg-[#1e293b] text-white">{f.label}</option>)}
                    </select>
                  </div>
                  <div className="mb-2"><ColorPicker value={element.content.titleColor || "#ffffff"} onChange={(v) => updateContent("titleColor", v)} label="Warna Judul" /></div>
                  <div className="mb-2"><FontSizeSlider value={element.content.titleSize || "30px"} onChange={(v) => updateContent("titleSize", v)} /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ketebalan Judul</label>
                    <select value={element.content.titleWeight || "700"} onChange={(e) => updateContent("titleWeight", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" style={{ colorScheme: 'dark' }}>
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
                  <div className="mb-2"><ColorPicker value={element.content.subtitleColor || "#94a3b8"} onChange={(v) => updateContent("subtitleColor", v)} label="Warna Subtitle" /></div>                  <div className="mb-2"><FontSizeSlider value={element.content.subtitleSize || "16px"} onChange={(v) => updateContent("subtitleSize", v)} /></div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Kartu</h4>
                  <div className="mb-2"><ColorPicker value={element.content.itemBg || "rgba(255,255,255,0.05)"} onChange={(v) => updateContent("itemBg", v)} label="Background Kartu" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.itemBorder || "rgba(255,255,255,0.1)"} onChange={(v) => updateContent("itemBorder", v)} label="Border Kartu" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.itemTitleColor || "#ffffff"} onChange={(v) => updateContent("itemTitleColor", v)} label="Warna Judul Item" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.itemTextColor || "#94a3b8"} onChange={(v) => updateContent("itemTextColor", v)} label="Warna Teks Item" /></div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Items ({element.content.items?.length || 0})</label>
                  {element.content.items?.map((item: any, i: number) => (
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
    </ContentEditorShell>
  );
}


export function PricingEditor({ element, updateContent, renderField, handleAddItem, handleRemoveItem, handleItemChange }: {
  element: any;
  updateContent: (key: string, value: any) => void;
  renderField: (label: string, key: string, type: "text" | "color" | "number" | "select" | "textarea", options?: string[]) => React.ReactNode;
  handleAddItem: (field: string, defaultItem: any) => void;
  handleRemoveItem: (field: string, index: number) => void;
  handleItemChange: (field: string, index: number, key: string, value: any) => void;
}) {
  return (
    <ContentEditorShell>
      <>
                {renderField("Judul Section", "title", "text")}
                {renderField("Subtitle", "subtitle", "text")}
                <div className="mb-3 mt-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Judul</h4>
                  <div className="mb-2"><ColorPicker value={element.content.titleColor || "#ffffff"} onChange={(v) => updateContent("titleColor", v)} label="Warna Judul" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Judul</label>
                    <input type="text" value={element.content.titleSize || "30px"} onChange={(e) => updateContent("titleSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Subtitle</h4>
                  <div className="mb-2"><ColorPicker value={element.content.subtitleColor || "#94a3b8"} onChange={(v) => updateContent("subtitleColor", v)} label="Warna Subtitle" /></div>                  <div className="mb-2"><FontSizeSlider value={element.content.subtitleSize || "16px"} onChange={(v) => updateContent("subtitleSize", v)} /></div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Kartu</h4>
                  <div className="mb-2"><ColorPicker value={element.content.cardBg || "rgba(255,255,255,0.05)"} onChange={(v) => updateContent("cardBg", v)} label="Background Kartu" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.cardBorder || "rgba(255,255,255,0.1)"} onChange={(v) => updateContent("cardBorder", v)} label="Border Kartu" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.highlightBg || "rgba(34,197,94,0.05)"} onChange={(v) => updateContent("highlightBg", v)} label="Background Highlight" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.highlightBorder || "#22c55e"} onChange={(v) => updateContent("highlightBorder", v)} label="Border Highlight" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.cardNameColor || "#ffffff"} onChange={(v) => updateContent("cardNameColor", v)} label="Warna Nama Paket" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.cardPriceColor || "#ffffff"} onChange={(v) => updateContent("cardPriceColor", v)} label="Warna Harga" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.cardDescColor || "#94a3b8"} onChange={(v) => updateContent("cardDescColor", v)} label="Warna Deskripsi" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.cardFeatureColor || "#d1d5db"} onChange={(v) => updateContent("cardFeatureColor", v)} label="Warna Fitur" /></div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Paket ({element.content.items?.length || 0})</label>
                  {element.content.items?.map((item: any, i: number) => (
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
    </ContentEditorShell>
  );
}


export function TestimonialEditor({ element, updateContent, renderField, handleAddItem, handleRemoveItem, handleItemChange }: {
  element: any;
  updateContent: (key: string, value: any) => void;
  renderField: (label: string, key: string, type: "text" | "color" | "number" | "select" | "textarea", options?: string[]) => React.ReactNode;
  handleAddItem: (field: string, defaultItem: any) => void;
  handleRemoveItem: (field: string, index: number) => void;
  handleItemChange: (field: string, index: number, key: string, value: any) => void;
}) {
  return (
    <ContentEditorShell>
      <>
                {renderField("Judul Section", "title", "text")}
                <div className="mb-3 mt-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Judul</h4>
                  <div className="mb-2"><ColorPicker value={element.content.titleColor || "#ffffff"} onChange={(v) => updateContent("titleColor", v)} label="Warna Judul" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Judul</label>
                    <input type="text" value={element.content.titleSize || "30px"} onChange={(e) => updateContent("titleSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Kartu</h4>
                  <div className="mb-2"><ColorPicker value={element.content.cardBg || "rgba(255,255,255,0.05)"} onChange={(v) => updateContent("cardBg", v)} label="Background Kartu" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.cardBorder || "rgba(255,255,255,0.1)"} onChange={(v) => updateContent("cardBorder", v)} label="Border Kartu" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.cardTextColor || "#d1d5db"} onChange={(v) => updateContent("cardTextColor", v)} label="Warna Teks Testimonial" /></div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Nama Author</h4>
                  <div className="mb-2"><ColorPicker value={element.content.authorNameColor || "#ffffff"} onChange={(v) => updateContent("authorNameColor", v)} label="Warna Nama" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Nama</label>
                    <input type="text" value={element.content.authorNameSize || "14px"} onChange={(e) => updateContent("authorNameSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ketebalan Nama</label>
                    <select value={element.content.authorNameWeight || "600"} onChange={(e) => updateContent("authorNameWeight", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" style={{ colorScheme: 'dark' }}>
                      {["400","500","600","700","800","900"].map(w => <option key={w} value={w} className="bg-[#1e293b] text-white">{w}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Jabatan</h4>
                  <div className="mb-2"><ColorPicker value={element.content.authorRoleColor || "#6b7280"} onChange={(v) => updateContent("authorRoleColor", v)} label="Warna Jabatan" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Jabatan</label>
                    <input type="text" value={element.content.authorRoleSize || "12px"} onChange={(e) => updateContent("authorRoleSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Avatar</h4>
                  <div className="mb-2"><ColorPicker value={element.content.avatarBg || "rgba(34,197,94,0.2)"} onChange={(v) => updateContent("avatarBg", v)} label="Background Avatar" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.avatarColor || "#22c55e"} onChange={(v) => updateContent("avatarColor", v)} label="Warna Teks Avatar" /></div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Testimonial ({element.content.items?.length || 0})</label>
                  {element.content.items?.map((item: any, i: number) => (
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
    </ContentEditorShell>
  );
}


export function CTAEditor({ element, updateContent, renderField, handleAddItem, handleRemoveItem, handleItemChange }: {
  element: any;
  updateContent: (key: string, value: any) => void;
  renderField: (label: string, key: string, type: "text" | "color" | "number" | "select" | "textarea", options?: string[]) => React.ReactNode;
  handleAddItem: (field: string, defaultItem: any) => void;
  handleRemoveItem: (field: string, index: number) => void;
  handleItemChange: (field: string, index: number, key: string, value: any) => void;
}) {
  return (
    <ContentEditorShell>
      <>
                {renderField("Title", "title", "text")}
                {renderField("Subtitle", "subtitle", "text")}
                {renderField("Teks Tombol", "buttonText", "text")}
                {renderField("Link Tombol", "buttonHref", "text")}
                <div className="mb-3 mt-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Judul</h4>
                  <div className="mb-2"><ColorPicker value={element.content.titleColor || "#ffffff"} onChange={(v) => updateContent("titleColor", v)} label="Warna Judul" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Judul</label>
                    <input type="text" value={element.content.titleSize || "36px"} onChange={(e) => updateContent("titleSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Subtitle</h4>
                  <div className="mb-2"><ColorPicker value={element.content.subtitleColor || "rgba(255,255,255,0.8)"} onChange={(v) => updateContent("subtitleColor", v)} label="Warna Subtitle" /></div>                  <div className="mb-2"><FontSizeSlider value={element.content.subtitleSize || "16px"} onChange={(v) => updateContent("subtitleSize", v)} /></div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Tombol</h4>
                  <div className="mb-2"><ColorPicker value={element.content.buttonBg || "#ffffff"} onChange={(v) => updateContent("buttonBg", v)} label="Background Tombol" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.buttonTextColor || "#1e293b"} onChange={(v) => updateContent("buttonTextColor", v)} label="Warna Teks Tombol" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Padding Horizontal (px)</label>
                    <input type="text" value={element.content.buttonPaddingX || "32px"} onChange={(e) => updateContent("buttonPaddingX", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" placeholder="32px" />
                  </div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Padding Vertikal (px)</label>
                    <input type="text" value={element.content.buttonPaddingY || "16px"} onChange={(e) => updateContent("buttonPaddingY", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" placeholder="16px" />
                  </div>
                </div>
              </>
    </ContentEditorShell>
  );
}


export function StatsEditor({ element, updateContent, renderField, handleAddItem, handleRemoveItem, handleItemChange }: {
  element: any;
  updateContent: (key: string, value: any) => void;
  renderField: (label: string, key: string, type: "text" | "color" | "number" | "select" | "textarea", options?: string[]) => React.ReactNode;
  handleAddItem: (field: string, defaultItem: any) => void;
  handleRemoveItem: (field: string, index: number) => void;
  handleItemChange: (field: string, index: number, key: string, value: any) => void;
}) {
  return (
    <ContentEditorShell>
      <>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Angka</h4>
                  <div className="mb-2"><ColorPicker value={element.content.valueColor || "#22c55e"} onChange={(v) => updateContent("valueColor", v)} label="Warna Angka" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Angka</label>
                    <input type="text" value={element.content.valueSize || "36px"} onChange={(e) => updateContent("valueSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ketebalan Angka</label>
                    <select value={element.content.valueWeight || "800"} onChange={(e) => updateContent("valueWeight", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" style={{ colorScheme: 'dark' }}>
                      {["400","500","600","700","800","900"].map(w => <option key={w} value={w} className="bg-[#1e293b] text-white">{w}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Label</h4>
                  <div className="mb-2"><ColorPicker value={element.content.labelColor || "#94a3b8"} onChange={(v) => updateContent("labelColor", v)} label="Warna Label" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Label</label>
                    <input type="text" value={element.content.labelSize || "14px"} onChange={(e) => updateContent("labelSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Statistik ({element.content.items?.length || 0})</label>
                  {element.content.items?.map((item: any, i: number) => (
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
    </ContentEditorShell>
  );
}


export function ContactFormEditor({ element, updateContent, renderField, handleAddItem, handleRemoveItem, handleItemChange }: {
  element: any;
  updateContent: (key: string, value: any) => void;
  renderField: (label: string, key: string, type: "text" | "color" | "number" | "select" | "textarea", options?: string[]) => React.ReactNode;
  handleAddItem: (field: string, defaultItem: any) => void;
  handleRemoveItem: (field: string, index: number) => void;
  handleItemChange: (field: string, index: number, key: string, value: any) => void;
}) {
  return (
    <ContentEditorShell>
      <>
                {renderField("Title", "title", "text")}
                {renderField("Subtitle", "subtitle", "text")}
                {renderField("No. WhatsApp", "whatsappNumber", "text")}
                <div className="mb-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <label className="block text-[11px] font-medium text-yellow-400 uppercase tracking-wider mb-1.5">📧 Email Penerima</label>
                  <input
                    type="email"
                    value={element.content.recipientEmail || ""}
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
                  <div className="mb-2"><ColorPicker value={element.content.titleColor || "#ffffff"} onChange={(v) => updateContent("titleColor", v)} label="Warna Judul" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Judul</label>
                    <input type="text" value={element.content.titleSize || "30px"} onChange={(e) => updateContent("titleSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Subtitle</h4>
                  <div className="mb-2"><ColorPicker value={element.content.subtitleColor || "#94a3b8"} onChange={(v) => updateContent("subtitleColor", v)} label="Warna Subtitle" /></div>                  <div className="mb-2"><FontSizeSlider value={element.content.subtitleSize || "16px"} onChange={(v) => updateContent("subtitleSize", v)} /></div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Input</h4>
                  <div className="mb-2"><ColorPicker value={element.content.inputBg || "rgba(255,255,255,0.05)"} onChange={(v) => updateContent("inputBg", v)} label="Background Input" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.inputBorder || "rgba(255,255,255,0.1)"} onChange={(v) => updateContent("inputBorder", v)} label="Border Input" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.inputText || "#ffffff"} onChange={(v) => updateContent("inputText", v)} label="Warna Teks Input" /></div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Tombol</h4>
                  <div className="mb-2"><ColorPicker value={element.content.buttonBg || "#22c55e"} onChange={(v) => updateContent("buttonBg", v)} label="Background Tombol" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.buttonText || "#ffffff"} onChange={(v) => updateContent("buttonText", v)} label="Warna Teks Tombol" /></div>
                </div>
              </>
    </ContentEditorShell>
  );
}


export function MapsEditor({ element, updateContent, renderField, handleAddItem, handleRemoveItem, handleItemChange }: {
  element: any;
  updateContent: (key: string, value: any) => void;
  renderField: (label: string, key: string, type: "text" | "color" | "number" | "select" | "textarea", options?: string[]) => React.ReactNode;
  handleAddItem: (field: string, defaultItem: any) => void;
  handleRemoveItem: (field: string, index: number) => void;
  handleItemChange: (field: string, index: number, key: string, value: any) => void;
}) {
  return (
    <ContentEditorShell>
      <>
                {renderField("Title", "title", "text")}
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Link Google Maps</label>
                  <p className="text-[9px] text-gray-600 mb-1.5">Share dari Google Maps, lalu paste link di sini. Contoh: <code className="text-[#22c55e]">maps.google.com?q=-6.2088,106.8456</code></p>
                  <input
                    type="text"
                    value={element.content.embedUrl || ""}
                    onChange={(e) => updateContent("embedUrl", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50"
                    placeholder="https://maps.google.com/maps?q=..."
                  />
                </div>
                {renderField("Alamat", "address", "text")}
                <div className="mb-3 mt-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Judul</h4>
                  <div className="mb-2"><ColorPicker value={element.content.titleColor || "#ffffff"} onChange={(v) => updateContent("titleColor", v)} label="Warna Judul" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Judul</label>
                    <input type="text" value={element.content.titleSize || "30px"} onChange={(e) => updateContent("titleSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Placeholder</h4>
                  <div className="mb-2"><ColorPicker value={element.content.cardBg || "rgba(255,255,255,0.05)"} onChange={(v) => updateContent("cardBg", v)} label="Background" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.cardBorder || "rgba(255,255,255,0.1)"} onChange={(v) => updateContent("cardBorder", v)} label="Border" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.addressColor || "#94a3b8"} onChange={(v) => updateContent("addressColor", v)} label="Warna Alamat" /></div>
                </div>
              </>
    </ContentEditorShell>
  );
}
