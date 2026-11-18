import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateNewsletterEmail,
  formatSubscriptionConfirmation,
} from './newsletter.ts';

test('validateNewsletterEmail rejects empty or whitespace-only input', () => {
  const emptyResult = validateNewsletterEmail('');
  assert.equal(emptyResult.isValid, false);
  assert.equal(emptyResult.normalizedEmail, '');
  assert.ok(emptyResult.errorMessage);

  const spacesResult = validateNewsletterEmail('   ');
  assert.equal(spacesResult.isValid, false);
  assert.ok(spacesResult.errorMessage);
});

test('validateNewsletterEmail rejects malformed email addresses', () => {
  assert.equal(validateNewsletterEmail('not-an-email').isValid, false);
  assert.equal(validateNewsletterEmail('missing-domain@').isValid, false);
  assert.equal(validateNewsletterEmail('@missing-user.io').isValid, false);
  assert.equal(validateNewsletterEmail('spaces in@email.io').isValid, false);
});

test('validateNewsletterEmail accepts and normalizes valid email addresses', () => {
  const result = validateNewsletterEmail('  Architect.Lead@ZYNIQ.io  ');
  assert.equal(result.isValid, true);
  assert.equal(result.normalizedEmail, 'architect.lead@zyniq.io');
  assert.equal(result.errorMessage, null);
});

test('formatSubscriptionConfirmation returns distinct messages for new vs existing subscribers', () => {
  const freshMsg = formatSubscriptionConfirmation('Reader@Domain.io', false);
  assert.ok(freshMsg.includes('reader@domain.io'));
  assert.ok(freshMsg.includes('confirmed'));

  const existingMsg = formatSubscriptionConfirmation('Reader@Domain.io', true);
  assert.ok(existingMsg.includes('reader@domain.io'));
  assert.ok(existingMsg.includes('already registered'));
});
