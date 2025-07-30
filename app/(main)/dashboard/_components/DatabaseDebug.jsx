'use client';
import React, { useState } from 'react';
import { supabase } from '@/Services/SupabaseClient';
import { Button } from '@/components/ui/button';

function DatabaseDebug() {
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkUsersTable = async () => {
    setLoading(true);
    try {
      console.log("Database debug started");
      
      // Get current auth user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      console.log("Auth user result:", { authUser, authError });
      
      if (authError) {
        throw new Error(`Auth error: ${authError.message}`);
      }
      
      if (!authUser) {
        throw new Error("No authenticated user found");
      }
      
      // Test database connection and permissions
      console.log("Testing database permissions...");
      const { data: usersCount, error: countError } = await supabase
        .from('users')
        .select('count()', { count: 'exact' });
      console.log("Users count result:", { usersCount, countError });
      
      // Get user from our database
      console.log("Fetching user from database...");
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .eq('email', authUser?.email);
      console.log("Users query result:", { users, usersError });
        
      // Get interviews for this user
      console.log("Fetching interviews from database...");
      const { data: interviews, error: interviewsError } = await supabase
        .from('all_interviews')
        .select('*')
        .eq('email', authUser?.email);
      console.log("Interviews query result:", { interviews, interviewsError });
      
      // Test insert permissions without actually inserting
      console.log("Testing insert permissions...");
      const testInsert = await supabase
        .from('users')
        .insert({ email: 'test@example.com' })
        .select()
        .single();
      console.log("Insert test result:", testInsert);
      
      // Clean up test record if it was created
      if (testInsert.data) {
        await supabase
          .from('users')
          .delete()
          .eq('email', 'test@example.com');
      }
      
      setDebugInfo({
        authUser,
        authError,
        dbUsers: users,
        usersError,
        interviews,
        interviewsError,
        usersCount,
        countError,
        insertTest: testInsert
      });
    } catch (error) {
      console.error("Database debug error:", error);
      setDebugInfo({ error: error.message, errorStack: error.stack });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Database Debug Info</h3>
      <Button onClick={checkUsersTable} disabled={loading} variant="outline" size="sm" className="mb-2">
        {loading ? "Checking..." : "Check Database"}
      </Button>
      
      {debugInfo && (
        <div className="mt-2">
          <pre className="text-xs bg-gray-100 p-2 mt-1 overflow-x-auto max-h-60 overflow-y-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default DatabaseDebug;