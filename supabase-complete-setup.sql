-- =====================================================
-- CHAMIZA 2026: COMPLETE DATABASE SETUP
-- =====================================================
-- This script creates ALL tables and configures everything
-- Run this ONCE in your Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- STEP 1: CREATE ALL TABLES
-- =====================================================

-- RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  link TEXT,
  type TEXT NOT NULL CHECK (type IN ('hotel', 'airbnb', 'other')),
  price_range TEXT CHECK (price_range IN ('$', '$$', '$$$')),
  address TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PLANS TABLE
CREATE TABLE IF NOT EXISTS plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME,
  location TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  max_participants INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PLAN_PARTICIPANTS TABLE
CREATE TABLE IF NOT EXISTS plan_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  participant_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(plan_id, participant_name)
);

-- PLACES TABLE
CREATE TABLE IF NOT EXISTS places (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('venue', 'hotel', 'restaurant', 'attraction', 'other')),
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  google_place_id TEXT,
  added_by TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- GALLERY_IMAGES TABLE
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  uploaded_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PUBLIC_CHAT_MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public_chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- GUEST_CONFIRMATIONS TABLE
CREATE TABLE IF NOT EXISTS guest_confirmations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  guest_name TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAMILY_MEMBERS TABLE
CREATE TABLE IF NOT EXISTS family_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  second_last_name TEXT,
  mother_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
  father_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- STEP 2: CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_recommendations_type ON recommendations(type);
