import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Springhealth Marketing Site APIs',
    description: 'Search and data APIs for Springhealth marketing site content',
    robots: {
        index: false,
        follow: false,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
            'max-video-preview': -1,
            'max-image-preview': 'none',
            'max-snippet': -1,
        },
    },
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
