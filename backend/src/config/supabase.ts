import { createClient } from '@supabase/supabase-js';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey ? '***' + supabaseAnonKey.substring(supabaseAnonKey.length - 4) : 'Not set');

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration is incomplete. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your environment variables.');
}

// Create Supabase client for frontend operations (with RLS)
// Only create client if URL is valid
export const supabase = supabaseUrl && supabaseUrl.includes('supabase.co') 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Create Supabase client for backend operations (bypasses RLS with service role key)
export const supabaseAdmin = supabaseUrl && supabaseUrl.includes('supabase.co') && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Export a flag to indicate if Supabase is properly configured
export const isSupabaseConfigured = supabaseUrl && supabaseUrl.includes('supabase.co') && supabaseAnonKey;