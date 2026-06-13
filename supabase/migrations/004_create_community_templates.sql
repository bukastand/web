-- Create community_templates table for user-submitted templates
-- Users can submit their pages as templates for others to use
-- Admin can approve/reject submitted templates

CREATE TABLE IF NOT EXISTS community_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Lainnya',
  icon TEXT NOT NULL DEFAULT '📄',
  preview_color TEXT NOT NULL DEFAULT 'from-gray-500 to-gray-600',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_community_templates_approved ON community_templates(is_approved);
CREATE INDEX IF NOT EXISTS idx_community_templates_user_id ON community_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_community_templates_category ON community_templates(category);

-- Enable Row Level Security
ALTER TABLE community_templates ENABLE ROW LEVEL SECURITY;

-- Policies:
-- Anyone can view approved templates
CREATE POLICY "Anyone can view approved templates" ON community_templates
  FOR SELECT USING (is_approved = true OR auth.uid() = user_id);

-- Users can insert their own templates
CREATE POLICY "Users can insert own templates" ON community_templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own templates
CREATE POLICY "Users can update own templates" ON community_templates
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own templates
CREATE POLICY "Users can delete own templates" ON community_templates
  FOR DELETE USING (auth.uid() = user_id);

-- Admins can manage all templates (using is_admin function from migration 002)
CREATE POLICY "Admins can manage all templates" ON community_templates
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());
