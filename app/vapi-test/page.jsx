"use client";
// Test page for Vapi KrispSDK fix
import React, { useState } from 'react';
import Vapi from '@vapi-ai/web';

export default function VapiTestPage() {
  const [status, setStatus] = useState('idle');
  const [vapiInstance, setVapiInstance] = useState(null);
  
  const startTestCall = async () => {
    try {
      setStatus('initializing');
      
      // Initialize Vapi with your API key
      const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_KEY);
      setVapiInstance(vapi);
      
      // Simple assistant config for testing
      const assistant = {
        name: "Test Assistant",
        firstMessage: "Hello! This is a test call to verify the KrispSDK fix.",
        voice: {
          provider: "playht",
          voiceId: "default",
        },
        model: {
          provider: "openai",
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant for testing audio connections. Keep responses brief."
            }
          ]
        }
      };
      
      // Start with noise suppression disabled
      setStatus('connecting');
      await vapi.start(assistant, {
        user: { 
          noiseSuppression: false,
          noiseCancellation: false,
          autoGainControl: false
        },
        audio: {
          noiseSuppression: false,
          echoCancellation: false,
          autoGainControl: false
        }
      });
      
      setStatus('connected');
    } catch (error) {
      console.error('Test call failed:', error);
      setStatus('error: ' + error.message);
      
      // If it's a KrispSDK error, that's expected and non-fatal
      if (error.message?.includes('KrispSDK')) {
        setStatus('KrispSDK error (non-fatal)');
      }
    }
  };
  
  const stopTestCall = () => {
    if (vapiInstance) {
      vapiInstance.stop();
      setStatus('disconnected');
    }
  };
  
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Vapi KrispSDK Fix Test</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Status: {status}</h2>
        <p className="text-sm text-gray-600 mb-4">
          This test verifies that the KrispSDK error is handled properly.
          The error is non-fatal and calls should continue normally.
        </p>
        
        <div className="flex gap-4">
          <button 
            onClick={startTestCall}
            disabled={status === 'connecting' || status === 'connected'}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          >
            Start Test Call
          </button>
          
          <button 
            onClick={stopTestCall}
            disabled={status !== 'connected'}
            className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-400"
          >
            Stop Test Call
          </button>
        </div>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Expected Behavior:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>If you see a KrispSDK error in the console, that's expected and non-fatal</li>
          <li>The call should continue normally despite the error</li>
          <li>You should be able to have a conversation with the assistant</li>
        </ul>
      </div>
    </div>
  );
}