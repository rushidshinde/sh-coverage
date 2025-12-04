'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ParamEditor } from '@/components/ParamEditor';
import { ResultPanel } from '@/components/ResultPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { ApiRoute, buildUrl } from '@/lib/apiRoutes';

interface PlaygroundClientProps {
  route: ApiRoute;
}

export function PlaygroundClient({ route }: PlaygroundClientProps) {
  const router = useRouter();
  const [queryParams, setQueryParams] = useState<Record<string, string>>(() => {
    const initialParams: Record<string, string> = {};
    route.params.forEach((param) => {
      initialParams[param.name] = param.defaultValue || '';
    });
    return initialParams;
  });
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleParamChange = (name: string, value: string) => {
    setQueryParams((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const startTime = performance.now();
      const url = buildUrl(route, queryParams);
      
      const res = await fetch(url);
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      
      const data = await res.json();
      
      setResponse({
        status: res.status,
        statusText: res.statusText,
        duration,
        data
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 dark:from-slate-950 dark:via-emerald-950 dark:to-teal-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-start gap-3 mb-2">
            <Badge variant="outline" className="font-mono mt-1">
              {route.method}
            </Badge>
            <div>
              <h1 className="text-3xl font-bold mb-2">{route.name}</h1>
              <p className="text-muted-foreground">{route.description}</p>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Parameters */}
          <div>
            <ParamEditor
              route={route}
              params={queryParams}
              onParamChange={handleParamChange}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>

          {/* Right: Results */}
          <div className="lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
            <ResultPanel
              response={response}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
