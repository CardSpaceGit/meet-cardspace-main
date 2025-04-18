import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Theme } from '@/constants/Theme';
import { Fonts } from '@/constants/Fonts';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Theme.colors.style_07} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  message: {
    ...Fonts.regular,
    fontSize: 16,
    color: Theme.colors.textSecondary,
    marginTop: 16,
  },
}); 