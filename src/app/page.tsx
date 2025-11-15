import Link from 'next/link';
import { baseUrl } from '@/lib/base-url';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Webflow CMS API
                        </h1>
                        <p className="text-xl text-gray-300">
                            CMS caching and search system for your Webflow project
                        </p>
                    </div>

                    {/* API Endpoints */}
                    <div className="bg-gray-800/50 rounded-lg p-8 backdrop-blur-sm border border-gray-700 mb-8">
                        <h2 className="text-2xl font-semibold mb-6 text-blue-400">
                            Available API Endpoints
                        </h2>

                        <div className="space-y-6">
                            {/* Fetch Endpoint */}
                            <div className="border-l-4 border-green-500 pl-4">
                                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                    GET
                  </span>
                                    <code className="text-sm text-gray-300">
                                        {baseUrl}/api/cms/fetch
                                    </code>
                                </div>
                                <p className="text-gray-400 text-sm">
                                    Fetch all items from Webflow CMS and update the cache file
                                </p>
                            </div>

                            {/* Search Endpoint */}
                            <div className="border-l-4 border-blue-500 pl-4">
                                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                    GET
                  </span>
                                    <code className="text-sm text-gray-300">
                                        {baseUrl}/api/cms/search?q=query
                                    </code>
                                </div>
                                <p className="text-gray-400 text-sm">
                                    Search cached items by name. Supports pagination with limit & offset params.
                                </p>
                            </div>

                            {/* Webhook Endpoint */}
                            <div className="border-l-4 border-purple-500 pl-4">
                                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">
                    POST
                  </span>
                                    <code className="text-sm text-gray-300">
                                        {baseUrl}/api/cms/webhook
                                    </code>
                                </div>
                                <p className="text-gray-400 text-sm">
                                    Webhook endpoint to refresh cache when CMS is updated (configure in Webflow)
                                </p>
                            </div>

                            {/* Stats Endpoint */}
                            <div className="border-l-4 border-yellow-500 pl-4">
                                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                    GET
                  </span>
                                    <code className="text-sm text-gray-300">
                                        {baseUrl}/api/cms/stats
                                    </code>
                                </div>
                                <p className="text-gray-400 text-sm">
                                    Get cache statistics (item count, last updated time)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Setup Instructions */}
                    <div className="bg-gray-800/50 rounded-lg p-8 backdrop-blur-sm border border-gray-700 mb-8">
                        <h2 className="text-2xl font-semibold mb-6 text-purple-400">
                            Setup Instructions
                        </h2>

                        <div className="space-y-4 text-gray-300">
                            <div className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center font-bold">
                  1
                </span>
                                <div>
                                    <p className="font-semibold mb-1">Configure Environment Variables</p>
                                    <p className="text-sm text-gray-400">
                                        Create a <code className="bg-gray-700 px-2 py-1 rounded">.env.local</code> file with your Webflow credentials.
                                        See <code className="bg-gray-700 px-2 py-1 rounded">ENV_VARIABLES.md</code> for details.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center font-bold">
                  2
                </span>
                                <div>
                                    <p className="font-semibold mb-1">Initialize the Cache</p>
                                    <p className="text-sm text-gray-400">
                                        Call <code className="bg-gray-700 px-2 py-1 rounded">{baseUrl}/api/cms/fetch</code> to fetch and cache your CMS data.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center font-bold">
                  3
                </span>
                                <div>
                                    <p className="font-semibold mb-1">Configure Webhook (Optional)</p>
                                    <p className="text-sm text-gray-400">
                                        In Webflow, set up a webhook pointing to <code className="bg-gray-700 px-2 py-1 rounded">{baseUrl}/api/cms/webhook</code> to auto-refresh cache on updates.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center font-bold">
                  4
                </span>
                                <div>
                                    <p className="font-semibold mb-1">Start Searching</p>
                                    <p className="text-sm text-gray-400">
                                        Use the search endpoint to query your cached CMS items by name.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/api/cms/stats"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                            View Cache Stats
                        </Link>
                        <a
                            href="https://developers.webflow.com/data/docs/getting-started-data-api"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                        >
                            Webflow API Docs ↗
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
