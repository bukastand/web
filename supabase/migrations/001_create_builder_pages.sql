-- Create builder_pages table for storing drag-and-drop builder page data
-- Run this SQL in your Supabase dashboard SQL Editor

CREATE TABLE IF NOT EXISTS builder_pages (
  id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (id, user_id)
);

-- Index for faster queries by user
CREATE INDEX IF NOT EXISTS idx_builder_pages_user_id ON builder_pages(user_id);

-- Enable Row Level Security
ALTER TABLE builder_pages ENABLE ROW LEVEL SECURITY;

-- Policies: users can only access their own pages
CREATE POLICY "Users can view own pages" ON builder_pages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pages" ON builder_pages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pages" ON builder_pages
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pages" ON builder_pages
  FOR DELETE USING (auth.uid() = user_id);