CREATE INDEX IF NOT EXISTS idx_recommendations_created_at ON recommendations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_plans_date ON plans(date);
CREATE INDEX IF NOT EXISTS idx_plans_created_at ON plans(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_plan_participants_plan_id ON plan_participants(plan_id);

CREATE INDEX IF NOT EXISTS idx_places_category ON places(category);
CREATE INDEX IF NOT EXISTS idx_places_created_at ON places(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_gallery_images_created_at ON gallery_images(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_public_chat_created_at ON public_chat_messages(created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_guest_confirmations_unique_name ON guest_confirmations(LOWER(guest_name));
CREATE INDEX IF NOT EXISTS idx_guest_confirmations_created_at ON guest_confirmations(created_at ASC);

CREATE INDEX IF NOT EXISTS idx_family_members_mother_id ON family_members(mother_id);
CREATE INDEX IF NOT EXISTS idx_family_members_father_id ON family_members(father_id);
CREATE INDEX IF NOT EXISTS idx_family_members_created_at ON family_members(created_at DESC);

-- =====================================================
-- STEP 3: DROP ALL EXISTING RLS POLICIES
-- =====================================================

-- Recommendations policies
DROP POLICY IF EXISTS "Allow public read recommendations" ON recommendations;
DROP POLICY IF EXISTS "Allow public insert recommendations" ON recommendations;
DROP POLICY IF EXISTS "Allow public update recommendations" ON recommendations;
DROP POLICY IF EXISTS "Allow public delete recommendations" ON recommendations;

-- Plans policies
DROP POLICY IF EXISTS "Allow public read plans" ON plans;
DROP POLICY IF EXISTS "Allow public insert plans" ON plans;
DROP POLICY IF EXISTS "Allow public update plans" ON plans;
DROP POLICY IF EXISTS "Allow public delete plans" ON plans;

-- Plan participants policies
DROP POLICY IF EXISTS "Allow public read plan_participants" ON plan_participants;
DROP POLICY IF EXISTS "Allow public insert plan_participants" ON plan_participants;
DROP POLICY IF EXISTS "Allow public update plan_participants" ON plan_participants;
DROP POLICY IF EXISTS "Allow public delete plan_participants" ON plan_participants;

-- Places policies
DROP POLICY IF EXISTS "Allow public read places" ON places;
DROP POLICY IF EXISTS "Allow public insert places" ON places;
DROP POLICY IF EXISTS "Allow public update places" ON places;
DROP POLICY IF EXISTS "Allow public delete places" ON places;

-- Gallery images policies
DROP POLICY IF EXISTS "Allow public read gallery_images" ON gallery_images;
DROP POLICY IF EXISTS "Allow public insert gallery_images" ON gallery_images;
DROP POLICY IF EXISTS "Allow public update gallery_images" ON gallery_images;
DROP POLICY IF EXISTS "Allow public delete gallery_images" ON gallery_images;

-- Public chat messages policies
DROP POLICY IF EXISTS "Allow public read public_chat_messages" ON public_chat_messages;
DROP POLICY IF EXISTS "Allow public insert public_chat_messages" ON public_chat_messages;
DROP POLICY IF EXISTS "Allow public update public_chat_messages" ON public_chat_messages;
DROP POLICY IF EXISTS "Allow public delete public_chat_messages" ON public_chat_messages;

-- Guest confirmations policies
DROP POLICY IF EXISTS "Allow public read guest_confirmations" ON guest_confirmations;
DROP POLICY IF EXISTS "Allow public insert guest_confirmations" ON guest_confirmations;
DROP POLICY IF EXISTS "Allow public update guest_confirmations" ON guest_confirmations;
DROP POLICY IF EXISTS "Allow public delete guest_confirmations" ON guest_confirmations;

-- Family members policies
DROP POLICY IF EXISTS "Allow public read family_members" ON family_members;
DROP POLICY IF EXISTS "Allow public insert family_members" ON family_members;
DROP POLICY IF EXISTS "Allow public update family_members" ON family_members;
DROP POLICY IF EXISTS "Allow public delete family_members" ON family_members;

-- =====================================================
-- STEP 4: ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 5: CREATE COMPREHENSIVE RLS POLICIES
-- All CRUD operations allowed for public access
-- =====================================================

-- RECOMMENDATIONS TABLE
CREATE POLICY "Allow public read recommendations"
  ON recommendations FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert recommendations"
  ON recommendations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update recommendations"
  ON recommendations FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete recommendations"
  ON recommendations FOR DELETE
  USING (true);

-- PLANS TABLE
CREATE POLICY "Allow public read plans"
  ON plans FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert plans"
  ON plans FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update plans"
  ON plans FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete plans"
  ON plans FOR DELETE
  USING (true);

-- PLAN_PARTICIPANTS TABLE
CREATE POLICY "Allow public read plan_participants"
  ON plan_participants FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert plan_participants"
  ON plan_participants FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update plan_participants"
  ON plan_participants FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete plan_participants"
  ON plan_participants FOR DELETE
  USING (true);

-- PLACES TABLE
CREATE POLICY "Allow public read places"
  ON places FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert places"
  ON places FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update places"
  ON places FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete places"
  ON places FOR DELETE
  USING (true);

-- GALLERY_IMAGES TABLE
CREATE POLICY "Allow public read gallery_images"
  ON gallery_images FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert gallery_images"
  ON gallery_images FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update gallery_images"
  ON gallery_images FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete gallery_images"
  ON gallery_images FOR DELETE
  USING (true);

-- PUBLIC_CHAT_MESSAGES TABLE
CREATE POLICY "Allow public read public_chat_messages"
  ON public_chat_messages FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert public_chat_messages"
  ON public_chat_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update public_chat_messages"
  ON public_chat_messages FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete public_chat_messages"
  ON public_chat_messages FOR DELETE
  USING (true);

-- GUEST_CONFIRMATIONS TABLE
CREATE POLICY "Allow public read guest_confirmations"
  ON guest_confirmations FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert guest_confirmations"
  ON guest_confirmations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update guest_confirmations"
  ON guest_confirmations FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete guest_confirmations"
  ON guest_confirmations FOR DELETE
  USING (true);

-- FAMILY_MEMBERS TABLE
CREATE POLICY "Allow public read family_members"
  ON family_members FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert family_members"
  ON family_members FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update family_members"
  ON family_members FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete family_members"
  ON family_members FOR DELETE
  USING (true);

-- =====================================================
-- STEP 6: STORAGE BUCKET SETUP FOR GALLERY
-- =====================================================

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery',
  'gallery',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public downloads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates" ON storage.objects;

-- Create storage policies for public access
CREATE POLICY "Allow public uploads"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Allow public downloads"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

CREATE POLICY "Allow public deletes"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'gallery');

CREATE POLICY "Allow public updates"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'gallery')
  WITH CHECK (bucket_id = 'gallery');

-- =====================================================
-- STEP 7: ADD SEED DATA
-- =====================================================

-- Insert initial venue marker (only if it doesn't exist)
INSERT INTO places (name, address, category, lat, lng, added_by, notes)
VALUES (
  'Hacienda San Pedro Palomeque',
  'Anillo Periferico Sur KM 4.5, Merida Yucatan',
  'venue',
  20.9226,
  -89.6524,
  'Organizadores',
  'Lugar del evento - Reunion Chamiza 2026'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- STEP 8: VERIFICATION
-- =====================================================

DO $$
DECLARE
  table_count INTEGER;
  policy_count INTEGER;
BEGIN
  -- Count tables
  SELECT COUNT(*)
  INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN (
      'recommendations',
      'plans',
      'plan_participants',
      'places',
      'gallery_images',
      'public_chat_messages',
      'guest_confirmations',
      'family_members'
    );

  -- Count RLS policies
  SELECT COUNT(*)
  INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public';

  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'CHAMIZA 2026 DATABASE SETUP COMPLETE!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '✓ Tables created: % of 8', table_count;
  RAISE NOTICE '✓ RLS policies created: %', policy_count;
  RAISE NOTICE '✓ Storage bucket configured: gallery';
  RAISE NOTICE '✓ Indexes created for performance';
  RAISE NOTICE '✓ Seed data added';
  RAISE NOTICE '';

  IF table_count < 8 THEN
    RAISE EXCEPTION '✗ ERROR: Only % of 8 tables were created!', table_count;
  END IF;

  IF policy_count < 32 THEN
    RAISE WARNING '⚠ WARNING: Expected at least 32 RLS policies, but found %', policy_count;
  END IF;

  RAISE NOTICE '🎉 Your database is ready to use!';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Test the app by adding data';
  RAISE NOTICE '2. Check browser console for any errors';
  RAISE NOTICE '3. Enjoy your event planning app!';
  RAISE NOTICE '';
END $$;
