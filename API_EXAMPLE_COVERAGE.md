# API Examples

This document contains example requests and responses for the API endpoints.

## 1. Fetch CMS Data

Fetches all items from the Springhealth marketing site content (stored in Webflow CMS) via the CDN API.

### Request

```bash
GET /api/cms/coverage-entries/fetch
```

**cURL Example:**

```bash
curl -X GET "http://localhost:3000/api/cms/coverage-entries/fetch"
```

### Success Response

```json
{
  "success": true,
  "message": "Successfully fetched 50 coverage entries and 10 coverage states.",
  "data": {
    "totalCoverageEntries": 50,
    "totalCoverageStates": 10,
    "coverageEntries": [
      {
        "id": "item_id",
        "fieldData": {
          "name": "Item Name",
          "slug": "item-slug",
          "coverage-type": "Employer",
          // ... other fields
        }
      }
    ],
    "coverageStateMap": [...]
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "WEBFLOW_API_TOKEN environment variable is not set"
}
```

---

## 2. Search Items

Search for items by name with optional pagination.

### Request

```bash
GET /api/cms/coverage-entries/search?q={query}&limit={limit}&offset={offset}
```

**Query Parameters:**

- `q` (optional): Search term to match against item names
- `limit` (optional): Maximum number of results
- `offset` (optional): Pagination offset

### Examples

**Search without query (returns all items):**

```bash
curl -X GET "http://localhost:3000/api/cms/coverage-entries/search"
```

**Search with query:**

```bash
curl -X GET "http://localhost:3000/api/cms/coverage-entries/search?q=product"
```

**Search with pagination:**

```bash
curl -X GET "http://localhost:3000/api/cms/coverage-entries/search?q=product&limit=10&offset=0"
```

### Success Response

```json
{
  "success": true,
  "data": {
    "query": "product",
    "results": [
      {
        "id": "5f8e2a3b4c5d6e7f8a9b0c1d",
        "fieldData": {
          "name": "Product Name",
          "slug": "product-name"
          // ...
        }
      }
    ],
    "pagination": {
      "total": 1,
      "limit": 10,
      "offset": 0,
      "returned": 1
    }
  }
}
```

---

## JavaScript/TypeScript Usage Examples

### Using Fetch API

```typescript
// Fetch all data
async function fetchData() {
  const response = await fetch("/api/cms/coverage-entries/fetch");
  const data = await response.json();
  console.log(data);
}

// Search items
async function searchItems(query: string, limit = 10) {
  const response = await fetch(
    `/api/cms/coverage-entries/search?q=${encodeURIComponent(
      query
    )}&limit=${limit}`
  );
  const data = await response.json();
  return data.data.results;
}
```

### Using Axios

```typescript
import axios from "axios";

// Fetch all data
const fetchData = async () => {
  const { data } = await axios.get("/api/cms/coverage-entries/fetch");
  return data;
};

// Search with parameters
const searchItems = async (query?: string, limit?: number, offset?: number) => {
  const { data } = await axios.get("/api/cms/coverage-entries/search", {
    params: { q: query, limit, offset },
  });
  return data.data.results;
};
```
