import { NextResponse } from 'next/server';
import { supabase } from '@/Services/SupabaseClient';

export async function GET() {
  try {
    // Get actual table schema info for users
    const { data: usersSchema, error: usersSchemaError } = await supabase
      .from('users')
      .select('*')
      .limit(0); // Just get column info
    
    // Get actual table schema info for all_interviews
    const { data: interviewsSchema, error: interviewsSchemaError } = await supabase
      .from('all_interviews')
      .select('*')
      .limit(0); // Just get column info
    
    // Test simple row count (without aggregate functions)
    let usersCount = 0;
    let interviewsCount = 0;
    let usersCountError = null;
    let interviewsCountError = null;
    
    try {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      usersCount = count || 0;
      usersCountError = error;
    } catch (e) {
      usersCountError = e.message;
    }
    
    try {
      const { count, error } = await supabase
        .from('all_interviews')
        .select('*', { count: 'exact', head: true });
      interviewsCount = count || 0;
      interviewsCountError = error;
    } catch (e) {
      interviewsCountError = e.message;
    }
    
    // Test inserting a sample user with correct schema
    const testUser = {
      email: 'debug-test@example.com',
      name: 'Debug Test User',
      picture: 'https://example.com/debug-test.jpg'
      // Note: not including last_login to see if it's missing from schema
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert([testUser])
      .select();
    
    // Clean up test user if inserted
    if (insertData && insertData.length > 0) {
      await supabase
        .from('users')
        .delete()
        .eq('email', 'debug-test@example.com');
    }
    
    return NextResponse.json({
      success: true,
      usersSchema: usersSchemaError ? `Error: ${usersSchemaError.message}` : usersSchema,
      interviewsSchema: interviewsSchemaError ? `Error: ${interviewsSchemaError.message}` : interviewsSchema,
      usersCount: usersCount,
      usersCountError: usersCountError,
      interviewsCount: interviewsCount,
      interviewsCountError: interviewsCountError,
      insertTest: {
        data: insertData,
        error: insertError ? insertError.message : null
      },
      envVars: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
      }
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}