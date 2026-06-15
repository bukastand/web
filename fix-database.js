/**
 * fix-database.js
 * 
 * Memperbaiki database Supabase dengan:
 * 1. Menjalankan migrasi SQL (trigger, RLS, tabel)
 * 2. Membuat profile untuk semua user yang sudah terdaftar
 * 3. Men-set role admin untuk user pertama atau user tertentu
 * 
 * Jalankan: node fix-database.js
 */

const { Client } = require("pg");

// ============================================================
// KONFIGURASI
// ============================================================
const DB_CONFIG = {
  host: "db.ejyqtuzlcdnuuzgqfweo.supabase.co",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "yvGlqS5jaFGKGBwT",
  ssl: {
    rejectUnauthorized: false,
  },
};

// ============================================================
// MIGRATION SQL (dari src/app/api/migrate/route.ts)
// ============================================================
const MIGRATION_SQL = `
-- ============================================================
-- 1. BUILDER PAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS builder_pages (
  id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_builder_pages_user_id ON builder_pages(user_id);

ALTER TABLE builder_pages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'builder_pages' AND policyname = 'Users can view own pages') THEN
    CREATE POLICY "Users can view own pages" ON builder_pages FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'builder_pages' AND policyname = 'Users can insert own pages') THEN
    CREATE POLICY "Users can insert own pages" ON builder_pages FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'builder_pages' AND policyname = 'Users can update own pages') THEN
    CREATE POLICY "Users can update own pages" ON builder_pages FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'builder_pages' AND policyname = 'Users can delete own pages') THEN
    CREATE POLICY "Users can delete own pages" ON builder_pages FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- ============================================================
-- 2. PROFILES TABLE (user roles)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- SECURITY DEFINER function to check admin (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
$$;

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Uses SECURITY DEFINER function to avoid infinite recursion
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    'user'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 3. PUBLISHED PAGES TABLE (public snapshots)
-- ============================================================
CREATE TABLE IF NOT EXISTS published_pages (
  slug TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_published_pages_user_id ON published_pages(user_id);

ALTER TABLE published_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published pages" ON published_pages;
DROP POLICY IF EXISTS "Users can insert own published pages" ON published_pages;
DROP POLICY IF EXISTS "Users can update own published pages" ON published_pages;
DROP POLICY IF EXISTS "Users can delete own published pages" ON published_pages;

CREATE POLICY "Anyone can view published pages" ON published_pages
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own published pages" ON published_pages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own published pages" ON published_pages
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own published pages" ON published_pages
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 4. COMMUNITY TEMPLATES TABLE (user-submitted templates)
-- ============================================================
CREATE TABLE IF NOT EXISTS community_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Lainnya',
  icon TEXT NOT NULL DEFAULT '\ud83d\udcc4',
  preview_color TEXT NOT NULL DEFAULT 'from-gray-500 to-gray-600',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_community_templates_approved ON community_templates(is_approved);
CREATE INDEX IF NOT EXISTS idx_community_templates_user_id ON community_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_community_templates_category ON community_templates(category);

ALTER TABLE community_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view approved templates" ON community_templates;
DROP POLICY IF EXISTS "Users can insert own templates" ON community_templates;
DROP POLICY IF EXISTS "Users can update own templates" ON community_templates;
DROP POLICY IF EXISTS "Users can delete own templates" ON community_templates;
DROP POLICY IF EXISTS "Admins can manage all templates" ON community_templates;

CREATE POLICY "Anyone can view approved templates" ON community_templates
  FOR SELECT USING (is_approved = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert own templates" ON community_templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates" ON community_templates
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates" ON community_templates
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all templates" ON community_templates
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());
`;

