import { NextRequest, NextResponse } from 'next/server';
import { fetchLegalDocsData, DocType } from '@/lib/legal-docs/legal-docs-data';
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
 * API Route: Fetch Legal Documents
 * GET /api/cms/legal-docs/fetch?docType=privacy-policy
 *
 * Query Parameters:
 * - docType: Document type to fetch (default: "privacy-policy")
 *   Options: "privacy-policy", "informed-minor-consent-policy", "terms-of-services"
 * - excludeByLanguages: Comma separated language codes to exclude (e.g. "en,fr")
 *
 * This endpoint fetches legal documents from Webflow CMS filtered by document type.
 */
export async function GET(request: NextRequest) {
    // Validate that the request is from an allowed domain
    if (!isAllowedDomain(request)) {
        return createUnauthorizedResponse();
    }

    try {
        // Get query parameters
        const searchParams = request.nextUrl.searchParams;
        const docType = (searchParams.get('docType') || 'privacy-policy') as DocType;
        const excludeByLanguages = searchParams.get('excludeByLanguages') || undefined;

        // Validate doc-type
        const validDocTypes: DocType[] = ['privacy-policy', 'informed-minor-consent-policy', 'terms-of-services', 'informed-consent-policy', 'coppa-notice', 'hipaa-joint-notice', 'consent-to-qhin'];
        if (!validDocTypes.includes(docType)) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Invalid doc-type. Must be one of: ${validDocTypes.join(', ')}`,
                },
                { 
                    status: 400,
                    headers: getCorsHeaders(),
                }
            );
        }

        const data = await fetchLegalDocsData({ docType, excludeByLanguages });

        return NextResponse.json({
            success: true,
            message: `Successfully fetched ${data.totalLegalDocs} legal documents for doc-type "${docType}".`,
            filters: {
                docType,
                excludeByLanguages,
            },
            data: {
                totalLegalDocs: data.totalLegalDocs,                
                legalDocs: data.legalDocs,
                lastUpdated: data.lastUpdated,             
            },
        }, {
            headers: getCorsHeaders(),
        });
    } catch (error) {
        console.error('Error fetching legal docs data:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch legal docs data',
            },
            { 
                status: 500,
                headers: getCorsHeaders(),
            }
        );
    }
}
