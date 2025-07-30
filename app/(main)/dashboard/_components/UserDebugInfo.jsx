'use client';
import React, { useState } from 'react';
import { useUser } from '@/app/Provider';
import { supabase } from '@/Services/SupabaseClient';
import { Button } from '@/components/ui/button';

function UserDebugInfo() {
  const { user } = useUser();
  const [authState, setAuthState] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const checkAuthState = async () => {
    try {
      console.log("Checking auth state...");
      const { data: { user: authUser }, error } = await supabase.auth.getUser();
      console.log("Current auth state - User:", authUser);
      console.log("Current auth state - Error:", error);
      setAuthState({ user: authUser, error });
    } catch (error) {
      console.error("Error checking auth state:", error);
      setAuthState({ error: error.message });
    }
  };
  
  const refreshUser = async () => {
    setRefreshing(true);
    try {
      console.log("Refreshing user data...");
      // Force a refresh of the user data
      const { data: { user: authUser }, error } = await supabase.auth.getUser();
      console.log("Refreshed auth user:", authUser);
      setAuthState({ user: authUser, error });
    } catch (error) {
      console.error("Error refreshing user:", error);
      setAuthState({ error: error.message });
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">User Debug Info</h3>
      <div className="mb-2">
        <strong>Context User:</strong> 
        <pre className="text-xs bg-gray-100 p-2 mt-1 overflow-x-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      <div className="flex gap-2 mb-2">
        <Button onClick={checkAuthState} variant="outline" size="sm">
          Check Auth State
        </Button>
        <Button onClick={refreshUser} disabled={refreshing} variant="outline" size="sm">
          {refreshing ? "Refreshing..." : "Refresh User"}
        </Button>
      </div>
      
      {authState && (
        <div className="mt-2">
          <strong>Auth State:</strong>
          <pre className="text-xs bg-gray-100 p-2 mt-1 overflow-x-auto">
            {JSON.stringify(authState, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default UserDebugInfo;