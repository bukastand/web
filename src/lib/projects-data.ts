export interface ProjectData {
  slug: string;
  title: string;
  category: string;
  description: string;
  gradient: string;
  gradientFrom: string;
  gradientTo: string;
  longDescription: string;
  features: string[];
  techStack: string[];
  industry: string;
}

const defaultProjects: ProjectData[] = [
  {
    slug: "sma-nusantara",
    title: "SMA Nusantara",
    category: "Website Sekolah",
    description:
      "Website sekolah lengkap dengan sistem PPDB online, info akademik, dan galeri kegiatan.",
    gradient: "from-emerald-600 to-teal-700",
    gradientFrom: "emerald-600",
    gradientTo: "teal-700",
    longDescription:
      "Sebuah portal pendidikan modern yang dirancang untuk SMA Nusantara. Website ini menyediakan sistem Penerimaan Peserta Didik Baru (PPDB) secara online, informasi akademik terintegrasi, kalender akademik, galeri kegiatan sekolah, dan portal berita. Dibangun dengan fokus pada kemudahan penggunaan bagi siswa, orang tua, dan guru.",
    features: [
      "Sistem PPDB Online dengan verifikasi dokumen",
      "Portal Informasi Akademik & Nilai",
      "Galeri Kegiatan & Prestasi Sekolah",
      "Kalender Akademik Interaktif",
      "Berita & Pengumuman Sekolah",
      "Profil Guru & Staff",
    ],
    techStack: ["Next.js", "Tailwind CSS", "Supabase", "Three.js"],
    industry: "Pendidikan",
  },
  {
    slug: "greenhill-residence",
    title: "GreenHill Residence",
    category: "Website Property",
    description:
      "Landing page modern untuk perumahan dengan virtual tour 3D dan booking unit online.",
    gradient: "from-blue-600 to-cyan-700",
    gradientFrom: "blue-600",
    gradientTo: "cyan-700",
    longDescription:
      "Website properti premium untuk perumahan GreenHill Residence. Menampilkan virtual tour 3D interaktif yang memungkinkan calon pembeli menjelajahi lingkungan perumahan secara virtual. Dilengkapi dengan sistem booking unit online, galeri foto berkualitas tinggi, master plan interaktif, dan kalkulator KPR.",
    features: [
      "Virtual Tour 3D Interaktif",
      "Booking Unit Online Real-time",
      "Galeri Foto & Video 4K",
      "Master Plan Interaktif",
      "Kalkulator KPR Terintegrasi",
      "Notifikasi Unit Tersedia",
    ],
    techStack: ["Next.js", "Three.js", "PostgreSQL", "Tailwind CSS"],
    industry: "Properti",
  },
  {
    slug: "warungbahagia",
    title: "WarungBahagia",
    category: "Toko Online",
    description:
      "E-commerce dengan payment gateway, manajemen stok, dan dashboard admin lengkap.",
    gradient: "from-orange-600 to-amber-700",
    gradientFrom: "orange-600",
    gradientTo: "amber-700",
    longDescription:
      "Platform e-commerce modern untuk WarungBahagia yang menyediakan pengalaman belanja online yang mulus. Dilengkapi dengan integrasi payment gateway (GoPay, OVO, Transfer Bank), sistem manajemen stok real-time, dashboard admin lengkap untuk mengelola produk dan pesanan, serta sistem checkout yang cepat dan aman.",
    features: [
      "Payment Gateway Multi-Metode",
      "Manajemen Stok Real-time",
      "Dashboard Admin & Laporan",
      "Sistem Checkout Cepat",
      "Manajemen Produk & Kategori",
      "Notifikasi Pesanan Otomatis",
    ],
    techStack: ["Next.js", "Midtrans", "Supabase", "Redis"],
    industry: "E-commerce",
  },
  {
    slug: "klinik-sehati",
    title: "Klinik Sehati",
    category: "Klinik & RS",
    description:
      "Sistem reservasi online, jadwal dokter, dan rekam medis pasien terintegrasi.",
    gradient: "from-sky-600 to-indigo-700",
    gradientFrom: "sky-600",
    gradientTo: "indigo-700",
    longDescription:
      "Sistem informasi kesehatan terpadu untuk Klinik Sehati. Memungkinkan pasien melakukan reservasi online, melihat jadwal dokter secara real-time, mengakses rekam medis pribadi, dan mendapatkan pengingat janji temu otomatis via WhatsApp. Dilengkapi dengan dashboard untuk admin klinik mengelola jadwal dan data pasien.",
    features: [
      "Reservasi Online 24/7",
      "Jadwal Dokter Real-time",
      "Rekam Medis Digital Terintegrasi",
      "Pengingat Janji Temu WhatsApp",
      "Manajemen Antrian Pasien",
      "Dashboard Laporan Klinik",
    ],
    techStack: ["Next.js", "Supabase", "Twilio", "Chart.js"],
    industry: "Kesehatan",
  },
  {
    slug: "java-adventure",
    title: "Java Adventure",
    category: "Website Travel",
    description:
      "Portal travel dengan paket wisata, booking online, dan galeri destinasi interaktif.",
    gradient: "from-violet-600 to-purple-700",
    gradientFrom: "violet-600",
    gradientTo: "purple-700",
    longDescription:
      "Portal travel dan tour virtual yang menampilkan keindahan destinasi wisata Indonesia. Dilengkapi dengan sistem booking paket wisata online, galeri destinasi interaktif dengan foto 360°, itinerary builder, dan review dari wisatawan. Dirancang untuk memberikan pengalaman eksplorasi yang immersive sebelum memesan perjalanan.",
    features: [
      "Booking Paket Wisata Online",
      "Galeri Foto 360° Interaktif",
      "Itinerary Builder Custom",
      "Review & Rating Wisatawan",
      "Peta Destinasi Interaktif",
      "Kalkulator Biaya Perjalanan",
    ],
    techStack: ["Next.js", "Three.js", "Mapbox", "Supabase"],
    industry: "Travel & Wisata",
  },
  {
    slug: "hotel-grand-palace",
    title: "Hotel Grand Palace",
    category: "Website Hotel",
    description:
      "Website hotel dengan fitur reservasi kamar, menu restoran, dan virtual tour.",
    gradient: "from-rose-600 to-pink-700",
    gradientFrom: "rose-600",
    gradientTo: "pink-700",
    longDescription:
      "Website hotel bintang lima untuk Hotel Grand Palace yang elegan dan modern. Menampilkan sistem reservasi kamar online dengan ketersediaan real-time, galeri virtual tour kamar dan fasilitas hotel, menu restoran digital lengkap dengan foto, serta sistem manajemen acara dan meeting room.",
    features: [
      "Reservasi Kamar Online Real-time",
      "Virtual Tour Kamar & Fasilitas",
      "Menu Restoran Digital Interaktif",
      "Manajemen Meeting Room & Event",
      "Layanan Room Service Online",
      "Loyalty Program Terintegrasi",
    ],
    techStack: ["Next.js", "Three.js", "Stripe", "Supabase"],
    industry: "Perhotelan",
  },
  {
    slug: "beritakota",
    title: "BeritaKota",
    category: "Portal Berita",
    description:
      "Portal berita modern dengan sistem kategori, tag, dan artikel multimedia.",
    gradient: "from-slate-600 to-gray-700",
    gradientFrom: "slate-600",
    gradientTo: "gray-700",
    longDescription:
      "Portal berita digital modern yang menyajikan berita terkini dengan tampilan yang bersih dan profesional. Dilengkapi dengan sistem kategori dan tag yang terorganisir, artikel multimedia (video, galeri foto, infografis), mode baca yang nyaman, dan sistem komentar terintegrasi. Dibangun untuk kecepatan loading tinggi dan SEO optimal.",
    features: [
      "Sistem Kategori & Tag Cerdas",
      "Artikel Multimedia (Video & Foto)",
      "Mode Baca Nyaman (Reader Mode)",
      "Sistem Komentar Terintegrasi",
      "Berita Breaking News Real-time",
      "SEO Optimasi & AMP Support",
    ],
    techStack: ["Next.js", "Tailwind CSS", "Supabase", "Algolia"],
    industry: "Media & Berita",
  },
  {
    slug: "techbiz-solutions",
    title: "TechBiz Solutions",
    category: "Company Profile",
    description:
      "Company profile interaktif dengan portfolio digital, tim, dan fitur inquiry.",
    gradient: "from-green-700 to-emerald-800",
    gradientFrom: "green-700",
    gradientTo: "emerald-800",
    longDescription:
      "Website company profile profesional untuk TechBiz Solutions, sebuah perusahaan konsultan teknologi. Menampilkan portfolio project interaktif, profil tim dengan animasi kustom, studi kasus yang mendetail, blog teknologi, dan sistem inquiry yang terintegrasi dengan CRM. Desain modern dengan pengalaman pengguna yang premium.",
    features: [
      "Portfolio Project Interaktif",
      "Profil Tim dengan Animasi",
      "Studi Kasus & Whitepaper",
      "Blog Teknologi Terintegrasi",
      "Sistem Inquiry & CRM",
      "Testimoni Klien Interaktif",
    ],
    techStack: ["Next.js", "Three.js", "Supabase", "Framer Motion"],
    industry: "Teknologi & Konsultan",
  },
];

export function getProjectBySlug(slug: string): ProjectData | undefined {
  // First try exact slug match
  const exact = defaultProjects.find((p) => p.slug === slug);
  if (exact) return exact;

  // Fallback: try matching by slugified title (handles data from Supabase)
  return defaultProjects.find((p) => slugify(p.title) === slug);
}

export function getAllProjects(): ProjectData[] {
  return defaultProjects;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
