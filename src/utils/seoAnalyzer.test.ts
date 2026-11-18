import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateReadingTime, analyzeSEO } from './seoAnalyzer.ts';

test('calculateReadingTime handles empty and multi-word content', () => {
  assert.equal(calculateReadingTime('').minutes, 1);
  assert.equal(calculateReadingTime('').wordCount, 0);

  const text200 = Array(200).fill('synthetic').join(' ');
  const res = calculateReadingTime(text200);
  assert.equal(res.wordCount, 200);
  assert.equal(res.minutes, 1);

  const text500 = Array(500).fill('autonomous').join(' ');
  assert.equal(calculateReadingTime(text500).minutes, 3);
});

test('analyzeSEO calculates score and flags short title and description', () => {
  const result = analyzeSEO('Short', 'Brief', 'Content here');
  assert.equal(result.titleStatus, 'warning');
  assert.equal(result.descStatus, 'warning');
  assert.ok(result.score < 80);
});

test('analyzeSEO scores optimal article with subheadings and keywords', () => {
  const title = 'Synthetic Autonomy: The Convergence of Edge IQ';
  const desc = 'Discover how sovereign edge computation and monolithic hardware converge to replace cloud latency with deterministic intelligence.';
  const content = `
# Synthetic Autonomy

Sovereign hardware compute is transforming industrial robotics.

## The Architectural Divide
Cloud latency degrades physical robotics loops. When an actuator requires sub-millisecond response, centralized hyperscalers fail.

## Zero-Latency Neural Fabrics
Local neural inference units running quantized weights allow complete mechanical sovereignty.

## Obsidian Form Factors
The hardware enclosure must resist industrial thermal environments while projecting precision engineering.
  `.repeat(4);

  const result = analyzeSEO(title, desc, content, ['Synthetic Autonomy', 'hardware']);
  assert.equal(result.titleStatus, 'optimal');
  assert.equal(result.descStatus, 'optimal');
  assert.ok(result.score >= 85);
  assert.ok(result.headingsCount.h2 >= 3);
});
