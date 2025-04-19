import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { Redirect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants for storage keys
export const STORAGE_KEYS = {
  HAS_COMPLETED_ONBOARDING: 'hasCompletedOnboarding',
  USER_ONBOARDING_PREFIX: 'userOnboarding_',
};

// Function to mark onboarding as completed for a specific user
export const markOnboardingComplete = async (userId?: string) => {
  try {
    console.log('Marking onboarding complete for user:', userId);
    
    // Try to set both flags (global and user-specific)
    const setFlags = async () => {
      let userSuccess = true;
      let globalSuccess = true;
      
      if (userId) {
        // Store onboarding status per user
        const userSpecificKey = `${STORAGE_KEYS.USER_ONBOARDING_PREFIX}${userId}`;
        try {
          await AsyncStorage.setItem(userSpecificKey, 'true');
          console.log('Set user-specific onboarding status:', userSpecificKey);
        } catch (error) {
          console.error('Error setting user-specific onboarding status:', error);
          userSuccess = false;
        }
      } else {
        console.warn('No userId provided when marking onboarding complete');
        userSuccess = false;
      }
      
      // Also keep the global flag for backward compatibility
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING, 'true');
        console.log('Set global onboarding status');
      } catch (error) {
        console.error('Error setting global onboarding status:', error);
        globalSuccess = false;
      }
      
      return { userSuccess, globalSuccess };
    };
    
    // First attempt
    let { userSuccess, globalSuccess } = await setFlags();
    
    // If either flag wasn't set successfully, try one more time
    if (!userSuccess || !globalSuccess) {
      console.log('Retrying setting onboarding flags...');
      const retryResult = await setFlags();
      userSuccess = retryResult.userSuccess;
      globalSuccess = retryResult.globalSuccess;
    }
    
    // Debug: Verify the value was saved correctly
    const result = await hasCompletedOnboarding(userId);
    console.log('Verification - onboarding marked complete:', result);
    
    // Even if one of the flags was set successfully, consider it a success
    return userSuccess || globalSuccess;
  } catch (error) {
    console.error('Error saving onboarding status:', error);
    return false;
  }
};

// Function to check if user has completed onboarding
export const hasCompletedOnboarding = async (userId?: string): Promise<boolean> => {
  try {
    console.log('Checking if user completed onboarding:', userId);
    
    // Function to safely get AsyncStorage value with retry
    const getStorageValueSafely = async (key: string, retryCount = 0): Promise<string | null> => {
      try {
        return await AsyncStorage.getItem(key);
      } catch (error) {
        console.error(`Error retrieving key ${key}:`, error);
        if (retryCount < 2) { // Retry up to 2 times
          console.log(`Retrying getting ${key}... (${retryCount + 1}/2)`);
          return await getStorageValueSafely(key, retryCount + 1);
        }
        return null;
      }
    };
    
    // Try user-specific status first
    if (userId) {
      const userSpecificKey = `${STORAGE_KEYS.USER_ONBOARDING_PREFIX}${userId}`;
      const userValue = await getStorageValueSafely(userSpecificKey);
      console.log('User-specific onboarding status:', userSpecificKey, '=', userValue);
      
      if (userValue === 'true') {
        console.log('User has completed onboarding (user-specific flag)');
        return true;
      }
    } else {
      console.warn('No userId provided when checking onboarding status');
    }
    
    // Fallback to global flag for backward compatibility
    const globalValue = await getStorageValueSafely(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING);
    console.log('Global onboarding status:', globalValue);
    
    if (globalValue === 'true') {
      console.log('User has completed onboarding (global flag)');
      return true;
    }
    
    console.log('User has NOT completed onboarding');
    return false;
  } catch (error) {
    console.error('Error retrieving onboarding status:', error);
    return false;
  }
};

