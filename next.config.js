/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configure base path from environment variable for Webflow Cloud deployment
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
    assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
    async headers() {
        return [
            {
                // Apply X-Robots-Tag header to all routes
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Robots-Tag',
                        value: 'noindex, nofollow, noarchive, nosnippet, noimageindex, nocache',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;