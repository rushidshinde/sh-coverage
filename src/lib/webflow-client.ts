import { WebflowClient } from 'webflow-api';

/**
 * Creates and returns a Webflow API client instance
 * This should only be used in server-side code (API routes, server components)
 */
export function getWebflowClient() {
    const token = process.env.WEBFLOW_API_TOKEN;
    const baseUrl = process.env.WEBFLOW_API_HOST;

    if (!token) {
        throw new Error('WEBFLOW_API_TOKEN environment variable is not set');
    }

    return new WebflowClient({
        accessToken: token,
        ...(baseUrl && { baseUrl }),
    });
}

/**
 * Get the configured site ID from environment variables
 */
export function getSiteId(): string {
    const siteId = process.env.WEBFLOW_SITE_ID;
    if (!siteId) {
        throw new Error('WEBFLOW_SITE_ID environment variable is not set');
    }
    return siteId;
}

/**
 * Get the configured Coverage Entries collection ID from environment variables
 */
export function getCoverageEntriesCollectionId(): string {
    const collectionId = process.env.WEBFLOW_COVERAGE_ENTRIES_COLLECTION_ID;
    if (!collectionId) {
        throw new Error('WEBFLOW_COLLECTION_ID environment variable is not set');
    }
    return collectionId;
}

/**
 * Get the configured Coverage States collection ID from environment variables
 */
export function getCoverageStatesCollectionId(): string {
    const collectionId = process.env.WEBFLOW_COVERAGE_STATES_COLLECTION_ID;
    if (!collectionId) {
        throw new Error('WEBFLOW_COVERAGE_LOCATIONS_COLLECTION_ID environment variable is not set');
    }
    return collectionId;
}