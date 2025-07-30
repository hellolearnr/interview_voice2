export async function GET(request) {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    message: "Interview debug endpoint",
    localStorageKeys: typeof localStorage !== 'undefined' ? Object.keys(localStorage) : "localStorage not available on server"
  };
  
  return new Response(JSON.stringify(debugInfo, null, 2), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}