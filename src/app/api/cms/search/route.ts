import { NextRequest, NextResponse } from 'next/server';
import { readCache, searchCacheByName, cacheExists, CmsItem, CacheData } from '@/lib/cache';

/**
 * API Route: Search cached CMS items
 * GET /api/cms/search?q=search-term
 *
 * This endpoint searches the cached CMS data by item name from the persistent file cache.
 * Query parameters:
 * - q: search query (searches in the 'name' field)
 * - limit: maximum number of results (optional, default: all)
 * - offset: pagination offset (optional, default: 0)
 */
export async function GET(request: NextRequest) {
    try {
        // Check if cache file exists
        const exists = await cacheExists();
        if (!exists) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Cache not initialized. Please call /api/cms/fetch first.',
                },
                { status: 404 }
            );
        }

        // Read cache from file
        const cache = await readCache();
        if (!cache) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Failed to read cache data from file.',
                },
                { status: 500 }
            );
        }

        // Get search parameters
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q') || '';
        const showAll = searchParams.get('showAll') === 'true';
        const limit = parseInt(searchParams.get('limit') || '0');
        const offset = parseInt(searchParams.get('offset') || '0');

        // Search items
        let results: CmsItem[] = searchCacheByName(cache, query, showAll);

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
                cache: {
                    lastUpdated: cache.lastUpdated,
                    totalItemsInCache: cache.totalCoverageEntries,
                },
            },
        });
    } catch (error) {
        console.error('Error searching cache:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to search cache',
            },
            { status: 500 }
        );
    }
}
