import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

export default function ProtectedRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  // Show a loading state while Clerk is loading
  if (!isLoaded) {
    return null;
  }

  // If the user is not signed in, redirect to the sign-in page
  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  // Otherwise, show the protected content
  return (
    <Stack>
      <Stack.Screen name="index" options={{ 
        title: 'Home',
        headerShown: true 
      }} />
      <Stack.Screen name="profile" options={{ 
        title: 'Profile',
        headerShown: true 
      }} />
    </Stack>
  );
} 