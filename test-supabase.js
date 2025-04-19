// Script to test Supabase connection
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Get the environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log("Testing Supabase connection with:");
console.log("URL:", supabaseUrl);
console.log("Key (first 10 chars):", supabaseKey ? supabaseKey.substring(0, 10) + "..." : "MISSING");

// Create a Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection by making a simple query
async function testConnection() {
  try {
    // Simple query to test connection
    const { data, error } = await supabase.from('brands').select('count').limit(1);
    
    if (error) {
      console.error("❌ Error connecting to Supabase:", error);
      return;
    }
    
    console.log("✅ Successfully connected to Supabase!");
    console.log("Response:", data);
  } catch (err) {
    console.error("❌ Exception occurred:", err);
  }
}

testConnection(); 