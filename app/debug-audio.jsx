'use client';

import { useState, useEffect } from 'react';

export default function AudioDebug() {
  const [audioState, setAudioState] = useState({
    micPermission: 'unknown',
    audioContext: 'unknown',
    devices: [],
    error: null
  });

  useEffect(() => {
    const checkAudio = async () => {
      try {
        // Check microphone permission
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setAudioState(prev => ({ ...prev, micPermission: 'granted' }));
        
        // Check available audio devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter(device => device.kind === 'audioinput');
        setAudioState(prev => ({ ...prev, devices: audioDevices }));
        
        // Try to create audio context
        if (typeof window.AudioContext !== 'undefined' || typeof window.webkitAudioContext !== 'undefined') {
          setAudioState(prev => ({ ...prev, audioContext: 'supported' }));
        } else {
          setAudioState(prev => ({ ...prev, audioContext: 'not supported' }));
        }
        
        // Stop the stream
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.error('Audio debug error:', err);
        setAudioState(prev => ({ ...prev, error: err.message, micPermission: 'denied' }));
      }
    };

    checkAudio();
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 text-xs rounded max-w-xs">
      <h3 className="font-bold mb-2">Audio Debug</h3>
      <div>Microphone: {audioState.micPermission}</div>
      <div>Audio Context: {audioState.audioContext}</div>
      <div>Audio Devices: {audioState.devices.length}</div>
      {audioState.error && <div className="text-red-400">Error: {audioState.error}</div>}
      <button 
        onClick={() => console.log('Audio State:', audioState)}
        className="mt-2 underline"
      >
        Log to Console
      </button>
    </div>
  );
}