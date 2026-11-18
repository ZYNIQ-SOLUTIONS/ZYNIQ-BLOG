import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Post, Comment } from '../types';
import {
  ArrowLeft,
  Clock,
  Eye,
  Heart,
  Share2,
  Check,
  Copy,
  MessageSquare,
  Sparkles,
  Send,
  ExternalLink
} from 'lucide-react';
import { incrementPostLikes, addCommentToPost } from '../services/supabaseService';
import { calculateReadingTime, calculateArticleScrollProgress } from '../utils/readingTime';

interface PostReaderProps {
  post: Post;
  allPosts: Post[];
  onBack: () => void;
  onSelectRelated: (post: Post) => void;
}

export const PostReader: React.FC<PostReaderProps> = ({
  post,
  allPosts,
  onBack,
  onSelectRelated,
}) => {
  const [likes, setLikes] = useState(post.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [newCommentText, setNewCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const articleRef = useRef<HTMLElement>(null);

  // Dynamically calculate estimated reading time based on article word count
  const readingStats = useMemo(
    () => calculateReadingTime(`${post.title || ''} ${post.excerpt || ''} ${post.content || ''}`),
    [post.title, post.excerpt, post.content]
  );

  // Calculate dynamic reading progress as the user scrolls through the article
  useEffect(() => {
    let rafId: number | null = null;

    const computeProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const articleEl = articleRef.current;

      if (articleEl) {
        const rect = articleEl.getBoundingClientRect();
        const articleTop = rect.top + scrollTop;
        const articleHeight = articleEl.offsetHeight;
        setReadingProgress(
          calculateArticleScrollProgress(scrollTop, articleTop, articleHeight, viewportHeight)
        );
      } else {
        const docHeight =
          Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight
          ) - viewportHeight;
        setReadingProgress(
          docHeight <= 0 ? 100 : Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
        );
      }
      rafId = null;
    };

    const handleScrollOrResize = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(computeProgress);
      }
    };

    computeProgress();
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [post.id, comments.length]);

  // Sync state if post changes
  useEffect(() => {
    setLikes(post.likes || 0);
    setComments(post.comments || []);
    setHasLiked(false);
    setReadingProgress(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [post.id]);

  const handleLike = async () => {
    if (hasLiked) return;
    setHasLiked(true);
    setLikes((prev) => prev + 1);
    await incrementPostLikes(post.id);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const added = await addCommentToPost(
      post.id,
      newCommentText.trim(),
      authorName.trim() || 'Visiting Architect'
    );
    setComments((prev) => [added, ...prev]);
    setNewCommentText('');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Extract table of contents from content
  const headings = (post.content.match(/^#{1,3}\s+[^\n]+/gm) || []).map((h) => {
    const level = h.startsWith('###') ? 3 : h.startsWith('##') ? 2 : 1;
    const text = h.replace(/^#{1,3}\s+/, '');
    return { level, text };
  });

  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && (p.category === post.category || p.isPopular))
    .slice(0, 3);

  return (
    <article
      ref={articleRef}
      className="relative min-h-screen bg-[#FFFFFF] dark:bg-[#0A0A0A] text-[#1A1A1A] dark:text-[#EEEEEE] pb-24 transition-colors"
    >
      {/* Subtle, Thin Reading Progress Bar at Top of Viewport */}
      <div
        role="progressbar"
        aria-label="Article reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(readingProgress)}
        className="fixed top-0 left-0 right-0 h-[3px] bg-black/5 dark:bg-white/5 z-[70] pointer-events-none overflow-hidden"
      >
        <div
          className="h-full bg-[#34A499] shadow-[0_0_8px_rgba(52,164,153,0.45)] transition-[width] duration-100 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Sub-header navigation & action toolbar */}
      <div className="sticky top-12 z-30 bg-[#FFFFFF]/95 dark:bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#E5E5E5] dark:border-[#1A1A1A]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#555555] dark:text-[#AAAAAA] hover:text-[#1A1A1A] dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#34A499]" />
            <span>Back to All Dispatches</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono text-[#1A1A1A] dark:text-[#CCCCCC] bg-[#FAFAFA] dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#222222]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34A499]" />
              <span>{Math.round(readingProgress)}% READ</span>
            </span>

            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                hasLiked
                  ? 'bg-[#34A499] text-white shadow-lg'
                  : 'bg-white dark:bg-[#181818] hover:bg-neutral-100 dark:hover:bg-[#222222] text-[#333333] dark:text-[#CCCCCC] border border-[#E5E5E5] dark:border-[#2A2A2A] shadow-xs'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : 'text-[#34A499]'}`} />
              <span>{likes}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-white dark:bg-[#181818] hover:bg-neutral-100 dark:hover:bg-[#222222] text-[#333333] dark:text-[#CCCCCC] border border-[#E5E5E5] dark:border-[#2A2A2A] shadow-xs transition-colors"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#777777]" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Article Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
        {/* Category & Read Time Metadata */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-wider mb-4">
          <span className="text-[#34A499] font-bold">{post.category}</span>
          <span className="text-[#CCCCCC] dark:text-[#444444]">·</span>
          <span className="text-[#666666] dark:text-[#888888]">{post.publishedAt}</span>
          <span className="text-[#CCCCCC] dark:text-[#444444]">·</span>
          <span
            className="flex items-center gap-1.5 text-[#1A1A1A] dark:text-white font-semibold bg-neutral-100 dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#222222] px-2.5 py-0.5 rounded-md"
            title={`Estimated reading time based on ${readingStats.wordCount.toLocaleString()} words`}
          >
            <Clock className="w-3.5 h-3.5 text-[#34A499]" />
            <span>{readingStats.text}</span>
            <span className="text-[#999999] dark:text-[#666666] font-normal">
              ({readingStats.wordCount.toLocaleString()} words)
            </span>
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#1A1A1A] dark:text-white tracking-tight leading-[1.12] mb-6 max-w-4xl text-balance">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-lg sm:text-xl text-[#555555] dark:text-[#AAAAAA] leading-relaxed max-w-3xl mb-8 font-light">
          {post.excerpt}
        </p>

        {/* Author Bio Bar */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-[#222222] shadow-xs mb-10">
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover border border-[#E5E5E5] dark:border-[#333333]"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="text-sm font-bold text-[#1A1A1A] dark:text-white">{post.author.name}</p>
              <p className="text-xs text-[#666666] dark:text-[#777777] font-mono">{post.author.role}</p>
            </div>
          </div>
          <span className="text-xs font-mono text-[#777777] dark:text-[#666666] hidden sm:inline">
            {post.author.handle}
          </span>
        </div>

        {/* Cover Image Presentation */}
        <div className="relative rounded-2xl overflow-hidden mb-12 border border-[#E5E5E5] dark:border-[#222222] shadow-xl dark:shadow-2xl bg-[#F5F5F5] dark:bg-[#141414]">
          <img
            src={post.coverImage}
            alt={post.coverImageAlt}
            className="w-full max-h-[520px] object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="p-3 bg-neutral-100 dark:bg-[#0E0E0E] text-[11px] font-mono text-[#666666] dark:text-[#888888] border-t border-[#E5E5E7] dark:border-[#1C1C1C] flex justify-between items-center">
            <span>Fig 01: {post.coverImageAlt}</span>
            <span>ZYNIQ // SOVEREIGN_COMPUTE</span>
          </div>
        </div>

        {/* Content & TOC Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Prose Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="prose dark:prose-invert max-w-none text-[#333333] dark:text-[#CCCCCC] leading-relaxed">
              {post.content.split('\n\n').map((paragraph, index) => {
                const trimmed = paragraph.trim();

                // H1
                if (trimmed.startsWith('# ')) {
                  return (
                    <h1 key={index} className="font-display text-2xl sm:text-3xl font-bold text-[#111111] dark:text-white pt-4 pb-2 border-b border-[#E5E5E7] dark:border-[#222222]">
                      {trimmed.replace('# ', '')}
                    </h1>
                  );
                }
                // H2
                if (trimmed.startsWith('## ')) {
                  return (
                    <h2 key={index} className="font-display text-xl sm:text-2xl font-bold text-[#111111] dark:text-white pt-6 pb-2">
                      {trimmed.replace('## ', '')}
                    </h2>
                  );
                }
                // H3
                if (trimmed.startsWith('### ')) {
                  return (
                    <h3 key={index} className="font-display text-lg font-bold text-[#111111] dark:text-white pt-4 pb-1">
                      {trimmed.replace('### ', '')}
                    </h3>
                  );
                }
                // Code block
                if (trimmed.startsWith('```')) {
                  const lines = trimmed.split('\n');
                  const code = lines.slice(1, -1).join('\n');
                  return (
                    <div key={index} className="rounded-xl overflow-hidden bg-[#0A0A0E] border border-[#262626] my-6 shadow-sm">
                      <div className="px-4 py-2 bg-[#121216] border-b border-[#222226] flex items-center justify-between text-xs font-mono text-[#888888]">
                        <span>TECHNICAL INTERCONNECT SPEC</span>
                        <span className="text-[#34A499]">TS / SILICON</span>
                      </div>
                      <pre className="p-4 text-xs font-mono text-white/90 overflow-x-auto leading-relaxed">
                        <code>{code}</code>
                      </pre>
                    </div>
                  );
                }
                // Blockquote
                if (trimmed.startsWith('> ')) {
                  return (
                    <blockquote
                      key={index}
                      className="py-4 my-6 text-base italic text-[#222222] dark:text-[#E0E0E0] border-y border-[#E5E5E7] dark:border-[#262626] font-display"
                    >
                      {trimmed.replace(/^>\s+/, '')}
                    </blockquote>
                  );
                }
                // List items
                if (trimmed.startsWith('- ') || trimmed.startsWith('1. ')) {
                  const items = trimmed.split('\n').filter(Boolean);
                  return (
                    <ul key={index} className="space-y-2 my-4 pl-4 list-disc marker:text-[#34A499]">
                      {items.map((item, idx) => (
                        <li key={idx} className="text-sm text-[#333333] dark:text-[#CCCCCC]">
                          {item.replace(/^[-*]\s+|\d+\.\s+/, '')}
                        </li>
                      ))}
                    </ul>
                  );
                }

                // First paragraph with editorial drop cap
                if (index === 1 || (index === 0 && !trimmed.startsWith('#'))) {
                  return (
                    <p
                      key={index}
                      className="text-base sm:text-lg leading-relaxed text-[#333333] dark:text-[#CCCCCC] first-letter:text-5xl first-letter:font-display first-letter:font-extrabold first-letter:text-[#34A499] first-letter:float-left first-letter:mr-3 first-letter:mt-1"
                    >
                      {trimmed}
                    </p>
                  );
                }

                // Standard paragraph
                return (
                  <p key={index} className="text-base sm:text-lg leading-relaxed text-[#333333] dark:text-[#CCCCCC]">
                    {trimmed}
                  </p>
                );
              })}
            </div>

            {/* Tags Strip */}
            <div className="pt-8 mt-12 border-t border-[#E5E5E7] dark:border-[#1F1F1F] flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-[#666666] uppercase mr-2">Core Tags:</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-md text-xs font-mono text-[#555555] dark:text-[#AAAAAA] bg-white dark:bg-[#141414] border border-[#E5E5E7] dark:border-[#222222] shadow-2xs"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* SEO & Technical Audit Card */}
            <div className="p-5 rounded-xl bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#222222] shadow-xs my-8">
              <div className="flex items-center gap-2 text-xs font-mono text-[#34A499] uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified SEO & Structured Data Spec</span>
              </div>
              <p className="text-xs text-[#666666] dark:text-[#888888] font-mono mb-2">
                Schema: <span className="text-[#1A1A1A] dark:text-white font-semibold">BlogPosting / TechArticle</span> · OpenGraph & Twitter Card Verified
              </p>
              <p className="text-xs text-[#777777] dark:text-[#666666]">
                Meta Title: {post.seo?.metaTitle || post.title}
              </p>
            </div>

            {/* Comments Section */}
            <section className="pt-8 border-t border-[#E5E5E5] dark:border-[#1F1F1F]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-bold text-[#1A1A1A] dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#34A499]" />
                  <span>Technical Discourse ({comments.length})</span>
                </h3>
                <span className="text-xs font-mono text-[#666666] dark:text-[#777777]">Sovereign Peer Review</span>
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="mb-8 p-4 rounded-xl bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#222222] shadow-xs">
                <div className="mb-3">
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Your Name / Organization (e.g. Lead Systems Architect)"
                    className="w-full bg-[#FFFFFF] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#282828] focus:border-[#34A499] text-xs text-[#1A1A1A] dark:text-white px-3 py-2 rounded-lg placeholder-[#888888] dark:placeholder-[#555555] focus:outline-none"
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    rows={3}
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Add an architectural observation or technical question..."
                    className="w-full bg-[#FFFFFF] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#282828] focus:border-[#34A499] text-xs text-[#1A1A1A] dark:text-white p-3 rounded-lg placeholder-[#888888] dark:placeholder-[#555555] focus:outline-none resize-none"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#34A499] hover:bg-[#2B8A80] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>Post Observation</span>
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-xs text-[#777777] dark:text-[#666666] font-mono italic">
                    No technical comments logged yet. Be the first to initiate discourse.
                  </p>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="p-4 rounded-xl bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#1E1E1E] shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#34A499]/15 text-[#34A499] text-xs font-mono font-bold flex items-center justify-center">
                            {c.author.charAt(0)}
                          </span>
                          <span className="text-xs font-bold text-[#1A1A1A] dark:text-white">{c.author}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#777777] dark:text-[#666666]">{c.timestamp}</span>
                      </div>
                      <p className="text-xs text-[#444444] dark:text-[#CCCCCC] leading-relaxed pl-8">{c.text}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Right Rail: Table of Contents & Metadata */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-28 space-y-6">
              {/* Table of Contents */}
              {headings.length > 0 && (
                <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#222222] shadow-xs">
                  <p className="text-xs font-mono text-[#666666] dark:text-[#888888] uppercase tracking-wider mb-3">
                    Table of Contents
                  </p>
                  <ul className="space-y-2 text-xs font-mono">
                    {headings.map((h, i) => (
                      <li
                        key={i}
                        className={`truncate text-[#555555] dark:text-[#AAAAAA] hover:text-[#34A499] transition-colors cursor-pointer ${
                          h.level === 3 ? 'pl-4 text-[#777777] dark:text-[#888888]' : ''
                        }`}
                      >
                        {h.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Share & Channels Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#222222] shadow-xs">
                <p className="text-xs font-mono text-[#666666] dark:text-[#888888] uppercase tracking-wider mb-3">
                  Share & Syndicate
                </p>
                <div className="space-y-2">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg bg-[#FAFAFA] dark:bg-[#181818] hover:bg-neutral-100 dark:hover:bg-[#202020] text-xs text-[#333333] dark:text-[#CCCCCC] hover:text-[#1A1A1A] dark:hover:text-white border border-[#E5E5E5] dark:border-transparent transition-colors"
                  >
                    <span>Share on X / Twitter</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#777777]" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg bg-[#FAFAFA] dark:bg-[#181818] hover:bg-neutral-100 dark:hover:bg-[#202020] text-xs text-[#333333] dark:text-[#CCCCCC] hover:text-[#1A1A1A] dark:hover:text-white border border-[#E5E5E5] dark:border-transparent transition-colors"
                  >
                    <span>Share on LinkedIn</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#777777]" />
                  </a>
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-[#FAFAFA] dark:bg-[#181818] hover:bg-neutral-100 dark:hover:bg-[#202020] text-xs text-[#333333] dark:text-[#CCCCCC] hover:text-[#1A1A1A] dark:hover:text-white border border-[#E5E5E5] dark:border-transparent transition-colors"
                  >
                    <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Copy Permanent URL'}</span>
                    <Copy className="w-3.5 h-3.5 text-[#777777]" />
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Posts Row */}
        {relatedPosts.length > 0 && (
          <div className="mt-20 pt-10 border-t border-[#E5E5E5] dark:border-[#222222]">
            <h3 className="font-display text-2xl font-bold text-[#1A1A1A] dark:text-white mb-6">
              Related Research Dispatches
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectRelated(rel)}
                  className="group bg-white dark:bg-[#111111] hover:bg-neutral-50 dark:hover:bg-[#161616] border border-[#E5E5E5] dark:border-[#222222] rounded-xl overflow-hidden cursor-pointer transition-all p-4 flex flex-col justify-between shadow-xs hover:shadow-md"
                >
                  <div>
                    <span className="text-[10px] font-mono text-[#34A499] uppercase">
                      {rel.category}
                    </span>
                    <h4 className="font-display text-sm font-bold text-[#1A1A1A] dark:text-white group-hover:text-[#34A499] transition-colors mt-1 mb-2 line-clamp-2">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-[#555555] dark:text-[#888888] line-clamp-2">{rel.excerpt}</p>
                  </div>
                  <p className="text-[10px] font-mono text-[#777777] dark:text-[#666666] mt-4 uppercase flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[#34A499]" />
                    <span>
                      {calculateReadingTime(`${rel.title || ''} ${rel.excerpt || ''} ${rel.content || ''}`).text}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
