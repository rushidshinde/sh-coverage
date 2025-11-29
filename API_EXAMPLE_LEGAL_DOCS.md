# Legal Docs API Examples

This document contains example requests and responses for the Legal Docs API endpoints.

## 1. Fetch Legal Documents

Fetches legal documents from Webflow CMS, filtered by country and document type.

### Request

```bash
GET /api/cms/legal-docs/fetch?country={country}&docType={docType}
```

**Query Parameters:**

- `country` (optional): Filter by country (default: "Global"). Options: "Global", "United States".
- `docType` (optional): Document type to fetch (default: "privacy-policy"). Options: "privacy-policy", "informed-minor-consent-policy", "terms-of-services".
- `excludeByLanguages` (optional): Comma-separated list of language codes to exclude (e.g., "en,fr").

### Examples

**Fetch Global Privacy Policy:**

```bash
curl -X GET "http://localhost:3000/api/cms/legal-docs/fetch?country=Global&docType=privacy-policy"
```

**Fetch US Terms of Services:**

```bash
curl -X GET "http://localhost:3000/api/cms/legal-docs/fetch?country=United%20States&docType=terms-of-services"
```

**Fetch Global Privacy Policy excluding English and French:**

```bash
curl -X GET "http://localhost:3000/api/cms/legal-docs/fetch?country=Global&docType=privacy-policy&excludeByLanguages=en,fr"
```

### Success Response

**Privacy Policy Example:**

```json
{
  "success": true,
  "message": "Successfully fetched 1 legal documents.",
  "data": {
    "totalLegalDocs": 1,
    "legalDocs": [
      {
        "id": "6749...",
        "fieldData": {
          "name": "Privacy Policy - Global",
          "slug": "privacy-policy-global",
          "country": "Global",
          "language": {
            "id": "...",
            "fieldData": {
              "name": "English",
              "slug": "english",
              "language-code": "en",
              "text-direction": "LTR"
            }
          },
          "privacy-policy": "<p>Privacy Policy Content...</p>",
          "last-updated-date-privacy-policy": "2024-01-01T00:00:00.000Z"
        }
      }
    ]
  }
}
```

**Terms of Services Example:**

```json
{
  "success": true,
  "message": "Successfully fetched 1 legal documents.",
  "data": {
    "totalLegalDocs": 1,
    "legalDocs": [
      {
        "id": "6749...",
        "fieldData": {
          "name": "Terms of Services - US",
          "slug": "terms-of-services-us",
          "country": "United States",
          "language": { ... },
          "terms-of-services": "<p>Terms Content...</p>",
          "last-updated-date-terms-of-services": "2024-01-01T00:00:00.000Z"
        }
      }
    ]
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

## JavaScript/TypeScript Usage Examples

### Using Fetch API

```typescript
// Fetch Privacy Policy
async function fetchPrivacyPolicy() {
  const response = await fetch(
    "/api/cms/legal-docs/fetch?country=Global&docType=privacy-policy"
  );
  const data = await response.json();
  console.log(data);
}

// Fetch Terms of Services
async function fetchTerms() {
  const response = await fetch(
    "/api/cms/legal-docs/fetch?country=United%20States&docType=terms-of-services"
  );
  const data = await response.json();
  console.log(data);
}

// Fetch Privacy Policy excluding specific languages
async function fetchPrivacyPolicyExcluded() {
  const response = await fetch(
    "/api/cms/legal-docs/fetch?country=Global&docType=privacy-policy&excludeByLanguages=en,fr"
  );
  const data = await response.json();
  console.log(data);
}
```
