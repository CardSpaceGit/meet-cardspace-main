import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Fonts } from '@/constants/Fonts';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to sign-in page after 4000ms
    const timer = setTimeout(() => {
      router.replace('/sign-in');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/splash-icon.png')} 
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
    width: 150,
    height: 150,
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