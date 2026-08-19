import type { BuilderElement, BuilderSection, BuilderColumn, BuilderRow, BuilderPage, GlobalStyles, ElementType } from "./types";

let _counter = 0;
export const genId = (prefix = "el") => `${prefix}_${Date.now()}_${++_counter}`;

export const defaultGlobalStyles: GlobalStyles = {
  fontFamily: "Inter, sans-serif",
  primaryColor: "#2563eb",
  backgroundColor: "#ffffff",
  textColor: "#111111",
  containerWidth: 1200,
};

export function defaultSectionStyles() {
  return {
    padding: "0",
    backgroundColor: "transparent",
    containerWidth: "boxed" as const,
  };
}

export function createDefaultSection(): BuilderSection {
  const col: BuilderColumn = { id: genId("col"), width: 12, elements: [] };
  const row: BuilderRow = { id: genId("row"), columns: [col] };
  return {
    id: genId("sec"),
    columns: [col],
    rows: [row],
    styles: defaultSectionStyles(),
  };
}

/** Generate a unique slug by appending a number if it already exists */
export function getUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug;
  let counter = 1;
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
}

export function createDefaultPage(title = "Halaman Baru", existingSlugs?: string[]): BuilderPage {
  let slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  if (slug === "") slug = "halaman-baru";
  if (existingSlugs && existingSlugs.length > 0) {
    slug = getUniqueSlug(slug, existingSlugs);
  }
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
    seo: {
      metaTitle: title,
      metaDescription: `${title} - Landing page profesional`,
      ogImage: "",
    },
  };
}

interface ElementDefaults {
  content: Record<string, any>;
  styles: Record<string, string>;
}

