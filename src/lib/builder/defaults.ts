import type { BuilderElement, BuilderSection, BuilderColumn, BuilderPage, GlobalStyles, ElementType } from "./types";

let _counter = 0;
export const genId = (prefix = "el") => `${prefix}_${Date.now()}_${++_counter}`;

export const defaultGlobalStyles: GlobalStyles = {
  fontFamily: "Inter, sans-serif",
  primaryColor: "#22c55e",
  backgroundColor: "#ffffff",
  textColor: "#1e293b",
  containerWidth: 1200,
};

export function defaultSectionStyles() {
  return {
    padding: "80px 0",
    backgroundColor: "transparent",
    containerWidth: "boxed" as const,
  };
}

export function createDefaultSection(): BuilderSection {
  const col: BuilderColumn = { id: genId("col"), width: 12, elements: [] };
  return {
    id: genId("sec"),
    columns: [col],
    styles: defaultSectionStyles(),
  };
}

export function createDefaultPage(title = "Halaman Baru"): BuilderPage {
  const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  return {
    id: genId("page"),
    title,
    slug,
    sections: [],
    globalStyles: { ...defaultGlobalStyles },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: false,
    publishedSnapshot: null,
  };
}

interface ElementDefaults {
  content: Record<string, any>;
  styles: Record<string, string>;
}

const elementDefaults: Record<ElementType, ElementDefaults> = {
  heading: {
    content: { text: "Judul Heading", level: "h2", align: "center" },
    styles: { color: "#1e293b", fontWeight: "800", textAlign: "center", margin: "0 0 16px" },
  },
  text: {
    content: { text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    styles: { color: "#64748b", fontSize: "1rem", lineHeight: "1.8", textAlign: "center", margin: "0 0 0" },
  },
  image: {
    content: { src: "https://placehold.co/800x500/1e293b/64748b?text=Gambar", alt: "Gambar", caption: "" },
    styles: { borderRadius: "12px", maxWidth: "100%", margin: "0 0 0" },
  },
  button: {
    content: { text: "Klik Disini", href: "#", variant: "primary", target: "_self" },
    styles: { backgroundColor: "#22c55e", color: "#ffffff", borderRadius: "12px", padding: "14px 32px", fontSize: "16px", fontWeight: "600" },
  },
  video: {
    content: { url: "https://www.youtube.com/embed/dQw4w9WgXcQ", caption: "" },
    styles: { borderRadius: "12px", width: "100%", aspectRatio: "16/9" },
  },
  spacer: {
    content: { height: "40px" },
    styles: {},
  },
  divider: {
    content: { style: "solid", color: "#e2e8f0" },
    styles: { margin: "20px 0" },
  },
  icon: {
    content: { icon: "star", size: "48px", color: "#22c55e" },
    styles: { textAlign: "center", margin: "0 0 0" },
  },
  features: {
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
  pricing: {
    content: {
      title: "Paket Harga",
      subtitle: "Pilih paket yang sesuai kebutuhan Anda",
      items: [
        { name: "Basic", price: "Rp 99K", desc: "Cocok untuk pemula", features: ["1 Halaman", "Hosting Gratis", "Support Email"], highlighted: false, cta: "Pilih Paket" },
        { name: "Pro", price: "Rp 299K", desc: "Untuk bisnis berkembang", features: ["5 Halaman", "Custom Domain", "Priority Support", "Analytics"], highlighted: true, cta: "Pilih Paket" },
        { name: "Premium", price: "Rp 599K", desc: "Solusi lengkap", features: ["Unlimited Halaman", "SEO Optimasi", "24/7 Support", "Free Maintenance"], highlighted: false, cta: "Pilih Paket" },
      ],
    },
    styles: { padding: "0", backgroundColor: "#f8fafc" },
  },
  testimonial: {
    content: {
      title: "Apa Kata Klien",
      items: [
        { name: "Ahmad Fauzi", role: "CEO Startup", text: "Pelayanan luar biasa! Website kami jadi jauh lebih profesional.", rating: 5, avatar: "AF" },
        { name: "Siti Rahma", role: "Owner Bisnis", text: "Proses cepat dan hasilnya memuaskan. Highly recommended!", rating: 5, avatar: "SR" },
      ],
    },
    styles: { padding: "0", backgroundColor: "transparent" },
  },
  cta: {
    content: {
      title: "Siap Memulai?",
      subtitle: "Hubungi kami sekarang untuk konsultasi gratis",
      buttonText: "Konsultasi Gratis",
      buttonHref: "https://wa.me/6282210099969",
    },
    styles: { padding: "80px 0", backgroundColor: "#22c55e" },
  },
  stats: {
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
  contactForm: {
    content: {
      title: "Hubungi Kami",
      subtitle: "Isi form di bawah dan kami akan menghubungi Anda",
      whatsappNumber: "6282210099969",
      fields: ["name", "email", "phone", "message"],
    },
    styles: { padding: "0", backgroundColor: "transparent" },
  },
  maps: {
    content: {
      title: "Lokasi Kami",
      address: "Jakarta, Indonesia",
      lat: "-6.2088",
      lng: "106.8456",
      zoom: 13,
    },
    styles: { padding: "0", borderRadius: "12px", height: "400px" },
  },
  navbar: {
    content: {
      logo: "PAGODA STUDIO",
      logoImage: "",
      logoHeight: "32",
      logoAlign: "start",
      logoColor: "#ffffff",
      logoFontSize: "1.25rem",
      logoFontWeight: "700",
      menuAlign: "center",
      menuColor: "#94a3b8",
      menuHoverColor: "#22c55e",
      menuFontWeight: "500",
      menuFontSize: "14px",
      ctaAlign: "end",
      ctaText: "Hubungi Kami",
      ctaHref: "https://wa.me/6282210099969",
      ctaColor: "#ffffff",
      ctaBgColor: "#22c55e",
      ctaFontWeight: "600",
      ctaFontSize: "14px",
      links: [
        { label: "Beranda", href: "#" },
        { label: "Tentang", href: "#" },
        { label: "Layanan", href: "#" },
        { label: "Kontak", href: "#" },
      ],
      sticky: true,
    },
    styles: { backgroundColor: "transparent", padding: "0" },
  },
  footer: {
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
  "three-background": {
    content: {
      intensity: 0.5,
      color: "#22c55e",
      animated: true,
    },
    styles: { position: "absolute", inset: "0", zIndex: "0" },
  },
};

export function createElement(type: ElementType, partialContent?: Record<string, any>): BuilderElement {
  const def = elementDefaults[type];
  return {
    id: genId(),
    type,
    content: { ...def.content, ...partialContent },
    styles: { ...def.styles },
  };
}
