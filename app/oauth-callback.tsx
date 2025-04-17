import { useAuth } from '@clerk/clerk-expo';
import { View, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function OAuthCallbackPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        // If user is signed in, redirect to the main app
        router.replace('/(tabs)');
      } else {
        // If user is not signed in (auth failed or was canceled), redirect to sign in
        router.replace('/screens/SignInScreen');
      }
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 }}>
      <ActivityIndicator size="large" color="#6c47ff" />
      <Text>Finishing authentication...</Text>
    </View>
  );
} 