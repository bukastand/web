-- ============================================================
-- Migration 005: Create Storage Bucket for Page Images
-- ============================================================
-- Jalankan SQL ini di Supabase SQL Editor setelah migration 001-004
-- ============================================================

-- Create the storage bucket for page images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'page-images',
  'page-images',
  true,  -- Public bucket (images accessible without auth)
  5242880,  -- 5MB max file size
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to all images
CREATE POLICY "Public read access for page-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'page-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload to page-images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'page-images');

-- Allow authenticated users to delete their own images
CREATE POLICY "Users can delete own images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'page-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to update their own images
CREATE POLICY "Users can update own images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'page-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (bucket_id = 'page-images' AND (storage.foldername(name))[1] = auth.uid()::text);
