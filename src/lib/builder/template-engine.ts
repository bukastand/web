/**
 * Template Engine — generate website sections from user prompt WITHOUT AI API
 *
 * How it works:
 * 1. Parse user intent (keywords, categories, business type)
 * 2. Match to best-fit gallery template OR compose from builder templates
 * 3. Customize content (names, descriptions) based on prompt
 * 4. Return BuilderSection[] JSON compatible with the preview system
 *
 * 100% free, 0 API calls, instant response.
 */

import { builderTemplates, type BuilderTemplateDef } from "./templates";
import { genId } from "./defaults";
import type { BuilderSection } from "./types";

// ─── Types ───────────────────────────────────────────

export interface ParsedIntent {
  /** Primary category: bisnis, kreatif, toko, kesehatan, event, personal, makanan, teknologi */
  category: string;
  /** Detected business/website name from prompt */
  businessName: string;
  /** Style preference: modern, profesional, kreatif, playful, minimal */
  style: string;
  /** Color preference: hijau, biru, ungu, merah, orange, hitam, putih */
  colorHue: string;
  /** Ordered list of desired section types */
  sections: string[];
  /** Confidence score 0-1 */
  confidence: number;
  /** Original prompt for content generation */
  rawPrompt: string;
}

// ─── Keyword Maps ────────────────────────────────────

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  bisnis: ["bisnis", "perusahaan", "company", "corporate", "profil", "profile", "startup", "jasa", "service", "konsultan", "consultant", "agency", "b2b", "professional"],
  kreatif: ["kreatif", "creative", "portfolio", "portofolio", "desainer", "designer", "fotografer", "photographer", "artis", "artist", "studio", "agency kreatif"],
  makanan: ["makanan", "food", "restoran", "restaurant", "cafe", "kafe", "kuliner", "culinary", "warung", "kopi", "coffee", "bakery", "katering", "catering"],
  toko: ["toko", "store", "shop", "ecommerce", "e-commerce", "jual", "belanja", "shopping", "online shop", "produk", "product", "retail"],
  kesehatan: ["kesehatan", "health", "klinik", "clinic", "dokter", "doctor", "rumah sakit", "hospital", "fitness", "gym", "yoga", "beauty", "kecantikan"],
  event: ["event", "acara", "wedding", "pernikahan", "konferensi", "conference", "seminar", "workshop", "konser", "concert", "pameran", "exhibition"],
  teknologi: ["teknologi", "tech", "software", "aplikasi", "app", "saas", "digital", "it", "coding", "developer", "programming"],
  personal: ["personal", "pribadi", "cv", "resume", "curriculum vitae", "portofolio pribadi", "personal website", "blog", "vlog"],
};

const STYLE_KEYWORDS: Record<string, string[]> = {
  modern: ["modern", "kontemporer", "contemporary", "minimalis", "sleek", "clean"],
  profesional: ["profesional", "professional", "formal", "elegan", "elegant", "mewah", "luxury", "premium"],
  kreatif: ["kreatif", "creative", "fun", "playful", "unik", "unique", "warna warni", "colorful", "bold", "berani"],
  playful: ["fun", "playful", "lucu", "cute", "imut", "menarik", "eye-catching", "kasual", "casual"],
  minimal: ["minimal", "minimalis", "simple", "sederhana", "clean", "bersih", "putih", "white space"],
};

