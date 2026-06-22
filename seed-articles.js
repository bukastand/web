// Seed 10 articles into Supabase using direct PostgreSQL connection
// Run with: node seed-articles.js

const { Client } = require("pg");

const DB_CONFIG = {
  host: "db.ejyqtuzlcdnuuzgqfweo.supabase.co",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "yvGlqS5jaFGKGBwT",
  ssl: { rejectUnauthorized: false },
};

const articles = [
  {
    title: "Cara Membuat Website Profesional untuk UMKM di Tahun 2025",
    excerpt: "Panduan lengkap cara membuat website profesional untuk UMKM dengan biaya terjangkau. Mulai dari persiapan, domain, hosting, hingga konten yang menarik pelanggan.",
    content: "<p>Di era digital saat ini, memiliki website bukan lagi sebuah pilihan, melainkan kebutuhan bagi setiap bisnis termasuk UMKM. Website profesional dapat menjadi etalase digital yang bekerja 24 jam sehari, 7 hari seminggu untuk memperkenalkan produk atau jasa Anda kepada calon pelanggan.</p><p>Tahun 2025 membawa tantangan dan peluang baru bagi pelaku UMKM. Dengan semakin mudahnya akses internet dan meningkatnya perilaku belanja online, memiliki website yang menarik dan fungsional menjadi investasi yang sangat berharga.</p><p>Artikel ini akan membahas langkah demi langkah cara membuat website profesional untuk UMKM Anda, mulai dari persiapan awal hingga meluncurkannya ke publik.</p><h2>Mengapa UMKM Butuh Website?</h2><p>Website memberikan kredibilitas dan kepercayaan kepada calon pelanggan. Tanpa website, calon pelanggan mungkin akan menemukan kompetitor Anda di Google.</p><h2>Langkah Pertama: Tentukan Tujuan Website</h2><p>Sebelum membuat website, tentukan terlebih dahulu tujuannya. Apakah untuk menjual produk, memperkenalkan jasa, atau sebagai portofolio?</p><h2>Pilih Platform yang Tepat</h2><p>Untuk hasil yang profesional dan scalable, menggunakan jasa pengembangan website khusus adalah investasi yang lebih baik daripada platform instan.</p><h2>Optimasi untuk Mobile</h2><p>Lebih dari 70% pengguna internet mengakses website melalui smartphone. Pastikan website Anda responsif di semua perangkat.</p><p>Jika membutuhkan bantuan profesional, tim PAGODA STUDIO siap membantu mewujudkan website impian Anda.</p>"
  },
  {
    title: "10 Alasan Mengapa Website Sekolah Penting di Era Digital",
    excerpt: "Website sekolah bukan hanya tentang informasi, tapi juga tentang membangun citra dan memudahkan komunikasi dengan orang tua siswa serta masyarakat.",
    content: "<p>Di tengah transformasi digital dunia pendidikan, website sekolah telah menjadi kebutuhan pokok bagi institusi pendidikan. Mulai dari TK hingga universitas, keberadaan website yang profesional memberikan banyak manfaat.</p><p>Calon siswa dan orang tua mereka mencari informasi tentang sekolah Anda. Website yang informatif akan memberikan kesan pertama yang positif dan profesional.</p><h2>1. Sumber Informasi Terpusat</h2><p>Website sekolah menjadi pusat informasi bagi siswa, orang tua, guru, dan masyarakat. Informasi seperti kalender akademik dan pengumuman dapat diakses kapan saja.</p><h2>2. PPDB Online yang Efisien</h2><p>Penerimaan Peserta Didik Baru secara online memudahkan proses pendaftaran, seleksi, dan pengumuman tanpa harus datang ke sekolah.</p><h2>3. Media Publikasi Prestasi</h2><p>Prestasi siswa dan sekolah dapat dipublikasikan secara luas, menjadi nilai tambah dalam membangun reputasi sekolah.</p><p>PAGODA STUDIO telah membantu banyak sekolah di Indonesia membangun website yang modern dan informatif.</p>"
  },
  {
    title: "Tips Memilih Jasa Pembuatan Website yang Tepat",
    excerpt: "Tidak semua jasa pembuatan website sama. Simak tips memilih penyedia jasa yang tepat agar website Anda berkualitas dan sesuai kebutuhan.",
    content: "<p>Memilih jasa pembuatan website yang tepat adalah keputusan penting yang akan berdampak pada kesuksesan online bisnis Anda. Dengan banyaknya pilihan di pasaran, bagaimana cara memilih yang terbaik?</p><h2>1. Cek Portofolio</h2><p>Lihat hasil kerja sebelumnya. Apakah desainnya menarik? Apakah websitenya responsif? Portofolio berkualitas menunjukkan kemampuan penyedia jasa.</p><h2>2. Baca Testimoni Klien</h2><p>Apa kata klien sebelumnya? Testimoni nyata bisa memberikan gambaran tentang kualitas layanan dan hasil kerja.</p><h2>3. Pastikan Ada Layanan After-Sales</h2><p>Website perlu perawatan dan update. Pastikan penyedia jasa menawarkan layanan maintenance atau support.</p><h2>4. Bandingkan Harga dengan Fitur</h2><p>Harga murah belum tentu hemat jika fiturnya minim. Cari yang memberikan value terbaik untuk anggaran Anda.</p><p>PAGODA STUDIO menawarkan jasa pembuatan website berkualitas tinggi dengan harga transparan.</p>"
  },
  {
    title: "Digital Marketing untuk Pemula: Panduan Lengkap 2025",
    excerpt: "Pelajari dasar-dasar digital marketing untuk mengembangkan bisnis Anda secara online. Cocok untuk pemula yang ingin memulai strategi pemasaran digital.",
    content: "<p>Digital marketing telah menjadi keterampilan paling penting dalam dunia bisnis modern. Dengan strategi yang tepat, bisnis kecil pun bisa bersaing dengan perusahaan besar.</p><h2>Apa Itu Digital Marketing?</h2><p>Digital marketing adalah segala upaya pemasaran yang menggunakan media digital atau internet, mulai dari website, media sosial, email, hingga mesin pencari.</p><h2>1. SEO (Search Engine Optimization)</h2><p>SEO adalah proses mengoptimalkan website agar muncul di halaman pertama Google tanpa biaya iklan.</p><h2>2. Social Media Marketing</h2><p>Media sosial seperti Instagram, Facebook, dan TikTok adalah platform powerful untuk membangun brand.</p><h2>3. Content Marketing</h2><p>Konten berkualitas adalah magnet yang menarik pengunjung ke website Anda. Blog, video, dan infografis adalah bentuk content marketing efektif.</p><p>PAGODA STUDIO siap membantu Anda membangun website yang mendukung strategi digital marketing Anda.</p>"
  },
  {
    title: "SEO Dasar: Cara Membuat Website Anda Muncul di Google",
    excerpt: "Pelajari teknik SEO dasar yang bisa Anda terapkan sendiri untuk meningkatkan peringkat website di mesin pencari Google secara organik.",
    content: "<p>Memiliki website yang bagus tidak ada artinya jika tidak ada yang melihatnya. SEO berperan penting untuk membantu website Anda ditemukan melalui Google.</p><h2>Apa Itu SEO?</h2><p>SEO adalah teknik mengoptimalkan website agar mendapat peringkat lebih tinggi di halaman hasil pencarian secara organik.</p><h2>1. Riset Kata Kunci</h2><p>Cari tahu kata kunci apa yang digunakan calon pelanggan untuk mencari produk atau jasa Anda menggunakan Google Keyword Planner.</p><h2>2. Optimasi On-Page</h2><p>Pastikan setiap halaman memiliki title tag, meta description, heading, dan URL yang mengandung kata kunci target.</p><h2>3. Kecepatan Loading</h2><p>Google memprioritaskan website yang cepat. Kompres gambar dan pilih hosting yang baik untuk meningkatkan kecepatan.</p><h2>4. Mobile Friendly</h2><p>Website harus tampil sempurna di perangkat mobile. Google menggunakan mobile-first indexing.</p><p>Setiap website dari PAGODA STUDIO sudah dioptimasi dengan teknik SEO dasar.</p>"
  },
  {
    title: "Perbedaan Website Statis vs Dinamis: Mana yang Cocok untuk Bisnis Anda?",
    excerpt: "Kenali perbedaan website statis dan dinamis beserta kelebihan dan kekurangannya agar Anda bisa memilih jenis website yang tepat.",
    content: "<p>Saat akan membuat website, salah satu keputusan pertama adalah memilih antara website statis atau dinamis. Keduanya memiliki karakteristik dan kelebihan masing-masing.</p><h2>Apa Itu Website Statis?</h2><p>Website statis memiliki konten tetap yang tidak berubah kecuali diubah manual. Setiap halaman adalah file HTML terpisah. Kelebihannya: loading cepat, lebih aman, biaya hosting murah.</p><h2>Apa Itu Website Dinamis?</h2><p>Website dinamis menggunakan database untuk menyimpan konten. Konten dapat diubah melalui admin panel. Cocok untuk website berita, e-commerce, dan portal.</p><h2>Mana yang Cocok?</h2><p>Untuk bisnis kecil dengan informasi dasar, website statis sudah cukup. Namun untuk bisnis yang ingin berkembang dengan fitur blog atau e-commerce, website dinamis adalah pilihan tepat.</p><p>PAGODA STUDIO menyediakan kedua jenis website dengan kualitas terbaik.</p>"
  },
  {
    title: "Panduan Lengkap Membangun Brand Melalui Website",
    excerpt: "Website adalah wajah digital brand Anda. Pelajari cara membangun brand yang kuat melalui desain dan konten website yang konsisten.",
    content: "<p>Branding bukan hanya tentang logo dan warna, tapi bagaimana orang merasakan bisnis Anda. Website adalah salah satu touchpoint terpenting dalam membangun brand.</p><h2>1. Konsistensi Visual</h2><p>Gunakan palet warna, tipografi, dan gaya desain yang konsisten di seluruh halaman untuk menciptakan pengalaman yang kohesif.</p><h2>2. Ceritakan Kisah Brand</h2><p>Halaman Tentang Kami adalah kesempatan untuk berbagi visi, misi, dan nilai-nilai yang membuat brand Anda unik.</p><h2>3. Tampilkan Bukti Sosial</h2><p>Testimoni, studi kasus, dan portofolio adalah bukti nyata bahwa brand Anda terpercaya.</p><h2>4. Pengalaman Pengguna (UX)</h2><p>Website yang mudah dinavigasi, cepat, dan responsif memberikan pengalaman positif yang meningkatkan persepsi brand.</p><p>Bangun brand yang kuat dengan website profesional dari PAGODA STUDIO.</p>"
  },
  {
    title: "Cara Memilih Domain dan Hosting yang Tepat untuk Website",
    excerpt: "Domain dan hosting adalah fondasi website Anda. Simak panduan memilih domain yang baik dan hosting yang sesuai dengan kebutuhan bisnis.",
    content: "<p>Domain dan hosting adalah dua komponen fundamental yang harus dipilih dengan tepat sebelum membangun website. Keputusan yang salah bisa berakibat pada performa website yang lambat.</p><h2>Memilih Nama Domain</h2><p>Pilihlah nama yang mudah diingat, sesuai dengan nama bisnis, menggunakan ekstensi yang tepat, dan pendek tanpa tanda hubung berlebihan.</p><h2>Memilih Layanan Hosting</h2><p>Pertimbangkan kecepatan server, uptime guarantee minimal 99.9%, customer support 24/7, dan skalabilitas untuk pertumbuhan website Anda.</p><p>Setiap paket website dari PAGODA STUDIO sudah termasuk domain dan hosting berkualitas. Anda tidak perlu pusing mengurus teknisnya.</p>"
  },
  {
    title: "Website vs Social Media: Mana yang Lebih Penting untuk Bisnis?",
    excerpt: "Perdebatan antara memiliki website atau hanya mengandalkan media sosial sering terjadi. Simak perbandingan lengkapnya dan temukan jawabannya.",
    content: "<p>Banyak pelaku bisnis bertanya: apakah masih perlu memiliki website jika sudah punya akun Instagram atau Facebook? Jawabannya, website dan media sosial memiliki peran berbeda dan saling melengkapi.</p><h2>Kelebihan Website</h2><p>Anda memiliki kontrol penuh, tidak terikat algoritma, membangun kredibilitas, bisa ditemukan melalui Google, dan menampilkan informasi lengkap.</p><h2>Kelebihan Social Media</h2><p>Gratis, mudah dimulai, jangkauan luas, interaksi langsung dengan pelanggan, dan fitur viral yang mempercepat pertumbuhan.</p><h2>Solusi Terbaik: Kombinasi Keduanya</h2><p>Gunakan website sebagai pusat informasi dan konversi, dan media sosial sebagai saluran untuk menarik pengunjung ke website. Website adalah rumah digital Anda, media sosial adalah jalan rayanya.</p><p>PAGODA STUDIO siap membantu membangun website yang terintegrasi dengan strategi media sosial Anda.</p>"
  },
  {
    title: "Tren Desain Website 2025: Apa yang Harus Anda Ketahui",
    excerpt: "Desain website terus berkembang. Simak tren desain website terbaru di tahun 2025 yang bisa membuat website Anda tampil modern dan menarik.",
    content: "<p>Dunia desain website terus berubah seiring perkembangan teknologi. Di tahun 2025, beberapa tren desain diprediksi akan mendominasi.</p><h2>1. Dark Mode yang Lebih Canggih</h2><p>Dark mode bukan lagi sekadar opsi, tapi sudah menjadi standar dengan layering warna yang sophisticated.</p><h2>2. Glassmorphism</h2><p>Efek kaca dengan backdrop blur dan transparansi masih menjadi tren, dikombinasikan dengan elemen desain modern lainnya.</p><h2>3. Micro-Interactions</h2><p>Animasi kecil yang responsif terhadap interaksi pengguna membuat website terasa hidup dan responsif.</p><h2>4. Tipografi Ekspresif</h2><p>Font besar, bold, dan ekspresif digunakan sebagai elemen desain utama, bukan hanya untuk dibaca.</p><h2>5. Kecepatan dan Kinerja</h2><p>Desain yang indah harus tetap ringan dan cepat dimuat, terutama di perangkat mobile.</p><p>PAGODA STUDIO selalu mengikuti tren desain website terkini untuk menghasilkan website yang modern dan fungsional.</p>"
  }
];

