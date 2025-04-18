import { useAuth } from '@clerk/clerk-expo';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { hasCompletedOnboarding } from './utils/authUtils';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function OAuthCallbackPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      if (isLoaded) {
        try {
          // Add a small delay to ensure auth state is fully processed
          // Android sometimes needs more time to process navigation
          const timeoutDuration = Platform.OS === 'android' ? 800 : 500;
          
          await new Promise(resolve => setTimeout(resolve, timeoutDuration));
          
          if (isSignedIn) {
            // Check if the user has completed onboarding
            const onboardingCompleted = await hasCompletedOnboarding();
            
            if (onboardingCompleted) {
              // If user already completed onboarding, go to main app
              router.replace('/');
            } else {
              // If first time user, go to onboarding
              router.replace('/(protected)/onboarding');
            }
          } else {
            // If user is not signed in (auth failed or was canceled), redirect to sign in
            router.replace('/(auth)/sign-in');
          }
        } catch (error) {
          console.error('Error during OAuth callback navigation:', error);
          // Fallback to sign-in page on error
          router.replace('/(auth)/sign-in');
        }
      }
    };
    
    checkAuthAndNavigate();
  }, [isLoaded, isSignedIn, router]);

  return <LoadingScreen message="Finishing authentication..." />;
} 