// Authentication context for app-wide state management

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, UserProfile, AuthResult } from '../types/auth';
import { GoogleAuthService } from '../services/GoogleAuthService';
import { MockFirebaseService as FirebaseService } from '../services/MockFirebaseService';
import { LocalStorageService } from '../services/LocalStorageService';
import { SecureStorageService } from '../services/SecureStorageService';
import { ERROR_MESSAGES } from '../constants/errors';

// Auth state actions
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: UserProfile | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SIGN_OUT' };

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null
};

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        error: null,
        isLoading: false
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case 'SIGN_OUT':
      return {
        ...initialState,
        isLoading: false
      };
    default:
      return state;
  }
};

// Context interface
interface AuthContextType {
  state: AuthState;
  signInWithGoogle: () => Promise<AuthResult>;
  signUpWithGoogle: () => Promise<AuthResult>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize authentication state on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Check for cached user profile first (faster)
      const cachedProfile = await LocalStorageService.getUserProfile();
      if (cachedProfile && await LocalStorageService.isCacheValid()) {
        dispatch({ type: 'SET_USER', payload: cachedProfile });
        return;
      }

      // Check if user is authenticated with Google
      const isGoogleAuthenticated = await GoogleAuthService.isAuthenticated();
      if (!isGoogleAuthenticated) {
        dispatch({ type: 'SET_USER', payload: null });
        return;
      }

      // Get current Google user
      const googleUser = await GoogleAuthService.getCurrentUser();
      if (!googleUser) {
        dispatch({ type: 'SET_USER', payload: null });
        return;
      }

      // Try to get user profile from Firebase
      const userProfile = await FirebaseService.getUserProfile(googleUser.id);
      if (userProfile) {
        // Cache the profile locally
        await LocalStorageService.storeUserProfile(userProfile);
        // Store user ID securely
        await SecureStorageService.storeUserId(userProfile.id);
        dispatch({ type: 'SET_USER', payload: userProfile });
      } else {
        // User exists in Google but not in our database - sign out
        await signOut();
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      dispatch({ type: 'SET_ERROR', payload: ERROR_MESSAGES.UNKNOWN_ERROR });
    }
  };

  const signInWithGoogle = async (): Promise<AuthResult> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const result = await GoogleAuthService.signInWithGoogle();
      
      if (!result.success || !result.user) {
        dispatch({ type: 'SET_ERROR', payload: result.error || ERROR_MESSAGES.AUTH_FAILED });
        return result;
      }

      // Check if user profile exists in Firebase
      const existingProfile = await FirebaseService.getUserProfile(result.user.id);
      
      if (!existingProfile) {
        dispatch({ type: 'SET_ERROR', payload: ERROR_MESSAGES.ACCOUNT_NOT_FOUND });
        await GoogleAuthService.signOut();
        return {
          success: false,
          error: ERROR_MESSAGES.ACCOUNT_NOT_FOUND
        };
      }

      // Update last login time
      await FirebaseService.updateLastLogin(existingProfile.id);
      
      // Cache profile locally
      await LocalStorageService.storeUserProfile(existingProfile);
      
      // Store tokens securely
      const tokens = await GoogleAuthService.getTokens();
      if (tokens) {
        await SecureStorageService.storeAuthToken(tokens.accessToken);
        await SecureStorageService.storeUserId(existingProfile.id);
      }

      dispatch({ type: 'SET_USER', payload: existingProfile });
      
      return {
        success: true,
        user: result.user
      };
    } catch (error) {
      console.error('Sign in failed:', error);
      const errorMessage = ERROR_MESSAGES.AUTH_FAILED;
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const signUpWithGoogle = async (): Promise<AuthResult> => {
    try {
      console.log('🏒 Starting Google sign-up process...');
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      console.log('🏒 Calling GoogleAuthService.signUpWithGoogle()...');
      const result = await GoogleAuthService.signUpWithGoogle();
      console.log('🏒 Google auth result:', { success: result.success, hasUser: !!result.user, error: result.error });
      
      if (!result.success || !result.user) {
        console.log('🏒 Google auth failed:', result.error);
        dispatch({ type: 'SET_ERROR', payload: result.error || ERROR_MESSAGES.AUTH_FAILED });
        return result;
      }

      console.log('🏒 Checking if user already exists in Firebase...');
      // Check if user already exists
      const existingProfile = await FirebaseService.getUserProfile(result.user.id);
      console.log('🏒 Existing profile check:', { exists: !!existingProfile });
      
      if (existingProfile) {
        console.log('🏒 Account already exists, signing out...');
        dispatch({ type: 'SET_ERROR', payload: ERROR_MESSAGES.ACCOUNT_EXISTS });
        await GoogleAuthService.signOut();
        return {
          success: false,
          error: ERROR_MESSAGES.ACCOUNT_EXISTS
        };
      }

      console.log('🏒 Creating new user profile...');
      // Create new user profile
      const newProfile = await FirebaseService.createUserProfile({
        googleId: result.user.id,
        email: result.user.email,
        name: result.user.name,
        profilePicture: result.user.profilePicture,
        preferences: {
          theme: 'light',
          notifications: true
        }
      });
      console.log('🏒 New profile created:', { id: newProfile.id, email: newProfile.email });

      console.log('🏒 Caching profile locally...');
      // Cache profile locally
      await LocalStorageService.storeUserProfile(newProfile);
      
      console.log('🏒 Storing tokens securely...');
      // Store tokens securely
      const tokens = await GoogleAuthService.getTokens();
      if (tokens) {
        await SecureStorageService.storeAuthToken(tokens.accessToken);
        await SecureStorageService.storeUserId(newProfile.id);
      }

      console.log('🏒 Sign-up successful! Setting user in context...');
      dispatch({ type: 'SET_USER', payload: newProfile });
      
      return {
        success: true,
        user: result.user
      };
    } catch (error) {
      console.error('🏒 Sign up failed with error:', error);
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.AUTH_FAILED;
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      // Sign out from Google
      await GoogleAuthService.signOut();
      
      // Clear all stored data
      await Promise.all([
        SecureStorageService.clearAuthData(),
        LocalStorageService.clearUserProfile()
      ]);

      dispatch({ type: 'SIGN_OUT' });
    } catch (error) {
      console.error('Sign out failed:', error);
      // Always clear local state even if remote sign out fails
      dispatch({ type: 'SIGN_OUT' });
    }
  };

  const refreshUser = async (): Promise<void> => {
    if (!state.user) return;

    try {
      const updatedProfile = await FirebaseService.getUserProfile(state.user.id);
      if (updatedProfile) {
        await LocalStorageService.storeUserProfile(updatedProfile);
        dispatch({ type: 'SET_USER', payload: updatedProfile });
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const contextValue: AuthContextType = {
    state,
    signInWithGoogle,
    signUpWithGoogle,
    signOut,
    refreshUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};