/**
 * AI Service — client-side API calls to Gemini & Groq
 *
 * Both providers support CORS, so we call them directly from the browser.
 * User's API key is stored in localStorage and never sent to our server.
 */

export type AIProvider = "gemini" | "groq";

// Model names — updated for 2026 compatibility
const GEMINI_MODEL = "gemini-2.5-flash";
const GROQ_MODEL = "llama-3.3-70b-versatile";

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
    heading: "Buatkan sebuah HEADING/JUDUL yang menarik, singkat, dan profesional. Hanya output teks heading saja, tanpa tambahan apapun.",
    text: "Buatkan teks PARAGRAF deskripsi yang informatif dan profesional, maksimal 3 kalimat. Hanya output teks paragraf saja.",
    button: "Buatkan teks TOMBOL/CTA yang singkat, action-oriented, dan meyakinkan. Maksimal 3-4 kata. Hanya output teks tombol saja.",
    cta: "Buatkan teks untuk CTA (Call to Action) section — judul yang kuat dan ajakan. Output dalam bentuk: { \"title\": \"...\", \"subtitle\": \"...\" }",
    testimonial: "Buatkan teks TESTIMONIAL singkat untuk website. Output dalam bentuk array JSON: [{ \"name\": \"...\", \"role\": \"...\", \"text\": \"...\", \"rating\": 5 }]",
    features: "Buatkan konten FITUR/LAYANAN. Output dalam bentuk JSON: { \"title\": \"...\", \"items\": [{ \"title\": \"...\", \"desc\": \"...\" }] }",
    heading_text: "Buatkan HEADING dan PARAGRAF yang saling melengkapi, profesional dan menarik. Output JSON: { \"heading\": \"...\", \"text\": \"...\" }",
  };

  const typeInstruction = typeDescriptions[elementType] || `Buatkan konten untuk ${elementType} yang profesional dan menarik.`;

  let prompt = `Anda adalah copywriter profesional untuk website. ${typeInstruction}\n\n`;
  prompt += `Permintaan user: ${userPrompt}\n\n`;

  if (currentContent) {
    prompt += `Konten saat ini (jadikan referensi jika berguna): "${currentContent}"\n\n`;
  }

  if (["cta", "testimonial", "features", "heading_text"].includes(elementType)) {
    prompt += "PENTING: Output HARUS dalam format JSON sesuai instruksi di atas. Jangan tambahkan markdown, backticks, atau teks lain di luar JSON.";
  } else {
    prompt += "PENTING: Output HANYA teks kontennya saja. Jangan tambahkan tanda kutip, markdown, atau kata pengantar apapun.";
  }

  return prompt;
}

/**
 * Call Gemini API from browser
 */
async function callGemini(config: AIConfig, prompt: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${config.apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
          topP: 0.95,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
        ],
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return text.trim();
}

/**
 * Call Groq API from browser
 */
async function callGroq(config: AIConfig, prompt: string): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: "Anda adalah copywriter profesional untuk website. Output harus sesuai permintaan." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.95,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content || "";
  return text.trim();
}

/**
 * Generate content using the configured AI provider
 */
export async function generateContent(
  config: AIConfig,
  options: AIGenerateOptions
): Promise<string> {
  const prompt = buildPrompt(options.elementType, options.prompt, options.currentContent);

  switch (config.provider) {
    case "gemini":
      return callGemini(config, prompt);
    case "groq":
      return callGroq(config, prompt);
    default:
      throw new Error(`Unknown AI provider: ${config.provider}`);
  }
}

/**
 * Test API key by making a simple call
 */
export async function testApiKey(config: AIConfig): Promise<boolean> {
  try {
    if (config.provider === "gemini") {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${config.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Katakan 'OK' jika API key berfungsi." }] }],
            generationConfig: { maxOutputTokens: 10 },
          }),
        }
      );
      return res.ok;
    } else {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [{ role: "user", content: "Say OK" }],
          max_tokens: 10,
        }),
      });
      return res.ok;
    }
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
 * Prompt AI to generate a section structure
 */
