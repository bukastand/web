export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
}

export interface AboutContent {
  story: string;
  mission: string;
  vision: string;
  values: string[];
  teamMembers: TeamMember[];
}

export interface ServicesContent {
  items: ServiceItem[];
  process: { title: string; desc: string }[];
}

export interface ContactContent {
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapLat: string;
  mapLng: string;
}

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
  aboutSection: AboutContent;
  servicesSection: ServicesContent;
  contactSection: ContactContent;
}

const defaultProjects: ProjectData[] = [
  {
    slug: "sma-nusantara",
    title: "SMA Nusantara",
    category: "Website Sekolah",
    description: "Website sekolah lengkap dengan sistem PPDB online, info akademik, dan galeri kegiatan.",
    gradient: "from-emerald-600 to-teal-700",
    gradientFrom: "emerald-600",
    gradientTo: "teal-700",
    longDescription: "Sebuah portal pendidikan modern yang dirancang untuk SMA Nusantara. Website ini menyediakan sistem Penerimaan Peserta Didik Baru (PPDB) secara online, informasi akademik terintegrasi, kalender akademik, galeri kegiatan sekolah, dan portal berita. Dibangun dengan fokus pada kemudahan penggunaan bagi siswa, orang tua, dan guru.",
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
    aboutSection: {
      story: "SMA Nusantara berdiri sejak 1985 dengan visi menjadi lembaga pendidikan unggulan yang mencetak generasi berprestasi. Website ini dikembangkan untuk mendigitalisasi seluruh proses administrasi sekolah, memudahkan akses informasi bagi siswa, orang tua, dan masyarakat umum.",
      mission: "Menyediakan platform pendidikan digital yang memudahkan akses informasi akademik, mempercepat proses administrasi, dan meningkatkan transparansi antara sekolah, siswa, dan orang tua.",
      vision: "Menjadi portal pendidikan digital terdepan yang mendukung transformasi digital di lingkungan sekolah menengah atas di Indonesia.",
      values: ["Inovasi Digital", "Transparansi Informasi", "Kemudahan Akses", "Pelayanan Cepat", "Keamanan Data"],
      teamMembers: [
        { name: "Drs. H. Ahmad Syahri", role: "Kepala Sekolah", avatar: "AS", bio: "Memimpin transformasi digital SMA Nusantara sejak 2018." },
        { name: "Siti Nurhaliza, S.Pd.", role: "Wakil Kepala Kurikulum", avatar: "SN", bio: "Bertanggung jawab atas pengembangan kurikulum digital." },
        { name: "Rudi Hartono, S.Kom.", role: "Admin IT Sekolah", avatar: "RH", bio: "Ahli teknologi informasi yang mengelola infrastruktur digital." },
      ],
    },
    servicesSection: {
      items: [
        { title: "PPDB Online", description: "Sistem pendaftaran siswa baru secara online dengan verifikasi dokumen digital dan notifikasi otomatis.", icon: "📋" },
        { title: "Informasi Akademik", description: "Portal nilai, jadwal pelajaran, dan rapor digital yang bisa diakses siswa dan orang tua kapan saja.", icon: "📊" },
        { title: "Galeri Sekolah", description: "Dokumentasi kegiatan dan prestasi sekolah dalam galeri foto dan video interaktif.", icon: "🖼️" },
        { title: "Kalender Akademik", description: "Kalender akademik interaktif dengan pengingat otomatis untuk ujian, libur, dan event sekolah.", icon: "📅" },
        { title: "Portal Berita", description: "Berita dan pengumuman sekolah terkini yang dapat diakses oleh seluruh warga sekolah.", icon: "📰" },
        { title: "Profil Guru", description: "Database profil guru lengkap dengan bidang keahlian dan jadwal konsultasi.", icon: "👨‍🏫" },
      ],
      process: [
        { title: "Analisis Kebutuhan", desc: "Diskusi mendalam dengan pihak sekolah untuk memahami kebutuhan." },
        { title: "Desain & Mockup", desc: "Pembuatan desain portal yang user-friendly dan modern." },
        { title: "Pengembangan", desc: "Coding dan integrasi fitur-fitur yang dibutuhkan." },
        { title: "Training & Launch", desc: "Pelatihan penggunaan untuk staff dan go live." },
      ],
    },
    contactSection: {
      address: "Jl. Pendidikan No. 123, Jakarta Selatan 12345",
      phone: "+62 21 1234 5678",
      email: "info@smanusantara.sch.id",
      hours: "Senin - Jumat, 07:00 - 16:00 WIB",
      mapLat: "-6.2088",
      mapLng: "106.8456",
    },
  },
  {
    slug: "greenhill-residence",
    title: "GreenHill Residence",
    category: "Website Property",
    description: "Landing page modern untuk perumahan dengan virtual tour 3D dan booking unit online.",
    gradient: "from-blue-600 to-cyan-700",
    gradientFrom: "blue-600",
    gradientTo: "cyan-700",
    longDescription: "Website properti premium untuk perumahan GreenHill Residence. Menampilkan virtual tour 3D interaktif yang memungkinkan calon pembeli menjelajahi lingkungan perumahan secara virtual. Dilengkapi dengan sistem booking unit online, galeri foto berkualitas tinggi, master plan interaktif, dan kalkulator KPR.",
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
    aboutSection: {
      story: "GreenHill Residence adalah pengembangan perumahan modern yang mengusung konsep hunian hijau di kawasan strategis Jakarta Selatan. Diluncurkan pada 2022, proyek ini telah menarik minat banyak pembeli dengan desain arsitektur kontemporer dan fasilitas lengkap.",
      mission: "Menyediakan hunian nyaman dengan lingkungan hijau yang asri dan akses mudah ke pusat kota.",
      vision: "Menjadi kawasan hunian terdepan yang mengintegrasikan teknologi smart home dengan konsep ramah lingkungan.",
      values: ["Kualitas Premium", "Lingkungan Hijau", "Inovasi Teknologi", "Kepuasan Pelanggan", "Transparansi"],
      teamMembers: [
        { name: "Bambang Wijaya", role: "Direktur Utama", avatar: "BW", bio: "Pengembang properti berpengalaman dengan 20+ tahun di industri." },
        { name: "Dian Permata", role: "Marketing Manager", avatar: "DP", bio: "Ahli strategi pemasaran properti digital." },
        { name: "Fajar Nugroho", role: "Arsitek Utama", avatar: "FN", bio: "Arsitek lulusan ITB dengan spesialisasi desain hunian modern." },
      ],
    },
    servicesSection: {
      items: [
        { title: "Virtual Tour 3D", description: "Jelajahi lingkungan perumahan secara virtual dengan teknologi 3D interaktif dari mana saja.", icon: "🏗️" },
        { title: "Booking Unit Online", description: "Pesan unit impian Anda secara online dengan sistem booking real-time dan konfirmasi instan.", icon: "📱" },
        { title: "Kalkulator KPR", description: "Hitung simulasi KPR dengan suku bunga terkini dan dapatkan estimasi cicilan bulanan.", icon: "🧮" },
        { title: "Konsultasi Online", description: "Konsultasi dengan tim marketing via chat atau video call untuk informasi lebih detail.", icon: "💬" },
        { title: "Tur Lapangan", description: "Jadwalkan kunjungan langsung ke lokasi dengan pemandu profesional.", icon: "🚗" },
        { title: "Dokumen Digital", description: "Akses dan unduh brosur, master plan, dan dokumen penting lainnya secara digital.", icon: "📄" },
      ],
      process: [
        { title: "Registrasi", desc: "Daftar akun untuk mulai menjelajahi unit yang tersedia." },
        { title: "Eksplorasi", desc: "Gunakan virtual tour untuk melihat unit dan lingkungan." },
        { title: "Booking", desc: "Pesan unit pilihan Anda dengan DP ringan." },
        { title: "Akad & Serah Terima", desc: "Proses akad jual beli dan serah terima kunci." },
      ],
    },
    contactSection: {
      address: "Kavling GreenHill, Jl. Raya Bogor KM 25, Jakarta Timur 13750",
      phone: "+62 21 8765 4321",
      email: "info@greenhillresidence.com",
      hours: "Senin - Minggu, 08:00 - 18:00 WIB",
      mapLat: "-6.3088",
      mapLng: "106.8956",
    },
  },
  {
    slug: "warungbahagia",
    title: "WarungBahagia",
    category: "Toko Online",
    description: "E-commerce dengan payment gateway, manajemen stok, dan dashboard admin lengkap.",
    gradient: "from-orange-600 to-amber-700",
    gradientFrom: "orange-600",
    gradientTo: "amber-700",
    longDescription: "Platform e-commerce modern untuk WarungBahagia yang menyediakan pengalaman belanja online yang mulus. Dilengkapi dengan integrasi payment gateway (GoPay, OVO, Transfer Bank), sistem manajemen stok real-time, dashboard admin lengkap untuk mengelola produk dan pesanan, serta sistem checkout yang cepat dan aman.",
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
    aboutSection: {
      story: "WarungBahagia memulai perjalanannya sebagai toko kelontong tradisional pada 2010. Melihat potensi digitalisasi, pemiliknya mentransformasi bisnis menjadi platform e-commerce modern pada 2023, melayani ribuan pelanggan dengan konsep belanja online yang mudah dan cepat.",
      mission: "Memudahkan masyarakat mendapatkan kebutuhan sehari-hari dengan harga terjangkau dan pengiriman cepat.",
      vision: "Menjadi platform e-commerce lokal terdepan yang menghubungkan UMKM dengan konsumen di seluruh Indonesia.",
      values: ["Harga Terjangkau", "Pelayanan Cepat", "Kualitas Terjamin", "Kemitraan UMKM", "Inovasi Digital"],
      teamMembers: [
        { name: "Hasan Basri", role: "Founder & CEO", avatar: "HB", bio: "Pengusaha muda yang memulai dari toko kelontong hingga e-commerce." },
        { name: "Maya Sari", role: "Head of Operations", avatar: "MS", bio: "Ahli logistik dan operasional e-commerce." },
        { name: "Dimas Prayoga", role: "Lead Developer", avatar: "DP", bio: "Full-stack developer yang membangun platform dari nol." },
      ],
    },
    servicesSection: {
      items: [
        { title: "Belanja Online", description: "Ribuan produk kebutuhan sehari-hari tersedia dengan harga kompetitif dan pengiriman cepat.", icon: "🛒" },
        { title: "Multi Payment", description: "Bayar dengan GoPay, OVO, DANA, Transfer Bank, atau COD sesuai preferensi Anda.", icon: "💳" },
        { title: "Pengiriman Cepat", description: "Layanan pengiriman same-day untuk area Jabodetabek dan next-day untuk kota lainnya.", icon: "🚚" },
        { title: "Program Loyalitas", description: "Dapatkan poin reward setiap belanja dan tukarkan dengan voucher diskon menarik.", icon: "⭐" },
        { title: "Mitra UMKM", description: "Program kemitraan untuk UMKM lokal agar bisa menjual produk mereka secara online.", icon: "🤝" },
        { title: "Layanan 24/7", description: "Customer service siap membantu Anda kapan saja melalui chat atau telepon.", icon: "🎧" },
      ],
      process: [
        { title: "Pilih Produk", desc: "Jelajahi ribuan produk dan tambahkan ke keranjang." },
        { title: "Checkout", desc: "Pilih metode pembayaran dan alamat pengiriman." },
        { title: "Pembayaran", desc: "Bayar dengan metode favorit Anda." },
        { title: "Diterima", desc: "Terima pesanan dan nikmati belanja Anda!" },
      ],
    },
    contactSection: {
      address: "Jl. Merdeka No. 45, Bandung 40123",
      phone: "+62 22 1234 5678",
      email: "halo@warungbahagia.com",
      hours: "Customer Service: 24 Jam / 7 Hari",
      mapLat: "-6.9175",
      mapLng: "107.6191",
    },
  },
  {
    slug: "klinik-sehati",
    title: "Klinik Sehati",
    category: "Klinik & RS",
    description: "Sistem reservasi online, jadwal dokter, dan rekam medis pasien terintegrasi.",
    gradient: "from-sky-600 to-indigo-700",
    gradientFrom: "sky-600",
    gradientTo: "indigo-700",
    longDescription: "Sistem informasi kesehatan terpadu untuk Klinik Sehati. Memungkinkan pasien melakukan reservasi online, melihat jadwal dokter secara real-time, mengakses rekam medis pribadi, dan mendapatkan pengingat janji temu otomatis via WhatsApp. Dilengkapi dengan dashboard untuk admin klinik mengelola jadwal dan data pasien.",
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
    aboutSection: {
      story: "Klinik Sehati didirikan pada 2015 oleh sekelompok dokter muda yang ingin memberikan pelayanan kesehatan berkualitas dengan sentuhan personal. Berawal dari klinik kecil, kini Klinik Sehati telah berkembang dengan 5 cabang dan melayani ribuan pasien setiap bulannya.",
      mission: "Memberikan pelayanan kesehatan yang mudah diakses, terjangkau, dan berkualitas tinggi dengan memanfaatkan teknologi digital.",
      vision: "Menjadi penyedia layanan kesehatan primer terdepan di Indonesia yang mengintegrasikan teknologi dan pelayanan humanis.",
      values: ["Kemanusiaan", "Profesionalisme", "Inovasi", "Empati", "Integritas"],
      teamMembers: [
        { name: "dr. Andika Pratama", role: "Direktur Medis", avatar: "AP", bio: "Dokter umum dengan spesialisasi manajemen kesehatan." },
        { name: "dr. Rina Wijaya", role: "Kepala Pelayanan", avatar: "RW", bio: "Dokter spesialis yang fokus pada kualitas pelayanan pasien." },
        { name: "Ahmad Fauzi, S.Kom.", role: "IT Manager", avatar: "AF", bio: "Ahli sistem informasi kesehatan dan keamanan data." },
      ],
    },
    servicesSection: {
      items: [
        { title: "Reservasi Online", description: "Buat janji dengan dokter favorit Anda kapan saja, di mana saja secara online.", icon: "📅" },
        { title: "Telemedicine", description: "Konsultasi dengan dokter via video call tanpa perlu datang ke klinik.", icon: "📹" },
        { title: "Rekam Medis Digital", description: "Akses riwayat kesehatan pribadi Anda secara online dan aman.", icon: "📋" },
        { title: "Apotek Online", description: "Pesan obat resep dan dapatkan pengiriman langsung ke rumah.", icon: "💊" },
        { title: "Cek Kesehatan", description: "Paket medical check-up lengkap dengan hasil digital dan konsultasi dokter.", icon: "🩺" },
        { title: "Asuransi Terintegrasi", description: "Klaim asuransi langsung dari sistem tanpa perlu dokumen fisik.", icon: "🛡️" },
      ],
      process: [
        { title: "Registrasi", desc: "Daftar akun dan lengkapi data diri." },
        { title: "Jadwalkan", desc: "Pilih dokter dan jadwal yang tersedia." },
        { title: "Konsultasi", desc: "Datang ke klinik atau video call dengan dokter." },
        { title: "Tindak Lanjut", desc: "Terima resep dan jadwal kontrol berikutnya." },
      ],
    },
    contactSection: {
      address: "Jl. Kesehatan No. 88, Yogyakarta 55123",
      phone: "+62 274 1234 567",
      email: "info@kliniksehati.id",
      hours: "Senin - Sabtu, 07:00 - 21:00 WIB | Minggu, 08:00 - 15:00 WIB",
      mapLat: "-7.7956",
      mapLng: "110.3695",
    },
  },
  {
    slug: "java-adventure",
    title: "Java Adventure",
    category: "Website Travel",
    description: "Portal travel dengan paket wisata, booking online, dan galeri destinasi interaktif.",
    gradient: "from-violet-600 to-purple-700",
    gradientFrom: "violet-600",
    gradientTo: "purple-700",
    longDescription: "Portal travel dan tour virtual yang menampilkan keindahan destinasi wisata Indonesia. Dilengkapi dengan sistem booking paket wisata online, galeri destinasi interaktif dengan foto 360°, itinerary builder, dan review dari wisatawan. Dirancang untuk memberikan pengalaman eksplorasi yang immersive sebelum memesan perjalanan.",
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
    aboutSection: {
      story: "Java Adventure lahir dari kecintaan terhadap keindahan alam dan budaya Indonesia. Didirikan pada 2018 oleh sekelompok traveler berpengalaman, platform ini telah membantu ribuan wisatawan merencanakan petualangan tak terlupakan di berbagai destinasi eksotis Nusantara.",
      mission: "Memperkenalkan keindahan wisata Indonesia kepada dunia melalui platform digital yang interaktif dan informatif.",
      vision: "Menjadi platform travel terdepan yang menghubungkan wisatawan dengan pengalaman autentik di seluruh Indonesia.",
      values: ["Petualangan", "Keberlanjutan", "Budaya Lokal", "Pelayanan Prima", "Keamanan"],
      teamMembers: [
        { name: "Arya Wirawan", role: "Founder & CEO", avatar: "AW", bio: "Traveler dan petualang yang telah menjelajahi 50+ destinasi di Indonesia." },
        { name: "Dewi Lestari", role: "Head of Operations", avatar: "DL", bio: "Ahli manajemen perjalanan dan logistik tur." },
        { name: "Raka Putra", role: "Creative Director", avatar: "RP", bio: "Fotografer dan videografer profesional spesialis travel." },
      ],
    },
    servicesSection: {
      items: [
        { title: "Paket Wisata", description: "Berbagai paket wisata lengkap dengan akomodasi, transportasi, dan pemandu lokal.", icon: "🏕️" },
        { title: "Virtual Tour", description: "Jelajahi destinasi secara virtual dengan foto 360° dan video immersive.", icon: "🌐" },
        { title: "Itinerary Builder", description: "Buat rencana perjalanan custom sesuai keinginan dan budget Anda.", icon: "🗺️" },
        { title: "Pemandu Lokal", description: "Pemandu wisata berpengalaman yang mengenal destinasi dengan baik.", icon: "🧭" },
        { title: "Fotografi Paket", description: "Abadikan momen petualangan Anda dengan jasa fotografer profesional.", icon: "📸" },
        { title: "Asuransi Perjalanan", description: "Lindungi perjalanan Anda dengan asuransi komprehensif.", icon: "🛡️" },
      ],
      process: [
        { title: "Pilih Destinasi", desc: "Jelajahi destinasi dan pilih yang paling menarik." },
        { title: "Custom Itinerary", desc: "Sesuaikan rencana perjalanan dengan preferensi." },
        { title: "Booking", desc: "Pesan paket dan lakukan pembayaran online." },
        { title: "Berpetualang", desc: "Nikmati petualangan tak terlupakan!" },
      ],
    },
    contactSection: {
      address: "Jl. Parangtritis No. 78, Yogyakarta 55111",
      phone: "+62 274 5678 901",
      email: "hello@javaadventure.com",
      hours: "Senin - Sabtu, 09:00 - 20:00 WIB",
      mapLat: "-7.7956",
      mapLng: "110.3695",
    },
  },
  {
    slug: "hotel-grand-palace",
    title: "Hotel Grand Palace",
    category: "Website Hotel",
    description: "Website hotel dengan fitur reservasi kamar, menu restoran, dan virtual tour.",
    gradient: "from-rose-600 to-pink-700",
    gradientFrom: "rose-600",
    gradientTo: "pink-700",
    longDescription: "Website hotel bintang lima untuk Hotel Grand Palace yang elegan dan modern. Menampilkan sistem reservasi kamar online dengan ketersediaan real-time, galeri virtual tour kamar dan fasilitas hotel, menu restoran digital lengkap dengan foto, serta sistem manajemen acara dan meeting room.",
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
    aboutSection: {
      story: "Hotel Grand Palace telah menjadi ikon perhotelan mewah di Jakarta sejak didirikan pada 1998. Dengan arsitektur megah bergaya kolonial dan sentuhan modern, hotel ini telah menyambut tamu-tamu terhormat dari seluruh dunia dan menjadi pilihan utama untuk acara-acara bergengsi.",
      mission: "Memberikan pengalaman menginap yang tak terlupakan dengan pelayanan kelas dunia dan fasilitas premium.",
      vision: "Menjadi hotel bintang lima terdepan di Asia Tenggara yang dikenal akan keanggunan dan pelayanannya yang sempurna.",
      values: ["Keanggunan", "Pelayanan Prima", "Keaslian", "Inovasi", "Keberlanjutan"],
      teamMembers: [
        { name: "James Tanuwijaya", role: "General Manager", avatar: "JT", bio: "Hotelier berpengalaman dengan 25 tahun di industri perhotelan internasional." },
        { name: "Sari Dewi", role: "Director of Sales", avatar: "SD", bio: "Ahli penjualan dan pemasaran perhotelan." },
        { name: "Chef Renata", role: "Executive Chef", avatar: "CR", bio: "Chef internasional dengan pengalaman di restoran Michelin star." },
      ],
    },
    servicesSection: {
      items: [
        { title: "Reservasi Kamar", description: "Pesan kamar mewah dengan pemandangan kota yang menakjubkan dan fasilitas premium.", icon: "🛏️" },
        { title: "Fine Dining", description: "Nikmati pengalaman kuliner kelas dunia di restoran kami dengan chef internasional.", icon: "🍽️" },
        { title: "Meeting & Event", description: "Ruang pertemuan dan ballroom megah untuk acara korporat dan pernikahan.", icon: "🎪" },
        { title: "Spa & Wellness", description: "Pusat kebugaran dan spa mewah untuk relaksasi optimal.", icon: "💆" },
        { title: "Concierge 24/7", description: "Layanan concierge siap membantu kebutuhan Anda kapan saja.", icon: "🛎️" },
        { title: "Airport Transfer", description: "Layanan antar jemput bandara dengan mobil mewah.", icon: "🚗" },
      ],
      process: [
        { title: "Pilih Kamar", desc: "Lihat ketersediaan dan pilih kamar favorit Anda." },
        { title: "Pesan", desc: "Booking dengan sistem pembayaran aman." },
        { title: "Check-in", desc: "Check-in cepat tanpa antre." },
        { title: "Nikmati", desc: "Rasakan pengalaman menginap yang mewah!" },
      ],
    },
    contactSection: {
      address: "Jl. MH Thamrin No. 1, Jakarta Pusat 10310",
      phone: "+62 21 8888 8888",
      email: "reservations@grandpalacehotel.com",
      hours: "Reservasi: 24 Jam | Check-in: 14:00 | Check-out: 12:00",
      mapLat: "-6.1951",
      mapLng: "106.8219",
    },
  },
  {
    slug: "beritakota",
    title: "BeritaKota",
    category: "Portal Berita",
    description: "Portal berita modern dengan sistem kategori, tag, dan artikel multimedia.",
    gradient: "from-slate-600 to-gray-700",
    gradientFrom: "slate-600",
    gradientTo: "gray-700",
    longDescription: "Portal berita digital modern yang menyajikan berita terkini dengan tampilan yang bersih dan profesional. Dilengkapi dengan sistem kategori dan tag yang terorganisir, artikel multimedia (video, galeri foto, infografis), mode baca yang nyaman, dan sistem komentar terintegrasi. Dibangun untuk kecepatan loading tinggi dan SEO optimal.",
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
    aboutSection: {
      story: "BeritaKota didirikan pada 2020 oleh sekelompok jurnalis muda yang ingin menyajikan berita berkualitas dengan perspektif independen. Dalam waktu singkat, BeritaKota telah menjadi salah satu portal berita terpercaya dengan jutaan pembaca setiap bulannya.",
      mission: "Menyajikan berita akurat, berimbang, dan mendalam yang memberdayakan masyarakat dengan informasi berkualitas.",
      vision: "Menjadi standar baru jurnalisme digital di Indonesia yang mengedepankan integritas dan kualitas.",
      values: ["Independensi", "Akurasi", "Integritas", "Inovasi", "Keberagaman"],
      teamMembers: [
        { name: "Rina Maharani", role: "Pemimpin Redaksi", avatar: "RM", bio: "Jurnalis senior dengan pengalaman 15 tahun di media nasional." },
        { name: "Agus Wibowo", role: "Managing Editor", avatar: "AW", bio: "Editor berpengalaman yang memastikan kualitas setiap artikel." },
        { name: "Citra Ayu", role: "Head of Digital", avatar: "CA", bio: "Ahli strategi konten digital dan SEO." },
      ],
    },
    servicesSection: {
      items: [
        { title: "Berita Terkini", description: "Update berita terbaru secara real-time dari berbagai kategori dan daerah.", icon: "📡" },
        { title: "Artikel Mendalam", description: "Feature dan investigasi mendalam tentang isu-isu penting.", icon: "📝" },
        { title: "Video & Multimedia", description: "Konten video berkualitas tinggi dan infografis interaktif.", icon: "🎥" },
        { title: "Opini & Analisis", description: "Kolom opini dan analisis dari para ahli dan tokoh masyarakat.", icon: "💭" },
        { title: "IKlan & Promosi", description: "Solusi periklanan digital untuk menjangkau audiens yang tepat.", icon: "📢" },
        { title: "Langganan Premium", description: "Akses artikel eksklusif dan fitur premium tanpa iklan.", icon: "👑" },
      ],
      process: [
        { title: "Rapat Redaksi", desc: "Penentuan topik dan angle berita." },
        { title: "Peliputan", desc: "Jurnalis meliput berita di lapangan." },
        { title: "Editorial", desc: "Proses editing dan verifikasi fakta." },
        { title: "Publikasi", desc: "Artikel tayang dan didistribusikan." },
      ],
    },
    contactSection: {
      address: "Jl. Pers No. 10, Jakarta Pusat 10210",
      phone: "+62 21 5678 1234",
      email: "redaksi@beritakota.id",
      hours: "Redaksi: 24 Jam | Iklan: Senin - Jumat, 09:00 - 17:00 WIB",
      mapLat: "-6.1951",
      mapLng: "106.8229",
    },
  },
  {
    slug: "techbiz-solutions",
    title: "TechBiz Solutions",
    category: "Company Profile",
    description: "Company profile interaktif dengan portfolio digital, tim, dan fitur inquiry.",
    gradient: "from-green-700 to-emerald-800",
    gradientFrom: "green-700",
    gradientTo: "emerald-800",
    longDescription: "Website company profile profesional untuk TechBiz Solutions, sebuah perusahaan konsultan teknologi. Menampilkan portfolio project interaktif, profil tim dengan animasi kustom, studi kasus yang mendetail, blog teknologi, dan sistem inquiry yang terintegrasi dengan CRM. Desain modern dengan pengalaman pengguna yang premium.",
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
    aboutSection: {
      story: "TechBiz Solutions didirikan pada 2020 oleh tiga sekawan yang memiliki visi sama: membantu bisnis bertransformasi secara digital. Berawal dari garasi kecil, kini TechBiz telah dipercaya oleh 50+ perusahaan dari berbagai industri untuk mengembangkan solusi teknologi mereka.",
      mission: "Memberdayakan bisnis dengan solusi teknologi inovatif yang mendorong pertumbuhan dan efisiensi.",
      vision: "Menjadi konsultan teknologi terdepan di Asia Tenggara yang dikenal akan kualitas dan inovasinya.",
      values: ["Inovasi", "Kualitas", "Kolaborasi", "Integritas", "Dampak"],
      teamMembers: [
        { name: "Alex Hartono", role: "CEO & Co-Founder", avatar: "AH", bio: "Visioner teknologi dengan background software engineering." },
        { name: "Bella Susanti", role: "CTO & Co-Founder", avatar: "BS", bio: "Ahli arsitektur sistem dan pengembangan produk." },
        { name: "Charlie Wirawan", role: "COO & Co-Founder", avatar: "CW", bio: "Manajer operasional dengan pengalaman di startup." },
      ],
    },
    servicesSection: {
      items: [
        { title: "Web Development", description: "Pengembangan website kustom dengan teknologi modern dan performa tinggi.", icon: "💻" },
        { title: "Mobile Apps", description: "Aplikasi mobile native dan cross-platform untuk iOS dan Android.", icon: "📱" },
        { title: "Cloud Solution", description: "Solusi cloud computing, migration, dan infrastruktur digital.", icon: "☁️" },
        { title: "UI/UX Design", description: "Desain antarmuka yang intuitif dan pengalaman pengguna yang memukau.", icon: "🎨" },
        { title: "Digital Consulting", description: "Konsultasi strategi digital untuk transformasi bisnis.", icon: "📊" },
        { title: "AI & Automation", description: "Integrasi kecerdasan buatan dan otomatisasi proses bisnis.", icon: "🤖" },
      ],
      process: [
        { title: "Discovery", desc: "Memahami kebutuhan dan tujuan bisnis klien." },
        { title: "Strategy", desc: "Menyusun strategi dan arsitektur solusi." },
        { title: "Execution", desc: "Pengembangan dengan metodologi agile." },
        { title: "Scale", desc: "Deploy, monitor, dan optimasi berkelanjutan." },
      ],
    },
    contactSection: {
      address: "Jl. Tech Valley No. 42, BSD City, Tangerang 15321",
      phone: "+62 21 9999 8888",
      email: "hello@techbizsolutions.com",
      hours: "Senin - Jumat, 09:00 - 18:00 WIB",
      mapLat: "-6.3025",
      mapLng: "106.6525",
    },
  },
];

export function getProjectBySlug(slug: string): ProjectData | undefined {
  const exact = defaultProjects.find((p) => p.slug === slug);
  if (exact) return exact;
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
