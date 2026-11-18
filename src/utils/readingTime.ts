export interface ReadingTimeResult {
  minutes: number;
  wordCount: number;
  text: string;
}

/**
 * Counts the number of words in a given text string, stripping Markdown syntax
 * and HTML tags so only readable words are counted.
 */
export function countWords(text: string): number {
  if (!text || typeof text !== 'string') {
    return 0;
  }

  const cleaned = text
    // Remove code blocks fences
    .replace(/```[\s\S]*?```/g, (match) => match.replace(/```\w*\n?/g, ' '))
    // Remove HTML tags
    .replace(/<[^>]*>/g, ' ')
    // Remove Markdown links/images URLs while keeping link text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    // Remove Markdown formatting tokens (#, *, _, ~, `, >, |, -)
    .replace(/[#*_~`>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleaned) {
    return 0;
  }

  return cleaned.split(' ').filter((word) => /[a-zA-Z0-9]/.test(word)).length;
}

/**
 * Calculates estimated reading time based on word count.
 * Defaults to 200 words per minute, with a minimum of 1 minute.
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute: number = 200
): ReadingTimeResult {
  const safeWpm = wordsPerMinute > 0 ? wordsPerMinute : 200;
  const wordCount = countWords(content);
  const minutes = Math.max(1, Math.ceil(wordCount / safeWpm));

  return {
    minutes,
    wordCount,
    text: `${minutes} min read`,
  };
}

/**
 * Calculates the reading progress percentage [0, 100] as the user scrolls
 * through an article element.
 */
export function calculateArticleScrollProgress(
  scrollTop: number,
  articleTop: number,
  articleHeight: number,
  viewportHeight: number
): number {
  const totalScrollable = articleTop + articleHeight - viewportHeight;
  if (totalScrollable <= 0) {
    return 100;
  }
  const rawProgress = (scrollTop / totalScrollable) * 100;
  return Math.min(100, Math.max(0, rawProgress));
}
