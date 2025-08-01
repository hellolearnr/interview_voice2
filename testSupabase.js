// testSupabase.js - Run this script to test Supabase connection and operations
// Run with: node testSupabase.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Not set');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Not set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabase() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test table access
    console.log('\nTesting users table access...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count()', { count: 'exact' })
      .limit(1);
    
    if (usersError) {
      console.error('Error accessing users table:', usersError.message);
      console.error('Error details:', usersError);
    } else {
      console.log('Users table accessible');
    }
    
    console.log('\nTesting all_interviews table access...');
    const { data: interviews, error: interviewsError } = await supabase
      .from('all_interviews')
      .select('count()', { count: 'exact' })
      .limit(1);
    
    if (interviewsError) {
      console.error('Error accessing all_interviews table:', interviewsError.message);
      console.error('Error details:', interviewsError);
    } else {
      console.log('all_interviews table accessible');
    }
    
    // Test inserting a sample user
    console.log('\nTesting user insertion...');
    const testUser = {
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/test.jpg',
      last_login: new Date().toISOString()
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert([testUser]);
    
    if (insertError) {
      console.error('Error inserting user:', insertError.message);
      console.error('Error details:', insertError);
    } else {
      console.log('User insertion successful');
      
      // Clean up test user
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('email', 'test@example.com');
      
      if (deleteError) {
        console.error('Error cleaning up test user:', deleteError.message);
      } else {
        console.log('Test user cleaned up successfully');
      }
    }
    
    console.log('\nAll tests completed');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testSupabase();