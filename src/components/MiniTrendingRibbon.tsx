import React from 'react';
import { Post } from '../types';

interface MiniTrendingRibbonProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
}

export const MiniTrendingRibbon: React.FC<MiniTrendingRibbonProps> = ({ posts, onSelectPost }) => {
  // Show the 4 trending mini cards
  const miniPosts = posts.filter((p) => p.isTrendingMini).slice(0, 4);

  if (miniPosts.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {miniPosts.map((post) => (
          <button
            key={post.id}
            onClick={() => onSelectPost(post)}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-[#111111] hover:bg-neutral-50 dark:hover:bg-[#181818] border border-[#E5E5E5] dark:border-[#1E1E1E] hover:border-[#CCCCCC] dark:hover:border-[#333333] shadow-xs hover:shadow-sm transition-all duration-200 text-left group"
          >
            {/* Thumbnail on Left */}
            <div className="w-16 h-14 rounded-lg overflow-hidden shrink-0 bg-[#F5F5F5] dark:bg-[#1E1E1E] relative border border-[#E5E5E5] dark:border-[#262626]">
              <img
                src={post.coverImage}
                alt={post.coverImageAlt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/10 dark:bg-black/20 group-hover:bg-transparent transition-colors" />
            </div>

            {/* Info on Right */}
            <div className="flex-1 min-w-0 pr-1">
              <p className="text-[10px] font-mono tracking-wider text-[#666666] dark:text-[#888888] uppercase truncate mb-1">
                {post.publishedAt} <span className="text-[#CCCCCC] dark:text-[#444444]">/</span> {post.author.name}
              </p>
              <h4 className="text-xs font-semibold text-[#1A1A1A] dark:text-[#EEEEEE] group-hover:text-[#34A499] dark:group-hover:text-white line-clamp-2 leading-tight transition-colors">
                {post.title}
              </h4>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
