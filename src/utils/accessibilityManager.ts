/**
 * Accessibility Manager - WCAG 2.1 AA Compliance
 * Handles keyboard navigation, focus management, ARIA attributes, and screen reader support
 */

// ==================== TYPES ====================
export interface FocusTrapOptions {
  element: HTMLElement;
  initialFocus?: HTMLElement;
  onEscape?: () => void;
  allowOutsideClick?: boolean;
}

export interface SkipLink {
  id: string;
  label: string;
  target: string;
}

export interface AccessibilitySettings {
  reduceMotion: boolean;
  highContrast: boolean;
  largeFonts: boolean;
  screenReader: boolean;
}

// ==================== FOCUS TRAP MANAGER ====================
class FocusTrapManager {
  private activeTrap: FocusTrapOptions | null = null;
  private focusableElements: HTMLElement[] = [];
  private firstFocusable: HTMLElement | null = null;
  private lastFocusable: HTMLElement | null = null;

  /**
   * Create focus trap within element
   */
  createTrap(options: FocusTrapOptions): () => void {
    this.activeTrap = options;
    this.updateFocusableElements();

    // Focus initial element or first focusable
    if (options.initialFocus) {
      options.initialFocus.focus();
    } else if (this.firstFocusable) {
      this.firstFocusable.focus();
    }

    // Add event listeners
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('focusin', this.handleFocusIn);

    // Return cleanup function
    return () => this.removeTrap();
  }

  /**
   * Remove active focus trap
   */
  removeTrap(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('focusin', this.handleFocusIn);
    this.activeTrap = null;
    this.focusableElements = [];
    this.firstFocusable = null;
    this.lastFocusable = null;
  }

  /**
   * Update list of focusable elements
   */
  private updateFocusableElements(): void {
    if (!this.activeTrap) return;

    const { element } = this.activeTrap;
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    this.focusableElements = Array.from(
      element.querySelectorAll<HTMLElement>(selector)
    ).filter(el => {
      // Filter out hidden elements
      return el.offsetParent !== null && 
             window.getComputedStyle(el).visibility !== 'hidden';
    });

    this.firstFocusable = this.focusableElements[0] || null;
    this.lastFocusable = this.focusableElements[this.focusableElements.length - 1] || null;
  }

  /**
   * Handle keydown events
   */
  private handleKeyDown = (e: KeyboardEvent): void => {
    if (!this.activeTrap) return;

    // Handle Tab key
    if (e.key === 'Tab') {
      if (this.focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      if (e.shiftKey) {
        // Shift + Tab - move backwards
        if (document.activeElement === this.firstFocusable) {
          e.preventDefault();
          this.lastFocusable?.focus();
        }
      } else {
        // Tab - move forwards
        if (document.activeElement === this.lastFocusable) {
          e.preventDefault();
          this.firstFocusable?.focus();
        }
      }
    }

    // Handle Escape key
    if (e.key === 'Escape' && this.activeTrap.onEscape) {
      e.preventDefault();
      this.activeTrap.onEscape();
    }
  };

  /**
   * Handle focus events
   */
  private handleFocusIn = (e: FocusEvent): void => {
    if (!this.activeTrap || this.activeTrap.allowOutsideClick) return;

    const target = e.target as HTMLElement;
    const { element } = this.activeTrap;

    // If focus moved outside trap, bring it back
    if (!element.contains(target)) {
      e.preventDefault();
      this.firstFocusable?.focus();
    }
  };
}

// ==================== SKIP LINKS MANAGER ====================
class SkipLinksManager {
  private skipLinks: SkipLink[] = [];
  private containerElement: HTMLElement | null = null;

  /**
   * Initialize skip links
   */
  initialize(links: SkipLink[]): void {
    this.skipLinks = links;
    this.createSkipLinksContainer();
  }

  /**
   * Create skip links container
   */
  private createSkipLinksContainer(): void {
    // Remove existing container if present
    const existing = document.getElementById('skip-links');
    if (existing) {
      existing.remove();
    }

    // Create new container
    const container = document.createElement('div');
    container.id = 'skip-links';
    container.className = 'skip-links';
    container.setAttribute('role', 'navigation');
    container.setAttribute('aria-label', 'Skip navigation');

    // Add skip links
    this.skipLinks.forEach(link => {
      const anchor = document.createElement('a');
      anchor.href = `#${link.target}`;
      anchor.className = 'skip-link';
      anchor.textContent = link.label;
      anchor.id = link.id;

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(link.target);
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });

      container.appendChild(anchor);
    });

