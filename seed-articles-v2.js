// Seed v2: Update 10 existing articles with images + insert 10 new SEO articles
// Run with: node seed-articles-v2.js

const { Client } = require("pg");

const DB_CONFIG = {
  host: "db.ejyqtuzlcdnuuzgqfweo.supabase.co",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "yvGlqS5jaFGKGBwT",
  ssl: { rejectUnauthorized: false },
};

// Stable picsum.photos seeds for consistent images per category
function getCoverImage(seed, w = 1200, h = 675) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

// ────────────────────────────────────────────
// 10 EXISTING ARTICLES — UPDATE WITH IMAGES
// ────────────────────────────────────────────
const existingArticles = [
  { slugLike: "cara-membuat-website-umkm-2025-0", imageSeed: "website-umkm" },
  { slugLike: "10-alasan-mengapa-website-sekolah-penting-di-era-digital-1", imageSeed: "website-sekolah" },
  { slugLike: "tips-memilih-jasa-pembuatan-website-yang-tepat-2", imageSeed: "jasa-website" },
  { slugLike: "digital-marketing-untuk-pemula-panduan-lengkap-2025-3", imageSeed: "digital-marketing" },
  { slugLike: "seo-dasar-cara-membuat-website-anda-muncul-di-google-4", imageSeed: "seo-optimasi" },
  { slugLike: "perbedaan-website-statis-vs-dinamis-mana-yang-cocok-untuk-bisnis-anda-5", imageSeed: "website-development" },
  { slugLike: "panduan-lengkap-membangun-brand-melalui-website-6", imageSeed: "branding" },
  { slugLike: "cara-memilih-domain-dan-hosting-yang-tepat-untuk-website-7", imageSeed: "hosting-domain" },
  { slugLike: "website-vs-social-media-mana-yang-lebih-penting-untuk-bisnis-8", imageSeed: "website-bisnis" },
  { slugLike: "tren-desain-website-2025-apa-yang-harus-anda-ketahui-9", imageSeed: "web-design-trend" },
];

