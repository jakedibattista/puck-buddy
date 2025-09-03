// Validation functions for user data

import { UserProfile } from '../types/auth';
import { ERROR_MESSAGES, ERROR_CODES } from '../constants/errors';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUserProfile = (profile: Partial<UserProfile>): string[] => {
  const errors: string[] = [];

  if (!profile.email || !validateEmail(profile.email)) {
    errors.push('Valid email is required');
  }

  if (!profile.name || profile.name.trim().length < 1) {
    errors.push('Name is required');
  }

  if (!profile.googleId || profile.googleId.trim().length < 1) {
    errors.push('Google ID is required');
  }

  return errors;
};

export const sanitizeUserInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const isValidUserProfile = (profile: Partial<UserProfile>): profile is UserProfile => {
  return validateUserProfile(profile).length === 0 &&
         profile.id !== undefined &&
         profile.createdAt !== undefined &&
         profile.lastLoginAt !== undefined &&
         profile.preferences !== undefined;
};

// COPPA compliance validation (children under 13)
export const validateAge = (birthDate: Date): { isValid: boolean; requiresParentalConsent: boolean } => {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return {
    isValid: age >= 0 && age <= 120, // Reasonable age range
    requiresParentalConsent: age < 13
  };
};

// Validate that only necessary profile information is stored (Requirement 4.2)
export const validateMinimalDataCollection = (profile: Partial<UserProfile>): boolean => {
  const allowedFields = ['id', 'googleId', 'email', 'name', 'profilePicture', 'createdAt', 'lastLoginAt', 'preferences'];
  const profileKeys = Object.keys(profile);
  
  return profileKeys.every(key => allowedFields.includes(key));
};

// Sanitize error messages to prevent sensitive information exposure (Requirement 4.4)
export const sanitizeErrorMessage = (error: any): string => {
  // Remove any potential sensitive information from error messages
  const sensitivePatterns = [
    /token/gi,
    /key/gi,
    /secret/gi,
    /password/gi,
    /auth/gi
  ];
  
  let message = typeof error === 'string' ? error : error?.message || 'Unknown error';
  
  sensitivePatterns.forEach(pattern => {
    message = message.replace(pattern, '[REDACTED]');
  });
  
  return message;
};

// Create standardized AuthError objects
export const createAuthError = (code: keyof typeof ERROR_CODES, originalError?: any): { code: string; message: string; userMessage: string } => {
  return {
    code: ERROR_CODES[code],
    message: sanitizeErrorMessage(originalError),
    userMessage: ERROR_MESSAGES[code]
  };
};