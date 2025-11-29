import { getWebflowClient, getLegalDocsCollectionId, getLegalDocLanguagesCollectionId } from '@/lib/webflow-client';
import { COUNTRY_MAP, TEXT_DIRECTION_MAP } from '@/lib/legal-docs/legal-docs-maps';

export interface Language {
    id: string;
    fieldData: {
        name: string;
        slug: string;
        'language-code': string;
        'text-direction': string; // Mapped value (LTR/RTL)
    };
}

export interface LegalDocItem {
    id: string;
    fieldData: {
        name: string;
        slug: string;
        country?: string; // Mapped value from COUNTRY_MAP
        language?: Language; // Populated language object
        body?: string; // HTML content (privacy-policy) - kept for internal use
        'privacy-policy'?: string; // Mapped key for response
        'informed-minor-consent-policy'?: string; // HTML content
        'terms-of-services'?: string; // HTML content
        'last-updated-date-terms-of-services'?: string;
        'last-updated-date-informed-minor-consent'?: string;
        'last-updated-date-privacy-policy'?: string;
        [key: string]: any; // Allow additional dynamic fields
    };
}

export interface LegalDocsData {
    legalDocs: LegalDocItem[];
    totalLegalDocs: number;
}

export type DocType = 'privacy-policy' | 'informed-minor-consent-policy' | 'terms-of-services';

export interface FetchOptions {
    country?: string; // Default: "Global"
    docType?: DocType; // Default: "privacy-policy"
}

export async function fetchLegalDocsData(options: FetchOptions = {}): Promise<LegalDocsData> {
    const { country = 'Global', docType = 'privacy-policy' } = options;
    
    const client = getWebflowClient();
    const legalDocsCollectionId = getLegalDocsCollectionId();
    const languagesCollectionId = getLegalDocLanguagesCollectionId();

    console.log(`Fetching items from legal docs collection: ${legalDocsCollectionId}`);
    console.log(`Fetching items from languages collection: ${languagesCollectionId}`);
    console.log(`Filter - Country: ${country}, Doc Type: ${docType}`);

    // Fetch languages first
    const allLanguages: Language[] = [];
    let langOffset = 0;
    const langLimit = 100;
    let hasMoreLangs = true;

    while (hasMoreLangs) {
        const response = await client.collections.items.listItemsLive(languagesCollectionId, {
            limit: langLimit,
            offset: langOffset,
            sortBy: 'name',
            sortOrder: 'asc',
        });

        if (response.items && response.items.length > 0) {
            const languages: Language[] = response.items.map((item: any) => {
                const textDirectionId = item.fieldData['text-direction'] as string;
                return {
                    id: item.id,
                    fieldData: {
                        name: item.fieldData.name as string,
                        slug: item.fieldData.slug as string,
                        'language-code': item.fieldData['language-code'] as string,
                        'text-direction': TEXT_DIRECTION_MAP[textDirectionId] || textDirectionId,
                    }
                } as Language;
            });
            allLanguages.push(...languages);
            langOffset += response.items.length;
            if (response.items.length < langLimit) {
                hasMoreLangs = false;
            }
        } else {
            hasMoreLangs = false;
        }
    }

    console.log(`Fetched ${allLanguages.length} languages.`);

    // Create language map for quick lookup
    const languageMap = allLanguages.reduce((acc, lang) => {
        acc[lang.id] = lang;
        return acc;
    }, {} as { [id: string]: Language });

    // Fetch legal docs
    const allLegalDocs: LegalDocItem[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
        const response = await client.collections.items.listItemsLive(legalDocsCollectionId, {
            limit,
            offset,
            sortBy: 'name',
            sortOrder: 'asc',
        });

        if (response.items && response.items.length > 0) {
            const items: LegalDocItem[] = response.items.map((item: any) => {
                const countryId = item.fieldData.country as string;
                const languageId = item.fieldData.language as string;

                return {
                    id: item.id,
                    fieldData: {
                        name: item.fieldData.name,
                        slug: item.fieldData.slug,
                        country: countryId ? (COUNTRY_MAP[countryId] || countryId) : undefined,
                        language: languageId && languageMap[languageId] ? languageMap[languageId] : undefined,
                        body: item.fieldData.body,
                        'informed-minor-consent-policy': item.fieldData['informed-minor-consent-policy'],
                        'terms-of-services': item.fieldData['terms-of-services'],
                        'last-updated-date-terms-of-services': item.fieldData['last-updated-date-terms-of-services'],
                        'last-updated-date-informed-minor-consent': item.fieldData['last-updated-date-informed-minor-consent'],
                        'last-updated-date-privacy-policy': item.fieldData['last-updated-date-privacy-policy'],
                        // Include any additional fields dynamically (except the switch field)
                        ...Object.keys(item.fieldData).reduce((acc, key) => {
                            if (!['name', 'slug', 'country', 'language', 'body', 'informed-minor-consent-policy', 'terms-of-services', 'last-updated-date-terms-of-services', 'last-updated-date-informed-minor-consent', 'last-updated-date-privacy-policy', 'switch-this-to-yes-if-all-three-docs-are-formatted'].includes(key)) {
                                acc[key] = item.fieldData[key];
                            }
                            return acc;
                        }, {} as Record<string, any>)
                    },
                } as LegalDocItem;
            });
            
            allLegalDocs.push(...items);
            offset += response.items.length;

            if (response.items.length < limit) {
                hasMore = false;
            }
        } else {
            hasMore = false;
        }
    }

    console.log(`Fetched ${allLegalDocs.length} legal documents before filtering.`);

    // Apply filters
    let filteredDocs = allLegalDocs;

    // Filter by country
    filteredDocs = filteredDocs.filter(doc => {
        return doc.fieldData.country === country;
    });

    // Map to selective fields based on docType
    const mappedDocs = filteredDocs.map(doc => {
        const baseData = {
            name: doc.fieldData.name,
            slug: doc.fieldData.slug,
            country: doc.fieldData.country,
            language: doc.fieldData.language,
        };

        let specificData: Partial<LegalDocItem['fieldData']> = {};

        if (docType === 'privacy-policy') {
            specificData = {
                'privacy-policy': doc.fieldData.body || "",
                'last-updated-date-privacy-policy': doc.fieldData['last-updated-date-privacy-policy'] || ""
            };
        } else if (docType === 'informed-minor-consent-policy') {
            specificData = {
                'informed-minor-consent-policy': doc.fieldData['informed-minor-consent-policy'] || "",
                'last-updated-date-informed-minor-consent': doc.fieldData['last-updated-date-informed-minor-consent'] || ""
            };
        } else if (docType === 'terms-of-services') {
            specificData = {
                'terms-of-services': doc.fieldData['terms-of-services'] || "",
                'last-updated-date-terms-of-services': doc.fieldData['last-updated-date-terms-of-services'] || ""
            };
        }

        return {
            id: doc.id,
            fieldData: {
                ...baseData,
                ...specificData
            }
        } as LegalDocItem;
    });

    console.log(`After filtering and mapping: ${mappedDocs.length} legal documents (Country: ${country}, Doc Type: ${docType}).`);

    return {
        legalDocs: mappedDocs,
        totalLegalDocs: mappedDocs.length,
    };
}
