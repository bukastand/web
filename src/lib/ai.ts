/**
 * AI Service — calls AI providers through our server-side proxy
 *
 * API key is stored in localStorage but routed through our Next.js API
 * to avoid CORS issues (especially for Groq).
 */

export type AIProvider = "gemini" | "groq" | "openai" | "claude" | "deepseek" | "mistral";

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  /** Optional model override for paid providers */
  model?: string;
}

export interface AIGenerateOptions {
  prompt: string;
  elementType: string;
  currentContent?: string;
  /** Style element saat ini — biar AI bisa saranin perubahan desain */
  currentStyles?: Record<string, string>;
  /** Konteks section tempat element berada — biar AI paham konteksnya */
  sectionContext?: {
    sectionType?: string;
    sectionStyles?: string;
    nearbyElements: string;
    pageTitle?: string;
    pageDescription?: string;
    /** Info layout kolom */
    columnWidth?: number;
    columnTotal?: number; // berapa kolom total di section
  };
}

const STORAGE_KEY = "pagoda_ai_config";

const PROXY_URL = "/api/ai/proxy";

export function getAIConfig(): AIConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAIConfig(config: AIConfig) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function clearAIConfig() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Build a smart prompt for editing elements — dengan FULL konteks + desain element
 * AI bisa saranin perubahan konten DAN style (warna, ukuran, alignment, dll)
 */
function buildPrompt(
  elementType: string,
  userPrompt: string,
  currentContent?: string,
  sectionContext?: AIGenerateOptions['sectionContext'],
  currentStyles?: Record<string, string>
): string {
  // Bangun narasi konteks yang kaya
  let contextNarrative = '';
  
  if (sectionContext) {
    contextNarrative += '\n--- KONTEKS HALAMAN ---\n';
    if (sectionContext.pageTitle) {
      contextNarrative += `Judul halaman: ${sectionContext.pageTitle}\n`;
    }
    
    contextNarrative += `\n--- LOKASI ELEMENT ---\n`;
    contextNarrative += `Section: ${sectionContext.sectionType || '(section)'}\n`;
    
    if (sectionContext.sectionStyles) {
      contextNarrative += `Desain section: ${sectionContext.sectionStyles}\n`;
    }
    
    if (sectionContext.columnWidth && sectionContext.columnTotal) {
      contextNarrative += `Layout kolom: lebar ${sectionContext.columnWidth}/12 (total ${sectionContext.columnTotal} kolom)\n`;
    }
    
    if (sectionContext.nearbyElements) {
      contextNarrative += `\n--- ELEMEN LAIN DI SECTION INI ---\n${sectionContext.nearbyElements}\n`;
    }
  }
  
  // Info style element saat ini
  let stylesNarrative = '';
  if (currentStyles && Object.keys(currentStyles).length > 0) {
    const styleLines = Object.entries(currentStyles)
      .filter(([k, v]) => v && !k.includes('Id') && !k.includes('id'))
      .map(([k, v]) => `  ${k}: "${v}"`);
    if (styleLines.length > 0) {
      stylesNarrative = `\n--- DESAIN ELEMENT SAAT INI ---\n${styleLines.join('\n')}\n`;
      stylesNarrative += '\nAnda BEBAS mengubah desain ini (warna, ukuran, alignment, dll) agar lebih cocok dengan permintaan user.';
    }
  }

  const elementLabels: Record<string, string> = {
    heading: 'HEADING (judul besar)',
    text: 'PARAGRAF TEKS',
    button: 'TOMBOL/CTA',
    features: 'SECTION FITUR',
    testimonial: 'TESTIMONIAL',
    pricing: 'SECTION HARGA',
    cta: 'CALL TO ACTION',
    stats: 'STATISTIK',
    icon: 'IKON',
  };

  const prompt = `Anda adalah desainer + copywriter jenius. Anda tidak hanya menulis konten yang memukau, tetapi juga PAHAM DESAIN — warna, tipografi, tata letak, dan harmoni visual.

Tugas Anda: edit ${elementLabels[elementType] || elementType} ini berdasarkan perintah user. Anda boleh mengubah kontennya DAN/ATAU desain visualnya (warna, ukuran font, alignment, background, dll).${contextNarrative}${stylesNarrative}

--- PEDOMAN KREATIF ---
- Konten harus orisinil, bermakna, dan tidak klise
- Desain harus HARMONIS dengan section di sekitarnya
- Jika user minta perubahan warna/gaya, sesuaikan
- Jangan ragu untuk mengubah style agar lebih baik

PERINTAH USER: "${userPrompt}"
${currentContent ? `Konten element SAAT INI: "${currentContent}"` : ''}

--- FORMAT OUTPUT ---
Output HANYA JSON (tanpa markdown, backticks, atau teks lain):

{
  "content": "teks baru yang Anda buat",
  "styles": {
    "color": "#warna_baru",
    "fontSize": "ukuran_baru",
    "fontWeight": "angka_atau_nama",
    "textAlign": "left | center | right",
    "backgroundColor": "#warna_latar",
    // ... properti style LAINNYA yang ingin diubah
  }
}

Jika Anda hanya ingin mengubah konten tanpa mengubah style, kirimkan styles sebagai object KOSONG.
Jika Anda hanya ingin mengubah style tanpa mengubah konten, kirimkan content sebagai string KOSONG.

INGAT: Ini adalah element ${elementType}. Sesuaikan konten dan desain dengan perintah user dan konteks section!`;

  return prompt;
}

