import React, { useState, useEffect, Suspense, lazy } from 'react';
import { router, Route } from './utils/router';
import { Loader2 } from 'lucide-react';

// Lazy load apps to split code
const WebsiteApp = lazy(() => import('./apps/website/App'));
const AdminApp = lazy(() => import('./apps/admin/App'));

// Driver, Customer, and Partner apps have been removed as per the project restructuring.

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="text-center">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
      <p className="text-slate-600">Loading Application...</p>
    </div>
  </div>
);

export function AppRouter() {
  const [route, setRoute] = useState<Route>(router.getCurrentRoute());

  useEffect(() => {
    return router.onChange((newRoute) => {
      setRoute(newRoute);
      window.scrollTo(0, 0);
    });
  }, []);

  return (
    <Suspense fallback={<LoadingScreen />}>
      {renderApp(route)}
    </Suspense>
  );
}

function renderApp(route: Route) {
  switch (route.page) {
    case 'admin':
      return <AdminApp />;
    
    // Legacy/Removed App Routes - Fallback to Website
    case 'driver-dashboard':
    case 'driver-job-details':
    case 'driver-reviews':
    case 'availability':
    case 'driver-mobile':
    case 'customer-dashboard':
    case 'tracking':
    case 'documents':
    case 'feedback':
    case 'payments':
    case 'partner-dashboard':
      console.warn(`Route ${route.page} requested but app is removed. Rendering Website.`);
      return <WebsiteApp />;

    // Website Routes
    case 'home':
    case 'booking':
    case 'pricing':
    case 'furniture-booking':
    case 'messaging': 
    case 'reports': 
    default:
      return <WebsiteApp />;
  }
}
