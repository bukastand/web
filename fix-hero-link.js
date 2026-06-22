const { Client } = require("pg");

const client = new Client({
  host: "db.ejyqtuzlcdnuuzgqfweo.supabase.co",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "yvGlqS5jaFGKGBwT",
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  
  const check = await client.query("SELECT id, secondary_cta_link FROM hero_content WHERE id = 1");
  if (check.rows.length > 0) {
    console.log("Current value:", check.rows[0].secondary_cta_link);
    await client.query("UPDATE hero_content SET secondary_cta_link = $1, updated_at = NOW() WHERE id = 1", ["/layanan"]);
    console.log("Updated to /layanan");
  } else {
    console.log("No hero_content found");
    // Create if not exists
    await client.query("INSERT INTO hero_content (id, secondary_cta_link) VALUES (1, '/layanan') ON CONFLICT (id) DO UPDATE SET secondary_cta_link = '/layanan'");
    console.log("Created hero_content with /layanan");
  }
  
  await client.end();
}

main().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
