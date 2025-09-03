// Simple authentication test component

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { GoogleAuthService } from '../services/GoogleAuthService';
import { User } from '../types/auth';

export const SimpleAuthTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const testGoogleAuth = async () => {
    try {
      setIsLoading(true);
      console.log('🏒 Testing Google Auth...');
      
      const result = await GoogleAuthService.signInWithGoogle();
      console.log('🏒 Auth result:', result);
      
      if (result.success && result.user) {
        setUser(result.user);
        Alert.alert('Success!', `Signed in as ${result.user.name}`);
      } else {
        Alert.alert('Failed', result.error || 'Unknown error');
      }
    } catch (error) {
      console.error('🏒 Auth test failed:', error);
      Alert.alert('Error', 'Authentication test failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await GoogleAuthService.signOut();
      setUser(null);
      Alert.alert('Signed Out', 'You have been signed out');
    } catch (error) {
      console.error('🏒 Sign out failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏒 Google Auth Test</Text>
      
      {user ? (
        <View style={styles.userInfo}>
          <Text style={styles.userText}>✅ Signed in as:</Text>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          
          <TouchableOpacity
            style={[styles.button, styles.signOutButton]}
            onPress={signOut}
            accessibilityRole="button"
            accessibilityLabel="Sign Out"
          >
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.authSection}>
          <Text style={styles.description}>
            Test Google authentication without Firebase
          </Text>
          
          <TouchableOpacity
            style={[styles.button, styles.signInButton]}
            onPress={testGoogleAuth}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel="Test Google Sign In"
            accessibilityState={{ disabled: isLoading }}
          >
            <Text style={styles.buttonText}>
              {isLoading ? '⏳ Testing...' : '🔐 Test Google Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    color: '#1E40AF',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#64748B',
    lineHeight: 24,
  },
  authSection: {
    alignItems: 'center',
  },
  userInfo: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userText: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 8,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 24,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signInButton: {
    backgroundColor: '#1E40AF',
  },
  signOutButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});