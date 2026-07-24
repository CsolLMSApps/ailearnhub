-- ============================================================
-- course_resources table
-- Stores metadata for downloadable files attached to courses.
-- Actual files live in Supabase Storage bucket: course-resources
--
-- Run this in your Supabase SQL Editor, then:
--   1. Go to Storage → Create bucket → name: course-resources → Private
-- ============================================================

CREATE TABLE IF NOT EXISTS course_resources (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id        UUID        NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  name             TEXT        NOT NULL,
  description      TEXT,
  file_path        TEXT        NOT NULL,  -- path inside the bucket
  file_name        TEXT        NOT NULL,  -- original filename shown to student
  file_type        TEXT        NOT NULL,  -- MIME type
  file_size_bytes  BIGINT,
  sort_order       INTEGER     DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by course
CREATE INDEX IF NOT EXISTS idx_course_resources_course_id
  ON course_resources(course_id);

-- RLS
ALTER TABLE course_resources ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read resources (enrollment checked in API)
CREATE POLICY "Authenticated users can read course resources"
  ON course_resources FOR SELECT
  TO authenticated
  USING (true);

-- Only service role can insert / update / delete (handled via admin API routes)
-- No additional policies needed — service role bypasses RLS by default.
