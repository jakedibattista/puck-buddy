// Welcome screen with hockey-themed authentication

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { AuthButton } from './AuthButton';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorDisplay } from './ErrorDisplay';

const { width, height } = Dimensions.get('window');

export const WelcomeScreen: React.FC = () => {
  const { state, signInWithGoogle, signUpWithGoogle } = useAuth();
  const [authAction, setAuthAction] = useState<'signin' | 'signup' | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setAuthAction('signin');
    setLocalError(null);
    try {
      const result = await signInWithGoogle();
      if (!result.success) {
        setLocalError(result.error || 'Something went wrong. Try again!');
      }
    } catch (error) {
      if (__DEV__) {
        console.error('🏒 Sign in error:', error);
      }
      setLocalError('Something went wrong. Try again!');
    } finally {
      setAuthAction(null);
    }
  };

  const handleSignUp = async () => {
    if (__DEV__) {
      console.log('🏒 Sign up button clicked!');
    }
    setAuthAction('signup');
    setLocalError(null);
    try {
      if (__DEV__) {
        console.log('🏒 Calling signUpWithGoogle...');
      }
      const result = await signUpWithGoogle();
      if (__DEV__) {
        console.log('🏒 Sign up result:', result);
      }
      if (!result.success) {
        setLocalError(result.error || 'Something went wrong. Try again!');
      }
    } catch (error) {
      if (__DEV__) {
        console.error('🏒 Sign up error:', error);
      }
      setLocalError('Something went wrong. Try again!');
    } finally {
      setAuthAction(null);
    }
  };

  if (state.isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner message="Getting ready..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>🏒</Text>
            <Text style={styles.logoText}>Puck Buddy</Text>
          </View>
          <Text style={styles.tagline}>Your hockey adventure starts here!</Text>
        </View>

        {/* Illustration Section */}
        <View style={styles.illustrationContainer}>
          <Text style={styles.illustration}>⛸️🥅🏒</Text>
          <Text style={styles.welcomeText}>
            Ready to hit the ice? Let's get you signed up!
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <AuthButton
            title="Sign Up with Google"
            onPress={handleSignUp}
            variant="primary"
            loading={authAction === 'signup'}
            disabled={state.isLoading || authAction !== null}
          />
          
          <AuthButton
            title="Sign In with Google"
            onPress={handleSignIn}
            variant="secondary"
            loading={authAction === 'signin'}
            disabled={state.isLoading || authAction !== null}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Safe, secure, and parent-approved! 🛡️
          </Text>
        </View>
      </View>

      {/* Error Display Overlay */}
      <ErrorDisplay
        error={localError || state.error}
        onRetry={() => {
          setLocalError(null);
          if (authAction === 'signin') {
            handleSignIn();
          } else if (authAction === 'signup') {
            handleSignUp();
          }
        }}
        onDismiss={() => setLocalError(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: height * 0.08,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E40AF',
    textAlign: 'center',
  },
  tagline: {
    fontSize: 18,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '500',
  },
  illustrationContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  illustration: {
    fontSize: 48,
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 20,
    color: '#334155',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '600',
    maxWidth: width * 0.8,
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 32,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '500',
  },
});