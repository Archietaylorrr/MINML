# Cloudflare Pages Functions Troubleshooting

## Error: 404 on /api/contact

If you're getting a 404 error on `/api/contact`, the Cloudflare Pages Functions aren't deploying correctly.

## Quick Fix Steps

### 1. Verify Functions Are in Git

Check that the `/functions` directory is committed:

```bash
git ls-files functions/
```

You should see:
```
functions/api/contact.ts
functions/api/test.ts
```

If not, commit them:
```bash
git add functions/
git commit -m "Add functions directory"
git push
```

### 2. Check Cloudflare Pages Build Settings

Go to your Cloudflare dashboard → Pages → minml → Settings → Builds & deployments

**Make sure these settings are correct:**

- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `/` (not `/dist`)

⚠️ **IMPORTANT:** If "Root directory" is set to `/dist`, change it to `/` (leave empty or set to root)

The `/functions` directory must be at the repository root level for Cloudflare to find it.

### 3. Test the Function

After fixing the settings, trigger a new deployment. Then test:

**Test endpoint:**
Visit: `https://minml.co.uk/api/test`

You should see:
```json
{
  "status": "ok",
  "message": "Cloudflare Pages Functions are working!",
  "timestamp": "2024-..."
}
```

If this works, the contact form should also work.

### 4. Check Deployment Logs

In Cloudflare dashboard → Pages → minml → Deployments → [Latest deployment] → View build log

Look for:
```
✓ Detected Functions in:
  /functions/api/contact.ts
  /functions/api/test.ts
```

If you don't see this, the functions aren't being detected.

### 5. Common Issues

#### Issue: "Functions not detected"
**Solution:** Make sure:
- Functions are at `/functions/api/contact.ts` (not nested deeper)
- Root directory in Cloudflare Pages settings is `/` (not `/dist`)
- Functions directory is committed to git

#### Issue: "Build succeeds but 404 on functions"
**Solution:**
- Check that you're testing on the main branch deployment
- Feature branch deployments may not support Functions
- Merge to main and test on production URL

#### Issue: "TypeScript compilation errors"
**Solution:**
- Cloudflare Pages automatically compiles TypeScript
- Check build logs for syntax errors
- Make sure @cloudflare/workers-types is installed (optional but recommended)

### 6. Environment Variables (if using)

If you add environment variables later:
1. Go to Settings → Environment variables
2. Add variables for Production and Preview
3. Redeploy for changes to take effect

### 7. Contact Form Specific

Once `/api/test` works, the contact form should work automatically.

If contact form still fails:
1. Open browser DevTools Console
2. Check Network tab for `/api/contact` request
3. Look at the response body for error details

## Directory Structure (Correct)

```
MINML/
├── functions/
│   └── api/
│       ├── contact.ts  ← Creates /api/contact endpoint
│       └── test.ts     ← Creates /api/test endpoint
├── src/
├── public/
├── dist/              ← Build output (gitignored)
└── package.json
```

## Still Not Working?

1. Make sure you merged to `main` branch
2. Check you're testing on production URL (not preview deployment)
3. Clear browser cache and try again
4. Try incognito/private browsing mode

## Need Help?

Check Cloudflare Pages Functions documentation:
https://developers.cloudflare.com/pages/functions/
