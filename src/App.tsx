import React, { useState, useEffect } from 'react';
import { Post } from './types';
import {
  fetchAllPosts,
  createNewPost,
  updateExistingPost,
  incrementPostViews,
  isAdminModeEnabled,
} from './services/supabaseService';
import { Navbar } from './components/Navbar';
import { MiniTrendingRibbon } from './components/MiniTrendingRibbon';
import { HeroFeatured } from './components/HeroFeatured';
import { PopularCarousel } from './components/PopularCarousel';
import { PostGrid } from './components/PostGrid';
import { PostReader } from './components/PostReader';
import { PostEditor } from './components/PostEditor';
import { BrandGuideModal } from './components/BrandGuideModal';
import { SupabaseModal } from './components/SupabaseModal';
import { ContactModal } from './components/ContactModal';
import { NewsletterSignupModal } from './components/NewsletterSignupModal';
import { SocialDrawer } from './components/SocialDrawer';
import { Footer } from './components/Footer';
import { ZyniqLoader } from './components/ZyniqLoader';
import { Search, X, ArrowUpRight } from 'lucide-react';

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isBrandGuideOpen, setIsBrandGuideOpen] = useState(false);
  const [isSupabaseOpen, setIsSupabaseOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [isSocialsOpen, setIsSocialsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [isAdmin] = useState(() => isAdminModeEnabled());
  const [showLoader, setShowLoader] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('autostart') !== '1';
    }
    return true;
  });

  // Load initial posts
  useEffect(() => {
    async function load() {
      const data = await fetchAllPosts();
      setPosts(data);
    }
    load();
  }, []);

  // Sync theme class to html root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#0A0A0A';
      document.body.style.color = '#EEEEEE';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#FFFFFF';
      document.body.style.color = '#1A1A1A';
    }
  }, [darkMode]);

  // Global keyboard shortcuts (Cmd+K for search, Escape to close modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsBrandGuideOpen(false);
        setIsSupabaseOpen(false);
        setIsContactOpen(false);
        setIsNewsletterOpen(false);
        setIsSocialsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectPost = (post: Post) => {
    setSelectedPost(post);
    setIsEditorOpen(false);
    setIsSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    incrementPostViews(post.id).then((updatedViews) => {
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, views: updatedViews } : p))
      );
      setSelectedPost((curr) => (curr && curr.id === post.id ? { ...curr, views: updatedViews } : curr));
    });
  };

  const handleNavigateHome = () => {
    setSelectedPost(null);
    setIsEditorOpen(false);
    setSelectedCategory('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEditorForNew = () => {
    setEditingPost(null);
    setIsEditorOpen(true);
    setSelectedPost(null);
  };

  const handleSavePost = async (postData: any) => {
    if (editingPost) {
      const updated = await updateExistingPost({
        ...editingPost,
        ...postData,
      });
      setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setSelectedPost(updated);
    } else {
      const created = await createNewPost(postData);
      setPosts((prev) => [created, ...prev]);
      setSelectedPost(created);
    }
    setIsEditorOpen(false);
  };

  // Filtered search results
  const searchResults = searchQuery.trim()
    ? posts.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.author.name.toLowerCase().includes(q)
        );
      })
    : [];

  const featuredPosts = posts.filter((p) => p.isFeatured || p.isPopular);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-[#0A0A0A] text-[#EEEEEE]' : 'bg-[#FFFFFF] text-[#1A1A1A]'} transition-colors duration-200 flex flex-col font-sans`}>
      {/* ZYNIQ Boot Loader */}
      {showLoader && (
        <ZyniqLoader onFinish={() => setShowLoader(false)} />
      )}

      {/* Top Header / Navigation */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenEditor={handleOpenEditorForNew}
        onOpenBrandGuide={() => setIsBrandGuideOpen(true)}
        onOpenSupabase={() => setIsSupabaseOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenNewsletter={() => setIsNewsletterOpen(true)}
        onOpenSocials={() => setIsSocialsOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSelectedPost(null);
          setIsEditorOpen(false);
        }}
        activeView={isEditorOpen ? 'editor' : selectedPost ? 'reader' : 'home'}
        onNavigateHome={handleNavigateHome}
        isAdmin={isAdmin}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {isEditorOpen ? (
          <PostEditor
            initialPost={editingPost}
            onSave={handleSavePost}
            onCancel={() => setIsEditorOpen(false)}
          />
        ) : selectedPost ? (
          <PostReader
            post={selectedPost}
            allPosts={posts}
            onBack={handleNavigateHome}
            onSelectRelated={handleSelectPost}
          />
        ) : (
          <div className="space-y-2 pb-16">
            {/* 1. Mini Trending Ribbon Strip (4 compact cards matching reference) */}
            <MiniTrendingRibbon posts={posts} onSelectPost={handleSelectPost} />

            {/* 2. Massive Featured Hero (Carousel matching reference) */}
            <HeroFeatured
              featuredPosts={featuredPosts.length > 0 ? featuredPosts : posts.slice(0, 3)}
              onSelectPost={handleSelectPost}
            />

            {/* 3. Most Popular Carousel (Matching reference) */}
            <PopularCarousel posts={posts} onSelectPost={handleSelectPost} />

            {/* 4. Complete Dispatches Grid with Category tabs & search */}
            <PostGrid
              posts={posts}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onSelectPost={handleSelectPost}
              onOpenEditor={handleOpenEditorForNew}
              isAdmin={isAdmin}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenBrandGuide={() => setIsBrandGuideOpen(true)}
        onOpenSupabase={() => setIsSupabaseOpen(true)}
        onOpenSocials={() => setIsSocialsOpen(true)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSelectedPost(null);
          setIsEditorOpen(false);
        }}
      />

      {/* Modals & Drawers */}
      <BrandGuideModal
        isOpen={isBrandGuideOpen}
        onClose={() => setIsBrandGuideOpen(false)}
      />

      <SupabaseModal
        isOpen={isSupabaseOpen}
        onClose={() => setIsSupabaseOpen(false)}
        onSyncComplete={async () => {
          const fresh = await fetchAllPosts();
          setPosts(fresh);
        }}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <NewsletterSignupModal
        isOpen={isNewsletterOpen}
        onClose={() => setIsNewsletterOpen(false)}
      />

      <SocialDrawer
        isOpen={isSocialsOpen}
        onClose={() => setIsSocialsOpen(false)}
      />

      {/* Spotlight Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="relative w-full max-w-xl bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#222222] rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-[#E5E5E5] dark:border-[#202020] flex items-center gap-3">
              <Search className="w-4 h-4 text-[#34A499]" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all dispatches, authors, tags..."
                className="w-full bg-transparent text-sm text-[#1A1A1A] dark:text-white focus:outline-none placeholder-[#888888] dark:placeholder-[#555555]"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 text-[#777777] hover:text-black dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {searchQuery.trim() === '' ? (
                <div className="p-4 text-center text-xs font-mono text-[#777777] dark:text-[#666666]">
                  Type keywords to search ZYNIQ research dispatches...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs font-mono text-[#777777] dark:text-[#666666]">
                  No matching research records found for "{searchQuery}".
                </div>
              ) : (
                <div className="space-y-1">
                  {searchResults.map((post) => (
                    <button
                      key={post.id}
                      onClick={() => handleSelectPost(post)}
                      className="w-full text-left p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-[#1A1A1A] transition-colors flex items-center justify-between group"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] font-mono text-[#34A499] uppercase">
                          {post.category}
                        </span>
                        <h4 className="text-xs font-bold text-[#111111] dark:text-white group-hover:text-[#34A499] transition-colors truncate">
                          {post.title}
                        </h4>
                        <p className="text-[11px] text-[#666666] dark:text-[#777777] truncate">
                          {post.excerpt}
                        </p>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#888888] dark:text-[#555555] group-hover:text-[#34A499] dark:group-hover:text-white shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Floating Replay Loader Control */}
      {!showLoader && (
        <button
          onClick={() => setShowLoader(true)}
          className="fixed bottom-4 left-4 z-40 bg-white/90 dark:bg-[#111111]/85 hover:bg-white dark:hover:bg-[#1A1A1A] border border-[#E5E5E7] dark:border-[#262626] hover:border-[#34A499] text-[10px] font-mono text-[#555555] dark:text-[#888888] hover:text-black dark:hover:text-white px-3 py-1.5 rounded-full transition-colors backdrop-blur flex items-center gap-1.5 shadow-md group"
          title="Replay ZYNIQ Boot Sequence"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#34A499] group-hover:animate-ping" />
          <span>Replay Boot</span>
        </button>
      )}
    </div>
  );
}
