import React, { useEffect } from 'react';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '../utils/clerk';
import { Alert } from 'react-native';
import { ENV, validateEnv } from '../config/env';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const { isValid, missingVars } = validateEnv();
    
    if (!isValid) {
      console.error("Missing environment variables:", missingVars);
      Alert.alert(
        "Configuration Error", 
        `Missing environment variables: ${missingVars.join(', ')}. Please check your .env file.`
      );
    } else {
      console.log("Clerk key loaded:", ENV.CLERK_PUBLISHABLE_KEY?.substring(0, 10) + "...");
    }
  }, []);

  if (!ENV.CLERK_PUBLISHABLE_KEY) {
    return <>{children}</>; // Return children without Clerk to avoid crashing
  }

  return (
    <ClerkProvider 
      publishableKey={ENV.CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      {children}
    </ClerkProvider>
  );
}; 