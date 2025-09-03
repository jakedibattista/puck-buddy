// Debug screen to show authentication state

import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { AuthDebug } from '../../components/AuthDebug';

export default function DebugScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <AuthDebug />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});