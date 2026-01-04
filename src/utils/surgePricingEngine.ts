/**
 * Dynamic Surge Pricing Engine
 * Real-time demand-based pricing adjustments
 */

export interface SurgePricingConfig {
  enabled: boolean;
  minMultiplier: number; // 1.0 = no surge
  maxMultiplier: number; // e.g., 2.5 = 250% of base price
  demandThresholds: {
    low: number;      // < 30% capacity
    medium: number;   // 30-60% capacity
    high: number;     // 60-85% capacity
    extreme: number;  // > 85% capacity
  };
  timeBasedMultipliers: {
    weekday: { start: string; end: string; multiplier: number }[];
    weekend: { start: string; end: string; multiplier: number }[];
  };
  locationBasedMultipliers: Record<string, number>; // city -> multiplier
  weatherImpact: boolean;
  seasonalMultipliers: Record<string, number>; // month -> multiplier
}

export interface DemandMetrics {
  timestamp: Date;
  totalDrivers: number;
  availableDrivers: number;
  activeJobs: number;
  pendingQuotes: number;
  capacityUtilization: number; // percentage
  demandLevel: 'low' | 'medium' | 'high' | 'extreme';
  currentMultiplier: number;
  projectedDemand: number; // next 3 hours
}

export interface SurgeZone {
  id: string;
  name: string;
  area: string; // e.g., "London Central"
  currentMultiplier: number;
  demandLevel: 'low' | 'medium' | 'high' | 'extreme';
  activeJobs: number;
  availableDrivers: number;
  lastUpdated: Date;
}

export interface PriceAdjustment {
  basePrice: number;
  surgeMultiplier: number;
  timeMultiplier: number;
  locationMultiplier: number;
  weatherMultiplier: number;
  seasonalMultiplier: number;
  finalMultiplier: number;
  finalPrice: number;
  savingsFromOffPeak?: number;
  breakdown: {
    label: string;
    value: number;
    percentage: number;
  }[];
}

// ==================== CONFIGURATION ====================

const DEFAULT_CONFIG: SurgePricingConfig = {
  enabled: true,
  minMultiplier: 0.9,  // Can offer 10% discount during low demand
  maxMultiplier: 2.0,  // Maximum 2x surge
  demandThresholds: {
    low: 0.3,      // < 30% capacity = discount
    medium: 0.6,   // 30-60% = normal
    high: 0.85,    // 60-85% = surge starts
    extreme: 0.95, // > 85% = maximum surge
  },
  timeBasedMultipliers: {
    weekday: [
      { start: '06:00', end: '09:00', multiplier: 1.2 }, // Morning rush
      { start: '09:00', end: '16:00', multiplier: 1.0 }, // Normal hours
      { start: '16:00', end: '19:00', multiplier: 1.3 }, // Evening rush
      { start: '19:00', end: '22:00', multiplier: 1.1 }, // After hours
      { start: '22:00', end: '06:00', multiplier: 0.9 }, // Night discount
    ],
    weekend: [
      { start: '08:00', end: '20:00', multiplier: 1.15 }, // Weekend premium
      { start: '20:00', end: '08:00', multiplier: 0.95 }, // Night discount
    ],
  },
  locationBasedMultipliers: {
    'London': 1.2,
    'Manchester': 1.0,
    'Birmingham': 1.05,
    'Leeds': 1.0,
    'Liverpool': 1.0,
    'Bristol': 1.1,
  },
  weatherImpact: true,
  seasonalMultipliers: {
    '01': 0.95, // January - post-holidays slow
    '02': 0.95, // February
    '03': 1.0,  // March
    '04': 1.05, // April
    '05': 1.1,  // May - moving season starts
    '06': 1.2,  // June - peak season
    '07': 1.25, // July - peak season
    '08': 1.2,  // August - peak season
    '09': 1.15, // September - school starts
    '10': 1.05, // October
    '11': 1.0,  // November
    '12': 1.1,  // December - holiday moves
  },
};

// ==================== DEMAND MONITORING ====================

