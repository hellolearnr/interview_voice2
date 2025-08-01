// checkSchema.js - Check the actual table schema in Supabase
// Run with: node checkSchema.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
  console.log('Checking table schemas...');
  
  try {
    // Check users table schema
    console.log('\nChecking users table schema...');
    const { data: usersSchema, error: usersSchemaError } = await supabase
      .from('users')
      .select('*')
      .limit(0); // Just get column info
    
    if (usersSchemaError) {
      console.error('Error getting users schema:', usersSchemaError.message);
    } else {
      console.log('Users table columns:');
      if (usersSchema.length > 0) {
        Object.keys(usersSchema[0]).forEach(col => {
          console.log(`  - ${col}`);
        });
      } else {
        console.log('  No columns found or empty result');
      }
    }
    
    // Check all_interviews table schema
    console.log('\nChecking all_interviews table schema...');
    const { data: interviewsSchema, error: interviewsSchemaError } = await supabase
      .from('all_interviews')
      .select('*')
      .limit(0); // Just get column info
    
    if (interviewsSchemaError) {
      console.error('Error getting all_interviews schema:', interviewsSchemaError.message);
    } else {
      console.log('all_interviews table columns:');
      if (interviewsSchema.length > 0) {
        Object.keys(interviewsSchema[0]).forEach(col => {
          console.log(`  - ${col}`);
        });
      } else {
        console.log('  No columns found or empty result');
      }
    }
    
    console.log('\nSchema check completed');
  } catch (error) {
    console.error('Schema check failed:', error.message);
  }
}

checkSchema();