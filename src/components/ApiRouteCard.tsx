'use client';

import { useRouter } from 'next/navigation';
import { Copy, PlayCircle, Check } from 'lucide-react';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { buildUrl, ApiRoute } from '@/lib/apiRoutes';

interface ApiRouteCardProps {
  route: ApiRoute;
}

export function ApiRouteCard({ route }: ApiRouteCardProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const absoluteUrl = buildUrl(route);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handlePlayground = () => {
    router.push(`/playground/${route.slug}`);
  };

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="font-mono">
                {route.method}
              </Badge>
              <CardTitle className="text-lg truncate">{route.name}</CardTitle>
            </div>
            <CardDescription>{route.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">Endpoint</p>
            <code className="block w-full px-3 py-2 text-sm bg-muted rounded-md overflow-x-auto whitespace-nowrap">
              {absoluteUrl}
            </code>
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="flex-1"
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy URL
            </>
          )}
        </Button>
        <Button
          size="sm"
          onClick={handlePlayground}
          className="flex-1"
        >
          <PlayCircle className="mr-2 h-4 w-4" />
          Try in Playground
        </Button>
      </CardFooter>
    </Card>
  );
}
