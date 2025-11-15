import {promises as fs} from 'fs';
import path from 'path';

// Interface for the object that will represent a resolved coverage state
export interface CoverageState {
    id: string;
    fieldData: {
        name: string;
        slug: string;
        'state-abbreviation': string;
        active: string;
    }
}

export interface CmsItem {
    id: string;
    fieldData: {
        name: string;
        slug: string;
        "coverage-type": string;
        "requires-state-confirmation": string;
        "is-insurance-census-less": string;
        "require-state": string;
        'supported-states'?: CoverageState[];
        "payer-parameter": string;
        "insurance-directory-slug": string;
        "coverage-notes": string;
        [key: string]: any;
    };
}


export interface CacheData {
    coverageEntries: CmsItem[];
    coverageStateMap: CoverageState[];
    totalCoverageEntries: number;
    totalCoverageStateMap: number;
    lastUpdated: string;
}


// Cache directory and file path, as requested: .cache/cms-data.json
const CACHE_DIR = path.join(process.cwd(), '.cache');
const CACHE_FILE_PATH = path.join(CACHE_DIR, 'cms-data.json');

/**
 * Read cache data from JSON file
 */
export async function readCache(): Promise<CacheData | null> {
    try {
        const fileContent = await fs.readFile(CACHE_FILE_PATH, 'utf-8');
        const cache = JSON.parse(fileContent);
        // Updated check for new property names
        if (cache && cache.coverageEntries && cache.coverageStateMap) {
            return cache as CacheData;
        }
        return null;
    } catch (error) {
        // If file doesn't exist or is invalid, return null
        console.error('Error reading cache:', error);
        return null;
    }
}

/**
 * Write cache data to JSON file
 */
export async function writeCache(data: CacheData): Promise<void> {
    try {
        await fs.mkdir(CACHE_DIR, { recursive: true });
        const jsonContent = JSON.stringify(data, null, 2);
        await fs.writeFile(CACHE_FILE_PATH, jsonContent, 'utf-8');
        console.log(`Cache updated with ${data.totalCoverageEntries} items at ${data.lastUpdated} to ${CACHE_FILE_PATH}`);
    } catch (error) {
        console.error('Error writing cache:', error);
        throw new Error('Failed to write cache file');
    }
}

/**
 * Check if cache file exists
 */
export async function cacheExists(): Promise<boolean> {
    try {
        await fs.access(CACHE_FILE_PATH);
        return true;
    } catch {
        return false;
    }
}

/**
 * Search items in cache by name
 */
export function searchCacheByName(cache: CacheData, query: string, showAll: boolean): CmsItem[] {
    if (!query || query.trim() === '') {
        if (showAll) {
            return cache.coverageEntries;
        } else {
            return [];
        }
    }

    const searchTerm = query.toLowerCase().trim();

    return cache.coverageEntries.filter(item => {
        const itemName = item.fieldData.name?.toLowerCase() || '';
        return itemName.includes(searchTerm);
    });
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
    exists: boolean;
    itemCount: number;
    lastUpdated: string | null;
} | null> {
    const cache = await readCache();

    if (!cache) {
        return {
            exists: false,
            itemCount: 0,
            lastUpdated: null,
        };
    }

    return {
        exists: true,
        itemCount: cache.totalCoverageEntries,
        lastUpdated: cache.lastUpdated,
    };
}
