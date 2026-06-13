import type { BuilderPage, BuilderSection } from "./types";
import { genId, defaultGlobalStyles } from "./defaults";
import { createElement } from "./defaults";

export interface Template {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  previewColor: string;
  icon: string;
  sections: BuilderSection[];
  globalStyles: typeof defaultGlobalStyles;
}

function heroSection(heading: string, subtitle: string, btnText: string): BuilderSection {
  return {
    id: genId("sec"),
    columns: [
      {
        id: genId("col"),
        width: 12,
        elements: [
          createElement("heading", {
            text: heading,
            level: "h1",
            align: "center",
          }),
          createElement("text", {
            text: subtitle,
          }),
          createElement("button", {
            text: btnText,
            variant: "primary",
            href: "#",
            target: "_self",
          }),
        ],
      },
    ],
    styles: { padding: "120px 0 80px", backgroundColor: "transparent", containerWidth: "boxed" },
  };
}

function featuresSection(title: string, subtitle: string): BuilderSection {
  return {
    id: genId("sec"),
    columns: [
      {
        id: genId("col"),
        width: 12,
        elements: [
          createElement("features", {
            title,
            subtitle,
            items: [
              { icon: "star", title: "Kualitas Terbaik", desc: "Kami mengutamakan kualitas dalam setiap project yang kami kerjakan" },
              { icon: "rocket", title: "Cepat & Optimal", desc: "Website dioptimasi untuk kecepatan loading dan performa maksimal" },
              { icon: "shield", title: "Aman & Terpercaya", desc: "Keamanan data Anda adalah prioritas utama kami" },
              { icon: "lightbulb", title: "Inovatif", desc: "Selalu mengikuti tren dan teknologi terbaru dalam web development" },
              { icon: "users", title: "Tim Profesional", desc: "Didukung oleh tim developer yang berpengalaman dan ahli" },
              { icon: "chart", title: "Hasil Terukur", desc: "Dashboard analytics untuk memantau performa website Anda" },
            ],
            columns: 3,
          }),
        ],
      },
    ],
    styles: { padding: "80px 0", backgroundColor: "#f8fafc", containerWidth: "boxed" },
  };
}

function aboutSection(): BuilderSection {
  return {
    id: genId("sec"),
    columns: [
      {
        id: genId("col"),
        width: 6,
        elements: [
          createElement("image", {
            src: "https://placehold.co/600x400/1e293b/64748b?text=Tentang+Kami",
            alt: "Tentang Kami",
          }),
        ],
      },
      {
        id: genId("col"),
        width: 6,
        elements: [
          createElement("heading", {
            text: "Tentang Kami",
            level: "h2",
            align: "left",
          }),
          createElement("text", {
            text: "Kami adalah tim profesional yang berdedikasi dalam menciptakan website berkualitas tinggi. Dengan pengalaman bertahun-tahun, kami telah membantu banyak bisnis mengembangkan kehadiran online mereka dan mencapai pertumbuhan yang signifikan melalui solusi digital yang inovatif.",
          }),
          createElement("stats", {
            items: [
              { value: "50+", label: "Project Selesai" },
              { value: "30+", label: "Klien Puas" },
              { value: "5+", label: "Tahun Pengalaman" },
            ],
            columns: 3,
          }),
        ],
      },
    ],
    styles: { padding: "80px 0", backgroundColor: "transparent", containerWidth: "boxed" },
  };
}

function testimonialsSection(): BuilderSection {
  return {
    id: genId("sec"),
    columns: [
      {
        id: genId("col"),
        width: 12,
        elements: [
          createElement("testimonial", {
            title: "Apa Kata Klien Kami",
            items: [
              { name: "Ahmad Fauzi", role: "CEO Startup", text: "Pelayanan luar biasa! Website kami jadi jauh lebih profesional dan meningkatkan kepercayaan pelanggan.", rating: 5, avatar: "AF" },
              { name: "Siti Rahma", role: "Owner Bisnis", text: "Proses cepat dan hasilnya memuaskan. Highly recommended untuk yang butuh website berkualitas!", rating: 5, avatar: "SR" },
              { name: "Budi Santoso", role: "Founder", text: "Tim sangat responsif dan memahami kebutuhan kami. Hasilnya超出了 ekspektasi!", rating: 5, avatar: "BS" },
            ],
          }),
        ],
      },
    ],
    styles: { padding: "80px 0", backgroundColor: "transparent", containerWidth: "boxed" },
  };
}

