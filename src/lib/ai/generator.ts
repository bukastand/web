/**
 * Simple Website Generator
 *
 * Architecture (instead of multi-agent pipeline):
 *   1. Template Engine → generate structure (sections, layout, element types)
 *   2. AI (1 call)     → fill content into structure (headings, text, features, etc.)
 *   3. AI (1 call)     → follow-up: modify content or add sections per user request
 *
 * No multi-agent. Maximum 1-2 AI calls per generation. Fast & efficient.
 */

import type { AIConfig } from "@/lib/ai";
import { getAllAIConfigs } from "@/lib/ai";
import { generateFromPromptJSON } from "@/lib/builder/template-engine";
import type { BuilderSection } from "@/lib/builder/types";

// ─── Types ───────────────────────────────────────────

export interface GenerateCallbacks {
  onStatus: (message: string) => void;
  onPreviewUpdate: (jsonOutput: string) => void;
  onError: (error: string) => void;
}

// ─── AI Proxy Call ─────────────────────────────────

async function callAI(
  config: AIConfig,
  prompt: string,
  signal?: AbortSignal
): Promise<string> {
  // Build provider list with auto-fallback from all stored keys
  const allConfigs = getAllAIConfigs();
  const providers = allConfigs.length > 0
    ? allConfigs.map((c) => ({ provider: c.provider, apiKey: c.apiKey }))
    : [{ provider: config.provider, apiKey: config.apiKey }];

  const res = await fetch("/api/ai/proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      providers,
      prompt,
      action: "generate",
    }),
  });

  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `AI request failed (${res.status})`);
  }

  return data.content || "";
}

// ─── Extract JSON from AI response ────────────────

