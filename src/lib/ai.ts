/**
 * AI Service — calls AI providers through our server-side proxy
 *
 * API key is stored in localStorage but routed through our Next.js API
 * to avoid CORS issues (especially for Groq).
 */

export type AIProvider = "gemini" | "groq";

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
}

export interface AIGenerateOptions {
  prompt: string;
  elementType: string;
  currentContent?: string;
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
 * Build a smart prompt for different element types
 */
function buildPrompt(elementType: string, userPrompt: string, currentContent?: string): string {
  const typeDescriptions: Record<string, string> = {
    heading: "Buatkan HEADING/JUDUL yang powerful, kreatif, dan menggugah. Gunakan bahasa yang menarik, metafora jika perlu, dan buat calon pelanggan merasa tertarik. Output hanya teks heading.",
    text: "Buatkan PARAGRAF deskripsi yang engaging, persuasif, dan kreatif. Gunakan storytelling, bahasa yang hidup dan emosional. Buat pembaca merasa terhubung dan ingin tahu lebih lanjut. Output hanya teks paragraf.",
    button: "Buatkan teks TOMBOL/CTA yang kreatif dan membuat orang ingin klik. Bisa playful, urgent, atau emosional. Contoh kreatif: 'Mulai Petualanganmu', 'Wujudkan Impianmu', 'Gabung Sekarang'. Output hanya teks tombol.",
    cta: "Buatkan konten untuk CTA (Call to Action) section yang meyakinkan dan emosional. Output JSON: { \"title\": \"...\", \"subtitle\": \"...\" }",
    testimonial: "Buatkan TESTIMONIAL yang autentik dan menyentuh. Output JSON array: [{ \"name\": \"...\", \"role\": \"...\", \"text\": \"...\", \"rating\": 5 }]",
    features: "Buatkan konten FITUR/LAYANAN yang meyakinkan. Output JSON: { \"title\": \"...\", \"items\": [{ \"title\": \"...\", \"desc\": \"...\" }] }",
    heading_text: "Buatkan HEADING dan PARAGRAF yang saling melengkapi. Output JSON: { \"heading\": \"...\", \"text\": \"...\" }",
  };

  const typeInstruction = typeDescriptions[elementType] || `Buatkan konten untuk ${elementType} yang kreatif dan engaging.`;

  let prompt = `Anda adalah copywriter kreatif kelas dunia. Anda ahli dalam menulis konten website yang memikat, persuasif, dan berkonversi tinggi.\n\n`;
  prompt += `Tugas: ${typeInstruction}\n\n`;
  prompt += `Kontek bisnis/pesanan user: "${userPrompt}"\n\n`;

  if (currentContent) {
    prompt += `Konten saat ini (jadikan inspirasi, bisa diabaikan jika tidak relevan): "${currentContent}"\n\n`;
  }

  prompt += "Bebaslah berkreasi! Buat konten yang benar-benar menarik dan profesional. Jangan takut untuk berbeda dan kreatif.\n";
  prompt += "Output hanya konten utamanya saja (tanpa markdown, backticks, atau kutipan).";

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
  const prompt = buildPrompt(options.elementType, options.prompt, options.currentContent);
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
  }
}

// ─── SECTION & PAGE GENERATION ───

/**
 * Prompt AI to generate a section structure (via proxy)
 */
