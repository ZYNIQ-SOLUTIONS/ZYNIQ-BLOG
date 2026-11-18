export interface Author {
  name: string;
  role: string;
  avatar: string;
  handle: string;
}

export interface PostSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
  structuredType?: 'BlogPosting' | 'TechArticle';
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  coverImage: string;
  coverImageAlt: string;
  publishedAt: string;
  readTime: string;
  views: number;
  likes: number;
  isFeatured?: boolean;
  isPopular?: boolean;
  isTrendingMini?: boolean;
  author: Author;
  comments: Comment[];
  seo: PostSEO;
  status: 'published' | 'draft';
  updatedAt?: string;
}

export interface SEOCheckResult {
  score: number; // 0-100
  titleLength: number;
  titleStatus: 'optimal' | 'warning' | 'critical';
  descLength: number;
  descStatus: 'optimal' | 'warning' | 'critical';
  wordCount: number;
  readTimeMinutes: number;
  headingsCount: { h1: number; h2: number; h3: number };
  keywordDensity: { keyword: string; count: number; percentage: number }[];
  suggestions: string[];
  readabilityLevel: string;
}

export interface SupabaseConfigState {
  supabaseUrl: string;
  supabaseAnonKey: string;
  isConnected: boolean;
  isMockFallback: boolean;
  lastSync?: string;
}
