'use client';

import { useState, useEffect } from 'react';

export default function KrispDebug() {
  const [krispState, setKrispState] = useState({
    workletSupport: 'unknown',
    error: null
  });

  useEffect(() => {
    const checkKrispSupport = async () => {
      try {
        // Check if AudioWorklet is supported
        const workletSupported = typeof window !== 'undefined' && 
          !!window.AudioWorklet && 
          typeof window.AudioContext !== 'undefined';
          
        setKrispState(prev => ({ ...prev, workletSupport: workletSupported ? 'supported' : 'not supported' }));
        
        // Try to create an AudioContext to test further
        if (workletSupported) {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          if (audioContext) {
            setKrispState(prev => ({ ...prev, audioContext: 'created successfully' }));
            
            // Check if audioWorklet is available on the context
            if (audioContext.audioWorklet) {
              setKrispState(prev => ({ ...prev, contextWorklet: 'available' }));
            } else {
              setKrispState(prev => ({ ...prev, contextWorklet: 'not available' }));
            }
          }
        }
      } catch (err) {
        console.error('Krisp debug error:', err);
        setKrispState(prev => ({ ...prev, error: err.message }));
      }
    };

    checkKrispSupport();
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed top-4 left-4 bg-black text-white p-4 text-xs rounded max-w-xs">
      <h3 className="font-bold mb-2">Krisp Debug</h3>
      <div>Worklet Support: {krispState.workletSupport}</div>
      <div>Audio Context: {krispState.audioContext || 'unknown'}</div>
      <div>Context Worklet: {krispState.contextWorklet || 'unknown'}</div>
      {krispState.error && <div className="text-red-400">Error: {krispState.error}</div>}
      <button 
        onClick={() => console.log('Krisp State:', krispState)}
        className="mt-2 underline"
      >
        Log to Console
      </button>
    </div>
  );
}