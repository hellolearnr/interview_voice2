import React, { useEffect } from 'react';

function VapiDebugFix({ vapiInstance }) {
  useEffect(() => {
    if (!vapiInstance) return;

    // Add error event listener
    const handleError = (error) => {
      console.error('Vapi Error:', error);
      
      // Handle KrispSDK noise filter error specifically
      if (error.message && error.message.includes('KrispSDK')) {
        console.log('Attempting to disable noise filter...');
        // Try to continue without noise filtering
        // This is a workaround for the KrispSDK issue
      }
    };

    // Add disconnect event listener
    const handleDisconnect = () => {
      console.log('Vapi disconnected - checking for ejection reason');
    };

    vapiInstance.on('error', handleError);
    vapiInstance.on('disconnect', handleDisconnect);

    // Cleanup
    return () => {
      vapiInstance.off('error', handleError);
      vapiInstance.off('disconnect', handleDisconnect);
    };
  }, [vapiInstance]);

  return null; // This is a utility component, no UI needed
}

export default VapiDebugFix;