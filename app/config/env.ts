// Environment variables access
export const ENV = {
  CLERK_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
  APP_SCHEME: 'meet-cardspace', // Same as in app.json
};

// Helper function to validate if required environment variables are set
export function validateEnv() {
  const missingVars = [];
  
  if (!ENV.CLERK_PUBLISHABLE_KEY) {
    missingVars.push('EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY');
  }
  
  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
} 