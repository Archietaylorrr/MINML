// Test function at root level
export async function onRequest() {
  return new Response("Hello from Cloudflare Pages Functions!", {
    headers: { "Content-Type": "text/plain" },
  });
}
