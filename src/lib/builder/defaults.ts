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
    padding: "0",
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
      titleColor: "#ffffff",
      titleSize: "30px",
      titleWeight: "700",
      subtitleColor: "#94a3b8",
      subtitleSize: "16px",
      itemBg: "rgba(255,255,255,0.05)",
      itemBorder: "rgba(255,255,255,0.1)",
      itemTitleColor: "#ffffff",
      itemTextColor: "#94a3b8",
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
      titleColor: "#ffffff",
      titleSize: "30px",
      titleWeight: "700",
      subtitleColor: "#94a3b8",
      subtitleSize: "16px",
      cardBg: "rgba(255,255,255,0.05)",
      cardBorder: "rgba(255,255,255,0.1)",
      highlightBg: "rgba(34,197,94,0.05)",
      highlightBorder: "#22c55e",
      cardNameColor: "#ffffff",
      cardPriceColor: "#ffffff",
      cardDescColor: "#94a3b8",
      cardFeatureColor: "#d1d5db",
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
      titleColor: "#ffffff",
      titleSize: "30px",
      titleWeight: "700",
      cardBg: "rgba(255,255,255,0.05)",
      cardBorder: "rgba(255,255,255,0.1)",
      cardTextColor: "#d1d5db",
      authorNameColor: "#ffffff",
      authorNameSize: "14px",
      authorNameWeight: "600",
      authorRoleColor: "#6b7280",
      authorRoleSize: "12px",
      avatarBg: "rgba(34,197,94,0.2)",
      avatarColor: "#22c55e",
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
    styles: { padding: "80px 0", backgroundColor: "#22c55e" },
  },
  stats: {
    content: {
      valueColor: "#22c55e",
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
    styles: { padding: "60px 0", backgroundColor: "#0f172a" },
  },
  contactForm: {
    content: {
      title: "Hubungi Kami",
      subtitle: "Isi form di bawah dan kami akan menghubungi Anda",
      titleColor: "#ffffff",
      titleSize: "30px",
      titleWeight: "700",
      subtitleColor: "#94a3b8",
      subtitleSize: "16px",
      inputBg: "rgba(255,255,255,0.05)",
      inputBorder: "rgba(255,255,255,0.1)",
      inputText: "#ffffff",
      buttonBg: "#22c55e",
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
      titleColor: "#ffffff",
      titleSize: "30px",
      titleWeight: "700",
      address: "Jakarta, Indonesia",
      addressColor: "#94a3b8",
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
      socialIconHoverColor: "#22c55e",
      socialIconHoverBorder: "rgba(34,197,94,0.4)",
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
      dotActiveColor: "#22c55e",
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
      iconColor: "#22c55e",
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
      socialIconColor: "#64748b",
      socialIconHoverColor: "#22c55e",
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
      numberColor: "#22c55e",
      numberSize: "48px",
      numberWeight: "800",
      labelColor: "#94a3b8",
      labelSize: "14px",
      boxBg: "rgba(255,255,255,0.05)",
      boxBorder: "rgba(255,255,255,0.1)",
      separatorColor: "rgba(255,255,255,0.1)",
    },
    styles: { padding: "60px 0", backgroundColor: "#0f172a", textAlign: "center" },
  },
  "animated-headline": {
    content: {
      beforeText: "Saya adalah",
      highlightedText: "Profesional",
      afterText: "",
      beforeTextColor: "#ffffff",
      beforeTextSize: "36px",
      beforeTextWeight: "700",
      highlightTextColor: "#22c55e",
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
      authorNameColor: "#22c55e",
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
      frontIconColor: "#22c55e",
      frontBackground: "#1e293b",
      backImage: "",
      backTitle: "Back Side",
      backTitleColor: "#ffffff",
      backTitleSize: "20px",
      backTitleWeight: "700",
      backDescription: "This is the back side with more info!",
      backDescColor: "rgba(255,255,255,0.8)",
      backDescSize: "14px",
      backBackground: "#22c55e",
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
      markerColor: "#22c55e",
      markerSize: "32px",
      markerTextColor: "#ffffff",
      markerTextSize: "14px",
      popupBg: "#1e293b",
      popupBorder: "rgba(255,255,255,0.1)",
      popupWidth: "192px",
      popupPadding: "12px",
      popupRadius: "12px",
      labelColor: "#22c55e",
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
      percentageColor: "#22c55e",
      percentageSize: "12px",
      percentageWeight: "600",
      barColor: "#22c55e",
      trackColor: "#1e293b",
      barHeight: "6px",
      barRadius: "9999px",
      circleSize: "120px",
      strokeWidth: "8",
    },
    styles: { width: "100%", height: "6px", backgroundColor: "#1e293b", accentColor: "#22c55e" },
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
      checkedColor: "#22c55e",
      uncheckedColor: "#64748b",
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
      buttonColor: "#22c55e",
      buttonTextColor: "#ffffff",
    },
    styles: { maxWidth: "500px", margin: "0 auto" },
  },
  "floating-buttons": {
    content: {
      buttons: [
        { icon: "chat", label: "Chat", link: "#", color: "#22c55e" },
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
      panelBg: "#0f172a",
      panelTextColor: "#ffffff",
      panelLinkColor: "#94a3b8",
      panelLinkHoverColor: "#22c55e",
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
      dotActiveColor: "#22c55e",
      slideTitleColor: "#ffffff",
      slideTitleSize: "48px",
      slideDescColor: "rgba(255,255,255,0.8)",
      slideDescSize: "18px",
      buttonBg: "#22c55e",
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
      dotActiveColor: "#22c55e",
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
      playlistBg: "#0f172a",
      playlistItemBg: "rgba(255,255,255,0.03)",
      playlistItemHoverBg: "rgba(255,255,255,0.08)",
      playlistItemActiveBg: "rgba(34,197,94,0.1)",
      playlistTitleColor: "#ffffff",
      playlistDescColor: "#94a3b8",
      thumbnailWidth: "120px",
      playerBg: "#000000",
      accentColor: "#22c55e",
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
      linkHoverColor: "#22c55e",
      linkActiveColor: "#22c55e",
      linkSize: "14px",
      markerColor: "#22c55e",
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
    "navbar", "footer", "three-background", "carousel", "accordion", "team", "countdown",
    "animated-headline", "blockquote", "code-highlight", "flip-box", "hotspot",
    "progress-tracker", "share-buttons", "checklist", "gallery", "lottie",
    "star-rating", "search", "floating-buttons", "breadcrumbs",
    "off-canvas", "slides", "nested-carousel", "video-playlist", "table-of-contents", "social-embed",
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
  const arrayFields = ['items', 'links', 'socials', 'slides', 'members', 'fields'];
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
