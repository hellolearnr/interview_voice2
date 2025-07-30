'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/Services/SupabaseClient';
import { useUser } from '@/app/Provider';
import { Button } from '@/components/ui/button';

function ComprehensiveDebug() {
  const { user } = useUser();
  const [debugInfo, setDebugInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const runDebugChecks = async () => {
    setLoading(true);
    const info = {};
    
    try {
      // Check user context
      info.userContext = user ? 'Available' : 'Not available';
      info.userEmail = user?.email || 'No email';
      
      // Check Supabase connection
      const { data: connectionData, error: connectionError } = await supabase
        .from('users')
        .select('count()', { count: 'exact' })
        .limit(1);
      
      info.supabaseConnection = connectionError ? `Error: ${connectionError.message}` : 'Connected';
      
      // Check if all_interviews table exists and has correct schema
      const { data: tableData, error: tableError } = await supabase
        .from('all_interviews')
        .select('*')
        .limit(1);
      
      info.tableAccess = tableError ? `Error: ${tableError.message}` : 'Accessible';
      
      // Check specific columns in all_interviews
      if (!tableError) {
        const { data: columnData, error: columnError } = await supabase
          .from('all_interviews')
          .select('email')
          .limit(1);
        
        info.emailColumn = columnError ? `Error: ${columnError.message}` : 'Available';
      }
      
      // Check environment variables
      info.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set';
      info.supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set';
      info.googleApiKey = process.env.GOOGLE_API_KEY ? 'Set' : 'Not set';
      
    } catch (error) {
      console.error('Debug error:', error);
      info.debugError = error.message;
    } finally {
      setDebugInfo(info);
      setLoading(false);
    }
  };

  useEffect(() => {
    runDebugChecks();
  }, [user]);

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-yellow-800">Debug Information</h3>
        <Button 
          onClick={runDebugChecks} 
          disabled={loading}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          {loading ? 'Checking...' : 'Refresh Debug'}
        </Button>
      </div>
      
      <div className="text-sm">
        {Object.entries(debugInfo).map(([key, value]) => (
          <div key={key} className="flex py-1 border-b border-yellow-100">
            <span className="font-medium text-yellow-700 w-40">{key}:</span>
            <span className="text-yellow-900 flex-1">{value?.toString()}</span>
          </div>
        ))}
      </div>
      
      {Object.keys(debugInfo).length === 0 && !loading && (
        <p className="text-yellow-800 text-sm">No debug information available yet.</p>
      )}
    </div>
  );
}

export default ComprehensiveDebug;