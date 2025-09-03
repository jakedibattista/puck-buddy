// Test screen for authentication

import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { SimpleAuthTest } from '../../components/SimpleAuthTest';

export default function TestScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <SimpleAuthTest />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});