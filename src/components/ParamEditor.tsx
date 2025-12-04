'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Send, RotateCcw, Check } from 'lucide-react';
import { useState } from 'react';
import { ApiRoute } from '@/lib/apiRoutes';

interface ParamEditorProps {
  route: ApiRoute;
  params: Record<string, string>;
  onParamChange: (name: string, value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function ParamEditor({ route, params, onParamChange, onSubmit, isLoading }: ParamEditorProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  
  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleReset = () => {
    const resetParams: Record<string, string> = {};
    route.params.forEach((param) => {
      resetParams[param.name] = param.defaultValue || '';
    });
    Object.keys(resetParams).forEach((key) => {
      onParamChange(key, resetParams[key]);
    });
  };

  // Build current URL
  const domain = typeof window !== 'undefined' ? window.location.origin : '';
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  let currentUrl = `${domain}${basePath}${route.path}`;
  
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      queryParams.append(key, value);
    }
  });
  
  const queryString = queryParams.toString();
  if (queryString) {
    currentUrl += `?${queryString}`;
  }

  return (
    <div className="space-y-6">
      {/* URL Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Request URL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <code className="flex-1 block px-3 py-2 text-sm bg-muted rounded-md overflow-x-auto whitespace-nowrap border">
              {currentUrl}
            </code>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleCopyUrl(currentUrl)}
              title="Copy URL"
            >
              {copiedUrl ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={onSubmit}
              disabled={isLoading}
              className="flex-1"
            >
              <Send className="mr-2 h-4 w-4" />
              {isLoading ? 'Sending...' : 'Send Request'}
            </Button>
            {route.params.length > 0 && (
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isLoading}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Parameters Card */}
      {route.params.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {route.params.map((param) => (
              <div key={param.name} className="space-y-2">
                <Label htmlFor={param.name}>
                  {param.label}
                  {param.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                
                {param.type === 'select' ? (
                  <select
                    id={param.name}
                    value={params[param.name] || param.defaultValue || ''}
                    onChange={(e) => onParamChange(param.name, e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30"
                  >
                    {param.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id={param.name}
                    type={param.type}
                    placeholder={param.placeholder}
                    value={params[param.name] || ''}
                    onChange={(e) => onParamChange(param.name, e.target.value)}
                    min={param.min}
                  />
                )}
                
                {param.description && (
                  <p className="text-xs text-muted-foreground">{param.description}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