// ────────────────────────────────────────────
// 10 NEW SEO ARTICLES (high-volume keywords)
// ────────────────────────────────────────────
const newArticles = [
  // 1. Keyword: "Jasa pembuatan website murah"
  {
    title: "Jasa Pembuatan Website Murah: Dapatkan Website Berkualitas Tanpa Dompet Jebol",
    slug: "jasa-pembuatan-website-murah-berkualitas",
    excerpt: "Cari jasa pembuatan website murah tapi berkualitas? Simak panduan lengkap harga, fitur, dan tips memilih penyedia jasa website termurah di Indonesia.",
    coverSeed: "jasa-website-murah",
    content: "<p>Banyak pelaku UMKM dan bisnis kecil mencari <strong>jasa pembuatan website murah</strong> untuk memulai kehadiran online mereka. Namun, penting untuk diingat bahwa murah bukan berarti murahan. Ada banyak penyedia jasa yang menawarkan harga terjangkau dengan kualitas yang tetap profesional.</p><p>Artikel ini akan membahas kisaran harga, apa yang perlu diperhatikan, dan bagaimana mendapatkan website berkualitas dengan budget minimal.</p><h2>Berapa Kisaran Harga Pembuatan Website Murah?</h2><p>Untuk website sederhana seperti landing page atau company profile, harga biasanya mulai dari Rp1-3 juta. Untuk website toko online atau website yang lebih kompleks, budget mulai dari Rp3-7 juta sudah cukup untuk mendapatkan hasil yang profesional.</p><h2>Apa yang Perlu Diperhatikan?</h2><p>Pastikan paket yang Anda pilih sudah termasuk domain, hosting, desain responsif, dan basic SEO. Jangan tergiur harga Rp200-500 ribu yang biasanya hanya website template tanpa domain dan hosting sendiri.</p><h2>Tips Mendapatkan Website Murah Berkualitas</h2><p>1. Bandingkan minimal 3 penyedia jasa. 2. Cek portofolio dan testimoni. 3. Tanyakan apakah desain bisa dikustomisasi. 4. Pastikan ada garansi revisi. 5. Jangan lupa tanya tentang biaya maintenance bulanan.</p><p>PAGODA STUDIO menawarkan paket website mulai dari Rp1,2 juta dengan kualitas terbaik. Konsultasi gratis, hubungi kami sekarang!</p>"
  },
  // 2. Keyword: "Biaya buat website toko online"
  {
    title: "Biaya Buat Website Toko Online: Rincian Lengkap untuk UMKM 2025",
    slug: "biaya-buat-website-toko-online-umkm",
    excerpt: "Simak rincian lengkap biaya buat website toko online untuk UMKM di tahun 2025, mulai dari domain, hosting, desain, hingga fitur e-commerce yang wajib ada.",
    coverSeed: "toko-online",
    content: "<p>Membuat <strong>website toko online</strong> adalah langkah strategis untuk mengembangkan bisnis di era digital. Namun, banyak pelaku UMKM yang masih bingung dengan rincian biaya yang diperlukan. Artikel ini akan mengupas tuntas biaya pembuatan toko online dari awal hingga siap digunakan.</p><h2>Rincian Biaya Website Toko Online</h2><p>1. Domain (.com atau .id): Rp150-300 ribu/tahun. 2. Hosting: Rp500 ribu - 2 juta/tahun tergantung kapasitas. 3. Desain & Development: Rp3-15 juta (sekali bayar). 4. SSL Certificate: Rp0-500 ribu. 5. Payment Gateway: Rp0 untuk setup. 6. Maintenance: Rp200-500 ribu/bulan.</p><h2>Fitur Wajib Toko Online</h2><p>Produk katalog dengan filter, keranjang belanja, checkout multi-payment, tracking order, dashboard admin, manajemen stok, dan integrasi kurir. Pastikan semua fitur ini ada di paket yang Anda pilih.</p><h2>Tips Menghemat Biaya</h2><p>Mulai dengan paket dasar dan upgrade bertahap seiring pertumbuhan bisnis. Pilih platform yang mudah dikembangkan. Manfaatkan paket bundle domain+hosting untuk hemat biaya.</p><p>PAGODA STUDIO menyediakan paket toko online lengkap mulai Rp5 juta dengan fitur payment gateway, manajemen stok, dan dashboard admin.</p>"
  },
  // 3. Keyword: "Website untuk UMKM"
  {
    title: "Website untuk UMKM: Kunci Sukses Go Digital di Tahun 2025",
    slug: "website-untuk-umkm-go-digital",
    excerpt: "Website untuk UMKM bukan lagi pilihan, tapi keharusan. Pelajari bagaimana website bisa membantu UMKM naik kelas dan menjangkau lebih banyak pelanggan.",
    coverSeed: "umkm-digital",
    content: "<p><strong>Website untuk UMKM</strong> telah menjadi kebutuhan mendesak di era digital. Dengan jutaan UMKM di Indonesia, hanya sebagian kecil yang sudah memiliki website profesional. Inilah kesempatan emas untuk bisnis Anda tampil beda dari kompetitor.</p><h2>Mengapa UMKM Butuh Website?</h2><p>1. Kredibilitas: 80% konsumen mencari bisnis secara online sebelum membeli. 2. Jangkauan: Website bisa diakses 24/7 dari mana saja. 3. Marketing: Website adalah pusat semua aktivitas digital marketing. 4. Efisiensi: Otomatisasi pemesanan dan customer service.</p><h2>Fitur Penting Website UMKM</h2><p>Company profile, produk/layanan, kontak & WhatsApp integration, Google Maps, testimoni, galeri, blog/artikel, dan basic SEO. Semua ini bisa didapatkan dengan budget mulai Rp2-3 juta.</p><h2>Website UMKM vs Social Media</h2><p>Social media bagus untuk promosi, tapi website adalah aset digital yang Anda miliki sepenuhnya. Tidak terikat algoritma yang berubah-ubah. Kombinasikan keduanya untuk hasil maksimal.</p><p>PAGODA STUDIO siap membantu UMKM Indonesia go digital dengan website profesional harga terjangkau. Konsultasi gratis!</p>"
  },
  // 4. Keyword: "Jasa optimasi SEO website"
  {
    title: "Jasa Optimasi SEO Website: Cara Ampuh Muncul di Halaman 1 Google",
    slug: "jasa-optimasi-seo-website",
    excerpt: "Butuh jasa optimasi SEO website untuk bisnis Anda? Pelajari strategi SEO terbaru 2025 yang bikin website Anda muncul di halaman pertama Google.",
    coverSeed: "seo-optimasi-2",
    content: "<p><strong>Jasa optimasi SEO website</strong> adalah investasi yang sangat menguntungkan untuk bisnis Anda. Bayangkan, setiap hari ribuan orang mencari produk atau jasa yang Anda tawarkan di Google. Dengan SEO yang tepat, mereka akan menemukan website Anda, bukan kompetitor.</p><h2>Apa Itu SEO dan Mengapa Penting?</h2><p>SEO adalah proses mengoptimalkan website agar mendapat peringkat tinggi di hasil pencarian Google secara organik. 70% pengguna Google hanya mengklik hasil di halaman pertama. Jika website Anda di halaman 2 atau 3, hampir tidak ada yang melihatnya.</p><h2>Layanan SEO yang Kami Tawarkan</h2><p>1. Riset keyword kompetitif. 2. Optimasi on-page (title, meta, heading, konten). 3. Technical SEO (kecepatan, mobile friendly, struktur data). 4. Off-page SEO (backlink berkualitas). 5. Reporting & monitoring bulanan.</p><h2>Berapa Lama Hasil SEO Terlihat?</h2><p>SEO bukan instan. Hasil biasanya mulai terlihat dalam 1-3 bulan untuk keyword dengan kompetisi rendah, dan 3-6 bulan untuk keyword kompetitif. Tapi hasilnya bertahan lama dan terus memberikan traffic organik gratis.</p><p>Setiap website dari PAGODA STUDIO sudah dioptimasi SEO dasar. Untuk optimasi lanjutan, kami menyediakan paket SEO khusus. Hubungi kami untuk konsultasi gratis!</p>"
  },
  // 5. Keyword: "Cara membuat website sendiri"
  {
    title: "Cara Membuat Website Sendiri untuk Pemula Tanpa Coding",
    slug: "cara-membuat-website-sendiri-pemula",
    excerpt: "Panduan lengkap cara membuat website sendiri untuk pemula tanpa perlu bisa coding. Gunakan platform drag-and-drop atau website builder termudah.",
    coverSeed: "membuat-website-sendiri",
    content: "<p>Ingin belajar <strong>cara membuat website sendiri</strong> tapi tidak bisa coding? Tenang, di tahun 2025 ada banyak platform yang memungkinkan siapa saja membuat website profesional tanpa menulis satu baris kode pun. Artikel ini akan memandu Anda langkah demi langkah.</p><h2>Opsi 1: Website Builder (Termudah)</h2><p>Platform seperti Wix, Squarespace, atau WordPress.com menyediakan drag-and-drop builder. Tinggal pilih template, kustomisasi dengan klik, dan publikasikan. Cocok untuk website sederhana seperti portofolio atau landing page.</p><h2>Opsi 2: CMS WordPress</h2><p>WordPress adalah platform paling populer di dunia. Dengan ribuan tema dan plugin gratis, Anda bisa membuat website apa pun tanpa coding. Perlu belajar sedikit tapi hasilnya lebih profesional dan fleksibel.</p><h2>Opsi 3: Jasa Pembuatan Website</h2><p>Jika ingin hasil maksimal tanpa ribet, gunakan jasa profesional. Biaya mulai Rp1-2 juta untuk website sederhana. Hasilnya lebih customized, performa lebih baik, dan Anda tidak perlu pusing urusan teknis.</p><h2>Yang Harus Disiapkan</h2><p>Nama domain, hosting, konten (teks dan gambar), dan gambaran desain yang diinginkan. Dengan panduan ini, Anda siap membuat website sendiri atau memesan jasa pembuatan website profesional.</p>"
  },
  // 6. Keyword: "Jasa landing page profesional"
  {
    title: "Jasa Landing Page Profesional: Tingkatkan Konversi Bisnis Anda",
    slug: "jasa-landing-page-profesional",
    excerpt: "Landing page profesional adalah kunci meningkatkan konversi penjualan. Simak tips dan harga jasa landing page yang efektif untuk bisnis Anda di 2025.",
    coverSeed: "landing-page",
    content: "<p><strong>Jasa landing page profesional</strong> semakin dicari oleh pebisnis yang ingin meningkatkan konversi online mereka. Landing page adalah halaman khusus yang dirancang untuk satu tujuan spesifik, seperti mendaftar webinar, membeli produk, atau menghubungi sales.</p><h2>Kenapa Landing Page Lebih Efektif?</h2><p>Landing page fokus pada satu Call-to-Action (CTA), tanpa distraksi navigasi atau menu. Hasilnya, tingkat konversi landing page bisa mencapai 10-30%, jauh lebih tinggi dibanding website biasa yang rata-rata 2-5%.</p><h2>Elemen Landing Page yang Efektif</h2><p>1. Headline yang menarik perhatian. 2. Subheadline yang menjelaskan value. 3. Visual yang relevan (gambar/video). 4. Social proof (testimoni, jumlah pelanggan). 5. Manfaat, bukan fitur. 6. CTA yang jelas dan menonjol. 7. Form yang pendek.</p><h2>Harga Jasa Landing Page</h2><p>Landing page sederhana mulai dari Rp1-2 juta. Untuk landing page dengan copywriting profesional, desain custom, dan A/B testing, budget sekitar Rp3-5 juta. Investasi ini akan kembali berkali-kali lipat dari peningkatan konversi.</p><p>PAGODA STUDIO menyediakan jasa landing page profesional dengan desain konversi tinggi. Konsultasi gratis!</p>"
  },
  // 7. Keyword: "Jasa maintenance website"
  {
    title: "Jasa Maintenance Website: Kenapa Website Perlu Perawatan Rutin?",
    slug: "jasa-maintenance-website-penting",
    excerpt: "Website perlu perawatan rutin agar tetap aman, cepat, dan up-to-date. Simak pentingnya jasa maintenance website dan apa saja yang perlu dirawat.",
    coverSeed: "maintenance-website",
    content: "<p>Setelah website selesai dibuat, banyak pemilik bisnis yang menganggap pekerjaan selesai. Padahal, <strong>jasa maintenance website</strong> sama pentingnya dengan pembuatan website itu sendiri. Website yang tidak dirawat bisa mengalami berbagai masalah serius.</p><h2>Mengapa Maintenance Website Penting?</h2><p>1. Keamanan: Mencegah peretasan dan malware. 2. Performa: Menjaga kecepatan loading tetap optimal. 3. Konten: Memastikan informasi selalu up-to-date. 4. Backup: Melindungi data jika terjadi masalah. 5. Kompatibilitas: Menyesuaikan dengan update browser dan teknologi.</p><h2>Apa Saja yang Dilakukan dalam Maintenance?</h2><p>Update CMS/plugin, backup database dan file, monitoring uptime, cek keamanan, optimasi database, update konten, dan report bulanan. Frekuensi maintenance bisa mingguan atau bulanan tergantung kebutuhan.</p><h2>Biaya Maintenance Website</h2><p>Paket maintenance bulanan biasanya berkisar Rp200-500 ribu/bulan untuk website sederhana, dan Rp500 ribu - 1,5 juta/bulan untuk website yang lebih kompleks seperti toko online atau aplikasi web.</p><p>PAGODA STUDIO menyediakan paket maintenance website dengan harga terjangkau. Website Anda akan terpantau 24/7 dan selalu dalam kondisi terbaik.</p>"
  },
  // 8. Keyword: "Website company profile profesional"
  {
    title: "Website Company Profile Profesional: Template Desain Terbaik 2025",
    slug: "website-company-profile-profesional",
    excerpt: "Website company profile profesional adalah wajah digital perusahaan Anda. Lihat contoh desain terbaik dan dapatkan tips membuat company profile yang impresif.",
    coverSeed: "company-profile",
    content: "<p><strong>Website company profile profesional</strong> adalah etalase digital perusahaan Anda. Ini adalah tempat pertama yang dikunjungi calon klien, mitra bisnis, atau investor untuk mengenal perusahaan Anda. Kesan pertama yang baik sangat penting!</p><h2>Apa Saja Halaman yang Wajib Ada?</h2><p>1. Beranda: Overview perusahaan dan value proposition. 2. Tentang Kami: Sejarah, visi-misi, tim. 3. Layanan: Detail produk/jasa yang ditawarkan. 4. Portofolio: Hasil kerja atau project sebelumnya. 5. Testimoni: Bukti kepuasan klien. 6. Kontak: Alamat, telepon, email, Google Maps.</p><h2>Desain Modern Company Profile 2025</h2><p>Gunakan palet warna yang konsisten dengan brand, tipografi yang jelas, foto tim profesional, animasi halus, dan navigasi yang intuitif. Pastikan website responsif di semua perangkat.</p><h2>Investasi Website Company Profile</h2><p>Harga pembuatan website company profile profesional mulai dari Rp2-5 juta untuk 5-10 halaman, tergantung kompleksitas desain dan fitur yang dibutuhkan.</p><p>PAGODA STUDIO siap membantu Anda membuat company profile digital yang memukau. Konsultasi gratis!</p>"
  },
  // 9. Keyword: "Jasa pembuatan aplikasi web"
  {
    title: "Jasa Pembuatan Aplikasi Web Custom: Solusi Digital untuk Bisnis Anda",
    slug: "jasa-pembuatan-aplikasi-web-custom",
    excerpt: "Butuh jasa pembuatan aplikasi web custom untuk bisnis? Pelajari jenis, fitur, dan biaya pembuatan aplikasi web yang sesuai dengan kebutuhan perusahaan Anda.",
    coverSeed: "aplikasi-web",
    content: "<p><strong>Jasa pembuatan aplikasi web custom</strong> menjadi solusi bagi perusahaan yang membutuhkan sistem digital khusus yang tidak bisa dipenuhi oleh software generik. Mulai dari sistem inventory, CRM, ERP, hingga dashboard monitoring.</p><h2>Jenis Aplikasi Web yang Bisa Dibuat</h2><p>1. Sistem Manajemen Inventory. 2. Customer Relationship Management (CRM). 3. Sistem Informasi Akademik. 4. Aplikasi Pemesanan/Booking. 5. Dashboard Monitoring & Analytics. 6. Sistem Pendaftaran Online. 7. Aplikasi Internal Perusahaan.</p><h2>Fitur Keamanan Aplikasi Web</h2><p>Setiap aplikasi web yang kami bangun dilengkapi dengan autentikasi user, enkripsi data, proteksi SQL injection, validasi input, dan backup database rutin untuk keamanan maksimal.</p><h2>Biaya Pembuatan Aplikasi Web</h2><p>Biaya pembuatan aplikasi web custom bervariasi tergantung kompleksitas, mulai dari Rp10 juta untuk aplikasi sederhana hingga Rp50 juta+ untuk sistem yang kompleks. Konsultasikan kebutuhan Anda untuk mendapatkan quote yang tepat.</p><p>PAGODA STUDIO siap membangun aplikasi web custom sesuai kebutuhan bisnis Anda. Hubungi kami untuk diskusi!</p>"
  },
  // 10. Keyword: "Tips memilih jasa website"
  {
    title: "Tips Memilih Jasa Website Profesional: Panduan Anti Tertipu",
    slug: "tips-memilih-jasa-website-anti-tertipu",
    excerpt: "Banyak jasa website abal-abal. Simak tips memilih jasa website profesional yang terpercaya agar website Anda berkualitas dan tidak mengecewakan.",
    coverSeed: "memilih-jasa-website",
    content: "<p>Persaingan bisnis online semakin ketat, dan <strong>tips memilih jasa website</strong> yang tepat menjadi pengetahuan wajib bagi pebisnis. Sayangnya, masih banyak jasa website abal-abal yang membuat website asal jadi dan tidak berfungsi optimal.</p><h2>Tanda Jasa Website Profesional</h2><p>1. Memiliki portofolio yang jelas dan beragam. 2. Testimoni klien asli (bisa dicek). 3. Proses kerja transparan dengan timeline jelas. 4. Desain original, bukan template instan. 5. Memberikan panduan konten dan strategi. 6. Ada garansi revisi dan layanan after-sales.</p><h2>Red Flag yang Harus Dihindari</h2><p>Harga terlalu murah (Rp200-500 ribu), tidak punya portofolio, meminta DP 100%, tidak mau diskusi detail, menggunakan template tanpa kustomisasi, dan tidak memberikan akses penuh ke website setelah jadi.</p><h2>Cek Sebelum Memesan</h2><p>Minta contoh website yang sudah dibuat, cek kecepatan loading-nya, lihat apakah responsif di mobile, dan tanyakan tentang SEO. Jasa profesional akan dengan senang hati menjawab semua pertanyaan Anda.</p><p>PAGODA STUDIO adalah jasa pembuatan website profesional yang terpercaya dengan portofolio 50+ project. Konsultasi gratis!</p>"
  },
];

