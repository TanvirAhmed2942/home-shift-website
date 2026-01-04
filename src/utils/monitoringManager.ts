/**
 * Advanced Monitoring Manager
 * Error tracking, performance monitoring, and user behavior analytics
 * Production-ready monitoring system (Sentry-like)
 */

// ==================== TYPES ====================
export interface ErrorLog {
  id: string;
  timestamp: number;
  error: Error;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
  userAgent: string;
  url: string;
  userId?: string;
}

export interface PerformanceMetric {
  id: string;
  timestamp: number;
  metric: string;
  value: number;
  url: string;
  context?: Record<string, any>;
}

export interface UserEvent {
  id: string;
  timestamp: number;
  eventType: string;
  eventData: Record<string, any>;
  userId?: string;
  sessionId: string;
}

// ==================== ERROR TRACKING MANAGER ====================
class ErrorTrackingManager {
  private errors: ErrorLog[] = [];
  private maxErrors = 100;

  /**
   * Log error
   */
  logError(
    error: Error,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    context?: Record<string, any>
  ): void {
    const errorLog: ErrorLog = {
      id: this.generateId(),
      timestamp: Date.now(),
      error,
      severity,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getUserId()
    };

    this.errors.push(errorLog);

    // Keep only last N errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log to console in development
    if ((import.meta as any).env?.DEV) {
      console.error('[Error Tracking]', errorLog);
    }

    // Send to backend (TODO: implement API call)
    this.sendToBackend(errorLog);

    // Store in localStorage for persistence
    this.persistErrors();
  }

  /**
   * Get all errors
   */
  getErrors(filter?: {
    severity?: ErrorLog['severity'];
    startTime?: number;
    endTime?: number;
  }): ErrorLog[] {
    let filtered = [...this.errors];

    if (filter?.severity) {
      filtered = filtered.filter(e => e.severity === filter.severity);
    }

    if (filter?.startTime) {
      filtered = filtered.filter(e => e.timestamp >= filter.startTime);
    }

    if (filter?.endTime) {
      filtered = filtered.filter(e => e.timestamp <= filter.endTime);
    }

    return filtered;
  }

  /**
   * Clear errors
   */
  clearErrors(): void {
    this.errors = [];
    localStorage.removeItem('error-logs');
  }

  /**
   * Export errors as JSON
   */
  exportErrors(): string {
    return JSON.stringify(this.errors, null, 2);
  }

  private generateId(): string {
    return `err-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getUserId(): string | undefined {
    return localStorage.getItem('userId') || undefined;
  }

  private sendToBackend(errorLog: ErrorLog): void {
    // TODO: Implement API call to backend
    // fetch('/api/errors', {
    //   method: 'POST',
    //   body: JSON.stringify(errorLog)
    // });
  }

  private persistErrors(): void {
    try {
      localStorage.setItem('error-logs', JSON.stringify(this.errors.slice(-20)));
    } catch (e) {
      console.warn('Failed to persist errors:', e);
    }
  }
}

// ==================== PERFORMANCE MONITORING MANAGER ====================
class PerformanceMonitoringManager {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 500;

  /**
   * Record performance metric
   */
  recordMetric(metric: string, value: number, context?: Record<string, any>): void {
    const performanceMetric: PerformanceMetric = {
      id: this.generateId(),
      timestamp: Date.now(),
      metric,
      value,
      url: window.location.href,
      context
    };

    this.metrics.push(performanceMetric);

    // Keep only last N metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Log in development
    if ((import.meta as any).env?.DEV) {
      console.log(`[Performance] ${metric}:`, value, 'ms');
    }
  }

  /**
   * Get Core Web Vitals
   */
  getCoreWebVitals(): {
    FCP?: number;
    LCP?: number;
    FID?: number;
    CLS?: number;
    TTFB?: number;
  } {
    const vitals: any = {};

    // First Contentful Paint
    const fcp = performance.getEntriesByName('first-contentful-paint')[0];
    if (fcp) {
      vitals.FCP = fcp.startTime;
    }

    // Largest Contentful Paint
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    if (lcpEntries.length > 0) {
      vitals.LCP = lcpEntries[lcpEntries.length - 1].startTime;
    }

    // Time to First Byte
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      vitals.TTFB = navigation.responseStart - navigation.requestStart;
    }

    return vitals;
  }

  /**
   * Get performance timeline
   */
  getPerformanceTimeline(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get average for metric
   */
  getAverageMetric(metricName: string): number {
    const filtered = this.metrics.filter(m => m.metric === metricName);
    if (filtered.length === 0) return 0;

    const sum = filtered.reduce((acc, m) => acc + m.value, 0);
    return sum / filtered.length;
  }

  /**
   * Monitor component render time
   */
  measureRender(componentName: string, callback: () => void): void {
    const start = performance.now();
    callback();
    const duration = performance.now() - start;
    this.recordMetric(`render-${componentName}`, duration);
  }

  /**
   * Monitor API call performance
   */
  async measureApiCall<T>(apiName: string, apiCall: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      const result = await apiCall();
      const duration = performance.now() - start;
      this.recordMetric(`api-${apiName}`, duration, { success: true });
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.recordMetric(`api-${apiName}`, duration, { success: false });
      throw error;
    }
  }

  private generateId(): string {
    return `perf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ==================== USER BEHAVIOR TRACKING MANAGER ====================
class UserBehaviorTrackingManager {
  private events: UserEvent[] = [];
  private sessionId: string;
  private maxEvents = 1000;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.initializeTracking();
  }

  /**
   * Track user event
   */
  trackEvent(eventType: string, eventData: Record<string, any> = {}): void {
    const event: UserEvent = {
      id: this.generateId(),
      timestamp: Date.now(),
      eventType,
      eventData,
      userId: this.getUserId(),
      sessionId: this.sessionId
    };

    this.events.push(event);

    // Keep only last N events
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    // Log in development
    if ((import.meta as any).env?.DEV) {
      console.log(`[User Event] ${eventType}:`, eventData);
    }

    // Send to analytics (TODO: implement)
    this.sendToAnalytics(event);
  }

  /**
   * Track page view
   */
  trackPageView(pageName: string, pageData?: Record<string, any>): void {
    this.trackEvent('page_view', {
      page: pageName,
      url: window.location.href,
      referrer: document.referrer,
      ...pageData
    });
  }

  /**
   * Track button click
   */
  trackButtonClick(buttonName: string, location?: string): void {
    this.trackEvent('button_click', {
      button: buttonName,
      location
    });
  }

  /**
   * Track form submission
   */
  trackFormSubmission(formName: string, success: boolean): void {
    this.trackEvent('form_submission', {
      form: formName,
      success
    });
  }

  /**
   * Track search
   */
  trackSearch(query: string, resultsCount?: number): void {
    this.trackEvent('search', {
      query,
      resultsCount
    });
  }

  /**
   * Track error
   */
  trackError(errorType: string, errorMessage: string): void {
    this.trackEvent('error', {
      type: errorType,
      message: errorMessage
    });
  }

  /**
   * Get user journey
   */
  getUserJourney(userId?: string): UserEvent[] {
    if (userId) {
      return this.events.filter(e => e.userId === userId);
    }
    return this.events.filter(e => e.sessionId === this.sessionId);
  }

  /**
   * Get event statistics
   */
  getEventStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    this.events.forEach(event => {
      stats[event.eventType] = (stats[event.eventType] || 0) + 1;
    });
    return stats;
  }

