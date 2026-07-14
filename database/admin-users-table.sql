-- ============================================
-- ADMIN USERS TABLE
-- Run this in your Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS admin_users (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  added_by   TEXT NOT NULL,
  added_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (access only via service role key, which bypasses RLS)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- No public SELECT policy — only the service role key (used in admin.ts) can access this table.
-- This prevents any logged-in user from reading the admin list via the anon key.