export async function generateSection(
  config: AIConfig,
  userPrompt: string
): Promise<string> {
  const prompt = `Anda adalah desainer website kreatif kelas dunia. Buatkan SATU section website yang memukau berdasarkan permintaan berikut.

Permintaan: ${userPrompt}

Gunakan elemen-elemen yang paling tepat: heading, text, image, button, icon, features, testimonial, stats, cta, divider, spacer.

Berikut contoh format JSON yang harus diikuti. KONTEN-nya silakan buat sekreatif mungkin!
{
  "sectionType": "hero",
  "title": "Nama Section",
  "styles": {
    "backgroundColor": "#0f172a",
    "padding": "80px 0",
    "containerWidth": "boxed"
  },
  "columns": [
    {
      "width": 12,
      "elements": [
        { "type": "heading", "content": { "text": "Judul Kreatif di Sini", "level": "h1", "align": "center" }, "styles": { "color": "#ffffff", "fontSize": "48px", "fontWeight": "800", "textAlign": "center" } },
        { "type": "text", "content": { "text": "Deskripsi yang menarik dan persuasif..." }, "styles": { "color": "#94a3b8", "fontSize": "18px", "textAlign": "center" } },
        { "type": "button", "content": { "text": "CTA Kreatif", "href": "#", "variant": "primary" }, "styles": { "backgroundColor": "#22c55e", "color": "#ffffff", "padding": "14px 32px", "borderRadius": "12px" } }
      ]
    }
  ]
}

PENTING:
- Output HANYA JSON, tanpa markdown, backticks, atau teks lain
- KONTEN harus KREATIF dan orisinil, jangan pakai placeholder
- Warna harus sesuai dengan tema bisnis yang diminta user
- Konten relevan dengan permintaan user
- Gunakan placehold.co untuk gambar jika perlu: https://placehold.co/800x500/1e293b/64748b?text=Judul`;

  return callAIProxy(config, prompt, "generate");
}

/**
 * Prompt AI to generate a full page with multiple sections (via proxy)
 */
export async function generateFullPage(
  config: AIConfig,
  userPrompt: string
): Promise<string> {
  const prompt = `Anda adalah desainer website kreatif kelas dunia. Buatkan halaman website LENGKAP yang memukau berdasarkan permintaan berikut.

Permintaan: ${userPrompt}

Buat 4-6 section yang membangun cerita yang kohesif. Setiap section harus punya tujuan jelas dan mengalir dengan natural.

Gunakan elemen yang paling tepat: heading, text, image, button, icon, features, testimonial, stats, cta, divider, spacer, navbar, footer, pricing, contactForm.

Berikut format JSON yang harus diikuti. KONTEN-nya bebas sekreatif mungkin!
[
  {
    "sectionType": "hero",
    "styles": { "backgroundColor": "#0f172a", "padding": "100px 0", "containerWidth": "boxed" },
    "columns": [
      {
        "width": 12,
        "elements": [
          { "type": "heading", "content": { "text": "Judul Hero Kreatif", "level": "h1", "align": "center" }, "styles": { "color": "#ffffff", "fontSize": "48px", "fontWeight": "800", "textAlign": "center" } },
          { "type": "text", "content": { "text": "Deskripsi yang memikat..." }, "styles": { "color": "#94a3b8", "textAlign": "center" } },
          { "type": "button", "content": { "text": "CTA Menarik", "href": "#", "variant": "primary" }, "styles": { "backgroundColor": "#22c55e", "color": "#ffffff", "padding": "14px 32px", "borderRadius": "12px" } }
        ]
      }
    ]
  },
  {
    "sectionType": "features",
    "styles": { "backgroundColor": "transparent", "padding": "80px 0", "containerWidth": "boxed" },
    "columns": [
      {
        "width": 12,
        "elements": [
          { "type": "features", "content": { "title": "Fitur Unggulan", "subtitle": "Mengapa memilih kami", "titleColor": "#1e293b", "titleSize": "36px", "items": [ { "icon": "🚀", "title": "Inovasi", "desc": "Deskripsi unik dan kreatif..." } ] }, "styles": { "padding": "0" } }
        ]
      }
    ]
  }
]

PENTING:
- Output HANYA JSON array, tanpa markdown, backticks, atau teks lain
- KONTEN harus KREATIF dan orisinil, jangan gunakan teks placeholder
- Gunakan skema warna KONSISTEN di semua section
- Section pertama = hero yang kuat
- Features/testimonial/pricing untuk showcasing value
- CTA section untuk ajakan action
- Footer di akhir
- Konten relevan dengan permintaan user
- placehold.co untuk gambar: https://placehold.co/800x500/1e293b/64748b?text=Judul`;

  return callAIProxy(config, prompt, "generate");
}
