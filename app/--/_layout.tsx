import { Stack } from 'expo-router';

/**
 * This layout handles internal routes related to OAuth and deep links
 * The `--` directory is a special Expo Router path for system routes
 */
export default function InternalRoutesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}
    />
  );
} 