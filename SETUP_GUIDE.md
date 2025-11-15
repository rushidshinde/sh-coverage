# Setup Guide - Webflow CMS API

This guide will walk you through setting up your Webflow CMS API caching system.

## Step 1: Get Your Webflow Credentials

### A. Get Your Site ID

1. Log in to your Webflow account
2. Go to your project's dashboard
3. Click on **Settings** > **Apps & Integrations**
4. Your Site ID will be displayed there (it looks like: `5c3b1a2d4e5f6789abcdef12`)

### B. Get Your Collection ID

1. Open your Webflow project in the Designer
2. Go to the **CMS** panel
3. Click on the collection you want to use
4. Click the **Settings** icon (gear)
5. Look at the URL in your browser - the Collection ID is the long string after `/collections/`
    - Example URL: `https://webflow.com/dashboard/sites/SITE_ID/cms/collections/ABC123XYZ`
    - Collection ID: `ABC123XYZ`

### C. Generate an API Token

1. Go to your Webflow Account Settings: https://webflow.com/dashboard/account
2. Navigate to **Apps & Integrations** > **API Access**
3. Click **Generate API Token**
4. Give it a descriptive name (e.g., "CMS Cache API")
5. Select the appropriate scopes:
    - **CMS**: Read access (required)
    - **Sites**: Read access (required)
6. Copy the generated token (you won't be able to see it again!)

### D. Generate a Webhook Secret

Generate a secure random string for your webhook. You can use one of these methods:

**Using OpenSSL (Mac/Linux):**
```bash
openssl rand -hex 32
```

**Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Online Generator:**
Visit https://www.random.org/strings/ and generate a random string

## Step 2: Configure Environment Variables

### For Local Development

1. Open the `.env` file in the root of your project (it's already created)
2. Replace the placeholder values with your actual credentials:

```env
WEBFLOW_SITE_ID=your_actual_site_id
WEBFLOW_COLLECTION_ID=your_actual_collection_id
WEBFLOW_API_TOKEN=your_actual_api_token
WEBFLOW_API_HOST=https://api.webflow.com
WEBHOOK_SECRET=your_generated_webhook_secret
NEXT_PUBLIC_BASE_PATH=
```

3. Save the file

### For Webflow Cloud Deployment

When deploying to Webflow Cloud, add these same environment variables in your app settings:

1. Go to your Webflow Cloud app dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add each variable:
    - `WEBFLOW_SITE_ID`
    - `WEBFLOW_COLLECTION_ID`
    - `WEBFLOW_API_TOKEN`
    - `WEBFLOW_API_HOST` (optional, defaults to https://api.webflow.com)
    - `WEBHOOK_SECRET`

⚠️ **Important**: The `NEXT_PUBLIC_BASE_PATH` will be automatically set by Webflow Cloud - don't set it manually in production.

## Step 3: Test Locally

1. **Install dependencies** (if you haven't already):
```bash
npm install
```

2. **Start the development server**:
```bash
npm run dev
```

3. **Open your browser** to http://localhost:3000

4. **Initialize the cache** by calling:
```
http://localhost:3000/api/cms/fetch
```

You should see a JSON response like:
```json
{
  "success": true,
  "message": "Successfully fetched and cached 25 items",
  "data": {
    "totalItems": 25,
    "lastUpdated": "2024-01-15T10:30:00.000Z"
  }
}
```

5. **Test the search** by calling:
```
http://localhost:3000/api/cms/search?q=your-search-term
```

6. **Check cache stats**:
```
http://localhost:3000/api/cms/stats
```

## Step 4: Set Up Webhooks (Optional but Recommended)

To automatically update your cache when CMS content changes:

### In Webflow:

1. Go to your Webflow project
2. Navigate to **Project Settings** > **Integrations** > **Webhooks**
3. Click **Add Webhook**
4. Configure:
    - **Name**: "CMS Cache Refresh"
    - **URL**: `https://your-domain.com/api/cms/webhook` (use your actual domain)
    - **Trigger**: Select these events:
        - ✅ Collection Item Created
        - ✅ Collection Item Changed
        - ✅ Collection Item Deleted
        - ✅ Collection Item Unpublished
5. Add a custom header:
    - **Key**: `Authorization`
    - **Value**: `Bearer your_webhook_secret` (use your actual secret)
6. Click **Save**

### Test the Webhook:

1. Make a change to an item in your CMS collection
2. Publish the change
3. Check your app logs to see if the webhook was received
4. Call `/api/cms/stats` to verify the cache was updated

## Step 5: Deploy to Webflow Cloud

1. **Push your code** to your repository
2. **Open Webflow Cloud dashboard**
3. **Configure environment variables** (see Step 2)
4. **Deploy** your app
5. Once deployed, test all endpoints with your production URL
6. **Update your webhook URL** in Webflow to point to your production domain

## Common Issues & Solutions

### "Cache not initialized" error
**Solution**: Call `/api/cms/fetch` to initialize the cache first

### Webhook returns 401 Unauthorized
**Solution**:
- Verify the `Authorization` header is set in Webflow webhook settings
- Check that the header value matches: `Bearer your_webhook_secret`
- Ensure the `WEBHOOK_SECRET` environment variable is set correctly

### Environment variables not loading
**Solution**:
- For local dev, make sure the `.env` file is in the root directory
- Restart your dev server after changing environment variables
- For production, verify variables are set in Webflow Cloud dashboard

### "Failed to fetch CMS data" error
**Solution**:
- Verify your `WEBFLOW_API_TOKEN` is correct and has the right permissions
- Check that `WEBFLOW_SITE_ID` and `WEBFLOW_COLLECTION_ID` are correct
- Ensure your API token hasn't expired

### Cache clears after deployment
**Solution**: This is expected behavior with in-memory caching. Solutions:
- Set up webhooks to auto-refresh cache on CMS updates
- Call `/api/cms/fetch` after deployment to warm up the cache
- For persistent storage, consider implementing Cloudflare KV

## API Endpoints Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/cms/fetch` | GET | Fetch all CMS items and cache them |
| `/api/cms/search?q=query` | GET | Search cached items by name |
| `/api/cms/webhook` | POST | Webhook to refresh cache (secured) |
| `/api/cms/stats` | GET | Get cache statistics |

## Security Best Practices

1. **Never commit** your `.env` file to version control (it's in `.gitignore`)
2. **Use strong webhook secrets** (minimum 32 characters)
3. **Rotate API tokens** periodically
4. **Use HTTPS** in production (Webflow Cloud does this automatically)
5. **Monitor webhook logs** for suspicious activity

## Next Steps

- ✅ Configure your environment variables
- ✅ Test locally
- ✅ Set up webhooks
- ✅ Deploy to Webflow Cloud
- ✅ Test in production
- ✅ Monitor your cache performance

## Need Help?

- 📚 [Webflow Data API Docs](https://developers.webflow.com/data/docs/getting-started-data-api)
- 📚 [Webflow Cloud Docs](https://developers.webflow.com/webflow-cloud/intro)
- 📚 [Next.js Documentation](https://nextjs.org/docs)

## Support

For issues with:
- **Webflow API**: Contact Webflow Support
- **This Application**: Check the README.md and this guide
- **Deployment**: Refer to Webflow Cloud documentation
