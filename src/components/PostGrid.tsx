import React, { useState } from 'react';
import { Post } from '../types';
import { ZYNIQ_CATEGORIES } from '../data/initialPosts';
import { Clock, Eye, Heart, MessageSquare, ArrowUpRight, Search, PlusCircle } from 'lucide-react';

interface PostGridProps {
  posts: Post[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectPost: (post: Post) => void;
  onOpenEditor: () => void;
  isAdmin?: boolean;
}

export const PostGrid: React.FC<PostGridProps> = ({
  posts,
  selectedCategory,
  onSelectCategory,
  onSelectPost,
  onOpenEditor,
  isAdmin = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'views' | 'likes'>('latest');

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      p.title.toLowerCase().includes(query) ||
      p.excerpt.toLowerCase().includes(query) ||
      p.tags.some((t) => t.toLowerCase().includes(query)) ||
      p.author.name.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
    if (sortBy === 'likes') return (b.likes || 0) - (a.likes || 0);
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section Title and Filter Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E5E5E5] dark:border-[#1A1A1A]">
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1A1A1A] dark:text-white tracking-tight">
            Latest Dispatches & Research
          </h3>
          <p className="text-xs text-[#666666] dark:text-[#777777] mt-1 font-mono">
            ENGINEERED COGNITION · SYSTEM ARCHITECTURE · SOVEREIGN COMPUTE
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#888888] dark:text-[#666666]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter dispatches..."
              className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#222222] focus:border-[#34A499] text-xs text-[#1A1A1A] dark:text-white pl-8 pr-3 py-1.5 rounded-lg w-44 sm:w-56 placeholder-[#888888] dark:placeholder-[#555555] focus:outline-none shadow-xs"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#222222] text-xs text-[#333333] dark:text-[#CCCCCC] px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#34A499] shadow-xs"
          >
            <option value="latest">Sort: Most Recent</option>
            <option value="views">Sort: Most Viewed</option>
            <option value="likes">Sort: Most Endorsed</option>
          </select>

          {isAdmin && (
            <button
              onClick={onOpenEditor}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#34A499] hover:bg-[#2B8A80] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Post</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Category Segmented Tabs (Clean buttons with click handlers) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {ZYNIQ_CATEGORIES.map((cat) => {
          const isActive = selectedCategory.toLowerCase() === cat.id.toLowerCase();
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors border ${
                isActive
                  ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white font-semibold shadow-xs'
                  : 'bg-white dark:bg-[#111111] text-[#666666] dark:text-[#888888] border-[#E5E5E5] dark:border-[#222222] hover:text-[#1A1A1A] dark:hover:text-white hover:border-[#CCCCCC] dark:hover:border-[#333333]'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Grid of Posts */}
      {sortedPosts.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-[#111111] rounded-2xl border border-[#E5E5E5] dark:border-[#222222] shadow-xs">
          <p className="text-sm font-mono text-[#666666] dark:text-[#888888] uppercase tracking-wider mb-2">
            No matching dispatches found
          </p>
          <p className="text-xs text-[#888888] dark:text-[#555555] max-w-sm mx-auto mb-4">
            Try adjusting your search query or select another category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              onSelectCategory('all');
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-black hover:bg-[#34A499] dark:bg-[#222222] dark:hover:bg-[#34A499] rounded-lg transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="group bg-white dark:bg-[#111111] hover:bg-neutral-50/80 dark:hover:bg-[#141414] border border-[#E5E5E5] dark:border-[#222222] hover:border-[#CCCCCC] dark:hover:border-[#383838] rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              {/* Cover Image */}
              <div className="relative h-48 w-full bg-[#F5F5F5] dark:bg-[#181818] overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.coverImageAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider uppercase text-white bg-black/60 backdrop-blur-md border border-white/10">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono text-[#CCCCCC] bg-black/60 backdrop-blur-md border border-white/10">
                    <Clock className="w-3 h-3 text-[#34A499]" />
                    <span>{post.readTime}</span>
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#666666] dark:text-[#777777] uppercase tracking-wider mb-2">
                    <span>{post.publishedAt}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.author.name}</span>
                  </div>

                  <h4 className="font-display text-base sm:text-lg font-bold text-[#1A1A1A] dark:text-white group-hover:text-[#34A499] dark:group-hover:text-[#F2F2F2] leading-snug line-clamp-2 mb-2 transition-colors">
                    {post.title}
                  </h4>

                  <p className="text-xs text-[#555555] dark:text-[#888888] line-clamp-2 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>

                {/* Footer Metrics & Affordance */}
                <div className="pt-3 border-t border-[#E5E5E5] dark:border-[#1C1C1C] flex items-center justify-between text-xs text-[#666666] dark:text-[#777777]">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{post.views}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-[#34A499]" />
                      <span>{post.likes}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.comments.length}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1 font-semibold text-[#1A1A1A] dark:text-white group-hover:text-[#34A499] transition-colors">
                    <span className="text-[11px] uppercase tracking-wider">Read</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
