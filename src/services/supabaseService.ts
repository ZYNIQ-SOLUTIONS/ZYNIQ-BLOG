import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Post, Comment, SupabaseConfigState } from '../types';
import { INITIAL_POSTS } from '../data/initialPosts';

const STORAGE_KEY_POSTS = 'zyniq_blog_posts_v1';
const STORAGE_KEY_CONFIG = 'zyniq_supabase_config_v1';
const STORAGE_KEY_SUBSCRIBERS = 'zyniq_newsletter_subscribers_v1';
const STORAGE_KEY_INQUIRIES = 'zyniq_contact_inquiries_v1';

let supabaseInstance: SupabaseClient | null = null;

/**
 * Determines whether editorial/admin controls ("Write Dispatch", "New Post", "Supabase Sync")
 * are enabled. By default in production builds on Netlify, the blog operates in read-only mode
 * unless VITE_ENABLE_ADMIN=true or ?admin=1 is passed (and persisted in sessionStorage).
 */
export function isAdminModeEnabled(): boolean {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === '1') {
      try {
        sessionStorage.setItem('zyniq_admin_mode', 'true');
      } catch {
        // ignore
      }
      return true;
    }
    if (params.get('admin') === '0') {
      try {
        sessionStorage.removeItem('zyniq_admin_mode');
      } catch {
        // ignore
      }
      return false;
    }
    try {
      if (sessionStorage.getItem('zyniq_admin_mode') === 'true') {
        return true;
      }
    } catch {
      // ignore
    }
  }

  if (import.meta.env.VITE_ENABLE_ADMIN === 'true') {
    return true;
  }

  return Boolean(import.meta.env.DEV);
}

export function getSupabaseConfig(): SupabaseConfigState {
  const envUrl = ((import.meta.env.VITE_SUPABASE_URL as string) || '').trim();
  const envKey = ((import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '').trim();

  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (raw) {
      const parsed = JSON.parse(raw);
      const url = (parsed.supabaseUrl || envUrl || '').trim();
      const key = (parsed.supabaseAnonKey || envKey || '').trim();
      return {
        supabaseUrl: url,
        supabaseAnonKey: key,
        isConnected: Boolean(url && key),
        isMockFallback: !Boolean(url && key),
        lastSync: parsed.lastSync,
      };
    }
  } catch {
    // fallback
  }

  return {
    supabaseUrl: envUrl,
    supabaseAnonKey: envKey,
    isConnected: Boolean(envUrl && envKey),
    isMockFallback: !Boolean(envUrl && envKey),
  };
}

export function saveSupabaseConfig(config: Partial<SupabaseConfigState>): SupabaseConfigState {
  const current = getSupabaseConfig();
  const updated: SupabaseConfigState = {
    ...current,
    ...config,
    lastSync: new Date().toISOString(),
  };

  if (updated.supabaseUrl && updated.supabaseAnonKey) {
    try {
      supabaseInstance = createClient(updated.supabaseUrl, updated.supabaseAnonKey);
      updated.isConnected = true;
      updated.isMockFallback = false;
    } catch {
      supabaseInstance = null;
      updated.isConnected = false;
      updated.isMockFallback = true;
    }
  } else {
    supabaseInstance = null;
    updated.isConnected = false;
    updated.isMockFallback = true;
  }

  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(updated));
  } catch {
    // ignore storage errors
  }

  return updated;
}

export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseInstance) {
    const cfg = getSupabaseConfig();
    if (cfg.supabaseUrl && cfg.supabaseAnonKey) {
      try {
        supabaseInstance = createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
      } catch (e) {
        console.warn('Could not initialize Supabase client:', e);
        supabaseInstance = null;
      }
    }
  }
  return supabaseInstance;
}

// Local cache storage helpers
export function getLocalPosts(): Post[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_POSTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading local posts:', e);
  }
  // Initialize with seed data
  try {
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(INITIAL_POSTS));
  } catch {
    // ignore
  }
  return INITIAL_POSTS;
}

