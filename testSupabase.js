// testSupabase.js - Run this script to test Supabase connection and operations
// Run with: node testSupabase.js

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabase() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test connection
    const { data, error } = await supabase.rpc('version');
    if (error) throw error;
    console.log('Supabase connection successful');
    console.log('Supabase version:', data);
    
    // Test table access
    console.log('\nTesting users table access...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count()', { count: 'exact' });
    
    if (usersError) {
      console.error('Error accessing users table:', usersError.message);
    } else {
      console.log('Users table accessible');
    }
    
    console.log('\nTesting all_interviews table access...');
    const { data: interviews, error: interviewsError } = await supabase
      .from('all_interviews')
      .select('count()', { count: 'exact' });
    
    if (interviewsError) {
      console.error('Error accessing all_interviews table:', interviewsError.message);
    } else {
      console.log('all_interviews table accessible');
    }
    
    console.log('\nAll tests completed');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testSupabase();