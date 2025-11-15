# Environment Variables Setup

Create a `.env.local` file in the root of your project with the following variables:

```env
# Webflow CMS Configuration
# Get these values from your Webflow project settings
WEBFLOW_SITE_ID=your_site_id_here
WEBFLOW_COLLECTION_ID=your_collection_id_here
WEBFLOW_API_TOKEN=your_api_token_here

# Optional: Webflow API host (leave as default unless using a custom endpoint)
WEBFLOW_API_HOST=https://api.webflow.com

# Webhook Secret (generate a random string for security)
WEBHOOK_SECRET=your_webhook_secret_here

# Next.js Base Path (set by Webflow Cloud, leave empty for local dev)
NEXT_PUBLIC_BASE_PATH=
```

## How to get these values:

1. **WEBFLOW_SITE_ID**: Go to your Webflow project settings > General
2. **WEBFLOW_COLLECTION_ID**: In Webflow Designer, go to CMS > Your Collection > Settings (collection ID is in the URL)
3. **WEBFLOW_API_TOKEN**: Generate from Webflow Account Settings > Apps & Integrations > API Access
4. **WEBHOOK_SECRET**: Generate a random string (e.g., use `openssl rand -hex 32`)

## For Webflow Cloud Deployment:

Add these environment variables in the Webflow Cloud dashboard under your app settings.
