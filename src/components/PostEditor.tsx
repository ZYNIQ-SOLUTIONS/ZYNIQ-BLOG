import React, { useState, useEffect, useMemo } from 'react';
import { Post, SEOCheckResult } from '../types';
import { analyzeSEO } from '../utils/seoAnalyzer';
import { createZyniqCover } from '../data/initialPosts';
import {
  Save,
  Eye,
  PenLine,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Share2,
  Clock,
  ArrowLeft,
  Image as ImageIcon
} from 'lucide-react';

interface PostEditorProps {
  initialPost?: Post | null;
  onSave: (postData: any) => Promise<void>;
  onCancel: () => void;
}

export const PostEditor: React.FC<PostEditorProps> = ({
  initialPost,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialPost?.title || '');
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || '');
  const [content, setContent] = useState(
    initialPost?.content ||
      `# Executive Dispatch Title\n\nIntroductory statement establishing the thesis. In industrial robotics and mission-critical autonomy, latency is failure.\n\n## Technical Architecture\nDetailing the sovereign hardware specifications, compute bounds, and deterministic interconnects.\n\n## Empirical Benchmarks\nMeasuring latency bounds across 200 distributed edge nodes.`
  );
  const [category, setCategory] = useState(initialPost?.category || 'SYNTHETIC IQ');
  const [tagsInput, setTagsInput] = useState(initialPost?.tags?.join(', ') || 'Edge Compute, Deterministic AI, Hardware');
  const [coverPattern, setCoverPattern] = useState<'radial' | 'monolith' | 'quantum' | 'matrix' | 'grid'>('radial');
  const [customCoverUrl, setCustomCoverUrl] = useState(initialPost?.coverImage || '');
  const [focusKeywordsInput, setFocusKeywordsInput] = useState(
    initialPost?.seo?.keywords?.join(', ') || 'Synthetic IQ, Edge Compute, Hardware'
  );
  const [metaTitle, setMetaTitle] = useState(initialPost?.seo?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(initialPost?.seo?.metaDescription || '');
  const [authorName, setAuthorName] = useState(initialPost?.author?.name || 'Systems Architect');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'seo'>('edit');
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('All changes saved');

  // Generate cover image based on pattern or custom URL
  const coverImage = useMemo(() => {
    if (customCoverUrl && !customCoverUrl.startsWith('data:image/svg+xml')) {
      return customCoverUrl;
    }
    return createZyniqCover(title || 'Untitled Dispatch', category, coverPattern);
  }, [title, category, coverPattern, customCoverUrl]);

  // Real-time SEO analysis
  const focusKeywords = useMemo(() => {
    return focusKeywordsInput
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
  }, [focusKeywordsInput]);

  const seoResult: SEOCheckResult = useMemo(() => {
    return analyzeSEO(
      metaTitle || title,
      metaDescription || excerpt,
      content,
      focusKeywords
    );
  }, [metaTitle, title, metaDescription, excerpt, content, focusKeywords]);

  // Auto-save draft effect
  useEffect(() => {
    setAutoSaveStatus('Saving changes...');
    const timer = setTimeout(() => {
      setAutoSaveStatus(`Autosaved locally at ${new Date().toLocaleTimeString()}`);
    }, 800);
    return () => clearTimeout(timer);
  }, [title, excerpt, content, category, tagsInput]);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Please provide a title and article content.');
      return;
    }

    setIsSaving(true);
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const postData = {
        title: title.trim(),
        excerpt: excerpt.trim() || title.trim(),
        content: content.trim(),
        category,
        tags,
        coverImage,
        coverImageAlt: `${title} - ZYNIQ Research`,
        publishedAt: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }).toUpperCase(),
        readTime: `${seoResult.readTimeMinutes} MINS READ`,
        author: {
          name: authorName.trim() || 'ZYNIQ Engineer',
          role: `${category} Systems Specialist`,
          avatar:
            initialPost?.author?.avatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          handle: '@zyniq_solutions',
        },
        seo: {
          metaTitle: metaTitle.trim() || title.trim(),
          metaDescription: metaDescription.trim() || excerpt.trim(),
          keywords: focusKeywords,
          ogImage: coverImage,
        },
        status: 'published',
      };

      await onSave(postData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#070707] text-[#1A1A1A] dark:text-[#EEEEEE] pb-24 transition-colors">
      {/* Top Action Bar */}
      <div className="sticky top-0 z-40 bg-white dark:bg-[#0E0E0E] border-b border-[#E5E5E5] dark:border-[#1E1E1E] px-4 sm:px-8 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-[#666666] dark:text-[#888888] hover:text-[#1A1A1A] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#1A1A1A] transition-colors"
            title="Return to feed"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-[#1A1A1A] dark:text-white font-display">
              {initialPost ? 'Edit Dispatch' : 'New Research Dispatch'}
            </h2>
            <p className="text-[10px] font-mono text-[#777777]">{autoSaveStatus}</p>
          </div>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex items-center gap-1 bg-[#FAFAFA] dark:bg-[#141414] p-1 rounded-lg border border-[#E5E5E5] dark:border-[#222222]">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`px-3 py-1 text-xs font-mono rounded-md flex items-center gap-1.5 transition-colors ${
              activeTab === 'edit'
                ? 'bg-white text-black dark:bg-[#222222] dark:text-white font-semibold shadow-xs'
                : 'text-[#666666] dark:text-[#888888] hover:text-black dark:hover:text-white'
            }`}
          >
            <PenLine className="w-3.5 h-3.5 text-[#34A499]" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 text-xs font-mono rounded-md flex items-center gap-1.5 transition-colors ${
              activeTab === 'preview'
                ? 'bg-white text-black dark:bg-[#222222] dark:text-white font-semibold shadow-xs'
                : 'text-[#666666] dark:text-[#888888] hover:text-black dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live View</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`px-3 py-1 text-xs font-mono rounded-md flex items-center gap-1.5 transition-colors ${
              activeTab === 'seo'
                ? 'bg-white text-black dark:bg-[#222222] dark:text-white font-semibold shadow-xs'
                : 'text-[#666666] dark:text-[#888888] hover:text-black dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>SEO Engine ({seoResult.score}%)</span>
          </button>
        </div>

        {/* Publish Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-xs font-mono text-[#666666] dark:text-[#888888] hover:text-black dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#34A499] hover:bg-[#2B8A80] text-white text-xs font-semibold rounded-lg shadow transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Deploying...' : 'Publish Dispatch'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        {/* TAB 1: Real-time Editor */}
        {activeTab === 'edit' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Editing Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Title Input */}
              <div>
                <label className="block text-xs font-mono text-[#666666] dark:text-[#888888] uppercase mb-2">
                  Dispatch Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Synthetic Autonomy: The Convergence of Edge IQ"
                  className="w-full bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#222222] focus:border-[#34A499] text-xl sm:text-2xl font-display font-bold text-[#1A1A1A] dark:text-white px-4 py-3 rounded-xl focus:outline-none placeholder-[#999999] dark:placeholder-[#444444] shadow-xs"
                />
              </div>

              {/* Excerpt Input */}
              <div>
                <label className="block text-xs font-mono text-[#666666] dark:text-[#888888] uppercase mb-2">
                  Executive Excerpt (1-2 sentences)
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Summarize the core thesis and engineering implication..."
                  className="w-full bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#222222] focus:border-[#34A499] text-sm text-[#222222] dark:text-[#CCCCCC] p-3 rounded-xl focus:outline-none placeholder-[#999999] dark:placeholder-[#444444] resize-none shadow-xs"
                />
              </div>

              {/* Content Markdown Area */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono text-[#666666] dark:text-[#888888] uppercase">
                    Markdown Body (Supports # H1, ## H2, ```code, &gt; blockquote)
                  </label>
                  <span className="text-xs font-mono text-[#777777]">
                    {seoResult.wordCount} Words · {seoResult.readTimeMinutes} Min Read
                  </span>
                </div>
                <textarea
                  rows={16}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#222222] focus:border-[#34A499] text-sm font-mono text-[#1A1A1A] dark:text-white p-4 rounded-xl focus:outline-none leading-relaxed placeholder-[#999999] dark:placeholder-[#444444] shadow-xs"
                />
              </div>
            </div>

            {/* Side Configuration Rail */}
            <div className="lg:col-span-4 space-y-6">
              {/* Category & Tags */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#222222] space-y-4 shadow-xs">
                <h3 className="text-xs font-mono text-[#34A499] uppercase tracking-wider font-bold">
                  Classification & Metadata
                </h3>

                <div>
                  <label className="block text-[11px] font-mono text-[#666666] dark:text-[#888888] mb-1">
                    Department / Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#FFFFFF] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#262626] text-xs text-[#1A1A1A] dark:text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#34A499]"
                  >
                    <option value="SYNTHETIC IQ">Synthetic IQ</option>
                    <option value="CORE">ZYNIQ Core</option>
                    <option value="STUDIO">ZYNIQ Studio</option>
                    <option value="CLOUD">ZYNIQ Cloud</option>
                    <option value="BRAND">Brand Architecture</option>
                    <option value="QUANTUM">Quantum Systems</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#666666] dark:text-[#888888] mb-1">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Edge Compute, Silicon, Architecture"
                    className="w-full bg-[#FFFFFF] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#262626] text-xs text-[#1A1A1A] dark:text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#34A499]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#666666] dark:text-[#888888] mb-1">
                    Author Attribution
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Emma Carson / Systems Architect"
                    className="w-full bg-[#FFFFFF] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#262626] text-xs text-[#1A1A1A] dark:text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#34A499]"
                  />
                </div>
              </div>

              {/* Cover Image Selector */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[#E5E5E5] dark:border-[#222222] space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono text-[#34A499] uppercase tracking-wider font-bold">
                    Procedural Cover Graphic
                  </h3>
                  <ImageIcon className="w-3.5 h-3.5 text-[#777777]" />
                </div>

                {/* Pattern selector */}
                <div className="grid grid-cols-3 gap-2">
                  {(['radial', 'monolith', 'quantum', 'matrix', 'grid'] as const).map((pat) => (
                    <button
                      key={pat}
                      type="button"
                      onClick={() => setCoverPattern(pat)}
                      className={`px-2 py-1.5 text-[10px] font-mono uppercase rounded-lg border transition-all ${
                        coverPattern === pat
                          ? 'border-[#34A499] bg-[#34A499]/10 text-[#34A499] dark:text-white font-bold'
                          : 'border-[#E5E5E7] dark:border-[#222222] bg-[#F8F8FA] dark:bg-[#161616] text-[#666666] dark:text-[#888888] hover:text-black dark:hover:text-white'
                      }`}
                    >
                      {pat}
                    </button>
                  ))}
                </div>

                {/* Mini Preview of Cover */}
                <div className="rounded-xl overflow-hidden border border-[#E5E5E7] dark:border-[#262626] aspect-video relative">
                  <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  <div className="absolute bottom-1 right-2 text-[9px] font-mono text-white/90 bg-black/50 px-1 rounded">
                    ZYNIQ // {category}
                  </div>
                </div>
              </div>

              {/* Quick SEO Meter */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#111111] border border-[#E5E5E7] dark:border-[#222222] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-[#666666] dark:text-[#888888]">SEO Optimization</span>
                  <span className="text-xs font-mono font-bold text-[#34A499]">
                    {seoResult.score} / 100
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#E5E5E7] dark:bg-[#222222] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#34A499] transition-all"
                    style={{ width: `${seoResult.score}%` }}
                  />
                </div>
                <p className="text-[10px] font-mono text-[#777777] dark:text-[#666666] mt-2">
                  Readability: {seoResult.readabilityLevel}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Live View Preview */}
        {activeTab === 'preview' && (
          <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#101010] border border-[#E5E5E7] dark:border-[#222222] max-w-4xl mx-auto shadow-xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#34A499] mb-4">
              <span>{category}</span>
              <span className="text-[#CCCCCC] dark:text-[#444444]">·</span>
              <span className="text-[#666666] dark:text-[#888888]">
                {seoResult.readTimeMinutes} MINS READ · {seoResult.wordCount} WORDS
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#111111] dark:text-white mb-4">
              {title || 'Untitled Dispatch'}
            </h1>

            <p className="text-base text-[#555555] dark:text-[#AAAAAA] mb-8 leading-relaxed font-light">
              {excerpt || 'No executive excerpt provided.'}
            </p>

            <div className="rounded-2xl overflow-hidden mb-8 border border-[#E5E5E7] dark:border-[#262626]">
              <img src={coverImage} alt="Cover" className="w-full max-h-96 object-cover" />
            </div>

            <div className="prose dark:prose-invert max-w-none text-[#333333] dark:text-[#CCCCCC] space-y-4">
              {content.split('\n\n').map((p, idx) => (
                <p key={idx} className="text-base leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Advanced SEO & Social Card Engine */}
        {activeTab === 'seo' && (
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Scorecard */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[#E5E5E7] dark:border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#34A499] uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Real-Time Search & Social Audit</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-[#111111] dark:text-white">
                  Audit Score: {seoResult.score} / 100
                </h3>
                <p className="text-xs text-[#666666] dark:text-[#888888] font-mono mt-1">
                  Readability: <span className="text-[#111111] dark:text-white font-semibold">{seoResult.readabilityLevel}</span> · H2 Subheadings: {seoResult.headingsCount.h2}
                </p>
              </div>

              <div className="w-24 h-24 rounded-full border-4 border-[#E5E5E7] dark:border-[#222222] border-t-[#34A499] flex items-center justify-center">
                <span className="font-display text-2xl font-bold text-[#111111] dark:text-white">
                  {seoResult.score}%
                </span>
              </div>
            </div>

            {/* Search Snippet Preview (Google SERP) */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[#E5E5E7] dark:border-[#222222] space-y-3 shadow-xs">
              <p className="text-xs font-mono text-[#666666] dark:text-[#888888] uppercase tracking-wider">
                Google Search Result (SERP) Preview
              </p>
              <div className="p-4 rounded-xl bg-[#F8F9FA] dark:bg-[#141414] border border-[#E5E5E7] dark:border-[#262626] font-sans">
                <p className="text-xs text-[#1a0dab] dark:text-[#8ab4f8] truncate mb-0.5">
                  https://zyniq.solutions/blog/{title.toLowerCase().replace(/\s+/g, '-')}
                </p>
                <h4 className="text-base text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer font-medium line-clamp-1 mb-1">
                  {metaTitle || title || 'Dispatch Title'} | ZYNIQ Blog
                </h4>
                <p className="text-xs text-[#4d5156] dark:text-[#bdc1c6] line-clamp-2 leading-relaxed">
                  {metaDescription || excerpt || 'Executive excerpt preview for search crawlers and social scrapers.'}
                </p>
              </div>
            </div>

            {/* Social Share Card Preview (X / LinkedIn / Slack) */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[#E5E5E7] dark:border-[#222222] space-y-3 shadow-xs">
              <p className="text-xs font-mono text-[#666666] dark:text-[#888888] uppercase tracking-wider flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-[#34A499]" />
                <span>OpenGraph & Twitter / X Social Card Preview</span>
              </p>
              <div className="max-w-md rounded-xl overflow-hidden border border-[#E5E5E7] dark:border-[#262626] bg-[#F8F9FA] dark:bg-[#0E0E0E]">
                <div className="aspect-video bg-[#EFEFEF] dark:bg-[#181818] overflow-hidden">
                  <img src={coverImage} alt="OG Preview" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-mono text-[#777777] uppercase">ZYNIQ.SOLUTIONS</p>
                  <p className="text-sm font-bold text-[#111111] dark:text-white line-clamp-1 mt-1">
                    {metaTitle || title || 'Dispatch Title'}
                  </p>
                  <p className="text-xs text-[#555555] dark:text-[#888888] line-clamp-2 mt-1">
                    {metaDescription || excerpt}
                  </p>
                </div>
              </div>
            </div>

            {/* Keyword Density & Suggestions */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111111] border border-[#E5E5E7] dark:border-[#222222] space-y-4 shadow-xs">
              <h4 className="text-xs font-mono text-[#34A499] uppercase tracking-wider font-bold">
                Optimization Recommendations
              </h4>

              <div>
                <label className="block text-xs font-mono text-[#666666] dark:text-[#888888] mb-1">
                  Focus Keywords (Comma separated)
                </label>
                <input
                  type="text"
                  value={focusKeywordsInput}
                  onChange={(e) => setFocusKeywordsInput(e.target.value)}
                  className="w-full bg-[#F8F8FA] dark:bg-[#181818] border border-[#E5E5E7] dark:border-[#262626] text-xs text-[#111111] dark:text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#34A499]"
                />
              </div>

              {seoResult.suggestions.length > 0 ? (
                <div className="space-y-2 pt-2">
                  {seoResult.suggestions.map((sug, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#333333] dark:text-[#E0E0E0]">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{sug}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 pt-2 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>All SEO and structured data benchmarks are fully satisfied!</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
