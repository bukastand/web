import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ejyqtuzlcdnuuzgqfweo.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabasePat = process.env.SUPABASE_PAT;

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
`;

export async function GET() {
  return NextResponse.json({
    status: "ready",
    supabase_url: supabaseUrl,
    has_service_key: !!supabaseServiceKey,
    has_pat: !!supabasePat,
    message:
      "POST ke endpoint ini untuk menjalankan migrasi.\nAtau jalankan SQL manual di Supabase Dashboard > SQL Editor.",
    sql: MIGRATION_SQL,
  });
}

async function runManagementApiSql(sql: string) {
  const projectRef = supabaseUrl.split(".")[0].split("//")[1];
  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${supabasePat}`,
    },
    body: JSON.stringify({ query: sql }),
  });
  return res;
}

export async function POST() {
  // Try Management API (PAT) first - this is the only working automated method
  if (supabasePat) {
    try {
      const res = await runManagementApiSql(MIGRATION_SQL);
      if (res.ok) {
        return NextResponse.json({
          status: "success",
          method: "management_api",
          message: "Migrasi berhasil! Tabel builder_pages telah dibuat.",
        });
      }
      const errText = await res.text();
      return NextResponse.json({
        status: "error",
        method: "management_api",
        message: `Management API error: ${res.status} - ${errText}`,
      }, { status: 500 });
    } catch (err: any) {
      return NextResponse.json({
        status: "error",
        method: "management_api",
        message: `Management API exception: ${err?.message}`,
      }, { status: 500 });
    }
  }

  // No automated method available - show manual instructions
  return NextResponse.json({
    status: "manual_required",
    message:
      "Tidak bisa menjalankan SQL secara otomatis. Jalankan manual di Supabase Dashboard.",
    instructions: `
📋 CARA MANUAL:

1. Buka https://supabase.com/dashboard/project/ejyqtuzlcdnuuzgqfweo/sql/new
2. Copy SQL di bawah
3. Paste dan klik RUN

SETUP OTOMATIS (untuk next time):
Set SUPABASE_PAT (Personal Access Token) di Vercel env vars
Buat PAT di: https://supabase.com/dashboard/account/tokens
`,
    sql: MIGRATION_SQL,
  });
}
