// Home screen for authenticated users

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function HomeScreen() {
  const { state } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeEmoji}>🏒</Text>
          <Text style={styles.welcomeTitle}>
            Welcome back, {state.user?.name?.split(' ')[0] || 'Player'}!
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Ready for some hockey fun?
          </Text>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Coming Soon</Text>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>⛸️</Text>
            <Text style={styles.featureTitle}>Ice Time Tracker</Text>
            <Text style={styles.featureDescription}>
              Track your practice sessions and games
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>🥅</Text>
            <Text style={styles.featureTitle}>Goal Counter</Text>
            <Text style={styles.featureDescription}>
              Keep track of your goals and assists
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>🏆</Text>
            <Text style={styles.featureTitle}>Achievements</Text>
            <Text style={styles.featureDescription}>
              Unlock badges and celebrate milestones
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 24,
  },
  welcomeEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E40AF',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  featuresSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 16,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
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
  featureEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
});