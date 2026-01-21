/**
 * API Routes Configuration
 * 
 * This file defines all available API routes with their parameters,
 * descriptions, and metadata for the dashboard and playground.
 */

export interface ParamOption {
  value: string;
  label: string;
}

export interface RouteParam {
  name: string;
  type: 'text' | 'number' | 'select';
  label: string;
  description: string;
  required: boolean;
  defaultValue: string;
  placeholder?: string;
  example: string;
  options?: ParamOption[];
  min?: number;
}

export interface ApiRoute {
  id: string;
  name: string;
  description: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  slug: string;
  category: string;
  params: RouteParam[];
  exampleResponse: Record<string, any>;
}

export const apiRoutes: ApiRoute[] = [
  {
    id: 'coverage-entries-fetch',
    name: 'Coverage Entries - Fetch All',
    description: 'Fetches all coverage entries from Webflow CMS using the CDN API',
    method: 'GET',
    path: '/api/cms/coverage-entries/fetch',
    slug: 'coverage-entries-fetch',
    category: 'Coverage Entries',
    params: [],
    exampleResponse: {
      success: true,
      message: 'Successfully fetched 50 coverage entries and 10 coverage states.',
      data: {
        totalCoverageEntries: 50,
        totalCoverageStates: 10,
        coverageEntries: [],
        coverageStateMap: []
      }
    }
  },
  {
    id: 'coverage-entries-search',
    name: 'Coverage Entries - Search',
    description: 'Search for coverage entries by name with optional pagination',
    method: 'GET',
    path: '/api/cms/coverage-entries/search',
    slug: 'coverage-entries-search',
    category: 'Coverage Entries',
    params: [
      {
        name: 'q',
        type: 'text',
        label: 'Search Query',
        description: 'Search term to match against item names',
        required: false,
        defaultValue: '',
        placeholder: 'Enter search term...',
        example: 'product'
      },
      {
        name: 'limit',
        type: 'number',
        label: 'Limit',
        description: 'Maximum number of results to return',
        required: false,
        defaultValue: '',
        placeholder: '10',
        example: '10',
        min: 1
      },
      {
        name: 'offset',
        type: 'number',
        label: 'Offset',
        description: 'Number of results to skip (for pagination)',
        required: false,
        defaultValue: '',
        placeholder: '0',
        example: '0',
        min: 0
      }
    ],
    exampleResponse: {
      success: true,
      data: {
        query: 'product',
        results: [],
        pagination: {
          total: 1,
          limit: 10,
          offset: 0,
          returned: 1
        }
      }
    }
  },
  {
    id: 'legal-docs-fetch',
    name: 'Legal Documents - Fetch',
    description: 'Fetch legal documents filtered by document type',
    method: 'GET',
    path: '/api/cms/legal-docs/fetch',
    slug: 'legal-docs-fetch',
    category: 'Legal Documents',
    params: [
      {
        name: 'docType',
        type: 'select',
        label: 'Document Type',
        description: 'Type of legal document to fetch',
        required: false,
        defaultValue: 'privacy-policy',
        options: [
          { value: 'privacy-policy', label: 'Privacy Policy' },
          { value: 'informed-minor-consent-policy', label: 'Informed Minor Consent Policy' },
          { value: 'terms-of-services', label: 'Terms of Services' },
          { value: 'informed-consent-policy', label: 'Informed Consent Policy' },
          { value: 'coppa-notice', label: 'COPPA Notice' },
          { value: 'hipaa-joint-notice', label: 'HIPAA Joint Notice' },
          { value: 'consent-to-qhin', label: 'Consent to QHIN' }
        ],
        example: 'privacy-policy'
      },
      {
        name: 'excludeByLanguages',
        type: 'text',
        label: 'Exclude Languages',
        description: 'Comma-separated language codes to exclude (e.g., "en,fr")',
        required: false,
        defaultValue: '',
        placeholder: 'en,fr',
        example: 'en,fr'
      }
    ],
    exampleResponse: {
      success: true,
      message: 'Successfully fetched legal documents',
      filters: {
        docType: 'privacy-policy',
        excludeByLanguages: undefined
      },
      data: {
        totalLegalDocs: 5,
        legalDocs: []
      }
    }
  }
];

/**
 * Get route by slug
 */
export function getRouteBySlug(slug: string): ApiRoute | undefined {
  return apiRoutes.find(route => route.slug === slug);
}

/**
 * Get base API domain
 */
export function getApiDomain(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_API_DOMAIN || 'http://localhost:3000';
}

/**
 * Build absolute URL for a route with parameters
 */
export function buildUrl(route: ApiRoute, params: Record<string, string | number> = {}): string {
  const domain = getApiDomain();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  let url = `${domain}${basePath}${route.path}`;
  
  // Add query parameters
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      queryParams.append(key, String(value));
    }
  });
  
  const queryString = queryParams.toString();
  if (queryString) {
    url += `?${queryString}`;
  }
  
  return url;
}
