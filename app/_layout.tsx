import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, SplashScreen as ExpoSplashScreen } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ENV } from './config/env';
import { Fonts } from '@/constants/Fonts';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create a global loading component to use as a fallback
function GlobalLoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#6c47ff" />
      <Text style={styles.loadingText}>Loading your experience...</Text>
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    // Load Century Gothic fonts
    'CenturyGothic': require('../assets/fonts/Century Gothic.otf'),
    'CenturyGothic-Bold': require('../assets/fonts/Century Gothic Bold.otf'),
    'CenturyGothic-Italic': require('../assets/fonts/Century Gothic Italic.otf'),
    'CenturyGothic-BoldItalic': require('../assets/fonts/Century Gothic Bold Italic.otf'),
    // Keep SpaceMono font for backward compatibility
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return <GlobalLoadingScreen />;
  }

  return (
    <ClerkProvider 
      publishableKey={ENV.CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack 
          initialRouteName="splash"
          screenOptions={{
            headerShown: false,
            // Add a global loading screen for all routes
            animation: 'fade',
            // Show loading indicator while navigating between screens
            contentStyle: { backgroundColor: 'white' }
          }}
        >
          <Stack.Screen name="splash" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen 
            name="(auth)" 
            options={{ 
              headerShown: false
            }} 
          />
          <Stack.Screen 
            name="(protected)" 
            options={{ 
              headerShown: false
            }} 
          />
          <Stack.Screen 
            name="auth-loading" 
            options={{ 
              headerShown: false,
              // Custom loading screen for this route
              headerTitle: "Loading"
            }}
          />
          <Stack.Screen name="screens/SignInScreen" options={{ title: 'Sign In' }} />
          <Stack.Screen name="screens/SignUpScreen" options={{ title: 'Sign Up' }} />
          <Stack.Screen name="screens/VerifyCodeScreen" options={{ title: 'Verify Code' }} />
          <Stack.Screen name="oauth-callback" options={{ title: 'Authenticating...' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c47ff',
    ...Fonts.regular,
  }
});
