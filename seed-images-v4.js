// Seed v4: Update all article cover images to use reliable image service
// Run with: node seed-images-v4.js

const { Client } = require("pg");

const DB_CONFIG = {
  host: "db.ejyqtuzlcdnuuzgqfweo.supabase.co",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "yvGlqS5jaFGKGBwT",
  ssl: { rejectUnauthorized: false },
};

// Reliable image URLs per topic seed
function getCoverImage(seed) {
  return `https://placehold.co/1200x675/1e293b/a78bfa?text=${encodeURIComponent(seed)}`;
}

const articleImages = [
  { id: 1, seed: "Website+UMKM" },
  { id: 2, seed: "Website+Sekolah" },
  { id: 3, seed: "Jasa+Website" },
  { id: 4, seed: "Digital+Marketing" },
  { id: 5, seed: "SEO+Optimasi" },
  { id: 6, seed: "Web+Development" },
  { id: 7, seed: "Branding" },
  { id: 8, seed: "Hosting+Domain" },
  { id: 9, seed: "Website+Bisnis" },
  { id: 10, seed: "Web+Design" },
  { id: 11, seed: "Website+Murah" },
  { id: 12, seed: "Toko+Online" },
  { id: 13, seed: "UMKM+Digital" },
  { id: 14, seed: "SEO+Lanjutan" },
  { id: 15, seed: "Buat+Website" },
  { id: 16, seed: "Landing+Page" },
  { id: 17, seed: "Maintenance" },
  { id: 18, seed: "Company+Profile" },
  { id: 19, seed: "Aplikasi+Web" },
  { id: 20, seed: "Tips+Website" },
];

async function main() {
  console.log("=".repeat(60));
  console.log("  SEED V4: UPDATE COVER IMAGES → placehold.co");
  console.log("=".repeat(60));

  const client = new Client(DB_CONFIG);

  try {
    await client.connect();
    console.log("\n✅ Terhubung ke database\n");

    let updated = 0;
    for (const art of articleImages) {
      const coverUrl = getCoverImage(art.seed);
      try {
        const res = await client.query(
          "UPDATE articles SET cover_image = $1 WHERE id = $2 RETURNING id, title",
          [coverUrl, art.id]
        );
        if (res.rows.length > 0) {
          console.log(`  ✅ ID ${art.id}: ${res.rows[0].title.substring(0, 50)}`);
          updated++;
        }
      } catch (err) {
        console.log(`  ❌ ID ${art.id}: ${err.message}`);
      }
    }

    console.log(`\n  → ${updated}/20 artikel diupdate dengan gambar baru\n`);

    // Verify
    const all = await client.query(
      "SELECT id, substring(cover_image,1,50) as img FROM articles ORDER BY id"
    );
    console.log("📊 Verifikasi:");
    all.rows.forEach(r => {
      console.log(`  ID ${r.id}: ${r.img}`);
    });

    console.log("\n✅ SELESAI! Semua artikel sekarang punya cover_image.");
  } catch (err) {
    console.error("\n❌ ERROR:", err.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log("\n🔌 Koneksi database ditutup.\n");
  }
}

main();