    // Insert at beginning of body
    document.body.insertBefore(container, document.body.firstChild);
    this.containerElement = container;
  }

  /**
   * Update skip links
   */
  update(links: SkipLink[]): void {
    this.skipLinks = links;
    this.createSkipLinksContainer();
  }

  /**
   * Remove skip links
   */
  remove(): void {
    if (this.containerElement) {
      this.containerElement.remove();
      this.containerElement = null;
    }
  }
}

// ==================== KEYBOARD NAVIGATION MANAGER ====================
class KeyboardNavigationManager {
  private keyboardShortcuts: Map<string, () => void> = new Map();

  /**
   * Register keyboard shortcut
   */
  registerShortcut(key: string, callback: () => void, modifiers?: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
  }): () => void {
    const shortcutKey = this.createShortcutKey(key, modifiers);
    this.keyboardShortcuts.set(shortcutKey, callback);

    // Add event listener
    document.addEventListener('keydown', this.handleKeyDown);

    // Return unregister function
    return () => {
      this.keyboardShortcuts.delete(shortcutKey);
      if (this.keyboardShortcuts.size === 0) {
        document.removeEventListener('keydown', this.handleKeyDown);
      }
    };
  }

  /**
   * Create unique key for shortcut
   */
  private createShortcutKey(key: string, modifiers?: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
  }): string {
    const parts: string[] = [];
    if (modifiers?.ctrl) parts.push('ctrl');
    if (modifiers?.shift) parts.push('shift');
    if (modifiers?.alt) parts.push('alt');
    parts.push(key.toLowerCase());
    return parts.join('+');
  }

  /**
   * Handle keydown events
   */
  private handleKeyDown = (e: KeyboardEvent): void => {
    const parts: string[] = [];
    if (e.ctrlKey || e.metaKey) parts.push('ctrl');
    if (e.shiftKey) parts.push('shift');
    if (e.altKey) parts.push('alt');
    parts.push(e.key.toLowerCase());

    const shortcutKey = parts.join('+');
    const callback = this.keyboardShortcuts.get(shortcutKey);

    if (callback) {
      e.preventDefault();
      callback();
    }
  };

  /**
   * Unregister all shortcuts
   */
  unregisterAll(): void {
    this.keyboardShortcuts.clear();
    document.removeEventListener('keydown', this.handleKeyDown);
  }
}

// ==================== ARIA LIVE ANNOUNCER ====================
class AriaLiveAnnouncer {
  private liveRegion: HTMLElement | null = null;

  constructor() {
    this.createLiveRegion();
  }

  /**
   * Create ARIA live region
   */
  private createLiveRegion(): void {
    const region = document.createElement('div');
    region.id = 'aria-live-region';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    region.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;

    document.body.appendChild(region);
    this.liveRegion = region;
  }

  /**
   * Announce message to screen readers
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.liveRegion) {
      this.createLiveRegion();
    }

    if (this.liveRegion) {
      // Update aria-live priority
      this.liveRegion.setAttribute('aria-live', priority);

      // Clear previous message
      this.liveRegion.textContent = '';

      // Set new message after short delay (ensures screen reader picks it up)
      setTimeout(() => {
        if (this.liveRegion) {
          this.liveRegion.textContent = message;
        }
      }, 100);

      // Clear message after 5 seconds
      setTimeout(() => {
        if (this.liveRegion) {
          this.liveRegion.textContent = '';
        }
      }, 5000);
    }
  }

  /**
   * Remove live region
   */
  remove(): void {
    if (this.liveRegion) {
      this.liveRegion.remove();
      this.liveRegion = null;
    }
  }
}

// ==================== ACCESSIBILITY SETTINGS MANAGER ====================
class AccessibilitySettingsManager {
  private settings: AccessibilitySettings = {
    reduceMotion: false,
    highContrast: false,
    largeFonts: false,
    screenReader: false
  };

  private listeners: Array<(settings: AccessibilitySettings) => void> = [];