async function main() {
  console.log("=".repeat(60));
  console.log("  SEEDING 10 ARTICLES TO SUPABASE");
  console.log("=".repeat(60));

  const client = new Client(DB_CONFIG);

  try {
    console.log("\n[1/3] Menghubungkan ke database...");
    await client.connect();
    console.log("  ✅ Terhubung ke Supabase PostgreSQL");

    console.log("\n[2/3] Menghapus artikel existing...");
    await client.query("DELETE FROM articles WHERE slug LIKE 'seed-%'");
    await client.query("DELETE FROM articles WHERE slug LIKE 'cara-%' OR slug LIKE '10-%' OR slug LIKE 'tips-%' OR slug LIKE 'digital-%' OR slug LIKE 'seo-%' OR slug LIKE 'perbedaan-%' OR slug LIKE 'panduan-%' OR slug LIKE 'website-%' OR slug LIKE 'tren-%'");
    console.log("  ✅ Artikel existing dihapus");

    console.log("\n[3/3] Menyisipkan 10 artikel...");
    let success = 0;

    for (let i = 0; i < articles.length; i++) {
      const a = articles[i];
      const slug = a.title.toLowerCase()
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 80) + "-" + i;

      try {
        await client.query(
          `INSERT INTO articles (title, slug, excerpt, content, cover_image, author, published, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
          [a.title, slug, a.excerpt, a.content, null, "Tim PAGODA STUDIO", true]
        );
        console.log(`  [${i + 1}/10] ✅ ${a.title}`);
        success++;
      } catch (err) {
        console.log(`  [${i + 1}/10] ❌ ${a.title} — ${err.message}`);
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log(`  ✅ SELESAI! ${success} dari 10 artikel berhasil disisipkan`);
    console.log("=".repeat(60));

  } catch (err) {
    console.error("\n❌ ERROR:", err.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log("  🔌 Koneksi database ditutup.\n");
  }
}

main();
