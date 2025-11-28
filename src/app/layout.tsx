import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
    title: 'Springhealth Marketing Site APIs',
    description: 'Search and data APIs for Springhealth marketing site content',
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className="antialiased">
        <Navigation />
        {children}
        </body>
        </html>
    );
}
