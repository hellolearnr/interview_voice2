import { NextResponse } from 'next/server';
import { supabase } from '@/Services/SupabaseClient';

export async function GET() {
  try {
    // Test Supabase connection
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('count()', { count: 'exact' })
      .limit(1);
    
    // Test all_interviews table access
    const { data: interviewsData, error: interviewsError } = await supabase
      .from('all_interviews')
      .select('*')
      .limit(1);
    
    // Get table schema info
    const { data: schemaData, error: schemaError } = await supabase
      .from('all_interviews')
      .select('*')
      .limit(0); // Just get column info
    
    return NextResponse.json({
      success: true,
      supabaseConnection: usersError ? `Error: ${usersError.message}` : 'Connected',
      tableAccess: interviewsError ? `Error: ${interviewsError.message}` : 'Accessible',
      schema: schemaError ? `Error: ${schemaError.message}` : schemaData,
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