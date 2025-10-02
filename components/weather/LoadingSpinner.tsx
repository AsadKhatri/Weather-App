import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Loading weather data...' }: LoadingSpinnerProps) {
  const styles = createStyles();

  return (
    <View style={styles.container}>
      <ActivityIndicator 
        size="large" 
        color="#1a1a1a" 
      />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const createStyles = () => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 16,
    color: '#666666',
    marginTop: 16,
    textAlign: 'center',
  },
});