  constructor() {
    this.loadSettings();
    this.detectSystemPreferences();
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): void {
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
        this.applySettings();
      } catch (error) {
        console.error('Failed to load accessibility settings:', error);
      }
    }
  }

  /**
   * Detect system preferences
   */
  private detectSystemPreferences(): void {
    // Detect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches && !localStorage.getItem('accessibility-settings')) {
      this.updateSetting('reduceMotion', true);
    }

    // Listen for changes
    prefersReducedMotion.addEventListener('change', (e) => {
      this.updateSetting('reduceMotion', e.matches);
    });

    // Detect high contrast
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
    if (prefersHighContrast.matches && !localStorage.getItem('accessibility-settings')) {
      this.updateSetting('highContrast', true);
    }
  }

  /**
   * Get current settings
   */
  getSettings(): AccessibilitySettings {
    return { ...this.settings };
  }

  /**
   * Update setting
   */
  updateSetting<K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ): void {
    this.settings[key] = value;
    this.saveSettings();
    this.applySettings();
    this.notifyListeners();
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    localStorage.setItem('accessibility-settings', JSON.stringify(this.settings));
  }

  /**
   * Apply settings to document
   */
  private applySettings(): void {
    const root = document.documentElement;

    // Reduce motion
    if (this.settings.reduceMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.style.setProperty('--transition-duration', '0.01ms');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }

    // High contrast
    if (this.settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Large fonts
    if (this.settings.largeFonts) {
      root.classList.add('large-fonts');
    } else {
      root.classList.remove('large-fonts');
    }
  }

  /**
   * Subscribe to settings changes
   */
  onSettingsChange(callback: (settings: AccessibilitySettings) => void): () => void {
    this.listeners.push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify listeners of changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getSettings()));
  }
}

// ==================== ARIA HELPERS ====================
/**
 * Generate unique ID for ARIA relationships
 */
export function generateAriaId(prefix: string = 'aria'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Set ARIA described by relationship
 */
export function setAriaDescribedBy(element: HTMLElement, descriptionId: string): void {
  const existing = element.getAttribute('aria-describedby');
  if (existing) {
    if (!existing.split(' ').includes(descriptionId)) {
      element.setAttribute('aria-describedby', `${existing} ${descriptionId}`);
    }
  } else {
    element.setAttribute('aria-describedby', descriptionId);
  }
}

/**
 * Set ARIA labelled by relationship
 */
export function setAriaLabelledBy(element: HTMLElement, labelId: string): void {
  element.setAttribute('aria-labelledby', labelId);
}

/**
 * Check if element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  return element.matches(focusableSelector) && element.offsetParent !== null;
}

/**
 * Get next focusable element
 */
export function getNextFocusable(current: HTMLElement): HTMLElement | null {
  const focusableElements = Array.from(
    document.querySelectorAll<HTMLElement>('[tabindex], a, button, input, select, textarea')
  ).filter(isFocusable);

  const currentIndex = focusableElements.indexOf(current);
  return focusableElements[currentIndex + 1] || null;
}

/**
 * Get previous focusable element
 */
export function getPreviousFocusable(current: HTMLElement): HTMLElement | null {
  const focusableElements = Array.from(
    document.querySelectorAll<HTMLElement>('[tabindex], a, button, input, select, textarea')
  ).filter(isFocusable);

  const currentIndex = focusableElements.indexOf(current);
  return focusableElements[currentIndex - 1] || null;
}

// ==================== EXPORTS ====================
export const focusTrapManager = new FocusTrapManager();
export const skipLinksManager = new SkipLinksManager();
export const keyboardNavigationManager = new KeyboardNavigationManager();
export const ariaLiveAnnouncer = new AriaLiveAnnouncer();
export const accessibilitySettingsManager = new AccessibilitySettingsManager();

// ==================== INITIALIZATION ====================
/**
 * Initialize accessibility features
 */
export function initializeAccessibility(): void {
  console.log('🎯 Initializing accessibility features...');

  // Initialize skip links
  skipLinksManager.initialize([
    { id: 'skip-to-main', label: 'Skip to main content', target: 'main-content' },
    { id: 'skip-to-nav', label: 'Skip to navigation', target: 'main-navigation' },
    { id: 'skip-to-footer', label: 'Skip to footer', target: 'footer' }
  ]);

  // Register global keyboard shortcuts
  keyboardNavigationManager.registerShortcut('?', () => {
    ariaLiveAnnouncer.announce('Keyboard shortcuts: Press H for help, Slash for search, Escape to close dialogs');
  });

  // Log settings
  const settings = accessibilitySettingsManager.getSettings();
  console.log('♿ Accessibility Settings:', settings);

  console.log('✅ Accessibility features initialized');
}
