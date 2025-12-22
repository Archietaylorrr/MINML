# Contact Form - Quick Fix Guide

You're getting a 404 on `/api/contact` because Cloudflare Pages isn't deploying the Functions.

## Critical Checklist

### ✅ Step 1: Verify You Merged to Main Branch

Functions often don't work on preview deployments (feature branches).

**Check:**
- Are you testing on `https://minml.co.uk`? (production)
- Or on a preview URL like `https://xyz-abc.minml.pages.dev`? (preview)

**If testing on preview URL:**
- Merge your PR to `main` branch first
- Test on the production URL `https://minml.co.uk`

### ✅ Step 2: Test the Test Endpoint

Visit: **https://minml.co.uk/api/test**

**Expected result:**
```json
{
  "status": "ok",
  "message": "Cloudflare Pages Functions are working!",
  "timestamp": "..."
}
```

**If you get 404:**
- Functions aren't deploying → Continue to Step 3

**If you get the JSON response:**
- Functions ARE working → The contact endpoint should also work
- Try clearing browser cache and test contact form again

### ✅ Step 3: Check Cloudflare Pages Settings

1. Go to **Cloudflare Dashboard** → **Pages** → **minml**
2. Click **Settings** → **Builds & deployments**
3. Check these settings:

**CRITICAL - Root Directory:**
- Must be: `/` or blank (NOT `/dist`)
- If it says `/dist`, change it to `/`

**Build Settings:**
- Build command: `npm run build`
- Build output directory: `dist`

4. **After changing**, go to **Deployments** tab → Click **"Retry deployment"** on the latest build

### ✅ Step 4: Check Deployment Logs

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **"View build log"**
4. Search for "Functions" in the log

**You should see:**
```
✓ Detected Functions in:
  /functions/api/contact.ts
  /functions/api/test.ts
```

**If you DON'T see this:**
- The functions directory isn't being included
- Root directory setting is likely wrong (see Step 3)

### ✅ Step 5: Verify Git Includes Functions

```bash
git ls-tree -r main --name-only | grep functions
```

Should show:
```
functions/api/contact.ts
functions/api/test.ts
```

If empty, the files aren't in main branch yet.

---

## Alternative Solution: Use Web3Forms (Simpler)

If Cloudflare Pages Functions continue to have issues, use Web3Forms instead:

### Setup (5 minutes):

1. **Get free API key:**
   - Go to https://web3forms.com
   - Sign up (free)
   - Create a new form
   - Copy your Access Key

2. **Update the contact form:**

Replace the `handleSubmit` function in `src/components/CTA.tsx` with:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitStatus({ type: null, message: "" });

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_key: "YOUR_WEB3FORMS_ACCESS_KEY_HERE",
        name: formData.name,
        email: formData.email,
        company: formData.company,
        message: formData.message,
        from_name: "MINML Contact Form",
        subject: `New contact from ${formData.company || formData.name}`,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to send message");
    }

    setSubmitStatus({
      type: "success",
      message: "Thank you for your message. We'll be in touch soon!",
    });

    setFormData({ name: "", email: "", company: "", message: "" });
  } catch (error) {
    setSubmitStatus({
      type: "error",
      message: error instanceof Error ? error.message : "Failed to send message",
    });
  } finally {
    setIsSubmitting(false);
  }
};
```

3. **Deploy and test** - Works immediately, no Cloudflare configuration needed!

**Pros of Web3Forms:**
- ✅ Works immediately (no configuration)
- ✅ Free tier: 250 submissions/month
- ✅ Email notifications
- ✅ Spam protection built-in
- ✅ No backend needed

---

## Recommendation

**Try Steps 1-4 first** to fix Cloudflare Pages Functions.

**If still not working after 30 minutes**, use Web3Forms alternative (much simpler).

## Need Help?

Share these details:
1. Screenshot of Cloudflare Pages build settings
2. Excerpt from deployment logs (search for "Functions")
3. Result of visiting https://minml.co.uk/api/test
