import { NextRequest, NextResponse } from 'next/server';
import { getCacheStats } from '@/lib/cache';

/**
 * API Route: Get cache statistics
 * GET /api/cms/stats
 *
 * RReturns information about the current persistent file cache state
 */
export async function GET(request: NextRequest) {
    try {
        const stats = await getCacheStats();

        if (!stats) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Failed to retrieve cache statistics',
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: stats,
        });
    } catch (error) {
        console.error('Error getting cache stats:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get cache stats',
            },
            { status: 500 }
        );
    }
}
