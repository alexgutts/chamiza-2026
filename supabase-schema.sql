-- Supabase Schema for Chamiza 2026
-- Run this in the Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- RECOMMENDATIONS TABLE
-- Stores hotel/AirBnB/other accommodation recommendations
-- =====================================================
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

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_recommendations_type ON recommendations(type);
CREATE INDEX IF NOT EXISTS idx_recommendations_created_at ON recommendations(created_at DESC);

-- =====================================================
-- PLANS TABLE
-- Stores organized activities and events
-- =====================================================
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

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_plans_date ON plans(date);
CREATE INDEX IF NOT EXISTS idx_plans_created_at ON plans(created_at DESC);

-- =====================================================
-- PLAN_PARTICIPANTS TABLE
-- Stores participants for each plan
-- =====================================================
CREATE TABLE IF NOT EXISTS plan_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  participant_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- Prevent duplicate names per plan
  UNIQUE(plan_id, participant_name)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_plan_participants_plan_id ON plan_participants(plan_id);

-- =====================================================
-- PLACES TABLE
-- Stores map locations/points of interest
-- =====================================================
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

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_places_category ON places(category);
CREATE INDEX IF NOT EXISTS idx_places_created_at ON places(created_at DESC);

-- =====================================================
-- GALLERY_IMAGES TABLE
-- Stores uploaded photos
-- =====================================================
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  uploaded_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_gallery_images_created_at ON gallery_images(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Since there's no auth, we allow all operations
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required)
CREATE POLICY "Allow public read recommendations" ON recommendations FOR SELECT USING (true);
CREATE POLICY "Allow public insert recommendations" ON recommendations FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read plans" ON plans FOR SELECT USING (true);
CREATE POLICY "Allow public insert plans" ON plans FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read plan_participants" ON plan_participants FOR SELECT USING (true);
CREATE POLICY "Allow public insert plan_participants" ON plan_participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete plan_participants" ON plan_participants FOR DELETE USING (true);

CREATE POLICY "Allow public read places" ON places FOR SELECT USING (true);
CREATE POLICY "Allow public insert places" ON places FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read gallery_images" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Allow public insert gallery_images" ON gallery_images FOR INSERT WITH CHECK (true);

-- =====================================================
-- STORAGE BUCKET FOR GALLERY IMAGES
-- Run this in the Supabase dashboard or via API
-- =====================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);

-- Storage policy for public access
-- CREATE POLICY "Allow public uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery');
-- CREATE POLICY "Allow public downloads" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');

-- =====================================================
-- SEED DATA - Initial venue marker
-- =====================================================
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
