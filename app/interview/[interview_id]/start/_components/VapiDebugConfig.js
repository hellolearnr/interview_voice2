// Vapi Debug Configuration - Test different settings to avoid KrispSDK issues
const VAPI_DEBUG_CONFIG = {
  // Try disabling noise filtering entirely
  disableNoiseFilter: true,
  
  // Alternative audio settings that might work better
  audioSettings: {
    sampleRate: 16000,  // Lower sample rate
    channels: 1,        // Mono only
    disableKrisp: true, // Explicitly disable Krisp
  },
  
  // Fallback options if primary settings fail
  fallbackOptions: {
    transcriber: {
      provider: "deepgram",
      model: "nova-2-phonecall",  // Different model
      language: "en-US",
    },
    // Simpler voice that might have fewer issues
    voice: {
      provider: "playht",
      voiceId: "default",  // Default voice instead of Jennifer
    }
  },
  
  // Retry configuration for connection issues
  retryConfig: {
    maxRetries: 3,
    retryDelay: 1000,  // 1 second
  }
};

// Debug logging function
export const logVapiDebugInfo = (message, data = null) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[VAPI_DEBUG] ${message}`, data || '');
  }
};

// Function to test browser audio capabilities
export const testAudioCapabilities = () => {
  const capabilities = {
    audioContext: !!window.AudioContext,
    secureContext: window.isSecureContext,
    mediaDevices: !!navigator.mediaDevices,
    getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
  };
  
  logVapiDebugInfo('Browser audio capabilities:', capabilities);
  return capabilities;
};

// Function to handle KrispSDK errors specifically
export const handleKrispError = (error) => {
  logVapiDebugInfo('KrispSDK Error detected:', error.message);
  
  // This is a workaround - the error is often non-fatal
  // The call should continue despite this error
  return {
    shouldContinue: true,
    message: 'Continuing despite audio processing error'
  };
};

// Function to handle meeting ejection errors
export const handleEjectionError = (reason) => {
  logVapiDebugInfo('Meeting ejected:', reason);
  
  return {
    type: 'ejection',
    reason: reason,
    shouldReconnect: reason?.reconnectable || false
  };
};

export default VAPI_DEBUG_CONFIG;