function ctaSection(title: string, btnText: string): BuilderSection {
  return {
    id: genId("sec"),
    columns: [
      {
        id: genId("col"),
        width: 12,
        elements: [
          createElement("cta", {
            title,
            subtitle: "Jangan tunda lagi. Mulai perjalanan digital Anda bersama kami.",
            buttonText: btnText,
            buttonHref: "/auth/register",
          }),
        ],
      },
    ],
    styles: { padding: "80px 0", backgroundColor: "#22c55e", containerWidth: "boxed" },
  };
}

function pricingSection(): BuilderSection {
  return {
    id: genId("sec"),
    columns: [
      {
        id: genId("col"),
        width: 12,
        elements: [
          createElement("pricing", {
            title: "Paket Harga",
            subtitle: "Pilih paket yang sesuai dengan kebutuhan Anda",
            items: [
              { name: "Basic", price: "Rp 99K", desc: "Cocok untuk pemula", features: ["1 Halaman", "Hosting Gratis", "Support Email"], highlighted: false, cta: "Pilih Paket" },
              { name: "Pro", price: "Rp 299K", desc: "Untuk bisnis berkembang", features: ["5 Halaman", "Custom Domain", "Priority Support", "Analytics"], highlighted: true, cta: "Pilih Paket" },
              { name: "Premium", price: "Rp 599K", desc: "Solusi lengkap", features: ["Unlimited Halaman", "SEO Optimasi", "24/7 Support", "Free Maintenance"], highlighted: false, cta: "Pilih Paket" },
            ],
          }),
        ],
      },
    ],
    styles: { padding: "80px 0", backgroundColor: "#f8fafc", containerWidth: "boxed" },
  };
}

function contactSection(): BuilderSection {
  return {
    id: genId("sec"),
    columns: [
      {
        id: genId("col"),
        width: 6,
        elements: [
          createElement("heading", { text: "Hubungi Kami", level: "h2", align: "left" }),
          createElement("text", { text: "Isi form di samping dan tim kami akan segera menghubungi Anda." }),
          createElement("icon", { icon: "globe", size: "64px", color: "#22c55e" }),
        ],
      },
      {
        id: genId("col"),
        width: 6,
        elements: [
          createElement("contactForm", {
            title: "",
            subtitle: "",
            whatsappNumber: "6282210099969",
          }),
        ],
      },
    ],
    styles: { padding: "80px 0", backgroundColor: "transparent", containerWidth: "boxed" },
  };
}

function footerTemplate(): BuilderSection {
  return {
    id: genId("sec"),
    columns: [
      {
        id: genId("col"),
        width: 12,
        elements: [
          createElement("footer", {
            logo: "PAGODA STUDIO",
            description: "Jasa pembuatan website profesional untuk bisnis Anda.",
            links: [
              { label: "Beranda", href: "#" },
              { label: "Layanan", href: "#" },
              { label: "Portfolio", href: "#" },
              { label: "Kontak", href: "#" },
            ],
            socials: [
              { platform: "instagram", url: "#" },
              { platform: "facebook", url: "#" },
              { platform: "youtube", url: "#" },
            ],
          }),
        ],
      },
    ],
    styles: { padding: "60px 0 30px", backgroundColor: "#0f172a", containerWidth: "boxed" },
  };
}

function navbarSection(): BuilderSection {
  return {
    id: genId("sec"),
    columns: [
      {
        id: genId("col"),
        width: 12,
        elements: [
          createElement("navbar", {
            logo: "PAGODA STUDIO",
            links: [
              { label: "Beranda", href: "#" },
              { label: "Tentang", href: "#" },
              { label: "Layanan", href: "#" },
              { label: "Kontak", href: "#" },
            ],
            ctaText: "Hubungi Kami",
            ctaHref: "https://wa.me/6282210099969",
            sticky: true,
          }),
        ],
      },
    ],
    styles: { padding: "0", backgroundColor: "transparent", containerWidth: "boxed" },
  };
}

