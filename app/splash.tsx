import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Fonts } from '@/constants/Fonts';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to auth-loading after splash screen
    // Give Android slightly more time
    const splashDuration = Platform.OS === 'android' ? 6000 : 5000;
    
    const timer = setTimeout(() => {
      try {
        // Navigate to auth-loading instead of directly to sign-in
        // This will handle proper routing based on auth state
        router.replace('/auth-loading');
      } catch (error) {
        console.error('Navigation error from splash:', error);
        // Fallback to sign-in if navigation fails
        router.replace('/(auth)/sign-in');
      }
    }, splashDuration);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/splash.gif')} 
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>to CardSpace</Text>
      
      <View style={styles.footer}>
        <Text style={styles.quote}>
          "When something is important enough, you do it even if the odds are not in your favour."
        </Text>
        <Text style={styles.copyright}>CardSpace © 2024.</Text>
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
    resizeMode: 'contain',
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
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    ...Fonts.italic,
  },
  copyright: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    ...Fonts.regular,
  },
}); 