const elementDefaults: Record<ElementType, ElementDefaults> = {
  heading: {
    content: { text: "Judul Heading", level: "h2", align: "center" },
    styles: { color: "#111111", fontWeight: "800", textAlign: "center", margin: "0 0 16px" },
  },
  text: {
    content: { text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    styles: { color: "#666666", fontSize: "1rem", lineHeight: "1.8", textAlign: "center", margin: "0 0 0" },
  },
  image: {
    content: { src: "https://placehold.co/800x500/1e293b/64748b?text=Gambar", alt: "Gambar", caption: "" },
    styles: { borderRadius: "12px", maxWidth: "100%", margin: "0 0 0" },
  },
  button: {
    content: { text: "Klik Disini", href: "#", variant: "primary", target: "_self" },
    styles: { backgroundColor: "#2563eb", color: "#ffffff", borderRadius: "12px", padding: "14px 32px", fontSize: "16px", fontWeight: "600" },
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
    content: { icon: "star", size: "48px", color: "#2563eb" },
    styles: { textAlign: "center", margin: "0 0 0" },
  },
  features: {
    content: {
      title: "Fitur Unggulan",
      subtitle: "Mengapa memilih kami?",
      titleColor: "#111111",
      titleSize: "30px",
      titleWeight: "700",
      subtitleColor: "#666666",
      subtitleSize: "16px",
      itemBg: "#ffffff",
      itemBorder: "#eeeeee",
      itemTitleColor: "#111111",
      itemTextColor: "#666666",
      items: [
        { icon: "rocket", title: "Cepat & Handal", desc: "Optimasi performa terbaik untuk website Anda" },
        { icon: "lightbulb", title: "Desain Modern", desc: "Tampilan menarik yang disesuaikan dengan brand" },
        { icon: "globe", title: "Responsive", desc: "Tampil sempurna di semua perangkat" },
      ],
      columns: 3,
    },
    styles: { padding: "0", backgroundColor: "transparent" },
  },
  pricing: {
    content: {
      title: "Paket Layanan",
      subtitle: "Pilih paket yang sesuai kebutuhan Anda",
      titleColor: "#111111",
      titleSize: "30px",
      titleWeight: "700",
      subtitleColor: "#666666",
      subtitleSize: "16px",
      cardBg: "#ffffff",
      cardBorder: "#eeeeee",
      highlightBg: "rgba(37,99,235,0.06)",
      highlightBorder: "#2563eb",
      cardNameColor: "#111111",
      cardPriceColor: "#111111",
      cardDescColor: "#666666",
      cardFeatureColor: "#555555",
      items: [
        { name: "Basic", price: "", desc: "Cocok untuk pemula", features: ["1 Halaman", "Hosting Gratis", "Support Email"], highlighted: false, cta: "Konsultasi" },
        { name: "Pro", price: "", desc: "Untuk bisnis berkembang", features: ["5 Halaman", "Custom Domain", "Priority Support", "Analytics"], highlighted: true, cta: "Konsultasi" },
        { name: "Premium", price: "", desc: "Solusi lengkap", features: ["Unlimited Halaman", "SEO Optimasi", "24/7 Support", "Free Maintenance"], highlighted: false, cta: "Konsultasi" },
      ],
    },
    styles: { padding: "0", backgroundColor: "#f8f8f8" },
  },
  testimonial: {
    content: {
      title: "Apa Kata Klien",
      titleColor: "#111111",
      titleSize: "30px",
      titleWeight: "700",
      cardBg: "#ffffff",
      cardBorder: "#eeeeee",
      cardTextColor: "#555555",
      authorNameColor: "#111111",
      authorNameSize: "14px",
      authorNameWeight: "600",
      authorRoleColor: "#666666",
      authorRoleSize: "12px",
      avatarBg: "rgba(37,99,235,0.1)",
      avatarColor: "#2563eb",
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
      titleColor: "#ffffff",
      titleSize: "36px",
      titleWeight: "700",
      subtitleColor: "rgba(255,255,255,0.8)",
      subtitleSize: "16px",
      buttonBg: "#ffffff",
      buttonText: "Konsultasi Gratis",
      buttonTextColor: "#1e293b",
      buttonPaddingX: "32px",
      buttonPaddingY: "16px",
      buttonHref: "https://wa.me/6282210099969",
    },
    styles: { padding: "80px 0", backgroundColor: "#2563eb" },
  },
  stats: {
    content: {
      valueColor: "#2563eb",
      valueSize: "36px",
      valueWeight: "800",
      labelColor: "#94a3b8",
      labelSize: "14px",
      items: [
        { value: "50+", label: "Project Selesai" },
        { value: "30+", label: "Klien Puas" },
        { value: "5+", label: "Tahun Pengalaman" },
        { value: "24/7", label: "Support" },
      ],
      columns: 4,
    },
    styles: { padding: "60px 0", backgroundColor: "#111111" },
  },
  contactForm: {
    content: {
      title: "Hubungi Kami",
      subtitle: "Isi form di bawah dan kami akan menghubungi Anda",
      titleColor: "#111111",
      titleSize: "30px",
      titleWeight: "700",
      subtitleColor: "#666666",
      subtitleSize: "16px",
      inputBg: "#ffffff",
      inputBorder: "#eeeeee",
      inputText: "#111111",
      buttonBg: "#2563eb",
      buttonTextColor: "#ffffff",
      whatsappNumber: "6282210099969",
      recipientEmail: "",
      siteName: "",
      fields: ["name", "email", "phone", "message"],
    },
    styles: { padding: "0", backgroundColor: "transparent" },
  },
  maps: {
    content: {
      title: "Lokasi Kami",
      titleColor: "#111111",
      titleSize: "30px",
      titleWeight: "700",
      address: "Jakarta, Indonesia",
      addressColor: "#666666",
      embedUrl: "https://www.google.com/maps?q=-6.2088,106.8456&output=embed",
    },
    styles: { padding: "0", borderRadius: "12px", height: "400px" },
  },
  navbar: {
    content: {
      logo: "PAGODA STUDIO",
      logoImage: "",
      logoHeight: "32",
      logoAlign: "start",
      logoColor: "#111111",
      logoFontSize: "1.25rem",
      logoFontWeight: "700",
      menuAlign: "center",
      menuColor: "#666666",
      menuHoverColor: "#2563eb",
      menuFontWeight: "500",
      menuFontSize: "14px",
      ctaAlign: "end",
      ctaText: "Hubungi Kami",
      ctaHref: "https://wa.me/6282210099969",
      ctaColor: "#ffffff",
      ctaBgColor: "#2563eb",
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
      logoColor: "#ffffff",
      logoFontSize: "20px",
      logoFontWeight: "700",
      description: "Jasa pembuatan website profesional untuk bisnis Anda.",
      descColor: "#6b7280",
      descSize: "14px",
      linksHeading: "Links",
      linkHeadingColor: "#9ca3af",
      linkHeadingSize: "12px",
      linkColor: "#6b7280",
      linkSize: "14px",
      linkHoverColor: "#ffffff",
      socialIconBg: "rgba(255,255,255,0.05)",
      socialIconBorder: "rgba(255,255,255,0.1)",
      socialIconColor: "#9ca3af",
      socialIconHoverColor: "#2563eb",
      socialIconHoverBorder: "rgba(37,99,235,0.4)",
      copyrightColor: "#4b5563",
      copyrightSize: "14px",
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
    styles: { backgroundColor: "#111111", padding: "60px 0 30px" },
  },
  "three-background": {
    content: {
      intensity: 0.5,
      color: "#2563eb",
      animated: true,
    },
    styles: { position: "absolute", inset: "0", zIndex: "0" },
  },
  "three-scene": {
    content: {
      color: "#2563eb",
      intensity: 0.5,
      shapes: 6,
      animated: true,
      rotateSpeed: 0.5,
      modelMode: "shapes",
      modelSrc: "",
      modelColor: "#2563eb",
      modelWireframe: false,
      modelScale: 1.5,
      title: "",
      subtitle: "",
      buttonText: "",
      buttonHref: "#",
      textPosition: "center",
      titleColor: "#ffffff",
      titleSize: "36px",
      titleWeight: "800",
      subtitleColor: "#94a3b8",
      subtitleSize: "16px",
      buttonBg: "#2563eb",
      buttonColor: "#ffffff",
      buttonSize: "14px",
      buttonWeight: "600",
      overlayBg: "rgba(0,0,0,0.3)",
    },
    styles: { width: "100%", height: "400px", backgroundColor: "#0a0f1a" },
  },
  "three-particles": {
    content: {
      color: "#2563eb",
      particleCount: 300,
      speed: 0.5,
      size: 2,
    },
    styles: { width: "100%", height: "300px", backgroundColor: "#0a0f1a" },
  },
  "model-3d": {
    content: {
      src: "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/avatar/style-a/style-a.glb",
      autoRotate: true,
      rotateSpeed: 2,
      scale: 1.5,
      modelColor: "#2563eb",
      wireframe: false,
    },
    styles: { width: "100%", height: "400px", backgroundColor: "#0a0f1a" },
  },
  carousel: {
    content: {
      title: "Galeri Kami",
      titleColor: "#ffffff",
      titleSize: "30px",
      titleWeight: "700",
      subtitle: "",
      subtitleColor: "#94a3b8",
      subtitleSize: "16px",
      slides: [
        { image: "https://placehold.co/800x500/1e293b/64748b?text=Slide+1", caption: "Slide 1" },
        { image: "https://placehold.co/800x500/1e293b/22c55e?text=Slide+2", caption: "Slide 2" },
        { image: "https://placehold.co/800x500/1e293b/3b82f6?text=Slide+3", caption: "Slide 3" },
      ],
      autoPlay: true,
      interval: 4000,
      dotColor: "rgba(255,255,255,0.3)",
      dotActiveColor: "#2563eb",
      arrowColor: "#ffffff",
      arrowBg: "rgba(0,0,0,0.3)",
      captionColor: "#ffffff",
      captionSize: "14px",
      height: "400px",
    },
    styles: { padding: "0", backgroundColor: "transparent" },
  },
  accordion: {
    content: {
      title: "FAQ",
      titleColor: "#ffffff",
      titleSize: "30px",
      titleWeight: "700",
      subtitle: "",
      subtitleColor: "#94a3b8",
      subtitleSize: "16px",
      items: [
        { question: "Apa saja layanan yang tersedia?", answer: "Kami menyediakan layanan pembuatan website, desain grafis, dan pengembangan aplikasi web." },
        { question: "Berapa lama proses pengerjaan?", answer: "Estimasi pengerjaan 3-14 hari kerja tergantung kompleksitas proyek." },
        { question: "Apakah ada garansi?", answer: "Ya, kami memberikan garansi revisi 2x dan support 30 hari setelah project selesai." },
      ],
      itemBg: "rgba(255,255,255,0.05)",
      itemBorder: "rgba(255,255,255,0.1)",
      questionColor: "#ffffff",
      questionSize: "16px",
      questionWeight: "600",
      answerColor: "#94a3b8",
      answerSize: "14px",
      iconColor: "#2563eb",
    },
    styles: { padding: "0", backgroundColor: "transparent" },
  },
  team: {
    content: {
      title: "Tim Kami",
      titleColor: "#ffffff",
      titleSize: "30px",
      titleWeight: "700",
      subtitle: "Kenali tim profesional kami",
      subtitleColor: "#94a3b8",
      subtitleSize: "16px",
      members: [
        { name: "Andi Pratama", role: "CEO & Founder", image: "https://placehold.co/200x200/1e293b/22c55e?text=AP", socials: [{ platform: "instagram", url: "#" }, { platform: "linkedin", url: "#" }] },
        { name: "Budi Santoso", role: "Lead Developer", image: "https://placehold.co/200x200/1e293b/3b82f6?text=BS", socials: [{ platform: "instagram", url: "#" }, { platform: "linkedin", url: "#" }] },
        { name: "Citra Dewi", role: "UI/UX Designer", image: "https://placehold.co/200x200/1e293b/ec4899?text=CD", socials: [{ platform: "instagram", url: "#" }, { platform: "linkedin", url: "#" }] },
      ],
      cardBg: "rgba(255,255,255,0.05)",
      cardBorder: "rgba(255,255,255,0.1)",
      nameColor: "#ffffff",
      nameSize: "18px",
      nameWeight: "700",
      roleColor: "#94a3b8",
      roleSize: "14px",
      socialIconColor: "#666666",
      socialIconHoverColor: "#2563eb",
      avatarSize: "120px",
    },
    styles: { padding: "0", backgroundColor: "transparent" },
  },
  countdown: {
    content: {
      title: "Segera Hadir",
      titleColor: "#ffffff",
      titleSize: "30px",
      titleWeight: "700",
      subtitle: "",
      subtitleColor: "#94a3b8",
      subtitleSize: "16px",
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      labelDays: "Hari",
      labelHours: "Jam",
      labelMinutes: "Menit",
      labelSeconds: "Detik",
      numberColor: "#2563eb",
      numberSize: "48px",
      numberWeight: "800",
      labelColor: "#94a3b8",
      labelSize: "14px",
      boxBg: "rgba(255,255,255,0.05)",
      boxBorder: "rgba(255,255,255,0.1)",
      separatorColor: "rgba(255,255,255,0.1)",
    },
    styles: { padding: "60px 0", backgroundColor: "#111111", textAlign: "center" },
  },
  "animated-headline": {
    content: {
      beforeText: "Saya adalah",
      highlightedText: "Profesional",
      afterText: "",
      beforeTextColor: "#ffffff",
      beforeTextSize: "36px",
      beforeTextWeight: "700",
      highlightTextColor: "#2563eb",
      highlightTextSize: "36px",
      highlightTextWeight: "700",
      afterTextColor: "#ffffff",
      afterTextSize: "36px",
      afterTextWeight: "700",
      style: "highlight",
      animationType: "underline",
      tag: "h2",
      rotatingTexts: ["Kreatif", "Inovatif", "Profesional"],
      duration: 2000,
      loop: true,
    },
    styles: { color: "#ffffff", fontSize: "36px", fontWeight: "700", textAlign: "center" },
  },
  blockquote: {
    content: {
      quoteText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      quoteTextColor: "#d1d5db",
      quoteTextSize: "18px",
      quoteFontStyle: "italic",
      authorName: "Ahmad Fauzi",
      authorNameColor: "#2563eb",
      authorNameSize: "14px",
      authorNameWeight: "600",
      skin: "border",
      tweetButton: false,
      tweetLabel: "Tweet",
    },
    styles: { borderLeft: "4px solid #22c55e", padding: "0", backgroundColor: "transparent" },
  },
  "code-highlight": {
    content: {
      language: "javascript",
      code: 'console.log("Hello, World!");',
      showLineNumbers: true,
      copyButton: true,
    },
    styles: { backgroundColor: "#1e293b", borderRadius: "12px", padding: "20px", fontSize: "14px" },
  },
  "flip-box": {
    content: {
      frontGraphic: "icon",
      frontIcon: "star",
      frontImage: "",
      frontTitle: "Front Side",
      frontTitleColor: "#ffffff",
      frontTitleSize: "20px",
      frontTitleWeight: "700",
      frontDescription: "This is the front side description",
      frontDescColor: "#94a3b8",
      frontDescSize: "14px",
      frontIconColor: "#2563eb",
      frontBackground: "#1e293b",
      backImage: "",
      backTitle: "Back Side",
      backTitleColor: "#ffffff",
      backTitleSize: "20px",
      backTitleWeight: "700",
      backDescription: "This is the back side with more info!",
      backDescColor: "rgba(255,255,255,0.8)",
      backDescSize: "14px",
      backBackground: "#2563eb",
      backButtonText: "Learn More",
      backButtonLink: "#",
      backButtonBg: "#ffffff",
      backButtonTextColor: "#1e293b",
      backButtonSize: "14px",
      backButtonWeight: "600",
    },
    styles: { height: "300px", borderRadius: "12px" },
  },
  hotspot: {
    content: {
      imageSrc: "https://placehold.co/800x500/1e293b/64748b?text=Hotspot+Image",
      markerColor: "#2563eb",
      markerSize: "32px",
      markerTextColor: "#ffffff",
      markerTextSize: "14px",
      popupBg: "#1e293b",
      popupBorder: "rgba(255,255,255,0.1)",
      popupWidth: "192px",
      popupPadding: "12px",
      popupRadius: "12px",
      labelColor: "#2563eb",
      labelSize: "12px",
      labelWeight: "600",
      descColor: "#94a3b8",
      descSize: "10px",
      items: [
        { label: "Point 1", x: "20%", y: "30%", icon: "star", description: "Description of point 1" },
        { label: "Point 2", x: "70%", y: "60%", icon: "star", description: "Description of point 2" },
      ],
    },
    styles: { borderRadius: "12px", position: "relative" },
  },
  "progress-tracker": {
    content: {
      type: "horizontal",
      percentage: true,
      progress: 65,
      label: "Progress",
      labelColor: "#94a3b8",
      labelSize: "12px",
      labelWeight: "400",
      percentageColor: "#2563eb",
      percentageSize: "12px",
      percentageWeight: "600",
      barColor: "#2563eb",
      trackColor: "#1e293b",
      barHeight: "6px",
      barRadius: "9999px",
      circleSize: "120px",
      strokeWidth: "8",
    },
    styles: { width: "100%", height: "6px", backgroundColor: "#1e293b", accentColor: "#2563eb" },
  },
  "share-buttons": {
    content: {
      view: "icon-text",
      skin: "gradient",
      networks: [
        { name: "facebook", text: "Facebook" },
        { name: "twitter", text: "Twitter" },
        { name: "linkedin", text: "LinkedIn" },
      ],
    },
    styles: { textAlign: "center", gap: "10px" },
  },
  checklist: {
    content: {
      title: "Keunggulan Kami",
      titleColor: "#ffffff",
      titleSize: "18px",
      titleWeight: "700",
      items: [
        { text: "Cepat & Handal", icon: "check", checked: true },
        { text: "Desain Modern", icon: "check", checked: true },
        { text: "Responsive", icon: "check", checked: true },
      ],
      checkedColor: "#2563eb",
      uncheckedColor: "#666666",
      textColor: "#ffffff",
      textSize: "16px",
      iconSize: "20px",
    },
    styles: { padding: "0", backgroundColor: "transparent" },
  },
  gallery: {
    content: {
      title: "Galeri",
      titleColor: "#ffffff",
      titleSize: "24px",
      titleWeight: "700",
      images: [
        { src: "https://placehold.co/600x400/1e293b/22c55e?text=Image+1", caption: "Image 1", alt: "Image 1" },
        { src: "https://placehold.co/600x400/1e293b/3b82f6?text=Image+2", caption: "Image 2", alt: "Image 2" },
        { src: "https://placehold.co/600x400/1e293b/ec4899?text=Image+3", caption: "Image 3", alt: "Image 3" },
        { src: "https://placehold.co/600x400/1e293b/f59e0b?text=Image+4", caption: "Image 4", alt: "Image 4" },
        { src: "https://placehold.co/600x400/1e293b/22c55e?text=Image+5", caption: "Image 5", alt: "Image 5" },
        { src: "https://placehold.co/600x400/1e293b/8b5cf6?text=Image+6", caption: "Image 6", alt: "Image 6" },
      ],
      columns: 3,
      lightbox: true,
      captionColor: "#ffffff",
      captionSize: "14px",
      captionWeight: "400",
    },
    styles: { padding: "0", backgroundColor: "transparent" },
  },
  lottie: {
    content: {
      src: "https://assets2.lottiefiles.com/packages/lf20_UJNc2t.json",
      loop: true,
      autoplay: true,
      speed: 1,
      width: "300px",
      height: "300px",
      backgroundColor: "transparent",
    },
    styles: { display: "flex", justifyContent: "center", alignItems: "center" },
  },
  "star-rating": {
    content: {
      title: "Rating",
      rating: 4.5,
      scale: 5,
      starColor: "#f59e0b",
      emptyColor: "#374151",
      showValue: true,
      size: "24px",
      align: "center",
      titleColor: "#94a3b8",
      titleSize: "14px",
      titleWeight: "500",
    },
    styles: { textAlign: "center", padding: "20px 0" },
  },
  search: {
    content: {
      placeholder: "Cari...",
      buttonText: "Cari",
      buttonIcon: true,
      skin: "classic",
      backgroundColor: "rgba(255,255,255,0.05)",
      textColor: "#ffffff",
      borderColor: "rgba(255,255,255,0.1)",
      buttonColor: "#2563eb",
      buttonTextColor: "#ffffff",
    },
    styles: { maxWidth: "500px", margin: "0 auto" },
  },
  "floating-buttons": {
    content: {
      buttons: [
        { icon: "chat", label: "Chat", link: "#", color: "#2563eb" },
        { icon: "phone", label: "Call", link: "tel:+6282210099969", color: "#3b82f6" },
        { icon: "mail", label: "Email", link: "mailto:hello@example.com", color: "#8b5cf6" },
      ],
      position: "bottom-right",
    },
    styles: { position: "fixed", bottom: "24px", right: "24px", zIndex: "50" },
  },
  breadcrumbs: {
    content: {
      items: [
        { label: "Beranda", href: "/" },
        { label: "Layanan", href: "/services" },
        { label: "Halaman Saat Ini", href: "" },
      ],
      separator: "/",
      textColor: "#94a3b8",
      activeColor: "#ffffff",
      separatorColor: "#4b5563",
      textSize: "14px",
    },
    styles: { padding: "16px 0", backgroundColor: "transparent" },
  },
  "off-canvas": {
    content: {
      title: "Menu",
      position: "right",
      width: "320px",
      height: "100%",
      entrance: "slide",
      overlay: true,
      overlayColor: "rgba(0,0,0,0.5)",
      closeButton: true,
      panelBg: "#111111",
      panelTextColor: "#ffffff",
      panelLinkColor: "#94a3b8",
      panelLinkHoverColor: "#2563eb",
      items: [
        { label: "Beranda", href: "#", icon: "home" },
        { label: "Layanan", href: "#" },
        { label: "Tentang", href: "#" },
        { label: "Kontak", href: "#" },
      ],
    },
    styles: { position: "relative" },
  },
  slides: {
    content: {
      title: "",
      slideHeight: "600px",
      autoplay: true,
      interval: 5000,
      navigation: "arrows",
      pagination: true,
      kenBurns: true,
      arrowColor: "#ffffff",
      arrowBg: "rgba(0,0,0,0.3)",
      dotColor: "rgba(255,255,255,0.3)",
      dotActiveColor: "#2563eb",
      slideTitleColor: "#ffffff",
      slideTitleSize: "48px",
      slideDescColor: "rgba(255,255,255,0.8)",
      slideDescSize: "18px",
      buttonBg: "#2563eb",
      buttonColor: "#ffffff",
      buttonText: "Pelajari",
      slides: [
        {
          title: "Slide 1",
          description: "Deskripsi slide pertama",
          image: "https://placehold.co/1400x600/1e293b/22c55e?text=Slide+1",
          buttonText: "Pelajari",
          buttonLink: "#",
          kenBurnsDirection: "center",
        },
        {
          title: "Slide 2",
          description: "Deskripsi slide kedua",
          image: "https://placehold.co/1400x600/1e293b/3b82f6?text=Slide+2",
          buttonText: "Pelajari",
          buttonLink: "#",
          kenBurnsDirection: "right",
        },
        {
          title: "Slide 3",
          description: "Deskripsi slide ketiga",
          image: "https://placehold.co/1400x600/1e293b/ec4899?text=Slide+3",
          buttonText: "Pelajari",
          buttonLink: "#",
          kenBurnsDirection: "left",
        },
      ],
    },
    styles: { position: "relative", overflow: "hidden" },
  },
  "nested-carousel": {
    content: {
      title: "Carousel",
      titleColor: "#ffffff",
      titleSize: "30px",
      titleWeight: "700",
      slidesPerView: 3,
      autoplay: true,
      interval: 4000,
      loop: true,
      navigation: "arrows",
      pagination: true,
      gap: 20,
      arrowColor: "#ffffff",
      arrowBg: "rgba(0,0,0,0.3)",
      dotColor: "rgba(255,255,255,0.3)",
      dotActiveColor: "#2563eb",
      slideBg: "rgba(255,255,255,0.05)",
      slideBorder: "rgba(255,255,255,0.1)",
      slideBorderRadius: "12px",
      cardTitleColor: "#ffffff",
      cardTitleSize: "16px",
      cardTitleWeight: "700",
      cardDescColor: "#94a3b8",
      cardDescSize: "14px",
      slides: [
        {
          title: "Card 1",
          description: "Deskripsi card 1",
          image: "https://placehold.co/400x300/1e293b/22c55e?text=Card+1",
        },
        {
          title: "Card 2",
          description: "Deskripsi card 2",
          image: "https://placehold.co/400x300/1e293b/3b82f6?text=Card+2",
        },
        {
          title: "Card 3",
          description: "Deskripsi card 3",
          image: "https://placehold.co/400x300/1e293b/ec4899?text=Card+3",
        },
        {
          title: "Card 4",
          description: "Deskripsi card 4",
          image: "https://placehold.co/400x300/1e293b/f59e0b?text=Card+4",
        },
      ],
    },
    styles: { padding: "0", backgroundColor: "transparent", position: "relative" },
  },
  "video-playlist": {
    content: {
      title: "Video Playlist",
      titleColor: "#ffffff",
      titleSize: "20px",
      playlistBg: "#111111",
      playlistItemBg: "rgba(255,255,255,0.03)",
      playlistItemHoverBg: "rgba(255,255,255,0.08)",
      playlistItemActiveBg: "rgba(34,197,94,0.1)",
      playlistTitleColor: "#ffffff",
      playlistDescColor: "#94a3b8",
      thumbnailWidth: "120px",
      playerBg: "#000000",
      accentColor: "#2563eb",
      videos: [
        { title: "Video 1", description: "Deskripsi video 1", type: "youtube", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", duration: "3:45" },
        { title: "Video 2", description: "Deskripsi video 2", type: "youtube", url: "https://www.youtube.com/embed/jNQXAC9IVRw", duration: "0:19" },
        { title: "Video 3", description: "Deskripsi video 3", type: "youtube", url: "https://www.youtube.com/embed/9bZkp7q19f0", duration: "4:35" },
      ],
    },
    styles: { borderRadius: "12px", overflow: "hidden" },
  },
  "table-of-contents": {
    content: {
      title: "Daftar Isi",
      titleTag: "h3",
      headingTags: ["h1", "h2", "h3", "h4"],
      markers: "numbers",
      wordWrap: true,
      minimizeBox: true,
      containerSelector: "",
      noHeadingsMsg: "Tidak ada heading ditemukan",
      titleColor: "#ffffff",
      titleSize: "18px",
      linkColor: "#94a3b8",
      linkHoverColor: "#2563eb",
      linkActiveColor: "#2563eb",
      linkSize: "14px",
      markerColor: "#2563eb",
      backgroundColor: "rgba(255,255,255,0.03)",
      borderColor: "rgba(255,255,255,0.1)",
      borderRadius: "12px",
      padding: "20px",
      items: [
        { text: "Pendahuluan", level: 2, href: "#" },
        { text: "Fitur Utama", level: 2, href: "#" },
        { text: "Harga & Paket", level: 2, href: "#" },
        { text: "FAQ", level: 2, href: "#" },
      ],
    },
    styles: { padding: "0", backgroundColor: "transparent", borderRadius: "12px" },
  },
  "custom-html": {
    content: {
      html: "<div style=\"padding: 40px; text-align: center; background: #f8f8f8; border-radius: 12px;\">\n  <h3 style=\"margin: 0 0 8px; color: #1e293b;\">Custom HTML</h3>\n  <p style=\"margin: 0; color: #64748b;\">Edit HTML Anda di sini</p>\n</div>",
      title: "Custom HTML",
    },
    styles: { padding: "0", backgroundColor: "transparent", borderRadius: "0" },
  },
  "social-embed": {
    content: {
      type: "facebook-page",
      url: "https://www.facebook.com/facebook",
      layout: "timeline",
      smallHeader: false,
      hideCover: false,
      showFacepile: true,
      width: "340px",
      height: "500px",
      colorScheme: "light",
      buttonType: "like",
      buttonLayout: "standard",
      buttonSize: "small",
      shareButton: false,
      showFaces: true,
      commentsCount: 10,
      commentsOrder: "social",
      title: "Facebook",
      titleColor: "#ffffff",
      titleSize: "18px",
    },
    styles: { textAlign: "center", padding: "0" },
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

/**
 * Convert AI-generated JSON element to a proper BuilderElement with valid ID
 */
function aiElementToBuilder(type: string, content: any, styles: any): BuilderElement {
  // Map AI's creative type names to our valid types
  const typeAliases: Record<string, ElementType> = {
    // Section type aliases (mapped to container-like elements)
    "custom": "heading",
    "custom-section": "heading",
    "unique": "heading",
    "special": "heading",
    // Hero variants
    "herosection": "heading",
    "herobanner": "heading",
    "billboard": "heading",
    "cover": "heading",
    "jumbotron": "heading",
    "masthead": "heading",
    // About/Info variants
    "profile": "heading",
    "about-us": "heading",
    "company": "heading",
    "story": "text",
    "mission": "text",
    "vision": "text",
    // Heading variants
    "headline": "heading",
    "title": "heading",
    "judul": "heading",
    "header": "heading",
    "subheading": "heading",
    "tagline": "heading",
    // Text variants
    "paragraph": "text",
    "description": "text",
    "deskripsi": "text",
    "content": "text",
    "body": "text",
    // Button variants
    "cta-button": "button",
    "ctabutton": "button",
    "link": "button",
    "tombol": "button",
    // Icon variants
    "icon-box": "icon",
    "iconbox": "icon",
    "iconCard": "icon",
    // Features variants
    "feature": "features",
    "services": "features",
    "fitur": "features",
    "layanan": "features",
    // Testimonial variants
    "testimonials": "testimonial",
    "review": "testimonial",
    "reviews": "testimonial",
    // Pricing variants
    "price": "pricing",
    "paket": "pricing",
    "pricing-table": "pricing",
    // CTA variants
    "call-to-action": "cta",
    "calltoaction": "cta",
    "hero-cta": "cta",
    "banner": "cta",
    "promo": "cta",
    "newsletter": "cta",
    // Stats variants
    "statistics": "stats",
    "counter": "stats",
    "counters": "stats",
    "achievements": "stats",
    // Image variants
    "photo": "image",
    "gambar": "image",
    "illustration": "image",
    "illustrasi": "image",
    // Video variants
    "youtube": "video",
    "embed": "video",
    // Contact variants
    "contact": "contactForm",
    "kontak": "contactForm",
    "form": "contactForm",
    "contact-form": "contactForm",
    // Maps variants
    "map": "maps",
    "location": "maps",
    "lokasi": "maps",
    // Nav variants
    "navigation": "navbar",
    "nav": "navbar",
    "menu": "navbar",
    // Footer variant
    "foot": "footer",
    // Divider variants
    "separator": "divider",
    "hr": "divider",
    "line": "divider",
    // Accordion/FAQ variants
    "faq": "accordion",
    "questions": "accordion",
    // Team variants
    "teams": "team",
    "members": "team",
    "people": "team",
    // Carousel variants
    "slider": "carousel",
    "gallery": "carousel",
    "galeri": "carousel",
    "showcase": "carousel",
    "portfolio-gallery": "carousel",
    "work": "features",
    // Countdown variants
    "timer": "countdown",
    "coming-soon": "countdown",
    "event-date": "countdown",
  };

  const validTypes: ElementType[] = [
    "heading", "text", "image", "button", "video", "spacer", "divider", "icon",
    "features", "pricing", "testimonial", "cta", "stats", "contactForm", "maps",
    "navbar", "footer", "three-background", "three-scene", "three-particles", "model-3d", "carousel", "accordion", "team", "countdown",
    "animated-headline", "blockquote", "code-highlight", "flip-box", "hotspot",
    "progress-tracker", "share-buttons", "checklist", "gallery", "lottie",
    "star-rating", "search", "floating-buttons", "breadcrumbs",
    "off-canvas", "slides", "nested-carousel", "video-playlist", "table-of-contents", "social-embed",
    "custom-html",
  ];
  
  // Check alias first, then valid types, fallback to heading for visual emphasis
  const normalizedType = (type || "").toLowerCase();
  const elType = typeAliases[normalizedType] || 
    (validTypes.includes(type as ElementType) ? type as ElementType : "heading");
  
  // Fill empty content with defaults — AI sering lupa isi konten!
  const mergedContent = fillContentDefaults(elType, content);
  
  return {
    id: genId(),
    type: elType,
    content: mergedContent,
    styles: styles || {},
  };
}

/**
 * Fallback content — jika AI lupa/kosong, isi dengan konten default
 * Menggunakan elementDefaults sebagai single source of truth
 */
function fillContentDefaults(elType: ElementType, aiContent: any): Record<string, any> {
  const defaults = elementDefaults[elType]?.content || {};
  const content = aiContent || {};
  const isEmpty = Object.keys(content).length === 0;
  
  if (isEmpty) {
    return JSON.parse(JSON.stringify(defaults));
  }
  
  // Isi field yang kosong dengan default
  for (const key of Object.keys(defaults)) {
    const val = content[key];
    if (val === undefined || val === null || val === '') {
      content[key] = defaults[key];
    }
  }
  
  // Untuk field array khusus — isi jika kosong
  const arrayFields = ['items', 'links', 'socials', 'slides', 'members', 'fields', 'elements'];
  for (const field of arrayFields) {
    if (Array.isArray(content[field]) && content[field].length === 0 && defaults[field]) {
      content[field] = JSON.parse(JSON.stringify(defaults[field]));
    }
  }
  
  return content;
}

/**
 * Convert AI-generated JSON column to a proper BuilderColumn
 */
function aiColumnToBuilder(col: any): BuilderColumn {
  return {
    id: genId("col"),
    width: col.width || 12,
    elements: (col.elements || []).map((el: any) => aiElementToBuilder(el.type, el.content, el.styles)),
  };
}

/**
 * Convert AI-generated JSON section to a proper BuilderSection
 */
export function aiSectionToBuilder(section: any): BuilderSection {
  return {
    id: genId("sec"),
    columns: (section.columns || [{ width: 12, elements: [] }]).map(aiColumnToBuilder),
    styles: {
      padding: section.styles?.padding || "0",
      backgroundColor: section.styles?.backgroundColor || "transparent",
      containerWidth: section.styles?.containerWidth || "boxed",
    },
  };
}
