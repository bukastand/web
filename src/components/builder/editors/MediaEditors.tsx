"use client";

import { ColorPicker, FontSizeSlider } from "@/components/builder/helpers";
import { SOCIAL_PLATFORMS } from "@/lib/builder/social-platforms";
import { compressAndUploadImage } from "@/lib/upload-image";

function ContentEditorShell({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


export function CarouselEditor({ element, updateContent, renderField, handleAddItem, handleRemoveItem, handleItemChange, userId }: {
  element: any;
  updateContent: (key: string, value: any) => void;
  renderField: (label: string, key: string, type: "text" | "color" | "number" | "select" | "textarea", options?: string[]) => React.ReactNode;
  handleAddItem: (field: string, defaultItem: any) => void;
  handleRemoveItem: (field: string, index: number) => void;
  handleItemChange: (field: string, index: number, key: string, value: any) => void;
  userId: string | null;
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
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Carousel</h4>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Tinggi (px)</label>
                    <input type="text" value={element.content.height || "400px"} onChange={(e) => updateContent("height", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                  <div className="mb-2"><ColorPicker value={element.content.dotColor || "rgba(255,255,255,0.3)"} onChange={(v) => updateContent("dotColor", v)} label="Warna Dot" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.dotActiveColor || "#22c55e"} onChange={(v) => updateContent("dotActiveColor", v)} label="Warna Dot Aktif" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.arrowColor || "#ffffff"} onChange={(v) => updateContent("arrowColor", v)} label="Warna Panah" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.arrowBg || "rgba(0,0,0,0.3)"} onChange={(v) => updateContent("arrowBg", v)} label="Background Panah" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.captionColor || "#ffffff"} onChange={(v) => updateContent("captionColor", v)} label="Warna Caption" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Caption</label>
                    <input type="text" value={element.content.captionSize || "14px"} onChange={(e) => updateContent("captionSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                  <label className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      checked={element.content.autoPlay !== false}
                      onChange={(e) => updateContent("autoPlay", e.target.checked)}
                      className="rounded bg-white/5 border-white/20"
                    />
                    <span className="text-xs text-gray-400">Auto Play</span>
                  </label>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Slides ({element.content.slides?.length || 0})</label>
                  {element.content.slides?.map((slide: any, i: number) => (
                    <div key={i} className="mb-2 p-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Slide #{i + 1}</span>
                        <button onClick={() => {
                          const items = [...(element.content.slides || [])];
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
                        }}
                        className="w-full mb-1 text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#22c55e]/20 file:text-[#22c55e] file:text-xs file:font-medium hover:file:bg-[#22c55e]/30"
                      />
                      <input value={slide.caption || ""} onChange={(e) => handleItemChange("slides", i, "caption", e.target.value)} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Caption" />
                    </div>
                  ))}
                  <button onClick={() => handleAddItem("slides", { image: "https://placehold.co/800x500/1e293b/64748b?text=Slide+Baru", caption: "Slide Baru" })} className="w-full py-1.5 text-xs text-[#22c55e] border border-dashed border-[#22c55e]/30 rounded-lg hover:bg-[#22c55e]/10 transition-colors">+ Tambah Slide</button>
                </div>
              </>
    </ContentEditorShell>
  );
}


export function AccordionEditor({ element, updateContent, renderField, handleAddItem, handleRemoveItem, handleItemChange, userId }: {
  element: any;
  updateContent: (key: string, value: any) => void;
  renderField: (label: string, key: string, type: "text" | "color" | "number" | "select" | "textarea", options?: string[]) => React.ReactNode;
  handleAddItem: (field: string, defaultItem: any) => void;
  handleRemoveItem: (field: string, index: number) => void;
  handleItemChange: (field: string, index: number, key: string, value: any) => void;
  userId: string | null;
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
                  <div className="mb-2"><ColorPicker value={element.content.subtitleColor || "#94a3b8"} onChange={(v) => updateContent("subtitleColor", v)} label="Warna Subtitle" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Subtitle</label>
                    <input type="text" value={element.content.subtitleSize || "16px"} onChange={(e) => updateContent("subtitleSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Item</h4>
                  <div className="mb-2"><ColorPicker value={element.content.itemBg || "rgba(255,255,255,0.05)"} onChange={(v) => updateContent("itemBg", v)} label="Background Item" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.itemBorder || "rgba(255,255,255,0.1)"} onChange={(v) => updateContent("itemBorder", v)} label="Border Item" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.questionColor || "#ffffff"} onChange={(v) => updateContent("questionColor", v)} label="Warna Pertanyaan" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Pertanyaan</label>
                    <input type="text" value={element.content.questionSize || "16px"} onChange={(e) => updateContent("questionSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ketebalan Pertanyaan</label>
                    <select value={element.content.questionWeight || "600"} onChange={(e) => updateContent("questionWeight", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" style={{ colorScheme: 'dark' }}>
                      {["400","500","600","700","800","900"].map(w => <option key={w} value={w} className="bg-[#1e293b] text-white">{w}</option>)}
                    </select>
                  </div>
                  <div className="mb-2"><ColorPicker value={element.content.answerColor || "#94a3b8"} onChange={(v) => updateContent("answerColor", v)} label="Warna Jawaban" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Jawaban</label>
                    <input type="text" value={element.content.answerSize || "14px"} onChange={(e) => updateContent("answerSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                  <div className="mb-2"><ColorPicker value={element.content.iconColor || "#22c55e"} onChange={(v) => updateContent("iconColor", v)} label="Warna Ikon +/−" /></div>
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
                      <input value={item.question || ""} onChange={(e) => handleItemChange("items", i, "question", e.target.value)} className="w-full mb-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs" placeholder="Pertanyaan" />
                      <textarea value={item.answer || ""} onChange={(e) => handleItemChange("items", i, "answer", e.target.value)} className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs resize-none" rows={2} placeholder="Jawaban" />
                    </div>
                  ))}
                  <button onClick={() => handleAddItem("items", { question: "Pertanyaan Baru?", answer: "Jawaban dari pertanyaan" })} className="w-full py-1.5 text-xs text-[#22c55e] border border-dashed border-[#22c55e]/30 rounded-lg hover:bg-[#22c55e]/10 transition-colors">+ Tambah Item</button>
                </div>
              </>
    </ContentEditorShell>
  );
}


export function TeamEditor({ element, updateContent, renderField, handleAddItem, handleRemoveItem, handleItemChange, userId }: {
  element: any;
  updateContent: (key: string, value: any) => void;
  renderField: (label: string, key: string, type: "text" | "color" | "number" | "select" | "textarea", options?: string[]) => React.ReactNode;
  handleAddItem: (field: string, defaultItem: any) => void;
  handleRemoveItem: (field: string, index: number) => void;
  handleItemChange: (field: string, index: number, key: string, value: any) => void;
  userId: string | null;
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
                  <div className="mb-2"><ColorPicker value={element.content.subtitleColor || "#94a3b8"} onChange={(v) => updateContent("subtitleColor", v)} label="Warna Subtitle" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Subtitle</label>
                    <input type="text" value={element.content.subtitleSize || "16px"} onChange={(e) => updateContent("subtitleSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Kartu</h4>
                  <div className="mb-2"><ColorPicker value={element.content.cardBg || "rgba(255,255,255,0.05)"} onChange={(v) => updateContent("cardBg", v)} label="Background Kartu" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.cardBorder || "rgba(255,255,255,0.1)"} onChange={(v) => updateContent("cardBorder", v)} label="Border Kartu" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Avatar</label>
                    <input type="text" value={element.content.avatarSize || "120px"} onChange={(e) => updateContent("avatarSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Nama</h4>
                  <div className="mb-2"><ColorPicker value={element.content.nameColor || "#ffffff"} onChange={(v) => updateContent("nameColor", v)} label="Warna Nama" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Nama</label>
                    <input type="text" value={element.content.nameSize || "18px"} onChange={(e) => updateContent("nameSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ketebalan Nama</label>
                    <select value={element.content.nameWeight || "700"} onChange={(e) => updateContent("nameWeight", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" style={{ colorScheme: 'dark' }}>
                      {["400","500","600","700","800","900"].map(w => <option key={w} value={w} className="bg-[#1e293b] text-white">{w}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Jabatan</h4>
                  <div className="mb-2"><ColorPicker value={element.content.roleColor || "#94a3b8"} onChange={(v) => updateContent("roleColor", v)} label="Warna Jabatan" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Jabatan</label>
                    <input type="text" value={element.content.roleSize || "14px"} onChange={(e) => updateContent("roleSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Sosial Media</h4>
                  <div className="mb-2"><ColorPicker value={element.content.socialIconColor || "#64748b"} onChange={(v) => updateContent("socialIconColor", v)} label="Warna Ikon" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.socialIconHoverColor || "#22c55e"} onChange={(v) => updateContent("socialIconHoverColor", v)} label="Warna Hover Ikon" /></div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Anggota Tim ({element.content.members?.length || 0})</label>
                  {element.content.members?.map((member: any, i: number) => (
                    <div key={i} className="mb-2 p-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">#{i + 1}</span>
                        <button onClick={() => {
                          const items = [...(element.content.members || [])];
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
                            const url = await compressAndUploadImage(file, userId);
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
    </ContentEditorShell>
  );
}


export function CountdownEditor({ element, updateContent, renderField, handleAddItem, handleRemoveItem, handleItemChange, userId }: {
  element: any;
  updateContent: (key: string, value: any) => void;
  renderField: (label: string, key: string, type: "text" | "color" | "number" | "select" | "textarea", options?: string[]) => React.ReactNode;
  handleAddItem: (field: string, defaultItem: any) => void;
  handleRemoveItem: (field: string, index: number) => void;
  handleItemChange: (field: string, index: number, key: string, value: any) => void;
  userId: string | null;
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
                  <div className="mb-2"><ColorPicker value={element.content.subtitleColor || "#94a3b8"} onChange={(v) => updateContent("subtitleColor", v)} label="Warna Subtitle" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Subtitle</label>
                    <input type="text" value={element.content.subtitleSize || "16px"} onChange={(e) => updateContent("subtitleSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                </div>
                <div className="mb-3">
                  <div className="h-px bg-white/10 mb-3" />
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Target</h4>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Tanggal Target</label>
                    <input
                      type="date"
                      value={element.content.targetDate || ""}
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
                  <div className="mb-2"><ColorPicker value={element.content.numberColor || "#22c55e"} onChange={(v) => updateContent("numberColor", v)} label="Warna Angka" /></div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ukuran Angka</label>
                    <input type="text" value={element.content.numberSize || "48px"} onChange={(e) => updateContent("numberSize", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" />
                  </div>
                  <div className="mb-2">
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Ketebalan Angka</label>
                    <select value={element.content.numberWeight || "800"} onChange={(e) => updateContent("numberWeight", e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" style={{ colorScheme: 'dark' }}>
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
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Style Kotak</h4>
                  <div className="mb-2"><ColorPicker value={element.content.boxBg || "rgba(255,255,255,0.05)"} onChange={(v) => updateContent("boxBg", v)} label="Background Kotak" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.boxBorder || "rgba(255,255,255,0.1)"} onChange={(v) => updateContent("boxBorder", v)} label="Border Kotak" /></div>
                  <div className="mb-2"><ColorPicker value={element.content.separatorColor || "rgba(255,255,255,0.1)"} onChange={(v) => updateContent("separatorColor", v)} label="Warna Separator (:)" /></div>
                </div>
              </>
    </ContentEditorShell>
  );
}