const SECTION_KEYWORDS: Record<string, string[]> = {
  navbar: ["navbar", "navigasi", "navigation", "menu", "header nav", "nav"],
  hero: ["hero", "header", "pembuka", "cover", "jumbotron", "billboard", "intro", "beranda"],
  about: ["tentang", "about", "profil", "profile", "visi", "misi", "vision", "mission", "sejarah"],
  features: ["fitur", "features", "layanan", "services", "keunggulan", "advantages", "benefit", "kelebihan"],
  stats: ["statistik", "stats", "pencapaian", "achievement", "prestasi", "angka", "counter"],
  testimonial: ["testimonial", "testimoni", "review", "ulasan", "klien", "client", "kata mereka", "feedback"],
  pricing: ["harga", "price", "pricing", "paket", "package", "biaya", "cost", "tarif", "subscription"],
  cta: ["cta", "call to action", "daftar", "register", "mulai", "start", "hubungi", "kontak sekarang"],
  contact: ["kontak", "contact", "hubungi", "alamat", "address", "lokasi", "location", "form"],
  footer: ["footer", "copyright"],
  gallery: ["galeri", "gallery", "portfolio", "portofolio", "karya", "work", "proyek", "project"],
  faq: ["faq", "faq", "pertanyaan", "question", "tanya jawab"],
  team: ["tim", "team", "orang", "people", "anggota", "member", "staff", "karyawan"],
};

const COLOR_MAP: Record<string, string> = {
  hijau: "#22c55e", ijo: "#22c55e", green: "#22c55e",
  biru: "#3b82f6", blue: "#3b82f6",
  ungu: "#8b5cf6", purple: "#8b5cf6", violet: "#8b5cf6",
  merah: "#ef4444", red: "#ef4444",
  pink: "#ec4899",
  orange: "#f97316", oranye: "#f97316",
  hitam: "#0f172a", black: "#0f172a", gelap: "#0f172a", dark: "#0f172a",
  putih: "#ffffff", white: "#ffffff", terang: "#ffffff", light: "#ffffff",
  emas: "#f59e0b", gold: "#f59e0b", kuning: "#f59e0b", yellow: "#f59e0b",
  emerald: "#22c55e",
  teal: "#14b8a6",
  cyan: "#06b6d4",
};

// ─── Intent Parser ───────────────────────────────────

export function parseIntent(prompt: string): ParsedIntent {
  const lower = prompt.toLowerCase();

  // Detect category
  let category = "umum";
  let maxScore = 0;
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.filter((kw) => lower.includes(kw)).length;
    if (score > maxScore) {
      maxScore = score;
      category = cat;
    }
  }

  // Detect style
  let style = "modern";
  let styleScore = 0;
  for (const [st, keywords] of Object.entries(STYLE_KEYWORDS)) {
    const score = keywords.filter((kw) => lower.includes(kw)).length;
    if (score > styleScore) {
      styleScore = score;
      style = st;
    }
  }

  // Detect color
  let colorHue = "";
  for (const [hue, hex] of Object.entries(COLOR_MAP)) {
    if (lower.includes(hue)) {
      colorHue = hue;
      break;
    }
  }

  // Detect desired sections
  const sections: string[] = [];
  const addedSections = new Set<string>();
  for (const [secType, keywords] of Object.entries(SECTION_KEYWORDS)) {
    const found = keywords.some((kw) => lower.includes(kw));
    if (found && !addedSections.has(secType)) {
      sections.push(secType);
      addedSections.add(secType);
    }
  }

  // Extract business name (simple heuristic: words after "untuk", "nama", or first capitalized words)
  let businessName = extractBusinessName(prompt);

  // If no sections specified, use defaults based on category
  if (sections.length === 0) {
    const defaultSections: Record<string, string[]> = {
      bisnis: ["hero", "about", "features", "testimonial", "pricing", "cta", "footer"],
      kreatif: ["hero", "about", "gallery", "testimonial", "cta", "footer"],
      makanan: ["hero", "about", "features", "testimonial", "contact", "footer"],
      toko: ["hero", "features", "testimonial", "pricing", "cta", "footer"],
      kesehatan: ["hero", "features", "testimonial", "contact", "footer"],
      event: ["hero", "features", "gallery", "cta", "footer"],
      teknologi: ["hero", "features", "pricing", "testimonial", "cta", "footer"],
      personal: ["hero", "about", "gallery", "contact", "footer"],
      umum: ["hero", "features", "testimonial", "cta", "footer"],
    };
    sections.push(...(defaultSections[category] || defaultSections.umum));
  }

  const confidence = Math.min(1, (maxScore + sections.length) / 10);

  return {
    category,
    businessName,
    style: style || "modern",
    colorHue,
    sections,
    confidence,
    rawPrompt: prompt,
  };
}

