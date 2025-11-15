/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configure base path from environment variable for Webflow Cloud deployment
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
    assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
};

module.exports = nextConfig;