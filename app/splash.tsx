import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import FastImage from 'react-native-fast-image';
import { Fonts } from '@/constants/Fonts';
import { Theme } from '@/constants/Theme';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to sign-up page after splash screen
    // Give Android slightly more time
    const splashDuration = Platform.OS === 'android' ? 6000 : 5000;
    
    const timer = setTimeout(() => {
      try {
        // Navigate directly to sign-up page instead of auth-loading
        router.replace('/(auth)/sign-up');
      } catch (error) {
        console.error('Navigation error from splash:', error);
        // Fallback to sign-up if navigation fails
        router.replace('/(auth)/sign-up');
      }
    }, splashDuration);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <FastImage 
        source={require('../assets/images/splash.gif')} 
        style={styles.logo}
        resizeMode={FastImage.resizeMode.contain}
      />
      <View style={styles.footer}>
        <Text style={styles.quote}>
          "When something is important enough, you do it even if the odds are not in your favour."
        </Text>
        <Text style={styles.copyright}>CardSpace © 2025.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  logo: {
    width: 240,
    height: 289,
    marginBottom: 20,
  },
  title: {
    fontSize: 40,
    color: '#6c47ff',
    textAlign: 'center',
    ...Fonts.bold,
  },
  subtitle: {
    fontSize: 40,
    color: '#c075ff',
    textAlign: 'center',
    ...Fonts.regular,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
  },
  quote: {
    fontSize: 14,
    color: Theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
    ...Fonts.italic,
  },
  copyright: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    ...Fonts.regular,
  },
}); 