function extractBusinessName(prompt: string): string {
  const lower = prompt.toLowerCase();

  // Patterns: "untuk [nama]", "nama [nama]", "[nama] adalah"
  const untukMatch = lower.match(/untuk\s+([a-z\s]+?)(?:\.|,|$|dengan|yang)/i);
  if (untukMatch) {
    const name = untukMatch[1].trim();
    if (name.length > 2 && name.length < 40) return capitalize(name);
  }

  const namaMatch = lower.match(/nama\s+([a-z\s]+?)(?:\.|,|$|adalah|yang)/i);
  if (namaMatch) {
    const name = namaMatch[1].trim();
    if (name.length > 2 && name.length < 40) return capitalize(name);
  }

  // Fallback: try to find words after common business indicators
  const bizKeywords = ["toko", "cafe", "kafe", "restoran", "klinik", "studio", "agency", "startup", "brand", "bisnis"];
  for (const kw of bizKeywords) {
    const regex = new RegExp(`${kw}\\s+([a-z\\s]+?)(?:\\s+(?:di|dengan|yang|dan|untuk)|$|\\.|,)`, "i");
    const match = lower.match(regex);
    if (match) {
      const name = match[1].trim();
      if (name.length > 2 && name.length < 50) return capitalize(name);
    }
  }

  // Last resort: use the first few words of the prompt
  const words = prompt.split(/\s+/).slice(0, 4).join(" ");
  return words.length > 3 && words.length < 50 ? capitalize(words) : "Website Saya";
}

