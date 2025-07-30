# Debugging Guide for Supabase Issues

This guide will help you identify and fix issues with Supabase table insertions and Google OAuth login.

## Debugging Components

We've added several debugging components to help identify issues:

1. **UserDebugInfo** - Shows user context and auth state
2. **DatabaseDebug** - Checks database connectivity and permissions
3. **TestDatabaseInsertion** - Tests inserting data into the database
4. **AuthDebug** - Checks authentication session and user info
5. **ComprehensiveDebug** - Runs all tests to identify issues
6. **InterviewCreationDebug** - Specifically tests interview creation flow
7. **TestAPIRoute** - Tests the AI model API route

## How to Use the Debugging Tools

1. **Login to the application** using Google OAuth
2. **Navigate to the Dashboard** - you'll see all the debugging components
3. **Run each debug component** one by one to identify where the issue occurs

## Common Issues and Solutions

### 1. Google OAuth Login Issues

Check the following:
- Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correctly set in your `.env.local` file
- Verify Google OAuth is properly configured in your Supabase project dashboard
- Check the redirect URL is correctly set in Google Cloud Console

### 2. Database Insertion Issues

Check the following:
- Ensure the `users` and `all_interviews` tables exist in your Supabase database
- Verify the table schema matches what the application expects:
  - `users` table should have: `id`, `email`, `name`, `picture`, `last_login`
  - `all_interviews` table should have: `id`, `jobPosition`, `jobDescription`, `duration`, `type`, `questionList`, `email`, `interview_id`
- Check that the Supabase service role key has proper permissions for insert operations
- Verify Row Level Security (RLS) policies are correctly configured

### 3. User Context Issues

Check the following:
- Ensure the `Provider` component is correctly wrapping your application
- Verify the `createNewUser` function in `Provider.jsx` is working correctly
- Check that the auth state change listener is properly updating the user context

## Troubleshooting Steps

1. **Run the Comprehensive Debug component** - This will run all tests and give you a complete picture of what's working and what's not

2. **Check the browser console** - Look for any error messages that might give more details about what's failing

3. **Verify Supabase Configuration**:
   - Go to your Supabase project dashboard
   - Check that the Google OAuth provider is enabled and properly configured
   - Verify the database tables exist with the correct schema
   - Check RLS policies on the tables

4. **Check Environment Variables**:
   - Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correctly set
   - Verify `GOOGLE_API_KEY` is set for the AI model

5. **Database Schema Verification**:
   - Run the following SQL in your Supabase SQL editor to check your table structure:
   
   ```sql
   -- Check users table
   SELECT column_name, data_type, is_nullable 
   FROM information_schema.columns 
   WHERE table_name = 'users';
   
   -- Check all_interviews table
   SELECT column_name, data_type, is_nullable 
   FROM information_schema.columns 
   WHERE table_name = 'all_interviews';
   ```

## Additional Debugging Tips

1. **Enable Supabase Debug Logging**:
   Add this to your Supabase client initialization:
   ```javascript
   import { createClient } from '@supabase/supabase-js'
   
   const supabase = createClient(supabaseUrl, supabaseAnonKey, {
     auth: {
       debug: true
     }
   })
   ```

2. **Check Network Tab**:
   In your browser's developer tools, check the Network tab for any failed requests to Supabase.

3. **Verify Table Permissions**:
   In Supabase, go to Table Editor and check that your tables have the correct permissions for authenticated users.