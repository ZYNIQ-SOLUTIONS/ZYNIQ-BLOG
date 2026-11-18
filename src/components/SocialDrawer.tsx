import React from 'react';
import { X, ExternalLink, Share2 } from 'lucide-react';
import { ZYNIQ_SOCIAL_LINKS } from '../data/initialPosts';

interface SocialDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SocialDrawer: React.FC<SocialDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0F0F0F] border border-[#E5E5E5] dark:border-[#222222] rounded-3xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 bg-white dark:bg-[#141414] border-b border-[#E5E5E5] dark:border-[#202020] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#34A499]" />
            <h3 className="font-display text-base font-bold text-[#1A1A1A] dark:text-white">
              Official ZYNIQ Syndication & Socials
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#777777] hover:text-[#1A1A1A] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#222222] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <p className="text-xs text-[#666666] dark:text-[#888888] font-mono mb-4">
            Connect across all 8 verified ZYNIQ channels for daily research dispatches, code releases, live architectural reviews, and community access.
          </p>

          <div className="space-y-2.5">
            {ZYNIQ_SOCIAL_LINKS.map((item) => (
              <a
                key={item.platform}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3.5 rounded-xl bg-[#FAFAFA] dark:bg-[#141414] hover:bg-neutral-100 dark:hover:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#222222] hover:border-[#34A499]/50 transition-all shadow-xs"
              >
                <div>
                  <h4 className="text-sm font-bold text-[#1A1A1A] dark:text-white group-hover:text-[#34A499] transition-colors">
                    {item.platform}
                  </h4>
                  <p className="text-[11px] font-mono text-[#666666] dark:text-[#777777]">{item.handle}</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#777777] dark:text-[#888888] group-hover:text-[#1A1A1A] dark:group-hover:text-white transition-colors">
                  <span className="hidden sm:inline">Follow</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#34A499]" />
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 bg-white dark:bg-[#141414] border-t border-[#E5E5E5] dark:border-[#202020] text-center">
          <p className="text-[11px] font-mono text-[#777777] dark:text-[#666666]">
            ZYNIQ SOLUTIONS · SYNTHETIC INTELLIGENCE ARCHITECTURE
          </p>
        </div>
      </div>
    </div>
  );
};
