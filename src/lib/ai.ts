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
  }
}

// ─── SECTION & PAGE GENERATION ───

/**
 * Prompt AI to generate a single creative section (via proxy)
 * True creative freedom — no element type enumeration, no rigid templates
 */
export async function generateSection(
  config: AIConfig,
  userPrompt: string
): Promise<string> {
  const prompt = `Anda adalah seniman web visioner — perpaduan antara desainer grafis, arsitek, dan penyair. Ketika orang melihat hasil kerja Anda, mereka berkata "Ini bukan website, ini karya seni."

Tugas: Buatlah SATU section website yang SPEKTAKULER untuk permintaan berikut:

"${userPrompt}"

⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶ KEBEBASAN TOTAL ⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶

Anda tidak terikat pada elemen, layout, atau pola apapun. Ciptakan sesuatu yang BELUM PERNAH ADA SEBELUMNYA.

TEKNIK KREATIF YANG BISA DIGUNAKAN (pilih yang paling cocok):
→ Broken grid: elemen melompat keluar dari kolom standar
→ Overlapping: tumpuk elemen untuk depth dan dimensi
→ Slanted/Diagonal: section atau elemen miring 5-15 derajat
→ Organic shapes: background dengan bentuk organik (lingkaran, kurva, blob)
→ Glassmorphism: efek kaca buram dengan backdrop blur
→ Neubrutalism: border tebal, warna berani, shadow kasar
→ Typo-centric: tipografi BESAR sebagai hero visual
→ Split screen: dua sisi yang kontras
→ Floating elements: elemen yang terasa melayang dengan shadow
→ Gradient mesh: gradien kompleks multi-warna
→ Monochromatic: satu warna dengan berbagai shade
→ Color blocks: blok warna berani sebagai pemisah
→ Minimalist: banyak white space, satu fokus utama
→ Playful: ilustrasi, ikon besar, warna cerah, tipografi fun
→ Editorial: layout seperti majalah fashion

KONTEN:
- Setiap teks harus BERMAKNA dan ORISINIL — seolah ditulis oleh copywriter ternama
- Jika perlu gambar: https://placehold.co/800x600/1e293b/64748b?text=Judul
- Jangan gunakan teks placeholder apapun

⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶ FORMAT OUTPUT ⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶

Output HANYA JSON, tanpa markdown atau backticks. Strukturnya minimal:

{
  "sectionType": "nama_kreatif_untuk_section_ini",
  "title": "Judul section",
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
          "type": "heading | text | image | button | atau jenis elemen apapun yang ANDA pilih",
          "content": { ... },
          "styles": { "color": "#...", "fontSize": "...", dll }
        }
      ]
    }
  ]
}

"columns" bisa 1, 2, 3, atau lebih. "width" total harus 12.
Gunakan jenis elemen, konten, dan gaya SESUAI IMAJINASI ANDA.
Jangan takut BEDA. Biasa saja itu mudah — LUAR BIASA butuh nyali.`;

  return callAIProxy(config, prompt, "generate");
}

/**
 * Prompt AI to generate a full page with multiple sections (via proxy)
 * AI has total freedom to design the page structure, visual style, and content
 */
export async function generateFullPage(
  config: AIConfig,
  userPrompt: string
): Promise<string> {
  const prompt = `Anda adalah direktur kreatif dari agency desain termahal di dunia. Setiap website yang Anda ciptakan adalah mahakarya yang diperbincangkan orang. Bukan sekadar kode — ini adalah seni yang hidup.

Tugas: Ciptakan SATU halaman website UTUH yang TAK TERLUPAKAN.

BRIEF KLIEN: "${userPrompt}"

⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶ STRATEGI KREATIF ⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶

PERTAMA, pahami esensi bisnis ini:
→ Apa yang benar-benar mereka jual? (bukan produknya, tapi PERASAAN-nya)
→ Siapa target audiensnya? (apa yang membuat mereka tertarik?)
→ Apa personality brand-nya? (mewah? playful? minimalis? berani?)

KEDUA, rencanakan 5-7 section yang membangun CERITA:
1. PEMBUKA — section pertama harus MENCURI PERHATIAN dalam 0.5 detik
2. VALUE — bukti sosial, fitur, atau manfaat yang membuat orang ingin terus scrolling 
3. BUKTI — testimonial, statistik, klien, atau portofolio
4. HARGA atau LAYANAN — dengan cara penyajian yang tidak membosankan
5. PENUTUP — CTA yang membuat orang berkata "Saya ambil ini!"
6. FOOTER — lengkap, informatif, tetap stylish

⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶ TEKNIK DESAIN ⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶

Pilih dan variasikan teknik-teknik ini di setiap section:

LAYOUT VARIATIONS:
→ Split layout (50-50, 60-40, 30-70)
→ Asymmetric grid (kolom dengan lebar berbeda)
→ Full-bleed (full width) vs contained
→ Zigzag pattern (gambar-kiri, teks-kanan, bergantian)
→ Cards with varying heights (masonry-like)
→ Centered content with max-width
→ Two-column text (seperti majalah)
→ Sidebar content layout

VISUAL TECHNIQUES:
→ Bold gradients sebagai background
→ Glassmorphism (backdrop-blur, semi-transparan)
→ Large typography sebagai visual hero
→ Color blocking (kotak warna berani)
→ Subtle patterns atau texture
→ Shadow layering untuk depth
→ Border accents (garis tipis sebagai dekorasi)
→ Rounded corners ekstrim (30-60px)
→ Icon atau emoji sebagai aksen visual

COLOR PSYCHOLOGY:
→ Teknologi/Startup: biru, ungu, cyan, putih
→ Kesehatan/Kecantikan: hijau sage, pink, emas, putih
→ Makanan/Minuman: merah, oranye, kuning, coklat
→ Pendidikan: biru navy, emas, putih
→ Kreatif/Agen: warna berani, gradien, hitam-putih kontras
→ Mewah/Luxury: hitam, emas, putih, burgundy
→ Minimalis: putih, abu-abu, satu aksen warna

⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶ FORMAT OUTPUT ⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶

Output HANYA JSON array, tanpa markdown atau backticks:

[
  {
    "sectionType": "hero-atau-jenis-section",
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
            "type": "heading | text | image | button | atau jenis elemen apapun yang paling tepat",
            "content": { ... properti sesuai kreativitas Anda },
            "styles": { "color": "#...", "fontSize": "...", "backgroundColor": "...", "borderRadius": "...", dll }
          }
        ]
      }
    ]
  }
]

⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶ PEDOMAN KREATIF ⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶⊶

→ Variasikan LAYOUT setiap section — jangan semua 1 kolom
→ Variasikan WARNA setiap section — ada gelap, ada terang, untuk dinamika
→ Setiap TEKS harus bermakna — buat pembaca merasa sesuatu
→ Setiap section harus PUNYA TUJUAN — jangan asal ada
→ Section pertama harus POWERFUL — first impression menentukan segalanya
→ Testimonial harus KEDENGARAN seperti manusia sungguhan
→ CTA harus MEMBUAT orang ingin klik segera
→ Buat desain yang KONSISTEN — seolah satu tangan mengerjakan semua

INGAT: Anda bukan template filler. Anda adalah SENIMAN. Beranilah berbeda.`;

  return callAIProxy(config, prompt, "generate");
}
