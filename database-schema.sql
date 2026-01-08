-- =====================================================
-- CHAMIZA 2026: Guest Management & Public Chat Schema
-- =====================================================
-- Run this SQL in your Supabase SQL Editor
-- =====================================================

-- =====================================================
-- PUBLIC_CHAT_MESSAGES TABLE
-- Stores public chat messages displayed in the banner
-- =====================================================
CREATE TABLE IF NOT EXISTS public_chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries (newest first)
CREATE INDEX IF NOT EXISTS idx_public_chat_created_at ON public_chat_messages(created_at DESC);

-- =====================================================
-- GUEST_CONFIRMATIONS TABLE
-- Stores RSVP confirmations from guests
-- =====================================================
CREATE TABLE IF NOT EXISTS guest_confirmations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  guest_name TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a unique index on lowercase guest_name to prevent duplicates (case insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS idx_guest_confirmations_unique_name ON guest_confirmations(LOWER(guest_name));

-- Index for faster queries (oldest first to show early confirmations)
CREATE INDEX IF NOT EXISTS idx_guest_confirmations_created_at ON guest_confirmations(created_at ASC);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE public_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_confirmations ENABLE ROW LEVEL SECURITY;

-- Public read access for chat messages
CREATE POLICY "Allow public read public_chat_messages" ON public_chat_messages
  FOR SELECT USING (true);

-- Public insert access for chat messages
CREATE POLICY "Allow public insert public_chat_messages" ON public_chat_messages
  FOR INSERT WITH CHECK (true);

-- Public read access for confirmations
CREATE POLICY "Allow public read guest_confirmations" ON guest_confirmations
  FOR SELECT USING (true);

-- Public insert access for confirmations
CREATE POLICY "Allow public insert guest_confirmations" ON guest_confirmations
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- FAMILY_MEMBERS TABLE
-- Stores family tree members with parent relationships
-- =====================================================
CREATE TABLE IF NOT EXISTS family_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  second_last_name TEXT,
  mother_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
  father_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_family_members_mother_id ON family_members(mother_id);
CREATE INDEX IF NOT EXISTS idx_family_members_father_id ON family_members(father_id);
CREATE INDEX IF NOT EXISTS idx_family_members_created_at ON family_members(created_at DESC);

-- Enable RLS
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

-- Public read access for family members
CREATE POLICY "Allow public read family_members" ON family_members
  FOR SELECT USING (true);

-- Public insert access for family members
CREATE POLICY "Allow public insert family_members" ON family_members
  FOR INSERT WITH CHECK (true);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify the tables were created correctly:

-- SELECT * FROM public_chat_messages;
-- SELECT * FROM guest_confirmations;
-- SELECT * FROM family_members;
