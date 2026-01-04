/**
 * Performance Utilities for ShiftMyHome
 * Provides caching, debouncing, throttling, and performance monitoring
 */

// ==================== CACHE MANAGER ====================

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // milliseconds
}

class CacheManager {
  private cache: Map<string, CacheItem<any>> = new Map();

  // Get item from cache
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    // Check if expired
    if (Date.now() - item.timestamp > item.expiresIn) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }

  // Set item in cache
  set<T>(key: string, data: T, expiresIn: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn,
    });
  }

  // Clear specific key
  clear(key: string): void {
    this.cache.delete(key);
  }

  // Clear all cache
  clearAll(): void {
    this.cache.clear();
  }

  // Get cache size
  getSize(): number {
    return this.cache.size;
  }

  // Get cache stats
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export const cacheManager = new CacheManager();

// ==================== DEBOUNCE ====================

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// ==================== THROTTLE ====================

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ==================== MEMOIZATION ====================

export function memoize<T extends (...args: any[]) => any>(func: T): T {
  const cache = new Map<string, any>();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// ==================== PERFORMANCE MONITORING ====================

class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  // Start timing
  startTimer(label: string): () => void {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(label, duration);
    };
  }

  // Record metric
  private recordMetric(label: string, duration: number): void {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    
    const metrics = this.metrics.get(label)!;
    metrics.push(duration);
    
    // Keep only last 100 measurements
    if (metrics.length > 100) {
      metrics.shift();
    }
  }

  // Get average duration
  getAverage(label: string): number {
    const metrics = this.metrics.get(label);
    if (!metrics || metrics.length === 0) return 0;
    
    const sum = metrics.reduce((a, b) => a + b, 0);
    return sum / metrics.length;
  }

  // Get all metrics
  getAllMetrics(): Record<string, { avg: number; count: number }> {
    const result: Record<string, { avg: number; count: number }> = {};
    
    this.metrics.forEach((values, label) => {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      result[label] = { avg, count: values.length };
    });
    
    return result;
  }

  // Clear metrics
  clear(): void {
    this.metrics.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();

// ==================== LAZY LOAD IMAGES ====================

export function lazyLoadImage(
  src: string,
  placeholder?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    
    img.onload = () => resolve(src);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    
    // Return placeholder immediately if provided
    if (placeholder) {
      resolve(placeholder);
    }
  });
}

// ==================== INTERSECTION OBSERVER (Lazy Loading) ====================

export function observeIntersection(
  element: HTMLElement,
  callback: () => void,
  options?: IntersectionObserverInit
): () => void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
          observer.disconnect();
        }
      });
    },
    options || { threshold: 0.1 }
  );

  observer.observe(element);

  // Return cleanup function
  return () => observer.disconnect();
}

// ==================== LOCAL STORAGE UTILITIES ====================

export const storage = {
  // Get item with expiration
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsed = JSON.parse(item);
      
      // Check expiration
      if (parsed.expires && Date.now() > parsed.expires) {
        localStorage.removeItem(key);
        return null;
      }

      return parsed.value as T;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  // Set item with optional expiration
  set<T>(key: string, value: T, expiresIn?: number): void {
    try {
      const item = {
        value,
        expires: expiresIn ? Date.now() + expiresIn : null,
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  // Remove item
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  // Clear all
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

// ==================== BATCH UPDATES ====================

export function batchUpdates<T>(
  updates: T[],
  callback: (batch: T[]) => void,
  batchSize: number = 10,
  delay: number = 100
): void {
  let currentBatch: T[] = [];
  let timeoutId: NodeJS.Timeout | null = null;

  updates.forEach((update, index) => {
    currentBatch.push(update);

    if (currentBatch.length >= batchSize || index === updates.length - 1) {
      const batch = [...currentBatch];
      currentBatch = [];

      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => callback(batch), delay);
    }
  });
}

// ==================== ARRAY UTILITIES ====================

// Chunk array into smaller arrays
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// Remove duplicates
export function uniqueArray<T>(array: T[], key?: keyof T): T[] {
  if (!key) {
    return Array.from(new Set(array));
  }

  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

// ==================== FORMAT UTILITIES ====================

// Format currency
export function formatCurrency(amount: number, currency: string = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
  }).format(amount);
}

// Format date
export function formatDate(date: string | Date, format: 'short' | 'long' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'short') {
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
  
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Format time ago
export function formatTimeAgo(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
}

// ==================== VALIDATION UTILITIES ====================

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone (UK format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+44|0)[1-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Validate postcode (UK format)
export function isValidPostcode(postcode: string): boolean {
  const postcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i;
  return postcodeRegex.test(postcode.trim());
}

// ==================== URL UTILITIES ====================

// Build query string
export function buildQueryString(params: Record<string, any>): string {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

// Parse query string
export function parseQueryString(query: string): Record<string, string> {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(query);
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

// ==================== RETRY LOGIC ====================

export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay * 2); // Exponential backoff
  }
}

// ==================== ANALYTICS ====================

export const analytics = {
  // Track page view
  pageView(page: string): void {
    console.log(`[Analytics] Page View: ${page}`);
    // In production: Google Analytics, Mixpanel, etc.
  },

  // Track event
  event(category: string, action: string, label?: string, value?: number): void {
    console.log(`[Analytics] Event: ${category} - ${action}`, { label, value });
    // In production: Google Analytics, Mixpanel, etc.
  },

  // Track timing
  timing(category: string, variable: string, time: number): void {
    console.log(`[Analytics] Timing: ${category} - ${variable}: ${time}ms`);
    // In production: Google Analytics, Mixpanel, etc.
  },
};
