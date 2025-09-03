// Core authentication types for Puck Buddy

export interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  googleId: string;
  email: string;
  name: string;
  profilePicture?: string;
  createdAt: Date;
  lastLoginAt: Date;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  error: string | null;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export type AuthAction = 'signin' | 'signup';

export interface AuthError {
  code: string;
  message: string;
  userMessage: string;
}

// Storage service interfaces
export interface StorageService {
  storeAuthToken(token: string): Promise<void>;
  getAuthToken(): Promise<string | null>;
  clearAuthData(): Promise<void>;
  storeUserProfile(user: UserProfile): Promise<void>;
  getUserProfile(): Promise<UserProfile | null>;
}

// Data service interface for remote storage
export interface DataService {
  createUserProfile(profile: UserProfile): Promise<UserProfile>;
  updateUserProfile(id: string, updates: Partial<UserProfile>): Promise<UserProfile>;
  getUserProfile(id: string): Promise<UserProfile | null>;
  deleteUserProfile(id: string): Promise<void>;
}