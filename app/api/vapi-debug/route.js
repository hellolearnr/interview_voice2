export async function GET() {
  // Test Vapi API key and connection with more detailed information
  try {
    // Check if API key is set
    const apiKey = process.env.NEXT_PUBLIC_VAPI_KEY;
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          vapi: {
            status: 'error',
            error: 'API key not set in environment variables',
            timestamp: new Date().toISOString()
          }
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Test connection to Vapi API
    const response = await fetch('https://api.vapi.ai/webhook', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    const status = response.status;
    const statusText = response.statusText;
    
    // Try to get response body for more details
    let responseBody = null;
    try {
      responseBody = await response.text();
    } catch (e) {
      // Ignore if we can't read the body
    }
    
    return new Response(
      JSON.stringify({
        vapi: {
          status: response.ok ? 'ok' : 'error',
          statusCode: status,
          statusText: statusText,
          responseBody: responseBody?.substring(0, 200), // First 200 chars
          timestamp: new Date().toISOString()
        }
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        vapi: {
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString()
        }
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}