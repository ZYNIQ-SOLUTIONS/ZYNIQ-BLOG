import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Eye, MessageSquare, ArrowUpRight } from 'lucide-react';
import { Post } from '../types';

interface HeroFeaturedProps {
  featuredPosts: Post[];
  onSelectPost: (post: Post) => void;
}

export const HeroFeatured: React.FC<HeroFeaturedProps> = ({ featuredPosts, onSelectPost }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!featuredPosts || featuredPosts.length === 0) return null;

  const currentPost = featuredPosts[currentIndex] || featuredPosts[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? featuredPosts.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === featuredPosts.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div
        onClick={() => onSelectPost(currentPost)}
        className="group relative w-full h-[420px] sm:h-[480px] lg:h-[560px] rounded-3xl overflow-hidden cursor-pointer select-none border border-[#E5E5E5] dark:border-[#222222] shadow-xl dark:shadow-2xl transition-all duration-300"
      >
        {/* Cover Background Image */}
        <div className="absolute inset-0 bg-[#0A0A0A]">
          <img
            src={currentPost.coverImage}
            alt={currentPost.coverImageAlt}
            className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            referrerPolicy="no-referrer"
          />
          {/* Measured multi-stop dark contrast scrim matching reference */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/30" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60" />
        </div>

        {/* Top Badges (Category on Left, Read Time on Right) */}
        <div className="absolute top-5 left-6 right-6 flex items-center justify-between z-10">
          <span className="px-3.5 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase text-white bg-white/10 backdrop-blur-md border border-white/15">
            {currentPost.category}
          </span>

          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono text-[#CCCCCC] bg-black/40 backdrop-blur-md border border-white/10">
            <Clock className="w-3.5 h-3.5 text-[#34A499]" />
            <span>{currentPost.readTime}</span>
          </span>
        </div>

        {/* Prev / Next Carousel Arrow Buttons (Floating on left & right matching reference) */}
        <div className="absolute inset-y-0 left-4 flex items-center z-20">
          <button
            onClick={handlePrev}
            aria-label="Previous featured article"
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-[#34A499] text-white backdrop-blur-md flex items-center justify-center border border-white/10 transition-colors shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute inset-y-0 right-4 flex items-center z-20">
          <button
            onClick={handleNext}
            aria-label="Next featured article"
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-[#34A499] text-white backdrop-blur-md flex items-center justify-center border border-white/10 transition-colors shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Overlay Content Matching Reference */}
        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 z-10 flex flex-col justify-end">
          {/* Metadata Row: Date / Author / Views / Comments */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono text-[#AAAAAA] mb-3">
            <span className="uppercase text-white/90 font-medium">{currentPost.publishedAt}</span>
            <span className="text-[#555555]">·</span>
            <span>POST BY {currentPost.author.name.toUpperCase()}</span>
            <span className="text-[#555555]">·</span>
            <span className="flex items-center gap-1 text-[#CCCCCC]">
              <Eye className="w-3.5 h-3.5 text-[#888888]" />
              <span>{currentPost.views.toLocaleString()} VIEWS</span>
            </span>
            <span className="text-[#555555]">·</span>
            <span className="flex items-center gap-1 text-[#CCCCCC]">
              <MessageSquare className="w-3.5 h-3.5 text-[#888888]" />
              <span>{currentPost.comments.length || 12} COMMENTS</span>
            </span>
          </div>

          {/* Huge Display Headline */}
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15] max-w-4xl mb-3 text-balance group-hover:text-[#F5F5F5] transition-colors">
            {currentPost.title}
          </h2>

          {/* Excerpt line */}
          <p className="text-sm sm:text-base text-[#AAAAAA] line-clamp-2 max-w-3xl leading-relaxed mb-4">
            {currentPost.excerpt}
          </p>

          {/* Read CTA with ZYNIQ accent indicator */}
          <div className="flex items-center gap-2 text-xs font-semibold text-white tracking-wider uppercase group-hover:text-[#34A499] transition-colors">
            <span>Read Research Dispatch</span>
            <ArrowUpRight className="w-4 h-4 text-[#34A499] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Slide indicators at bottom center */}
        {featuredPosts.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {featuredPosts.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-6 bg-[#34A499]' : 'w-1.5 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
