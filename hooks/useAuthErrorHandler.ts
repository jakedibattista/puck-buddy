// Custom hook for handling authentication errors

import { useState, useCallback } from 'react';
import { ERROR_MESSAGES } from '../constants/errors';

interface UseAuthErrorHandlerReturn {
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
  handleAuthError: (error: any) => void;
}

export const useAuthErrorHandler = (): UseAuthErrorHandlerReturn => {
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleAuthError = useCallback((error: any) => {
    if (__DEV__) {
      console.error('🏒 Auth error:', error);
    }

    // Map specific error types to user-friendly messages
    if (error?.code) {
      switch (error.code) {
        case 'auth/network-request-failed':
          setError(ERROR_MESSAGES.NETWORK_ERROR);
          break;
        case 'auth/user-cancelled':
          setError(ERROR_MESSAGES.AUTH_CANCELLED);
          break;
        case 'auth/permission-denied':
          setError(ERROR_MESSAGES.PERMISSION_DENIED);
          break;
        default:
          setError(ERROR_MESSAGES.AUTH_FAILED);
      }
    } else if (typeof error === 'string') {
      setError(error);
    } else {
      setError(ERROR_MESSAGES.UNKNOWN_ERROR);
    }
  }, []);

  return {
    error,
    setError,
    clearError,
    handleAuthError
  };
};