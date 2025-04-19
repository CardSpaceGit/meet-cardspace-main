import { useAuth } from '@clerk/clerk-expo';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Theme } from '@/constants/Theme';
import { Fonts } from '@/constants/Fonts';

/**
 * This component handles the OAuth native callback.
 * It is loaded when OAuth providers redirect back to our app.
 * The URL will look like: exp://192.168.x.x:port/--/oauth-native-callback
 */
export default function OAuthNativeCallbackScreen() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isLoaded) {
      // Small delay to ensure auth state is properly registered
      const timeout = setTimeout(() => {
        console.log("OAuth callback - auth state:", isSignedIn ? "signed in" : "not signed in");
        
        if (isSignedIn) {
          // For signed in users, go to the protected area
          router.replace('/(protected)');
        } else {
          // If auth failed or was canceled, go back to sign-in
          router.replace('/(auth)/sign-in');
        }
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [isLoaded, isSignedIn, router]);
  
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Theme.colors.style_07} />
      <Text style={styles.text}>
        Finishing authentication...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    ...Fonts.regular,
    fontSize: 16,
    color: '#fff',
    marginTop: 16,
  }
}); 