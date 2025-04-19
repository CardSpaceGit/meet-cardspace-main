// Simple script to debug environment variables
require('dotenv').config();

console.log("Supabase URL:", process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log("Supabase Key (first 10 chars):", 
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? 
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10) + "..." : 
  "MISSING"); 