export function getCurrentDemandMetrics(): DemandMetrics {
  const drivers = JSON.parse(localStorage.getItem('drivers') || '[]');
  const jobs = JSON.parse(localStorage.getItem('mockJobs') || '[]');
  const quotes = JSON.parse(localStorage.getItem('savedQuotes') || '[]');

  const totalDrivers = drivers.length;
  const availableDrivers = drivers.filter((d: any) => d.status === 'available').length;
  const activeJobs = jobs.filter((j: any) => 
    j.status === 'in_progress' || j.status === 'accepted'
  ).length;
  const pendingQuotes = quotes.filter((q: any) => !q.bookingCreated).length;

  const capacityUtilization = totalDrivers > 0 
    ? (totalDrivers - availableDrivers) / totalDrivers 
    : 0;

  let demandLevel: DemandMetrics['demandLevel'] = 'low';
  if (capacityUtilization >= DEFAULT_CONFIG.demandThresholds.extreme) {
    demandLevel = 'extreme';
  } else if (capacityUtilization >= DEFAULT_CONFIG.demandThresholds.high) {
    demandLevel = 'high';
  } else if (capacityUtilization >= DEFAULT_CONFIG.demandThresholds.medium) {
    demandLevel = 'medium';
  }

  const currentMultiplier = calculateDemandMultiplier(capacityUtilization);

  // Simple projection: average pending quotes per hour
  const projectedDemand = pendingQuotes * 1.5;

  return {
    timestamp: new Date(),
    totalDrivers,
    availableDrivers,
    activeJobs,
    pendingQuotes,
    capacityUtilization: Math.round(capacityUtilization * 100),
    demandLevel,
    currentMultiplier,
    projectedDemand,
  };
}

function calculateDemandMultiplier(utilization: number): number {
  const config = DEFAULT_CONFIG;

  if (utilization < config.demandThresholds.low) {
    return config.minMultiplier; // Discount during low demand
  } else if (utilization < config.demandThresholds.medium) {
    return 1.0; // Normal pricing
  } else if (utilization < config.demandThresholds.high) {
    // Linear increase from 1.0 to 1.5
    const range = config.demandThresholds.high - config.demandThresholds.medium;
    const position = (utilization - config.demandThresholds.medium) / range;
    return 1.0 + (position * 0.5);
  } else if (utilization < config.demandThresholds.extreme) {
    // Linear increase from 1.5 to max
    const range = config.demandThresholds.extreme - config.demandThresholds.high;
    const position = (utilization - config.demandThresholds.high) / range;
    return 1.5 + (position * (config.maxMultiplier - 1.5));
  } else {
    return config.maxMultiplier; // Maximum surge
  }
}

// ==================== SURGE ZONES ====================

export function getSurgeZones(): SurgeZone[] {
  const zones: SurgeZone[] = [
    {
      id: 'zone-london-central',
      name: 'London Central',
      area: 'London',
      currentMultiplier: 1.0,
      demandLevel: 'medium',
      activeJobs: 0,
      availableDrivers: 0,
      lastUpdated: new Date(),
    },
    {
      id: 'zone-london-north',
      name: 'London North',
      area: 'London',
      currentMultiplier: 1.0,
      demandLevel: 'low',
      activeJobs: 0,
      availableDrivers: 0,
      lastUpdated: new Date(),
    },
    {
      id: 'zone-manchester',
      name: 'Manchester',
      area: 'Manchester',
      currentMultiplier: 1.0,
      demandLevel: 'low',
      activeJobs: 0,
      availableDrivers: 0,
      lastUpdated: new Date(),
    },
  ];

  // Update with real-time data
  const jobs = JSON.parse(localStorage.getItem('mockJobs') || '[]');
  const drivers = JSON.parse(localStorage.getItem('drivers') || '[]');

  zones.forEach(zone => {
    zone.activeJobs = jobs.filter((j: any) => 
      (j.status === 'in_progress' || j.status === 'accepted') &&
      j.pickupAddress?.includes(zone.area)
    ).length;

    zone.availableDrivers = drivers.filter((d: any) => 
      d.status === 'available' && d.location?.includes(zone.area)
    ).length;

    const utilization = zone.availableDrivers > 0
      ? (zone.activeJobs / (zone.activeJobs + zone.availableDrivers))
      : 0;

    zone.currentMultiplier = calculateDemandMultiplier(utilization);
    zone.demandLevel = utilization >= 0.85 ? 'extreme' 
      : utilization >= 0.6 ? 'high'
      : utilization >= 0.3 ? 'medium' : 'low';
    zone.lastUpdated = new Date();
  });

  return zones;
}