export const templates: Template[] = [
  {
    id: "landing-startup",
    title: "Landing Page Startup",
    slug: "landing-startup",
    description: "Template modern untuk startup atau produk digital. Cocok untuk perusahaan teknologi yang ingin tampil profesional dan meyakinkan investor.",
    category: "Bisnis",
    previewColor: "from-emerald-500 to-teal-600",
    icon: "🚀",
    globalStyles: { ...defaultGlobalStyles, fontFamily: "Inter, sans-serif", primaryColor: "#22c55e" },
    sections: [
      navbarSection(),
      heroSection(
        "Tingkatkan Bisnis Anda\nke Level Selanjutnya",
        "Solusi digital terpercaya untuk mengembangkan bisnis Anda. Dengan teknologi terkini dan tim profesional, kami siap membantu Anda mencapai tujuan.",
        "Mulai Sekarang"
      ),
      featuresSection("Fitur Unggulan", "Mengapa memilih kami sebagai partner digital Anda"),
      aboutSection(),
      pricingSection(),
      testimonialsSection(),
      ctaSection("Siap Memulai?", "Konsultasi Gratis"),
      footerTemplate(),
    ],
  },
  {
    id: "company-profile",
    title: "Company Profile",
    slug: "company-profile",
    description: "Template company profile profesional untuk memperkenalkan perusahaan Anda kepada klien potensial dengan tampilan elegan.",
    category: "Bisnis",
    previewColor: "from-blue-500 to-indigo-600",
    icon: "🏢",
    globalStyles: { ...defaultGlobalStyles, fontFamily: "Inter, sans-serif", primaryColor: "#3b82f6" },
    sections: [
      navbarSection(),
      heroSection(
        "Perusahaan Terpercaya\nSejak 2019",
        "Kami adalah perusahaan yang berfokus pada inovasi dan kualitas. Dengan pengalaman bertahun-tahun, kami telah menjadi mitra terpercaya bagi banyak bisnis.",
        "Pelajari Lebih Lanjut"
      ),
      aboutSection(),
      featuresSection("Layanan Kami", "Solusi lengkap untuk kebutuhan bisnis Anda"),
      testimonialsSection(),
      contactSection(),
      ctaSection("Mari Bekerja Sama", "Hubungi Kami"),
      footerTemplate(),
    ],
  },
  {
    id: "portfolio-creative",
    title: "Portfolio Kreatif",
    slug: "portfolio-creative",
    description: "Template portfolio untuk desainer, fotografer, dan creative professional. Tampilkan karya terbaik Anda dengan gaya yang memukau.",
    category: "Kreatif",
    previewColor: "from-purple-500 to-pink-600",
    icon: "🎨",
    globalStyles: { ...defaultGlobalStyles, fontFamily: "Inter, sans-serif", primaryColor: "#8b5cf6" },
    sections: [
      navbarSection(),
      heroSection(
        "Kreativitas Tanpa\nBatas",
        "Portfolio kreatif yang menampilkan karya-karya terbaik. Setiap project adalah cerita, dan kami siap membantu Anda menceritakannya.",
        "Lihat Portfolio"
      ),
      {
        id: genId("sec"),
        columns: [
          {
            id: genId("col"),
            width: 4,
            elements: [
              createElement("image", { src: "https://placehold.co/400x400/8b5cf6/ffffff?text=Project+1", alt: "Project 1" }),
              createElement("heading", { text: "Project 1", level: "h3", align: "left" }),
              createElement("text", { text: "Desain branding untuk perusahaan teknologi" }),
            ],
          },
          {
            id: genId("col"),
            width: 4,
            elements: [
              createElement("image", { src: "https://placehold.co/400x400/ec4899/ffffff?text=Project+2", alt: "Project 2" }),
              createElement("heading", { text: "Project 2", level: "h3", align: "left" }),
              createElement("text", { text: "Website e-commerce dengan UI/UX modern" }),
            ],
          },
          {
            id: genId("col"),
            width: 4,
            elements: [
              createElement("image", { src: "https://placehold.co/400x400/3b82f6/ffffff?text=Project+3", alt: "Project 3" }),
              createElement("heading", { text: "Project 3", level: "h3", align: "left" }),
              createElement("text", { text: "Aplikasi mobile untuk startup" }),
            ],
          },
        ],
        styles: { padding: "60px 0", backgroundColor: "transparent", containerWidth: "boxed" },
      },
      testimonialsSection(),
      ctaSection("Mari Bekerja Sama", "Hubungi Saya"),
      footerTemplate(),
    ],
  },
  {
    id: "event-webinar",
    title: "Event & Webinar",
    slug: "event-webinar",
    description: "Template untuk mendaftarkan event, webinar, atau workshop. Dilengkapi dengan form pendaftaran dan informasi detail acara.",
    category: "Event",
    previewColor: "from-orange-500 to-red-600",
    icon: "📅",
    globalStyles: { ...defaultGlobalStyles, fontFamily: "Inter, sans-serif", primaryColor: "#f97316" },
    sections: [
      navbarSection(),
      heroSection(
        "Webinar: Masa Depan\nDigital Marketing 2026",
        "Bergabunglah dengan webinar eksklusif bersama para ahli industri. Pelajari strategi terbaru untuk mengembangkan bisnis Anda di era digital.",
        "Daftar Gratis"
      ),
      {
        id: genId("sec"),
        columns: [
          {
            id: genId("col"),
            width: 12,
            elements: [
              createElement("heading", { text: "Detail Acara", level: "h2", align: "center" }),
              createElement("stats", {
                items: [
                  { value: "20+", label: "Pembicara" },
                  { value: "3 Hari", label: "Durasi" },
                  { value: "500+", label: "Peserta" },
                  { value: "Online", label: "Lokasi" },
                ],
                columns: 4,
              }),
            ],
          },
        ],
        styles: { padding: "60px 0", backgroundColor: "#f8fafc", containerWidth: "boxed" },
      },
      featuresSection("Apa yang Akan Anda Pelajari", "Materi lengkap untuk mengembangkan skill digital Anda"),
      contactSection(),
      ctaSection("Daftar Sekarang — Gratis!", "Daftar Sekarang"),
      footerTemplate(),
    ],
  },
  {
    id: "coming-soon",
    title: "Coming Soon",
    slug: "coming-soon",
    description: "Template coming soon untuk membangun antisipasi sebelum peluncuran produk atau website baru Anda.",
    category: "Lainnya",
    previewColor: "from-cyan-500 to-blue-600",
    icon: "⏳",
    globalStyles: { ...defaultGlobalStyles, fontFamily: "Inter, sans-serif", primaryColor: "#06b6d4" },
    sections: [
      {
        id: genId("sec"),
        columns: [
          {
            id: genId("col"),
            width: 12,
            elements: [
              createElement("icon", { icon: "rocket", size: "80px", color: "#06b6d4" }),
              createElement("heading", {
                text: "Sesuatu yang Menarik\nSedang Dibangun",
                level: "h1",
                align: "center",
              }),
              createElement("text", {
                text: "Kami sedang menyiapkan sesuatu yang luar biasa untuk Anda. Nantikan peluncuran website baru kami yang akan merevolusi cara Anda berbisnis online.",
              }),
              createElement("heading", { text: "Segera Hadir", level: "h3", align: "center" }),
              createElement("spacer", { height: "20px" }),
              createElement("stats", {
                items: [
                  { value: "Launch", label: "Q2 2026" },
                  { value: "Early Bird", label: "Diskon 50%" },
                  { value: "Bonus", label: "Akses Premium" },
                ],
                columns: 3,
              }),
              createElement("spacer", { height: "20px" }),
              createElement("button", {
                text: "Beri Tahu Saya",
                variant: "primary",
                href: "/auth/register",
                target: "_self",
              }),
            ],
          },
        ],
        styles: { padding: "120px 0", backgroundColor: "transparent", containerWidth: "boxed" },
      },
      footerTemplate(),
    ],
  },
  {
    id: "dadet-property",
    title: "Dadet Property",
    slug: "dadet-property",
    description: "Template properti profesional untuk agen properti daerah Payakumbuh & Lima Puluh Kota. Modern, clean, dengan integrasi WhatsApp & 3D background.",
    category: "Bisnis",
    previewColor: "from-amber-500 to-yellow-600",
    icon: "🏠",
    globalStyles: {
      ...defaultGlobalStyles,
      fontFamily: "Inter, sans-serif",
      primaryColor: "#f59e0b",
      backgroundColor: "#0f172a",
      textColor: "#f8fafc",
    },
    sections: [
      // ─── Navbar ───
      {
        id: genId("sec"),
        columns: [
          {
            id: genId("col"),
            width: 12,
            elements: [
              createElement("navbar", {
                logo: "🏠 Dadet Property",
                links: [
                  { label: "Beranda", href: "#" },
                  { label: "Tentang", href: "#" },
                  { label: "Layanan", href: "#" },
                  { label: "Properti", href: "#" },
                  { label: "Kontak", href: "#" },
                ],
                ctaText: "Hubungi WA",
                ctaHref: "https://wa.me/6285219350091",
                sticky: true,
              }),
            ],
          },
        ],
        styles: { padding: "0", backgroundColor: "transparent", containerWidth: "boxed" },
      },

      // ─── Hero Section ───
      {
        id: genId("sec"),
        columns: [
          {
            id: genId("col"),
            width: 12,
            elements: [
              createElement("spacer", { height: "20px" }),
              createElement("icon", { icon: "star", size: "64px", color: "#f59e0b" }),
              createElement("heading", {
                text: "Temukan Properti Impian Anda\nBersama Dadet Property",
                level: "h1",
                align: "center",
              }),
              createElement("text", {
                text: "Mitra properti terpercaya di Payakumbuh dan Lima Puluh Kota. Kami membantu Anda menemukan rumah, tanah, dan properti komersial terbaik dengan harga kompetitif dan proses yang transparan.",
              }),
              createElement("three-background", {
                intensity: 0.6,
                color: "#f59e0b",
              }),
              createElement("spacer", { height: "20px" }),
              createElement("button", {
                text: "📞 Konsultasi Gratis",
                variant: "primary",
                href: "https://wa.me/6285219350091",
                target: "_blank",
              }),
              createElement("spacer", { height: "40px" }),
              createElement("stats", {
                items: [
                  { value: "100+", label: "Properti Terjual" },
                  { value: "200+", label: "Klien Puas" },
                  { value: "10+", label: "Tahun Pengalaman" },
                  { value: "2 Kota", label: "Area Layanan" },
                ],
                columns: 4,
              }),
            ],
          },
        ],
        styles: { padding: "100px 0 60px", backgroundColor: "#0f172a", containerWidth: "boxed" },
      },

      // ─── About Section ───
      {
        id: genId("sec"),
        columns: [
          {
            id: genId("col"),
            width: 6,
            elements: [
              createElement("image", {
                src: "https://placehold.co/600x500/f59e0b/1e293b?text=Dadet+Property",
                alt: "Dadet Property - Agen Properti",
              }),
            ],
          },
          {
            id: genId("col"),
            width: 6,
            elements: [
              createElement("heading", {
                text: "Tentang Dadet Property",
                level: "h2",
                align: "left",
              }),
              createElement("text", {
                text: "Dadet Property adalah agen properti profesional yang berdedikasi membantu Anda menemukan properti terbaik di Payakumbuh dan Lima Puluh Kota. Dengan pengalaman lebih dari 10 tahun, kami telah berhasil membantu ratusan klien mewujudkan impian mereka memiliki properti idaman.\n\nKami menawarkan layanan lengkap mulai dari jual beli rumah, tanah, properti komersial, hingga konsultasi properti gratis. Tim kami yang berpengalaman akan memandu Anda di setiap langkah proses, memastikan transaksi berjalan lancar, aman, dan transparan.",
              }),
              createElement("stats", {
                items: [
                  { value: "100%", label: "Transparan" },
                  { value: "24/7", label: "Support" },
                  { value: "Rp 0", label: "Biaya Konsultasi" },
                ],
                columns: 3,
              }),
            ],
          },
        ],
        styles: { padding: "80px 0", backgroundColor: "#0f172a", containerWidth: "boxed" },
      },

      // ─── Services Section ───
      {
        id: genId("sec"),
        columns: [
          {
            id: genId("col"),
            width: 12,
            elements: [
              createElement("features", {
                title: "Layanan Kami",
                subtitle: "Solusi lengkap untuk kebutuhan properti Anda",
                items: [
                  { icon: "star", title: "Jual Properti", desc: "Kami bantu jual properti Anda dengan harga terbaik dan pemasaran yang tepat sasaran" },
                  { icon: "heart", title: "Beli Properti", desc: "Temukan properti impian Anda dengan pilihan terlengkap di Payakumbuh & 50 Kota" },
                  { icon: "shield", title: "Sewa Properti", desc: "Rumah, ruko, atau apartemen untuk disewa dengan harga bersaing" },
                  { icon: "users", title: "Konsultasi", desc: "Konsultasi gratis dengan tim ahli properti kami tanpa biaya sepeserpun" },
                  { icon: "chart", title: "Appraisal", desc: "Penilaian properti akurat untuk mengetahui nilai pasar terkini" },
                  { icon: "globe", title: "Pengurusan Dokumen", desc: "Bantuan pengurusan sertifikat, AJB, dan dokumen legal lainnya" },
                ],
                columns: 3,
              }),
            ],
          },
        ],
        styles: { padding: "80px 0", backgroundColor: "#0f172a", containerWidth: "boxed" },
      },

      // ─── Featured Properties ───
      {
        id: genId("sec"),
        columns: [
          {
            id: genId("col"),
            width: 4,
            elements: [
              createElement("image", {
                src: "https://placehold.co/600x400/1e293b/f59e0b?text=Rumah+Modern+Payakumbuh",
                alt: "Rumah Modern Payakumbuh",
              }),
              createElement("heading", {
                text: "Rumah Modern 2 Lantai",
                level: "h3",
                align: "left",
              }),
              createElement("text", {
                text: "📍 Payakumbuh • LT 150m² • LB 200m²\n🏠 3 Kamar Tidur • 2 Kamar Mandi\n💰 Rp 450 Juta",
              }),
              createElement("button", {
                text: "📞 Tanya Detail",
                variant: "primary",
                href: "https://wa.me/6285219350091?text=Halo+Dadet+Property%2C+saya+tertarik+dengan+Rumah+Modern+2+Lantai+di+Payakumbuh",
                target: "_blank",
              }),
            ],
          },
          {
            id: genId("col"),
            width: 4,
            elements: [
              createElement("image", {
                src: "https://placehold.co/600x400/1e293b/f59e0b?text=Tanah+Kavling+50+Kota",
                alt: "Tanah Kavling 50 Kota",
              }),
              createElement("heading", {
                text: "Tanah Kavling Strategis",
                level: "h3",
                align: "left",
              }),
              createElement("text", {
                text: "📍 Lima Puluh Kota • LT 200m²\n🌳 Dekat jalan utama • SHM\n💰 Rp 250 Juta",
              }),
              createElement("button", {
                text: "📞 Tanya Detail",
                variant: "primary",
                href: "https://wa.me/6285219350091?text=Halo+Dadet+Property%2C+saya+tertarik+dengan+Tanah+Kavling+Strategis+di+Lima+Puluh+Kota",
                target: "_blank",
              }),
            ],
          },
          {
            id: genId("col"),
            width: 4,
            elements: [
              createElement("image", {
                src: "https://placehold.co/600x400/1e293b/f59e0b?text=Ruko+Bisnis+Payakumbuh",
                alt: "Ruko Bisnis Payakumbuh",
              }),
              createElement("heading", {
                text: "Ruko 2 Lantai",
                level: "h3",
                align: "left",
              }),
              createElement("text", {
                text: "📍 Pusat Kota Payakumbuh • LT 120m²\n🏪 Lokasi strategis • Cocok untuk bisnis\n💰 Rp 600 Juta",
              }),
              createElement("button", {
                text: "📞 Tanya Detail",
                variant: "primary",
                href: "https://wa.me/6285219350091?text=Halo+Dadet+Property%2C+saya+tertarik+dengan+Ruko+2+Lantai+di+Payakumbuh",
                target: "_blank",
              }),
            ],
          },
        ],
        styles: { padding: "80px 0", backgroundColor: "#0f172a", containerWidth: "boxed" },
      },

      // ─── Why Us + Stats ───
      {
        id: genId("sec"),
        columns: [
          {
            id: genId("col"),
            width: 12,
            elements: [
              createElement("heading", {
                text: "Mengapa Memilih Dadet Property?",
                level: "h2",
                align: "center",
              }),
              createElement("text", {
                text: "Kami berkomitmen memberikan pelayanan terbaik untuk setiap klien",
              }),
              createElement("spacer", { height: "20px" }),
              createElement("features", {
                title: "",
                subtitle: "",
                items: [
                  { icon: "shield", title: "Terpercaya & Aman", desc: "Setiap transaksi diproses dengan standar keamanan tinggi dan dokumen legal lengkap" },
                  { icon: "star", title: "Harga Terbaik", desc: "Kami negosiasikan harga terbaik untuk Anda, baik jual maupun beli properti" },
                  { icon: "users", title: "Tim Profesional", desc: "Didukung tim berpengalaman yang siap membantu Anda 24/7" },
                  { icon: "globe", title: "Area Luas", desc: "Melayani seluruh wilayah Payakumbuh dan Lima Puluh Kota dengan jangkauan maksimal" },
                  { icon: "heart", title: "100% Transparan", desc: "Tidak ada biaya tersembunyi. Semua informasi disampaikan dengan jujur dan terbuka" },
                  { icon: "chart", title: "Hasil Terbukti", desc: "Lebih dari 100 properti berhasil terjual dengan kepuasan klien di atas 95%" },
                ],
                columns: 3,
              }),
            ],
          },
        ],
        styles: { padding: "80px 0", backgroundColor: "#0f172a", containerWidth: "boxed" },
      },

      // ─── Location Section ───
      {
        id: genId("sec"),
        columns: [
          {
            id: genId("col"),
            width: 6,
            elements: [
              createElement("maps", {
                title: "Wilayah Layanan",
                address: "Payakumbuh & Lima Puluh Kota, Sumatera Barat",
                lat: "-0.2283",
                lng: "100.6333",
                zoom: 11,
              }),
            ],
          },
          {
            id: genId("col"),
            width: 6,
            elements: [
              createElement("heading", {
                text: "Area Layanan Kami",
                level: "h2",
                align: "left",
              }),
              createElement("text", {
                text: "Kami melayani seluruh wilayah:",
              }),
              createElement("features", {
                title: "",
                subtitle: "",
                items: [
                  { icon: "star", title: "Kota Payakumbuh", desc: "Pusat kota, Payakumbuh Barat, Payakumbuh Timur, Payakumbuh Utara, Payakumbuh Selatan" },
                  { icon: "star", title: "Kabupaten 50 Kota", desc: "Sarilamak, Guguak, Payakumbuh, Harau, Situjuh, dan seluruh kecamatan" },
                ],
                columns: 1,
              }),
              createElement("text", {
                text: "📍 Kantor: Payakumbuh, Sumatera Barat\n📞 Hubungi: +62 852-1935-0091",
              }),
            ],
          },
        ],
        styles: { padding: "80px 0", backgroundColor: "#0f172a", containerWidth: "boxed" },
      },

      // ─── Testimonials ───
      {
        id: genId("sec"),
        columns: [
          {
            id: genId("col"),
            width: 12,
            elements: [
              createElement("testimonial", {
                title: "Apa Kata Klien Kami",
                items: [
                  { name: "M. Irfan", role: "Pemilik Rumah, Payakumbuh", text: "Proses jual rumah saya sangat cepat! Dalam 2 minggu sudah ada pembeli serius. Dadet Property benar-benar profesional dan membantu sekali.", rating: 5, avatar: "MI" },
                  { name: "Rina Safitri", role: "Pembeli Rumah, 50 Kota", text: "Terima kasih Dadet Property! Saya akhirnya menemukan rumah impian dengan harga yang sesuai budget. Pelayanannya ramah dan jujur.", rating: 5, avatar: "RS" },
                  { name: "Bambang H.", role: "Investor Properti", text: "Sudah beberapa kali kerja sama dengan Dadet Property. Selalu puas dengan pelayanan dan hasilnya. Sangat direkomendasikan!", rating: 5, avatar: "BH" },
                ],
              }),
            ],
          },
        ],
        styles: { padding: "80px 0", backgroundColor: "#0f172a", containerWidth: "boxed" },
      },

      // ─── CTA Section ───
      {
        id: genId("sec"),
        columns: [
          {
            id: genId("col"),
            width: 12,
            elements: [
              createElement("cta", {
                title: "Siap Cari Properti Impian?",
                subtitle: "Hubungi kami sekarang untuk konsultasi GRATIS. Tim Dadet Property siap membantu Anda!\n🏠 Jual • Beli • Sewa • Konsultasi",
                buttonText: "📞 Konsultasi Gratis via WA",
                buttonHref: "https://wa.me/6285219350091",
              }),
            ],
          },
        ],
        styles: { padding: "80px 0", backgroundColor: "#f59e0b", containerWidth: "boxed" },
      },

      // ─── Contact Form ───
      {
        id: genId("sec"),
        columns: [
          {
            id: genId("col"),
            width: 12,
            elements: [
              createElement("contactForm", {
                title: "Hubungi Kami",
                subtitle: "Isi form di bawah dan tim Dadet Property akan segera menghubungi Anda",
                whatsappNumber: "6285219350091",
              }),
            ],
          },
        ],
        styles: { padding: "60px 0", backgroundColor: "#0f172a", containerWidth: "boxed" },
      },

      // ─── Footer ───
      {
        id: genId("sec"),
        columns: [
          {
            id: genId("col"),
            width: 12,
            elements: [
              createElement("footer", {
                logo: "🏠 Dadet Property",
                description: "Mitra properti terpercaya Anda di Payakumbuh dan Lima Puluh Kota.\nJual • Beli • Sewa • Konsultasi Properti",
                links: [
                  { label: "Beranda", href: "#" },
                  { label: "Tentang", href: "#" },
                  { label: "Layanan", href: "#" },
                  { label: "Properti", href: "#" },
                  { label: "Kontak", href: "#" },
                ],
                socials: [
                  { platform: "instagram", url: "https://www.instagram.com/" },
                  { platform: "facebook", url: "https://www.facebook.com/" },
                  { platform: "youtube", url: "https://www.youtube.com/" },
                ],
                copyright: `© ${new Date().getFullYear()} Dadet Property. All rights reserved.`,
              }),
            ],
          },
        ],
        styles: { padding: "60px 0 30px", backgroundColor: "#0f172a", containerWidth: "boxed" },
      },
    ],
  },
];

export function createPageFromTemplate(template: Template, title?: string): BuilderPage {
  // Deep clone sections to give new IDs
  const clonedSections = JSON.parse(JSON.stringify(template.sections));
  
  // Regenerate all IDs in the cloned sections
  function regenerateIds(obj: any) {
    if (!obj || typeof obj !== "object") return;
    if (Array.isArray(obj)) {
      obj.forEach(regenerateIds);
      return;
    }
    if (obj.id) {
      const prefix = obj.id.split("_")[0] || "el";
      obj.id = genId(prefix);
    }
    Object.values(obj).forEach(regenerateIds);
  }
  regenerateIds(clonedSections);

  const pageTitle = title || template.title;
  const slug = pageTitle.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  return {
    id: genId("page"),
    title: pageTitle,
    slug,
    sections: clonedSections,
    globalStyles: { ...template.globalStyles },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: false,
    publishedSnapshot: null,
  };
}
