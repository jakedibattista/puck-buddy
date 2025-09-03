// Firebase service for remote data persistence

import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  enableNetwork,
  disableNetwork
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserProfile } from '../types/auth';
import { ERROR_CODES } from '../constants/errors';
import { validateUserProfile } from '../utils/validation';

export class FirebaseService {
  private static readonly USERS_COLLECTION = 'users';

  static async createUserProfile(profile: Omit<UserProfile, 'id' | 'createdAt' | 'lastLoginAt'>): Promise<UserProfile> {
    try {
      const now = new Date();
      const userProfile: UserProfile = {
        ...profile,
        id: profile.googleId, // Use Google ID as document ID
        createdAt: now,
        lastLoginAt: now
      };

      // Validate profile data
      const validationErrors = validateUserProfile(userProfile);
      if (validationErrors.length > 0) {
        throw new Error(`Invalid profile data: ${validationErrors.join(', ')}`);
      }

      const userRef = doc(db, this.USERS_COLLECTION, userProfile.id);
      
      // Use serverTimestamp for consistent timestamps
      await setDoc(userRef, {
        ...userProfile,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp()
      });

      return userProfile;
    } catch (error) {
      console.error('Failed to create user profile:', error);
      throw new Error(ERROR_CODES.STORAGE_ERROR);
    }
  }

  static async getUserProfile(id: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, this.USERS_COLLECTION, id);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return null;
      }

      const data = userSnap.data();
      
      // Convert Firestore timestamps to Date objects
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        lastLoginAt: data.lastLoginAt?.toDate() || new Date()
      } as UserProfile;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  }

  static async updateUserProfile(id: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const userRef = doc(db, this.USERS_COLLECTION, id);
      
      // Always update lastLoginAt when updating profile
      const updateData = {
        ...updates,
        lastLoginAt: serverTimestamp()
      };

      await updateDoc(userRef, updateData);

      // Fetch and return updated profile
      const updatedProfile = await this.getUserProfile(id);
      if (!updatedProfile) {
        throw new Error('Failed to retrieve updated profile');
      }

      return updatedProfile;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw new Error(ERROR_CODES.STORAGE_ERROR);
    }
  }

  static async deleteUserProfile(id: string): Promise<void> {
    try {
      const userRef = doc(db, this.USERS_COLLECTION, id);
      await deleteDoc(userRef);
    } catch (error) {
      console.error('Failed to delete user profile:', error);
      throw new Error(ERROR_CODES.STORAGE_ERROR);
    }
  }

  static async updateLastLogin(id: string): Promise<void> {
    try {
      const userRef = doc(db, this.USERS_COLLECTION, id);
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Failed to update last login:', error);
      // Don't throw error for this non-critical operation
    }
  }

  // Offline support methods
  static async enableOfflineSupport(): Promise<void> {
    try {
      await enableNetwork(db);
    } catch (error) {
      console.error('Failed to enable offline support:', error);
    }
  }

  static async disableOfflineSupport(): Promise<void> {
    try {
      await disableNetwork(db);
    } catch (error) {
      console.error('Failed to disable offline support:', error);
    }
  }
}