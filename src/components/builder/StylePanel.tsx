"use client";

import { useState, useRef } from "react";
import { useBuilder } from "@/lib/builder/store";
import { useAuth } from "@/components/auth/AuthProvider";
import { SOCIAL_PLATFORMS, SocialIcon } from "@/lib/builder/social-platforms";
import { compressAndUploadImage } from "@/lib/upload-image";
import { ColorPicker, FontSizeSlider, GradientBuilder } from "@/components/builder/helpers";
import { HeadingEditor, TextEditor, ImageEditor, ButtonEditor, VideoEditor, SpacerEditor, DividerEditor, IconEditor, FeaturesEditor, PricingEditor, TestimonialEditor, CTAEditor, StatsEditor, ContactFormEditor, MapsEditor, NavbarEditor, FooterEditor, CarouselEditor, AccordionEditor, TeamEditor, CountdownEditor } from "@/components/builder/editors";
import { AnimatedHeadlineEditor, BlockquoteEditor, CodeHighlightEditor, FlipBoxEditor, HotspotEditor, ProgressTrackerEditor, ShareButtonsEditor, ChecklistEditor, GalleryEditor, LottieEditor, StarRatingEditor, SearchEditor, FloatingButtonsEditor, BreadcrumbsEditor, OffCanvasEditor, SlidesEditor, NestedCarouselEditor, VideoPlaylistEditor, TableOfContentsEditor, SocialEmbedEditor } from "./PremiumElementEditors";

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

