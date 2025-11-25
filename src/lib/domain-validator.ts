import { NextRequest, NextResponse } from 'next/server';

/**
 * Allowed domains for API access
 * Add your production domains here
 */
const ALLOWED_DOMAINS = [    
    'localhost:3000',    
    '127.0.0.1:3000',
    'rushikesh-shinde.webflow.io',    
];

/**
 * Validates if the request origin is from an allowed domain
 * @param request - Next.js request object
 * @returns true if the domain is allowed, false otherwise
 */
export function isAllowedDomain(request: NextRequest): boolean {
    // Get the origin or referer from the request
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const requestUrl = request.url;
    
    // Check the host of the request URL itself (for same-origin requests)
    // This handles cases like direct browser navigation where origin header is not sent
    try {
        const url = new URL(requestUrl);
        const requestHost = url.host.toLowerCase();
        
        if (ALLOWED_DOMAINS.some(domain => requestHost === domain.toLowerCase())) {
            return true;
        }
    } catch (error) {
        console.error('Invalid request URL:', error);
    }

    // Check origin header (sent by browsers for fetch/CORS requests)
    if (origin) {
        try {
            const url = new URL(origin);
            const host = url.host.toLowerCase();
            
            if (ALLOWED_DOMAINS.some(domain => host === domain.toLowerCase())) {
                return true;
            }
        } catch (error) {
            console.error('Invalid origin URL:', error);
        }
    }

    // Check referer as additional fallback
    if (referer) {
        try {
            const url = new URL(referer);
            const host = url.host.toLowerCase();
            
            if (ALLOWED_DOMAINS.some(domain => host === domain.toLowerCase())) {
                return true;
            }
        } catch (error) {
            console.error('Invalid referer URL:', error);
        }
    }

    return false;
}

/**
 * Returns a 403 Forbidden response for unauthorized domain access
 */
export function createUnauthorizedResponse(): NextResponse {
    return NextResponse.json(
        {
            success: false,
            error: 'Unauthorized: Request from unauthorized domain',
        },
        { 
            status: 403,
            headers: {
                'Content-Type': 'application/json',
            }
        }
    );
}
