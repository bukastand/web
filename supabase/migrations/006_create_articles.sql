-- ============================================================
-- Tabel Articles untuk Fitur Blog / Artikel
-- Jalankan SQL ini di Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS articles (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  cover_image TEXT,
  author TEXT NOT NULL DEFAULT 'Admin',
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Policies
-- Anyone can view published articles
CREATE POLICY "Anyone can view published articles" ON articles
  FOR SELECT USING (published = true);

-- Only admins can manage articles (using the is_admin() function)
CREATE POLICY "Admins can manage articles" ON articles
  FOR ALL USING (public.is_admin());

-- Index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles (slug);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles (published);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles (created_at DESC);
