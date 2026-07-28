-- ============================================================
-- Blog Posts
-- Stores admin-written blog posts with image support.
-- Run this in your Supabase SQL Editor.
--
-- Also create a Storage bucket:
--   Name: blog-images   |   Public: ON  (images are public)
-- ============================================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title           TEXT        NOT NULL,
  slug            TEXT        NOT NULL UNIQUE,
  excerpt         TEXT,                          -- short summary shown on listing page
  content         TEXT        NOT NULL DEFAULT '',
  cover_image_url TEXT,                          -- full URL from Supabase Storage
  category        TEXT        DEFAULT 'General',
  author_name     TEXT        DEFAULT 'AI Learn Hub Team',
  is_published    BOOLEAN     DEFAULT false,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug        ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published   ON blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category    ON blog_posts(category);

-- RLS: public can read published posts; writes only via service role (admin APIs)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published blog posts"
  ON blog_posts FOR SELECT
  USING (is_published = true);
