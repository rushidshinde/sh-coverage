import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Webflow CMS API',
    description: 'CMS caching and search API for Webflow',
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className="antialiased">
        {children}
        </body>
        </html>
    );
}