// Function to clear onboarding status
export const clearOnboardingStatus = async (userId?: string) => {
  try {
    const clearKeys = async () => {
      let userSuccess = true;
      let globalSuccess = true;
      
      if (userId) {
        // Clear user-specific onboarding status
        const userSpecificKey = `${STORAGE_KEYS.USER_ONBOARDING_PREFIX}${userId}`;
        try {
          await AsyncStorage.removeItem(userSpecificKey);
          console.log('Cleared user-specific onboarding status:', userSpecificKey);
        } catch (error) {
          console.error('Error clearing user-specific onboarding status:', error);
          userSuccess = false;
        }
      }
      
      // Also clear the global flag
      try {
        await AsyncStorage.removeItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING);
        console.log('Cleared global onboarding status');
      } catch (error) {
        console.error('Error clearing global onboarding status:', error);
        globalSuccess = false;
      }
      
      return { userSuccess, globalSuccess };
    };
    
    // First attempt
    let { userSuccess, globalSuccess } = await clearKeys();
    
    // If either operation wasn't successful, try one more time
    if (!userSuccess || !globalSuccess) {
      console.log('Retrying clearing onboarding flags...');
      const retryResult = await clearKeys();
      userSuccess = retryResult.userSuccess;
      globalSuccess = retryResult.globalSuccess;
    }
    
    // Consider success if at least one of the operations succeeded
    return userSuccess || globalSuccess;
  } catch (error) {
    console.error('Error clearing onboarding status:', error);
    return false;
  }
};

// Navigate after auth (either login or signup)
export const handlePostAuthNavigation = async (
  route: string,
  router: any,
  isSignedIn?: boolean,
  userId?: string | null
) => {
  try {
    // Use the provided isSignedIn or default to false
    const userIsSignedIn = isSignedIn === true;
    
    // Additional safety check for user authentication
    if (!userIsSignedIn || !userId) {
      console.error('handlePostAuthNavigation called but user is not signed in');
      router.replace("/(auth)/sign-in" as const);
      return;
    }

    console.log('Handling post-auth navigation for route:', route);
    
    // Check if this is a sign-in or sign-up flow
    const isSignUp = route.includes('sign-up') || route.includes('oauth-signup');
    
    // For sign-in (not sign-up), check onboarding status
    if (!isSignUp) {
      console.log('User is signing in, checking if they have completed onboarding');
      
      let attempts = 0;
      let onboardingCompleted = false;
      
      // Try up to 3 times with increasing delays
      while (attempts < 3 && !onboardingCompleted) {
        try {
          onboardingCompleted = await hasCompletedOnboarding(userId);
          if (onboardingCompleted) break;
        } catch (error) {
          console.error(`Attempt ${attempts + 1} failed to check onboarding status:`, error);
        }
        
        attempts++;
        if (attempts < 3) {
          const delay = attempts * 500; // Increasing delay: 500ms, 1000ms
          console.log(`Retrying check onboarding status in ${delay}ms... (${attempts}/3)`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      
      console.log('Onboarding completed status for sign-in user:', onboardingCompleted);
      
      if (onboardingCompleted) {
        console.log('User already completed onboarding, going to main app');
        router.replace("/(protected)" as const);
      } else {
        console.log('User has not completed onboarding, redirecting to onboarding');
        router.replace("/(protected)/onboarding" as const);
      }
      return;
    }
    
    // For sign-up, always direct to onboarding
    console.log('New user (sign-up), redirecting to onboarding');
    router.replace("/(protected)/onboarding" as const);
  } catch (error) {
    console.error('Error during post-auth navigation:', error);
    // Default to onboarding in case of errors
    console.log('Defaulting to onboarding due to error');
    router.replace("/(protected)/onboarding" as const);
  }
};

// Wrapper component to protect routes that require authentication
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();

  // Show loading spinner while Clerk is loading
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6c47ff" />
      </View>
    );
  }

  // Redirect to sign-in if user is not authenticated
  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  // User is authenticated, render the protected content
  return <View>{children}</View>;
}

// Wrapper component to prevent authenticated users from accessing auth screens
export function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();

  // Show loading spinner while Clerk is loading
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6c47ff" />
      </View>
    );
  }

  // Redirect to main app if user is already signed in
  if (isSignedIn) {
    return <Redirect href="/(protected)" />;
  }

  // User is not authenticated, render the auth screen
  return <View>{children}</View>;
} 