async function main() {
  console.log("=".repeat(60));
  console.log("  SEED V2: UPDATE IMAGES + 10 NEW SEO ARTICLES");
  console.log("=".repeat(60));

  const client = new Client(DB_CONFIG);

  try {
    await client.connect();
    console.log("\n✅ Terhubung ke database\n");

    // ── STEP 1: Update existing articles with images ──
    console.log("[1/3] Mengupdate 10 artikel existing dengan gambar...");
    let updated = 0;
    for (const art of existingArticles) {
      const coverUrl = getCoverImage(art.imageSeed);
      try {
        const res = await client.query(
          "UPDATE articles SET cover_image = $1 WHERE slug LIKE $2 RETURNING title",
          [coverUrl, `%${art.slugLike}%`]
        );
        if (res.rows.length > 0) {
          console.log(`  ✅ ${res.rows[0].title}`);
          updated++;
        }
      } catch (err) {
        console.log(`  ❌ ${art.slugLike}: ${err.message}`);
      }
    }
    console.log(`  → ${updated} artikel diupdate dengan gambar\n`);

    // ── STEP 2: Insert 10 new SEO articles ──
    console.log("[2/3] Menyisipkan 10 artikel baru SEO-friendly...");
    let inserted = 0;
    for (let i = 0; i < newArticles.length; i++) {
      const art = newArticles[i];
      const slug = art.slug + "-" + (i + 10);
      const coverUrl = getCoverImage(art.coverSeed);

      try {
        await client.query(
          `INSERT INTO articles (title, slug, excerpt, content, cover_image, author, published, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
          [art.title, slug, art.excerpt, art.content, coverUrl, "Tim PAGODA STUDIO", true]
        );
        console.log(`  [${i + 1}/10] ✅ ${art.title.substring(0, 50)}...`);
        inserted++;
      } catch (err) {
        console.log(`  [${i + 1}/10] ❌ ${err.message}`);
      }
    }
    console.log(`  → ${inserted} artikel baru berhasil ditambahkan\n`);

    // ── Summary ──
    console.log("=".repeat(60));
    console.log("  ✅ SELESAI!");
    console.log(`  ${updated} artikel existing + gambar`);
    console.log(`  ${inserted} artikel baru SEO-friendly`);
    console.log("=".repeat(60));

    // Show all articles
    const all = await client.query(
      "SELECT title, slug, cover_image IS NOT NULL as has_image FROM articles ORDER BY created_at DESC"
    );
    console.log("\n📊 Semua artikel di database:");
    all.rows.forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.has_image ? "🖼" : "❌"} ${r.title.substring(0, 60)}`);
    });
    console.log(`\n  Total: ${all.rows.length} artikel`);

  } catch (err) {
    console.error("\n❌ ERROR:", err.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log("\n🔌 Koneksi database ditutup.\n");
  }
}

main();
