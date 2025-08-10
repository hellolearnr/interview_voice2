'use client';

import { useState, useEffect } from 'react';
import AudioDebug from '@/app/debug-audio';
import VapiClientDebug from '@/app/vapi-client-debug';
import UserDebugInfo from '@/app/(main)/dashboard/_components/UserDebugInfo';
import DatabaseDebug from '@/app/(main)/dashboard/_components/DatabaseDebug';
import TestDatabaseInsertion from '@/app/(main)/dashboard/_components/TestDatabaseInsertion';
import AuthDebug from '@/app/(main)/dashboard/_components/AuthDebug';
import TestAPIRoute from '@/app/(main)/dashboard/_components/TestAPIRoute';
import ComprehensiveDebug from '@/app/(main)/dashboard/_components/ComprehensiveDebug';
import InterviewCreationDebug from '@/app/(main)/dashboard/_components/InterviewCreationDebug';
import LocalStorageDebug from '@/app/(main)/dashboard/_components/LocalStorageDebug';
import TestLocalStorage from '@/app/(main)/dashboard/_components/TestLocalStorage';

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runDebugChecks = async () => {
      setLoading(true);
      
      // Check environment variables
      const envChecks = {
        NEXT_PUBLIC_VAPI_KEY: !!process.env.NEXT_PUBLIC_VAPI_KEY,
        NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
      };
      
      // Check if we're in a secure context (required for some audio features)
      const secureContext = typeof window !== 'undefined' ? window.isSecureContext : false;
      
      setDebugInfo({
        env: envChecks,
        secureContext,
      });
      
      setLoading(false);
    };
    
    runDebugChecks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Comprehensive Debug Dashboard</h1>
        
        {loading ? (
          <div className="text-center py-8">Loading debug information...</div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-3 rounded ${debugInfo.env?.NEXT_PUBLIC_VAPI_KEY ? 'bg-green-100' : 'bg-red-100'}`}>
                  <div className="font-medium">VAPI Key</div>
                  <div className="text-sm">{debugInfo.env?.NEXT_PUBLIC_VAPI_KEY ? 'Set' : 'Missing'}</div>
                </div>
                <div className={`p-3 rounded ${debugInfo.env?.NEXT_PUBLIC_SUPABASE_URL ? 'bg-green-100' : 'bg-red-100'}`}>
                  <div className="font-medium">Supabase URL</div>
                  <div className="text-sm">{debugInfo.env?.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing'}</div>
                </div>
                <div className={`p-3 rounded ${debugInfo.env?.OPENAI_API_KEY ? 'bg-green-100' : 'bg-red-100'}`}>
                  <div className="font-medium">OpenAI Key</div>
                  <div className="text-sm">{debugInfo.env?.OPENAI_API_KEY ? 'Set' : 'Missing'}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Browser Context</h2>
              <div className={`p-3 rounded ${debugInfo.secureContext ? 'bg-green-100' : 'bg-yellow-100'}`}>
                <div className="font-medium">Secure Context</div>
                <div className="text-sm">
                  {debugInfo.secureContext 
                    ? 'Yes (required for some audio features)' 
                    : 'No (may affect audio features)'}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">User & Authentication Debug</h2>
          <UserDebugInfo />
          <AuthDebug />
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Database Debug</h2>
          <DatabaseDebug />
          <TestDatabaseInsertion />
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">API & Storage Debug</h2>
          <TestAPIRoute />
          <LocalStorageDebug />
          <TestLocalStorage />
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Comprehensive & Interview Debug</h2>
          <ComprehensiveDebug />
          <InterviewCreationDebug />
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Audio Debug Components</h2>
          <div className="mt-8 text-sm text-gray-600">
            <p>Additional debug components are displayed in the corners of the screen:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Audio Debug - Bottom right corner</li>
              <li>VAPI Debug - Bottom left corner</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Floating debug components */}
      <AudioDebug />
      <VapiClientDebug />
    </div>
  );
}