function extractJSON(text: string): string {
  let cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .replace(/`+/g, "")
    .trim();

  const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
  if (arrayMatch) return arrayMatch[0];

  const objMatch = cleaned.match(/\{[\s\S]*\}/);
  if (objMatch) return objMatch[0];

  return cleaned;
}

// ─── Generate Content Prompt ─────────────────────

function buildContentPrompt(
  userPrompt: string,
  templateSections: BuilderSection[],
  isFollowUp: boolean = false,
  existingJSON?: string
): string {
  const sectionSummary = templateSections
    .map((s, i) => `  Section ${i + 1}: ${s.columns.map((c) => c.elements.map((e) => e.type).join(", ")).join(" | ")}`)
    .join("\n");

  if (isFollowUp && existingJSON) {
    return `ANDA ADALAH DESAINER WEB PROFESIONAL — setara dengan tim kreatif agency digital terkemuka.

Anda sedang memodifikasi website yang SUDAH ADA berdasarkan permintaan user.

PERMINTAAN USER: "${userPrompt}"

STRUKTUR WEBSITE SAAT INI (JSON):
${existingJSON.substring(0, 5000)}

TUGAS ANDA:
1. Baca permintaan user dengan seksama
2. Jika minta UBAH konten → edit content yang sesuai di JSON
3. Jika minta TAMBAH section → buat section baru dengan element type yang tersedia
4. Jika minta HAPUS → hapus section yang dimaksud
5. Jika minta UBAH warna/style → update styles di JSON

PANDUAN ELEMENT TYPE:
- heading: { "text": "judul", "level": "h1|h2|h3", "align": "center|left" }
- text: { "text": "paragraf..." }
- button: { "text": "aksi", "href": "#", "variant": "primary" }
- image: { "src": "url", "alt": "deskripsi" }
- features: { "title": "judul", "items": [{ "icon": "🚀", "title": "nama", "desc": "deskripsi" }], "columns": 3 }
- testimonial: { "items": [{ "name": "Nama", "role": "Role", "text": "testimoni...", "rating": 5 }] }
- pricing: { "items": [{ "name": "Paket", "price": "Rp 99K", "features": ["Fitur"], "highlighted": false }] }
- stats: { "items": [{ "value": "50+", "label": "Project" }] }
- cta: { "title": "judul CTA", "subtitle": "subtitle", "buttonText": "tombol" }
- contactForm: { "title": "Hubungi Kami", "fields": ["name", "email", "phone", "message"] }
- footer: { "logo": "NAMA", "description": "...", "socials": [...], "copyright": "..." }
- navbar: { "logo": "NAMA", "links": [...], "ctaText": "..." }
- accordion: { "items": [{ "question": "...", "answer": "..." }] }
- team: { "members": [{ "name": "...", "role": "...", "image": "..." }] }
- carousel: { "slides": [{ "image": "...", "caption": "..." }] }
- maps: { "title": "Lokasi", "embedUrl": "...", "address": "Jl. Contoh" }
- countdown: { "title": "Menuju Launch", "targetDate": "2025-12-31" }
- video: { "url": "https://www.youtube.com/embed/...", "caption": "..." }
- animated-headline: { "beforeText": "Saya", "highlightedText": "Profesional", "afterText": "", "rotatingTexts": ["Kreatif"], "style": "highlight", "animationType": "underline" }
- blockquote: { "quoteText": "Kutipan...", "authorName": "Nama", "skin": "border" }
- flip-box: { "frontTitle": "Judul Depan", "frontDescription": "Desc", "backTitle": "Judul Belakang", "backDescription": "Desc", "backButtonText": "Pelajari" }
- hotspot: { "imageSrc": "url", "items": [{ "label": "Titik 1", "x": "50%", "y": "50%", "description": "Info" }] }
- progress-tracker: { "label": "Skill", "progress": 75, "type": "horizontal" }
- checklist: { "title": "Daftar", "items": [{ "text": "Item", "checked": true }] }
- gallery: { "title": "Galeri", "columns": 3, "images": [{ "src": "...", "caption": "Foto" }] }
- star-rating: { "title": "Rating", "rating": 4.5, "scale": 5 }
- search: { "placeholder": "Cari...", "buttonText": "Cari" }
- slides: { "slides": [{ "title": "Slide 1", "description": "...", "image": "...", "buttonText": "Pelajari" }] }
- nested-carousel: { "title": "Portofolio", "slides": [{ "title": "Project", "description": "...", "image": "..." }] }
- video-playlist: { "title": "Video", "videos": [{ "title": "Video 1", "url": "...", "duration": "3:45" }] }
- lottie: { "src": "animation.json", "loop": true, "autoplay": true }
- breadcrumbs: { "items": [{ "label": "Beranda", "href": "/" }], "separator": "/" }
- off-canvas: { "title": "Menu", "position": "right", "items": [{ "label": "Beranda", "href": "#" }] }
- share-buttons: { "networks": [{ "name": "facebook" }], "skin": "minimal" }
- social-embed: { "type": "facebook-page", "url": "...", "title": "Facebook" }
- table-of-contents: { "title": "Daftar Isi", "items": [{ "text": "Pendahuluan", "level": 2, "href": "#" }] }
- floating-buttons: { "position": "bottom-right", "buttons": [{ "icon": "whatsapp", "link": "https://wa.me/...", "color": "#22c55e" }] }
- code-highlight: { "language": "javascript", "code": "console.log('Hello');" }
- spacer: { "height": "40px" }
- divider: { "style": "solid", "color": "rgba(255,255,255,0.1)" }
- icon: { "icon": "star", "size": "48px", "color": "#22c55e" }

⚠️ ATURAN PENTING:
- Gunakan bahasa Indonesia yang profesional dan lugas
- JANGAN metafora, puisi, atau bahasa kiasan
- JANGAN konten kosong — setiap element WAJIB punya content terisi
- Nama Indonesia asli (Budi, Sari, Andi, Rina — bukan John Doe)
- Nomor WA: 6282210099969
- Jika tidak ada perubahan pada suatu element, biarkan apa adanya
- Output HANYA JSON array (tanpa markdown/backticks)`;
  }

  return `ANDA ADALAH DESAINER WEB PROFESIONAL — setara dengan tim kreatif agency digital terkemuka.
Anda membuat website yang profesional, informatif, dan meyakinkan.

PERMINTAAN USER: "${userPrompt}"

STRUKTUR WEBSITE (template — isi kontennya!):
${sectionSummary}

TUGAS ANDA:
Isi KONTEN untuk setiap element di struktur di atas. Gunakan template JSON di bawah sebagai panduan:
${JSON.stringify(templateSections, null, 2).substring(0, 6000)}

⚠️ ATURAN PALING PENTING:
1. SETIAP element WAJIB punya "content" yang TERISI penuh — JANGAN ADA YANG KOSONG!
2. Gunakan bahasa Indonesia profesional, lugas, dan meyakinkan
3. Heading: langsung ke inti, informatif
4. Body text: deskriptif, faktual
5. CTA: ajakan langsung ("Hubungi Kami", "Konsultasi Gratis")
6. Testimonial: natural, seperti ulasan Google Maps
7. Nama Indonesia asli (Budi, Sari, Andi, Rina)
8. WA: 6282210099969

❌ LARANGAN:
- TIDAK BOLEH metafora, puisi, bahasa kiasan
- TIDAK BOLEH "Lorem ipsum"
- TIDAK BOLEH konten kosong
- TIDAK BOLEH mengubah struktur section/kolom — hanya ubah content dan styles

Output HANYA JSON array (tanpa markdown/backticks).`;
}

// ─── Parse result into sections ─────────────────

export function parseResultToSections(rawJSON: string): any[] {
  try {
    const cleaned = extractJSON(rawJSON);
    let data = JSON.parse(cleaned);

    if (Array.isArray(data)) {
      return data.filter((s: any) => s && typeof s === "object" && (s.columns || s.styles));
    }

    if (data.sections && Array.isArray(data.sections)) {
      return data.sections;
    }

    if (data.styles || data.columns || data.sectionType) {
      return [data];
    }

    return [];
  } catch {
    return [];
  }
}

// ─── Main Generator ──────────────────────────────

export async function generateWebsite(
  config: AIConfig,
  prompt: string,
  callbacks: GenerateCallbacks,
  signal?: AbortSignal,
  existingJSON?: string
): Promise<string> {
  const isFollowUp = !!existingJSON;

  if (isFollowUp) {
    // ── FOLLOW-UP: AI langsung modify existing JSON ──
    callbacks.onStatus("Memproses perubahan...");
    const aiPrompt = buildContentPrompt(prompt, [], true, existingJSON);
    const raw = await callAI(config, aiPrompt, signal);
    return extractJSON(raw);
  }

  // ── FRESH GENERATION: Template Engine → AI Content ──
  callbacks.onStatus("Membangun struktur website...");

  // Step 1: Template engine generates structure (0 API call)
  const templateSections = generateFromPromptJSON(prompt);
  let sections: BuilderSection[];
  try {
    sections = JSON.parse(templateSections);
  } catch {
    sections = [];
  }

  if (sections.length === 0) {
    throw new Error("Template engine gagal menghasilkan struktur. Coba dengan deskripsi yang lebih jelas.");
  }

  callbacks.onPreviewUpdate(templateSections);
  callbacks.onStatus("Menulis konten website dengan AI...");

  // Step 2: AI fills content into the structure
  const aiPrompt = buildContentPrompt(prompt, sections, false);
  const raw = await callAI(config, aiPrompt, signal);

  const finalJSON = extractJSON(raw);
  callbacks.onPreviewUpdate(finalJSON);

  return finalJSON;
}
