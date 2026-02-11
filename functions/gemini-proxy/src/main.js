import { Client } from 'node-appwrite';

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
 */

export default async ({ req, res, log, error }) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
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