export function saveLocalPosts(posts: Post[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
  } catch (e) {
    console.error('Error saving local posts:', e);
  }
}

function formatRelativeTime(isoDate?: string): string {
  if (!isoDate) return 'Just now';
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return isoDate;
  const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSeconds < 60) return 'Just now';
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function mapPostToSupabaseRow(post: Post) {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    tags: post.tags || [],
    cover_image: post.coverImage,
    cover_image_alt: post.coverImageAlt || post.title,
    published_at: post.publishedAt,
    read_time: post.readTime,
    views: post.views || 0,
    likes: post.likes || 0,
    is_featured: Boolean(post.isFeatured),
    is_popular: Boolean(post.isPopular),
    is_trending_mini: Boolean(post.isTrendingMini),
    author: post.author,
    seo: post.seo,
    status: post.status || 'published',
  };
}

/**
 * Seeds initial posts and comments into Supabase if the table is currently empty.
 */
export async function seedSupabasePostsIfEmpty(): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { count, error: countError } = await client
      .from('zyniq_posts')
      .select('id', { count: 'exact', head: true });

    if (countError || (count !== null && count > 0)) {
      return false;
    }

    const rows = INITIAL_POSTS.map(mapPostToSupabaseRow);
    const { error: insertError } = await client.from('zyniq_posts').upsert(rows, { onConflict: 'id' });
    if (insertError) {
      console.warn('Could not auto-seed zyniq_posts:', insertError.message);
      return false;
    }

    // Seed initial comments if any
    const commentRows = INITIAL_POSTS.flatMap((p) =>
      (p.comments || []).map((c) => ({
        id: c.id,
        post_id: p.id,
        author: c.author,
        avatar: c.avatar,
        text: c.text,
        likes: c.likes || 0,
      }))
    );

    if (commentRows.length > 0) {
      await client.from('zyniq_comments').upsert(commentRows, { onConflict: 'id' });
    }

    return true;
  } catch (err) {
    console.warn('Supabase seed check skipped:', err);
    return false;
  }
}

// Unified Data Services (Supabase + Local fallback)
export async function fetchAllPosts(): Promise<Post[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const [{ data: postsData, error: postsError }, { data: commentsData }] = await Promise.all([
        client.from('zyniq_posts').select('*').order('created_at', { ascending: false }),
        client.from('zyniq_comments').select('*').order('created_at', { ascending: false }),
      ]);

      if (!postsError && postsData && postsData.length === 0) {
        const seeded = await seedSupabasePostsIfEmpty();
        if (seeded) {
          return fetchAllPosts();
        }
      }

      if (!postsError && postsData && postsData.length > 0) {
        const commentsByPostId = new Map<string, Comment[]>();
        if (Array.isArray(commentsData)) {
          for (const c of commentsData) {
            const list = commentsByPostId.get(c.post_id) || [];
            list.push({
              id: c.id,
              author: c.author,
              avatar:
                c.avatar ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
              text: c.text,
              timestamp: formatRelativeTime(c.created_at),
              likes: c.likes || 0,
            });
            commentsByPostId.set(c.post_id, list);
          }
        }

        const mapped: Post[] = postsData.map((row: any) => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          excerpt: row.excerpt,
          content: row.content,
          category: row.category,
          tags: row.tags || [],
          coverImage: row.cover_image,
          coverImageAlt: row.cover_image_alt || row.title,
          publishedAt: row.published_at,
          readTime: row.read_time,
          views: row.views || 0,
          likes: row.likes || 0,
          isFeatured: Boolean(row.is_featured),
          isPopular: Boolean(row.is_popular),
          isTrendingMini: Boolean(row.is_trending_mini),
          author: row.author || {
            name: 'ZYNIQ Engineer',
            role: 'Systems Architect',
            avatar: '',
            handle: '@zyniq_solutions',
          },
          comments: commentsByPostId.get(row.id) || row.comments || [],
          seo: row.seo || {
            metaTitle: row.title,
            metaDescription: row.excerpt,
            keywords: [],
          },
          status: row.status || 'published',
        }));

        saveLocalPosts(mapped);
        return mapped;
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local database:', err);
    }
  }

  return getLocalPosts();
}

