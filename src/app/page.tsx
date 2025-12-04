import { apiRoutes } from '@/lib/apiRoutes';
import { ApiRouteCard } from '@/components/ApiRouteCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 dark:from-slate-950 dark:via-emerald-950 dark:to-teal-950">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-700 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent mb-4">
            API Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore and test all available API endpoints. Click on any route to try it in the interactive playground.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border shadow-sm">
            <div className="text-sm text-muted-foreground mb-1">Total Endpoints</div>
            <div className="text-3xl font-bold">{apiRoutes.length}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border shadow-sm">
            <div className="text-sm text-muted-foreground mb-1">Categories</div>
            <div className="text-3xl font-bold">
              {new Set(apiRoutes.map(r => r.category)).size}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border shadow-sm">
            <div className="text-sm text-muted-foreground mb-1">Methods</div>
            <div className="text-3xl font-bold">GET</div>
          </div>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apiRoutes.map((route) => (
            <ApiRouteCard key={route.id} route={route} />
          ))}
        </div>
      </div>
    </div>
  );
}

