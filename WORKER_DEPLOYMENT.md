# Cloudflare Worker Deployment Guide

Your site is set up as a **Cloudflare Worker** (not Pages), which uses a different architecture.

## Architecture

- **Worker Script** (`worker.js`) - Handles API routes and serves static assets
- **Static Assets** (`dist/`) - Your built React app
- **Deployment** - Uses `wrangler deploy` command

## How It Works

1. **Build your React app:**
   ```bash
   npm run build
   ```
   This creates the `dist/` directory with your static files.

2. **Deploy to Cloudflare:**
   ```bash
   npx wrangler deploy
   ```
   This deploys:
   - The worker script (`worker.js`)
   - Static assets from `dist/` directory

3. **Worker routing:**
   - `/api/contact` → Handled by contact form function in worker
   - `/api/test` → Returns JSON test response
   - All other routes → Serves static files from `dist/`

## Worker Script Explained

The `worker.js` file:

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle API routes
    if (url.pathname === '/api/contact') {
      return handleContactForm(request);
    }

    // Serve static assets for all other routes
    return env.ASSETS.fetch(request);
  }
};
```

**Key points:**
- API routes are handled first
- Static assets served via `env.ASSETS.fetch(request)`
- This uses Cloudflare Workers Assets feature

## Deployment Process

### Option 1: Deploy from Local Machine

```bash
# Build the React app
npm run build

# Deploy to Cloudflare
npx wrangler deploy
```

### Option 2: Deploy from CI/CD (GitHub Actions)

The worker is automatically deployed when you push to main (if configured).

Your current setup uses `npx wrangler deploy` which is correct for Workers.

## Testing

After deployment, test:

1. **Test endpoint:**
   ```
   https://minml.co.uk/api/test
   ```
   Should return: `{"status":"ok","message":"Cloudflare Worker is working!"}`

2. **Contact form:**
   Submit the form at `https://minml.co.uk/#contact`
   Should send email and show success message

3. **Static site:**
   Visit `https://minml.co.uk`
   Should load your React app

## Configuration

### wrangler.toml

```toml
name = "minml"
main = "worker.js"
compatibility_date = "2024-01-01"

[assets]
directory = "./dist"
```

**Settings:**
- `main` - Points to your worker script
- `assets.directory` - Where your built React app lives

### No Environment Variables Needed

MailChannels works without environment variables for basic setup.

## Troubleshooting

### Issue: 404 on /api/contact

**Cause:** Worker not deployed or route not matching

**Fix:**
1. Make sure you ran `npm run build` first
2. Deploy with `npx wrangler deploy`
3. Check that `worker.js` exists in your repo root

### Issue: Worker deploys but static site doesn't load

**Cause:** `dist/` directory empty or not built

**Fix:**
```bash
npm run build  # Build first
npx wrangler deploy  # Then deploy
```

### Issue: CORS errors

**Cause:** CORS headers not set

**Fix:** The worker already includes CORS headers:
```javascript
{
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}
```

## Development

To test locally:

```bash
# Start local dev server for React app
npm run dev

# In another terminal, test worker locally
npx wrangler dev
```

The worker will run at `http://localhost:8787`

## Differences from Cloudflare Pages

| Feature | Workers (Your Setup) | Pages |
|---------|---------------------|-------|
| Deployment | `wrangler deploy` | Automatic from Git |
| API Routes | Worker script (`worker.js`) | `/functions` directory |
| Static Assets | `[assets]` in wrangler.toml | `dist/` directory |
| Configuration | `wrangler.toml` | Dashboard settings |
| Build Process | Local `npm run build` | Automatic in Pages |

## Next Steps

1. **Build:** `npm run build`
2. **Deploy:** `npx wrangler deploy`
3. **Test:** Visit https://minml.co.uk/api/test

That's it! The contact form should now work.

## Support

- Cloudflare Workers docs: https://developers.cloudflare.com/workers/
- Workers Assets: https://developers.cloudflare.com/workers/configuration/assets/
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/
