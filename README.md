# Springhealth Marketing Site APIs

A Next.js application providing search and data APIs for Springhealth marketing site content. This application fetches data directly from Webflow's CDN API (`api-cdn.webflow.com`), ensuring fast read access without complex local caching infrastructure.

## Features

- 🚀 **Webflow CDN Integration**: Fetches data directly from Webflow's high-performance CDN
- 🔍 **Search API**: Query items by name with pagination support (filtered in-memory)
- 📄 **Legal Documents API**: Fetch legal documents filtered by country and document type
- ⚡ **Edge Compatible**: Designed to run on modern edge runtimes (Cloudflare Workers)
- 🔄 **Always Fresh**: Data is fetched fresh from the CDN on each request (cached by Webflow)
- 🎨 **Interactive Playground**: Built-in UI for testing API endpoints with live responses
- 🤖 **SEO Protected**: Configured with noindex/nofollow meta tags and X-Robots-Tag headers

## Architecture Note

This application leverages the **Webflow Data Client** with the CDN API host. Instead of maintaining a local cache file or database, it relies on Webflow's global CDN to deliver content quickly. The `search` endpoint fetches the full dataset from the CDN and filters it in-memory, which is efficient for typical CMS collection sizes.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Webflow account with API access
- A Webflow site with CMS collections configured

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
WEBFLOW_API_TOKEN=your_api_token_here

# Collection IDs
WEBFLOW_COVERAGE_ENTRIES_COLLECTION_ID=your_entries_collection_id
WEBFLOW_COVERAGE_STATES_COLLECTION_ID=your_states_collection_id
WEBFLOW_LEGAL_DOCS_COLLECTION_ID=your_legal_docs_collection_id
WEBFLOW_LEGAL_DOC_LANGUAGES_COLLECTION_ID=your_languages_collection_id

# Webflow API host (Required for CDN usage)
WEBFLOW_API_HOST="https://api-cdn.webflow.com/v2"

# Optional: Webhook Secret (for future webhook endpoints)
WEBHOOK_SECRET=your_webhook_secret_here

# Optional: Next.js Base Path (set by Webflow Cloud, leave empty for local dev)
NEXT_PUBLIC_BASE_PATH=

# Optional: API Domain (for absolute URLs)
NEXT_PUBLIC_API_DOMAIN=http://localhost:3000
```

See [`.env.example`](./.env.example) for a complete template.

3. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the interactive API playground.

4. **Build for production:**

```bash
npm run build
```

5. **Deploy to Cloudflare Workers (optional):**

```bash
npm run preview
```

## API Endpoints

### 1. Coverage Entries - Fetch All

```
GET /api/cms/coverage-entries/fetch
```

Fetches all coverage entries from the Webflow CMS collection via the CDN API.

**Response:**

```json
{
  "success": true,
  "message": "Successfully fetched 50 coverage entries and 10 coverage states.",
  "data": {
    "totalCoverageEntries": 50,
    "totalCoverageStates": 10,
    "coverageEntries": [...],
    "coverageStateMap": [...]
  }
}
```

### 2. Coverage Entries - Search

```
GET /api/cms/coverage-entries/search?q=query&limit=10&offset=0
```

Search coverage entries by name with optional pagination. Fetches fresh data from CDN and filters in-memory.

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

### 3. Legal Documents - Fetch

```
GET /api/cms/legal-docs/fetch?country=Global&docType=privacy-policy
```

Fetches legal documents filtered by country and document type.

**Query Parameters:**

- `country` (optional): Filter by country (default: "Global")
- `docType` (optional): Document type - "privacy-policy", "informed-minor-consent-policy", or "terms-of-services" (default: "privacy-policy")
- `excludeByLanguages` (optional): Comma-separated language codes to exclude (e.g., "en,fr")

**Response:**

```json
{
  "success": true,
  "message": "Successfully fetched 1 legal documents.",
  "filters": {
    "country": "Global",
    "docType": "privacy-policy",
    "excludeByLanguages": undefined
  },
  "data": {
    "totalLegalDocs": 1,
    "legalDocs": [...]
  }
}
```

See [API_EXAMPLE_COVERAGE.md](./API_EXAMPLE_COVERAGE.md) for coverage API examples.  
See [API_EXAMPLE_LEGAL_DOCS.md](./API_EXAMPLE_LEGAL_DOCS.md) for legal documents API examples.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── cms/
│   │       ├── coverage-entries/
│   │       │   ├── fetch/route.ts       # Fetch coverage entries endpoint
│   │       │   └── search/route.ts      # Search coverage entries endpoint
│   │       └── legal-docs/
│   │           └── fetch/route.ts       # Fetch legal docs endpoint
│   ├── playground/
│   │   └── page.tsx                     # API playground UI
│   ├── page.tsx                         # Home page with API overview
│   ├── layout.tsx                       # Root layout with SEO meta tags
│   └── globals.css                      # Global styles
├── lib/
│   ├── coverage-entries/
│   │   ├── coverage-data.ts             # Coverage entries data fetching
│   │   └── coverage-maps.ts             # Coverage field mappings
│   ├── legal-docs/
│   │   ├── legal-docs-data.ts           # Legal docs data fetching
│   │   └── legal-docs-maps.ts           # Legal docs field mappings
│   ├── webflow-client.ts                # Webflow API client (shared)
│   ├── domain-validator.ts              # Domain validation (shared)
│   ├── base-url.ts                      # URL utilities (shared)
│   ├── apiRoutes.ts                     # API routes configuration
│   └── utils.ts                         # General utilities (shared)
└── components/
    ├── ApiRouteCard.tsx                 # API route display card
    ├── ParamEditor.tsx                  # Parameter editor component
    ├── PlaygroundClient.tsx             # API playground client
    ├── ResultPanel.tsx                  # Response display panel
    └── ui/                              # shadcn/ui components

```

## Key Files

- **`/src/lib/webflow-client.ts`** - Shared Webflow API client configuration
- **`/src/lib/domain-validator.ts`** - Domain validation for API security
- **`/src/lib/apiRoutes.ts`** - API routes metadata for the playground
- **`/next.config.js`** - Next.js configuration with basePath and X-Robots-Tag headers
- **`/src/app/layout.tsx`** - Root layout with robots meta tags

## Deployment

### Cloudflare Workers (via OpenNext.js)

This project is configured to deploy to Cloudflare Workers using [@opennextjs/cloudflare](https://www.npmjs.com/package/@opennextjs/cloudflare).

```bash
# Build and preview for Cloudflare
npm run preview

# Deploy to Cloudflare
npx wrangler deploy
```

Configuration files:

- `wrangler.jsonc` - Cloudflare Workers configuration
- `open-next.config.ts` - OpenNext.js adapter configuration

### Webflow Cloud

When deploying to Webflow Cloud, the `NEXT_PUBLIC_BASE_PATH` environment variable will be automatically set. The application respects this base path for all routing and asset loading.

## Security

- **Domain Validation**: API endpoints validate the `Origin` header against allowed domains
- **SEO Protection**: Meta robots tags and X-Robots-Tag headers prevent search engine indexing
- **Environment Variables**: Sensitive credentials stored in environment variables

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Preview Cloudflare deployment locally
npm run preview
```

## License

MIT
