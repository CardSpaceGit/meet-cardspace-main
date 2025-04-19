// Environment variables access
export const ENV = {
  CLERK_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
  APP_SCHEME: 'meet-cardspace', // Same as in app.json
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
};

// Helper function to validate if required environment variables are set
export function validateEnv() {
  const missingVars = [];
  
  if (!ENV.CLERK_PUBLISHABLE_KEY) {
    missingVars.push('EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY');
  }

  if (!ENV.SUPABASE_URL) {
    missingVars.push('EXPO_PUBLIC_SUPABASE_URL');
  }

  if (!ENV.SUPABASE_ANON_KEY) {
    missingVars.push('EXPO_PUBLIC_SUPABASE_ANON_KEY');
  }
  
  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
} 