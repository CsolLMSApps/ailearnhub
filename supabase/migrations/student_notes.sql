-- ============================================================
-- Student Notes Per Module
-- Each student can have one private note per module.
-- Run this in your Supabase SQL Editor.
-- ============================================================

CREATE TABLE IF NOT EXISTS student_notes (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id     UUID        NOT NULL REFERENCES courses(id)    ON DELETE CASCADE,
  module_number INTEGER     NOT NULL,
  content       TEXT        NOT NULL DEFAULT '',
  updated_at    TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (user_id, course_id, module_number)
);

CREATE INDEX IF NOT EXISTS idx_student_notes_user_course
  ON student_notes(user_id, course_id);

-- RLS: students can only read/write their own notes
ALTER TABLE student_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notes"
  ON student_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes"
  ON student_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes"
  ON student_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
  ON student_notes FOR DELETE
  USING (auth.uid() = user_id);
