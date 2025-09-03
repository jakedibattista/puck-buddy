// Mock Firebase service for testing authentication without Firebase backend

import { UserProfile } from '../types/auth';
import { ERROR_CODES } from '../constants/errors';

export class MockFirebaseService {
  private static readonly MOCK_DELAY = 500; // Simulate network delay

  static async createUserProfile(profile: Omit<UserProfile, 'id' | 'createdAt' | 'lastLoginAt'>): Promise<UserProfile> {
    try {
      console.log('🏒 MockFirebaseService: Creating user profile...', profile.email);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, this.MOCK_DELAY));

      const now = new Date();
      const userProfile: UserProfile = {
        ...profile,
        id: profile.googleId, // Use Google ID as document ID
        createdAt: now,
        lastLoginAt: now
      };

      console.log('🏒 MockFirebaseService: User profile created successfully');
      return userProfile;
    } catch (error) {
      console.error('🏒 MockFirebaseService: Failed to create user profile:', error);
      throw new Error(ERROR_CODES.STORAGE_ERROR);
    }
  }

  static async getUserProfile(id: string): Promise<UserProfile | null> {
    try {
      console.log('🏒 MockFirebaseService: Getting user profile for ID:', id);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, this.MOCK_DELAY));

      // For testing, return null to simulate new user (forces sign-up flow)
      // In a real app, this would check if user exists in database
      console.log('🏒 MockFirebaseService: User profile not found (simulating new user)');
      return null;
    } catch (error) {
      console.error('🏒 MockFirebaseService: Failed to get user profile:', error);
      return null;
    }
  }

  static async updateUserProfile(id: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      console.log('🏒 MockFirebaseService: Updating user profile:', id);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, this.MOCK_DELAY));

      // For testing, create a mock updated profile
      const now = new Date();
      const updatedProfile: UserProfile = {
        id,
        googleId: id,
        email: updates.email || 'test@example.com',
        name: updates.name || 'Test User',
        profilePicture: updates.profilePicture,
        createdAt: updates.createdAt || now,
        lastLoginAt: now,
        preferences: updates.preferences || {
          theme: 'light',
          notifications: true
        }
      };

      console.log('🏒 MockFirebaseService: User profile updated successfully');
      return updatedProfile;
    } catch (error) {
      console.error('🏒 MockFirebaseService: Failed to update user profile:', error);
      throw new Error(ERROR_CODES.STORAGE_ERROR);
    }
  }

  static async deleteUserProfile(id: string): Promise<void> {
    try {
      console.log('🏒 MockFirebaseService: Deleting user profile:', id);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, this.MOCK_DELAY));

      console.log('🏒 MockFirebaseService: User profile deleted successfully');
    } catch (error) {
      console.error('🏒 MockFirebaseService: Failed to delete user profile:', error);
      throw new Error(ERROR_CODES.STORAGE_ERROR);
    }
  }

  static async updateLastLogin(id: string): Promise<void> {
    try {
      console.log('🏒 MockFirebaseService: Updating last login for:', id);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, this.MOCK_DELAY));

      console.log('🏒 MockFirebaseService: Last login updated successfully');
    } catch (error) {
      console.error('🏒 MockFirebaseService: Failed to update last login:', error);
      // Don't throw error for this non-critical operation
    }
  }

  // Offline support methods (no-op for mock)
  static async enableOfflineSupport(): Promise<void> {
    console.log('🏒 MockFirebaseService: Offline support enabled (mock)');
  }

  static async disableOfflineSupport(): Promise<void> {
    console.log('🏒 MockFirebaseService: Offline support disabled (mock)');
  }
}