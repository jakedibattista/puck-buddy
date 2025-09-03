// Kid-friendly error messages and error handling constants

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Oops! Check your internet connection and try again.",
  AUTH_CANCELLED: "No worries! You can try signing in again anytime.",
  AUTH_FAILED: "Something went wrong. Let's try that again!",
  PERMISSION_DENIED: "We need permission to sign you in with Google.",
  UNKNOWN_ERROR: "Something unexpected happened. Please try again!",
  ACCOUNT_EXISTS: "Looks like you already have an account! Try signing in instead.",
  ACCOUNT_NOT_FOUND: "We couldn't find your account. Would you like to sign up?",
  INVALID_EMAIL: "That email doesn't look right. Can you check it?",
  STORAGE_ERROR: "We're having trouble saving your information. Please try again.",
  COPPA_COMPLIANCE: "We need a parent's permission for kids under 13.",
  TOKEN_EXPIRED: "Your session has expired. Please sign in again.",
  SECURE_STORAGE_FAILED: "We couldn't securely save your login. Please try again."
} as const;

export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_CANCELLED: 'AUTH_CANCELLED',
  AUTH_FAILED: 'AUTH_FAILED',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  ACCOUNT_EXISTS: 'ACCOUNT_EXISTS',
  ACCOUNT_NOT_FOUND: 'ACCOUNT_NOT_FOUND',
  INVALID_EMAIL: 'INVALID_EMAIL',
  STORAGE_ERROR: 'STORAGE_ERROR',
  COPPA_COMPLIANCE: 'COPPA_COMPLIANCE',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  SECURE_STORAGE_FAILED: 'SECURE_STORAGE_FAILED'
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];