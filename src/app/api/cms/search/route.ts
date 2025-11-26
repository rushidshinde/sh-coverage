import { NextRequest, NextResponse } from 'next/server';
import { fetchCmsData, CmsItem } from '@/lib/cms-data';
import { isAllowedDomain, createUnauthorizedResponse, getCorsHeaders } from '@/lib/domain-validator';

/**
 * Handle OPTIONS preflight requests for CORS
 */
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: getCorsHeaders(),
    });
}

/**
 * API Route: Search CMS items
 * GET /api/cms/search?q=search-term
 *
 * This endpoint fetches fresh data from Webflow CDN and searches by item name.
 * Query parameters:
 * - q: search query (searches in the 'name' field)
 * - limit: maximum number of results (optional, default: all)
 * - offset: pagination offset (optional, default: 0)
 */
export async function GET(request: NextRequest) {
    // Validate that the request is from an allowed domain
    if (!isAllowedDomain(request)) {
        return createUnauthorizedResponse();
    }

    try {
        // Fetch fresh data from Webflow CDN
        const cache = await fetchCmsData();

        // Get search parameters
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q') || '';
        const limit = parseInt(searchParams.get('limit') || '0');
        const offset = parseInt(searchParams.get('offset') || '0');

        // Search items
        let results: CmsItem[] = [];

        if (!query || query.trim() === '') {
            results = [];
        } else {
            const searchTerm = query.toLowerCase().trim();
            results = cache.coverageEntries.filter(item => {
                const itemName = item.fieldData.name?.toLowerCase() || '';
                return itemName.includes(searchTerm);
            });
        }

        // Apply pagination if specified
        const totalResults = results.length;
        if (offset > 0) {
            results = results.slice(offset);
        }
        if (limit > 0) {
            results = results.slice(0, limit);
        }

        return NextResponse.json({
            success: true,
            data: {
                query,
                results,
                pagination: {
                    total: totalResults,
                    limit: limit || totalResults,
                    offset: offset,
                    returned: results.length,
                },
            },
        }, {
            headers: getCorsHeaders(),
        });
    } catch (error) {
        console.error('Error searching CMS data:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to search CMS data',
            },
            {
                status: 500,
                headers: getCorsHeaders(),
            }
        );
    }
}
