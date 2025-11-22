import { NextRequest, NextResponse } from 'next/server';
import { fetchCmsData } from '@/lib/cms-data';

/**
 * API Route: Fetch CMS data from Webflow
 * GET /api/cms/fetch
 *
 * This endpoint fetches all items from the configured Webflow CMS collection
 * using the shared logic which hits the Webflow CDN API.
 */
export async function GET(request: NextRequest) {
    try {
        const data = await fetchCmsData();

        return NextResponse.json({
            success: true,
            message: `Successfully fetched ${data.totalCoverageEntries} coverage entries and ${data.totalCoverageStateMap} coverage states.`,
            data: {
                totalCoverageEntries: data.totalCoverageEntries,
                totalCoverageStates: data.totalCoverageStateMap,
                coverageEntries: data.coverageEntries,
                coverageStateMap: data.coverageStateMap,
            },
        });
    } catch (error) {
        console.error('Error fetching CMS data:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch CMS data',
            },
            { status: 500 }
        );
    }
}
