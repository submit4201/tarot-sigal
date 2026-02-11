/**
 * Gemini Proxy Function
 * 
 * This function acts as a server-side proxy for Gemini API calls,
 * protecting the API key from client-side exposure.
 * 
 * Environment Variables Required:
 * - GEMINI_API_KEY: Your Google Gemini API key
 * - APPWRITE_FUNCTION_PROJECT_ID: Auto-provided by Appwrite
 * - APPWRITE_FUNCTION_API_KEY: Auto-provided by Appwrite
 * - ALLOWED_ORIGINS: Comma-separated list of allowed origins (optional, defaults to function domain)
 */

export default async ({ req, res, log, error }) => {
  // Get allowed origins from environment or use function domain
  const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['https://sigil.app.cultofthefork.tech'];
  
  const rawOriginHeader = req.headers.origin || req.headers.referer;
  let origin;

  if (rawOriginHeader) {
    try {
      const parsed = new URL(rawOriginHeader);
      origin = `${parsed.protocol}//${parsed.host}`;
    } catch {
      origin = undefined;
    }
  }

  const isAllowedOrigin = !!origin && allowedOrigins.includes(origin);

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': isAllowedOrigin ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Appwrite-Project',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.json({}, 200, headers);
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.json(
      { error: 'Method not allowed. Use POST.' },
      405,
      headers
    );
  }

  // Verify origin
  if (!isAllowedOrigin) {
    error(`Unauthorized origin: ${origin}`);
    return res.json(
      { error: 'Unauthorized origin' },
      403,
      headers
    );
  }

  try {
    // Parse request body
    const body = JSON.parse(req.body || '{}');
    const { prompt, model = 'gemini-pro' } = body;

    if (!prompt) {
      return res.json(
        { error: 'Missing required field: prompt' },
        400,
        headers
      );
    }

    // Get Gemini API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      error('GEMINI_API_KEY not configured');
      return res.json(
        { error: 'Server configuration error' },
        500,
        headers
      );
    }

    log(`Making Gemini API call with model: ${model}`);

    // Make request to Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      error(`Gemini API error: ${errorText}`);
      return res.json(
        { error: 'Failed to generate content', details: errorText },
        geminiResponse.status,
        headers
      );
    }

    const data = await geminiResponse.json();
    
    // Extract the generated text
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    log('Successfully generated content');
    
    return res.json(
      {
        success: true,
        text: generatedText,
        model,
      },
      200,
      headers
    );

  } catch (err) {
    error(`Error: ${err.message}`);
    return res.json(
      { error: 'Internal server error', message: err.message },
      500,
      headers
    );
  }
};
