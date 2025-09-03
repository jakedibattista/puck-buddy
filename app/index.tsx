// Main entry point - handles authentication flow

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { WelcomeScreen } from '../components/WelcomeScreen';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function Index() {
  const { state } = useAuth();

  // Show loading screen while checking authentication
  if (state.isLoading) {
    return (
      <View style={styles.container}>
        <LoadingSpinner message="Starting up..." />
      </View>
    );
  }

  // For testing: Always redirect to tabs (bypass authentication)
  // TODO: Remove this when Firebase is properly configured
  return <Redirect href="/(tabs)" />;

  // Redirect to main app if authenticated
  // if (state.isAuthenticated && state.user) {
  //   return <Redirect href="/(tabs)" />;
  // }

  // Show welcome screen for unauthenticated users
  // return <WelcomeScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});