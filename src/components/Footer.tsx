import React from 'react';
import { ZyniqLogo } from './ZyniqLogo';
import { NewsletterSubscription } from './NewsletterSubscription';
import { ZYNIQ_SOCIAL_LINKS } from '../data/initialPosts';

interface FooterProps {
  onOpenBrandGuide: () => void;
  onOpenSupabase: () => void;
  onOpenSocials: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="w-full bg-white dark:bg-[#000000] text-[#1A1A1A] dark:text-[#EEEEEE] border-t border-[#E5E5E5] dark:border-[#1C1C1C] py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Subscription Section */}
        <NewsletterSubscription />

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-[#E5E5E5] dark:border-[#1A1A1A]">
          {/* Official ZYNIQ Logo */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <ZyniqLogo className="h-7 w-auto text-[#1A1A1A] dark:text-white" />
            <span className="text-[10px] font-mono tracking-widest text-[#666666] dark:text-[#777777] uppercase">
              Synthetic Intelligence Research Dispatches
            </span>
          </div>

          {/* All 8 Official Social Channels */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-mono text-[#555555] dark:text-[#888888]">
            {ZYNIQ_SOCIAL_LINKS.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#34A499] dark:hover:text-[#34A499] transition-colors"
              >
                {s.platform}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Strip: Updated Copyright with Link to ZYNIQ Studio */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#666666]">
          <p>
            &copy; 2026 ZYNIQ Blog. Created by{' '}
            <a
              href="https://zyniq.studio/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1A1A1A] dark:text-white hover:text-[#34A499] dark:hover:text-[#34A499] transition-colors underline underline-offset-4 decoration-[#34A499]/60 hover:decoration-[#34A499]"
            >
              ZYNIQ Studio
            </a>
            . All rights reserved.
          </p>

          <div className="text-[11px] text-[#777777] dark:text-[#555555]">
            Sovereign Edge Silicon &middot; Monolithic Cognitive Form Factors
          </div>
        </div>
      </div>
    </footer>
  );
};
