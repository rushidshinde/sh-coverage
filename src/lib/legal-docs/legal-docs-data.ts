import { getWebflowClient, getLegalDocsCollectionId, getLegalDocLanguagesCollectionId } from '@/lib/webflow-client';
import { TEXT_DIRECTION_MAP } from '@/lib/legal-docs/legal-docs-maps';

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
        language?: Language; // Populated language object
        body?: string; // HTML content (privacy-policy) - kept for internal use
        'privacy-policy'?: string; // Mapped key for response
        'informed-minor-consent-policy'?: string; // HTML content
        'terms-of-services'?: string; // HTML content
        'last-updated-date-terms-of-services'?: string;
        'last-updated-date-informed-minor-consent'?: string;
        'last-updated-date-privacy-policy'?: string;
        'informed-consent-policy'?: string;
        'last-updated-date-informed-consent'?: string;
        'coppa-notice'?: string;
        'last-updated-date-coppa-notice'?: string;
        'hipaa-joint-notice'?: string;
        'last-updated-date-hipaa-joint-notice'?: string;
        'consent-to-qhin'?: string;
        'last-updated-date-consent-to-qhin'?: string;
        'legal-doc'?: string;
        'last-updated-date'?: string;
        [key: string]: any; // Allow additional dynamic fields
    };
}

export interface LegalDocsData {
    legalDocs: LegalDocItem[];
    totalLegalDocs: number;
    lastUpdated?: string;
}

export type DocType = 'privacy-policy' | 'informed-minor-consent-policy' | 'terms-of-services' | 'informed-consent-policy' | 'coppa-notice' | 'hipaa-joint-notice' | 'consent-to-qhin';

export interface FetchOptions {
    docType?: DocType; // Default: "privacy-policy"
    excludeByLanguages?: string; // Comma separated language codes to exclude
}

