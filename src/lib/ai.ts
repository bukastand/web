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
 * Build a smart prompt for different element types — kreatif & open-ended
 */
function buildPrompt(elementType: string, userPrompt: string, currentContent?: string): string {
  const prompt = `Anda adalah copywriter jenius dan puitis. Bukan sekadar menulis — Anda menciptakan emosi, koneksi, dan kenangan lewat kata-kata.

Tugas Anda: tulis ${elementType === "heading" ? "SEBUAH HEADING/JUDUL" : elementType === "text" ? "SEBUAH PARAGRAF DESKRIPSI" : elementType === "button" ? "SEBUAH TEKS TOMBOL/CTA" : `KONTEN ${elementType.toUpperCase()}`} yang TIDAK TERDUGA.

Aturan main:
- JANGAN pernah menulis "Selamat datang di..." atau "Kami adalah..." atau klise lainnya
- Gunakan metafora, personifikasi, permainan kata, atau sudut pandang unik
- Buat pembaca berhenti scroll. Buat mereka merasa sesuatu.
- Tulis seperti manusia kreatif, bukan seperti template AI
- Bebas, liar, tapi tetap relevan dengan konteks bisnis

Konteks bisnis: "${userPrompt}"
${currentContent ? `Konten saat ini (jadikan inspirasi, bisa diabaikan jika tidak relevan): "${currentContent}"` : ""}

Output HANYA konten utamanya saja (tanpa markdown, backticks, atau kutipan). Buat masterpiece!`;

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
 * Prompt AI to generate a single creative section (via proxy)
 * No rigid templates — AI is free to design its own layout and elements
 */
export async function generateSection(
  config: AIConfig,
  userPrompt: string
): Promise<string> {
  const prompt = `Anda adalah desainer website visioner — gabungan antara seniman dan pengembang. Bukan sekadar membuat section, Anda menciptakan pengalaman visual yang memukau.

Tugas: Buatlah SATU section website yang OUTSTANDING.

Permintaan klien: "${userPrompt}"

KEBEBASAN KREATIF:
- Anda BEBAS menentukan layout, komposisi, dan elemen apa pun
- Bisa 1 kolom, 2 kolom, 3 kolom, atau apapun yang Anda rasa paling tepat
- Gunakan heading, teks, gambar, tombol, ikon, atau apapun yang Anda mau
- Mainkan warna-warna berani, gradien, bayangan, atau efek visual lainnya
- Layout tidak harus simetris — asimetris bisa lebih menarik
- KONTEN harus orisinil, kreatif, dan relevan — jangan gunakan placeholder text

FORMAT OUTPUT:
Output HANYA JSON (tanpa markdown, backticks, atau teks lain) dengan struktur:

{
  "sectionType": "hero | features | testimonial | pricing | cta | about | contact | gallery | stats | custom | atau apapun yang kreatif!",
  "title": "Nama section yang deskriptif",
  "styles": {
    "backgroundColor": "#... (kode hex, atau transparan)",
    "padding": "...px 0",
    "containerWidth": "narrow | boxed | wide | full"
  },
  "columns": [
    {
      "width": 12 (atau 6+6, 4+4+4, 3+3+3+3, 7+5, 8+4, atau apapun yang totalnya 12),
      "elements": [
        {
          "type": "heading | text | image | button | icon | features | testimonial | pricing | stats | cta | contactForm | maps | navbar | footer | divider | spacer | carousel | accordion | team | countdown | video | atau jenis elemen kreatif lainnya",
          "content": { ... properti konten untuk elemen tersebut },
          "styles": { "color": "...", "fontSize": "...", "textAlign": "...", "backgroundColor": "...", dll }
        }
      ]
    }
  ]
}

KREATIVITAS ADALAH PRIORITAS UTAMA:
- Buat section yang terlihat MAHAL dan profesional
- Gunakan gradien, shadow, efek kaca (glassmorphism), atau gaya modern lainnya
- Pilih warna yang KONSISTEN dengan tema/tone bisnis yang diminta
- Setiap teks harus authentik dan bermakna — bukan Lorem Ipsum
- Jika perlu gambar, gunakan URL placehold.co: https://placehold.co/800x600/1e293b/64748b?text=Judul+Gambar
- Jangan takut untuk berbeda. Yang membosankan itu mudah — yang luar biasa butuh keberanian.`;

  return callAIProxy(config, prompt, "generate");
}

/**
 * Prompt AI to generate a full page with multiple sections (via proxy)
 * AI is free to design the entire page structure, layout, and content
 */
export async function generateFullPage(
  config: AIConfig,
  userPrompt: string
): Promise<string> {
  const prompt = `Anda adalah desainer web kelas dunia — setara dengan agency termahal. Anda mendesain website yang tidak hanya indah secara visual, tetapi juga bercerita dan membangun koneksi emosional.

Tugas: Buatlah SATU halaman website UTUH yang spektakuler.

Permintaan klien: "${userPrompt}"

PAHAMI BISNIS KLIEN:
- Pahami esensi bisnis mereka: apa yang mereka jual, kepada siapa, dan mengapa
- Pilih tone yang tepat: profesional, playful, mewah, minimalis, atau industrial
- Desain harus mencerminkan KEPRIBADIAN brand, bukan template generik

STRUKTUR HALAMAN:
Buat 4-8 section yang membangun narasi visual yang kuat:

1. SECTION PERTAMA = Hero/Pembuka yang MENCENGANGKAN
   - Buat first impression yang tak terlupakan
   - Bisa dengan heading besar, visual dramatis, interaksi unik
   
2. SECTION KEDUA-KEEMPAT = Value Proposition & Bukti
   - Fitur/layanan dengan cara penyajian yang kreatif
   - Testimonial yang autentik dan menyentuh
   - Statistik atau pencapaian yang membangun kepercayaan
   
3. SECTION MENJELANG AKHIR = CTA/Penutup
   - Ajakan action yang sulit ditolak
   - Buat pengguna merasa "Saya HARUS memiliki ini!"
   
4. SECTION TERAKHIR = Footer
   - Navigasi, kontak, sosial media, copyright

KEBEBASAN DESAIN:
- Setiap section BEBAS menentukan layoutnya sendiri
- Mainkan variasi: 1 kolom, 2 kolom, split layout, grid, masonry, staggered
- Gunakan warna yang KONSISTEN di seluruh halaman
- Gradien, bayangan, efek kaca, border unik, SEMUANYA BOLEH!
- Jangan ragu menggunakan gaya modern: neumorphism, glassmorphism, brutalist, atau gaya Anda sendiri
- Layout tidak harus simetris — asimetri yang intentionaal itu indah

FORMAT OUTPUT:
Output HANYA JSON array (tanpa markdown, backticks, atau teks lain):

[
  {
    "sectionType": "hero | features | about | services | testimonial | pricing | stats | cta | gallery | contact | faq | team | footer | atau apapun yang kreatif",
    "title": "Nama section",
    "styles": {
      "backgroundColor": "#...",
      "padding": "...px 0",
      "containerWidth": "narrow | boxed | wide | full"
    },
    "columns": [
      {
        "width": 12,
        "elements": [
          {
            "type": "heading | text | image | button | icon | features | testimonial | pricing | stats | cta | contactForm | maps | navbar | footer | divider | spacer | carousel | accordion | team | countdown | video | atau jenis elemen kreatif lainnya",
            "content": { ... },
            "styles": { "color": "...", "fontSize": "...", dll }
          }
        ]
      }
    ]
  },
  ... (section lainnya)
]

PEDOMAN KREATIF:
- Jangan gunakan placeholder text — setiap kata harus bermakna
- Pilih skema warna yang mencerminkan emosi brand yang tepat
- Variasikan section: ada yang terang, ada yang gelap, untuk dinamika visual
- Hero section harus MENCURI PERHATIAN
- Testimonial harus KEDENGARAN asli, bukan buatan
- CTA harus MEMBUAT orang ingin klik
- Footer harus LENGKAP tapi tidak berantakan
- Buat orang yang melihatnya berkata: "Wow, ini keren sekali!"`;

  return callAIProxy(config, prompt, "generate");
}
