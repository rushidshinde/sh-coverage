import { NextRequest, NextResponse } from 'next/server';
import { getWebflowClient, getCoverageEntriesCollectionId, getCoverageStatesCollectionId } from '@/lib/webflow-client';
import { writeCache, CmsItem, CacheData, CoverageState } from '@/lib/cache';
import {
    ACTIVE_STATE_MAP,
    COVERAGE_TYPE_MAP,
    IS_INSURANCE_CENSUS_LESS_MAP,
    REQUIRE_STATE_MAP,
    REQUIRES_STATE_CONFIRMATION_MAP,
} from "@/lib/cms-maps";

/**
 * API Route: Webhook endpoint for CMS updates
 * POST /api/cms/webhook
 *
 * This endpoint should be configured in your Webflow project settings
 * as a webhook URL. It triggers a full cache refresh when CMS items are updated.
 *
 * Webhook events to listen for:
 * - collection_item_created, collection_item_changed, collection_item_deleted, etc.
 */

export async function POST(request: NextRequest) {
    try {

        const webhookSecret = process.env.WEBHOOK_SECRET;
        const authHeader = request.headers.get('authorization');

        if (webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Unauthorized',
                },
                { status: 401 }
            );
        }

        const payload = await request.json();
        console.log(`Webhook received: ${payload.triggerType || 'unknown event'}. Starting full cache refresh...`);

        const client = getWebflowClient();
        const coverageEntriesCollectionId = getCoverageEntriesCollectionId();
        const coverageStatesCollectionId = getCoverageStatesCollectionId();


        const coverageStateItems: CoverageState[] = [];
        let stateOffset = 0;
        const stateLimit = 100;
        let hasMoreStates = true;

        while (hasMoreStates) {
            const response = await client.collections.items.listItemsLive(coverageStatesCollectionId, {
                limit: stateLimit,
                offset: stateOffset,
                sortBy: 'name', // Added sorting
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

        const stateMap = coverageStateItems.reduce((acc, state) => {
            acc[state.id] = state;
            return acc;
        }, {} as { [id: string]: CoverageState });

        const activeStates = coverageStateItems.filter(state => state.fieldData.active === "Yes");


        const allCoverageEntries: CmsItem[] = [];
        let offset = 0;
        const limit = 100;
        let hasMore = true;

        while (hasMore) {
            const response = await client.collections.items.listItemsLive(coverageEntriesCollectionId, {
                limit,
                offset,
                sortBy: 'name', // Added sorting
                sortOrder: 'asc',
            });

            if (response.items && response.items.length > 0) {
                const simplifiedItems = response.items.map((item) => {
                    // Map IDs to final strings
                    const coverageTypeId = item.fieldData["coverage-type"] as string;
                    const requiresStateConfirmationId = item.fieldData["requires-state-confirmation"] as string;
                    const isInsuranceCensusLess = item.fieldData["is-insurance-census-less"] as string;
                    const requireStateId = item.fieldData["require-state"] as string;

                    const requiresStateConfirmation = REQUIRES_STATE_CONFIRMATION_MAP[requiresStateConfirmationId] || "No";
                    const requireState = REQUIRE_STATE_MAP[requireStateId] || "No";
                    const isInsuranceCensusLessMapped = IS_INSURANCE_CENSUS_LESS_MAP[isInsuranceCensusLess] || "No";

                    let finalSupportedStates: CoverageState[] = [];

                    // Conditional Logic for supported-states
                    if (requiresStateConfirmation == "Yes") {
                        if(requireState === "No") {
                            // Rule 3 (Part 1): If requires-state-confirmation is Yes and require-state is No, use all active states
                            finalSupportedStates = activeStates;
                        } else {
                            // Rule 3 (Part 2): If require-state is Yes, use linked states
                            let idLinkedStates = (item.fieldData["supported-states"] as string[] || [])
                                .map(id => stateMap[id])
                                .filter((state): state is CoverageState => !!state);

                            // Rule 1: Filter out any inactive states from the linked result
                            idLinkedStates = idLinkedStates.filter(state => state.fieldData.active === "Yes");

                            // Rule 2 is implied by the parent if (requiresStateConfirmation == "Yes") block
                            finalSupportedStates = idLinkedStates;
                        }
                    } else {
                        // Rule 2 (Else): If requires-state-confirmation is No, supportedStates must be empty
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
                offset += response.items.length;

                if (response.items.length < limit) {
                    hasMore = false;
                }
            } else {
                hasMore = false;
            }
        }


        const cacheData: CacheData = {
            coverageEntries: allCoverageEntries,
            coverageStateMap: coverageStateItems,
            totalCoverageEntries: allCoverageEntries.length,
            totalCoverageStateMap: coverageStateItems.length,
            lastUpdated: new Date().toISOString(),
        };

        await writeCache(cacheData);

        return NextResponse.json({
            success: true,
            message: `Cache refreshed successfully via webhook. Fetched ${allCoverageEntries.length} entries and ${coverageStateItems.length} states.`,
            data: {
                totalCoverageEntries: allCoverageEntries.length,
                totalCoverageStates: coverageStateItems.length,
                lastUpdated: cacheData.lastUpdated,
                webhookEvent: payload.triggerType || 'unknown',
            },
        });
    } catch (error) {
        console.error('Error processing webhook:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to process webhook',
            },
            { status: 500 }
        );
    }
}