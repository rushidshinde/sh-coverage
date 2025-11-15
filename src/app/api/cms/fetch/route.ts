import { NextRequest, NextResponse } from 'next/server';
import {getWebflowClient, getCoverageEntriesCollectionId, getCoverageStatesCollectionId} from '@/lib/webflow-client';
import { writeCache, CmsItem, CacheData, CoverageState } from '@/lib/cache';
import {
    ACTIVE_STATE_MAP,
    COVERAGE_TYPE_MAP,
    IS_INSURANCE_CENSUS_LESS_MAP,
    REQUIRE_STATE_MAP,
    REQUIRES_STATE_CONFIRMATION_MAP,

} from "@/lib/cms-maps";

/**
 * API Route: Fetch CMS data from Webflow and update cache
 * GET /api/cms/fetch
 *
 * This endpoint fetches all items from the configured Webflow CMS collection
 * and stores them in a persistent JSON file cache.
 */



export async function GET(request: NextRequest) {
    try {
        const client = getWebflowClient();
        const coverageEntriesCollectionId = getCoverageEntriesCollectionId();
        const coverageStatesCollectionId = getCoverageStatesCollectionId();

        console.log(`Fetching items from coverage entries collection: ${coverageEntriesCollectionId}`);
        console.log(`Fetching items from coverage state collection: ${coverageStatesCollectionId}`);

        const coverageStateItems: CoverageState[] = [];
        let stateOffset = 0;
        const stateLimit = 100;
        let hasMoreStates = true;

        while (hasMoreStates) {
            // Use the client to list live items from the Coverage Locations collection
            const response = await client.collections.items.listItemsLive(coverageStatesCollectionId, {
                limit: stateLimit,
                offset: stateOffset,
                sortBy: 'name',
                sortOrder: 'asc',
            });

            if (response.items && response.items.length > 0) {
                const stateResponse: CoverageState[] = response.items.map(item => {
                    const activeState = item.fieldData.active as string;
                    return {
                        id: item.id,
                        fieldData: {
                            name: item.fieldData.name as string,
                            slug: item.fieldData.slug as string,
                            'state-abbreviation': item.fieldData['state-abbreviation'] as string,
                            active: ACTIVE_STATE_MAP[activeState] || "No",
                        }
                    } as CoverageState;
                });
                coverageStateItems.push(...stateResponse);
                stateOffset += response.items.length;
                if (response.items.length < stateLimit) {
                    hasMoreStates = false;
                }
            } else {
                hasMoreStates = false;
            }
        }

        console.log(`Fetched ${coverageStateItems.length} coverage locations.`);

        // --- NEW LOGIC: Create a map for quick ID lookup of coverage states ---
        const stateMap = coverageStateItems.reduce((acc, state) => {
            acc[state.id] = state;
            return acc;
        }, {} as { [id: string]: CoverageState });

        const activeStates = coverageStateItems.filter(state => state.fieldData.active === "Yes");

        // Fetch all items with pagination
        const allCoverageEntries: CmsItem[] = [];
        let offset = 0;
        const limit = 100; // Maximum allowed by Webflow API
        let hasMore = true;

        while (hasMore) {
            const response = await client.collections.items.listItemsLive(coverageEntriesCollectionId, {
                limit,
                offset,
                sortBy: 'name',
                sortOrder: 'asc',
            });

            if (response.items && response.items.length > 0) {
                const simplifiedItems = response.items.map((item) => {
                    const coverageTypeId = item.fieldData["coverage-type"] as string;
                    const requiresStateConfirmationId = item.fieldData["requires-state-confirmation"] as string;
                    const isInsuranceCensusLess = item.fieldData["is-insurance-census-less"] as string;
                    const requireStateId = item.fieldData["require-state"] as string;

                    const requiresStateConfirmation = REQUIRES_STATE_CONFIRMATION_MAP[requiresStateConfirmationId] || "No";
                    const requireState = REQUIRE_STATE_MAP[requireStateId] || "No";

                    const isInsuranceCensusLessMapped = IS_INSURANCE_CENSUS_LESS_MAP[isInsuranceCensusLess] || "No";

                    let finalSupportedStates: CoverageState[] = [];

                    if (requiresStateConfirmation == "Yes") {
                        if(requireState === "No") {
                            finalSupportedStates = activeStates;
                        } else {
                            let idLinkedStates = (item.fieldData["supported-states"] as string[] || [])
                                .map(id => stateMap[id])
                                .filter((state): state is CoverageState => !!state);
                            idLinkedStates = idLinkedStates.filter(state => state.fieldData.active === "Yes");
                            finalSupportedStates = idLinkedStates;
                        }
                    } else {
                        finalSupportedStates = [];
                    }

                    return {
                        id: item.id,
                        fieldData: {
                            name: item.fieldData.name,
                            slug: item.fieldData.slug,
                            "coverage-type": COVERAGE_TYPE_MAP[coverageTypeId] || "Employer",
                            "payer-parameter": item.fieldData["payer-parameter"] || "",
                            "insurance-directory-slug": item.fieldData["insurance-directory-slug"] || "",
                            "coverage-notes": item.fieldData["coverage-notes"] || "",
                            "is-insurance-census-less": isInsuranceCensusLessMapped,
                            "requires-state-confirmation": requiresStateConfirmation,
                            "require-state": requireState,
                            "supported-states": finalSupportedStates,
                        } as CmsItem['fieldData'],
                    } as CmsItem;
                });
                allCoverageEntries.push(...simplifiedItems);
                // allCoverageEntries.push(...response.items as CmsItem[]);
                offset += response.items.length;

                // Check if there are more items
                if (response.items.length < limit) {
                    hasMore = false;
                }
            } else {
                hasMore = false;
            }
        }

        // Create cache data
        const cacheData: CacheData = {
            coverageEntries : allCoverageEntries,
            coverageStateMap: coverageStateItems,
            totalCoverageEntries: allCoverageEntries.length,
            totalCoverageStateMap: coverageStateItems.length,
            lastUpdated: new Date().toISOString(),
        };

        // Write to persistent file cache
        await writeCache(cacheData);

        return NextResponse.json({
            success: true,
            message: `Successfully fetched and cached ${allCoverageEntries.length} coverage entries. Also fetched ${coverageStateItems.length} coverage states.`,
            data: {
                totalCoverageEntries: allCoverageEntries.length,
                totalCoverageStates: coverageStateItems.length,
                lastUpdated: cacheData.lastUpdated,
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
