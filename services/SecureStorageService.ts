// Secure storage service for authentication tokens using Expo SecureStore

import * as SecureStore from 'expo-secure-store';
import { ERROR_CODES } from '../constants/errors';

export class SecureStorageService {
  private static readonly AUTH_TOKEN_KEY = 'auth_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly USER_ID_KEY = 'user_id';

  static async storeAuthToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.AUTH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to store auth token:', error);
      throw new Error(ERROR_CODES.STORAGE_ERROR);
    }
  }

  static async getAuthToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to retrieve auth token:', error);
      return null;
    }
  }

  static async storeRefreshToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to store refresh token:', error);
      throw new Error(ERROR_CODES.STORAGE_ERROR);
    }
  }

  static async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error);
      return null;
    }
  }

  static async storeUserId(userId: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.USER_ID_KEY, userId);
    } catch (error) {
      console.error('Failed to store user ID:', error);
      throw new Error(ERROR_CODES.STORAGE_ERROR);
    }
  }

  static async getUserId(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.USER_ID_KEY);
    } catch (error) {
      console.error('Failed to retrieve user ID:', error);
      return null;
    }
  }

  static async clearAuthData(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(this.AUTH_TOKEN_KEY),
        SecureStore.deleteItemAsync(this.REFRESH_TOKEN_KEY),
        SecureStore.deleteItemAsync(this.USER_ID_KEY)
      ]);
    } catch (error) {
      console.error('Failed to clear auth data:', error);
      throw new Error(ERROR_CODES.STORAGE_ERROR);
    }
  }

  static async hasAuthData(): Promise<boolean> {
    try {
      const token = await this.getAuthToken();
      const userId = await this.getUserId();
      return !!(token && userId);
    } catch (error) {
      console.error('Failed to check auth data:', error);
      return false;
    }
  }
}