# Contact Form Setup

The contact form uses **Cloudflare Pages Functions** with **MailChannels** to send emails directly from your Cloudflare deployment.

## How It Works

1. User fills out the contact form on your website
2. Form submits to `/api/contact` endpoint (Cloudflare Pages Function)
3. The function validates the data and sends an email via MailChannels
4. You receive the contact form submission at `founders@minml.co.uk`

## Features

✅ **Free** - MailChannels is free for Cloudflare Workers/Pages
✅ **Serverless** - No backend infrastructure needed
✅ **Secure** - Form validation and spam protection
✅ **Professional** - HTML formatted emails with your branding
✅ **Reply-ready** - Emails include reply-to address from the submitter

## Current Setup

The form is **ready to use** with basic configuration. Emails will be sent from `noreply@minml.co.uk` to `founders@minml.co.uk`.

## Optional: Improve Email Deliverability with DKIM (Recommended)

To ensure emails don't go to spam, add DKIM records to your DNS:

### 1. Add DNS Records

Add these TXT records to your `minml.co.uk` DNS in Cloudflare:

**Record 1:**
- **Type:** TXT
- **Name:** `_dmarc`
- **Value:** `v=DMARC1; p=none;`

**Record 2:**
- **Type:** TXT
- **Name:** `mailchannels._domainkey`
- **Value:** (Get this from MailChannels documentation or use their default)

**Record 3 (SPF):**
- **Type:** TXT
- **Name:** `@`
- **Value:** `v=spf1 include:relay.mailchannels.net ~all`

### 2. Verify Setup

After adding DNS records, test the contact form by submitting a message. Check that:
- Email arrives at founders@minml.co.uk
- Email is not in spam folder
- Reply-to address works correctly

## Email Template

Emails include:
- Sender name and email
- Company name (if provided)
- Message content
- HTML formatting for better readability

## Troubleshooting

### Emails not arriving?

1. Check your spam folder
2. Verify DNS records are set up correctly
3. Check Cloudflare Pages Function logs for errors
4. Make sure the function deployed successfully

### Form submission fails?

1. Open browser developer console to see error messages
2. Check that `/api/contact` endpoint is accessible
3. Verify Cloudflare Pages deployment succeeded

## Files

- **Frontend:** `/src/components/CTA.tsx` - Contact form component
- **Backend:** `/functions/api/contact.ts` - Cloudflare Pages Function
- **Config:** Uses MailChannels API (no API key needed)

## Support

If you encounter issues, you can:
- Check MailChannels documentation: https://mailchannels.zendesk.com/hc/en-us
- Review Cloudflare Pages Functions docs: https://developers.cloudflare.com/pages/functions/
