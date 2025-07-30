'use client';
import React, { useState } from 'react';
import { supabase } from '@/Services/SupabaseClient';
import { Button } from '@/components/ui/button';

function AuthDebug() {
  const [sessionInfo, setSessionInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkSession = async () => {
    setLoading(true);
    try {
      console.log("Checking session...");
      const { data, error } = await supabase.auth.getSession();
      console.log("Session data:", { data, error });
      
      // Also get user info
      const { data: userData, error: userError } = await supabase.auth.getUser();
      console.log("User data:", { userData, userError });
      
      setSessionInfo({ 
        sessionData: data, 
        sessionError: error,
        userData: userData,
        userError: userError
      });
    } catch (error) {
      console.error("Session check error:", error);
      setSessionInfo({ error: error.message, errorStack: error.stack });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out...");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("Signed out successfully");
      setSessionInfo(null);
    } catch (error) {
      console.error("Sign out error:", error);
      setSessionInfo({ signOutError: error.message });
    }
  };

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">Auth Debug Info</h3>
      <div className="flex gap-2 mb-2">
        <Button onClick={checkSession} disabled={loading} variant="outline" size="sm">
          {loading ? "Checking..." : "Check Session"}
        </Button>
        <Button onClick={signOut} variant="outline" size="sm">
          Sign Out
        </Button>
      </div>
      
      {sessionInfo && (
        <div className="mt-2">
          <pre className="text-xs bg-gray-100 p-2 mt-1 overflow-x-auto max-h-60 overflow-y-auto">
            {JSON.stringify(sessionInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default AuthDebug;