export async function createNewPost(
  postData: Omit<Post, 'id' | 'slug' | 'views' | 'likes' | 'comments'>
): Promise<Post> {
  const slug = postData.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  const newPost: Post = {
    ...postData,
    id: `post-${Date.now()}`,
    slug: slug || `post-${Date.now()}`,
    views: 1,
    likes: 0,
    comments: [],
    updatedAt: new Date().toISOString(),
  };

  const current = getLocalPosts();
  const updated = [newPost, ...current];
  saveLocalPosts(updated);

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('zyniq_posts').insert(mapPostToSupabaseRow(newPost));
    } catch (e) {
      console.warn('Supabase post insert failed; cached in local storage:', e);
    }
  }

  return newPost;
}

export async function updateExistingPost(post: Post): Promise<Post> {
  const current = getLocalPosts();
  const updated = current.map((p) =>
    p.id === post.id ? { ...post, updatedAt: new Date().toISOString() } : p
  );
  saveLocalPosts(updated);

  const client = getSupabaseClient();
  if (client) {
    try {
      await client
        .from('zyniq_posts')
        .update({
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          tags: post.tags,
          cover_image: post.coverImage,
          cover_image_alt: post.coverImageAlt,
          is_featured: Boolean(post.isFeatured),
          is_popular: Boolean(post.isPopular),
          is_trending_mini: Boolean(post.isTrendingMini),
          seo: post.seo,
          status: post.status,
          read_time: post.readTime,
          updated_at: new Date().toISOString(),
        })
        .eq('id', post.id);
    } catch (e) {
      console.warn('Supabase update failed; updated locally:', e);
    }
  }

  return post;
}

export async function deletePostById(id: string): Promise<boolean> {
  const current = getLocalPosts();
  const filtered = current.filter((p) => p.id !== id);
  saveLocalPosts(filtered);

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('zyniq_posts').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete failed:', e);
    }
  }
  return true;
}

export async function addCommentToPost(
  postId: string,
  commentText: string,
  authorName = 'Visitor Architect'
): Promise<Comment> {
  const comment: Comment = {
    id: `comm-${Date.now()}`,
    author: authorName,
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    text: commentText,
    timestamp: 'Just now',
    likes: 0,
  };

  const current = getLocalPosts();
  const target = current.find((p) => p.id === postId);
  if (target) {
    target.comments = [comment, ...target.comments];
    saveLocalPosts(current);
  }

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('zyniq_comments').insert({
        id: comment.id,
        post_id: postId,
        author: comment.author,
        avatar: comment.avatar,
        text: comment.text,
        likes: 0,
        created_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Supabase comment insert failed; saved locally:', e);
    }
  }

  return comment;
}

export async function incrementPostLikes(postId: string): Promise<number> {
  const current = getLocalPosts();
  const target = current.find((p) => p.id === postId);
  let newLikes = 1;
  if (target) {
    target.likes = (target.likes || 0) + 1;
    newLikes = target.likes;
    saveLocalPosts(current);
  }

  const client = getSupabaseClient();
  if (client) {
    try {
      const { data: rpcLikes, error: rpcError } = await client.rpc('increment_zyniq_post_likes', {
        target_post_id: postId,
      });
      if (!rpcError && typeof rpcLikes === 'number') {
        return rpcLikes;
      }
      await client.from('zyniq_posts').update({ likes: newLikes }).eq('id', postId);
    } catch (e) {
      console.warn('Supabase like increment fallback:', e);
    }
  }

  return newLikes;
}

