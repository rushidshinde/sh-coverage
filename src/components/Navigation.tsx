'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="bg-gray-800/50 border-b border-gray-700 backdrop-blur-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Springhealth APIs
                        </span>
                    </Link>

                    <div className="flex space-x-4">
                        <Link
                            href="/"
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                isActive('/')
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/coverage-entries"
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                isActive('/coverage-entries')
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            Coverage Entries
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