  /**
   * Initialize automatic tracking
   */
  private initializeTracking(): void {
    // Track page visibility
    document.addEventListener('visibilitychange', () => {
      this.trackEvent('visibility_change', {
        hidden: document.hidden
      });
    });

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.trackEvent('page_unload', {
        timeOnPage: Date.now() - parseInt(sessionStorage.getItem('page-load-time') || '0')
      });
    });

    // Store page load time
    sessionStorage.setItem('page-load-time', Date.now().toString());
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('session-id');
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('session-id', sessionId);
    }
    return sessionId;
  }

  private getUserId(): string | undefined {
    return localStorage.getItem('userId') || undefined;
  }

  private generateId(): string {
    return `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private sendToAnalytics(event: UserEvent): void {
    // TODO: Send to Google Analytics 4, Mixpanel, etc.
    // gtag('event', event.eventType, event.eventData);
  }
}

// ==================== CONSOLE INTERCEPTOR ====================
class ConsoleInterceptor {
  private originalConsole: {
    log: typeof console.log;
    warn: typeof console.warn;
    error: typeof console.error;
  };

  constructor() {
    this.originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error
    };
  }

  /**
   * Start intercepting console
   */
  start(): void {
    console.error = (...args: any[]) => {
      this.originalConsole.error(...args);
      errorTrackingManager.logError(
        new Error(args.join(' ')),
        'medium',
        { source: 'console.error' }
      );
    };

    console.warn = (...args: any[]) => {
      this.originalConsole.warn(...args);
      errorTrackingManager.logError(
        new Error(args.join(' ')),
        'low',
        { source: 'console.warn' }
      );
    };
  }

  /**
   * Stop intercepting console
   */
  stop(): void {
    console.log = this.originalConsole.log;
    console.warn = this.originalConsole.warn;
    console.error = this.originalConsole.error;
  }
}

// ==================== EXPORTS ====================
export const errorTrackingManager = new ErrorTrackingManager();
export const performanceMonitoringManager = new PerformanceMonitoringManager();
export const userBehaviorTrackingManager = new UserBehaviorTrackingManager();
export const consoleInterceptor = new ConsoleInterceptor();

// ==================== INITIALIZATION ====================
/**
 * Initialize monitoring features
 */
export function initializeMonitoring(): void {
  console.log('📊 Initializing monitoring features...');

  // Start console interception
  consoleInterceptor.start();

  // Track initial page load
  userBehaviorTrackingManager.trackPageView('home');

  // Monitor performance
  if ('PerformanceObserver' in window) {
    // Monitor Long Tasks
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) {
            performanceMonitoringManager.recordMetric('long-task', entry.duration);
          }
        });
      });
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      console.warn('PerformanceObserver not fully supported');
    }
  }

  // Log Core Web Vitals after load
  window.addEventListener('load', () => {
    setTimeout(() => {
      const vitals = performanceMonitoringManager.getCoreWebVitals();
      console.log('📈 Core Web Vitals:', vitals);
    }, 0);
  });

  console.log('✅ Monitoring initialized');
}

/**
 * Global error handler
 */
window.addEventListener('error', (event) => {
  errorTrackingManager.logError(
    event.error || new Error(event.message),
    'high',
    {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    }
  );
});

/**
 * Unhandled promise rejection handler
 */
window.addEventListener('unhandledrejection', (event) => {
  errorTrackingManager.logError(
    event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
    'critical',
    { type: 'unhandled_rejection' }
  );
});