/**
 * Call the AI provider through our server-side proxy
 */
async function callAIProxy(config: AIConfig, prompt: string, action: "generate" | "test" = "generate"): Promise<string> {
  const res = await fetch(PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provider: config.provider,
      apiKey: config.apiKey,
      prompt,
      action,
      model: config.model,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `AI request failed (${res.status})`);
  }

  if (action === "test") {
    return data.ok ? "ok" : "";
  }

  return data.content || "";
}

/**
 * Generate content using the configured AI provider (via proxy)
 */
export async function generateContent(
  config: AIConfig,
  options: AIGenerateOptions
): Promise<string> {
  const prompt = buildPrompt(options.elementType, options.prompt, options.currentContent, options.sectionContext, options.currentStyles);
  return callAIProxy(config, prompt, "generate");
}

/**
 * Test API key by making a simple call through the proxy
 */
export async function testApiKey(config: AIConfig): Promise<boolean> {
  try {
    const result = await callAIProxy(config, "OK", "test");
    return result === "ok";
  } catch {
    return false;
  }
}

/**
 * Get a link to get a free API key
 */
export function getApiKeyUrl(provider: AIProvider): string {
  switch (provider) {
    case "gemini":
      return "https://aistudio.google.com/apikey";
    case "groq":
      return "https://console.groq.com/keys";
    case "openai":
      return "https://platform.openai.com/api-keys";
    case "claude":
      return "https://console.anthropic.com/settings/keys";
    case "deepseek":
      return "https://platform.deepseek.com/api_keys";
    case "mistral":
      return "https://console.mistral.ai/api-keys";
  }
}

export function getProviderDefaultModel(provider: AIProvider): string {
  switch (provider) {
    case "gemini": return "gemini-3.5-flash";
    case "groq": return "llama-3.3-70b-versatile";
    case "openai": return "gpt-4o";
    case "claude": return "claude-sonnet-4-6";
    case "deepseek": return "deepseek-v4-flash";
    case "mistral": return "mistral-large-3";
  }
}

// ─── SECTION & PAGE GENERATION ───

/**
 * Prompt AI to generate a single creative section (via proxy)
 * True creative freedom — no rigid templates
 * CRITICAL: AI MUST fill all element content — no empty objects!
 */
