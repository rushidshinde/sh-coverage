# Springhealth Marketing Site APIs

A Next.js application that provides search and data APIs for Springhealth marketing site content. This app fetches data directly from Webflow's CDN API (`api-cdn.webflow.com`), ensuring fast read access without the need for complex local caching infrastructure.

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
# Springhealth Marketing Site Configuration (using Webflow CMS)
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
GET /api/cms/coverage-entries/fetch
```

Fetches all marketing content items from the Webflow CMS collection via the CDN API.

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
GET /api/cms/coverage-entries/search?q=query&limit=10&offset=0
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
  }
}
```

### 3. Fetch Legal Documents

```
GET /api/cms/legal-docs/fetch?country=Global&docType=privacy-policy
```

Fetches legal documents filtered by country and document type.

**Query Parameters:**

- `country` (optional): Filter by country (default: "Global")
- `docType` (optional): Document type (default: "privacy-policy")

**Response:**

```json
{
  "success": true,
  "data": {
    "totalLegalDocs": 1,
    "legalDocs": [...]
  }
}
```

See [API_EXAMPLE_LEGAL_DOCS.md](./API_EXAMPLE_LEGAL_DOCS.md) for detailed examples.
See [API_EXAMPLE_COVERAGE.md](./API_EXAMPLE_COVERAGE.md) for coverage API examples.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── cms/
│   │       └── coverage-entries/
│   │           ├── fetch/route.ts       # Fetch coverage entries endpoint
│   │           └── search/route.ts      # Search coverage entries endpoint
│   │       └── legal-docs/
│   │           └── fetch/route.ts       # Fetch legal docs endpoint
│   ├── page.tsx                         # Home page
│   ├── layout.tsx                       # Root layout
│   └── globals.css                      # Global styles
├── lib/
│   ├── coverage-entries/
│   │   ├── coverage-data.ts             # Coverage entries data fetching logic
│   │   └── coverage-maps.ts             # Coverage field mappings
│   ├── legal-docs/
│   │   ├── legal-docs-data.ts           # Legal docs data fetching logic
│   │   └── legal-docs-maps.ts           # Legal docs field mappings
│   ├── webflow-client.ts                # Webflow API client (shared)
│   ├── domain-validator.ts              # Domain validation (shared)
│   ├── base-url.ts                      # URL utilities (shared)
│   └── utils.ts                         # General utilities (shared)
└── components/
    └── SearchInterface.tsx              # Search UI component
```

MIT
