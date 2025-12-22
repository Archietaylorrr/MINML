// Cloudflare Pages Function to handle contact form submissions
interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

export async function onRequestPost(context: any) {
  // Add CORS headers to all responses
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  try {
    // Parse the form data
    let formData: ContactFormData;
    try {
      formData = await context.request.json();
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

    // Send email using MailChannels API (free for Cloudflare Workers/Pages)
    const emailResponse = await fetch(
      "https://api.mailchannels.net/tx/v1/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: "founders@minml.co.uk", name: "MINML Team" }],
              dkim_domain: "minml.co.uk",
              dkim_selector: "mailchannels",
            },
          ],
          from: {
            email: "noreply@minml.co.uk",
            name: "MINML Contact Form",
          },
          reply_to: {
            email: formData.email,
            name: formData.name,
          },
          subject: `MINML Contact Form - ${formData.company || formData.name}`,
          content: [
            {
              type: "text/plain",
              value: `New contact form submission from minml.co.uk

Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company || "Not provided"}

Message:
${formData.message}

---
Sent from MINML Contact Form`,
            },
            {
              type: "text/html",
              value: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #1a2332; color: white; padding: 20px; text-align: center; }
    .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #555; }
    .value { margin-top: 5px; }
    .message-box { background-color: white; padding: 15px; border-left: 4px solid #1a2332; margin-top: 10px; }
    .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Contact Form Submission</h2>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Name:</div>
        <div class="value">${formData.name}</div>
      </div>
      <div class="field">
        <div class="label">Email:</div>
        <div class="value"><a href="mailto:${formData.email}">${formData.email}</a></div>
      </div>
      ${
        formData.company
          ? `
      <div class="field">
        <div class="label">Company:</div>
        <div class="value">${formData.company}</div>
      </div>
      `
          : ""
      }
      <div class="field">
        <div class="label">Message:</div>
        <div class="message-box">${formData.message.replace(/\n/g, "<br>")}</div>
      </div>
    </div>
    <div class="footer">
      Sent from MINML Contact Form (minml.co.uk)
    </div>
  </div>
</body>
</html>`,
            },
          ],
        }),
      }
    );

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("MailChannels error:", errorText);
      throw new Error("Failed to send email");
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

// Handle OPTIONS request for CORS
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
