'use client';

import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/debug')
      .then(res => res.json())
      .then(data => {
        setDebugInfo(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Debug API error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading debug info...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Debug Information</h1>
      <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
    </div>
  );
}