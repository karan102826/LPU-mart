/**
 * Layer 1: Input Deflection — Deterministic Backend Security
 *
 * Runs before any user input is logged, stored, or sent to an LLM provider.
 * Implements deterministic regex inspection and rule-based heuristics.
 * Sanitizes detected PII with: "Contact details are protected by LPUmart."
 */

import { SanitizationResult } from '../../types';

// Deterministic Pattern Definitions
const PATTERNS = {
  // Indian Mobile Numbers: 10 digits starting with 6-9, with optional +91, 0, spaces, dashes
  PHONE: /(?:(?:\+?91[\-\s]?)?0?)?[6-9]\d{2}[\-\s]?\d{3}[\-\s]?\d{4}\b/gi,
  // Spaced-out phone digits (e.g. 9 8 7 6 5 4 3 2 1 0 or 9.8.7.6...)
  SPACED_PHONE: /\b[6-9](?:[\s\.\-]\d){9}\b/g,
  
  // Email Addresses (standard & obfuscated forms like user[at]domain[dot]com)
  EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi,
  OBFUSCATED_EMAIL: /[a-zA-Z0-9._%+-]+\s*(?:\[at\]|@|\(at\))\s*[a-zA-Z0-9.-]+\s*(?:\[dot\]|\.|\(dot\))\s*[a-zA-Z]{2,}/gi,

  // UPI IDs / VPAs (e.g., name@okhdfcbank, student@paytm, user@upi, seller@ybl)
  UPI_VPA: /[a-zA-Z0-9.\-_]{2,256}@(okhdfcbank|okaxis|oksbi|okicici|paytm|ybl|upi|ibl|axl|federal|postbank|barodampay)/gi,
  GENERIC_VPA: /\b[a-zA-Z0-9.\-_]{3,40}@(upi|gpay|phonepe)\b/gi,

  // LPU Registration Numbers (8-digit IDs, often 11... or 12...)
  LPU_REG_NUMBER: /\b(?:reg(?:istration)?(?:\s*no\.?|\s*id)?[:\s]*)?(1[12]\d{6})\b/gi,

  // Social Handles & Messaging Channels
  SOCIAL_HANDLE: /\b(?:insta(?:gram)?|ig|snap(?:chat)?|telegram|tg|whatsapp|wa)[:\s]*@?[a-zA-Z0-9._]{3,30}\b/gi,
  RAW_HANDLE: /(?:^|\s)@([a-zA-Z0-9_]{4,25})\b/gi,

  // Commission evasion & off-platform trade triggers
  OFF_PLATFORM: /\b(?:pay\s+outside|pay\s+directly|bypass\s+commission|avoid\s+commission|cash\s+handover\s+without\s+qr|skip\s+the\s+fee|external\s+payment|gpay\s+me|send\s+on\s+phonepe)\b/gi,
};

const REDACTION_MESSAGE = 'Contact details are protected by LPUmart.';

export function sanitizeUserInput(input: string): SanitizationResult {
  if (!input || typeof input !== 'string') {
    return {
      originalText: '',
      sanitizedText: '',
      hasPII: false,
      detectedTypes: [],
      redactionCount: 0,
      flaggedKeywords: [],
    };
  }

  let text = input;
  const detectedTypes: Array<'PHONE' | 'EMAIL' | 'UPI_VPA' | 'REG_NUMBER' | 'SOCIAL_HANDLE' | 'OFF_PLATFORM_KEYWORD'> = [];
  const flaggedKeywords: string[] = [];
  let redactionCount = 0;

  // 1. Phone Number Detection
  if (PATTERNS.PHONE.test(text) || PATTERNS.SPACED_PHONE.test(text)) {
    detectedTypes.push('PHONE');
    text = text.replace(PATTERNS.PHONE, () => {
      redactionCount++;
      return REDACTION_MESSAGE;
    });
    text = text.replace(PATTERNS.SPACED_PHONE, () => {
      redactionCount++;
      return REDACTION_MESSAGE;
    });
  }

  // 2. Email Detection
  if (PATTERNS.EMAIL.test(text) || PATTERNS.OBFUSCATED_EMAIL.test(text)) {
    detectedTypes.push('EMAIL');
    text = text.replace(PATTERNS.EMAIL, () => {
      redactionCount++;
      return REDACTION_MESSAGE;
    });
    text = text.replace(PATTERNS.OBFUSCATED_EMAIL, () => {
      redactionCount++;
      return REDACTION_MESSAGE;
    });
  }

  // 3. UPI / VPA Detection
  if (PATTERNS.UPI_VPA.test(text) || PATTERNS.GENERIC_VPA.test(text)) {
    detectedTypes.push('UPI_VPA');
    flaggedKeywords.push('UPI_PAYMENT_BYPASS_ATTEMPT');
    text = text.replace(PATTERNS.UPI_VPA, () => {
      redactionCount++;
      return REDACTION_MESSAGE;
    });
    text = text.replace(PATTERNS.GENERIC_VPA, () => {
      redactionCount++;
      return REDACTION_MESSAGE;
    });
  }

  // 4. LPU Registration Number Detection
  if (PATTERNS.LPU_REG_NUMBER.test(text)) {
    detectedTypes.push('REG_NUMBER');
    flaggedKeywords.push('LPU_REGISTRATION_NUMBER_PROBE');
    text = text.replace(PATTERNS.LPU_REG_NUMBER, () => {
      redactionCount++;
      return 'LPU Student Identity is protected by LPUmart.';
    });
  }

  // 5. Social Media Handles
  if (PATTERNS.SOCIAL_HANDLE.test(text)) {
    detectedTypes.push('SOCIAL_HANDLE');
    text = text.replace(PATTERNS.SOCIAL_HANDLE, () => {
      redactionCount++;
      return REDACTION_MESSAGE;
    });
  }

  // 6. Off-platform Evasion
  const offPlatformMatches = text.match(PATTERNS.OFF_PLATFORM);
  if (offPlatformMatches && offPlatformMatches.length > 0) {
    detectedTypes.push('OFF_PLATFORM_KEYWORD');
    flaggedKeywords.push(...offPlatformMatches);
  }

  return {
    originalText: input,
    sanitizedText: text,
    hasPII: detectedTypes.length > 0,
    detectedTypes,
    redactionCount,
    flaggedKeywords,
  };
}

/**
 * Audit log helper: Returns an anonymized description without ever storing the raw sensitive payload
 */
export function createSafeThreatSummary(result: SanitizationResult): string {
  if (!result.hasPII) return 'Standard sanitized inquiry';
  return `Blocked PII categories: [${result.detectedTypes.join(', ')}] - Redactions applied: ${result.redactionCount}`;
}