async function main() {
  console.log("=".repeat(60));
  console.log("  FIX DATABASE - PAGODA STUDIO");
  console.log("=".repeat(60));
  
  const client = new Client(DB_CONFIG);

  try {
    // 1. Connect to database
    console.log("\n[1/5] Menghubungkan ke database...");
    await client.connect();
    console.log("  ✅ Terhubung ke Supabase PostgreSQL");

    // 2. Run migration SQL
    console.log("\n[2/5] Menjalankan migrasi SQL...");
    await client.query(MIGRATION_SQL);
    console.log("  ✅ Migrasi berhasil (tabel, trigger, RLS policies)");

    // 3. Check if handle_new_user trigger exists and works
    console.log("\n[3/5] Memeriksa trigger handle_new_user...");
    const triggerCheck = await client.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'on_auth_user_created'
      ) as trigger_exists
    `);
    console.log(`  ✅ Trigger on_auth_user_created: ${triggerCheck.rows[0].trigger_exists ? "ADA" : "TIDAK ADA (akan dibuat ulang)"}`);

    // 4. Find all auth users and create missing profiles
    console.log("\n[4/5] Memeriksa user dan profile...");
    
    // Query auth.users for all registered users
    const authUsers = await client.query(`
      SELECT id, email, raw_user_meta_data, created_at
      FROM auth.users
      ORDER BY created_at ASC
    `);

    console.log(`  📊 Total user terdaftar di auth.users: ${authUsers.rows.length}`);

    if (authUsers.rows.length === 0) {
      console.log("  ⚠️  Belum ada user yang terdaftar.");
      console.log("  💡 Buat user admin baru melalui halaman register, atau daftarkan lewat Supabase Dashboard.");
      console.log("\n  Setelah itu, jalankan script ini lagi untuk mengatur role admin.\n");
      return;
    }

    // Show all registered users
    console.log("\n  Daftar user terdaftar:");
    authUsers.rows.forEach((u, i) => {
      const name = u.raw_user_meta_data?.full_name || u.email || "(no name)";
      console.log(`    ${i + 1}. [${u.id.substring(0, 8)}...] ${name} (${u.email || "no email"})`);
    });

    // For each auth user, check if profile exists, if not create it
    let createdCount = 0;
    let updatedCount = 0;
    let adminUsers = [];

    for (const user of authUsers.rows) {
      // Check if profile exists
      const profileCheck = await client.query(
        `SELECT id, role FROM profiles WHERE id = $1`,
        [user.id]
      );

      if (profileCheck.rows.length === 0) {
        // Create profile
        const fullName = user.raw_user_meta_data?.full_name || user.email?.split("@")[0] || "User";
        await client.query(
          `INSERT INTO profiles (id, full_name, role, created_at, updated_at)
           VALUES ($1, $2, 'user', NOW(), NOW())`,
          [user.id, fullName]
        );
        createdCount++;
        console.log(`  ✅ Profile dibuat: ${fullName} (role: user)`);
      } else {
        console.log(`  ✓ Profile sudah ada: ${profileCheck.rows[0].role}`);
        if (profileCheck.rows[0].role === "admin") {
          adminUsers.push(user);
        }
      }
    }

    console.log(`\n  📊 Profile baru dibuat: ${createdCount}`);
    console.log(`  📊 Profile sudah ada sebelumnya: ${authUsers.rows.length - createdCount}`);

    // 5. Set admin role
    console.log("\n[5/5] Mengatur role admin...");

    if (adminUsers.length > 0) {
      console.log(`  ✅ Sudah ada ${adminUsers.length} admin:`);
      adminUsers.forEach((u) => {
        const name = u.raw_user_meta_data?.full_name || u.email;
        console.log(`     - ${name} (${u.email || "no email"})`);
      });
    } else {
      // Set the first user as admin
      const firstUser = authUsers.rows[0];
      const userName = firstUser.raw_user_meta_data?.full_name || firstUser.email || "User";
      
      await client.query(
        `UPDATE profiles SET role = 'admin', updated_at = NOW() WHERE id = $1`,
        [firstUser.id]
      );
      
      console.log(`  ✅ User pertama dijadikan admin:`);
      console.log(`     Nama: ${userName}`);
      console.log(`     Email: ${firstUser.email || "tidak ada"}`);
      console.log(`     ID: ${firstUser.id}`);
      updatedCount++;
    }

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("  RINGKASAN");
    console.log("=".repeat(60));
    console.log(`  Total user terdaftar: ${authUsers.rows.length}`);
    console.log(`  Profile baru dibuat: ${createdCount}`);
    console.log(`  User dijadikan admin: ${updatedCount > 0 ? updatedCount : "sudah ada admin"}`);
    console.log("\n  ✅ Database berhasil diperbaiki!");
    console.log("\n  💡 Sekarang coba login admin dengan email user pertama.");
    console.log("  💡 Jika masih gagal, coba register user baru di /auth/register");
    console.log("     lalu jalankan script ini lagi.\n");

  } catch (err) {
    console.error("\n❌ ERROR:", err.message);
    console.error("\nDetail:", err);
    process.exit(1);
  } finally {
    await client.end();
    console.log("  🔌 Koneksi database ditutup.\n");
  }
}

main();
