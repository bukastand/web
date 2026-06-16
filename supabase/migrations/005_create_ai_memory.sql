-- Create ai_memory table for AI learning system
-- Stores anonymized successful AI generations so the AI can learn from past projects
-- Only high-rated (4-5 star) generations are used as references for all users
-- Run this SQL in your Supabase dashboard SQL Editor

CREATE TABLE IF NOT EXISTS ai_memory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt TEXT NOT NULL,
  category TEXT,
  style_tags TEXT[] DEFAULT '{}',
  section_count INTEGER DEFAULT 0,
  page_structure JSONB NOT NULL DEFAULT '{}'::jsonb,
  rating INTEGER DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  used_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_ai_memory_rating ON ai_memory(rating DESC);
CREATE INDEX IF NOT EXISTS idx_ai_memory_category ON ai_memory(category);
CREATE INDEX IF NOT EXISTS idx_ai_memory_style_tags ON ai_memory USING GIN(style_tags);
CREATE INDEX IF NOT EXISTS idx_ai_memory_created_at ON ai_memory(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_memory_prompt_search ON ai_memory USING GIN(to_tsvector('simple', prompt));

-- Enable Row Level Security
ALTER TABLE ai_memory ENABLE ROW LEVEL SECURITY;

-- Policies:
-- Anyone can read ai_memory (everyone benefits from collective learning)
CREATE POLICY "Anyone can read ai_memory" ON ai_memory
  FOR SELECT USING (true);

-- Only authenticated users can insert ai_memory
CREATE POLICY "Authenticated users can insert ai_memory" ON ai_memory
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only the system (via service role) can update ai_memory (for rating updates)
CREATE POLICY "Service role can update ai_memory" ON ai_memory
  FOR UPDATE USING (auth.role() = 'service_role');

-- Function to auto-extract style tags from page_structure
-- This can be called after insert to process the data
CREATE OR REPLACE FUNCTION public.process_ai_memory()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Auto-update section_count from page_structure
  NEW.section_count = jsonb_array_length(NEW.page_structure->'sections');
  
  -- Extract style tags from page_structure if they exist
  IF NEW.page_structure ? 'style_tags' THEN
    NEW.style_tags = ARRAY(
      SELECT jsonb_array_elements_text(NEW.page_structure->'style_tags')
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to auto-process ai_memory on insert
DROP TRIGGER IF EXISTS on_ai_memory_insert ON ai_memory;
CREATE TRIGGER on_ai_memory_insert
  BEFORE INSERT ON ai_memory
  FOR EACH ROW EXECUTE FUNCTION public.process_ai_memory();
