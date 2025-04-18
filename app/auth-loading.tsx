import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { hasCompletedOnboarding } from './utils/authUtils';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function AuthLoadingScreen() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isLoaded) {
      // Different timeout for Android and iOS
      const timeoutDuration = Platform.OS === 'android' ? 800 : 500;
      
      const timeout = setTimeout(async () => {
        if (isSignedIn) {
          try {
            // Check if user has completed onboarding
            const onboardingCompleted = await hasCompletedOnboarding();
            
            if (onboardingCompleted) {
              // User has completed onboarding, go to main app
              router.replace('/');
            } else {
              // User has not completed onboarding, go to onboarding
              router.replace('/(protected)/onboarding');
            }
          } catch (error) {
            console.error('Error checking onboarding status:', error);
            // Fallback to index if there's an error checking onboarding status
            router.replace('/');
          }
        } else {
          router.replace('/(auth)/sign-in');
        }
      }, timeoutDuration);
      
      return () => clearTimeout(timeout);
    }
  }, [isLoaded, isSignedIn, router]);
  
  return <LoadingScreen message="Loading your experience..." />;
} 