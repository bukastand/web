// Seed v3: Update all 20 articles with longer, more comprehensive content
// Run with: node seed-articles-v3.js

const { Client } = require("pg");

const DB_CONFIG = {
  host: "db.ejyqtuzlcdnuuzgqfweo.supabase.co",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "yvGlqS5jaFGKGBwT",
  ssl: { rejectUnauthorized: false },
};

function getCoverImage(seed) {
  return `https://picsum.photos/seed/${seed}/1200/675`;
}

// Longer content append for each article (topic-specific)
const contentAdditions = {
  default: `<p>Kesimpulannya, memiliki website profesional adalah investasi jangka panjang yang sangat berharga untuk bisnis Anda. Dengan perencanaan yang matang, desain yang menarik, dan konten yang berkualitas, website akan menjadi aset digital yang terus memberikan manfaat. Jangan ragu untuk berkonsultasi dengan tim profesional PAGODA STUDIO untuk mendapatkan solusi terbaik sesuai kebutuhan Anda. Hubungi kami sekarang untuk diskusi lebih lanjut!</p>`,

  umkm: `<p>Kesimpulannya, UMKM tidak perlu takut untuk memulai transformasi digital. Dengan langkah yang tepat dan bantuan profesional, website UMKM bisa menjadi game-changer dalam mengembangkan bisnis. Mulai dari landing page sederhana hingga toko online lengkap, setiap tahapan akan membawa bisnis Anda semakin maju. PAGODA STUDIO berkomitmen untuk mendampingi UMKM Indonesia go digital dengan solusi yang terjangkau dan berkualitas. Hubungi kami untuk konsultasi gratis dan dapatkan rekomendasi paket yang paling sesuai dengan anggaran dan kebutuhan bisnis Anda!</p>`,

  sekolah: `<p>Website sekolah bukan sekadar halaman informasi, tetapi merupakan cerminan kualitas dan kredibilitas institusi pendidikan di era digital. Dengan website yang profesional, sekolah dapat membangun citra positif, memperluas jangkauan, dan memberikan layanan terbaik kepada siswa dan orang tua. Investasi dalam website sekolah adalah investasi dalam mutu pendidikan dan reputasi institusi. PAGODA STUDIO telah berpengalaman membantu berbagai sekolah di Indonesia menciptakan website yang informatif, interaktif, dan mudah dikelola. Konsultasikan kebutuhan website sekolah Anda bersama kami!</p>`,

  jasa: `<p>Memilih jasa pembuatan website adalah keputusan strategis yang akan mempengaruhi kesuksesan online bisnis Anda dalam jangka panjang. Luangkan waktu untuk riset, bandingkan opsi, dan jangan ragu bertanya. Dengan penyedia jasa yang tepat, website Anda akan menjadi investasi yang memberikan hasil maksimal. PAGODA STUDIO adalah mitra terpercaya dengan portofolio 50+ project dan komitmen pada kualitas. Dapatkan konsultasi gratis dan buktikan sendiri perbedaan kualitas layanan kami!</p>`,

  digital_marketing: `<p>Digital marketing adalah perjalanan, bukan destinasi. Terus belajar, bereksperimen, dan optimasi adalah kunci kesuksesan. Mulailah dengan dasar yang kuat, ukur hasilnya, dan kembangkan strategi Anda seiring waktu. Website yang solid adalah fondasi dari semua aktivitas digital marketing — pastikan Anda memulainya dengan benar. PAGODA STUDIO siap membantu Anda membangun website yang dioptimasi untuk konversi dan mendukung strategi pemasaran digital Anda secara maksimal!</p>`,

  seo: `<p>SEO adalah investasi jangka panjang yang memberikan hasil berkelanjutan. Berbeda dengan iklan berbayar yang berhenti saat budget habis, traffic organik dari SEO terus mengalir selama website Anda dirawat dengan baik. Mulailah dengan dasar-dasar yang sudah dijelaskan di atas, dan secara bertahap tingkatkan strategi SEO Anda. Untuk hasil yang lebih maksimal, pertimbangkan untuk menggunakan jasa SEO profesional. PAGODA STUDIO menyediakan layanan optimasi SEO yang terintegrasi dengan pembuatan website, sehingga website Anda tidak hanya tampil cantik tetapi juga mudah ditemukan di Google!</p>`,

  statis_dinamis: `<p>Pilihan antara website statis dan dinamis sangat tergantung pada kebutuhan spesifik bisnis Anda. Tidak ada pilihan yang salah, yang ada adalah pilihan yang kurang tepat. Evaluasi kebutuhan saat ini dan rencana pengembangan ke depan sebelum memutuskan. Jika masih bingung, konsultasikan dengan profesional. PAGODA STUDIO menyediakan kedua jenis website dengan kualitas terbaik. Tim kami akan membantu Anda menentukan jenis website yang paling sesuai dengan kebutuhan, anggaran, dan rencana pengembangan bisnis Anda!</p>`,

  branding: `<p>Branding yang kuat melalui website adalah aset yang tak ternilai harganya. Website adalah etalase digital yang bekerja 24/7 untuk memperkuat citra brand Anda di mata pelanggan. Investasikan waktu dan sumber daya untuk memastikan website Anda mencerminkan kualitas dan nilai brand yang ingin Anda sampaikan. PAGODA STUDIO siap membantu Anda membangun identitas digital yang kohesif dan profesional melalui website yang dirancang khusus sesuai dengan karakter brand Anda. Mulai perjalanan branding digital Anda bersama kami!</p>`,

  domain_hosting: `<p>Domain dan hosting adalah fondasi website Anda. Memilih yang tepat sejak awal akan menghemat waktu, uang, dan sakit kepala di masa depan. Ingatlah bahwa domain dan hosting yang murah belum tentu ekonomis dalam jangka panjang. Pilihlah yang menawarkan keseimbangan terbaik antara harga, performa, dan dukungan. PAGODA STUDIO menyediakan paket lengkap domain, hosting, dan pembuatan website dalam satu solusi terintegrasi. Anda tidak perlu pusing mengurus teknisnya — kami handle semuanya dari A sampai Z!</p>`,

  vs_social: `<p>Jadi, mana yang lebih penting? Jawabannya: keduanya. Website dan media sosial adalah dua sisi mata uang yang sama dalam strategi digital bisnis Anda. Website adalah fondasi dan pusat kendali, sementara media sosial adalah saluran distribusi dan interaksi. Gunakan keduanya secara sinergis untuk hasil maksimal. PAGODA STUDIO siap membantu Anda membangun website yang terintegrasi dengan strategi media sosial, sehingga semua upaya pemasaran digital Anda berjalan selaras dan efektif. Konsultasi gratis sekarang!</p>`,

  desain_2025: `<p>Tren desain website 2025 menekankan keseimbangan antara estetika dan fungsionalitas. Desain yang indah harus tetap cepat, responsif, dan mudah digunakan. Jangan terjebak dalam tren semata — pastikan setiap elemen desain memiliki tujuan dan mendukung pengalaman pengguna yang lebih baik. PAGODA STUDIO selalu mengikuti perkembangan tren desain terkini dan menerapkannya secara bijak dalam setiap project. Website Anda akan tampil modern, profesional, dan tetap optimal dalam performa. Hubungi kami untuk mewujudkan website impian Anda!</p>`,

  murah: `<p>Kesimpulannya, mencari jasa pembuatan website murah itu boleh, asal tetap memperhatikan kualitas. Dengan riset yang teliti dan mengetahui apa yang perlu ditanyakan, Anda bisa mendapatkan website profesional dengan harga terjangkau. Ingat, website adalah investasi, bukan pengeluaran. Website yang baik akan mendatangkan lebih banyak pelanggan dan meningkatkan pendapatan bisnis Anda. PAGODA STUDIO menawarkan paket website mulai dari Rp1,2 juta dengan kualitas tidak murahan. Dapatkan konsultasi gratis dan lihat sendiri hasil kerja kami!</p>`,

  toko_online: `<p>Membuat website toko online adalah langkah besar dalam pengembangan bisnis Anda. Dengan perencanaan yang matang dan pemilihan fitur yang tepat, toko online Anda akan menjadi mesin penjualan yang bekerja 24 jam sehari. Mulailah dengan paket yang sesuai, ukur hasilnya, dan kembangkan secara bertahap. PAGODA STUDIO siap membantu Anda membangun toko online profesional dengan fitur lengkap mulai dari katalog produk, payment gateway, manajemen stok, hingga dashboard admin. Konsultasi gratis sekarang dan wujudkan toko online impian Anda!</p>`,

  landing_page: `<p>Landing page adalah salah satu alat marketing digital paling efektif untuk meningkatkan konversi. Dengan fokus pada satu tujuan dan pesan yang jelas, landing page yang dirancang dengan baik bisa menghasilkan ROI yang jauh lebih tinggi dibandingkan halaman website biasa. Investasi dalam landing page profesional akan terbayar berkali-kali lipat melalui peningkatan leads dan penjualan. PAGODA STUDIO menyediakan jasa pembuatan landing page profesional dengan desain yang dioptimasi untuk konversi. Hubungi kami untuk konsultasi gratis dan mulailah meningkatkan konversi bisnis Anda!</p>`,

  maintenance: `<p>Website adalah aset digital yang perlu dirawat secara rutin, sama seperti aset fisik lainnya. Dengan maintenance yang teratur, website Anda akan tetap aman, cepat, dan selalu up-to-date. Jangan anggap remeh perawatan website — investasi kecil dalam maintenance bisa mencegah kerugian besar akibat website down, kena hack, atau kehilangan data. PAGODA STUDIO menawarkan paket maintenance website yang terjangkau dengan layanan monitoring 24/7, backup rutin, update keamanan, dan support teknis. Pastikan website Anda selalu dalam kondisi terbaik dengan layanan maintenance profesional kami!</p>`,

  company_profile: `<p>Website company profile profesional adalah investasi yang wajib bagi setiap perusahaan yang ingin membangun kredibilitas dan memperluas jangkauan bisnis. Dengan desain yang menarik, konten yang informatif, dan navigasi yang mudah, company profile digital Anda akan menjadi alat marketing yang sangat efektif. Jangan lewatkan kesempatan untuk membuat kesan pertama yang tak terlupakan melalui website yang profesional. PAGODA STUDIO siap membantu Anda menciptakan company profile digital yang mencerminkan kualitas dan profesionalisme perusahaan Anda. Konsultasi gratis sekarang!</p>`,

  aplikasi_web: `<p>Aplikasi web custom adalah solusi tepat untuk bisnis yang memiliki kebutuhan unik yang tidak bisa dipenuhi oleh software generik. Meskipun investasi awalnya lebih besar, aplikasi web custom memberikan fleksibilitas, skalabilitas, dan efisiensi yang jauh lebih baik dalam jangka panjang. Dengan teknologi modern dan pengalaman bertahun-tahun, PAGODA STUDIO siap membangun aplikasi web yang sesuai dengan kebutuhan spesifik bisnis Anda. Dari sistem inventory hingga aplikasi internal perusahaan, tim kami siap mewujudkannya. Hubungi kami untuk diskusi dan konsultasi gratis!</p>`,

  anti_tertipu: `<p>Memilih jasa website yang tepat memang membutuhkan ketelitian, tapi hasilnya akan sepadan. Dengan mengikuti tips di atas, Anda bisa menghindari jasa abal-abal dan mendapatkan website profesional yang benar-benar membantu bisnis berkembang. Ingat, website yang baik adalah investasi, bukan biaya. Jangan tergiur harga murah yang berujung pada kualitas buruk dan pemborosan. PAGODA STUDIO adalah jasa pembuatan website profesional dan terpercaya dengan portofolio 50+ project dan testimoni klien yang memuaskan. Konsultasi gratis, dapatkan website impian Anda bersama kami!</p>`,
};