export async function generateSection(
  config: AIConfig,
  userPrompt: string
): Promise<string> {
  const prompt = `Anda adalah seniman web visioner — perpaduan antara desainer grafis, arsitek, dan penyair.

Tugas: Buatlah SATU section website yang SPEKTAKULER.

PERMINTAAN: "${userPrompt}"

⚠️ ATURAN PALING PENTING — SETIAP ELEMEN HARUS PUNYA KONTEN! ⚠️

JANGAN PERNAH membuat element dengan content kosong! Ini contoh SALAH:
❌ { "type": "heading", "content": {}, "styles": {} }
❌ { "type": "text", "content": {}, "styles": {} }

Ini contoh BENAR — setiap element HARUS punya konten yang diisi:
✅ heading → { "type": "heading", "content": { "text": "Heading Kreatif di Sini", "level": "h2", "align": "center" }, "styles": { "color": "#ffffff", "fontSize": "48px", "fontWeight": "800" } }
✅ text → { "type": "text", "content": { "text": "Paragraf deskripsi yang bermakna dan orisinal..." }, "styles": { "color": "#94a3b8", "fontSize": "18px" } }
✅ button → { "type": "button", "content": { "text": "Mulai Sekarang", "href": "#", "variant": "primary" }, "styles": { "backgroundColor": "#22c55e", "color": "#ffffff" } }
✅ image → { "type": "image", "content": { "src": "https://placehold.co/800x600/1e293b/64748b?text=Judul+Gambar", "alt": "Deskripsi gambar" }, "styles": { "borderRadius": "12px" } }
✅ features → { "type": "features", "content": { "title": "Judul Fitur", "subtitle": "Subtitle", "items": [{ "icon": "🚀", "title": "Nama Fitur", "desc": "Deskripsi fitur" }], "columns": 3 }, "styles": {} }
✅ testimonial → { "type": "testimonial", "content": { "title": "Apa Kata Klien", "items": [{ "name": "Nama", "role": "Role", "text": "Testimoni asli...", "rating": 5, "avatar": "NA" }] }, "styles": {} }
✅ cta → { "type": "cta", "content": { "title": "Judul CTA", "subtitle": "Subtitle", "buttonText": "Teks Tombol", "buttonHref": "#" }, "styles": { "backgroundColor": "#22c55e" } }
✅ stats → { "type": "stats", "content": { "items": [{ "value": "50+", "label": "Project" }], "columns": 4 }, "styles": {} }
✅ icon → { "type": "icon", "content": { "icon": "star", "size": "48px", "color": "#22c55e" }, "styles": {} }
✅ pricing → { "type": "pricing", "content": { "title": "Paket Harga", "items": [{ "name": "Basic", "price": "Rp 99K", "desc": "Pemula", "features": ["1 Halaman"], "highlighted": false, "cta": "Pilih" }] }, "styles": {} }
✅ contactForm → { "type": "contactForm", "content": { "title": "Hubungi Kami", "subtitle": "Isi form", "fields": ["name", "email", "phone", "message"] }, "styles": {} }
✅ navbar → { "type": "navbar", "content": { "logo": "NAMA BRAND", "links": [{ "label": "Beranda", "href": "#" }], "ctaText": "Hubungi", "ctaHref": "#" }, "styles": {} }
✅ footer → { "type": "footer", "content": { "logo": "NAMA BRAND", "description": "Deskripsi", "links": [{ "label": "Tentang", "href": "#" }], "socials": [{ "platform": "instagram", "url": "#" }], "copyright": "© 2025 Nama Brand. All rights reserved." }, "styles": {} }

⚠️ LARANGAN MUTLAK: content KOSONG! ⚠️
Setiap element.type HARUS punya content yang diisi dengan properti yang sesuai.

--- TEKNIK KREATIF (pilih yang cocok) ---
→ Broken grid, Overlapping, Slanted/Diagonal, Glassmorphism
→ Typo-centric, Split screen, Floating elements
→ Gradient mesh, Monochromatic, Color blocks
→ Minimalist, Playful, Editorial

--- FORMAT OUTPUT ---
Output HANYA JSON, tanpa markdown/backticks:

{
  "sectionType": "nama_section",
  "title": "Judul Section",
  "styles": {
    "backgroundColor": "#hexcolor",
    "padding": "...px 0",
    "containerWidth": "narrow | boxed | wide | full"
  },
  "columns": [
    {
      "width": 12,
      "elements": [
        {
          "type": "heading",
          "content": { "text": "ISI KONTEN DI SINI — JANGAN KOSONG!", "level": "h2", "align": "center" },
          "styles": { "color": "#ffffff", "fontSize": "36px", "fontWeight": "700", "textAlign": "center" }
        }
      ]
    }
  ]
}

INGAT: content TIDAK BOLEH kosong! Setiap element HARUS punya konten! Jangan buat user kecewa.`;

  return callAIProxy(config, prompt, "generate");
}

