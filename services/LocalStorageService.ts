// Local storage service for user profile caching using AsyncStorage

import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types/auth';
import { ERROR_CODES } from '../constants/errors';

export class LocalStorageService {
  private static readonly USER_PROFILE_KEY = 'user_profile';
  private static readonly CACHE_TIMESTAMP_KEY = 'cache_timestamp';
  private static readonly CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

  static async storeUserProfile(profile: UserProfile): Promise<void> {
    try {
      const profileData = JSON.stringify(profile);
      const timestamp = Date.now().toString();
      
      await Promise.all([
        AsyncStorage.setItem(this.USER_PROFILE_KEY, profileData),
        AsyncStorage.setItem(this.CACHE_TIMESTAMP_KEY, timestamp)
      ]);
    } catch (error) {
      console.error('Failed to store user profile:', error);
      throw new Error(ERROR_CODES.STORAGE_ERROR);
    }
  }

  static async getUserProfile(): Promise<UserProfile | null> {
    try {
      const [profileData, timestampData] = await Promise.all([
        AsyncStorage.getItem(this.USER_PROFILE_KEY),
        AsyncStorage.getItem(this.CACHE_TIMESTAMP_KEY)
      ]);

      if (!profileData || !timestampData) {
        return null;
      }

      // Check if cache is expired
      const timestamp = parseInt(timestampData, 10);
      const now = Date.now();
      if (now - timestamp > this.CACHE_EXPIRY_MS) {
        await this.clearUserProfile();
        return null;
      }

      const profile = JSON.parse(profileData) as UserProfile;
      
      // Convert date strings back to Date objects
      profile.createdAt = new Date(profile.createdAt);
      profile.lastLoginAt = new Date(profile.lastLoginAt);
      
      return profile;
    } catch (error) {
      console.error('Failed to retrieve user profile:', error);
      return null;
    }
  }

  static async clearUserProfile(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(this.USER_PROFILE_KEY),
        AsyncStorage.removeItem(this.CACHE_TIMESTAMP_KEY)
      ]);
    } catch (error) {
      console.error('Failed to clear user profile:', error);
      throw new Error(ERROR_CODES.STORAGE_ERROR);
    }
  }

  static async updateUserProfile(updates: Partial<UserProfile>): Promise<void> {
    try {
      const existingProfile = await this.getUserProfile();
      if (!existingProfile) {
        throw new Error('No existing profile to update');
      }

      const updatedProfile: UserProfile = {
        ...existingProfile,
        ...updates,
        lastLoginAt: new Date() // Always update last login time
      };

      await this.storeUserProfile(updatedProfile);
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw new Error(ERROR_CODES.STORAGE_ERROR);
    }
  }

  static async isCacheValid(): Promise<boolean> {
    try {
      const timestampData = await AsyncStorage.getItem(this.CACHE_TIMESTAMP_KEY);
      if (!timestampData) return false;

      const timestamp = parseInt(timestampData, 10);
      const now = Date.now();
      return (now - timestamp) <= this.CACHE_EXPIRY_MS;
    } catch (error) {
      console.error('Failed to check cache validity:', error);
      return false;
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Failed to clear all local data:', error);
      throw new Error(ERROR_CODES.STORAGE_ERROR);
    }
  }
}