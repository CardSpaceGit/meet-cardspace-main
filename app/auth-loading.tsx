import React, { useEffect } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function AuthLoadingScreen() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isLoaded) {
      // Short timeout to allow for state updates to complete
      const timeout = setTimeout(() => {
        if (isSignedIn) {
          router.replace('/(protected)/onboarding');
        } else {
          router.replace('/(auth)/sign-in');
        }
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [isLoaded, isSignedIn, router]);
  
  return <LoadingScreen message="Preparing your experience..." />;
} 