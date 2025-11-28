'use client';

import { useState, useEffect } from 'react';
import { CmsItem } from '@/lib/coverage-entries/coverage-data';
import { baseUrl } from '@/lib/base-url';

export default function SearchInterface() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<CmsItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const searchItems = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${baseUrl}/api/cms/coverage-entries/search?q=${encodeURIComponent(query)}`);
                const data = await response.json();

                if (data.success) {
                    setResults(data.data.results);
                } else {
                    setError(data.error || 'Failed to fetch results');
                    setResults([]);
                }
            } catch (err) {
                setError('An error occurred while searching');
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            searchItems();
        }, 300); // Debounce search

        return () => clearTimeout(timeoutId);
    }, [query]);

    return (
        <>
            {/* Search Input */}
            <div className="mb-12 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search coverage entries..."
                    className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all"
                />
            </div>

            {/* Results Area */}
            <div className="space-y-6">
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        <p className="mt-2 text-gray-400">Searching...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg text-center">
                        {error}
                    </div>
                )}

                {!loading && !error && query.trim() && results.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                        No results found for "{query}"
                    </div>
                )}

                {!loading && !error && !query.trim() && (
                    <div className="text-center py-12 text-gray-500">
                        Start typing to search...
                    </div>
                )}

                <div className="grid gap-4">
                    {results.map((item) => (
                        <div key={item.id} className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-6 hover:bg-gray-800/60 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-blue-400 mb-2">
                                        {item.fieldData.name}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                                            Slug: {item.fieldData.slug}
                                        </span>
                                        <span className="bg-purple-900/50 text-purple-300 text-xs px-2 py-1 rounded">
                                            Type: {item.fieldData['coverage-type']}
                                        </span>
                                        <span className="bg-red-900/50 text-red-300 text-xs px-2 py-1 rounded">
                                            Requires State Confirmation: {item.fieldData['requires-state-confirmation']}
                                        </span>
                                        <span className="bg-green-900/50 text-green-300 text-xs px-2 py-1 rounded">
                                            Require State: {item.fieldData['require-state']}
                                        </span>
                                        <span className="bg-yellow-900/50 text-yellow-300 text-xs px-2 py-1 rounded">
                                            Is Insurance Census Less: {item.fieldData['is-insurance-census-less']}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-300">
                                {item.fieldData['payer-parameter'] && (
                                    <div className="bg-gray-900/50 p-3 rounded border border-gray-700/30">
                                        <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Payer Parameter</span>
                                        {item.fieldData['payer-parameter']}
                                    </div>
                                )}
                                {item.fieldData['insurance-directory-slug'] && (
                                    <div className="bg-gray-900/50 p-3 rounded border border-gray-700/30">
                                        <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Directory Slug</span>
                                        {item.fieldData['insurance-directory-slug']}
                                    </div>
                                )}
                                {item.fieldData['coverage-notes'] && (
                                    <div className="bg-gray-900/50 p-3 rounded border border-gray-700/30 col-span-full">
                                        <span className="text-gray-500 block text-xs uppercase tracking-wider mb-1">Notes</span>
                                        {item.fieldData['coverage-notes']}
                                    </div>
                                )}
                            </div>

                            {/* Display supported states if available */}
                            {item.fieldData['supported-states'] && item.fieldData['supported-states'].length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-700/50">
                                    <p className="text-sm text-gray-400 mb-2">Supported States:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {item.fieldData['supported-states'].map((state) => (
                                            <span key={state.id} className="bg-blue-900/30 text-blue-300 text-xs px-2 py-1 rounded border border-blue-800/50">
                                                {state.fieldData.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
