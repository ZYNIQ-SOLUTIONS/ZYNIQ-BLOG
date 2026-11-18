export interface BrandColor {
  name: string;
  hex: string;
  percentage: number;
  role: string;
  description: string;
  tailwind?: string;
}

export interface BrandGuideSection {
  title: string;
  content: string;
  details?: Record<string, any>;
}

export const ZYNIQ_BRAND_IDENTITY = {
  meaning: {
    term: 'ZYNIQ',
    formula: 'SYNTHETIC + UNIQUE + IQ',
    summary: 'Futuristic intelligence engineered with a distinctive edge, uncompromising precision, and sovereign computation.',
  },
  colors: [
    {
      name: 'Black',
      hex: '#000000',
      percentage: 40,
      role: 'Power, Precision & Sophistication',
      description: 'The monolithic foundation. Dominates backgrounds, high-contrast surfaces, and deep dark-mode frames.',
      tailwind: 'bg-[#000000] text-white',
    },
    {
      name: 'White',
      hex: '#FFFFFF',
      percentage: 30,
      role: 'Clarity, Simplicity & Truth',
      description: 'Used for stark typographic readability, primary headline illumination, and crisp boundary lines.',
      tailwind: 'bg-[#FFFFFF] text-black',
    },
    {
      name: 'Teal Green',
      hex: '#34A499',
      percentage: 20,
      role: 'Energy, Urgency & Innovation',
      description: 'The energetic pulse of ZYNIQ. Reserved strictly for primary CTAs, critical indicators, and key accent paths.',
      tailwind: 'bg-[#34A499] text-white',
    },
    {
      name: 'Gray',
      hex: '#777777',
      percentage: 10,
      role: 'Balance, Neutrality & Structure',
      description: 'Hairline grid dividers, secondary telemetry data, metadata labels, and subtle border framing.',
      tailwind: 'bg-[#777777] text-white',
    },
  ] as BrandColor[],

  typography: {
    primary: {
      name: 'Syne',
      purpose: 'Headlines, Display Titles, and Brand Wordmark',
      weights: 'SemiBold (600), Bold (700), ExtraBold (800)',
      usage: 'Large hero headlines, article headings, section headers.',
    },
    secondary: {
      name: 'Plus Jakarta Sans',
      purpose: 'Body copy, descriptions, editorial essays, and UI labels',
      weights: 'Regular (400), Medium (500), SemiBold (600)',
      usage: 'Reading columns, long-form prose, form inputs, button text.',
    },
    monospace: {
      name: 'JetBrains Mono',
      purpose: 'Code snippets, technical coordinates, timestamps, and metrics',
      weights: 'Regular (400), Medium (500), SemiBold (600)',
      usage: 'Code blocks, telemetry chips, reading time, tabular numbers.',
    },
    hierarchy: [
      { level: 'Display Hero', size: '2.5rem – 3.75rem (40–60px)', weight: '800 Bold', lineHeight: '1.1' },
      { level: 'H1 Section Title', size: '1.875rem – 2.25rem (30–36px)', weight: '700 Bold', lineHeight: '1.2' },
      { level: 'H2 Subheading', size: '1.25rem – 1.5rem (20–24px)', weight: '600 SemiBold', lineHeight: '1.3' },
      { level: 'Body Prose', size: '0.9375rem – 1.0625rem (15–17px)', weight: '400 Regular', lineHeight: '1.75' },
      { level: 'Metadata & Telemetry', size: '0.75rem – 0.8125rem (12–13px)', weight: '500 Medium', lineHeight: '1.4' },
    ],
  },

  logoGuidelines: {
    minimumSize: '24px height on digital screens / 12mm in print media.',
    clearSpace: 'Equal to the height of the letter "Z" on all four bounding sides.',
    variations: [
      { type: 'Full Wordmark', desc: 'Futuristic geometric letterforms with custom-cut Z and Q glyphs.' },
      { type: 'Icon Emblem', desc: 'Synthetic IQ angular hexagon with internal laser red core.' },
      { type: 'Monochrome Wordmark', desc: 'Pure white for dark backgrounds; obsidian black for light backgrounds.' },
      { type: 'Teal Accent Wordmark', desc: 'White letterforms with the letter Q dot or Z slash rendered in #34A499.' },
    ],
    bannedPractices: [
      'Never stretch or distort aspect ratio.',
      'Never rotate the logo at arbitrary angles.',
      'Never apply drop shadows, 3D extrusions, or bevels.',
      'Never render in non-brand gradient colors (cyan, purple, yellow).',
      'Never place over busy or low-contrast backgrounds without a dark scrim.',
    ],
  },

  visualLanguage: {
    gridSystem: '8px baseline grid with 16px, 24px, 32px, and 48px spatial rhythm units.',
    borderRadius: 'Sharp architectural style (4px to 8px for cards/inputs; 24px only for macro container framing).',
    iconStyle: 'Clean line icons with 1.5px stroke weight, strict geometric corners, zero bubbly fills.',
    illustrationApproach: 'Technical wireframes, geometric blueprints, circuit schematics, vector coordinate meshes.',
    photographyStyle: 'High-contrast monochrome, industrial lighting, stark shadows, with deliberate red accents.',
  },

  voiceAndTone: {
    traits: [
      { name: 'Precise', desc: 'Every statement is rooted in verifiable engineering truth; zero fluff.' },
      { name: 'Elite', desc: 'Speaks to builders, architects, and technical leaders who value mastery.' },
      { name: 'Unapologetic', desc: 'Bold, direct, decisive. Does not hedge or seek mass placation.' },
    ],
    dos: [
      'Lead with technical specifications and measurable outcomes.',
      'Use crisp, declarative sentences with strong verbs.',
      'Address the reader as a peer engineer or systems thinker.',
    ],
    donts: [
      'Do not use conversational filler ("Hey guys!", "Buckle up!").',
      'Do not make vague marketing claims ("supercharge your potential").',
      'Do not use emoji clusters or decorative emoji bullet points.',
    ],
    phrasesAreYou: [
      '"Deterministic inference at sub-millisecond bounds."',
      '"Engineered for sovereign compute. Zero compromises."',
      '"Shedding cloud latency through monolithic edge architecture."',
      '"Precision over platitudes."',
    ],
    phrasesArentYou: [
      '"Supercharge your workflow with magical AI!"',
      '"Let\'s dive into this super fun and playful space :)"',
      '"We empower your journey to synergy and disruption."',
    ],
  },

  brandArchitecture: {
    parent: {
      name: 'ZYNIQ Solutions',
      role: 'Parent holding & systems organization. Uses Teal Green (#34A499) as the decisive anchor.',
    },
    subBrands: [
      {
        name: 'ZYNIQ Core',
        colorFocus: 'Dominant Black + White with Red timing markers. Focused on low-latency neural fabrics.',
      },
      {
        name: 'ZYNIQ Studio',
        colorFocus: 'Obsidian Black + High-Contrast Gray. Focused on monolithic industrial hardware design.',
      },
      {
        name: 'ZYNIQ Cloud',
        colorFocus: 'Deep Charcoal (#141414) + Sharp White. Focused on decentralized sovereign micro-datacenters.',
      },
    ],
    coBrandingRules: 'Sub-brands always anchor beneath the parent ZYNIQ wordmark with hairline divider.',
  },

  uiPatterns: {
    buttonPrimary: 'bg-[#34A499] hover:bg-[#2B8A80] text-white font-medium px-5 py-2.5 rounded-lg shadow-sm',
    buttonSecondary: 'bg-[#181818] hover:bg-[#222222] text-[#EEEEEE] border border-[#333333] px-5 py-2.5 rounded-lg',
    cardTreatment: 'bg-[#121212] border border-[#222222] hover:border-[#383838] transition-all rounded-xl p-6',
    formInput: 'bg-[#0E0E0E] border border-[#262626] focus:border-[#34A499] focus:ring-1 focus:ring-[#34A499] text-white px-4 py-2.5 rounded-lg',
    navigation: 'Clean hairline 1-row header with single-line text links, subtle teal hover indicator.',
  },

  motionPrinciples: {
    easing: 'cubic-bezier(0.16, 1, 0.3, 1) (natural rapid deceleration)',
    speeds: 'Hover feedback 150ms; modal/slide transitions 250ms; page transitions 300ms.',
    direction: 'Vertical upward settle (translate-y: 6px to 0px) and clean opacity dissolves.',
  },

  brandRejection: [
    {
      trait: 'NOT Colorful or Playful',
      detail: 'No rainbow candy gradients, pastel purple/pink fills, cute stickers, or playful emoji.',
    },
    {
      trait: 'NOT Soft or Friendly',
      detail: 'No oversized pill buttons, pill badge sandwiches, or condescending conversational tone.',
    },
    {
      trait: 'NOT Buzzword-Heavy',
      detail: 'Banned: "synergy", "paradigm shift", "revolutionary magic", "game changer", "vibe coding".',
    },
    {
      trait: 'NOT Vague or Evasive',
      detail: 'Every performance claim must specify metric units, benchmark constraints, and test methodology.',
    },
  ],

  applicationExamples: [
    {
      id: 'header-mockup',
      name: 'Website Header Mockup',
      desc: 'Top social rail with X/LinkedIn/GitHub, centered ZYNIQ wordmark, Light/Dark toggle, and Let’s Talk CTA.',
    },
    {
      id: 'business-card',
      name: 'Industrial Executive Business Card',
      desc: 'Obsidian black soft-touch 600gsm cardstock with red edge-foil and precision laser debossed wordmark.',
    },
    {
      id: 'presentation-template',
      name: 'Investor & Technical Deck Template',
      desc: '16:9 ultra-dark minimalist slides with 40/30/20/10 color rule and high-precision diagrams.',
    },
    {
      id: 'social-post',
      name: 'Social Media Post Template',
      desc: 'Square 1:1 and 16:9 technical dispatch card with red coordinate tag and monolithic typography.',
    },
  ],
};
