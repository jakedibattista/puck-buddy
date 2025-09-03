// Debug component to show authentication state

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export const AuthDebug: React.FC = () => {
  const { state } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Auth Debug Info</Text>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Is Authenticated:</Text>
          <Text style={styles.value}>{state.isAuthenticated ? '✅ Yes' : '❌ No'}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.label}>Is Loading:</Text>
          <Text style={styles.value}>{state.isLoading ? '⏳ Yes' : '✅ No'}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.label}>Error:</Text>
          <Text style={styles.value}>{state.error || '✅ None'}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.label}>User:</Text>
          <Text style={styles.value}>
            {state.user ? `✅ ${state.user.name} (${state.user.email})` : '❌ None'}
          </Text>
        </View>

        {state.user && (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>User ID:</Text>
              <Text style={styles.value}>{state.user.id}</Text>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.label}>Google ID:</Text>
              <Text style={styles.value}>{state.user.googleId}</Text>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.label}>Created:</Text>
              <Text style={styles.value}>{state.user.createdAt.toLocaleString()}</Text>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.label}>Last Login:</Text>
              <Text style={styles.value}>{state.user.lastLoginAt.toLocaleString()}</Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#334155',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});