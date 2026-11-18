-- =============================================================================
-- ZYNIQ Blog — Supabase Production Schema & Initial Seed Migration
-- Run this script in your Supabase SQL Editor to provision all tables,
-- atomic counter functions, Row Level Security (RLS) policies, and seed data.
-- =============================================================================

-- 1. Create Posts Table
CREATE TABLE IF NOT EXISTS zyniq_posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  cover_image TEXT,
  cover_image_alt TEXT,
  published_at TEXT NOT NULL,
  read_time TEXT DEFAULT '4 MINS READ',
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_popular BOOLEAN DEFAULT FALSE,
  is_trending_mini BOOLEAN DEFAULT FALSE,
  author JSONB,
  seo JSONB,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Comments Table
CREATE TABLE IF NOT EXISTS zyniq_comments (
  id TEXT PRIMARY KEY,
  post_id TEXT REFERENCES zyniq_posts(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  avatar TEXT,
  text TEXT NOT NULL,
  likes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS zyniq_subscribers (
  email TEXT PRIMARY KEY,
  status TEXT DEFAULT 'active',
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Contact Inquiries Table
CREATE TABLE IF NOT EXISTS zyniq_inquiries (
  id TEXT PRIMARY KEY,
  department TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Atomic Counter RPC Functions for Likes & Views
CREATE OR REPLACE FUNCTION increment_zyniq_post_likes(target_post_id TEXT)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_likes INT;
BEGIN
  UPDATE zyniq_posts
  SET likes = COALESCE(likes, 0) + 1
  WHERE id = target_post_id
  RETURNING likes INTO updated_likes;
  RETURN updated_likes;
END;
$$;

CREATE OR REPLACE FUNCTION increment_zyniq_post_views(target_post_id TEXT)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_views INT;
BEGIN
  UPDATE zyniq_posts
  SET views = COALESCE(views, 0) + 1
  WHERE id = target_post_id
  RETURNING views INTO updated_views;
  RETURN updated_views;
END;
$$;

-- 6. Enable Row Level Security (RLS)
ALTER TABLE zyniq_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE zyniq_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE zyniq_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE zyniq_inquiries ENABLE ROW LEVEL SECURITY;

-- 7. Public Read Policies
DROP POLICY IF EXISTS "Public read posts" ON zyniq_posts;
CREATE POLICY "Public read posts" ON zyniq_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read comments" ON zyniq_comments;
CREATE POLICY "Public read comments" ON zyniq_comments FOR SELECT USING (true);

-- 8. Public Interaction Policies
DROP POLICY IF EXISTS "Enable insert comments" ON zyniq_comments;
CREATE POLICY "Enable insert comments" ON zyniq_comments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable insert subscribers" ON zyniq_subscribers;
CREATE POLICY "Enable insert subscribers" ON zyniq_subscribers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update subscribers" ON zyniq_subscribers;
CREATE POLICY "Enable update subscribers" ON zyniq_subscribers FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Enable insert inquiries" ON zyniq_inquiries;
CREATE POLICY "Enable insert inquiries" ON zyniq_inquiries FOR INSERT WITH CHECK (true);

-- 9. Post Management Policies (Supports initial seed & admin mode)
DROP POLICY IF EXISTS "Enable insert for all" ON zyniq_posts;
CREATE POLICY "Enable insert for all" ON zyniq_posts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for all" ON zyniq_posts;
CREATE POLICY "Enable update for all" ON zyniq_posts FOR UPDATE USING (true);
