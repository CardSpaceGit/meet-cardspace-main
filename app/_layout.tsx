import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { Slot } from 'expo-router';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ENV } from './config/env';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider 
      publishableKey={ENV.CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack initialRouteName="splash">
          <Stack.Screen name="splash" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
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
