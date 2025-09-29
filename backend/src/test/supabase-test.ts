import { supabase } from '../config/supabase';

async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test query to check if we can connect to the database
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      return;
    }
    
    console.log('Supabase connection successful!');
    console.log('Sample user data:', data);
  } catch (error) {
    console.error('Unexpected error during Supabase test:', error);
  }
}

// Run the test
testSupabaseConnection();