export async function incrementPostViews(postId: string): Promise<number> {
  const current = getLocalPosts();
  const target = current.find((p) => p.id === postId);
  let newViews = 1;
  if (target) {
    target.views = (target.views || 0) + 1;
    newViews = target.views;
    saveLocalPosts(current);
  }

  const client = getSupabaseClient();
  if (client) {
    try {
      const { data: rpcViews, error: rpcError } = await client.rpc('increment_zyniq_post_views', {
        target_post_id: postId,
      });
      if (!rpcError && typeof rpcViews === 'number') {
        return rpcViews;
      }
      await client.from('zyniq_posts').update({ views: newViews }).eq('id', postId);
    } catch (e) {
      console.warn('Supabase view increment fallback:', e);
    }
  }

  return newViews;
}

export interface NewsletterSubscriptionResult {
  success: boolean;
  alreadySubscribed?: boolean;
  email: string;
  timestamp: string;
}

export async function subscribeToNewsletter(email: string): Promise<NewsletterSubscriptionResult> {
  const normalized = email.trim().toLowerCase();
  const timestamp = new Date().toISOString();

  let subscribers: { email: string; subscribedAt: string }[] = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SUBSCRIBERS);
    if (raw) {
      subscribers = JSON.parse(raw);
    }
  } catch {
    subscribers = [];
  }

  const exists = subscribers.some((s) => s.email === normalized);
  if (!exists) {
    subscribers.unshift({ email: normalized, subscribedAt: timestamp });
    try {
      localStorage.setItem(STORAGE_KEY_SUBSCRIBERS, JSON.stringify(subscribers));
    } catch {
      // ignore storage quota errors
    }
  }

  // Sync with API endpoint (Express in dev / Netlify Function in prod)
  try {
    await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalized, subscribedAt: timestamp }),
    });
  } catch {
    // non-blocking fallback
  }

  // Sync with Supabase if connected
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('zyniq_subscribers').upsert(
        {
          email: normalized,
          subscribed_at: timestamp,
          status: 'active',
        },
        { onConflict: 'email' }
      );
    } catch (e) {
      console.warn('Supabase newsletter subscription sync fallback:', e);
    }
  }

  return {
    success: true,
    alreadySubscribed: exists,
    email: normalized,
    timestamp,
  };
}

export interface ContactInquiryPayload {
  department: string;
  name: string;
  email: string;
  message: string;
}

export async function submitContactInquiry(payload: ContactInquiryPayload): Promise<boolean> {
  const entry = {
    id: `inq-${Date.now()}`,
    department: payload.department.trim(),
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    message: payload.message.trim(),
    created_at: new Date().toISOString(),
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY_INQUIRIES);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(entry);
    localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(list));
  } catch {
    // ignore storage errors
  }

  // Sync with API endpoint (Express / Netlify Function)
  try {
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
  } catch {
    // non-blocking fallback
  }

  // Sync with Supabase if connected
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('zyniq_inquiries').insert(entry);
    } catch (e) {
      console.warn('Supabase contact inquiry sync fallback:', e);
    }
  }

  return true;
}

export function generateSupabaseSQLSchema(): string {
  return `-- ZYNIQ Blog Supabase SQL Schema (Production Ready)
-- Run this in your Supabase SQL Editor:

-- 1. Create Posts table
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

-- 2. Create Comments table
CREATE TABLE IF NOT EXISTS zyniq_comments (
  id TEXT PRIMARY KEY,
  post_id TEXT REFERENCES zyniq_posts(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  avatar TEXT,
  text TEXT NOT NULL,
  likes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Newsletter Subscribers table
CREATE TABLE IF NOT EXISTS zyniq_subscribers (
  email TEXT PRIMARY KEY,
  status TEXT DEFAULT 'active',
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Contact Inquiries table
CREATE TABLE IF NOT EXISTS zyniq_inquiries (
  id TEXT PRIMARY KEY,
  department TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Atomic Counter Functions (Views & Likes)
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

-- 9. Post Management Policies (For initial seed / admin mode)
DROP POLICY IF EXISTS "Enable insert for all" ON zyniq_posts;
CREATE POLICY "Enable insert for all" ON zyniq_posts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for all" ON zyniq_posts;
CREATE POLICY "Enable update for all" ON zyniq_posts FOR UPDATE USING (true);
`;
}