async function main() {
  console.log("=".repeat(60));
  console.log("  SEED V3: UPDATE ALL 20 ARTICLES WITH LONGER CONTENT");
  console.log("=".repeat(60));

  const client = new Client(DB_CONFIG);

  try {
    await client.connect();
    console.log("\n✅ Terhubung ke database\n");

    // Fetch all articles
    const all = await client.query("SELECT id, title, slug, content FROM articles ORDER BY id");
    console.log(`[1/2] Memperpanjang ${all.rows.length} artikel...\n`);

    let updated = 0;

    for (const row of all.rows) {
      const slug = row.slug;
      const existingContent = row.content || "";

      // Determine which addition to use based on slug keywords
      let addition = contentAdditions.default;
      for (const [key, val] of Object.entries(contentAdditions)) {
        if (slug.includes(key) && key !== "default") {
          addition = val;
          break;
        }
      }

      // Only append if not already there (idempotent)
      if (existingContent.includes("Kesimpulannya")) {
        console.log(`  ⏭️  ${row.title.substring(0, 50)}... (already long)`);
        continue;
      }

      // Add more sections before the closing
      const newContent = existingContent.trimEnd() + `\n\n${addition}`;

      await client.query("UPDATE articles SET content = $1, updated_at = NOW() WHERE id = $2", [newContent, row.id]);
      console.log(`  ✅ ${row.title.substring(0, 50)}...`);
      updated++;
    }

    console.log(`\n  → ${updated} artikel diperpanjang, ${all.rows.length - updated} sudah panjang sebelumnya\n`);

    // Show stats
    const stats = await client.query(
      "SELECT COUNT(*) as total, AVG(LENGTH(content)) as avg_len FROM articles"
    );
    console.log(`[2/2] Statistik konten:`);
    console.log(`  📊 Total artikel: ${stats.rows[0].total}`);
    console.log(`  📊 Rata-rata panjang: ${Math.round(parseInt(stats.rows[0].avg_len || "0"))} karakter\n`);

    console.log("=".repeat(60));
    console.log("  ✅ SELESAI! Semua artikel sudah diperpanjang");
    console.log("=".repeat(60));

  } catch (err) {
    console.error("\n❌ ERROR:", err.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log("🔌 Koneksi database ditutup.\n");
  }
}

main();
