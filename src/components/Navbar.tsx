import React, { useState } from 'react';
import {
  Search,
  Menu,
  X,
  Share2,
  BookOpen,
  PenTool,
  Database,
  ChevronDown,
  Mail
} from 'lucide-react';
import { ZyniqLogo } from './ZyniqLogo';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenEditor: () => void;
  onOpenBrandGuide: () => void;
  onOpenSupabase: () => void;
  onOpenContact: () => void;
  onOpenNewsletter: () => void;
  onOpenSocials: () => void;
  onOpenSearch: () => void;
  onSelectCategory: (category: string) => void;
  activeView: string;
  onNavigateHome: () => void;
  isAdmin?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenEditor,
  onOpenBrandGuide,
  onOpenSupabase,
  onOpenContact,
  onOpenNewsletter,
  onOpenSocials,
  onOpenSearch,
  onSelectCategory,
  activeView,
  onNavigateHome,
  isAdmin = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  const categories = [
    { label: 'Synthetic IQ', cat: 'SYNTHETIC IQ' },
    { label: 'ZYNIQ Core', cat: 'CORE' },
    { label: 'ZYNIQ Studio', cat: 'STUDIO' },
    { label: 'ZYNIQ Cloud', cat: 'CLOUD' },
    { label: 'Quantum Systems', cat: 'QUANTUM' },
  ];

  return (
    <header className="w-full bg-[#FFFFFF]/95 dark:bg-[#000000] text-[#1A1A1A] dark:text-white border-b border-[#E5E5E5] dark:border-[#1A1A1A] sticky top-0 z-40 backdrop-blur-md transition-colors duration-200">
      {/* Zone 1: Top Utility & Brand Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between border-b border-[#E5E5E5] dark:border-[#161616]">
        {/* Left: Social Media Icons */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 text-[#666666] dark:text-[#888888]">
            <a
              href="https://x.com/zyniq_solutions"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ZYNIQ on X / Twitter"
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/company/zyniq-solutions"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ZYNIQ on LinkedIn"
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.94 0 1.7-.76 1.7-1.7s-.76-1.7-1.7-1.7-1.7.76-1.7 1.7.76 1.7 1.7 1.7m1.39 9.74v-8.37H5.07v8.37h2.78z" />
              </svg>
            </a>
            <a
              href="https://github.com/ZYNIQ-AI-Driven-Development-Firm"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ZYNIQ on GitHub"
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/zyniq_solutions/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ZYNIQ on Instagram"
              className="hover:text-black dark:hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
          <button
            onClick={onOpenSocials}
            className="text-xs text-[#555555] dark:text-[#777777] hover:text-[#1A1A1A] dark:hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#222222] transition-colors"
            title="View all 8 official ZYNIQ channels"
          >
            <Share2 className="w-3 h-3 text-[#34A499]" />
            <span className="hidden sm:inline">All Channels</span>
          </button>
        </div>

        {/* Center: Brand Wordmark (DROZY-style prominent branding with adaptive fill) */}
        <div
          className="flex items-center gap-2 cursor-pointer py-1 group"
          onClick={onNavigateHome}
          title="ZYNIQ Blog Home"
        >
          <ZyniqLogo className="h-5 sm:h-6 w-auto text-[#1A1A1A] dark:text-white transition-transform group-hover:scale-105" />
        </div>

        {/* Right: Theme Toggle & Let's Talk CTA */}
        <div className="flex items-center gap-3">
          {/* Light / Dark Mode switch */}
          <div className="flex items-center gap-1.5 text-xs text-[#777777] select-none">
            <span className={!darkMode ? 'text-black font-semibold' : 'text-[#888888]'}>Light</span>
            <button
              onClick={onToggleDarkMode}
              aria-label="Toggle theme mode"
              className="w-10 h-5 bg-[#E2E2E6] dark:bg-[#222222] rounded-full p-0.5 flex items-center transition-colors focus:outline-none border border-[#CECED4] dark:border-[#333333]"
            >
              <div
                className={`w-4 h-4 rounded-full transition-transform ${
                  darkMode ? 'translate-x-5 bg-[#34A499]' : 'translate-x-0 bg-white shadow-sm'
                }`}
              />
            </button>
            <span className={darkMode ? 'text-white font-semibold' : 'text-[#888888]'}>Dark</span>
          </div>

          {/* Let's Talk! Button */}
          <button
            onClick={onOpenContact}
            className="hidden sm:inline-flex items-center justify-center px-4 py-1.5 text-xs font-semibold bg-black text-white dark:bg-white dark:text-black rounded-full hover:bg-[#34A499] hover:text-white dark:hover:bg-[#34A499] dark:hover:text-white transition-colors duration-200 shadow-sm"
          >
            Let's Talk!
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-1.5 text-[#666666] dark:text-[#888888] hover:text-black dark:hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Zone 2: Navigation Links Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between text-xs font-medium text-[#555555] dark:text-[#AAAAAA]">
        <nav className="hidden sm:flex items-center gap-6">
          <button
            onClick={onNavigateHome}
            className={`hover:text-black dark:hover:text-white transition-colors pb-0.5 flex items-center gap-1 ${
              activeView === 'home' ? 'text-black dark:text-white border-b-2 border-[#34A499] font-semibold' : ''
            }`}
          >
            Home
          </button>

          <div className="relative">
            <button
              onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
              className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1 focus:outline-none"
            >
              <span>Categories</span>
              <ChevronDown className="w-3 h-3 text-[#777777]" />
            </button>

            {categoriesDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#222222] rounded-xl shadow-2xl py-2 z-50">
                {categories.map((c) => (
                  <button
                    key={c.cat}
                    onClick={() => {
                      onSelectCategory(c.cat);
                      setCategoriesDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-[#333333] hover:text-black hover:bg-[#F4F4F6] dark:text-[#CCCCCC] dark:hover:text-white dark:hover:bg-[#1A1A1A] transition-colors"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onOpenBrandGuide}
            className={`hover:text-black dark:hover:text-white transition-colors flex items-center gap-1 ${
              activeView === 'brand' ? 'text-black dark:text-white border-b-2 border-[#34A499] font-semibold' : ''
            }`}
          >
            <span>Brand Identity</span>
          </button>

          {isAdmin && (
            <>
              <button
                onClick={onOpenEditor}
                className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1 text-[#34A499] font-semibold"
              >
                <PenTool className="w-3 h-3" />
                <span>Write Dispatch</span>
              </button>

              <button
                onClick={onOpenSupabase}
                className="transition-colors flex items-center gap-1 text-[#059669] dark:text-[#00E599] hover:opacity-80"
                title="Configure Supabase cloud backend & Auth"
              >
                <Database className="w-3 h-3" />
                <span>Supabase Sync</span>
              </button>
            </>
          )}

          <button
            onClick={onOpenNewsletter}
            className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Mail className="w-3 h-3 text-[#34A499]" />
            <span>Newsletter</span>
          </button>

          <button
            onClick={onOpenContact}
            className="hover:text-black dark:hover:text-white transition-colors"
          >
            Contact
          </button>
        </nav>

        {/* Search button on far right */}
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={onOpenSearch}
            aria-label="Search articles"
            className="flex items-center gap-2 text-[#666666] hover:text-black dark:text-[#777777] dark:hover:text-white p-1 rounded transition-colors"
          >
            <Search className="w-4 h-4" />
            <span className="hidden md:inline text-xs text-[#777777] dark:text-[#666666]">Search...</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-[#0A0A0A] border-t border-[#E5E5E7] dark:border-[#222222] px-4 py-4 space-y-3 shadow-lg">
          <button
            onClick={() => {
              onNavigateHome();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm text-[#111111] dark:text-white font-medium"
          >
            Home
          </button>
          <div className="pt-2 border-t border-[#ECECEE] dark:border-[#1A1A1A]">
            <p className="text-[11px] font-mono text-[#888888] dark:text-[#777777] uppercase tracking-wider mb-2">Departments</p>
            {categories.map((c) => (
              <button
                key={c.cat}
                onClick={() => {
                  onSelectCategory(c.cat);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-1 text-sm text-[#333333] hover:text-[#34A499] dark:text-[#CCCCCC] dark:hover:text-[#34A499]"
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="pt-2 border-t border-[#ECECEE] dark:border-[#1A1A1A] flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenBrandGuide();
                setMobileMenuOpen(false);
              }}
              className="text-left text-sm text-[#111111] dark:text-white py-1 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-[#34A499]" />
              Brand Identity Guide
            </button>
            {isAdmin && (
              <>
                <button
                  onClick={() => {
                    onOpenEditor();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-sm text-[#34A499] py-1 flex items-center gap-2"
                >
                  <PenTool className="w-4 h-4" />
                  Write Dispatch
                </button>
                <button
                  onClick={() => {
                    onOpenSupabase();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-sm text-[#059669] dark:text-[#00E599] py-1 flex items-center gap-2"
                >
                  <Database className="w-4 h-4" />
                  Supabase Backend
                </button>
              </>
            )}
            <button
              onClick={() => {
                onOpenNewsletter();
                setMobileMenuOpen(false);
              }}
              className="text-left text-sm text-[#111111] dark:text-white py-1 flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-[#34A499]" />
              Newsletter
            </button>
            <button
              onClick={() => {
                onOpenContact();
                setMobileMenuOpen(false);
              }}
              className="w-full text-center mt-2 py-2 text-xs font-semibold bg-black text-white dark:bg-white dark:text-black rounded-full"
            >
              Let's Talk!
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
