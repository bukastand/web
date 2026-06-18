"use client";

import { ColorPicker, FontSizeSlider } from "@/components/builder/helpers";
import { SOCIAL_PLATFORMS } from "@/lib/builder/social-platforms";
import { compressAndUploadImage } from "@/lib/upload-image";

function ContentEditorShell({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


export function NavbarEditor({ element, updateContent, renderField, handleAddItem, handleRemoveItem, handleItemChange, userId, handleAddLink, handleRemoveLink }: {
  element: any;
  updateContent: (key: string, value: any) => void;
  renderField: (label: string, key: string, type: "text" | "color" | "number" | "select" | "textarea", options?: string[]) => React.ReactNode;
  handleAddItem: (field: string, defaultItem: any) => void;
  handleRemoveItem: (field: string, index: number) => void;
  handleItemChange: (field: string, index: number, key: string, value: any) => void;
  handleAddLink: () => void;
  handleRemoveLink: (index: number) => void;
  userId: string | null;
}) {
  return (
    <ContentEditorShell>
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
                  <ColorPicker value={element.content.logoColor || "#ffffff"} onChange={(v) => updateContent("logoColor", v)} label="" />
                </div>
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ketebalan Logo</label>
                  <select
                    value={element.content.logoFontWeight || "700"}
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
                    value={element.content.logoAlign || "start"}
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
                  {element.content.logoImage && (
                    <div className="relative mb-2 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                      <img src={element.content.logoImage} alt="logo preview" className="w-full h-20 object-contain" />
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
                        const url = await compressAndUploadImage(file, userId);
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
                  <ColorPicker value={element.content.menuColor || "#94a3b8"} onChange={(v) => updateContent("menuColor", v)} label="" />
                </div>
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Warna Hover Menu</label>
                  <ColorPicker value={element.content.menuHoverColor || "#22c55e"} onChange={(v) => updateContent("menuHoverColor", v)} label="" />
                  <p className="text-[9px] text-gray-600 mt-1">Warna saat cursor diarahkan ke menu link + garis underline</p>
                </div>
                <FontSizeSlider
                  value={element.content.menuFontSize || "14px"}
                  onChange={(v) => updateContent("menuFontSize", v)}
                />
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ketebalan Menu</label>
                  <select
                    value={element.content.menuFontWeight || "500"}
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
                    value={element.content.menuAlign || "center"}
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
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Menu Links ({element.content.links?.length || 0})</label>
                  {element.content.links?.map((link: any, i: number) => (
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
                  <ColorPicker value={element.content.ctaBgColor || "#22c55e"} onChange={(v) => updateContent("ctaBgColor", v)} label="" />
                </div>
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Warna Teks CTA</label>
                  <ColorPicker value={element.content.ctaColor || "#ffffff"} onChange={(v) => updateContent("ctaColor", v)} label="" />
                </div>
                <FontSizeSlider
                  value={element.content.ctaFontSize || "14px"}
                  onChange={(v) => updateContent("ctaFontSize", v)}
                />
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ketebalan CTA</label>
                  <select
                    value={element.content.ctaFontWeight || "600"}
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
                    value={element.content.ctaAlign || "end"}
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
    </ContentEditorShell>
  );
}


export function FooterEditor({ element, updateContent, renderField, handleAddItem, handleRemoveItem, handleItemChange, userId, handleAddLink, handleRemoveLink }: {
  element: any;
  updateContent: (key: string, value: any) => void;
  renderField: (label: string, key: string, type: "text" | "color" | "number" | "select" | "textarea", options?: string[]) => React.ReactNode;
  handleAddItem: (field: string, defaultItem: any) => void;
  handleRemoveItem: (field: string, index: number) => void;
  handleItemChange: (field: string, index: number, key: string, value: any) => void;
  handleAddLink: () => void;
  handleRemoveLink: (index: number) => void;
  userId: string | null;
}) {
  return (
    <ContentEditorShell>
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
                  {element.content.logoImage && (
                    <div className="relative mb-2 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                      <img src={element.content.logoImage} alt="logo preview" className="w-full h-20 object-contain" />
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
                        const url = await compressAndUploadImage(file, userId);
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
                <div className="mb-2"><ColorPicker value={element.content.logoColor || "#ffffff"} onChange={(v) => updateContent("logoColor", v)} label="Warna Logo" /></div>
                <div className="mb-2">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Logo</label>
                  <input type="text" value={element.content.logoFontSize || "20px"} onChange={(e) => updateContent("logoFontSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                </div>
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ketebalan Logo</label>
                  <select
                    value={element.content.logoFontWeight || "700"}
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
                <div className="mb-2"><ColorPicker value={element.content.descColor || "#6b7280"} onChange={(v) => updateContent("descColor", v)} label="Warna Deskripsi" /></div>
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Deskripsi</label>
                  <input type="text" value={element.content.descSize || "14px"} onChange={(e) => updateContent("descSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                </div>

                {/* ── LINKS ── */}
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4 px-1 flex items-center gap-2">
                  <span className="w-4 h-px bg-white/10" />
                  MENU LINKS
                </h4>
                <div className="mb-2">{renderField("Judul Links", "linksHeading", "text")}</div>
                <div className="mb-2"><ColorPicker value={element.content.linkHeadingColor || "#9ca3af"} onChange={(v) => updateContent("linkHeadingColor", v)} label="Warna Judul Links" /></div>
                <div className="mb-2">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Judul Links</label>
                  <input type="text" value={element.content.linkHeadingSize || "12px"} onChange={(e) => updateContent("linkHeadingSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                </div>
                <div className="mb-2"><ColorPicker value={element.content.linkColor || "#6b7280"} onChange={(v) => updateContent("linkColor", v)} label="Warna Link" /></div>
                <div className="mb-2"><ColorPicker value={element.content.linkHoverColor || "#ffffff"} onChange={(v) => updateContent("linkHoverColor", v)} label="Warna Hover Link" /></div>
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Link</label>
                  <input type="text" value={element.content.linkSize || "14px"} onChange={(e) => updateContent("linkSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                </div>
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Footer Links ({element.content.links?.length || 0})</label>
                  {element.content.links?.map((link: any, i: number) => (
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
                <div className="mb-2"><ColorPicker value={element.content.socialIconBg || "rgba(255,255,255,0.05)"} onChange={(v) => updateContent("socialIconBg", v)} label="Background Ikon" /></div>
                <div className="mb-2"><ColorPicker value={element.content.socialIconBorder || "rgba(255,255,255,0.1)"} onChange={(v) => updateContent("socialIconBorder", v)} label="Border Ikon" /></div>
                <div className="mb-2"><ColorPicker value={element.content.socialIconColor || "#9ca3af"} onChange={(v) => updateContent("socialIconColor", v)} label="Warna Ikon" /></div>
                <div className="mb-2"><ColorPicker value={element.content.socialIconHoverColor || "#22c55e"} onChange={(v) => updateContent("socialIconHoverColor", v)} label="Warna Hover Ikon" /></div>
                <div className="mb-3"><ColorPicker value={element.content.socialIconHoverBorder || "rgba(34,197,94,0.4)"} onChange={(v) => updateContent("socialIconHoverBorder", v)} label="Border Hover Ikon" /></div>
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Sosial Media ({element.content.socials?.length || 0})</label>
                  {element.content.socials?.map((s: any, i: number) => (
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
                        const items = [...(element.content.socials || [])];
                        items.splice(i, 1);
                        updateContent("socials", items);
                      }} className="text-red-400 hover:text-red-300 text-xs px-1">×</button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const items = [...(element.content.socials || []), { platform: "instagram", url: "#" }];
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
                <div className="mb-2"><ColorPicker value={element.content.copyrightColor || "#4b5563"} onChange={(v) => updateContent("copyrightColor", v)} label="Warna Copyright" /></div>
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Copyright</label>
                  <input type="text" value={element.content.copyrightSize || "14px"} onChange={(e) => updateContent("copyrightSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                </div>
              </>
    </ContentEditorShell>
  );
}
