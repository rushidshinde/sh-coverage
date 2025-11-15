# API Examples

This document contains example requests and responses for all API endpoints.

## 1. Fetch & Cache CMS Data

Initialize or refresh the cache by fetching all items from Webflow CMS.

### Request

```bash
GET /api/cms/fetch
```

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/cms/fetch"
```

### Success Response

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

### Error Response

```json
{
  "success": false,
  "error": "WEBFLOW_API_TOKEN environment variable is not set"
}
```

---

## 2. Search Cached Items

Search for items in the cache by name with optional pagination.

### Request

```bash
GET /api/cms/search?q={query}&limit={limit}&offset={offset}
```

**Query Parameters:**
- `q` (optional): Search term to match against item names
- `limit` (optional): Maximum number of results
- `offset` (optional): Pagination offset

### Examples

**Search without query (returns all items):**
```bash
curl -X GET "http://localhost:3000/api/cms/search"
```

**Search with query:**
```bash
curl -X GET "http://localhost:3000/api/cms/search?q=product"
```

**Search with pagination:**
```bash
curl -X GET "http://localhost:3000/api/cms/search?q=product&limit=10&offset=0"
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
          "slug": "product-name",
          "description": "Product description here",
          "price": 99.99,
          "image": {
            "url": "https://cdn.webflow.com/image.jpg",
            "alt": "Product image"
          }
        }
      },
      {
        "id": "5f8e2a3b4c5d6e7f8a9b0c2e",
        "fieldData": {
          "name": "Another Product",
          "slug": "another-product",
          "description": "Another product description",
          "price": 149.99
        }
      }
    ],
    "pagination": {
      "total": 2,
      "limit": 10,
      "offset": 0,
      "returned": 2
    },
    "cache": {
      "lastUpdated": "2024-01-15T10:30:00.000Z",
      "totalItemsInCache": 50
    }
  }
}
```

### Error Response (Cache Not Initialized)

```json
{
  "success": false,
  "error": "Cache not initialized. Please call /api/cms/fetch first."
}
```

---

## 3. Webhook Endpoint

Receives webhook events from Webflow and refreshes the cache.

### Request

```bash
POST /api/cms/webhook
```

**Headers:**
```
Authorization: Bearer your_webhook_secret
Content-Type: application/json
```

**Webflow Webhook Payload Example:**
```json
{
  "triggerType": "collection_item_changed",
  "site": "5f8e2a3b4c5d6e7f8a9b0c1d",
  "_id": "5f8e2a3b4c5d6e7f8a9b0c2e"
}
```

### cURL Example

```bash
curl -X POST "http://localhost:3000/api/cms/webhook" \
  -H "Authorization: Bearer your_webhook_secret" \
  -H "Content-Type: application/json" \
  -d '{
    "triggerType": "collection_item_changed",
    "site": "5f8e2a3b4c5d6e7f8a9b0c1d",
    "_id": "5f8e2a3b4c5d6e7f8a9b0c2e"
  }'
```

### Success Response

```json
{
  "success": true,
  "message": "Cache refreshed successfully via webhook",
  "data": {
    "totalItems": 51,
    "lastUpdated": "2024-01-15T11:45:00.000Z",
    "webhookEvent": "collection_item_changed"
  }
}
```

### Error Response (Unauthorized)

```json
{
  "success": false,
  "error": "Unauthorized"
}
```

---

## 4. Cache Statistics

Get information about the current cache state.

### Request

```bash
GET /api/cms/stats
```

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/cms/stats"
```

### Success Response (Cache Exists)

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

### Success Response (Cache Not Initialized)

```json
{
  "success": true,
  "data": {
    "exists": false,
    "itemCount": 0,
    "lastUpdated": null
  }
}
```

---

## Complete Workflow Example

### 1. Initialize the cache
```bash
curl -X GET "http://localhost:3000/api/cms/fetch"
```

### 2. Check cache status
```bash
curl -X GET "http://localhost:3000/api/cms/stats"
```

### 3. Search for items
```bash
curl -X GET "http://localhost:3000/api/cms/search?q=chair&limit=5"
```

### 4. Browse paginated results
```bash
# First page
curl -X GET "http://localhost:3000/api/cms/search?limit=10&offset=0"

# Second page
curl -X GET "http://localhost:3000/api/cms/search?limit=10&offset=10"

# Third page
curl -X GET "http://localhost:3000/api/cms/search?limit=10&offset=20"
```

---

## JavaScript/TypeScript Usage Examples

### Using Fetch API

```typescript
// Initialize cache
async function initializeCache() {
  const response = await fetch('/api/cms/fetch');
  const data = await response.json();
  console.log(data);
}

// Search items
async function searchItems(query: string, limit = 10) {
  const response = await fetch(
    `/api/cms/search?q=${encodeURIComponent(query)}&limit=${limit}`
  );
  const data = await response.json();
  return data.data.results;
}

// Get cache stats
async function getCacheStats() {
  const response = await fetch('/api/cms/stats');
  const data = await response.json();
  return data.data;
}
```

### Using Axios

```typescript
import axios from 'axios';

// Initialize cache
const initCache = async () => {
  const { data } = await axios.get('/api/cms/fetch');
  return data;
};

// Search with parameters
const searchItems = async (query?: string, limit?: number, offset?: number) => {
  const { data } = await axios.get('/api/cms/search', {
    params: { q: query, limit, offset }
  });
  return data.data.results;
};

// Trigger webhook manually (for testing)
const triggerWebhook = async () => {
  const { data } = await axios.post(
    '/api/cms/webhook',
    {
      triggerType: 'collection_item_changed',
      site: 'your_site_id',
      _id: 'item_id'
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.WEBHOOK_SECRET}`
      }
    }
  );
  return data;
};
```

---

## React Component Example

```typescript
import { useState, useEffect } from 'react';

interface CmsItem {
  id: string;
  fieldData: {
    name: string;
    slug: string;
    [key: string]: any;
  };
}

export function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CmsItem[]>([]);
  const [loading, setLoading] = useState(false);

  const searchItems = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/cms/search?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setResults(data.data.results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        searchItems(query);
      }
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search items..."
      />
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {results.map((item) => (
            <li key={item.id}>
              <h3>{item.fieldData.name}</h3>
              <p>{item.fieldData.slug}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

## Error Codes Reference

| Status Code | Meaning | Common Causes |
|-------------|---------|---------------|
| 200 | Success | Request completed successfully |
| 401 | Unauthorized | Invalid webhook secret |
| 404 | Not Found | Cache not initialized (for search endpoint) |
| 500 | Internal Server Error | Invalid credentials, API error, or server issue |

---

## Tips for Production

1. **Always initialize cache after deployment**
   ```bash
   curl -X GET "https://your-domain.com/api/cms/fetch"
   ```

2. **Set up monitoring** to track cache status
    - Use `/api/cms/stats` in a cron job or monitoring service

3. **Implement error handling** in your frontend
   ```typescript
   try {
     const data = await searchItems(query);
     if (!data.success) {
       // Handle error
       console.error(data.error);
     }
   } catch (error) {
     // Handle network error
   }
   ```

4. **Use webhooks** to keep cache in sync
    - Configure in Webflow project settings
    - Test webhook with a real CMS update

5. **Cache warming strategy**
    - Call `/api/cms/fetch` on deployment
    - Set up scheduled refresh (if needed)
    - Monitor cache age via `/api/cms/stats`
