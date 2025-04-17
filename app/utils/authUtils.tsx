import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import React from 'react';
import { View, ActivityIndicator } from 'react-native';

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

  // Redirect to sign in if user is not authenticated
  if (!isSignedIn) {
    return <Redirect href="/screens/SignInScreen" />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
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
    return <Redirect href="/(tabs)" />;
  }

  // User is not authenticated, render the auth screen
  return <>{children}</>;
} 