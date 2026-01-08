-- =====================================================
-- CHAMIZA 2026: COMPREHENSIVE DATABASE FIX
-- =====================================================
-- This script fixes all RLS policies, adds missing permissions,
-- and ensures proper database setup
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- STEP 1: DROP ALL EXISTING POLICIES
-- This ensures we start fresh without conflicts
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
-- STEP 2: ENSURE RLS IS ENABLED ON ALL TABLES
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
-- STEP 3: CREATE COMPREHENSIVE RLS POLICIES
-- All operations (SELECT, INSERT, UPDATE, DELETE) allowed
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
-- STEP 4: STORAGE BUCKET SETUP FOR GALLERY
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
-- STEP 5: VERIFICATION QUERIES
-- =====================================================

-- Verify all tables exist
DO $$
BEGIN
  RAISE NOTICE 'Checking tables...';

  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'recommendations') THEN
    RAISE NOTICE '✓ recommendations table exists';
  ELSE
    RAISE EXCEPTION '✗ recommendations table is missing! Run supabase-schema.sql first';
  END IF;

  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'plans') THEN
    RAISE NOTICE '✓ plans table exists';
  ELSE
    RAISE EXCEPTION '✗ plans table is missing! Run supabase-schema.sql first';
  END IF;

  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'plan_participants') THEN
    RAISE NOTICE '✓ plan_participants table exists';
  ELSE
    RAISE EXCEPTION '✗ plan_participants table is missing! Run supabase-schema.sql first';
  END IF;

  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'places') THEN
    RAISE NOTICE '✓ places table exists';
  ELSE
    RAISE EXCEPTION '✗ places table is missing! Run supabase-schema.sql first';
  END IF;

  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'gallery_images') THEN
    RAISE NOTICE '✓ gallery_images table exists';
  ELSE
    RAISE EXCEPTION '✗ gallery_images table is missing! Run supabase-schema.sql first';
  END IF;

  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'public_chat_messages') THEN
    RAISE NOTICE '✓ public_chat_messages table exists';
  ELSE
    RAISE EXCEPTION '✗ public_chat_messages table is missing! Run database-schema.sql first';
  END IF;

  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'guest_confirmations') THEN
    RAISE NOTICE '✓ guest_confirmations table exists';
  ELSE
    RAISE EXCEPTION '✗ guest_confirmations table is missing! Run database-schema.sql first';
  END IF;

  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'family_members') THEN
    RAISE NOTICE '✓ family_members table exists';
  ELSE
    RAISE EXCEPTION '✗ family_members table is missing! Run database-schema.sql first';
  END IF;

  RAISE NOTICE '✓ All tables exist!';
  RAISE NOTICE '✓ All RLS policies have been updated successfully!';
  RAISE NOTICE '✓ Storage bucket configured!';
  RAISE NOTICE '';
  RAISE NOTICE 'Your database is now fully configured!';
END $$;
