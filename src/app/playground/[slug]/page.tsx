import { getRouteBySlug } from '@/lib/apiRoutes';
import { PlaygroundClient } from '@/components/PlaygroundClient';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PlaygroundPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PlaygroundPage({ params }: PlaygroundPageProps) {
  const { slug } = await params;
  const route = getRouteBySlug(slug);

  if (!route) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 dark:from-slate-950 dark:via-emerald-950 dark:to-teal-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Route Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The requested API route does not exist.
          </p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return <PlaygroundClient route={route} />;
}