// ==================== PRICE CALCULATION ====================

export function calculateSurgePrice(
  basePrice: number,
  location: string,
  scheduledDate?: Date
): PriceAdjustment {
  if (!DEFAULT_CONFIG.enabled) {
    return {
      basePrice,
      surgeMultiplier: 1.0,
      timeMultiplier: 1.0,
      locationMultiplier: 1.0,
      weatherMultiplier: 1.0,
      seasonalMultiplier: 1.0,
      finalMultiplier: 1.0,
      finalPrice: basePrice,
      breakdown: [],
    };
  }

  const date = scheduledDate || new Date();
  const metrics = getCurrentDemandMetrics();

  // 1. Demand-based surge
  const surgeMultiplier = metrics.currentMultiplier;

  // 2. Time-based multiplier
  const timeMultiplier = getTimeMultiplier(date);

  // 3. Location-based multiplier
  const locationMultiplier = getLocationMultiplier(location);

  // 4. Weather impact
  const weatherMultiplier = getWeatherMultiplier(location);

  // 5. Seasonal multiplier
  const seasonalMultiplier = getSeasonalMultiplier(date);

  // Calculate final multiplier (compound all factors)
  const finalMultiplier = Math.min(
    surgeMultiplier * timeMultiplier * locationMultiplier * weatherMultiplier * seasonalMultiplier,
    DEFAULT_CONFIG.maxMultiplier
  );

  const finalPrice = Math.round(basePrice * finalMultiplier);

  // Calculate potential savings
  const offPeakPrice = basePrice * DEFAULT_CONFIG.minMultiplier;
  const savingsFromOffPeak = finalPrice > offPeakPrice 
    ? Math.round(finalPrice - offPeakPrice)
    : 0;

  const breakdown = [
    { label: 'Base Price', value: basePrice, percentage: 0 },
    { label: 'Demand Surge', value: surgeMultiplier, percentage: (surgeMultiplier - 1) * 100 },
    { label: 'Time of Day', value: timeMultiplier, percentage: (timeMultiplier - 1) * 100 },
    { label: 'Location', value: locationMultiplier, percentage: (locationMultiplier - 1) * 100 },
    { label: 'Weather', value: weatherMultiplier, percentage: (weatherMultiplier - 1) * 100 },
    { label: 'Season', value: seasonalMultiplier, percentage: (seasonalMultiplier - 1) * 100 },
  ].filter(item => item.percentage !== 0);

  return {
    basePrice,
    surgeMultiplier,
    timeMultiplier,
    locationMultiplier,
    weatherMultiplier,
    seasonalMultiplier,
    finalMultiplier,
    finalPrice,
    savingsFromOffPeak,
    breakdown,
  };
}

function getTimeMultiplier(date: Date): number {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const currentTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

  const timeRanges = isWeekend 
    ? DEFAULT_CONFIG.timeBasedMultipliers.weekend
    : DEFAULT_CONFIG.timeBasedMultipliers.weekday;

  for (const range of timeRanges) {
    if (currentTime >= range.start && currentTime < range.end) {
      return range.multiplier;
    }
  }

  return 1.0;
}

function getLocationMultiplier(location: string): number {
  for (const [city, multiplier] of Object.entries(DEFAULT_CONFIG.locationBasedMultipliers)) {
    if (location.toLowerCase().includes(city.toLowerCase())) {
      return multiplier;
    }
  }
  return 1.0;
}

function getWeatherMultiplier(location: string): number {
  if (!DEFAULT_CONFIG.weatherImpact) return 1.0;

  // Integration with weather system
  try {
    const { getCurrentWeather } = require('./weatherIntegration');
    const weather = getCurrentWeather(location);
    
    if (!weather) return 1.0;

    // Bad weather increases pricing
    if (weather.condition.toLowerCase().includes('rain')) return 1.1;
    if (weather.condition.toLowerCase().includes('snow')) return 1.2;
    if (weather.condition.toLowerCase().includes('storm')) return 1.3;
    
    return 1.0;
  } catch {
    return 1.0;
  }
}

