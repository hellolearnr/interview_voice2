'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@/app/Provider';
import { supabase } from '@/Services/SupabaseClient';
import { Button } from '@/components/ui/button';

function UserContextDebug() {
  const { user, setUser } = useUser();
  const [authUser, setAuthUser] = useState(null);
  const [dbUsers, setDbUsers] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkAllStates = async () => {
    setLoading(true);
    try {
      // Get auth user
      const { data: { user: supabaseAuthUser }, error: authError } = await supabase.auth.getUser();
      setAuthUser(supabaseAuthUser);
      
      if (supabaseAuthUser?.email) {
        // Get user from database
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('*')
          .eq('email', supabaseAuthUser.email);
        setDbUsers(users);
      }
    } catch (error) {
      console.error("Error in checkAllStates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAllStates();
  }, []);

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <h3 className="font-bold text-lg mb-2">User Context Debug</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <strong>Context User:</strong>
          <pre className="text-xs bg-gray-100 p-2 mt-1 overflow-x-auto max-h-40">
            {user ? JSON.stringify(user, null, 2) : 'null'}
          </pre>
        </div>
        <div>
          <strong>Auth User:</strong>
          <pre className="text-xs bg-gray-100 p-2 mt-1 overflow-x-auto max-h-40">
            {authUser ? JSON.stringify(authUser, null, 2) : 'null'}
          </pre>
        </div>
        <div>
          <strong>DB Users:</strong>
          <pre className="text-xs bg-gray-100 p-2 mt-1 overflow-x-auto max-h-40">
            {dbUsers ? JSON.stringify(dbUsers, null, 2) : 'null'}
          </pre>
        </div>
      </div>
      <Button onClick={checkAllStates} disabled={loading} variant="outline" size="sm">
        {loading ? "Refreshing..." : "Refresh All States"}
      </Button>
    </div>
  );
}

export default UserContextDebug;