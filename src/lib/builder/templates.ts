import { genId, createDefaultPage, createDefaultSection } from "./defaults";
import type { BuilderPage, BuilderSection, BuilderElement, ElementType } from "./types";

// ═══════════════════════════════════════════
// 1. GALLERY TEMPLATE SYSTEM (existing)
// ═══════════════════════════════════════════

export interface Template {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  icon: string;
  previewColor: string;
  sections: BuilderSection[];
  globalStyles?: {
    fontFamily: string;
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
}

// Helper to create a section from raw data (for old gallery templates)
function sectionFromData(data: {
  id?: string;
  columns?: Array<{ id?: string; width?: number; elements?: Array<Partial<BuilderElement> & { type: ElementType }> }>;
  styles?: Record<string, string>;
  padding?: string;
  backgroundColor?: string;
  containerWidth?: "full" | "boxed";
}): BuilderSection {
  return {
    id: data.id || genId("sec"),
    columns: (data.columns || []).map((col) => ({
      id: col.id || genId("col"),
      width: col.width || 12,
      elements: (col.elements || []).map((el) => ({
        id: genId("el"),
        type: el.type,
        content: el.content || {},
        styles: el.styles || {},
      })),
    })),
    styles: {
      padding: data.padding || data.styles?.padding,
      backgroundColor: data.backgroundColor || data.styles?.backgroundColor,
      containerWidth: data.containerWidth || "boxed",
    },
  };
}

// ─── GALLERY TEMPLATES ───
const galleryTemplates: Template[] = [
  {
    id: "landing-pro",
    title: "Landing Page Pro",
    slug: "landing-pro",
    description: "Landing page profesional dengan hero, fitur, testimonial, pricing, CTA, dan footer.",
    category: "Bisnis",
    icon: "🚀",
    previewColor: "from-blue-600 to-indigo-700",
    sections: [
      sectionFromData({
        padding: "120px 0",
        backgroundColor: "#0f172a",
        containerWidth: "boxed",
        columns: [
          {
            width: 12,
            elements: [
              { type: "navbar", content: { logo: "PAGODA STUDIO", links: [{ label: "Fitur", href: "#features" }, { label: "Testimonial", href: "#testimonials" }, { label: "Harga", href: "#pricing" }, { label: "Kontak", href: "#contact" }], ctaText: "Hubungi", ctaHref: "#" }, styles: {} },
            ],
          },
        ],
      }),
      sectionFromData({
        padding: "100px 0",
        backgroundColor: "#0f172a",
        containerWidth: "boxed",
        columns: [
          {
            width: 12,
            elements: [
              { type: "heading", content: { text: "Bangun Website Impian Anda", level: "h1", align: "center" }, styles: { color: "#ffffff", fontWeight: "900", textAlign: "center", margin: "0 0 16px" } },
              { type: "text", content: { text: "Platform no-code terbaik untuk membuat landing page profesional. Tanpa coding, tanpa ribet." }, styles: { color: "#94a3b8", fontSize: "1.125rem", textAlign: "center", margin: "0 0 32px", maxWidth: "600px" } },
              { type: "button", content: { text: "Mulai Sekarang", href: "#", variant: "primary" }, styles: { padding: "16px 40px", fontSize: "16px" } },
            ],
          },
        ],
      }),
      sectionFromData({
        padding: "80px 0",
        backgroundColor: "#ffffff",
        containerWidth: "boxed",
        columns: [
          {
            width: 12,
            elements: [
              { type: "heading", content: { text: "Fitur Unggulan", level: "h2", align: "center" }, styles: { color: "#0f172a", fontWeight: "800", textAlign: "center", margin: "0 0 8px" } },
              { type: "text", content: { text: "Mengapa ribuan bisnis memilih kami" }, styles: { color: "#64748b", textAlign: "center", margin: "0 0 40px" } },
              { type: "features", content: { title: "", subtitle: "", items: [{ icon: "🚀", title: "Super Cepat", desc: "Optimasi performa terbaik" }, { icon: "🎨", title: "Desain Modern", desc: "Tampilan menarik & profesional" }, { icon: "📱", title: "Responsive", desc: "Tampil sempurna di semua device" }], columns: 3 }, styles: {} },
            ],
          },
        ],
      }),
      sectionFromData({
        padding: "80px 0",
        backgroundColor: "#f8fafc",
        containerWidth: "boxed",
        columns: [
          {
            width: 12,
            elements: [
              { type: "heading", content: { text: "Apa Kata Klien", level: "h2", align: "center" }, styles: { color: "#0f172a", fontWeight: "800", textAlign: "center", margin: "0 0 40px" } },
              { type: "testimonial", content: { title: "", items: [{ name: "Ahmad Fauzi", role: "CEO Startup", text: "Pelayanan luar biasa! Website kami jadi jauh lebih profesional.", rating: 5, avatar: "AF" }, { name: "Siti Rahma", role: "Owner Bisnis", text: "Proses cepat dan hasilnya memuaskan.", rating: 5, avatar: "SR" }] }, styles: {} },
            ],
          },
        ],
      }),
      sectionFromData({
        padding: "80px 0",
        backgroundColor: "#ffffff",
        containerWidth: "boxed",
        columns: [
          {
            width: 12,
            elements: [
              { type: "heading", content: { text: "Paket Harga", level: "h2", align: "center" }, styles: { color: "#0f172a", fontWeight: "800", textAlign: "center", margin: "0 0 40px" } },
              { type: "pricing", content: { title: "", subtitle: "", items: [{ name: "Basic", price: "Rp 99K", desc: "Pemula", features: ["1 Halaman", "Hosting Gratis"], highlighted: false, cta: "Pilih" }, { name: "Pro", price: "Rp 299K", desc: "Berkembang", features: ["5 Halaman", "Custom Domain", "Priority Support"], highlighted: true, cta: "Pilih" }, { name: "Premium", price: "Rp 599K", desc: "Lengkap", features: ["Unlimited", "SEO", "24/7 Support"], highlighted: false, cta: "Pilih" }] }, styles: {} },
            ],
          },
        ],
      }),
      sectionFromData({
        padding: "0",
        backgroundColor: "transparent",
        containerWidth: "boxed",
        columns: [
          {
            width: 12,
            elements: [
              { type: "cta", content: { title: "Siap Memulai?", subtitle: "Konsultasi gratis sekarang", buttonText: "Hubungi Kami", buttonHref: "#" }, styles: { padding: "60px 0", backgroundColor: "#22c55e" } },
            ],
          },
        ],
      }),
      sectionFromData({
        padding: "0",
        backgroundColor: "#0f172a",
        containerWidth: "full",
        columns: [
          {
            width: 12,
            elements: [
              { type: "footer", content: { logo: "PAGODA STUDIO", description: "Jasa pembuatan website profesional.", links: [{ label: "Tentang", href: "#" }, { label: "Layanan", href: "#" }, { label: "Kontak", href: "#" }], socials: [{ platform: "instagram", url: "#" }, { platform: "facebook", url: "#" }], copyright: `© ${new Date().getFullYear()} PAGODA STUDIO. All rights reserved.` }, styles: {} },
            ],
          },
        ],
      }),
    ],
  },
  {
    id: "company-profile",
    title: "Company Profile",
    slug: "company-profile",
    description: "Profil perusahaan profesional dengan about, tim, layanan, portfolio, dan kontak.",
    category: "Bisnis",
    icon: "🏢",
    previewColor: "from-emerald-600 to-teal-700",
    sections: [
      sectionFromData({
        padding: "100px 0",
        backgroundColor: "#ffffff",
        containerWidth: "boxed",
        columns: [
          {
            width: 12,
            elements: [
              { type: "heading", content: { text: "Tentang Perusahaan Kami", level: "h1", align: "center" }, styles: { color: "#0f172a", fontWeight: "900", textAlign: "center", margin: "0 0 16px" } },
              { type: "text", content: { text: "Kami adalah perusahaan yang berdedikasi memberikan solusi terbaik untuk bisnis Anda." }, styles: { color: "#64748b", textAlign: "center", margin: "0 0 40px", maxWidth: "600px" } },
              { type: "button", content: { text: "Hubungi Kami", href: "#", variant: "primary" }, styles: {} },
            ],
          },
        ],
      }),
      sectionFromData({
        padding: "80px 0",
        backgroundColor: "#f8fafc",
        containerWidth: "boxed",
        columns: [
          {
            width: 6,
            elements: [
              { type: "image", content: { src: "https://placehold.co/600x400/1e293b/22c55e?text=Tim+Kami", alt: "Tim Kami" }, styles: { borderRadius: "16px", maxWidth: "100%" } },
            ],
          },
          {
            width: 6,
            elements: [
              { type: "heading", content: { text: "Visi & Misi", level: "h2", align: "left" }, styles: { color: "#0f172a", fontWeight: "800", textAlign: "left", margin: "0 0 12px" } },
              { type: "text", content: { text: "Kami percaya bahwa setiap bisnis berhak memiliki website berkualitas tinggi untuk mengembangkan brand dan bisnis mereka di era digital." }, styles: { color: "#64748b", textAlign: "left", margin: "0 0 20px" } },
            ],
          },
        ],
      }),
      sectionFromData({
        padding: "60px 0",
        backgroundColor: "#0f172a",
        containerWidth: "boxed",
        columns: [
          {
            width: 12,
            elements: [
              { type: "heading", content: { text: "Pencapaian Kami", level: "h2", align: "center" }, styles: { color: "#ffffff", fontWeight: "800", textAlign: "center", margin: "0 0 40px" } },
              { type: "stats", content: { items: [{ value: "50+", label: "Project" }, { value: "30+", label: "Klien" }, { value: "5+", label: "Tahun" }, { value: "24/7", label: "Support" }], columns: 4 }, styles: {} },
            ],
          },
        ],
      }),
      sectionFromData({
        padding: "80px 0",
        backgroundColor: "#ffffff",
        containerWidth: "boxed",
        columns: [
          {
            width: 12,
            elements: [
              { type: "cta", content: { title: "Tertarik Bekerja Sama?", subtitle: "Hubungi kami untuk diskusi lebih lanjut", buttonText: "Konsultasi Gratis", buttonHref: "#" }, styles: { padding: "60px 0", backgroundColor: "#22c55e" } },
            ],
          },
        ],
      }),
      sectionFromData({
        padding: "0",
        backgroundColor: "#0f172a",
        containerWidth: "full",
        columns: [
          {
            width: 12,
            elements: [
              { type: "footer", content: { logo: "Perusahaan Kami", description: "Solusi digital terpercaya.", links: [{ label: "Tentang", href: "#" }, { label: "Layanan", href: "#" }, { label: "Kontak", href: "#" }], socials: [{ platform: "instagram", url: "#" }, { platform: "youtube", url: "#" }], copyright: `© ${new Date().getFullYear()} Perusahaan Kami. All rights reserved.` }, styles: {} },
            ],
          },
        ],
      }),
    ],
  },
  {
    id: "creative-portfolio",
    title: "Creative Portfolio",
    slug: "creative-portfolio",
    description: "Portfolio kreatif untuk desainer, fotografer, dan agensi kreatif.",
    category: "Kreatif",
    icon: "🎨",
    previewColor: "from-purple-600 to-pink-700",
    sections: [
      sectionFromData({
        padding: "120px 0",
        backgroundColor: "#0f172a",
        containerWidth: "boxed",
        columns: [
          {
            width: 12,
            elements: [
              { type: "heading", content: { text: "Karya Kreatif Kami", level: "h1", align: "center" }, styles: { color: "#ffffff", fontWeight: "900", textAlign: "center", margin: "0 0 16px" } },
              { type: "text", content: { text: "Kami menciptakan pengalaman visual yang memukau untuk brand Anda" }, styles: { color: "#94a3b8", textAlign: "center" } },
            ],
          },
        ],
      }),
      sectionFromData({
        padding: "80px 0",
        backgroundColor: "#ffffff",
        containerWidth: "boxed",
        columns: [
          {
            width: 12,
            elements: [
              { type: "heading", content: { text: "Layanan Kami", level: "h2", align: "center" }, styles: { color: "#0f172a", fontWeight: "800", textAlign: "center", margin: "0 0 40px" } },
              { type: "features", content: { title: "", subtitle: "", items: [{ icon: "🎨", title: "Desain Grafis", desc: "Logo, branding, materi marketing" }, { icon: "📸", title: "Fotografi", desc: "Produk, event, portrait" }, { icon: "🎬", title: "Video", desc: "Company profile, iklan, konten sosial media" }], columns: 3 }, styles: {} },
            ],
          },
        ],
      }),
      sectionFromData({
        padding: "80px 0",
        backgroundColor: "#f8fafc",
        containerWidth: "boxed",
        columns: [
          {
            width: 12,
            elements: [
              { type: "heading", content: { text: "Testimonial Klien", level: "h2", align: "center" }, styles: { color: "#0f172a", fontWeight: "800", textAlign: "center", margin: "0 0 40px" } },
              { type: "testimonial", content: { title: "", items: [{ name: "Rina", role: "Owner Brand", text: "Hasil kerja tim ini luar biasa! Sangat merekomendasikan.", rating: 5, avatar: "RN" }, { name: "Doni", role: "Startup Founder", text: "Kreatif, profesional, dan tepat waktu. Kerja sama yang menyenangkan!", rating: 5, avatar: "DN" }] }, styles: {} },
            ],
          },
        ],
      }),
      sectionFromData({
        padding: "0",
        backgroundColor: "transparent",
        containerWidth: "boxed",
        columns: [
          {
            width: 12,
            elements: [
              { type: "cta", content: { title: "Mulai Proyek Anda", subtitle: "Konsultasi gratis untuk ide kreatif Anda", buttonText: "Diskusi Sekarang", buttonHref: "#" }, styles: { padding: "60px 0", backgroundColor: "#22c55e" } },
            ],
          },
        ],
      }),
      sectionFromData({
        padding: "0",
        backgroundColor: "#0f172a",
        containerWidth: "full",
        columns: [
          {
            width: 12,
            elements: [
              { type: "footer", content: { logo: "Creative Agency", description: "We bring your vision to life.", links: [{ label: "Portfolio", href: "#" }, { label: "Layanan", href: "#" }, { label: "Kontak", href: "#" }], socials: [{ platform: "instagram", url: "#" }, { platform: "dribbble", url: "#" }, { platform: "behance", url: "#" }], copyright: `© ${new Date().getFullYear()} Creative Agency. All rights reserved.` }, styles: {} },
            ],
          },
        ],
      }),
    ],
  },
  {
    id: "startup-landing",
    title: "Startup Landing",
    slug: "startup-landing",
    description: "Landing page modern untuk startup dengan fokus konversi.",
    category: "Bisnis",
    icon: "📱",
    previewColor: "from-orange-600 to-red-700",
    sections: [
      sectionFromData({
        padding: "100px 0",
        backgroundColor: "#0f172a",
        containerWidth: "boxed",
        columns: [
          {
            width: 12,
            elements: [
              { type: "heading", content: { text: "Revolusi Cara Kerja Tim Anda", level: "h1", align: "center" }, styles: { color: "#ffffff", fontWeight: "900", textAlign: "center", margin: "0 0 16px" } },
              { type: "text", content: { text: "Platform all-in-one untuk produktivitas tim. Mulai gratis, upgrade kapan saja." }, styles: { color: "#94a3b8", textAlign: "center", margin: "0 0 32px", maxWidth: "500px" } },
              { type: "button", content: { text: "Coba Gratis", href: "#", variant: "primary" }, styles: { padding: "16px 40px", fontSize: "16px" } },
            ],
          },
        ],
      }),
      sectionFromData({
        padding: "80px 0",
        backgroundColor: "#ffffff",
        containerWidth: "boxed",
        columns: [
          {
            width: 12,
            elements: [
              { type: "heading", content: { text: "Fitur Lengkap untuk Tim Hebat", level: "h2", align: "center" }, styles: { color: "#0f172a", fontWeight: "800", textAlign: "center", margin: "0 0 40px" } },
              { type: "features", content: { title: "", subtitle: "", items: [{ icon: "⚡", title: "Cepat & Efisien", desc: "Optimasi workflow tim" }, { icon: "🔒", title: "Keamanan Data", desc: "Enkripsi end-to-end" }, { icon: "☁️", title: "Cloud Sync", desc: "Akses di mana saja" }], columns: 3 }, styles: {} },
            ],
          },
        ],
      }),
      sectionFromData({
        padding: "80px 0",
        backgroundColor: "#f8fafc",
        containerWidth: "boxed",
        columns: [
          {
            width: 12,
            elements: [
              { type: "heading", content: { text: "Paket & Harga", level: "h2", align: "center" }, styles: { color: "#0f172a", fontWeight: "800", textAlign: "center", margin: "0 0 40px" } },
              { type: "pricing", content: { title: "", subtitle: "", items: [{ name: "Starter", price: "Gratis", desc: "Untuk pemula", features: ["3 Anggota Tim", "1GB Storage", "Support Email"], highlighted: false, cta: "Daftar" }, { name: "Pro", price: "$29/bln", desc: "Tim berkembang", features: ["10 Anggota", "10GB Storage", "Priority Support", "API Access"], highlighted: true, cta: "Mulai Trial" }, { name: "Enterprise", price: "$99/bln", desc: "Skala besar", features: ["Unlimited", "100GB", "24/7 Support", "Kustom Integrasi"], highlighted: false, cta: "Hubungi Sales" }] }, styles: {} },
            ],
          },
        ],
      }),
      sectionFromData({
        padding: "0",
        backgroundColor: "#0f172a",
        containerWidth: "full",
        columns: [
          {
            width: 12,
            elements: [
              { type: "footer", content: { logo: "Startup App", description: "Membangun produktivitas tim.", links: [{ label: "Fitur", href: "#" }, { label: "Harga", href: "#" }, { label: "Blog", href: "#" }], socials: [{ platform: "twitter", url: "#" }, { platform: "linkedin", url: "#" }], copyright: `© ${new Date().getFullYear()} Startup App. All rights reserved.` }, styles: {} },
            ],
          },
        ],
      }),
    ],
  },
  {
    id: "event-landing",
    title: "Event Landing Page",
    slug: "event-landing",
    description: "Halaman pendaftaran event dengan jadwal, pembicara, dan CTA.",
    category: "Event",
    icon: "📅",
    previewColor: "from-blue-500 to-cyan-600",
    sections: [
      sectionFromData({
        padding: "100px 0",
        backgroundColor: "#0f172a",
        containerWidth: "boxed",
        columns: [
          {
            width: 12,
            elements: [
              { type: "heading", content: { text: "Tech Conference 2025", level: "h1", align: "center" }, styles: { color: "#ffffff", fontWeight: "900", textAlign: "center", margin: "0 0 16px" } },
              { type: "text", content: { text: "Bergabung dengan 1000+ peserta untuk belajar dari para ahli industri." }, styles: { color: "#94a3b8", textAlign: "center", margin: "0 0 32px" } },
              { type: "button", content: { text: "Daftar Sekarang", href: "#", variant: "primary" }, styles: { padding: "16px 40px", fontSize: "16px" } },
            ],
          },
        ],
      }),
      sectionFromData({
        padding: "80px 0",
        backgroundColor: "#ffffff",
        containerWidth: "boxed",
        columns: [
          {
            width: 12,
            elements: [
              { type: "features", content: { title: "Mengapa Hadir?", subtitle: "Manfaat mengikuti event ini", items: [{ icon: "🎤", title: "Pembicara Ahli", desc: "Belajar dari top industri" }, { icon: "🤝", title: "Networking", desc: "Bertemu profesional lain" }, { icon: "🏆", title: "Sertifikat", desc: "Dapatkan sertifikat partisipasi" }], columns: 3 }, styles: {} },
            ],
          },
        ],
      }),
      sectionFromData({
        padding: "0",
        backgroundColor: "transparent",
        containerWidth: "boxed",
        columns: [
          {
            width: 12,
            elements: [
              { type: "cta", content: { title: "Jangan Sampai Ketinggalan!", subtitle: "Early bird discount tersedia", buttonText: "Daftar Sekarang", buttonHref: "#" }, styles: { padding: "60px 0", backgroundColor: "#3b82f6" } },
            ],
          },
        ],
      }),
      sectionFromData({
        padding: "0",
        backgroundColor: "#0f172a",
        containerWidth: "full",
        columns: [
          {
            width: 12,
            elements: [
              { type: "footer", content: { logo: "TechConf", description: "Event teknologi tahunan.", links: [{ label: "Jadwal", href: "#" }, { label: "Pembicara", href: "#" }, { label: "Lokasi", href: "#" }], socials: [{ platform: "instagram", url: "#" }, { platform: "twitter", url: "#" }], copyright: `© ${new Date().getFullYear()} TechConf. All rights reserved.` }, styles: {} },
            ],
          },
        ],
      }),
    ],
  },
];

// ─── Create a BuilderPage from a Template ───
export function createPageFromTemplate(template: Template): BuilderPage {
  const page = createDefaultPage(template.title);
  return {
    ...page,
    slug: template.slug || page.slug,
    sections: JSON.parse(JSON.stringify(template.sections)),
    globalStyles: {
      ...page.globalStyles,
      ...(template.globalStyles || {}),
    },
  };
}

export const templates = galleryTemplates;

// ═══════════════════════════════════════════
// 2. BUILDER SECTION TEMPLATES (new)
//    Pre-made sections for one-click adding in builder
// ═══════════════════════════════════════════

function el(type: string, overrides?: Partial<BuilderElement>): BuilderElement {
  const defaults: Record<string, any> = {
    heading: {
      type: "heading",
      content: { text: "Judul Heading", level: "h2", align: "center" },
      styles: { color: "#1e293b", fontWeight: "800", textAlign: "center", margin: "0 0 16px" },
    },
    "heading-left": {
      type: "heading",
      content: { text: "Judul Heading", level: "h2", align: "left" },
      styles: { color: "#1e293b", fontWeight: "800", textAlign: "left", margin: "0 0 16px" },
    },
    "heading-white": {
      type: "heading",
      content: { text: "Judul Heading", level: "h2", align: "center" },
      styles: { color: "#ffffff", fontWeight: "800", textAlign: "center", margin: "0 0 16px" },
    },
    text: {
      type: "text",
      content: { text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
      styles: { color: "#64748b", fontSize: "1rem", textAlign: "center", margin: "0 0 0" },
    },
    "text-white": {
      type: "text",
      content: { text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
      styles: { color: "#ffffffcc", fontSize: "1rem", textAlign: "center", margin: "0 0 0" },
    },
    "text-left": {
      type: "text",
      content: { text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
      styles: { color: "#64748b", fontSize: "1rem", textAlign: "left", margin: "0 0 0" },
    },
    button: {
      type: "button",
      content: { text: "Mulai Sekarang", href: "#", variant: "primary", target: "_self" },
      styles: { backgroundColor: "#22c55e", color: "#ffffff", borderRadius: "12px", padding: "14px 32px", fontSize: "16px", fontWeight: "600" },
    },
    image: {
      type: "image",
      content: { src: "https://placehold.co/600x400/1e293b/64748b?text=Gambar", alt: "Gambar", caption: "" },
      styles: { borderRadius: "16px", maxWidth: "100%", margin: "0 0 0" },
    },
    features: {
      type: "features",
      content: {
        title: "Fitur Unggulan",
        subtitle: "Mengapa memilih kami?",
        items: [
          { icon: "🚀", title: "Cepat & Handal", desc: "Optimasi performa terbaik untuk website Anda" },
          { icon: "🎨", title: "Desain Modern", desc: "Tampilan menarik yang disesuaikan dengan brand" },
          { icon: "📱", title: "Responsive", desc: "Tampil sempurna di semua perangkat" },
        ],
        columns: 3,
      },
      styles: { padding: "0", backgroundColor: "transparent" },
    },
    testimonial: {
      type: "testimonial",
      content: {
        title: "Apa Kata Klien",
        items: [
          { name: "Ahmad Fauzi", role: "CEO Startup", text: "Pelayanan luar biasa! Website kami jadi jauh lebih profesional.", rating: 5, avatar: "AF" },
          { name: "Siti Rahma", role: "Owner Bisnis", text: "Proses cepat dan hasilnya memuaskan.", rating: 5, avatar: "SR" },
        ],
      },
      styles: { padding: "0", backgroundColor: "transparent" },
    },
    pricing: {
      type: "pricing",
      content: {
        title: "Paket Harga",
        subtitle: "Pilih paket yang sesuai kebutuhan Anda",
        items: [
          { name: "Basic", price: "Rp 99K", desc: "Cocok untuk pemula", features: ["1 Halaman", "Hosting Gratis", "Support Email"], highlighted: false, cta: "Pilih Paket" },
          { name: "Pro", price: "Rp 299K", desc: "Untuk bisnis berkembang", features: ["5 Halaman", "Custom Domain", "Priority Support"], highlighted: true, cta: "Pilih Paket" },
          { name: "Premium", price: "Rp 599K", desc: "Solusi lengkap", features: ["Unlimited Halaman", "SEO Optimasi", "24/7 Support"], highlighted: false, cta: "Pilih Paket" },
        ],
      },
      styles: { padding: "0", backgroundColor: "#f8fafc" },
    },
    stats: {
      type: "stats",
      content: {
        items: [
          { value: "50+", label: "Project Selesai" },
          { value: "30+", label: "Klien Puas" },
          { value: "5+", label: "Tahun Pengalaman" },
          { value: "24/7", label: "Support" },
        ],
        columns: 4,
      },
      styles: { padding: "60px 0", backgroundColor: "#0f172a" },
    },
    contact: {
      type: "contactForm",
      content: {
        title: "Hubungi Kami",
        subtitle: "Isi form di bawah dan kami akan menghubungi Anda",
        whatsappNumber: "6282210099969",
      },
      styles: { padding: "0", backgroundColor: "transparent" },
    },
    maps: {
      type: "maps",
      content: {
        title: "Lokasi Kami",
        address: "Jakarta, Indonesia",
        lat: "-6.2088",
        lng: "106.8456",
        zoom: 13,
      },
      styles: { padding: "0", borderRadius: "12px", height: "400px" },
    },
    cta: {
      type: "cta",
      content: {
        title: "Siap Memulai?",
        subtitle: "Hubungi kami sekarang untuk konsultasi gratis",
        buttonText: "Konsultasi Gratis",
        buttonHref: "#",
      },
      styles: { padding: "60px 0", backgroundColor: "#22c55e" },
    },
    footer: {
      type: "footer",
      content: {
        logo: "PAGODA STUDIO",
        logoImage: "",
        logoHeight: "40",
        description: "Jasa pembuatan website profesional untuk bisnis Anda.",
        links: [
          { label: "Tentang", href: "#" },
          { label: "Layanan", href: "#" },
          { label: "Portfolio", href: "#" },
          { label: "Kontak", href: "#" },
        ],
        socials: [
          { platform: "instagram", url: "#" },
          { platform: "facebook", url: "#" },
          { platform: "youtube", url: "#" },
        ],
        copyright: `© ${new Date().getFullYear()} PAGODA STUDIO. All rights reserved.`,
      },
      styles: { backgroundColor: "#0f172a", padding: "60px 0 30px" },
    },
  };

  const base = defaults[type];
  if (!base) throw new Error(`Unknown template element: ${type}`);
  return {
    id: genId("el"),
    ...base,
    ...overrides,
    content: { ...base.content, ...(overrides?.content || {}) },
    styles: { ...base.styles, ...(overrides?.styles || {}) },
  } as BuilderElement;
}

export interface BuilderTemplateDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  create: () => BuilderSection;
}

const builderTemplates: BuilderTemplateDef[] = [
  {
    id: "hero",
    name: "Hero",
    description: "Header besar dengan heading, teks, dan CTA",
    icon: "🚀",
    category: "Header",
    create: () => ({
      id: genId("sec"),
      columns: [
        {
          id: genId("col"),
          width: 12,
          elements: [
            el("heading", { content: { text: "Bangun Website Impian Anda", level: "h1", align: "center" }, styles: { color: "#ffffff", fontWeight: "900", textAlign: "center", margin: "0 0 16px" } }),
            el("text", { content: { text: "Kami hadir untuk membantu Anda membuat website profesional dengan mudah dan cepat. Tanpa coding, tanpa ribet." }, styles: { color: "#ffffffcc", fontSize: "1.125rem", textAlign: "center", margin: "0 0 32px", maxWidth: "600px" } }),
            el("button", { styles: { backgroundColor: "#22c55e", color: "#ffffff", borderRadius: "12px", padding: "16px 40px", fontSize: "16px", fontWeight: "700" } }),
          ],
        },
      ],
      styles: { padding: "120px 0", backgroundColor: "#0f172a", containerWidth: "boxed" },
    }),
  },
  {
    id: "hero-light",
    name: "Hero Light",
    description: "Hero dengan background putih dan aksen hijau",
    icon: "🌟",
    category: "Header",
    create: () => ({
      id: genId("sec"),
      columns: [
        {
          id: genId("col"),
          width: 12,
          elements: [
            el("heading", { content: { text: "Tumbuhkan Bisnis Anda", level: "h1", align: "center" }, styles: { color: "#0f172a", fontWeight: "900", textAlign: "center", margin: "0 0 16px" } }),
            el("text", { content: { text: "Solusi website profesional untuk mengembangkan brand dan bisnis Anda di era digital." }, styles: { color: "#64748b", fontSize: "1.125rem", textAlign: "center", margin: "0 0 32px", maxWidth: "600px" } }),
            el("button", { styles: { backgroundColor: "#22c55e", color: "#ffffff", borderRadius: "12px", padding: "16px 40px", fontSize: "16px", fontWeight: "700" } }),
          ],
        },
      ],
      styles: { padding: "120px 0", backgroundColor: "#ffffff", containerWidth: "boxed" },
    }),
  },
  {
    id: "about",
    name: "Tentang",
    description: "Dua kolom: gambar + teks",
    icon: "ℹ️",
    category: "Konten",
    create: () => ({
      id: genId("sec"),
      columns: [
        {
          id: genId("col"),
          width: 6,
          elements: [
            el("image", { content: { src: "https://placehold.co/600x500/1e293b/22c55e?text=Tentang+Kami", alt: "Tentang Kami" }, styles: { borderRadius: "16px", maxWidth: "100%" } }),
          ],
        },
        {
          id: genId("col"),
          width: 6,
          elements: [
            el("heading-left", { content: { text: "Tentang Kami", level: "h2", align: "left" }, styles: { color: "#0f172a", fontWeight: "800", textAlign: "left", margin: "0 0 12px" } }),
            el("text-left", { content: { text: "Kami adalah tim profesional yang berdedikasi untuk membantu bisnis Anda tumbuh melalui solusi digital inovatif. Dengan pengalaman lebih dari 5 tahun, kami telah membantu 50+ klien mencapai kesuksesan online." }, styles: { color: "#64748b", fontSize: "1rem", textAlign: "left", margin: "0 0 20px" } }),
            el("text-left", { content: { text: "Visi kami adalah memberdayakan setiap bisnis dengan website berkualitas tinggi yang mudah dikelola." }, styles: { color: "#64748b", fontSize: "1rem", textAlign: "left", margin: "0 0 24px" } }),
            el("button", { content: { text: "Pelajari Lebih", href: "#" }, styles: { backgroundColor: "#22c55e", color: "#ffffff", borderRadius: "12px", padding: "12px 28px", fontSize: "15px", fontWeight: "600" } }),
          ],
        },
      ],
      styles: { padding: "80px 0", backgroundColor: "#ffffff", containerWidth: "boxed" },
    }),
  },
  {
    id: "services",
    name: "Layanan",
    description: "3 kolom fitur/layanan",
    icon: "⚡",
    category: "Konten",
    create: () => ({
      id: genId("sec"),
      columns: [
        {
          id: genId("col"),
          width: 12,
          elements: [
            el("heading", { content: { text: "Layanan Kami", level: "h2", align: "center" }, styles: { color: "#0f172a", fontWeight: "800", textAlign: "center", margin: "0 0 8px" } }),
            el("text", { content: { text: "Solusi lengkap untuk kebutuhan digital Anda" }, styles: { color: "#64748b", fontSize: "1rem", textAlign: "center", margin: "0 0 40px" } }),
            el("features", {}),
          ],
        },
      ],
      styles: { padding: "80px 0", backgroundColor: "#f8fafc", containerWidth: "boxed" },
    }),
  },
  {
    id: "stats",
    name: "Statistik",
    description: "4 kolom angka pencapaian",
    icon: "📊",
    category: "Konten",
    create: () => ({
      id: genId("sec"),
      columns: [
        {
          id: genId("col"),
          width: 12,
          elements: [
            el("heading-white", { content: { text: "Pencapaian Kami", level: "h2", align: "center" }, styles: { color: "#ffffff", fontWeight: "800", textAlign: "center", margin: "0 0 40px" } }),
            el("stats", {}),
          ],
        },
      ],
      styles: { padding: "60px 0", backgroundColor: "#0f172a", containerWidth: "boxed" },
    }),
  },
  {
    id: "testimonials",
    name: "Testimonial",
    description: "2 kolom testimonial klien",
    icon: "💬",
    category: "Konten",
    create: () => ({
      id: genId("sec"),
      columns: [
        {
          id: genId("col"),
          width: 12,
          elements: [
            el("heading", { content: { text: "Apa Kata Klien", level: "h2", align: "center" }, styles: { color: "#0f172a", fontWeight: "800", textAlign: "center", margin: "0 0 40px" } }),
            el("testimonial", {}),
          ],
        },
      ],
      styles: { padding: "80px 0", backgroundColor: "#ffffff", containerWidth: "boxed" },
    }),
  },
  {
    id: "pricing",
    name: "Paket Harga",
    description: "3 paket harga berkolom",
    icon: "💰",
    category: "Konten",
    create: () => ({
      id: genId("sec"),
      columns: [
        {
          id: genId("col"),
          width: 12,
          elements: [
            el("heading", { content: { text: "Paket Harga", level: "h2", align: "center" }, styles: { color: "#0f172a", fontWeight: "800", textAlign: "center", margin: "0 0 8px" } }),
            el("text", { content: { text: "Pilih paket yang paling sesuai dengan kebutuhan Anda" }, styles: { color: "#64748b", fontSize: "1rem", textAlign: "center", margin: "0 0 40px" } }),
            el("pricing", {}),
          ],
        },
      ],
      styles: { padding: "80px 0", backgroundColor: "#f8fafc", containerWidth: "boxed" },
    }),
  },
  {
    id: "cta-section",
    name: "CTA Section",
    description: "Ajakan bertindak dengan background hijau",
    icon: "📢",
    category: "Konten",
    create: () => ({
      id: genId("sec"),
      columns: [
        {
          id: genId("col"),
          width: 12,
          elements: [
            el("cta", {}),
          ],
        },
      ],
      styles: { padding: "0", backgroundColor: "transparent", containerWidth: "boxed" },
    }),
  },
  {
    id: "contact",
    name: "Kontak",
    description: "Form kontak + peta",
    icon: "📝",
    category: "Footer",
    create: () => ({
      id: genId("sec"),
      columns: [
        {
          id: genId("col"),
          width: 7,
          elements: [
            el("contact", { content: { title: "Hubungi Kami", subtitle: "Isi form di bawah untuk konsultasi gratis" } }),
          ],
        },
        {
          id: genId("col"),
          width: 5,
          elements: [
            el("maps", {}),
          ],
        },
      ],
      styles: { padding: "80px 0", backgroundColor: "#ffffff", containerWidth: "boxed" },
    }),
  },
  {
    id: "footer",
    name: "Footer",
    description: "Footer lengkap dengan links & sosial media",
    icon: "⊟",
    category: "Footer",
    create: () => ({
      id: genId("sec"),
      columns: [
        {
          id: genId("col"),
          width: 12,
          elements: [
            el("footer", {}),
          ],
        },
      ],
      styles: { padding: "0", backgroundColor: "transparent", containerWidth: "full" },
    }),
  },
];

export { builderTemplates };
