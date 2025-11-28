-- ============================================
-- AI LEARN HUB DATABASE SCHEMA
-- ============================================
-- Execute this entire file in Supabase SQL Editor
-- Database: Postgres 15+
-- ============================================

-- ============================================
-- COURSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT,
  long_description TEXT,
  
  -- Pricing (in cents)
  price_usd INTEGER NOT NULL DEFAULT 1900,
  price_cad INTEGER DEFAULT 2500,
  price_gbp INTEGER DEFAULT 1600,
  price_aud INTEGER DEFAULT 2800,
  price_inr INTEGER DEFAULT 64900,
  
  -- Stripe Product IDs
  stripe_product_id TEXT,
  stripe_price_id_usd TEXT,
  stripe_price_id_cad TEXT,
  stripe_price_id_gbp TEXT,
  stripe_price_id_aud TEXT,
  stripe_price_id_inr TEXT,
  
  -- Course metadata
  level TEXT DEFAULT 'beginner',
  category TEXT,
  total_modules INTEGER DEFAULT 0,
  total_hours INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- COURSE MODULES (Content structure)
-- ============================================
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  module_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,              -- Markdown content
  estimated_minutes INTEGER DEFAULT 30,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(course_id, module_number)
);

-- ============================================
-- QUIZZES
-- ============================================
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  module_number INTEGER NOT NULL,
  questions JSONB NOT NULL,  -- Array of question objects
  pass_percentage INTEGER DEFAULT 70,
  
  UNIQUE(course_id, module_number)
);

-- ============================================
-- PURCHASES
-- ============================================
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  
  -- Stripe
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  
  -- Payment info
  amount_paid INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  
  -- Status
  status TEXT NOT NULL DEFAULT 'completed',
  
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, course_id)
);

-- ============================================
-- PROGRESS TRACKING
-- ============================================
CREATE TABLE IF NOT EXISTS progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  
  completed_modules INTEGER[] DEFAULT '{}',
  current_module INTEGER DEFAULT 1,
  completion_percentage INTEGER DEFAULT 0,
  
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(user_id, course_id)
);

-- ============================================
-- QUIZ RESULTS
-- ============================================
CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  module_number INTEGER NOT NULL,
  
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  answers JSONB NOT NULL,
  
  attempt_number INTEGER DEFAULT 1,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CERTIFICATES
-- ============================================
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  
  certificate_number TEXT UNIQUE NOT NULL,
  student_name TEXT NOT NULL,
  course_title TEXT NOT NULL,
  
  pdf_url TEXT,              -- Supabase Storage URL
  
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, course_id)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_course_modules_course ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_course ON purchases(course_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_course ON progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_course ON quiz_results(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_number ON certificates(certificate_number);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Courses are viewable by everyone" ON courses;
DROP POLICY IF EXISTS "Modules viewable by purchasers" ON course_modules;
DROP POLICY IF EXISTS "Quizzes viewable by purchasers" ON quizzes;
DROP POLICY IF EXISTS "Users can view own purchases" ON purchases;
DROP POLICY IF EXISTS "Users can view own progress" ON progress;
DROP POLICY IF EXISTS "Users can update own progress" ON progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON progress;
DROP POLICY IF EXISTS "Users can view own quiz results" ON quiz_results;
DROP POLICY IF EXISTS "Users can insert quiz results" ON quiz_results;
DROP POLICY IF EXISTS "Users can view own certificates" ON certificates;

-- Courses: Public read, no write
CREATE POLICY "Courses are viewable by everyone"
  ON courses FOR SELECT
  USING (is_published = true);

-- Course modules: Users can read if they purchased
CREATE POLICY "Modules viewable by purchasers"
  ON course_modules FOR SELECT
  USING (
    course_id IN (
      SELECT course_id FROM purchases
      WHERE user_id = auth.uid() AND status = 'completed'
    )
  );

-- Quizzes: Users can read if they purchased
CREATE POLICY "Quizzes viewable by purchasers"
  ON quizzes FOR SELECT
  USING (
    course_id IN (
      SELECT course_id FROM purchases
      WHERE user_id = auth.uid() AND status = 'completed'
    )
  );

-- Purchases: Users can read their own
CREATE POLICY "Users can view own purchases"
  ON purchases FOR SELECT
  USING (auth.uid() = user_id);

-- Progress: Users can read/write their own
CREATE POLICY "Users can view own progress"
  ON progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Quiz results: Users can read/write their own
CREATE POLICY "Users can view own quiz results"
  ON quiz_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert quiz results"
  ON quiz_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Certificates: Users can view their own
CREATE POLICY "Users can view own certificates"
  ON certificates FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Create storage bucket for certificates
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Users can read their own certificates
CREATE POLICY "Users can read own certificates"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'certificates' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================
-- SAMPLE DATA (COURSES)
-- ============================================

-- Insert Course 1: ChatGPT Mastery
INSERT INTO courses (
  slug,
  title,
  short_description,
  long_description,
  price_usd,
  price_cad,
  price_gbp,
  price_aud,
  price_inr,
  level,
  category,
  total_modules,
  total_hours,
  featured,
  is_published
) VALUES (
  'chatgpt-mastery',
  'ChatGPT Mastery for Professionals',
  'Master ChatGPT for business productivity, content creation, and professional communication',
  'Transform how you work with AI. This comprehensive course teaches you to leverage ChatGPT for maximum productivity, from writing compelling content to automating routine tasks. Perfect for professionals, marketers, and business owners.',
  1900, -- $19 early bird
  2500,
  1600,
  2800,
  64900,
  'beginner',
  'ai-tools',
  7,
  6,
  true,
  true
) ON CONFLICT (slug) DO NOTHING;

-- Insert Course 2: AI for Beginners
INSERT INTO courses (
  slug,
  title,
  short_description,
  long_description,
  price_usd,
  price_cad,
  price_gbp,
  price_aud,
  price_inr,
  level,
  category,
  total_modules,
  total_hours,
  featured,
  is_published
) VALUES (
  'ai-for-beginners',
  'AI for Beginners: Zero to Hero',
  'Your complete introduction to AI tools - no tech background required',
  'Start your AI journey with confidence. This beginner-friendly course introduces you to ChatGPT and essential AI tools through practical examples and easy-to-follow lessons. No technical experience needed.',
  1900, -- $19 early bird
  2500,
  1600,
  2800,
  64900,
  'beginner',
  'ai-tools',
  6,
  3,
  true,
  true
) ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ AI Learn Hub database schema created successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Copy your Supabase URL and API keys to .env.local';
  RAISE NOTICE '2. Run the course content population script';
  RAISE NOTICE '3. Test authentication flow';
  RAISE NOTICE '';
END $$;
