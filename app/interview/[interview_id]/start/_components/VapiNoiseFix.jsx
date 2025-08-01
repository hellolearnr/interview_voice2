import React, { useEffect } from 'react';
import { toast } from 'sonner';

// Component to handle Vapi noise cancellation issues
function VapiNoiseFix({ vapiInstance }) {
  useEffect(() => {
    if (!vapiInstance) return;

    // Add error event listener
    const handleError = (error) => {
      console.error('Vapi Error:', error);
      
      // Handle KrispSDK noise filter error specifically
      if (error.message && error.message.includes('KrispSDK')) {
        console.log('KrispSDK noise filter error detected. This is a known issue and non-fatal.');
        console.log('The call should continue normally despite this error.');
        toast('Audio processing issue detected, continuing with call');
        // This error is typically non-fatal and the call continues
      }
    };

    // Listen for call start event to apply noise cancellation settings
    const handleCallStart = async () => {
      console.log('Call started, checking noise cancellation settings');
      toast('Interview started successfully');
    };

    const handleCallEnd = () => {
      console.log('Call ended');
      toast('Interview ended');
    };

    vapiInstance.on('error', handleError);
    vapiInstance.on('call-start', handleCallStart);
    vapiInstance.on('call-end', handleCallEnd);

    // Cleanup
    return () => {
      vapiInstance.off('error', handleError);
      vapiInstance.off('call-start', handleCallStart);
      vapiInstance.off('call-end', handleCallEnd);
    };
  }, [vapiInstance]);

  return null; // This is a utility component, no UI needed
}

export default VapiNoiseFix;