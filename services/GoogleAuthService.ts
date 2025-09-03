// Google authentication service with cross-platform support

import { Platform } from 'react-native';
import { signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { AuthResult, User } from '../types/auth';
import { ERROR_CODES, ERROR_MESSAGES } from '../constants/errors';

// Only import Google Sign-In for native platforms
let GoogleSignin: any = null;
let statusCodes: any = null;

if (Platform.OS !== 'web') {
  try {
    const googleSignInModule = require('@react-native-google-signin/google-signin');
    GoogleSignin = googleSignInModule.GoogleSignin;
    statusCodes = googleSignInModule.statusCodes;
  } catch (error) {
    console.warn('Google Sign-In not available for this platform');
  }
}

export class GoogleAuthService {
    private static isConfigured = false;

    static async configure(): Promise<void> {
        if (this.isConfigured) return;

        try {
            if (Platform.OS !== 'web' && GoogleSignin) {
                GoogleSignin.configure({
                    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
                    offlineAccess: true,
                    hostedDomain: '',
                    forceCodeForRefreshToken: true,
                });
            }

            this.isConfigured = true;
        } catch (error) {
            console.error('Failed to configure Google Sign-In:', error);
            throw new Error(ERROR_CODES.AUTH_FAILED);
        }
    }

    static async signInWithGoogle(): Promise<AuthResult> {
        try {
            if (Platform.OS === 'web') {
                return this.signInWithGoogleWeb();
            } else {
                return this.signInWithGoogleNative();
            }
        } catch (error: any) {
            console.error('Google Sign-In failed:', error);
            return this.handleAuthError(error);
        }
    }

    private static async signInWithGoogleWeb(): Promise<AuthResult> {
        try {
            console.log('🏒 Starting web Google sign-in...');
            const provider = new GoogleAuthProvider();
            provider.addScope('email');
            provider.addScope('profile');

            console.log('🏒 Opening Google popup...');
            const result = await signInWithPopup(auth, provider);
            const firebaseUser = result.user;
            console.log('🏒 Google sign-in successful:', firebaseUser.email);

            const user: User = {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: firebaseUser.displayName || firebaseUser.email || '',
                profilePicture: firebaseUser.photoURL || undefined,
                createdAt: new Date()
            };

            return {
                success: true,
                user
            };
        } catch (error: any) {
            console.error('🏒 Web Google Sign-In failed:', error);
            return this.handleAuthError(error);
        }
    }

    private static async signInWithGoogleNative(): Promise<AuthResult> {
        try {
            if (!GoogleSignin) {
                return {
                    success: false,
                    error: ERROR_MESSAGES.AUTH_FAILED
                };
            }

            await this.configure();

            // Check if device supports Google Play Services
            await GoogleSignin.hasPlayServices();

            const userInfo = await GoogleSignin.signIn();

            if (!userInfo.data) {
                return {
                    success: false,
                    error: ERROR_MESSAGES.AUTH_FAILED
                };
            }

            const user: User = {
                id: userInfo.data.user.id,
                email: userInfo.data.user.email,
                name: userInfo.data.user.name || userInfo.data.user.email,
                profilePicture: userInfo.data.user.photo || undefined,
                createdAt: new Date()
            };

            return {
                success: true,
                user
            };
        } catch (error: any) {
            console.error('Native Google Sign-In failed:', error);
            return this.handleAuthError(error);
        }
    }

    static async signUpWithGoogle(): Promise<AuthResult> {
        // For Google OAuth, sign-up and sign-in are the same process
        // We'll handle account creation/retrieval in the auth service layer
        return this.signInWithGoogle();
    }

    static async signOut(): Promise<void> {
        try {
            if (Platform.OS === 'web') {
                await firebaseSignOut(auth);
            } else if (GoogleSignin) {
                await this.configure();
                await GoogleSignin.signOut();
            }
        } catch (error) {
            console.error('Failed to sign out:', error);
            // Don't throw error for sign out - always allow user to sign out locally
        }
    }

    static async getCurrentUser(): Promise<User | null> {
        try {
            if (Platform.OS === 'web') {
                const currentUser = auth.currentUser;
                if (!currentUser) return null;

                return {
                    id: currentUser.uid,
                    email: currentUser.email || '',
                    name: currentUser.displayName || currentUser.email || '',
                    profilePicture: currentUser.photoURL || undefined,
                    createdAt: new Date()
                };
            } else if (GoogleSignin) {
                await this.configure();

                const userInfo = await GoogleSignin.signInSilently();

                if (!userInfo.data) {
                    return null;
                }

                return {
                    id: userInfo.data.user.id,
                    email: userInfo.data.user.email,
                    name: userInfo.data.user.name || userInfo.data.user.email,
                    profilePicture: userInfo.data.user.photo || undefined,
                    createdAt: new Date()
                };
            }

            return null;
        } catch (error) {
            console.error('Failed to get current user:', error);
            return null;
        }
    }

    static async isAuthenticated(): Promise<boolean> {
        try {
            if (Platform.OS === 'web') {
                return auth.currentUser !== null;
            } else if (GoogleSignin) {
                await this.configure();
                const currentUser = GoogleSignin.getCurrentUser();
                return currentUser !== null;
            }
            return false;
        } catch (error) {
            console.error('Failed to check authentication status:', error);
            return false;
        }
    }

    static async getTokens(): Promise<{ accessToken: string; idToken?: string } | null> {
        try {
            if (Platform.OS === 'web') {
                const currentUser = auth.currentUser;
                if (!currentUser) return null;

                const idToken = await currentUser.getIdToken();
                return {
                    accessToken: idToken, // For web, we use the ID token as access token
                    idToken: idToken
                };
            } else if (GoogleSignin) {
                await this.configure();
                const tokens = await GoogleSignin.getTokens();
                return {
                    accessToken: tokens.accessToken,
                    idToken: tokens.idToken
                };
            }
            return null;
        } catch (error) {
            console.error('Failed to get tokens:', error);
            return null;
        }
    }

    private static handleAuthError(error: any): AuthResult {
        let errorMessage: string = ERROR_MESSAGES.UNKNOWN_ERROR;

        if (error.code) {
            // Handle Firebase Auth errors (web)
            if (error.code.startsWith('auth/')) {
                switch (error.code) {
                    case 'auth/popup-closed-by-user':
                        errorMessage = ERROR_MESSAGES.AUTH_CANCELLED;
                        break;
                    case 'auth/popup-blocked':
                        errorMessage = ERROR_MESSAGES.PERMISSION_DENIED;
                        break;
                    case 'auth/network-request-failed':
                        errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
                        break;
                    default:
                        errorMessage = ERROR_MESSAGES.AUTH_FAILED;
                }
            }
            // Handle Google Sign-In errors (native)
            else if (statusCodes) {
                switch (error.code) {
                    case statusCodes.SIGN_IN_CANCELLED:
                        errorMessage = ERROR_MESSAGES.AUTH_CANCELLED;
                        break;
                    case statusCodes.IN_PROGRESS:
                        errorMessage = ERROR_MESSAGES.AUTH_FAILED;
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        errorMessage = ERROR_MESSAGES.PERMISSION_DENIED;
                        break;
                    default:
                        errorMessage = ERROR_MESSAGES.AUTH_FAILED;
                }
            }
        }

        return {
            success: false,
            error: errorMessage
        };
    }
}