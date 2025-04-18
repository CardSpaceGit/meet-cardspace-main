import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants for storage keys
export const STORAGE_KEYS = {
  HAS_COMPLETED_ONBOARDING: 'hasCompletedOnboarding',
};

// Function to mark onboarding as completed
export const markOnboardingComplete = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING, 'true');
    return true;
  } catch (error) {
    console.error('Error saving onboarding status:', error);
    return false;
  }
};

// Function to check if user has completed onboarding
export const hasCompletedOnboarding = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING);
    return value === 'true';
  } catch (error) {
    console.error('Error retrieving onboarding status:', error);
    return false;
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
    return <Redirect href="/" />;
  }

  // User is not authenticated, render the auth screen
  return <View>{children}</View>;
} 