const elementLabels: Record<string, string> = {
  heading: "Heading", text: "Teks", image: "Gambar", button: "Tombol",
  video: "Video", spacer: "Spacer", divider: "Divider", icon: "Ikon",
  features: "Features Grid", pricing: "Pricing Table", testimonial: "Testimonial",
  cta: "CTA Section", stats: "Stats Counter", contactForm: "Contact Form",
  maps: "Google Maps", navbar: "Navbar", footer: "Footer",
  carousel: "Carousel", accordion: "FAQ Accordion", team: "Tim", countdown: "Countdown",
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
          {(["top","bottom","left","right"] as const).map(pos => (
            <div key={pos}>
              <span className="text-[9px] text-gray-600 block mb-0.5">{pos.charAt(0).toUpperCase() + pos.slice(1)}</span>
              <input
                type="text"
                value={val(keys[pos])}
                onChange={(e) => updateStyle(keys[pos], e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#22c55e]/50"
                placeholder="0px"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <aside className="w-72 flex-shrink-0 bg-[#0f172a] border-l border-white/10 overflow-y-auto">
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

        <div className="flex items-center gap-1 mb-2">
          <button
            onClick={() => dispatch({ type: "MOVE_ELEMENT", pageId: currentPage.id, from: { sectionId, columnIndex, elementId: selectedElement.id }, to: { sectionId, columnIndex, index: elementIndex - 1 } })}
            disabled={elementIndex <= 0}
            className="flex-1 py-1 text-[10px] font-medium rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >▲ Atas</button>
          <button
            onClick={() => dispatch({ type: "MOVE_ELEMENT", pageId: currentPage.id, from: { sectionId, columnIndex, elementId: selectedElement.id }, to: { sectionId, columnIndex, index: elementIndex + 1 } })}
            disabled={elementIndex >= totalElements - 1}
            className="flex-1 py-1 text-[10px] font-medium rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >▼ Bawah</button>
          <button
            onClick={() => dispatch({ type: "DUPLICATE_ELEMENT", pageId: currentPage.id, sectionId, columnIndex, elementId: selectedElement.id })}
            className="flex-1 py-1 text-[10px] font-medium rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-[#22c55e] hover:bg-[#22c55e]/10 transition-all"
          >📋 Duplikat</button>
          <button
            onClick={() => dispatch({ type: "REMOVE_ELEMENT", pageId: currentPage.id, sectionId, columnIndex, elementId: selectedElement.id })}
            className="flex-1 py-1 text-[10px] font-medium rounded-lg bg-white/5 border border-red-400/20 text-red-400 hover:bg-red-500/10 hover:border-red-400/40 transition-all"
          >🗑 Hapus</button>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => setTab("content")}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${tab === "content" ? "bg-[#22c55e]/20 text-[#22c55e]" : "text-gray-400 hover:text-white"}`}
          >Konten</button>
          <button
            onClick={() => setTab("style")}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${tab === "style" ? "bg-[#22c55e]/20 text-[#22c55e]" : "text-gray-400 hover:text-white"}`}
          >Style</button>
        </div>
      </div>

      <div className="p-4">
        {tab === "content" ? (
          <div>
            {selectedElement.type === "heading" && <HeadingEditor element={selectedElement} updateContent={updateContent} updateStyle={updateStyle} renderField={renderField} />}
            {selectedElement.type === "text" && <TextEditor renderField={renderField} />}
            {selectedElement.type === "image" && <ImageEditor element={selectedElement} updateContent={updateContent} renderField={renderField} userId={user?.id ?? null} />}
            {selectedElement.type === "button" && <ButtonEditor renderField={renderField} />}
            {selectedElement.type === "video" && <VideoEditor renderField={renderField} />}
            {selectedElement.type === "spacer" && <SpacerEditor renderField={renderField} />}
            {selectedElement.type === "divider" && <DividerEditor renderField={renderField} />}
            {selectedElement.type === "icon" && <IconEditor renderField={renderField} />}
            {selectedElement.type === "features" && <FeaturesEditor element={selectedElement} updateContent={updateContent} renderField={renderField} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} />}
            {selectedElement.type === "pricing" && <PricingEditor element={selectedElement} updateContent={updateContent} renderField={renderField} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} />}
            {selectedElement.type === "testimonial" && <TestimonialEditor element={selectedElement} updateContent={updateContent} renderField={renderField} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} />}
            {selectedElement.type === "cta" && <CTAEditor element={selectedElement} updateContent={updateContent} renderField={renderField} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} />}
            {selectedElement.type === "stats" && <StatsEditor element={selectedElement} updateContent={updateContent} renderField={renderField} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} />}
            {selectedElement.type === "contactForm" && <ContactFormEditor element={selectedElement} updateContent={updateContent} renderField={renderField} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} />}
            {selectedElement.type === "maps" && <MapsEditor element={selectedElement} updateContent={updateContent} renderField={renderField} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} />}
            {selectedElement.type === "navbar" && <NavbarEditor element={selectedElement} updateContent={updateContent} renderField={renderField} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} handleAddLink={handleAddLink} handleRemoveLink={handleRemoveLink} userId={user?.id ?? null} />}
            {selectedElement.type === "footer" && <FooterEditor element={selectedElement} updateContent={updateContent} renderField={renderField} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} handleAddLink={handleAddLink} handleRemoveLink={handleRemoveLink} userId={user?.id ?? null} />}
            {selectedElement.type === "carousel" && <CarouselEditor element={selectedElement} updateContent={updateContent} renderField={renderField} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} userId={user?.id ?? null} />}
            {selectedElement.type === "accordion" && <AccordionEditor element={selectedElement} updateContent={updateContent} renderField={renderField} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} userId={user?.id ?? null} />}
            {selectedElement.type === "team" && <TeamEditor element={selectedElement} updateContent={updateContent} renderField={renderField} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} userId={user?.id ?? null} />}
            {selectedElement.type === "countdown" && <CountdownEditor element={selectedElement} updateContent={updateContent} renderField={renderField} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} handleItemChange={handleItemChange} userId={user?.id ?? null} />}
            {["animated-headline","blockquote","code-highlight","flip-box","hotspot","progress-tracker","share-buttons","checklist","gallery","lottie","star-rating","search","floating-buttons","breadcrumbs","off-canvas","slides","nested-carousel","video-playlist","table-of-contents","social-embed"].includes(selectedElement.type) && (
              <>
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
              </>
            )}
          </div>
        ) : (
          <div>
            {renderSection("Tata Letak", <>
              {renderStyleField("Alignment", "textAlign", "select", ["left", "center", "right"])}
              {["image", "video"].includes(selectedElement.type) && renderStyleField("Object Fit", "objectFit", "select", ["cover", "contain", "fill", "none", "scale-down"])}
              {["image", "video"].includes(selectedElement.type) && renderStyleField("Opacity", "opacity", "text")}
              {["heading", "text"].includes(selectedElement.type) && <>
                {renderStyleField("Warna Teks", "color", "color")}
                <FontSizeSlider value={selectedElement.styles.fontSize || "16px"} onChange={(v) => updateStyle("fontSize", v)} />
                {renderStyleField("Ketebalan", "fontWeight", "select", ["100","200","300","400","500","600","700","800","900"])}
                {renderStyleField("Font Family", "fontFamily", "select", fontOptions.map(f => f.value))}
              </>}
            </>)}
            {renderSection("Background", <>
              <ColorPicker value={selectedElement.styles.backgroundColor || ""} onChange={(v) => updateStyle("backgroundColor", v)} label="Warna Background" />
              {renderStyleField("Opacity Background", "bgOpacity", "text")}
              {["heading", "text", "button", "features", "pricing", "testimonial", "cta", "contactForm"].includes(selectedElement.type) && <>
                <div className="mb-2">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Gambar Background</label>
                  {selectedElement.styles.backgroundImage && (
                    <div className="relative mb-2 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                      <img src={selectedElement.styles.backgroundImage} alt="" className="w-full h-20 object-cover" />
                      <button onClick={() => updateStyle("backgroundImage", "")} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 text-white text-xs flex items-center justify-center hover:bg-red-500">×</button>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; try { const url = await compressAndUploadImage(file, user?.id ?? null); updateStyle("backgroundImage", url); } catch { const reader = new FileReader(); reader.onload = (ev) => { const dataUrl = ev.target?.result as string; updateStyle("backgroundImage", dataUrl); }; reader.readAsDataURL(file); } }} className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#22c55e]/20 file:text-[#22c55e] file:text-xs file:font-medium hover:file:bg-[#22c55e]/30" />
                </div>
                {renderStyleField("Ukuran Background", "backgroundSize", "select", ["cover", "contain", "auto", "100% 100%"])}
                {renderStyleField("Posisi Background", "backgroundPosition", "select", ["center", "top", "bottom", "left", "right", "top left", "top right", "bottom left", "bottom right"])}
                <div className="mb-3">
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">Gradient Background</label>
                  <GradientBuilder value={selectedElement.styles.backgroundGradient || ""} onChange={(v) => updateStyle("backgroundGradient", v)} />
                </div>
              </>}
            </>)}
            {renderSection("Spasi", <>
              {renderSpacingFields("Padding", { top: "paddingTop", bottom: "paddingBottom", left: "paddingLeft", right: "paddingRight" })}
              {renderSpacingFields("Margin", { top: "marginTop", bottom: "marginBottom", left: "marginLeft", right: "marginRight" })}
            </>)}
            {renderSection("Border", <>
              {renderStyleField("Radius Pojok Kiri Atas", "borderTopLeftRadius", "text")}
              {renderStyleField("Radius Pojok Kanan Atas", "borderTopRightRadius", "text")}
              {renderStyleField("Radius Pojok Kiri Bawah", "borderBottomLeftRadius", "text")}
              {renderStyleField("Radius Pojok Kanan Bawah", "borderBottomRightRadius", "text")}
              {renderStyleField("Lebar Border", "borderWidth", "text")}
              <ColorPicker value={selectedElement.styles.borderColor || ""} onChange={(v) => updateStyle("borderColor", v)} label="Warna Border" />
              {renderStyleField("Style Border", "borderStyle", "select", ["solid", "dashed", "dotted", "double", "none"])}
            </>)}
            {renderSection("Responsive", <>
              <div className="flex gap-2">
                {[
                  { key: "hideOnMobile", label: "Mobile", icon: "📱", desc: "< 640px" },
                  { key: "hideOnTablet", label: "Tablet", icon: "💻", desc: "640-1024px" },
                  { key: "hideOnDesktop", label: "Desktop", icon: "🖥", desc: "> 1024px" },
                ].map(({ key, label, icon, desc }) => {
                  const isActive = selectedElement.responsive?.[key as keyof typeof selectedElement.responsive];
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        const current = selectedElement.responsive || {};
                        dispatch({
                          type: "UPDATE_ELEMENT",
                          pageId: currentPage.id,
                          sectionId,
                          columnIndex,
                          elementId: selectedElement.id,
                          content: {},
                          styles: {},
                          responsive: { ...current, [key]: !isActive },
                        });
                      }}
                      className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-[10px] font-medium transition-all border ${
                        isActive
                          ? "bg-red-500/20 border-red-500/40 text-red-400"
                          : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-xs">{icon}</span>
                      <span>Sembunyi</span>
                      <span className="text-[8px] opacity-60">{label}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[9px] text-gray-600 mt-1">Toggle untuk menyembunyikan element di perangkat tertentu</p>
            </>)}
            {renderSection("Ukuran", <>
              {renderStyleField("Width", "width", "text")}
              {renderStyleField("Max Width", "maxWidth", "text")}
              {renderStyleField("Height", "height", "text")}
              {renderStyleField("Max Height", "maxHeight", "text")}
            </>)}
          </div>
        )}
      </div>
    </aside>
  );
}
