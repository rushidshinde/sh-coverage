import SearchInterface from '@/components/SearchInterface';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Webflow CMS Search
                        </h1>
                        <p className="text-xl text-gray-300">
                            Real-time search powered by Webflow CDN
                        </p>
                    </div>

                    <SearchInterface />
                </div>
            </div>
        </div>
    );
}
