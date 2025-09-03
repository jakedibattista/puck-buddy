// Loading spinner component for authentication states

import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet
} from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'large' 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.spinnerContainer}>
        <Text style={styles.hockeyEmoji}>🏒</Text>
        <ActivityIndicator size={size} color="#1E40AF" />
      </View>
      {message && (
        <Text style={styles.message}>{message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  spinnerContainer: {
    alignItems: 'center',
    gap: 8,
  },
  hockeyEmoji: {
    fontSize: 24,
    opacity: 0.7,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
});