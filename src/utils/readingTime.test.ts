import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  countWords,
  calculateReadingTime,
  calculateArticleScrollProgress,
} from './readingTime';

describe('readingTime utility', () => {
  it('returns 0 words and 1 min read for empty string', () => {
    assert.equal(countWords(''), 0);
    const res = calculateReadingTime('');
    assert.equal(res.wordCount, 0);
    assert.equal(res.minutes, 1);
    assert.equal(res.text, '1 min read');
  });

  it('strips markdown formatting and counts readable words accurately', () => {
    const markdown = `# Sovereign Silicon\n\nThis is a **bold** and *italic* statement with a [link](https://zyniq.studio/).`;
    assert.equal(countWords(markdown), 12);
    const res = calculateReadingTime(markdown, 200);
    assert.equal(res.wordCount, 12);
    assert.equal(res.minutes, 1);
    assert.equal(res.text, '1 min read');
  });

  it('calculates multi-minute reading time based on 200 wpm threshold', () => {
    const nineHundredWords = Array.from({ length: 900 }, (_, i) => `word${i}`).join(' ');
    const res = calculateReadingTime(nineHundredWords, 200);
    assert.equal(res.wordCount, 900);
    assert.equal(res.minutes, 5);
    assert.equal(res.text, '5 min read');
  });

  it('calculates article scroll progress clamped between 0 and 100', () => {
    assert.equal(calculateArticleScrollProgress(0, 100, 2900, 1000), 0);
    assert.equal(calculateArticleScrollProgress(1000, 100, 2900, 1000), 50);
    assert.equal(calculateArticleScrollProgress(2000, 100, 2900, 1000), 100);
    assert.equal(calculateArticleScrollProgress(2500, 100, 2900, 1000), 100);
    assert.equal(calculateArticleScrollProgress(0, 0, 500, 1000), 100);
  });
});
