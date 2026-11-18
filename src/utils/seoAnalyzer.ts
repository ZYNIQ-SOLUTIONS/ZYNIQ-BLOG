import { SEOCheckResult } from '../types';

export function calculateReadingTime(text: string): { minutes: number; wordCount: number } {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return { minutes, wordCount };
}

export function analyzeSEO(
  title: string,
  metaDescription: string,
  content: string,
  focusKeywords: string[] = []
): SEOCheckResult {
  const cleanTitle = (title || '').trim();
  const cleanDesc = (metaDescription || '').trim();
  const cleanContent = (content || '').trim();

  const { minutes: readTimeMinutes, wordCount } = calculateReadingTime(cleanContent);

  // Title check (ideal: 30 - 60 chars)
  const titleLength = cleanTitle.length;
  let titleStatus: 'optimal' | 'warning' | 'critical' = 'optimal';
  if (titleLength === 0) {
    titleStatus = 'critical';
  } else if (titleLength < 30 || titleLength > 65) {
    titleStatus = 'warning';
  }

  // Description check (ideal: 120 - 160 chars)
  const descLength = cleanDesc.length;
  let descStatus: 'optimal' | 'warning' | 'critical' = 'optimal';
  if (descLength === 0) {
    descStatus = 'critical';
  } else if (descLength < 70 || descLength > 165) {
    descStatus = 'warning';
  }

  // Count markdown headings
  const h1Matches = cleanContent.match(/^#\s+[^\n]+/gm) || [];
  const h2Matches = cleanContent.match(/^##\s+[^\n]+/gm) || [];
  const h3Matches = cleanContent.match(/^###\s+[^\n]+/gm) || [];

  const headingsCount = {
    h1: h1Matches.length,
    h2: h2Matches.length,
    h3: h3Matches.length,
  };

  // Keyword density
  const lowerContent = cleanContent.toLowerCase();
  const keywordDensity = focusKeywords.map((kw) => {
    const cleanKw = kw.trim().toLowerCase();
    if (!cleanKw || wordCount === 0) return { keyword: kw, count: 0, percentage: 0 };
    
    // count occurrences
    const regex = new RegExp(`\\b${cleanKw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
    const matches = lowerContent.match(regex);
    const count = matches ? matches.length : 0;
    const percentage = Number(((count / wordCount) * 100).toFixed(1));
    return { keyword: kw, count, percentage };
  });

  // Calculate score (0 to 100)
  let score = 100;
  const suggestions: string[] = [];

  // Title penalties
  if (titleLength === 0) {
    score -= 25;
    suggestions.push('Provide a compelling post title.');
  } else if (titleLength < 30) {
    score -= 10;
    suggestions.push('Title is short. Aim for 30–60 characters for optimal search snippets.');
  } else if (titleLength > 65) {
    score -= 8;
    suggestions.push('Title exceeds 65 characters and may be truncated on mobile search results.');
  }

  // Meta description penalties
  if (descLength === 0) {
    score -= 20;
    suggestions.push('Provide an SEO meta description between 120–160 characters.');
  } else if (descLength < 70) {
    score -= 10;
    suggestions.push('Meta description is too brief. Expand to at least 70–120 characters.');
  } else if (descLength > 165) {
    score -= 8;
    suggestions.push('Meta description exceeds 165 characters and will be clipped by search engines.');
  }

  // Content length check
  if (wordCount < 150) {
    score -= 20;
    suggestions.push('Content is thin. Editorial articles perform best with at least 300–600 words.');
  } else if (wordCount < 300) {
    score -= 10;
    suggestions.push('Consider adding more context or evidence to reach 300+ words.');
  }

  // Headings check
  if (headingsCount.h2 === 0 && wordCount > 200) {
    score -= 12;
    suggestions.push('Add subheadings (H2 / H3) to structure the essay for scannability and SEO.');
  }

  // Keyword in title check
  if (focusKeywords.length > 0) {
    const hasKwInTitle = focusKeywords.some((kw) =>
      cleanTitle.toLowerCase().includes(kw.trim().toLowerCase())
    );
    if (!hasKwInTitle) {
      score -= 8;
      suggestions.push(`Include at least one focus keyword in the title.`);
    }
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  // Readability estimate
  let readabilityLevel = 'Standard Technical';
  if (wordCount > 500 && headingsCount.h2 >= 3) {
    readabilityLevel = 'Elite Editorial / In-Depth';
  } else if (wordCount < 200) {
    readabilityLevel = 'Brief Dispatch';
  } else {
    readabilityLevel = 'Clear & Structured';
  }

  return {
    score,
    titleLength,
    titleStatus,
    descLength,
    descStatus,
    wordCount,
    readTimeMinutes,
    headingsCount,
    keywordDensity,
    suggestions,
    readabilityLevel,
  };
}
