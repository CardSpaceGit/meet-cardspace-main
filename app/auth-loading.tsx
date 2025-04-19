import React, { useEffect, useState } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { handlePostAuthNavigation } from './utils/authUtils';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Fonts } from '@/constants/Fonts';
import { Theme } from '@/constants/Theme';

export default function AuthLoadingScreen() {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const route = (params.route as string) || 'auth-loading';

  const [error, setError] = useState<string | null>(null);
  const [authChecks, setAuthChecks] = useState(0);
  const [waitingForAuth, setWaitingForAuth] = useState(true);
  
  // Initial effect to check auth state and wait if needed
  useEffect(() => {
    if (isLoaded) {
      // If userId is not available yet but user is signed in, 
      // wait for auth state to fully propagate
      if (isSignedIn && !userId) {
        console.log("User signed in but ID not available yet, waiting...");
        
        // Check again after a delay, up to 10 times (5 seconds total)
        if (authChecks < 10) {
          const checkDelay = setTimeout(() => {
            console.log(`Auth check attempt ${authChecks + 1}/10`);
            setAuthChecks(prev => prev + 1);
          }, 500);
          
          return () => clearTimeout(checkDelay);
        } else {
          // After max attempts, stop waiting and show error
          setWaitingForAuth(false);
          setError("Authentication is taking longer than expected. Please try again.");
        }
      } else {
        // Auth state is ready (either user not signed in, or user signed in with ID)
        setWaitingForAuth(false);
      }
    }
  }, [isLoaded, isSignedIn, userId, authChecks]);
  
  // Navigation effect that runs after auth state is confirmed ready
  useEffect(() => {
    if (isLoaded && !waitingForAuth) {
      // Different timeout for Android and iOS
      const timeoutDuration = Platform.OS === 'android' ? 800 : 500;
      
      const timeout = setTimeout(async () => {
        try {
          if (isSignedIn && userId) {
            console.log("Auth loading - handling post-auth navigation with user ID:", userId);
            console.log("Route parameter:", route);
            await handlePostAuthNavigation(route, router, isSignedIn, userId);
          } else if (isSignedIn && !userId) {
            console.log("User signed in but no ID available, redirecting to sign-in");
            setError("Unable to retrieve your account details. Please sign in again.");
            setTimeout(() => router.replace('/(auth)/sign-in'), 2000);
          } else {
            console.log("User not signed in, redirecting to sign-in");
            router.replace('/(auth)/sign-in');
          }
        } catch (err) {
          console.error("Navigation error in auth-loading:", err);
          setError("An error occurred during navigation. Please try signing in again.");
          
          // After a brief delay, redirect to sign-in as fallback
          setTimeout(() => {
            router.replace('/(auth)/sign-in');
          }, 2000);
        }
      }, timeoutDuration);
      
      return () => clearTimeout(timeout);
    }
  }, [isLoaded, isSignedIn, router, userId, waitingForAuth, route]);
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <LoadingScreen message="Redirecting you..." />
      </View>
    );
  }
  
  return (
    <LoadingScreen 
      message={waitingForAuth 
        ? "Verifying your authentication..." 
        : "Loading your experience..."
      } 
    />
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20,
    backgroundColor: '#F8F8F8'
  },
  errorText: {
    ...Fonts.regular, 
    color: Theme.colors.style_07, 
    textAlign: 'center', 
    marginBottom: 20
  }
}); 