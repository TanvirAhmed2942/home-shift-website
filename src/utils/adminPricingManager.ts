/**
 * Admin Pricing Configuration Manager
 * This simulates the database configuration for pricing rules.
 * In a real app, this would be fetched from the database.
 */

export interface PricingRule {
  id: string;
  serviceType: string;
  basePrice: number;
  pricePerMile: number;
  pricePerMinute: number; // For time-based calculation if needed
  minDistance: number;
  minPrice: number;
  hourlyRate: number; // For Man & Van
  vanTypeMultiplier: {
    small: number;
    medium: number;
    large: number;
    luton: number;
  };
  extraStopPrice: number;
  stairsPricePerFlight: number;
  congestionCharge: number;
  ulezCharge: number;
  weekendMultiplier: number;
}

export const DEFAULT_PRICING_RULES: Record<string, PricingRule> = {
  'house-move': {
    id: 'rule-house-move',
    serviceType: 'house-move',
    basePrice: 150,
    pricePerMile: 2.5,
    pricePerMinute: 0.5,
    minDistance: 10,
    minPrice: 250,
    hourlyRate: 80,
    vanTypeMultiplier: {
      small: 1.0, // Not typically used for house moves
      medium: 1.2,
      large: 1.5,
      luton: 1.8,
    },
    extraStopPrice: 40,
    stairsPricePerFlight: 15,
    congestionCharge: 15,
    ulezCharge: 12.50,
    weekendMultiplier: 1.2,
  },
  'furniture': {
    id: 'rule-furniture',
    serviceType: 'furniture',
    basePrice: 45,
    pricePerMile: 1.8,
    pricePerMinute: 0.3,
    minDistance: 5,
    minPrice: 55,
    hourlyRate: 50,
    vanTypeMultiplier: {
      small: 1.0,
      medium: 1.2,
      large: 1.4,
      luton: 1.6,
    },
    extraStopPrice: 20,
    stairsPricePerFlight: 10,
    congestionCharge: 15,
    ulezCharge: 12.50,
    weekendMultiplier: 1.1,
  },
  'man-van': {
    id: 'rule-man-van',
    serviceType: 'man-van',
    basePrice: 60,
    pricePerMile: 2.0,
    pricePerMinute: 0.4,
    minDistance: 5,
    minPrice: 75,
    hourlyRate: 65,
    vanTypeMultiplier: {
      small: 1.0,
      medium: 1.2,
      large: 1.5,
      luton: 1.8,
    },
    extraStopPrice: 25,
    stairsPricePerFlight: 10,
    congestionCharge: 15,
    ulezCharge: 12.50,
    weekendMultiplier: 1.15,
  },
  'motorbike': {
    id: 'rule-motorbike',
    serviceType: 'motorbike',
    basePrice: 80,
    pricePerMile: 1.5,
    pricePerMinute: 0.3,
    minDistance: 10,
    minPrice: 100,
    hourlyRate: 60,
    vanTypeMultiplier: {
      small: 1.0, // Fits in medium/large van
      medium: 1.0,
      large: 1.0,
      luton: 1.0,
    },
    extraStopPrice: 30,
    stairsPricePerFlight: 0, // Not applicable
    congestionCharge: 15,
    ulezCharge: 12.50,
    weekendMultiplier: 1.1,
  },
  'store-pickup': {
    id: 'rule-store-pickup',
    serviceType: 'store-pickup',
    basePrice: 40,
    pricePerMile: 1.8,
    pricePerMinute: 0.3,
    minDistance: 5,
    minPrice: 50,
    hourlyRate: 45,
    vanTypeMultiplier: {
      small: 1.0,
      medium: 1.2,
      large: 1.4,
      luton: 1.6,
    },
    extraStopPrice: 15,
    stairsPricePerFlight: 10,
    congestionCharge: 15,
    ulezCharge: 12.50,
    weekendMultiplier: 1.1,
  },
  'other': {
    id: 'rule-other',
    serviceType: 'other',
    basePrice: 50,
    pricePerMile: 2.0,
    pricePerMinute: 0.4,
    minDistance: 5,
    minPrice: 60,
    hourlyRate: 60,
    vanTypeMultiplier: {
      small: 1.0,
      medium: 1.2,
      large: 1.4,
      luton: 1.6,
    },
    extraStopPrice: 20,
    stairsPricePerFlight: 10,
    congestionCharge: 15,
    ulezCharge: 12.50,
    weekendMultiplier: 1.1,
  },
};

class AdminPricingManager {
  private rules: Record<string, PricingRule>;

  constructor() {
    // In a real app, this would load from a database or API
    // For now, we initialize with defaults
    this.rules = { ...DEFAULT_PRICING_RULES };
    
    // Attempt to load from localStorage for persistence in demo
    if (typeof window !== 'undefined') {
      const savedRules = localStorage.getItem('adminPricingRules');
      if (savedRules) {
        try {
          const parsedRules = JSON.parse(savedRules);
          // Merge saved rules with defaults to ensure all services are present
          // This fixes the issue where only one service might appear if localStorage is corrupted or incomplete
          this.rules = { ...DEFAULT_PRICING_RULES, ...parsedRules };
        } catch (e) {
          console.error('Failed to parse saved pricing rules', e);
        }
      }
    }
  }

  getRules(serviceType: string): PricingRule {
    return this.rules[serviceType] || this.rules['other'];
  }

  getAllRules(): Record<string, PricingRule> {
    return this.rules;
  }

  updateRule(serviceType: string, newRule: Partial<PricingRule>) {
    if (this.rules[serviceType]) {
      this.rules[serviceType] = { ...this.rules[serviceType], ...newRule };
      this.saveRules();
    }
  }

  private saveRules() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminPricingRules', JSON.stringify(this.rules));
    }
  }
}

export const adminPricingManager = new AdminPricingManager();