/**
 * Prompt AI to generate a full page with multiple sections (via proxy)
 * AI has total freedom — but CRITICAL: all elements MUST have filled content!
 */
export async function generateFullPage(
  config: AIConfig,
  userPrompt: string
): Promise<string> {
  const prompt = `Anda adalah direktur kreatif dari agency desain termahal. Setiap website yang Anda ciptakan adalah mahakarya. Bukan sekadar kode — ini adalah seni yang hidup.

Tugas: Ciptakan SATU halaman website UTUH yang TAK TERLUPAKAN.

BRIEF KLIEN: "${userPrompt}"

⚠️ ATURAN PALING PENTING — SETIAP ELEMEN HARUS PUNYA KONTEN! ⚠️

JANGAN PERNAH membuat element dengan content kosong! Ini contoh SALAH:
❌ { "type": "heading", "content": {}, "styles": {} }
❌ { "type": "text", "content": {}, "styles": {} }
❌ { "type": "button", "content": { "text": "" }, "styles": {} }

WAJIB — setiap element HARUS punya konten seperti contoh di bawah:
✅ heading → content: { "text": "Teks Heading Asli", "level": "h2", "align": "center" }
✅ text → content: { "text": "Paragraf deskripsi yang orisinal dan bermakna..." }
✅ button → content: { "text": "Aksi yang Diinginkan", "href": "#", "variant": "primary" }
✅ image → content: { "src": "https://placehold.co/800x600/1e293b/64748b?text=Judul", "alt": "Deskripsi" }
✅ features → content: { "title": "Judul Fitur", "items": [{ "icon": "🚀", "title": "Nama Fitur", "desc": "Deskripsi" }], "columns": 3 }
✅ testimonial → content: { "items": [{ "name": "Nama", "role": "Role", "text": "Testimoni...", "rating": 5 }] }
✅ pricing → content: { "items": [{ "name": "Paket", "price": "Rp 99K", "desc": "...", "features": ["Fitur 1"], "highlighted": false, "cta": "Pilih" }] }
✅ stats → content: { "items": [{ "value": "50+", "label": "Project" }] }
✅ cta → content: { "title": "Judul CTA", "subtitle": "Subtitle", "buttonText": "Teks", "buttonHref": "#" }
✅ navbar → content: { "logo": "NAMA BRAND", "links": [{ "label": "Beranda", "href": "#" }], "ctaText": "Hubungi", "ctaHref": "#" }
✅ footer → content: { "logo": "NAMA BRAND", "description": "...", "links": [...], "socials": [...], "copyright": "© 2025..." }
✅ contactForm → content: { "title": "Hubungi Kami", "subtitle": "Isi form", "fields": ["name", "email", "phone", "message"] }

⚠️ LARANGAN: content {} KOSONG! Setiap element HARUS diisi konten! ⚠️

--- STRATEGI HALAMAN ---
Buat 5-7 section:
1. PEMBUKA — hero yang mencengangkan
2-4. VALUE — fitur/layanan, testimonial, statistik
5. PENUTUP — CTA yang membuat orang ingin action
6. FOOTER — lengkap dengan links & sosial media

--- TEKNIK DESAIN ---
Layout: Split, Asymmetric, Full-bleed, Zigzag, Masonry, Sidebar
Visual: Gradients, Glassmorphism, Color blocking, Large typography, Shadow layering

--- FORMAT OUTPUT ---
Output HANYA JSON array, tanpa markdown/backticks:

[
  {
    "sectionType": "hero",
    "title": "Judul Section",
    "styles": {
      "backgroundColor": "#hexcolor",
      "padding": "...px 0",
      "containerWidth": "narrow | boxed | wide | full"
    },
    "columns": [
      {
        "width": 12,
        "elements": [
          {
            "type": "heading",
            "content": { "text": "ISI KONTEN — JANGAN KOSONG!", "level": "h2", "align": "center" },
            "styles": { "color": "#ffffff", "fontSize": "36px", "fontWeight": "700", "textAlign": "center" }
          }
        ]
      }
    ]
  }
]

INGAT: setiap element WAJIB punya content terisi! Content {} kosong itu TIDAK BOLEH!`;

  return callAIProxy(config, prompt, "generate");
}
