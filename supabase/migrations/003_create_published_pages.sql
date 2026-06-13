-- Create published_pages table for storing published page snapshots
-- This allows public access to published pages from any device
-- Run this SQL in your Supabase dashboard SQL Editor

CREATE TABLE IF NOT EXISTS published_pages (
  slug TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for faster queries by user
CREATE INDEX IF NOT EXISTS idx_published_pages_user_id ON published_pages(user_id);

-- Enable Row Level Security
ALTER TABLE published_pages ENABLE ROW LEVEL SECURITY;

-- Policies:
-- Anyone can view published pages (public access)
CREATE POLICY "Anyone can view published pages" ON published_pages
  FOR SELECT USING (true);

-- Only the owner can insert their own published pages
CREATE POLICY "Users can insert own published pages" ON published_pages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only the owner can update their own published pages
CREATE POLICY "Users can update own published pages" ON published_pages
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Only the owner can delete their own published pages
CREATE POLICY "Users can delete own published pages" ON published_pages
  FOR DELETE USING (auth.uid() = user_id);
