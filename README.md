# Webflow CMS API

A Next.js application that provides a caching and search API for Webflow CMS collections. This app fetches data from your Webflow CMS, stores it in memory cache (edge runtime), and provides endpoints for searching and managing the cached data.

## Features

- 🚀 **Fetch & Cache**: Pull all items from your Webflow CMS collection and store them in memory
- 🔍 **Search API**: Query cached items by name with pagination support
- 🪝 **Webhook Support**: Automatically refresh cache when CMS is updated
- 📊 **Cache Statistics**: Monitor cache status and last update time
- ⚡ **Edge Runtime**: Optimized for Cloudflare Workers deployment
- 🔄 **Minimal API Calls**: Fast search from memory cache

## Architecture Note

This application uses **in-memory caching** for the edge runtime environment. The cache is stored in memory and will be cleared when the worker restarts. For production use with persistent caching, consider:

1. **Cloudflare KV** - For persistent key-value storage
2. **Cloudflare R2** - For larger JSON file storage
3. **Database** - For more complex queries and relationships

The current implementation prioritizes simplicity and works well for:
- Frequently accessed data
- CMS collections that update regularly via webhooks
- Fast read performance

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Webflow account with API access
- A Webflow site with a CMS collection

### Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Configure environment variables:**

Create a `.env.local` file in the root directory (or update the existing `.env` file):

```env
# Webflow CMS Configuration
WEBFLOW_SITE_ID=your_site_id_here
WEBFLOW_COLLECTION_ID=your_collection_id_here
WEBFLOW_API_TOKEN=your_api_token_here

# Optional: Webflow API host (leave as default)
WEBFLOW_API_HOST=https://api.webflow.com

# Webhook Secret (generate a random string)
WEBHOOK_SECRET=your_webhook_secret_here

# Next.js Base Path (leave empty for local dev)
NEXT_PUBLIC_BASE_PATH=
```

See `ENV_VARIABLES.md` for detailed instructions on obtaining these values.

3. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## API Endpoints

### 1. Fetch & Cache CMS Data

```
GET /api/cms/fetch
```

Fetches all items from your Webflow CMS collection and stores them in memory cache.

**Response:**
```json
{
  "success": true,
  "message": "Successfully fetched and cached 50 items",
  "data": {
    "totalItems": 50,
    "lastUpdated": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Search Cached Items

```
GET /api/cms/search?q=query&limit=10&offset=0
```

Search cached items by name with optional pagination.

**Query Parameters:**
- `q` (optional): Search query to match against item names
- `limit` (optional): Maximum number of results to return
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "success": true,
  "data": {
    "query": "example",
    "results": [
      {
        "id": "123abc",
        "fieldData": {
          "name": "Example Item",
          "slug": "example-item",
          // ... other fields
        }
      }
    ],
    "pagination": {
      "total": 5,
      "limit": 10,
      "offset": 0,
      "returned": 5
    },
    "cache": {
      "lastUpdated": "2024-01-15T10:30:00.000Z",
      "totalItemsInCache": 50
    }
  }
}
```

### 3. Webhook Endpoint

```
POST /api/cms/webhook
```

Configure this endpoint in your Webflow project settings to automatically refresh the cache when CMS items are updated.

**Headers:**
```
Authorization: Bearer your_webhook_secret
```

**Webflow Events to Listen For:**
- `collection_item_created`
- `collection_item_changed`
- `collection_item_deleted`
- `collection_item_unpublished`

### 4. Cache Statistics

```
GET /api/cms/stats
```

Get information about the current cache state.

**Response:**
```json
{
  "success": true,
  "data": {
    "exists": true,
    "itemCount": 50,
    "lastUpdated": "2024-01-15T10:30:00.000Z"
  }
}
```

## Setting Up Webhooks

1. Go to your Webflow project settings
2. Navigate to **Integrations** > **Webhooks**
3. Add a new webhook with:
    - **URL**: `https://your-domain.com/api/cms/webhook`
    - **Trigger Type**: Select all collection item events
    - **Header**: `Authorization: Bearer your_webhook_secret`

## Deployment

### Webflow Cloud

This app is configured for deployment on Webflow Cloud with Cloudflare Workers.

1. Add your `.env` variables to your Webflow Cloud app settings
2. Deploy through the Webflow Cloud dashboard

The app will automatically use the correct base path when deployed.

### Manual Deployment

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── cms/
│   │       ├── fetch/route.ts       # Fetch & cache endpoint
│   │       ├── search/route.ts      # Search endpoint
│   │       ├── webhook/route.ts     # Webhook endpoint
│   │       └── stats/route.ts       # Stats endpoint
│   ├── page.tsx                     # Home page
│   ├── layout.tsx                   # Root layout
│   └── globals.css                  # Global styles
└── lib/
    ├── webflow-client.ts            # Webflow API client
    ├── cache-edge.ts                # Edge-compatible cache management
    └── base-url.ts                  # Base URL config
```

## How It Works

1. **Initial Fetch**: Call `/api/cms/fetch` to pull all items from your Webflow CMS into memory cache
2. **Search**: Use `/api/cms/search` to query the cached data without hitting the Webflow API
3. **Auto-Update**: Configure webhooks so the cache automatically refreshes when you update CMS items in Webflow
4. **Monitor**: Check `/api/cms/stats` to see cache status and last update time

## Cache Behavior

- **In-Memory Storage**: Cache is stored in memory and persists during the worker's lifetime
- **Automatic Refresh**: Use webhooks to keep cache synchronized with CMS updates
- **Fast Access**: All searches happen in memory for maximum performance
- **Cold Start**: After deployment or restart, call `/api/cms/fetch` to initialize the cache

## Important Notes

⚠️ **Cache Persistence**: The in-memory cache will be cleared when the Cloudflare Worker restarts. For production use:

1. Set up webhooks to automatically refresh the cache on CMS updates
2. Consider implementing a scheduled function to periodically refresh the cache
3. For permanent persistence, integrate Cloudflare KV storage

## Example Usage

### Initialize Cache
```bash
curl https://your-domain.com/api/cms/fetch
```

### Search for Items
```bash
curl "https://your-domain.com/api/cms/search?q=product&limit=10"
```

### Check Cache Status
```bash
curl https://your-domain.com/api/cms/stats
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `WEBFLOW_SITE_ID` | Yes | Your Webflow site ID |
| `WEBFLOW_COLLECTION_ID` | Yes | The CMS collection ID to cache |
| `WEBFLOW_API_TOKEN` | Yes | Webflow API access token |
| `WEBFLOW_API_HOST` | No | Custom API host (defaults to api.webflow.com) |
| `WEBHOOK_SECRET` | Recommended | Secret for securing webhook endpoint |
| `NEXT_PUBLIC_BASE_PATH` | No | Base path for deployment (set by Webflow Cloud) |

## Troubleshooting

**Cache not found error?**
- Make sure to call `/api/cms/fetch` first to initialize the cache

**Webhook not working?**
- Verify the webhook URL is correct and publicly accessible
- Check that the `Authorization` header is properly configured
- Ensure `WEBHOOK_SECRET` matches in both .env and Webflow settings

**Environment variables not working?**
- For local development, use `.env.local`
- For production, set environment variables in Webflow Cloud dashboard
- Restart the dev server after changing environment variables

## License

MIT

## Learn More

- [Webflow Data API Documentation](https://developers.webflow.com/data/docs/getting-started-data-api)
- [Next.js Documentation](https://nextjs.org/docs)
- [Webflow Cloud Documentation](https://developers.webflow.com/webflow-cloud/intro)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
