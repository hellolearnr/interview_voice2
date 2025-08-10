// Audio capabilities test utility
export const testAudioCapabilities = () => {
  try {
    const capabilities = {
      audioContext: typeof window !== 'undefined' && (!!window.AudioContext || !!window.webkitAudioContext),
      secureContext: typeof window !== 'undefined' ? window.isSecureContext : false,
      mediaDevices: typeof navigator !== 'undefined' && !!navigator.mediaDevices,
      getUserMedia: typeof navigator !== 'undefined' && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      webAudio: typeof window !== 'undefined' && !!window.AudioContext,
      // Avoid touching AudioContext.prototype to prevent illegal invocation
      worklets: typeof window !== 'undefined' && !!window.AudioWorklet,
    };
    console.log('[AUDIO_DEBUG] Browser audio capabilities:', capabilities);
    return capabilities;
  } catch (e) {
    console.log('[AUDIO_DEBUG] Error collecting audio capabilities:', e);
    return {};
  }
};

// Test if we can load audio worklets (related to KrispSDK issue)
export const testWorkletSupport = async () => {
  try {
    if (!window.AudioContext || !window.AudioWorklet) {
      console.log('[AUDIO_DEBUG] AudioWorklet not supported');
      return false;
    }
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (!audioContext.audioWorklet) {
      console.log('[AUDIO_DEBUG] AudioWorklet not available on AudioContext');
      return false;
    }
    
    console.log('[AUDIO_DEBUG] Audio worklets supported');
    return true;
  } catch (error) {
    console.log('[AUDIO_DEBUG] Error testing worklet support:', error);
    return false;
  }
};

// Debug Vapi initialization
export const debugVapiInit = async () => {
  console.log('[VAPI_DEBUG] Vapi instance initialized');
  
  // Test audio capabilities
  const audioCaps = testAudioCapabilities();
  console.log('[VAPI_DEBUG] Audio capabilities:', audioCaps);
  
  // Test worklet support
  const workletsSupported = await testWorkletSupport();
  console.log('[VAPI_DEBUG] Worklets supported:', workletsSupported);
  
  // Check if we're in a secure context (required for some audio features)
  console.log('[VAPI_DEBUG] Secure context:', window.isSecureContext);
  
  return {
    audioCaps,
    workletsSupported,
    secureContext: window.isSecureContext
  };
};