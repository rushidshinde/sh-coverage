'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ApiResponse {
  status: number;
  statusText: string;
  duration?: number;
  data: any;
}

interface ResultPanelProps {
  response: ApiResponse | null;
  isLoading: boolean;
  error: string | null;
}

export function ResultPanel({ response, isLoading, error }: ResultPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!response) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getStatusColor = (status: number): "default" | "destructive" | "secondary" => {
    if (status >= 200 && status < 300) return 'default';
    if (status >= 400 && status < 500) return 'destructive';
    if (status >= 500) return 'destructive';
    return 'secondary';
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Response</CardTitle>
          {response && (
            <div className="flex items-center gap-2">
              <Badge variant={getStatusColor(response.status)}>
                {response.status} {response.statusText}
              </Badge>
              {response.duration && (
                <Badge variant="outline">{response.duration}ms</Badge>
              )}
              <Button
                variant="outline"
                size="icon-sm"
                onClick={handleCopy}
                disabled={!response}
              >
                {copied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Sending request...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
              <p className="text-sm font-medium mb-1">Request Failed</p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          </div>
        ) : response ? (
          <div className="flex-1 overflow-auto">
            <pre className="text-xs p-4 bg-muted rounded-md overflow-x-auto">
              <code className="language-json">
                {JSON.stringify(response.data, null, 2)}
              </code>
            </pre>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Send className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm font-medium mb-1">No request sent yet</p>
              <p className="text-xs text-muted-foreground">
                Configure parameters and click "Send Request" to see the response
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Send({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}
