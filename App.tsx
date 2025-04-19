import { useEffect } from 'react';
import * as Updates from 'expo-updates';
import { Alert, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ExpoRoot } from 'expo-router';

// Ignore specific warnings that might be noisy during development
LogBox.ignoreLogs([
  'Warning: ...',  // Add specific warnings to ignore here
  'Possible Unhandled Promise Rejection', // Sometimes occurs with Clerk during development
]);

export default function App() {
  // Add error handling for Expo Updates
  useEffect(() => {
    // Set up update error handlers
    const updateErrorListener = Updates.addListener(({ type, message }) => {
      if (type === Updates.UpdateEventType.ERROR) {
        console.log('Update error:', message);
        
        // Don't show alert in production, just log it
        if (__DEV__) {
          Alert.alert(
            'Update Error',
            'Failed to check for updates. The app will continue to work using the current version.',
            [{ text: 'OK' }]
          );
        }
      }
    });

    // Check for updates but handle errors gracefully
    async function checkForUpdates() {
      try {
        const update = await Updates.checkForUpdateAsync();
        
        if (update.isAvailable) {
          try {
            await Updates.fetchUpdateAsync();
            // Only show reload prompt in development
            if (__DEV__) {
              Alert.alert(
                'Update Available',
                'New version downloaded. Restart app to apply changes?',
                [
                  { text: 'Later', style: 'cancel' },
                  { 
                    text: 'Restart', 
                    onPress: async () => {
                      await Updates.reloadAsync();
                    }
                  }
                ]
              );
            } else {
              // In production, just reload silently on next app launch
              console.log('Update downloaded, will apply on next launch');
            }
          } catch (error) {
            console.log('Failed to fetch update:', error);
            // Continue with existing bundle, don't crash the app
          }
        }
      } catch (error) {
        console.log('Failed to check for updates:', error);
        // Continue with existing bundle, don't crash the app
      }
    }

    // Only check for updates in production
    if (!__DEV__) {
      checkForUpdates();
    }

    return () => {
      // Clean up the listener
      updateErrorListener.remove();
    };
  }, []);

  // Use the Expo Router to render the app
  return (
    <SafeAreaProvider>
      <ExpoRoot />
    </SafeAreaProvider>
  );
} 