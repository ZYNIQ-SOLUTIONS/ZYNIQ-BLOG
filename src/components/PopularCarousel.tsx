import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Clock, ArrowUpRight } from 'lucide-react';
import { Post } from '../types';

interface PopularCarouselProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
}

export const PopularCarousel: React.FC<PopularCarouselProps> = ({ posts, onSelectPost }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const popularPosts = posts.filter((p) => p.isPopular || p.views > 900);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (popularPosts.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section Header Matching Reference ("Most Popular" + Circular Arrows on Right) */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1A1A1A] dark:text-white tracking-tight">
            Most Popular
          </h3>
          <span className="text-xs font-mono text-[#666666] dark:text-[#777777] uppercase tracking-wider">
            ({popularPosts.length} Insights)
          </span>
        </div>

        {/* Circular Prev / Next navigation arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll popular left"
            className="w-8 h-8 rounded-full bg-white dark:bg-[#161616] hover:bg-neutral-100 dark:hover:bg-[#222222] text-[#333333] dark:text-[#CCCCCC] hover:text-[#1A1A1A] dark:hover:text-white flex items-center justify-center border border-[#E5E5E5] dark:border-[#262626] shadow-xs transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll popular right"
            className="w-8 h-8 rounded-full bg-white dark:bg-[#161616] hover:bg-neutral-100 dark:hover:bg-[#222222] text-[#333333] dark:text-[#CCCCCC] hover:text-[#1A1A1A] dark:hover:text-white flex items-center justify-center border border-[#E5E5E5] dark:border-[#262626] shadow-xs transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Cards List (Matching screenshot) */}
      <div
        ref={scrollContainerRef}
        className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin scrollbar-thumb-[#CCCCCC] dark:scrollbar-thumb-[#222222] scrollbar-track-transparent select-none"
        style={{ scrollbarWidth: 'thin' }}
      >
        {popularPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => onSelectPost(post)}
            className="group shrink-0 w-[280px] sm:w-[320px] rounded-2xl overflow-hidden bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#222222] hover:border-[#CCCCCC] dark:hover:border-[#3A3A3A] shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer snap-start flex flex-col"
          >
            {/* Card Thumbnail Container */}
            <div className="relative h-48 w-full bg-[#F5F5F5] dark:bg-[#181818] overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.coverImageAlt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Badges on Thumbnail (Category on Left, Read Time on Right) */}
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

            {/* Card Body */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-mono text-[#777777] dark:text-[#777777] uppercase tracking-wider mb-1.5">
                  {post.publishedAt} · {post.views.toLocaleString()} VIEWS
                </p>
                <h4 className="font-display text-base font-bold text-[#1A1A1A] dark:text-white group-hover:text-[#34A499] dark:group-hover:text-[#F0F0F0] line-clamp-2 leading-snug mb-2 transition-colors">
                  {post.title}
                </h4>
                <p className="text-xs text-[#555555] dark:text-[#888888] line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              {/* Author & Action */}
              <div className="mt-4 pt-3 border-t border-[#E5E5E5] dark:border-[#1C1C1C] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#34A499]/15 text-[#34A499] text-[10px] font-mono flex items-center justify-center font-bold">
                    {post.author.name.charAt(0)}
                  </span>
                  <span className="text-[#444444] dark:text-[#AAAAAA] truncate max-w-[140px] font-medium">
                    {post.author.name}
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#777777] group-hover:text-[#34A499] transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