export async function fetchLegalDocsData(options: FetchOptions = {}): Promise<LegalDocsData> {
    const { docType = 'privacy-policy', excludeByLanguages } = options;
    
    const client = getWebflowClient();
    const legalDocsCollectionId = getLegalDocsCollectionId();
    const languagesCollectionId = getLegalDocLanguagesCollectionId();

    console.log(`Fetching items from legal docs collection: ${legalDocsCollectionId}`);
    console.log(`Fetching items from languages collection: ${languagesCollectionId}`);
    console.log(`Filter - Doc Type: ${docType}, Exclude Languages: ${excludeByLanguages}`);

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
    let latestLastUpdated: string | undefined = undefined;

    while (hasMore) {
        const response = await client.collections.items.listItemsLive(legalDocsCollectionId, {
            limit,
            offset,
            sortBy: 'name',
            sortOrder: 'asc',
        });

        if (response.items && response.items.length > 0) {
            const items: LegalDocItem[] = response.items.map((item: any) => {
                // Updates the latestLastUpdated date if the current item's date is more recent
                if (item.lastUpdated) {
                   if (!latestLastUpdated || new Date(item.lastUpdated) > new Date(latestLastUpdated)) {
                       latestLastUpdated = item.lastUpdated;
                   }
                }

                const languageId = item.fieldData.language as string;

                return {
                    id: item.id,
                    fieldData: {
                        name: item.fieldData.name,
                        slug: item.fieldData.slug,
                        language: languageId && languageMap[languageId] ? languageMap[languageId] : undefined,
                        body: item.fieldData.body,
                        'informed-minor-consent-policy': item.fieldData['informed-minor-consent-policy'],
                        'terms-of-services': item.fieldData['terms-of-services'],
                        'last-updated-date-terms-of-services': item.fieldData['last-updated-date-terms-of-services'],
                        'last-updated-date-informed-minor-consent': item.fieldData['last-updated-date-informed-minor-consent'],
                        'last-updated-date-privacy-policy': item.fieldData['last-updated-date'],
                        'informed-consent-policy': item.fieldData['informed-consent-policy'],
                        'last-updated-date-informed-consent': item.fieldData['last-updated-date-informed-consent'],
                        'coppa-notice': item.fieldData['coppa-notice'],
                        'last-updated-date-coppa-notice': item.fieldData['last-updated-date-coppa-notice'],
                        'hipaa-joint-notice': item.fieldData['hipaa-joint-notice'],
                        'last-updated-date-hipaa-joint-notice': item.fieldData['last-updated-date-hipaa-joint-notice'],
                        'consent-to-qhin': item.fieldData['consent-to-qhin'],
                        'last-updated-date-consent-to-qhin': item.fieldData['last-updated-date-consent-to-qhin'],
                        // Include any additional fields dynamically (except the switch field)
                        ...Object.keys(item.fieldData).reduce((acc, key) => {
                            if (!['name', 'slug', 'country', 'language', 'body', 'informed-minor-consent-policy', 'terms-of-services', 'last-updated-date-terms-of-services', 'last-updated-date-informed-minor-consent', 'last-updated-date-privacy-policy', 'informed-consent-policy', 'last-updated-date-informed-consent', 'coppa-notice', 'last-updated-date-coppa-notice', 'hipaa-joint-notice', 'last-updated-date-hipaa-joint-notice', 'consent-to-qhin', 'last-updated-date-consent-to-qhin'].includes(key)) {
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

    // Filter by excluded languages
    if (excludeByLanguages) {
        const excludedCodes = excludeByLanguages.split(',').map(code => code.trim().toLowerCase());
        if (excludedCodes.length > 0) {
            filteredDocs = filteredDocs.filter(doc => {
                const docLangCode = doc.fieldData.language?.fieldData['language-code']?.toLowerCase();
                // If doc has no language, keep it (or decide behavior, assuming keep for now unless it strictly must match a language)
                // If doc has language, check if it is in excluded list
                if (docLangCode) {
                    return !excludedCodes.includes(docLangCode);
                }
                return true; 
            });
        }
    }

    // Map to selective fields based on docType
    const mappedDocs = filteredDocs.reduce((acc, doc) => {
        const baseData = {
            name: doc.fieldData.name,
            slug: doc.fieldData.slug,
            language: doc.fieldData.language,
        };

        let specificData: Partial<LegalDocItem['fieldData']> = {};
        let hasContent = false;

        if (docType === 'privacy-policy') {
            const content = doc.fieldData.body;
            if (content) {
                hasContent = true;
                specificData = {
                    'legal-doc': content,
                    'last-updated-date': doc.fieldData['last-updated-date-privacy-policy'] || ""
                };
            }
        } else if (docType === 'informed-minor-consent-policy') {
            const content = doc.fieldData['informed-minor-consent-policy'];
            if (content) {
                hasContent = true;
                specificData = {
                    'legal-doc': content,
                    'last-updated-date': doc.fieldData['last-updated-date-informed-minor-consent'] || ""
                };
            }
        } else if (docType === 'terms-of-services') {
            const content = doc.fieldData['terms-of-services'];
            if (content) {
                hasContent = true;
                specificData = {
                    'legal-doc': content,
                    'last-updated-date': doc.fieldData['last-updated-date-terms-of-services'] || ""
                };
            }
        } else if (docType === 'informed-consent-policy') {
            const content = doc.fieldData['informed-consent-policy'];
             if (content) {
                hasContent = true;
                specificData = {
                    'legal-doc': content,
                    'last-updated-date': doc.fieldData['last-updated-date-informed-consent'] || ""
                };
            }
        } else if (docType === 'coppa-notice') {
            const content = doc.fieldData['coppa-notice'];
             if (content) {
                hasContent = true;
                specificData = {
                    'legal-doc': content,
                    'last-updated-date': doc.fieldData['last-updated-date-coppa-notice'] || ""
                };
            }
        } else if (docType === 'hipaa-joint-notice') {
            const content = doc.fieldData['hipaa-joint-notice'];
             if (content) {
                hasContent = true;
                specificData = {
                    'legal-doc': content,
                    'last-updated-date': doc.fieldData['last-updated-date-hipaa-joint-notice'] || ""
                };
            }
        } else if (docType === 'consent-to-qhin') {
            const content = doc.fieldData['consent-to-qhin'];
             if (content) {
                hasContent = true;
                specificData = {
                    'legal-doc': content,
                    'last-updated-date': doc.fieldData['last-updated-date-consent-to-qhin'] || ""
                };
            }
        }

        if (hasContent) {
            acc.push({
                id: doc.id,
                fieldData: {
                    ...baseData,
                    ...specificData
                }
            } as LegalDocItem);
        }

        return acc;
    }, [] as LegalDocItem[]);

    console.log(`After filtering and mapping: ${mappedDocs.length} legal documents (Doc Type: ${docType}).`);

    return {
        legalDocs: mappedDocs,
        totalLegalDocs: mappedDocs.length,
        lastUpdated: latestLastUpdated,
    };
}