function capitalize(text: string): string {
  return text
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

// ─── Template Matcher ────────────────────────────────

/**
 * Match parsed intent to best gallery template, or compose from builder templates
 */
export function generateSections(intent: ParsedIntent): BuilderSection[] {
  const sections: BuilderSection[] = [];

  for (const secType of intent.sections) {
    const template = findBestTemplate(secType, intent.category);
    if (template) {
      const section = customizeSection(template.create(), intent);
      sections.push(section);
    }
  }

  return sections;
}

function findBestTemplate(sectionType: string, category: string): BuilderTemplateDef | undefined {
  // Find the best matching builder template for the section type
  const candidates = builderTemplates.filter((t) => {
    const tId = t.id.toLowerCase();
    const sType = sectionType.toLowerCase();
    return tId === sType || tId.startsWith(sType) || sType.startsWith(tId);
  });

  if (candidates.length > 0) return candidates[0];

  // Fallback mappings
  const fallbackMap: Record<string, string> = {
    gallery: "testimonials",
    portfolio: "testimonials",
    faq: "services",
    team: "about",
    about: "about",
    features: "services",
    pricing: "pricing",
    stats: "stats",
    testimonial: "testimonials",
    contact: "contact",
    cta: "cta-section",
    hero: "hero",
    footer: "footer",
  };

  const fallbackId = fallbackMap[sectionType];
  if (fallbackId) {
    return builderTemplates.find((t) => t.id === fallbackId);
  }

  return undefined;
}

function customizeSection(section: BuilderSection, intent: ParsedIntent): BuilderSection {
  // Deep clone to avoid mutation
  const cloned: BuilderSection = JSON.parse(JSON.stringify(section));

  const colorHex = intent.colorHue ? COLOR_MAP[intent.colorHue] || "#22c55e" : "#22c55e";
  const bgDark = intent.category === "teknologi" || intent.style === "minimal" ? "#0f172a" : "#ffffff";
  const bgLight = bgDark === "#0f172a" ? "#1e293b" : "#f8fafc";
  const textColor = bgDark === "#0f172a" ? "#ffffff" : "#1e293b";
  const textMuted = bgDark === "#0f172a" ? "#94a3b8" : "#64748b";

  // Customize based on intent
  for (const col of cloned.columns) {
    for (const el of col.elements) {
      switch (el.type) {
        case "heading":
          customizeHeading(el, intent);
          break;
        case "text":
          customizeText(el, intent);
          break;
        case "button":
          customizeButton(el, intent, colorHex);
          break;
        case "features":
          customizeFeatures(el, intent, colorHex);
          break;
        case "testimonial":
          customizeTestimonial(el, intent);
          break;
        case "pricing":
          customizePricing(el, intent, colorHex);
          break;
        case "cta":
          customizeCTA(el, intent, colorHex);
          break;
        case "stats":
          customizeStats(el, intent, colorHex);
          break;
        case "footer":
          customizeFooter(el, intent);
          break;
        case "contactForm":
          customizeContact(el, intent);
          break;
      }
    }
  }

  return cloned;
}

function customizeHeading(el: any, intent: ParsedIntent) {
  const colorHex = intent.colorHue ? COLOR_MAP[intent.colorHue] || "#22c55e" : "#22c55e";
  const isDark = intent.style === "minimal" || intent.category === "teknologi";

  if (el.content.level === "h1" || el.styles.fontWeight === "900") {
    // Hero heading
    el.content.text = getHeroTitle(intent);
    el.styles.color = isDark ? "#ffffff" : "#0f172a";
  } else if (el.content.text.includes("Tentang") || el.content.text.includes("About")) {
    el.content.text = `Tentang ${intent.businessName}`;
    el.styles.color = isDark ? "#ffffff" : "#0f172a";
  } else if (el.content.text.includes("Fitur") || el.content.text.includes("Kami")) {
    el.content.text = getFeaturesTitle(intent);
    el.styles.color = isDark ? "#ffffff" : "#0f172a";
  } else if (el.content.text.includes("Testimonial") || el.content.text.includes("Klien")) {
    el.content.text = "Apa Kata Klien";
    el.styles.color = isDark ? "#ffffff" : "#0f172a";
  } else if (el.content.text.includes("Harga") || el.content.text.includes("Paket")) {
    el.content.text = "Paket Harga";
    el.styles.color = isDark ? "#ffffff" : "#0f172a";
  } else if (el.content.text.includes("Statistik") || el.content.text.includes("Pencapaian")) {
    el.content.text = "Pencapaian Kami";
    el.styles.color = isDark ? "#ffffff" : "#0f172a";
  }
}

function customizeText(el: any, intent: ParsedIntent) {
  const isDark = intent.style === "minimal" || intent.category === "teknologi";
  if (el.content.text.includes("Hadir") || el.content.text.includes("solusi")) {
    el.content.text = `${intent.businessName} hadir untuk memberikan solusi terbaik bagi kebutuhan Anda. Kami berkomitmen untuk memberikan pelayanan profesional dan berkualitas tinggi.`;
  } else if (el.content.text.includes("memilih")) {
    el.content.text = `Mengapa ${intent.businessName} menjadi pilihan tepat untuk Anda`;
  } else if (el.content.text.includes("Lorem") || el.content.text.includes("ipsum")) {
    el.content.text = `${intent.businessName} adalah mitra terpercaya Anda dalam menciptakan solusi digital yang inovatif dan berdampak. Dengan pengalaman dan dedikasi, kami siap membantu Anda mencapai tujuan.`;
  }
  el.styles.color = isDark ? "#94a3b8" : "#64748b";
}

function customizeButton(el: any, intent: ParsedIntent, colorHex: string) {
  el.styles.backgroundColor = colorHex;
  if (el.content.text.includes("Mulai") || el.content.text.includes("Sekarang")) {
    el.content.text = intent.category === "makanan" ? "Pesan Sekarang" :
      intent.category === "event" ? "Daftar Sekarang" :
      intent.category === "toko" ? "Belanja Sekarang" :
      "Hubungi Kami";
  }
}

function customizeFeatures(el: any, intent: ParsedIntent, colorHex: string) {
  const biz = intent.businessName;
  el.styles.backgroundColor = "transparent";

  // Generate feature items based on category
  const featureSets: Record<string, Array<{ icon: string; title: string; desc: string }>> = {
    bisnis: [
      { icon: "🚀", title: "Profesional", desc: `${biz} memberikan layanan profesional terbaik` },
      { icon: "🎯", title: "Tepat Sasaran", desc: `Solusi yang sesuai dengan kebutuhan bisnis Anda` },
      { icon: "📈", title: "Berkembang", desc: `Bantu bisnis Anda tumbuh dan berkembang` },
    ],
    makanan: [
      { icon: "🍕", title: "Menu Terbaik", desc: `Nikmati pilihan menu terbaik dari ${biz}` },
      { icon: "🚚", title: "Delivery Cepat", desc: "Pesanan sampai tepat waktu" },
      { icon: "⭐", title: "Kualitas #1", desc: `Bahan berkualitas, rasa terbaik` },
    ],
    kreatif: [
      { icon: "🎨", title: "Kreativitas", desc: `Ide segar dan inovatif dari ${biz}` },
      { icon: "✨", title: "Estetika", desc: "Hasil karya dengan nilai seni tinggi" },
      { icon: "💡", title: "Inovatif", desc: "Solusi kreatif untuk kebutuhan Anda" },
    ],
    kesehatan: [
      { icon: "❤️", title: "Terpercaya", desc: `Ditangani tenaga profesional ${biz}` },
      { icon: "🏥", title: "Lengkap", desc: "Fasilitas kesehatan lengkap" },
      { icon: "💊", title: "Modern", desc: "Menggunakan teknologi terkini" },
    ],
    umum: [
      { icon: "⭐", title: "Terpercaya", desc: `Pelayanan terbaik dari ${biz}` },
      { icon: "💪", title: "Profesional", desc: "Tim yang berpengalaman" },
      { icon: "🤝", title: "Ramah", desc: "Siap membantu Anda 24/7" },
    ],
  };

  const features = featureSets[intent.category] || featureSets.umum;
  el.content.items = features;
  el.content.title = `Mengapa ${biz}?`;
  el.content.subtitle = "Keunggulan yang membedakan kami";
  el.content.titleColor = "#ffffff";
  el.content.titleSize = "30px";
  el.content.titleWeight = "700";
  el.content.subtitleColor = "#94a3b8";
  el.content.subtitleSize = "16px";
  el.content.itemBg = "rgba(255,255,255,0.05)";
  el.content.itemBorder = `rgba(255,255,255,0.1)`;
  el.content.itemTitleColor = "#ffffff";
  el.content.itemTextColor = "#94a3b8";
  el.content.columns = 3;
}

function customizeTestimonial(el: any, intent: ParsedIntent) {
  el.content.items = [
    { name: "Ahmad Fauzi", role: "CEO Startup", text: `Pelayanan ${intent.businessName} luar biasa! Sangat merekomendasikan.`, rating: 5, avatar: "AF" },
    { name: "Siti Rahma", role: "Owner Bisnis", text: `Proses cepat dan hasilnya memuaskan. ${intent.businessName} memang profesional!`, rating: 5, avatar: "SR" },
  ];
  el.content.title = "Apa Kata Klien";
}

function customizePricing(el: any, intent: ParsedIntent, colorHex: string) {
  el.content.items = [
    { name: "Basic", price: "Rp 99K", desc: "Cocok untuk pemula", features: ["1 Halaman", "Hosting Gratis", "Support Email"], highlighted: false, cta: "Pilih Paket" },
    { name: "Pro", price: "Rp 299K", desc: "Untuk bisnis berkembang", features: ["5 Halaman", "Custom Domain", "Priority Support"], highlighted: true, cta: "Pilih Paket" },
    { name: "Premium", price: "Rp 599K", desc: "Solusi lengkap", features: ["Unlimited", "SEO Optimasi", "24/7 Support"], highlighted: false, cta: "Pilih Paket" },
  ];
  el.content.cardBorder = colorHex;
  el.content.highlightBorder = colorHex;
  el.content.highlightBg = `${colorHex}0d`;
}

function customizeCTA(el: any, intent: ParsedIntent, colorHex: string) {
  el.styles.backgroundColor = colorHex;
  el.content.title = `Siap Memulai dengan ${intent.businessName}?`;
  el.content.subtitle = "Hubungi kami sekarang untuk konsultasi gratis";
  el.content.buttonText = "Hubungi Kami";
  el.content.buttonTextColor = colorHex;
}

function customizeStats(el: any, intent: ParsedIntent, colorHex: string) {
  el.content.valueColor = colorHex;
  el.content.items = [
    { value: "50+", label: "Project Selesai" },
    { value: "30+", label: "Klien Puas" },
    { value: "5+", label: "Tahun Pengalaman" },
    { value: "24/7", label: "Support" },
  ];
}

function customizeFooter(el: any, intent: ParsedIntent) {
  el.content.logo = intent.businessName.toUpperCase();
  el.content.description = `${intent.businessName} — Solusi terpercaya untuk kebutuhan Anda.`;
  el.content.copyright = `© ${new Date().getFullYear()} ${intent.businessName}. All rights reserved.`;
}

function customizeContact(el: any, intent: ParsedIntent) {
  el.content.title = `Hubungi ${intent.businessName}`;
  el.content.subtitle = "Isi form di bawah dan kami akan menghubungi Anda";
}

function getHeroTitle(intent: ParsedIntent): string {
  const templates: Record<string, string[]> = {
    bisnis: [`Solusi Terbaik untuk ${intent.businessName}`, `${intent.businessName} — Mitra Bisnis Terpercaya Anda`],
    kreatif: [`Karya Kreatif dari ${intent.businessName}`, `${intent.businessName} — Wujudkan Imajinasi`],
    makanan: [`Nikmati Cita Rasa ${intent.businessName}`, `Selamat Datang di ${intent.businessName}`],
    toko: [`Belanja Mudah di ${intent.businessName}`, `${intent.businessName} — Semua Ada di Sini`],
    kesehatan: [`Sehat Bersama ${intent.businessName}`, `${intent.businessName} — Peduli Kesehatan Anda`],
    event: [`${intent.businessName} — Acara Tak Terlupakan`, `Gabung di ${intent.businessName}`],
    teknologi: [`Inovasi dari ${intent.businessName}`, `${intent.businessName} — Teknologi Masa Depan`],
    umum: [`Selamat Datang di ${intent.businessName}`, `${intent.businessName} — Solusi Andal Anda`],
  };
  const options = templates[intent.category] || templates.umum;
  return options[Math.floor(Math.random() * options.length)];
}

function getFeaturesTitle(intent: ParsedIntent): string {
  const titles: Record<string, string[]> = {
    bisnis: ["Layanan Kami", "Apa yang Kami Tawarkan"],
    makanan: ["Menu Andalan", "Pilihan Terbaik"],
    kreatif: ["Portfolio Kami", "Karya Terbaik"],
    kesehatan: ["Layanan Kesehatan", "Fasilitas Kami"],
    umum: ["Keunggulan Kami", "Mengapa Memilih Kami"],
  };
  const options = titles[intent.category] || titles.umum;
  return options[0];
}

// ─── Public API ──────────────────────────────────────

/**
 * Generate website sections from a user prompt — 100% free, no AI API needed.
 *
 * @param prompt User's natural language description
 * @param category Optional category override
 * @returns Array of BuilderSection ready for preview/apply
 */
export function generateFromPrompt(prompt: string, category?: string): BuilderSection[] {
  const intent = parseIntent(prompt);
  if (category) intent.category = category;
  return generateSections(intent);
}

/**
 * Generate and serialize to JSON string (compatible with AI pipeline output)
 */
export function generateFromPromptJSON(prompt: string, category?: string): string {
  const sections = generateFromPrompt(prompt, category);
  return JSON.stringify(sections);
}

/**
 * Quick check if template engine can handle this prompt with good confidence
 */
export function canHandlePrompt(prompt: string): boolean {
  const intent = parseIntent(prompt);
  // Consider it handleable if we have at least some keyword matches
  return intent.confidence > 0.3 || intent.sections.length > 0;
}
