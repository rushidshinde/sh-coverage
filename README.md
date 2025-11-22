# Webflow CMS API

A Next.js application that provides a search API for Webflow CMS collections. This app fetches data directly from Webflow's CDN API (`api-cdn.webflow.com`), ensuring fast read access without the need for complex local caching infrastructure.

## Features

- 🚀 **Webflow CDN Integration**: Fetches data directly from Webflow's high-performance CDN
- 🔍 **Search API**: Query items by name with pagination support (filtered in-memory)
- ⚡ **Edge Compatible**: Designed to run on modern edge runtimes
- 🔄 **Always Fresh**: Data is fetched fresh from the CDN on each request (cached by Webflow)

## Architecture Note

This application leverages the **Webflow Data Client** with the CDN API host. Instead of maintaining a local cache file or database, it relies on Webflow's global CDN to deliver content quickly. The `search` endpoint fetches the full dataset from the CDN and filters it in-memory, which is efficient for typical CMS collection sizes.

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

Create a `.env.local` file in the root directory:

```env
# Webflow CMS Configuration
WEBFLOW_SITE_ID=your_site_id_here
WEBFLOW_COVERAGE_ENTRIES_COLLECTION_ID=your_entries_collection_id
WEBFLOW_COVERAGE_STATES_COLLECTION_ID=your_states_collection_id
WEBFLOW_API_TOKEN=your_api_token_here

# Webflow API host (Required for CDN usage)
WEBFLOW_API_HOST="https://api-cdn.webflow.com"

# Next.js Base Path (leave empty for local dev)
NEXT_PUBLIC_BASE_PATH=
```

3. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## API Endpoints

### 1. Fetch CMS Data

```
GET /api/cms/fetch
```

Fetches all items from your Webflow CMS collection via the CDN API.

**Response:**
```json
{
  "success": true,
  "message": "Successfully fetched 50 coverage entries...",
  "data": {
    "totalCoverageEntries": 50,
    "totalCoverageStates": 10,
    "coverageEntries": [...],
    "coverageStateMap": [...]
  }
}
```

### 2. Search Items

```
GET /api/cms/search?q=query&limit=10&offset=0
```

Search items by name with optional pagination. Fetches fresh data from CDN and filters in-memory.

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
    "results": [...],
    "pagination": {
      "total": 5,
      "limit": 10,
      "offset": 0,
      "returned": 5
    }
  }
}
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── cms/
│   │       ├── fetch/route.ts       # Fetch endpoint
│   │       └── search/route.ts      # Search endpoint
│   ├── page.tsx                     # Home page
│   ├── layout.tsx                   # Root layout
│   └── globals.css                  # Global styles
└── lib/
    ├── webflow-client.ts            # Webflow API client
    ├── cms-data.ts                  # Shared data fetching logic
    └── cms-maps.ts                  # CMS field mappings
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `WEBFLOW_SITE_ID` | Yes | Your Webflow site ID |
| `WEBFLOW_COVERAGE_ENTRIES_COLLECTION_ID` | Yes | The main CMS collection ID |
| `WEBFLOW_COVERAGE_STATES_COLLECTION_ID` | Yes | The states CMS collection ID |
| `WEBFLOW_API_TOKEN` | Yes | Webflow API access token |
| `WEBFLOW_API_HOST` | Yes | Set to `https://api-cdn.webflow.com` |
| `NEXT_PUBLIC_BASE_PATH` | No | Base path for deployment |

## License

MIT
