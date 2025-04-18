import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Theme } from '@/constants/Theme';
import { Fonts } from '@/constants/Fonts';

interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
}

export function LoadingScreen({ 
  message = 'Loading...', 
  subMessage = 'This may take a moment'
}: LoadingScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color={Theme.colors.style_07} />
        <Text style={styles.message}>{message}</Text>
        {subMessage && <Text style={styles.subMessage}>{subMessage}</Text>}
      </View>
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
  loadingBox: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: 'white',
    width: '80%',
    maxWidth: 300,
  },
  message: {
    ...Fonts.regular,
    fontSize: 18,
    color: Theme.colors.textPrimary,
    marginTop: 16,
    textAlign: 'center',
  },
  subMessage: {
    ...Fonts.regular,
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  }
}); 