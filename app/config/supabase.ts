import { createClient } from '@supabase/supabase-js';
import { ENV } from './env';

// For debugging - remove in production
console.log("Supabase URL:", ENV.SUPABASE_URL);
console.log("Supabase Key exists:", !!ENV.SUPABASE_ANON_KEY);

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  ENV.SUPABASE_URL || '', 
  ENV.SUPABASE_ANON_KEY || ''
); 