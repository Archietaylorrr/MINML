// Modified Cloudflare Worker for MINML
// This version reads the Web3Forms access key from an environment variable

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // Handle contact form API endpoint
    if (url.pathname === '/api/contact' && request.method === 'POST') {
      // Pass the environment to the handler so it can read secrets
      return handleContactForm(request, env);
    }
    // Handle test endpoint
    if (url.pathname === '/api/test' && request.method === 'GET') {
      return new Response(
        JSON.stringify({
          status: "ok",
          message: "Cloudflare Worker is working with Web3Forms!",
          timestamp: new Date().toISOString()
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }
    // For all other requests, serve static assets via Workers Assets
    return env.ASSETS.fetch(request);
  },
};

/**
 * Handle POST requests to the contact endpoint.
 * Reads JSON body, validates it, and submits to Web3Forms using the configured API key.
 *
 * @param {Request} request
 * @param {Object} env - The environment variables passed by Cloudflare Workers
 */
async function handleContactForm(request, env) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  try {
    // Parse JSON body
    let formData;
    try {
      formData = await request.json();
    } catch (parseError) {
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    // Retrieve access key from environment variables
    const accessKey = (env && env.WEB3FORMS_ACCESS_KEY) || '';
    if (!accessKey) {
      // If the key is not set, return a service error so the frontend shows a meaningful message
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    // Prepare payload for Web3Forms
    const payload = {
      access_key: accessKey,
      name: formData.name,
      email: formData.email,
      subject: `MINML Contact Form - ${formData.company || formData.name}`,
      message: `Company: ${formData.company || 'Not provided'}\n\nMessage:\n${formData.message}`,
      from_name: 'MINML Contact Form',
    };
    // Send the request to Web3Forms
    // Send the request to Web3Forms
    const emailResponse = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Origin": "https://minml.co.uk",
        "User-Agent": "MINML Contact Form (Cloudflare Worker)",
      },
      body: JSON.stringify(payload),
    });

    // Parse response safely
    let result;
    try {
      const responseText = await emailResponse.text();
      result = JSON.parse(responseText);
    } catch (parseError) {
      return new Response(
        JSON.stringify({
          error: "Email service error",
          details: `Invalid response from email service (status: ${emailResponse.status})`,
        }),
        {
          status: 502,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    // Check for success
    if (!emailResponse.ok || !result.success) {
      return new Response(
        JSON.stringify({
          error: "Email service error",
          details: result.message || "Failed to send email",
        }),
        {
          status: 502,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    // Success response
    return new Response(
      JSON.stringify({ success: true, message: "Thank you for your message. We'll be in touch soon!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    // Catch-all for unexpected errors
    return new Response(
      JSON.stringify({ error: "Failed to send message. Please try again later or email us directly." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
}