export async function generateSection(
  config: AIConfig,
  userPrompt: string
): Promise<string> {
  const prompt = `Anda adalah desainer website profesional. Buatkan SATU section website berdasarkan permintaan berikut.

Permintaan: ${userPrompt}

Buat section dengan elemen-elemen yang sesuai. Gunakan type yang tersedia: heading, text, image, button, icon, features, testimonial, stats, cta, divider, spacer.

Output HARUS berupa JSON dengan format PERSIS seperti ini (contoh untuk hero section):
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
        { "type": "heading", "content": { "text": "Judul Utama", "level": "h1", "align": "center" }, "styles": { "color": "#ffffff", "fontSize": "48px", "fontWeight": "800", "textAlign": "center" } },
        { "type": "text", "content": { "text": "Deskripsi singkat..." }, "styles": { "color": "#94a3b8", "fontSize": "18px", "textAlign": "center" } },
        { "type": "button", "content": { "text": "CTA Button", "href": "#", "variant": "primary" }, "styles": { "backgroundColor": "#22c55e", "color": "#ffffff", "padding": "14px 32px", "borderRadius": "12px" } }
      ]
    }
  ]
}

PENTING:
- Output HANYA JSON, tanpa markdown, backticks, atau teks lain
- Gunakan warna yang sesuai dengan tema bisnis
- Konten HARUS relevan dengan permintaan user
- Gunakan placehold.co untuk gambar jika perlu: https://placehold.co/800x500/1e293b/64748b?text=Gambar`;

  switch (config.provider) {
    case "gemini":
      return callGemini(config, prompt);
    case "groq":
      return callGroq(config, prompt);
  }
}

/**
 * Prompt AI to generate a full page with multiple sections
 */
export async function generateFullPage(
  config: AIConfig,
  userPrompt: string
): Promise<string> {
  const prompt = `Anda adalah desainer website profesional. Buatkan sebuah halaman website LENGKAP berdasarkan permintaan berikut.

Permintaan: ${userPrompt}

Buat 4-6 section yang membangun satu kesatuan halaman yang kohesif. Setiap section harus memiliki tujuan yang jelas.

Gunakan type element yang tersedia: heading, text, image, button, icon, features, testimonial, stats, cta, divider, spacer, navbar, footer, pricing, contactForm.

Output HARUS berupa JSON array dengan format PERSIS seperti ini:
[
  {
    "sectionType": "hero",
    "styles": { "backgroundColor": "#0f172a", "padding": "100px 0", "containerWidth": "boxed" },
    "columns": [
      {
        "width": 12,
        "elements": [
          { "type": "heading", "content": { "text": "Judul Hero", "level": "h1", "align": "center" }, "styles": { "color": "#ffffff", "fontSize": "48px", "fontWeight": "800", "textAlign": "center" } },
          { "type": "text", "content": { "text": "Deskripsi..." }, "styles": { "color": "#94a3b8", "textAlign": "center" } },
          { "type": "button", "content": { "text": "Mulai", "href": "#", "variant": "primary" }, "styles": { "backgroundColor": "#22c55e", "color": "#ffffff", "padding": "14px 32px", "borderRadius": "12px" } }
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
          { "type": "features", "content": { "title": "Fitur Kami", "subtitle": "...", "titleColor": "#1e293b", "titleSize": "36px", "items": [ { "icon": "🚀", "title": "Cepat", "desc": "..." } ] }, "styles": { "padding": "0" } }
        ]
      }
    ]
  }
]

PENTING:
- Output HANYA JSON array, tanpa markdown, backticks, atau teks lain
- Gunakan skema warna yang KONSISTEN di semua section
- Section pertama HARUS hero section yang menarik
- Features/testimonial/pricing section untuk showing value
- CTA section untuk ajakan action
- Footer section di akhir
- Konten HARUS relevan dengan permintaan user
- Gunakan placehold.co untuk gambar: https://placehold.co/800x500/1e293b/64748b?text=Nama`;

  switch (config.provider) {
    case "gemini":
      return callGemini(config, prompt);
    case "groq":
      return callGroq(config, prompt);
  }
}
