-- Script to create required tables for the interview application
-- Run this in your Supabase SQL editor

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  picture TEXT,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create all_interviews table
CREATE TABLE IF NOT EXISTS all_interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jobPosition TEXT,
  jobDescription TEXT,
  duration TEXT,
  type TEXT,
  questionList JSONB,
  email TEXT REFERENCES users(email),
  interview_id UUID UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE all_interviews ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);
  
CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for all_interviews table
CREATE POLICY "Users can view their own interviews" ON all_interviews
  FOR SELECT USING (auth.jwt() ->> 'email' = email);
  
CREATE POLICY "Users can insert their own interviews" ON all_interviews
  FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = email);
  
CREATE POLICY "Users can update their own interviews" ON all_interviews
  FOR UPDATE USING (auth.jwt() ->> 'email' = email);
  
CREATE POLICY "Users can delete their own interviews" ON all_interviews
  FOR DELETE USING (auth.jwt() ->> 'email' = email);

-- Grant necessary permissions
GRANT ALL ON TABLE users TO authenticated;
GRANT ALL ON TABLE all_interviews TO authenticated;