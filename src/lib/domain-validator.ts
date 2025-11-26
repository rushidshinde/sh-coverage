import { NextRequest, NextResponse } from 'next/server';

/**
 * Allowed domains for API access
 * Add your production domains here
 */
const ALLOWED_DOMAINS = [    
    'localhost:3000',    
    '127.0.0.1:5500',
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
    
    // Debug logging
    console.log('=== Domain Validation Debug ===');
    console.log('Request URL:', requestUrl);
    console.log('Origin header:', origin);
    console.log('Referer header:', referer);
    console.log('Allowed domains:', ALLOWED_DOMAINS);
    
    // Check origin header first (sent by browsers for fetch/CORS requests)
    // This is the primary way to validate WHERE the request came from
    if (origin) {
        try {
            const url = new URL(origin);
            const host = url.host.toLowerCase();
            console.log('Origin host:', host);
            
            const isAllowed = ALLOWED_DOMAINS.some(domain => host === domain.toLowerCase());
            console.log('Origin host allowed:', isAllowed);
            
            if (isAllowed) {
                console.log('✅ Access granted via origin header');
                return true;
            } else {
                console.log('❌ Origin not in allowed domains');
                return false;
            }
        } catch (error) {
            console.error('Invalid origin URL:', error);
            return false;
        }
    }

    // Check referer header (sent for navigation requests)
    // This validates WHERE the request came from when origin is not present
    if (referer) {
        try {
            const url = new URL(referer);
            const host = url.host.toLowerCase();
            console.log('Referer host:', host);
            
            const isAllowed = ALLOWED_DOMAINS.some(domain => host === domain.toLowerCase());
            console.log('Referer host allowed:', isAllowed);
            
            if (isAllowed) {
                console.log('✅ Access granted via referer header');
                return true;
            } else {
                console.log('❌ Referer not in allowed domains');
                return false;
            }
        } catch (error) {
            console.error('Invalid referer URL:', error);
            return false;
        }
    }
    
    // Fallback: Check the request URL host for localhost development
    // This allows direct API access during local development
    try {
        const url = new URL(requestUrl);
        const requestHost = url.host.toLowerCase();
        console.log('Request host:', requestHost);
        
        // Only allow localhost/127.0.0.1 for direct access without origin/referer
        const isLocalhost = requestHost.startsWith('localhost') || 
                           requestHost.startsWith('127.0.0.1');
        
        if (isLocalhost) {
            const isAllowed = ALLOWED_DOMAINS.some(domain => requestHost === domain.toLowerCase());
            console.log('Request host allowed (localhost):', isAllowed);
            
            if (isAllowed) {
                console.log('✅ Access granted via localhost request host');
                return true;
            }
        }
    } catch (error) {
        console.error('Invalid request URL:', error);
    }

    console.log('❌ Access denied - no valid origin or referer from allowed domains');
    return false;
}

/**
 * Creates CORS headers for API responses
 * Allows all origins with wildcard (*)
 */
export function getCorsHeaders(): Record<string, string> {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400', // 24 hours
    };
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
                ...getCorsHeaders(),
            }
        }
    );
}
