# Contact Form Email Setup - Fix Guide

Your contact form is working (it reaches the server), but **MailChannels is rejecting the emails** (500 error).

## Current Status

✅ Worker deployed and running (`/api/test` works)
✅ Contact form reaches `/api/contact` endpoint
❌ MailChannels returns error when trying to send email

## Quick Diagnosis

First, let's see what error MailChannels is returning:

1. **Try submitting the contact form again**
2. **Open browser DevTools → Console**
3. **Look for the error message** - it should now show more details like:
   ```
   MailChannels returned 403: ...
   ```

Common MailChannels errors:
- **403 Forbidden** → Domain not verified with MailChannels
- **401 Unauthorized** → Missing or invalid DKIM setup
- **550 Sender rejected** → SPF record issues

---

## Solution A: Fix MailChannels (More Complex)

MailChannels requires domain verification and DNS setup.

### Step 1: Add DNS Records

Add these to your Cloudflare DNS:

**SPF Record:**
- **Type:** TXT
- **Name:** `@`
- **Value:** `v=spf1 a mx include:relay.mailchannels.net ~all`

**DMARC Record:**
- **Type:** TXT
- **Name:** `_dmarc`
- **Value:** `v=DMARC1; p=none; rua=mailto:founders@minml.co.uk`

**Domain Lock (Recommended):**
- **Type:** TXT
- **Name:** `_mailchannels`
- **Value:** `v=mc1 cfid=YOURWORKERSUBDOMAIN.workers.dev`

Replace `YOURWORKERSUBDOMAIN` with your actual Worker subdomain.

### Step 2: Update Worker Code

The current worker already has DKIM settings:
```javascript
dkim_domain: "minml.co.uk",
dkim_selector: "mailchannels",
```

But MailChannels might require different settings. Check their docs for your specific setup.

### Step 3: Wait for DNS Propagation

DNS changes can take up to 24 hours to propagate.

Test with:
```bash
dig TXT _mailchannels.minml.co.uk
dig TXT @.minml.co.uk
```

---

## Solution B: Switch to Web3Forms (Recommended - 5 Minutes)

**Web3Forms is simpler and works immediately:**
- ✅ No domain verification needed
- ✅ No DNS setup required
- ✅ Free tier: 250 submissions/month
- ✅ Works in 5 minutes

### Step 1: Get Web3Forms API Key

1. Go to https://web3forms.com
2. Sign up (free)
3. Create a new form
4. Copy your **Access Key** (looks like: `a1b2c3d4-e5f6-...`)

### Step 2: Set Environment Variable in Cloudflare

1. Go to **Cloudflare Dashboard → Workers & Pages**
2. Click on **minml**
3. Go to **Settings → Variables**
4. Add new variable:
   - **Name:** `WEB3FORMS_ACCESS_KEY`
   - **Value:** (paste your access key)
   - Click **"Encrypt"** (optional but recommended)
5. Click **"Save and Deploy"**

### Step 3: Switch to Web3Forms Worker

Replace your current `worker.js` with the Web3Forms version:

```bash
# Backup current worker (optional)
cp worker.js worker-mailchannels.js

# Use Web3Forms version
cp worker-web3forms.js worker.js

# Commit and push
git add worker.js
git commit -m "Switch to Web3Forms for contact form"
git push

# Deploy
npm run build
npx wrangler deploy
```

### Step 4: Test

Submit the contact form - it should work immediately!

---

## Comparison

| Feature | MailChannels | Web3Forms |
|---------|--------------|-----------|
| Setup Time | Hours (DNS propagation) | 5 minutes |
| Domain Verification | Required | Not required |
| DNS Setup | SPF, DMARC, DKIM | None |
| Free Tier | Yes (generous) | 250/month |
| Complexity | High | Low |
| Email Delivery | Direct | Via Web3Forms |

---

## Recommended Approach

### For Production (Right Now):

**Use Web3Forms** - It works immediately and is more reliable for simple contact forms.

### For Future (Optional):

**Switch to MailChannels later** if you need:
- More than 250 submissions/month
- Custom email server control
- Your own email infrastructure

---

## Testing After Setup

### Test 1: Health Check
```
https://minml.co.uk/api/test
```
Should return: `{"status":"ok",...}`

### Test 2: Contact Form
Submit a test message:
- Name: Test User
- Email: test@example.com
- Message: Testing contact form

Should return: `{"success":true,"message":"Thank you..."}`

### Test 3: Check Email
Check `founders@minml.co.uk` inbox for the submission.

---

## Troubleshooting

### Web3Forms Issues

**Issue: "Email service not configured"**
- Make sure WEB3FORMS_ACCESS_KEY environment variable is set
- Click "Save and Deploy" after adding the variable
- Redeploy the worker

**Issue: "Invalid access key"**
- Check that you copied the full access key from Web3Forms
- Make sure there are no extra spaces

**Issue: Emails not arriving**
- Check spam folder
- Verify the access key is correct in Web3Forms dashboard
- Check Web3Forms dashboard for submission logs

### MailChannels Issues

**Issue: 403 Forbidden**
- Add _mailchannels TXT record to DNS
- Wait for DNS propagation (up to 24 hours)

**Issue: Domain verification failed**
- Check SPF record is correctly added
- Verify DKIM selector matches ("mailchannels")

---

## Files in This Repo

- `worker.js` - Current worker (MailChannels version)
- `worker-web3forms.js` - Web3Forms alternative (ready to use)
- `worker-mailchannels.js` - Backup of MailChannels version (if you switch)

---

## Support

**Web3Forms:**
- Docs: https://docs.web3forms.com
- Support: https://web3forms.com/support

**MailChannels:**
- Docs: https://mailchannels.zendesk.com/hc/en-us
- Cloudflare guide: https://support.mailchannels.com/hc/en-us/articles/4565898358413

---

## My Recommendation

**Use Web3Forms.** It's:
- ✅ Faster to set up (5 min vs hours)
- ✅ More reliable (no DNS issues)
- ✅ Easier to maintain
- ✅ Free tier is sufficient for most sites

You can always switch back to MailChannels later if needed.
