// Simple test endpoint - JavaScript version
export async function onRequestGet() {
  return new Response(
    JSON.stringify({
      status: "ok",
      message: "Cloudflare Pages Functions are working!",
      timestamp: new Date().toISOString(),
      language: "JavaScript"
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
