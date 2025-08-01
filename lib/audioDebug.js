// Audio capabilities test utility
export const testAudioCapabilities = () => {
  const capabilities = {
    audioContext: !!window.AudioContext || !!window.webkitAudioContext,
    secureContext: window.isSecureContext,
    mediaDevices: !!navigator.mediaDevices,
    getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    webAudio: !!window.AudioContext,
    worklets: !!(window.AudioWorklet && window.AudioContext?.prototype?.audioWorklet),
  };
  
  console.log('[AUDIO_DEBUG] Browser audio capabilities:', capabilities);
  return capabilities;
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
export const debugVapiInit = async (vapiInstance) => {
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