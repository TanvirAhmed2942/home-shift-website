// Optimized Router for ShiftMyHome with all new pages
export type Route = 
  | { page: 'home' }
  | { page: 'admin' }
  | { page: 'driver-dashboard' }
  | { page: 'driver-job-details', jobId: string }
  | { page: 'customer-dashboard' }
  | { page: 'driver-mobile' }
  | { page: 'booking', service: string }
  | { page: 'pricing' }
  | { page: 'furniture-booking' }
  | { page: 'feedback', jobId?: string }
  | { page: 'driver-reviews', driverId?: string }
  | { page: 'partner-dashboard' }
  | { page: 'payments' }
  | { page: 'availability' }
  | { page: 'messaging' }
  | { page: 'reports' }
  | { page: 'tracking', jobId: string }
  | { page: 'documents', userId: string };

export class Router {
  private listeners: Array<(route: Route) => void> = [];
  private currentRoute: Route | null = null;

  constructor() {
    // Listen to browser back/forward buttons
    window.addEventListener('popstate', () => {
      this.notifyListeners();
    });
  }

  // Parse current URL to route (memoized for performance)
  getCurrentRoute(): Route {
    // Return cached route if available
    if (this.currentRoute) {
      return this.currentRoute;
    }

    const hash = window.location.hash.slice(1) || '/';
    const [path, ...params] = hash.split('/').filter(Boolean);

    let route: Route;

    switch (path) {
      case 'admin':
        route = { page: 'admin' };
        break;
      
      case 'driver':
        if (params[0] === 'dashboard') {
          route = { page: 'driver-dashboard' };
        } else if (params[0] === 'job' && params[1]) {
          route = { page: 'driver-job-details', jobId: params[1] };
        } else {
          route = { page: 'driver-dashboard' };
        }
        break;
      
      case 'customer':
        route = { page: 'customer-dashboard' };
        break;
      
      case 'driver-mobile':
        route = { page: 'driver-mobile' };
        break;
      
      case 'booking':
        route = { page: 'booking', service: params[0] || 'house-moving' };
        break;
      
      case 'pricing':
        route = { page: 'pricing' };
        break;
      
      case 'furniture-booking':
        route = { page: 'furniture-booking' };
        break;
      
      case 'feedback':
        route = { page: 'feedback', jobId: params[0] };
        break;
      
      case 'reviews':
        route = { page: 'driver-reviews', driverId: params[0] };
        break;
      
      case 'partner':
        route = { page: 'partner-dashboard' };
        break;
      
      case 'payments':
        route = { page: 'payments' };
        break;
      
      case 'availability':
        route = { page: 'availability' };
        break;
      
      case 'messaging':
        route = { page: 'messaging' };
        break;
      
      case 'reports':
        route = { page: 'reports' };
        break;
      
      case 'tracking':
        route = { page: 'tracking', jobId: params[0] };
        break;
      
      case 'documents':
        route = { page: 'documents', userId: params[0] };
        break;
      
      default:
        route = { page: 'home' };
    }

    this.currentRoute = route;
    return route;
  }

  // Navigate to a route (optimized)
  navigate(route: Route) {
    let url = '#/';
    
    switch (route.page) {
      case 'home':
        url = '#/';
        break;
      case 'admin':
        url = '#/admin';
        break;
      case 'driver-dashboard':
        url = '#/driver/dashboard';
        break;
      case 'driver-job-details':
        url = `#/driver/job/${route.jobId}`;
        break;
      case 'customer-dashboard':
        url = '#/customer';
        break;
      case 'driver-mobile':
        url = '#/driver-mobile';
        break;
      case 'booking':
        url = `#/booking/${route.service}`;
        break;
      case 'pricing':
        url = '#/pricing';
        break;
      case 'furniture-booking':
        url = '#/furniture-booking';
        break;
      case 'feedback':
        url = route.jobId ? `#/feedback/${route.jobId}` : '#/feedback';
        break;
      case 'driver-reviews':
        url = route.driverId ? `#/reviews/${route.driverId}` : '#/reviews';
        break;
      case 'partner-dashboard':
        url = '#/partner';
        break;
      case 'payments':
        url = '#/payments';
        break;
      case 'availability':
        url = '#/availability';
        break;
      case 'messaging':
        url = '#/messaging';
        break;
      case 'reports':
        url = '#/reports';
        break;
      case 'tracking':
        url = `#/tracking/${route.jobId}`;
        break;
      case 'documents':
        url = `#/documents/${route.userId}`;
        break;
    }

    // Only update if URL changed (performance optimization)
    if (window.location.hash !== url) {
      window.history.pushState(null, '', url);
      this.currentRoute = null; // Invalidate cache
      this.notifyListeners();
    }
  }

  // Go back
  goBack() {
    this.currentRoute = null; // Invalidate cache
    window.history.back();
  }

  // Subscribe to route changes
  onChange(callback: (route: Route) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners() {
    const route = this.getCurrentRoute();
    this.listeners.forEach(listener => listener(route));
  }
}

// Singleton instance
export const router = new Router();