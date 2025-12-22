// Cloudflare Worker for MINML
// Handles API routes and serves static assets

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle contact form API endpoint
    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContactForm(request);
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

    // For all other requests, serve static assets
    // The Workers Assets feature will handle this automatically
    return env.ASSETS.fetch(request);
  },
};

async function handleContactForm(request) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    // Parse the form data
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

    // Send email using Web3Forms API
    const emailResponse = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        access_key: '88237996-884d-4046-8376-269454520ddc',
        name: formData.name,
        email: formData.email,
        subject: `MINML Contact Form - ${formData.company || formData.name}`,
        message: `Company: ${formData.company || 'Not provided'}\n\nMessage:\n${formData.message}`,
        from_name: 'MINML Contact Form',
      })
    });

    // Parse response safely
    let result;
    try {
      const responseText = await emailResponse.text();
      console.log("Web3Forms raw response:", responseText);
      console.log("Web3Forms status:", emailResponse.status);
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse Web3Forms response:", parseError);
      return new Response(
        JSON.stringify({
          error: "Email service error",
          details: `Invalid response from email service (status: ${emailResponse.status})`
        }),
        {
          status: 502,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!emailResponse.ok || !result.success) {
      console.error("Web3Forms error:", result);
      return new Response(
        JSON.stringify({
          error: "Email service error",
          details: result.message || "Failed to send email",
          debug: result
        }),
        {
          status: 502,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Thank you for your message. We'll be in touch soon!",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to send message. Please try again or email us directly at founders@minml.co.uk",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
}