function getSeasonalMultiplier(date: Date): number {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return DEFAULT_CONFIG.seasonalMultipliers[month] || 1.0;
}

// ==================== SURGE NOTIFICATIONS ====================

export function notifyCustomersOfSurge(multiplier: number): void {
  if (multiplier <= 1.1) return; // Only notify if significant surge

  const customers = JSON.parse(localStorage.getItem('customers') || '[]');
  const recentQuotes = JSON.parse(localStorage.getItem('savedQuotes') || '[]')
    .filter((q: any) => !q.bookingCreated && 
      (new Date().getTime() - new Date(q.createdAt).getTime()) < 24 * 60 * 60 * 1000
    );

  recentQuotes.forEach((quote: any) => {
    const customer = customers.find((c: any) => c.id === quote.customerId);
    if (!customer) return;

    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push({
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: customer.id,
      type: 'surge_pricing',
      title: '⚡ High Demand Alert',
      message: `Prices are ${Math.round((multiplier - 1) * 100)}% higher due to high demand. Book during off-peak hours to save!`,
      timestamp: new Date(),
      read: false,
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
  });
}

export function suggestOffPeakTimes(location: string, date: Date): { day: string; time: string; savings: number }[] {
  const suggestions: { day: string; time: string; savings: number }[] = [];

  // Next 7 days
  for (let i = 0; i < 7; i++) {
    const futureDate = new Date(date);
    futureDate.setDate(futureDate.getDate() + i);

    // Check off-peak hours (22:00-06:00 weekday, 20:00-08:00 weekend)
    const isWeekend = futureDate.getDay() === 0 || futureDate.getDay() === 6;
    const offPeakHours = isWeekend 
      ? [{ hour: 20, label: '8:00 PM' }, { hour: 21, label: '9:00 PM' }]
      : [{ hour: 22, label: '10:00 PM' }, { hour: 23, label: '11:00 PM' }];

    offPeakHours.forEach(({ hour, label }) => {
      futureDate.setHours(hour, 0, 0, 0);
      const testPrice = calculateSurgePrice(100, location, futureDate);
      const currentPrice = calculateSurgePrice(100, location, date);
      const savings = Math.round(currentPrice.finalPrice - testPrice.finalPrice);

      if (savings > 0) {
        suggestions.push({
          day: futureDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
          time: label,
          savings,
        });
      }
    });
  }

  return suggestions.slice(0, 5); // Top 5 suggestions
}

// ==================== ANALYTICS ====================

export function getSurgePricingAnalytics(days: number = 7) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // In production, this would query historical surge data
  const metrics = getCurrentDemandMetrics();

  return {
    averageMultiplier: 1.15,
    peakMultiplier: metrics.currentMultiplier,
    surgeHours: 24, // hours with surge > 1.2x
    revenueIncrease: 12500, // £ from surge pricing
    customersSaved: 45, // customers who shifted to off-peak
    totalSavings: 3200, // £ savings offered to off-peak customers
  };
}

// ==================== SCHEDULED MONITORING ====================

export function monitorAndAdjustPricing(): void {
  const metrics = getCurrentDemandMetrics();

  // Log metrics
  console.log('📊 Demand Metrics:', {
    level: metrics.demandLevel,
    utilization: `${metrics.capacityUtilization}%`,
    multiplier: `${metrics.currentMultiplier}x`,
    available: metrics.availableDrivers,
    active: metrics.activeJobs,
  });

  // Notify if extreme surge
  if (metrics.currentMultiplier >= 1.5) {
    notifyCustomersOfSurge(metrics.currentMultiplier);
  }

  // Alert admin if very low demand (opportunity to market)
  if (metrics.demandLevel === 'low') {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.push({
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: 'admin',
      type: 'low_demand_alert',
      title: '📉 Low Demand Detected',
      message: `Consider running discount campaigns. Capacity utilization: ${metrics.capacityUtilization}%`,
      timestamp: new Date(),
      read: false,
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }
}

export function getSurgeConfig(): SurgePricingConfig {
  return DEFAULT_CONFIG;
}

export function updateSurgeConfig(config: Partial<SurgePricingConfig>): void {
  Object.assign(DEFAULT_CONFIG, config);
  console.log('✅ Surge pricing config updated');
}
