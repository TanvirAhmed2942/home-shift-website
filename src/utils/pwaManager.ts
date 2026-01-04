/**
 * PWA Manager - Service Worker, Install Prompt, Offline Support
 * Handles Progressive Web App functionality for ShiftMyHome
 */

// ==================== TYPES ====================
export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAInstallState {
  canInstall: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  installPromptEvent: BeforeInstallPromptEvent | null;
}

export interface CacheStrategy {
  strategy: 'cacheFirst' | 'networkFirst' | 'staleWhileRevalidate' | 'networkOnly' | 'cacheOnly';
  cacheName: string;
  maxAge?: number; // in seconds
  maxEntries?: number;
}

// ==================== PWA INSTALL MANAGER ====================
class PWAInstallManager {
  private installPromptEvent: BeforeInstallPromptEvent | null = null;
  private installStateListeners: Array<(state: PWAInstallState) => void> = [];

  constructor() {
    this.init();
  }

  private init() {
    // Listen for beforeinstallprompt event
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.installPromptEvent = e as BeforeInstallPromptEvent;
        this.notifyListeners();
      });

      // Listen for app installed event
      window.addEventListener('appinstalled', () => {
        this.installPromptEvent = null;
        this.notifyListeners();
        console.log('✅ PWA installed successfully');
      });
    }
  }

  /**
   * Check if app can be installed
   */
  canInstall(): boolean {
    return this.installPromptEvent !== null;
  }

  /**
   * Check if app is already installed
   */
  isInstalled(): boolean {
    if (typeof window === 'undefined') return false;
    // Check if running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;
    return isStandalone;
  }

  /**
   * Check if running in standalone mode
   */
  isStandalone(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }

  /**
   * Get current install state
   */
  getInstallState(): PWAInstallState {
    return {
      canInstall: this.canInstall(),
      isInstalled: this.isInstalled(),
      isStandalone: this.isStandalone(),
      installPromptEvent: this.installPromptEvent
    };
  }

  /**
   * Show install prompt
   */
  async showInstallPrompt(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
    if (!this.installPromptEvent) {
      return 'unavailable';
    }

    try {
      await this.installPromptEvent.prompt();
      const { outcome } = await this.installPromptEvent.userChoice;
      
      if (outcome === 'accepted') {
        console.log('✅ User accepted PWA install');
        this.installPromptEvent = null;
      } else {
        console.log('❌ User dismissed PWA install');
      }
      
      this.notifyListeners();
      return outcome;
    } catch (error) {
      console.error('❌ Error showing install prompt:', error);
      return 'unavailable';
    }
  }

  /**
   * Subscribe to install state changes
   */
  onInstallStateChange(callback: (state: PWAInstallState) => void): () => void {
    this.installStateListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.installStateListeners = this.installStateListeners.filter(cb => cb !== callback);
    };
  }

  private notifyListeners() {
    const state = this.getInstallState();
    this.installStateListeners.forEach(listener => listener(state));
  }
}

// ==================== SERVICE WORKER MANAGER ====================
class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private updateAvailable = false;
  private updateListeners: Array<() => void> = [];

  /**
   * Register service worker
   * DISABLED to fix "Background sync failed" errors
   */
  async register(): Promise<ServiceWorkerRegistration | null> {
    // Force unregister to clean up any bad SWs
    await this.unregister();
    return null;
  }

  /**
   * Unregister service worker
   */
  async unregister(): Promise<boolean> {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
      return false;
    }

    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.log('✅ Service Worker unregistered:', registration.scope);
      }
      return true;
    } catch (error) {
      console.error('❌ Service Worker unregister failed:', error);
      return false;
    }
  }

  /**
   * Update service worker
   */
  async update(): Promise<void> {
    // No-op
  }

  /**
   * Skip waiting and activate new service worker
   */
  async skipWaiting(): Promise<void> {
    // No-op
  }

  /**
   * Check if update is available
   */
  isUpdateAvailable(): boolean {
    return false;
  }

  /**
   * Subscribe to update notifications
   */
  onUpdateAvailable(callback: () => void): () => void {
    // No-op
    return () => {};
  }

  private notifyUpdateListeners() {
    // No-op
  }

  /**
   * Get service worker registration
   */
  getRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }
}

// ==================== OFFLINE MANAGER ====================
class OfflineManager {
  private isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private offlineListeners: Array<(online: boolean) => void> = [];

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.notifyListeners();
        console.log('✅ Back online');
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.notifyListeners();
        console.log('⚠️ Gone offline');
      });
    }
  }

  /**
   * Check if online
   */
  getOnlineStatus(): boolean {
    return this.isOnline;
  }

  /**
   * Subscribe to online/offline events
   */
  onStatusChange(callback: (online: boolean) => void): () => void {
    this.offlineListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.offlineListeners = this.offlineListeners.filter(cb => cb !== callback);
    };
  }

  private notifyListeners() {
    this.offlineListeners.forEach(listener => listener(this.isOnline));
  }

  /**
   * Show offline notification
   */
  showOfflineNotification() {
    if (!this.isOnline && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('You are offline', {
          body: 'Some features may be limited. We\'ll sync when you\'re back online.',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          tag: 'offline-notification'
        });
      } catch (e) {
        // Ignore notification errors
      }
    }
  }
}

// ==================== CACHE MANAGER ====================
class CacheManager {
  /**
   * Cache asset with strategy
   */
  async cacheAsset(url: string, strategy: CacheStrategy = { strategy: 'cacheFirst', cacheName: 'assets' }): Promise<Response | null> {
    if (typeof caches === 'undefined') return null;
    
    // Simplified: Just fetch, no caching to avoid issues
    try {
      return await fetch(url);
    } catch (error) {
      return null;
    }
  }

  /**
   * Clear cache by name
   */
  async clearCache(cacheName: string): Promise<boolean> {
    if (typeof caches === 'undefined') return false;
    return await caches.delete(cacheName);
  }

  /**
   * Clear all caches
   */
  async clearAllCaches(): Promise<void> {
    if (typeof caches === 'undefined') return;
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('✅ All caches cleared');
  }

  /**
   * Get cache size
   */
  async getCacheSize(): Promise<number> {
    if (typeof navigator !== 'undefined' && 'storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return estimate.usage || 0;
    }
    return 0;
  }

  /**
   * Get cache quota
   */
  async getCacheQuota(): Promise<number> {
    if (typeof navigator !== 'undefined' && 'storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return estimate.quota || 0;
    }
    return 0;
  }
}

// ==================== EXPORTS ====================
export const pwaInstallManager = new PWAInstallManager();
export const serviceWorkerManager = new ServiceWorkerManager();
export const offlineManager = new OfflineManager();
export const cacheManager = new CacheManager();

// ==================== INITIALIZATION ====================
/**
 * Initialize PWA features
 */
export async function initializePWA(): Promise<void> {
  console.log('🚀 Initializing PWA features...');

  // Unregister service worker to prevent "Background sync failed" errors
  await serviceWorkerManager.unregister();

  // Log install state
  const installState = pwaInstallManager.getInstallState();
  console.log('📱 PWA Install State:', installState);

  // Log online status
  console.log(offlineManager.getOnlineStatus() ? '✅ Online' : '⚠️ Offline');
}