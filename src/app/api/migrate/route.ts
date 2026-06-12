import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ejyqtuzlcdnuuzgqfweo.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabasePat = process.env.SUPABASE_PAT;

const MIGRATION_SQL = `
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
