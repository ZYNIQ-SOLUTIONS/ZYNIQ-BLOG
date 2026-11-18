export interface EmailValidationResult {
  isValid: boolean;
  normalizedEmail: string;
  errorMessage: string | null;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates and normalizes an email address for ZYNIQ newsletter subscription.
 */
export function validateNewsletterEmail(rawEmail: string): EmailValidationResult {
  const trimmed = (rawEmail ?? '').trim();

  if (!trimmed) {
    return {
      isValid: false,
      normalizedEmail: '',
      errorMessage: 'Please enter an email address.',
    };
  }

  if (!EMAIL_PATTERN.test(trimmed)) {
    return {
      isValid: false,
      normalizedEmail: trimmed.toLowerCase(),
      errorMessage: 'Please enter a valid email address (e.g. architect@domain.io).',
    };
  }

  return {
    isValid: true,
    normalizedEmail: trimmed.toLowerCase(),
    errorMessage: null,
  };
}

/**
 * Formats the confirmation message shown after a successful newsletter signup.
 */
export function formatSubscriptionConfirmation(
  email: string,
  alreadySubscribed = false
): string {
  const normalized = email.trim().toLowerCase();
  if (alreadySubscribed) {
    return `${normalized} is already registered for ZYNIQ research dispatches.`;
  }
  return `Dispatch subscription confirmed for ${normalized}.`;
}
