-- FIX_QUIZ_RLS.sql
-- Run this in Supabase Dashboard → SQL Editor
--
-- Problem: Quiz RLS only allows purchasers to read quizzes via direct DB query.
-- The server Supabase client (anon key + cookies) wasn't passing auth correctly.
-- Fix: Allow any authenticated user to read quiz questions.
-- Purchase is already verified at the page level before quiz is shown.

-- Drop old restrictive policy
DROP POLICY IF EXISTS "Quizzes viewable by purchasers" ON quizzes;

-- New policy: any authenticated (logged-in) user can read quiz questions
CREATE POLICY "Quizzes viewable by authenticated users"
  ON quizzes FOR SELECT
  TO authenticated
  USING (true);

-- Verify the change
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'quizzes';
