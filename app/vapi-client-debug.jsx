'use client';

import { useState, useEffect } from 'react';

export default function VapiClientDebug() {
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkVapi = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/vapi-debug');
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      setDebugInfo({ error: error.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    checkVapi();
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 left-4 bg-black text-white p-4 text-xs rounded max-w-xs">
      <h3 className="font-bold mb-2">VAPI Debug</h3>
      {loading ? (
        <div>Checking...</div>
      ) : debugInfo ? (
        <div>
          <div>VAPI Status: {debugInfo.vapi?.status || 'unknown'}</div>
          {debugInfo.vapi?.statusCode && <div>Code: {debugInfo.vapi.statusCode}</div>}
          {debugInfo.vapi?.statusText && <div>Status: {debugInfo.vapi.statusText}</div>}
          {debugInfo.error && <div className="text-red-400">Error: {debugInfo.error}</div>}
        </div>
      ) : (
        <div>No data</div>
      )}
      <button 
        onClick={checkVapi}
        className="mt-2 underline"
      >
        Refresh
      </button>
    </div>
  );
}