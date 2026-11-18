import React, { useState } from 'react';
import { ZYNIQ_BRAND_IDENTITY } from '../data/brandIdentity';
import {
  X,
  ShieldAlert,
  Layers,
  Type,
  Palette,
  Terminal,
  Grid,
  Zap,
  Sliders,
  Check,
  Ban,
  Maximize2,
  Copy
} from 'lucide-react';
import { ZyniqLogo } from './ZyniqLogo';

interface BrandGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandGuideModal: React.FC<BrandGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<string>('meaning');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHex(text);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const sections = [
    { id: 'meaning', label: '1. Meaning & Origin', icon: Zap },
    { id: 'colors', label: '2. Colors & 40/30/20/10', icon: Palette },
    { id: 'typography', label: '3. Typography System', icon: Type },
    { id: 'logo', label: '4. Logo Guidelines', icon: Maximize2 },
    { id: 'visual', label: '5. Visual Language', icon: Grid },
    { id: 'voice', label: '6. Voice & Tone', icon: Terminal },
    { id: 'architecture', label: '7. Brand Architecture', icon: Layers },
    { id: 'rejection', label: '8. Brand Rejection (What We Are NOT)', icon: ShieldAlert },
    { id: 'ui', label: '9. UI Component Patterns', icon: Sliders },
    { id: 'applications', label: '10. Application Examples', icon: Grid },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#0D0D0D] border border-[#E5E5E5] dark:border-[#222222] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-white dark:bg-[#121212] border-b border-[#E5E5E5] dark:border-[#202020] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#34A499] animate-pulse" />
            <div>
              <h2 className="font-display text-base sm:text-lg font-bold text-[#1A1A1A] dark:text-white tracking-tight">
                ZYNIQ Official Brand Identity & Design System
              </h2>
              <p className="text-[11px] font-mono text-[#666666] dark:text-[#777777]">
                SYNTHETIC + UNIQUE + IQ · INDUSTRIAL-GRADE REPOSITORY
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#777777] hover:text-[#1A1A1A] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#222222] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body with Side Nav & Content Area */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Side Nav */}
          <div className="w-full md:w-64 bg-[#FAFAFA] dark:bg-[#101010] border-r border-[#E5E5E5] dark:border-[#1C1C1C] p-3 overflow-y-auto space-y-1 shrink-0">
            {sections.map((s) => {
              const Icon = s.icon;
              const isActive = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-mono rounded-lg transition-all text-left ${
                    isActive
                      ? 'bg-[#34A499] text-white font-bold shadow-md'
                      : 'text-[#666666] dark:text-[#888888] hover:text-black dark:hover:text-white hover:bg-neutral-200/70 dark:hover:bg-[#181818]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] space-y-6">
            {/* 1. Meaning & Origin */}
            {activeSection === 'meaning' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-[#E5E5E7] dark:border-[#222222] shadow-xs">
                  <p className="text-xs font-mono text-[#34A499] uppercase mb-1">Etyomology & DNA</p>
                  <h3 className="font-display text-3xl font-extrabold text-[#111111] dark:text-white tracking-widest mb-3">
                    {ZYNIQ_BRAND_IDENTITY.meaning.formula}
                  </h3>
                  <p className="text-sm text-[#444444] dark:text-[#CCCCCC] leading-relaxed">
                    {ZYNIQ_BRAND_IDENTITY.meaning.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-[#E5E5E7] dark:border-[#222222] shadow-xs">
                    <span className="text-[#34A499] font-bold">SYNTHETIC</span>
                    <p className="text-[#666666] dark:text-[#888888] mt-1">Engineered, deterministic, silicon-native computation. Not natural chance.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-[#E5E5E7] dark:border-[#222222] shadow-xs">
                    <span className="text-[#111111] dark:text-white font-bold">UNIQUE</span>
                    <p className="text-[#666666] dark:text-[#888888] mt-1">Obsidian monolithic unibodies, sharp geometry, and mathematical bounds.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-[#E5E5E7] dark:border-[#222222] shadow-xs">
                    <span className="text-[#666666] dark:text-[#888888] font-bold">IQ</span>
                    <p className="text-[#666666] dark:text-[#888888] mt-1">Sub-millisecond latency and sovereign intelligence at the physical edge.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Colors */}
            {activeSection === 'colors' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-[#111111] dark:text-white mb-1">
                    The 40 / 30 / 20 / 10 Allocation Rule
                  </h3>
                  <p className="text-xs text-[#666666] dark:text-[#888888] font-mono">
                    Color is mathematical in the ZYNIQ design universe. It communicates hierarchy and cognitive focus.
                  </p>
                </div>

                {/* Color proportion bar */}
                <div className="h-6 w-full rounded-xl overflow-hidden flex border border-[#E5E5E7] dark:border-[#333333] shadow-xs">
                  <div style={{ width: '40%' }} className="bg-black flex items-center justify-center text-[10px] font-mono font-bold text-white border-r border-[#222222]">40% BLACK</div>
                  <div style={{ width: '30%' }} className="bg-white flex items-center justify-center text-[10px] font-mono font-bold text-black border-r border-[#E5E5E7] dark:border-[#222222]">30% WHITE</div>
                  <div style={{ width: '20%' }} className="bg-[#34A499] flex items-center justify-center text-[10px] font-mono font-bold text-white border-r border-[#222222]">20% TEAL</div>
                  <div style={{ width: '10%' }} className="bg-[#777777] flex items-center justify-center text-[10px] font-mono font-bold text-white">10% GRAY</div>
                </div>

                {/* Color Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ZYNIQ_BRAND_IDENTITY.colors.map((c) => (
                    <div
                      key={c.name}
                      className="p-4 rounded-2xl bg-white dark:bg-[#121212] border border-[#E5E5E7] dark:border-[#222222] flex items-start gap-4 shadow-xs"
                    >
                      <div
                        className="w-16 h-16 rounded-xl border border-black/10 dark:border-white/20 shrink-0 flex items-center justify-center font-mono text-xs font-bold shadow-xs"
                        style={{ backgroundColor: c.hex, color: c.name === 'White' ? '#000000' : '#FFFFFF' }}
                      >
                        {c.percentage}%
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-[#111111] dark:text-white">{c.name}</h4>
                          <button
                            onClick={() => copyToClipboard(c.hex)}
                            className="flex items-center gap-1 text-[11px] font-mono text-[#666666] dark:text-[#888888] hover:text-[#34A499]"
                          >
                            <span>{c.hex}</span>
                            {copiedHex === c.hex ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <p className="text-xs font-mono text-[#34A499] mt-0.5">{c.role}</p>
                        <p className="text-xs text-[#555555] dark:text-[#888888] mt-1.5 leading-relaxed">{c.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Typography */}
            {activeSection === 'typography' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-[#111111] dark:text-white mb-1">
                    Typography Architecture
                  </h3>
                  <p className="text-xs text-[#666666] dark:text-[#888888] font-mono">
                    Strict two-tier font pairing + single monospace telemetry outlier.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-white dark:bg-[#121212] border border-[#E5E5E7] dark:border-[#222222] shadow-xs">
                    <span className="text-xs font-mono text-[#34A499] uppercase">Primary Display Face</span>
                    <h4 className="font-display text-2xl font-bold text-[#111111] dark:text-white mt-1">
                      Syne · Geometric Neo-Grotesque
                    </h4>
                    <p className="text-xs text-[#555555] dark:text-[#888888] mt-1">
                      Used for wordmark, display headlines, hero titles, and department titles. Sharp, futuristic, bold.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-[#121212] border border-[#E5E5E7] dark:border-[#222222] shadow-xs">
                    <span className="text-xs font-mono text-[#666666] dark:text-[#888888] uppercase">Secondary Prose Face</span>
                    <h4 className="text-xl font-semibold text-[#111111] dark:text-white mt-1">
                      Plus Jakarta Sans · Contemporary Clear
                    </h4>
                    <p className="text-xs text-[#555555] dark:text-[#888888] mt-1">
                      Used for editorial reading columns, executive excerpts, and UI navigation controls.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-[#121212] border border-[#E5E5E7] dark:border-[#222222] shadow-xs">
                    <span className="text-xs font-mono text-[#777777] uppercase">Monospace Telemetry Face</span>
                    <h4 className="text-lg font-mono text-[#111111] dark:text-white mt-1">
                      JetBrains Mono · Technical Precision
                    </h4>
                    <p className="text-xs text-[#555555] dark:text-[#888888] mt-1">
                      Used for code snippets, timestamps, reading time, tabular data, and telemetry coordinates.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#F8F9FA] dark:bg-[#101010] border border-[#E5E5E7] dark:border-[#202020] shadow-xs">
                  <p className="text-xs font-mono text-[#666666] dark:text-[#888888] uppercase mb-2">Hierarchy Rules:</p>
                  <div className="space-y-2 text-xs font-mono">
                    {ZYNIQ_BRAND_IDENTITY.typography.hierarchy.map((h) => (
                      <div key={h.level} className="flex justify-between border-b border-[#E5E5E7] dark:border-[#1A1A1A] pb-1">
                        <span className="text-[#111111] dark:text-white font-medium">{h.level}</span>
                        <span className="text-[#666666] dark:text-[#888888]">{h.size} · {h.weight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. Logo Guidelines */}
            {activeSection === 'logo' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-[#111111] dark:text-white mb-1">
                    Logo Specifications & Clear Space
                  </h3>
                  <p className="text-xs text-[#666666] dark:text-[#888888] font-mono">
                    Minimum size: {ZYNIQ_BRAND_IDENTITY.logoGuidelines.minimumSize} · Clear space: {ZYNIQ_BRAND_IDENTITY.logoGuidelines.clearSpace}
                  </p>
                </div>

                {/* Logo Showcase */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-8 rounded-2xl bg-black border border-[#262626] flex flex-col items-center justify-center text-center shadow-xs">
                    <ZyniqLogo className="h-10 w-auto text-white" />
                    <span className="text-[10px] font-mono text-[#888888] mt-3">Official Primary SVG Wordmark on Obsidian (#000000)</span>
                  </div>

                  <div className="p-8 rounded-2xl bg-white dark:bg-[#141414] border border-[#E5E5E7] dark:border-[#262626] flex flex-col items-center justify-center text-center shadow-xs">
                    <ZyniqLogo className="h-10 w-auto text-black dark:text-white" />
                    <span className="text-[10px] font-mono text-[#666666] mt-3">High-Contrast Adaptive Specification</span>
                  </div>
                </div>

                {/* What NOT to do */}
                <div className="p-5 rounded-2xl bg-[#F0FAF9] dark:bg-[#0B1716] border border-[#34A499]/30 dark:border-[#1D3B38] shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#34A499] uppercase font-bold mb-3">
                    <Ban className="w-4 h-4" />
                    <span>Strict Prohibitions (What NOT To Do)</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#22544F] dark:text-[#A8E0DA]">
                    {ZYNIQ_BRAND_IDENTITY.logoGuidelines.bannedPractices.map((rule, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-[#34A499]">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 5. Visual Language */}
            {activeSection === 'visual' && (
              <div className="space-y-4">
                <h3 className="font-display text-xl font-bold text-[#111111] dark:text-white mb-1">
                  Visual Language & Industrial Precision
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-[#E5E5E7] dark:border-[#222222] shadow-xs">
                    <span className="text-xs font-mono text-[#34A499]">GRID SYSTEM</span>
                    <p className="text-xs text-[#444444] dark:text-[#CCCCCC] mt-1">{ZYNIQ_BRAND_IDENTITY.visualLanguage.gridSystem}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-[#E5E5E7] dark:border-[#222222] shadow-xs">
                    <span className="text-xs font-mono text-[#34A499]">BORDER RADIUS</span>
                    <p className="text-xs text-[#444444] dark:text-[#CCCCCC] mt-1">{ZYNIQ_BRAND_IDENTITY.visualLanguage.borderRadius}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-[#E5E5E7] dark:border-[#222222] shadow-xs">
                    <span className="text-xs font-mono text-[#34A499]">ICON STYLE</span>
                    <p className="text-xs text-[#444444] dark:text-[#CCCCCC] mt-1">{ZYNIQ_BRAND_IDENTITY.visualLanguage.iconStyle}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-[#E5E5E7] dark:border-[#222222] shadow-xs">
                    <span className="text-xs font-mono text-[#34A499]">PHOTOGRAPHY STYLE</span>
                    <p className="text-xs text-[#444444] dark:text-[#CCCCCC] mt-1">{ZYNIQ_BRAND_IDENTITY.visualLanguage.photographyStyle}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 6. Voice & Tone */}
            {activeSection === 'voice' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-[#111111] dark:text-white mb-1">
                    Voice & Tone: Precise, Elite, Unapologetic
                  </h3>
                  <p className="text-xs text-[#666666] dark:text-[#888888] font-mono">
                    ZYNIQ speaks with the certainty of mathematical verification.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-[#F0FFF4] dark:bg-[#0F1710] border border-[#C6F6D5] dark:border-[#1A3320] shadow-xs">
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase">Phrases That ARE ZYNIQ</span>
                    <ul className="space-y-2 mt-3 text-xs text-[#22543D] dark:text-[#CCCCCC]">
                      {ZYNIQ_BRAND_IDENTITY.voiceAndTone.phrasesAreYou.map((phrase, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{phrase}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#F0FAF9] dark:bg-[#0B1716] border border-[#34A499]/30 dark:border-[#1D3B38] shadow-xs">
                    <span className="text-xs font-mono text-[#34A499] font-bold uppercase">Phrases That ARE NOT ZYNIQ</span>
                    <ul className="space-y-2 mt-3 text-xs text-[#22544F] dark:text-[#CCCCCC]">
                      {ZYNIQ_BRAND_IDENTITY.voiceAndTone.phrasesArentYou.map((phrase, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Ban className="w-3.5 h-3.5 text-[#34A499] shrink-0 mt-0.5" />
                          <span>{phrase}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 7. Brand Architecture */}
            {activeSection === 'architecture' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-[#111111] dark:text-white mb-1">
                    Brand Architecture & Sub-Brands
                  </h3>
                  <p className="text-xs text-[#666666] dark:text-[#888888] font-mono">
                    Clear visual governance across parent and specialized subsidiaries.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-white dark:bg-[#121212] border-2 border-[#34A499] shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-base font-bold text-[#111111] dark:text-white">ZYNIQ Solutions</span>
                      <span className="text-[10px] font-mono text-[#34A499] uppercase font-bold">Parent Brand</span>
                    </div>
                    <p className="text-xs text-[#555555] dark:text-[#AAAAAA] mt-1">{ZYNIQ_BRAND_IDENTITY.brandArchitecture.parent.role}</p>
                  </div>

                  {ZYNIQ_BRAND_IDENTITY.brandArchitecture.subBrands.map((sb) => (
                    <div key={sb.name} className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-[#E5E5E7] dark:border-[#222222] shadow-xs">
                      <span className="font-display text-sm font-bold text-[#111111] dark:text-white">{sb.name}</span>
                      <p className="text-xs text-[#666666] dark:text-[#888888] mt-1">{sb.colorFocus}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. BRAND REJECTION SECTION */}
            {activeSection === 'rejection' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#34A499] uppercase font-bold mb-1">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Industrial-Grade Brand Rejection</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#111111] dark:text-white mb-1">
                    What ZYNIQ Is NOT: The Anti-Slop Boundary
                  </h3>
                  <p className="text-xs text-[#666666] dark:text-[#888888] font-mono">
                    This trains anyone building or writing for ZYNIQ to immediately self-correct.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ZYNIQ_BRAND_IDENTITY.brandRejection.map((item) => (
                    <div
                      key={item.trait}
                      className="p-5 rounded-2xl bg-[#F0FAF9] dark:bg-[#0B1716] border border-[#34A499]/30 dark:border-[#1D3B38] space-y-2 shadow-xs"
                    >
                      <div className="flex items-center gap-2 text-sm font-bold text-[#34A499]">
                        <Ban className="w-4 h-4" />
                        <span>{item.trait}</span>
                      </div>
                      <p className="text-xs text-[#22544F] dark:text-[#CCCCCC] leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. UI Component Patterns */}
            {activeSection === 'ui' && (
              <div className="space-y-6">
                <h3 className="font-display text-xl font-bold text-[#111111] dark:text-white mb-1">
                  UI Component Patterns & Motion Principles
                </h3>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-[#E5E5E7] dark:border-[#222222] shadow-xs">
                    <span className="text-xs font-mono text-[#34A499] uppercase">Primary CTA Pattern</span>
                    <div className="mt-3 flex items-center gap-3">
                      <button className="px-5 py-2 text-xs font-semibold text-white bg-[#34A499] hover:bg-[#2B8A80] rounded-lg shadow-xs">
                        Execute Inference Loop
                      </button>
                      <button className="px-5 py-2 text-xs font-semibold text-[#333333] dark:text-[#CCCCCC] bg-neutral-100 dark:bg-[#1A1A1A] hover:bg-neutral-200 dark:hover:bg-[#222222] border border-[#E5E5E7] dark:border-[#333333] rounded-lg shadow-xs">
                        Secondary Spec
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-[#E5E5E7] dark:border-[#222222] shadow-xs">
                    <span className="text-xs font-mono text-[#666666] dark:text-[#888888] uppercase">Motion Principles</span>
                    <p className="text-xs font-mono text-[#111111] dark:text-white mt-1">
                      Easing: {ZYNIQ_BRAND_IDENTITY.motionPrinciples.easing}
                    </p>
                    <p className="text-xs text-[#666666] dark:text-[#888888] mt-1">
                      Speeds: {ZYNIQ_BRAND_IDENTITY.motionPrinciples.speeds}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 10. Application Examples */}
            {activeSection === 'applications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-[#111111] dark:text-white mb-1">
                    Application Artifacts
                  </h3>
                  <p className="text-xs text-[#666666] dark:text-[#888888] font-mono">
                    Real-world touchpoints adhering to the ZYNIQ brand standards.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ZYNIQ_BRAND_IDENTITY.applicationExamples.map((app) => (
                    <div key={app.id} className="p-5 rounded-2xl bg-white dark:bg-[#121212] border border-[#E5E5E7] dark:border-[#222222] space-y-2 shadow-xs">
                      <h4 className="text-sm font-bold text-[#111111] dark:text-white">{app.name}</h4>
                      <p className="text-xs text-[#555555] dark:text-[#888888] leading-relaxed">{app.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
