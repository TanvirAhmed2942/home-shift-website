/**
 * Advanced Route Planning Manager
 * Real-time traffic prediction, ETA updates, and intelligent routing
 */

export interface RoutePoint {
  lat: number;
  lng: number;
  address: string;
  stopType: 'pickup' | 'delivery' | 'waypoint';
  scheduledTime?: Date;
  actualArrival?: Date;
  duration?: number; // minutes to spend at stop
}

export interface AdvancedRoute {
  id: string;
  driverId: string;
  jobIds: string[];
  stops: RoutePoint[];
  distance: number; // km
  duration: number; // minutes without traffic
  durationWithTraffic: number; // minutes with current traffic
  trafficDelay: number; // additional minutes due to traffic
  fuelCost: number;
  tollCosts: number;
  co2Emissions: number;
  polyline: string; // encoded polyline
  alternativeRoutes: AlternativeRoute[];
  trafficConditions: TrafficSegment[];
  roadworks: Roadwork[];
  incidents: Incident[];
  weatherImpact: WeatherImpact;
  eta: Date;
  confidence: number; // 0-100% ETA confidence
  lastUpdated: Date;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
}

export interface AlternativeRoute {
  id: string;
  name: string; // e.g., "Via M25", "Avoid tolls"
  distance: number;
  duration: number;
  durationWithTraffic: number;
  fuelCost: number;
  tollCosts: number;
  savings: {
    time?: number;
    cost?: number;
    distance?: number;
  };
  reason: string;
}

export interface TrafficSegment {
  startPoint: { lat: number; lng: number };
  endPoint: { lat: number; lng: number };
  level: 'free' | 'light' | 'moderate' | 'heavy' | 'severe';
  speed: number; // km/h
  delay: number; // minutes
  cause?: string;
}

export interface Roadwork {
  id: string;
  location: { lat: number; lng: number };
  description: string;
  startDate: Date;
  endDate?: Date;
  severity: 'minor' | 'major';
  delayEstimate: number; // minutes
}

export interface Incident {
  id: string;
  type: 'accident' | 'breakdown' | 'closure' | 'other';
  location: { lat: number; lng: number };
  description: string;
  severity: 'low' | 'medium' | 'high';
  reportedAt: Date;
  clearedAt?: Date;
  impactedRoutes: string[];
}

export interface WeatherImpact {
  condition: string;
  temperature: number;
  visibility: number; // km
  windSpeed: number; // km/h
  precipitation: number; // mm
  delayFactor: number; // 1.0 = no delay, 1.5 = 50% slower
  warnings: string[];
}

export interface ETAUpdate {
  routeId: string;
  stopIndex: number;
  originalETA: Date;
  updatedETA: Date;
  difference: number; // minutes (positive = delay, negative = early)
  confidence: number;
  reason: string;
  timestamp: Date;
}

// ==================== CONFIGURATION ====================

const GOOGLE_MAPS_API_KEY = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY';
const TRAFFIC_API_ENDPOINT = 'https://maps.googleapis.com/maps/api/directions/json';
const AVERAGE_SPEED = {
  motorway: 110, // km/h
  urban: 40,
  residential: 30,
  rural: 60,
};

// ==================== ROUTE PLANNING ====================

export function getAllRoutes(): AdvancedRoute[] {
  const stored = localStorage.getItem('advanced_routes');
  return stored ? JSON.parse(stored) : [];
}

export function getRoute(routeId: string): AdvancedRoute | undefined {
  return getAllRoutes().find(r => r.id === routeId);
}

export async function planAdvancedRoute(data: {
  driverId: string;
  jobIds: string[];
  stops: RoutePoint[];
  optimize: boolean;
  avoidTolls: boolean;
  avoidMotorways: boolean;
}): Promise<AdvancedRoute> {
  const { stops, optimize } = data;

  // Optimize stop order if requested
  const optimizedStops = optimize ? optimizeStopOrder(stops) : stops;

  // Calculate route using Google Maps Directions API
  const routeData = await calculateRouteWithTraffic(optimizedStops, {
    avoidTolls: data.avoidTolls,
    avoidMotorways: data.avoidMotorways,
  });

  // Get traffic conditions
  const trafficConditions = await fetchTrafficConditions(routeData.polyline);

  // Check for roadworks and incidents
  const roadworks = await fetchRoadworks(routeData.bounds);
  const incidents = await fetchIncidents(routeData.bounds);

  // Get weather impact
  const weatherImpact = await assessWeatherImpact(optimizedStops[0]);

  // Calculate alternative routes
  const alternativeRoutes = await calculateAlternativeRoutes(optimizedStops);

  // Calculate costs
  const fuelCost = calculateFuelCost(routeData.distance);
  const tollCosts = routeData.tollCosts || 0;

  // Calculate ETA
  const eta = calculateETA(optimizedStops[0].scheduledTime || new Date(), routeData.durationWithTraffic);

  const route: AdvancedRoute = {
    id: `route-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    driverId: data.driverId,
    jobIds: data.jobIds,
    stops: optimizedStops,
    distance: routeData.distance,
    duration: routeData.duration,
    durationWithTraffic: routeData.durationWithTraffic,
    trafficDelay: routeData.durationWithTraffic - routeData.duration,
    fuelCost,
    tollCosts,
    co2Emissions: calculateCO2Emissions(routeData.distance),
    polyline: routeData.polyline,
    alternativeRoutes,
    trafficConditions,
    roadworks,
    incidents,
    weatherImpact,
    eta,
    confidence: calculateETAConfidence(trafficConditions, weatherImpact),
    lastUpdated: new Date(),
    status: 'planned',
  };

  saveRoute(route);
  return route;
}

function optimizeStopOrder(stops: RoutePoint[]): RoutePoint[] {
  // Separate pickup and delivery stops
  const pickups = stops.filter(s => s.stopType === 'pickup');
  const deliveries = stops.filter(s => s.stopType === 'delivery');

  // Simple nearest-neighbor algorithm
  const optimized: RoutePoint[] = [];
  let current = pickups[0];
  optimized.push(current);

  let remaining = [...pickups.slice(1), ...deliveries];

  while (remaining.length > 0) {
    let nearest = remaining[0];
    let minDistance = calculateDistance(current, nearest);

    for (const stop of remaining) {
      const distance = calculateDistance(current, stop);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = stop;
      }
    }

    optimized.push(nearest);
    current = nearest;
    remaining = remaining.filter(s => s !== nearest);
  }

  return optimized;
}

function calculateDistance(a: RoutePoint, b: RoutePoint): number {
  // Haversine formula
  const R = 6371; // Earth's radius in km
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const lat1 = a.lat * Math.PI / 180;
  const lat2 = b.lat * Math.PI / 180;

  const x = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));

  return R * c;
}

async function calculateRouteWithTraffic(stops: RoutePoint[], options: any): Promise<any> {
  // Mock Google Maps Directions API response
  // In production, this would be an actual API call
  
  const totalDistance = stops.reduce((sum, stop, i) => {
    if (i === 0) return 0;
    return sum + calculateDistance(stops[i - 1], stop);
  }, 0);

  const baseDuration = (totalDistance / 50) * 60; // Assuming 50 km/h average
  const trafficFactor = 1.2; // 20% slower due to traffic
  const durationWithTraffic = baseDuration * trafficFactor;

  return {
    distance: totalDistance,
    duration: baseDuration,
    durationWithTraffic,
    polyline: encodePolyline(stops),
    tollCosts: options.avoidTolls ? 0 : Math.random() * 10,
    bounds: {
      north: Math.max(...stops.map(s => s.lat)),
      south: Math.min(...stops.map(s => s.lat)),
      east: Math.max(...stops.map(s => s.lng)),
      west: Math.min(...stops.map(s => s.lng)),
    },
  };
}

function encodePolyline(stops: RoutePoint[]): string {
  // Simple polyline encoding (mock)
  return stops.map(s => `${s.lat},${s.lng}`).join('|');
}

async function fetchTrafficConditions(polyline: string): Promise<TrafficSegment[]> {
  // Mock traffic data
  return [
    {
      startPoint: { lat: 51.5074, lng: -0.1278 },
      endPoint: { lat: 51.5154, lng: -0.1419 },
      level: 'moderate',
      speed: 35,
      delay: 5,
      cause: 'High traffic volume',
    },
  ];
}

async function fetchRoadworks(bounds: any): Promise<Roadwork[]> {
  // Mock roadworks data
  return [
    {
      id: 'rw-001',
      location: { lat: 51.5074, lng: -0.1278 },
      description: 'Road resurfacing on A40',
      startDate: new Date('2024-12-15'),
      endDate: new Date('2024-12-25'),
      severity: 'minor',
      delayEstimate: 3,
    },
  ];
}

async function fetchIncidents(bounds: any): Promise<Incident[]> {
  // Mock incidents data (from traffic API)
  return [];
}

async function assessWeatherImpact(stop: RoutePoint): Promise<WeatherImpact> {
  // Integration with weather system
  try {
    const { getCurrentWeather } = require('./weatherIntegration');
    const weather = getCurrentWeather(stop.address);

    if (!weather) {
      return {
        condition: 'Clear',
        temperature: 15,
        visibility: 10,
        windSpeed: 10,
        precipitation: 0,
        delayFactor: 1.0,
        warnings: [],
      };
    }

    let delayFactor = 1.0;
    const warnings: string[] = [];

    if (weather.condition.toLowerCase().includes('rain')) {
      delayFactor = 1.15;
      warnings.push('Rain may slow traffic');
    }
    if (weather.condition.toLowerCase().includes('snow')) {
      delayFactor = 1.5;
      warnings.push('Snow conditions - expect delays');
    }
    if (weather.condition.toLowerCase().includes('fog')) {
      delayFactor = 1.3;
      warnings.push('Poor visibility due to fog');
    }

    return {
      condition: weather.condition,
      temperature: weather.temperature,
      visibility: weather.condition.includes('fog') ? 2 : 10,
      windSpeed: 15,
      precipitation: weather.condition.includes('rain') ? 5 : 0,
      delayFactor,
      warnings,
    };
  } catch {
    return {
      condition: 'Clear',
      temperature: 15,
      visibility: 10,
      windSpeed: 10,
      precipitation: 0,
      delayFactor: 1.0,
      warnings: [],
    };
  }
}

async function calculateAlternativeRoutes(stops: RoutePoint[]): Promise<AlternativeRoute[]> {
  // Mock alternative routes
  return [
    {
      id: 'alt-1',
      name: 'Via M25 (Faster)',
      distance: 45,
      duration: 50,
      durationWithTraffic: 55,
      fuelCost: 22,
      tollCosts: 0,
      savings: { time: 10 },
      reason: 'Less traffic on motorway',
    },
    {
      id: 'alt-2',
      name: 'Scenic Route (Cheaper)',
      distance: 42,
      duration: 65,
      durationWithTraffic: 70,
      fuelCost: 20,
      tollCosts: 0,
      savings: { cost: 2 },
      reason: 'Avoids tolls and busy roads',
    },
  ];
}

function calculateFuelCost(distance: number): number {
  const fuelEfficiency = 8; // liters per 100km
  const fuelPrice = 1.50; // £ per liter
  return (distance / 100) * fuelEfficiency * fuelPrice;
}

function calculateCO2Emissions(distance: number): number {
  return distance * 0.185; // kg CO2 per km (diesel van)
}

function calculateETA(startTime: Date, duration: number): Date {
  const eta = new Date(startTime);
  eta.setMinutes(eta.getMinutes() + duration);
  return eta;
}

function calculateETAConfidence(traffic: TrafficSegment[], weather: WeatherImpact): number {
  let confidence = 90; // Base confidence

  // Reduce for heavy traffic
  if (traffic.some(t => t.level === 'severe')) confidence -= 20;
  if (traffic.some(t => t.level === 'heavy')) confidence -= 10;

  // Reduce for bad weather
  if (weather.delayFactor > 1.2) confidence -= 15;
  if (weather.delayFactor > 1.4) confidence -= 25;

  return Math.max(50, confidence);
}

// ==================== REAL-TIME UPDATES ====================

export async function updateRouteWithLiveTraffic(routeId: string): Promise<ETAUpdate[]> {
  const route = getRoute(routeId);
  if (!route) return [];

  const updates: ETAUpdate[] = [];

  // Re-fetch traffic conditions
  const newTraffic = await fetchTrafficConditions(route.polyline);
  const newWeather = await assessWeatherImpact(route.stops[0]);

  // Recalculate duration with new traffic
  const newDurationWithTraffic = route.duration * newWeather.delayFactor;
  const newTrafficDelay = newTraffic.reduce((sum, t) => sum + t.delay, 0);
  const totalNewDuration = newDurationWithTraffic + newTrafficDelay;

  // Check if significant change
  if (Math.abs(totalNewDuration - route.durationWithTraffic) > 5) {
    const newETA = calculateETA(route.stops[0].scheduledTime || new Date(), totalNewDuration);

    const update: ETAUpdate = {
      routeId,
      stopIndex: 0,
      originalETA: route.eta,
      updatedETA: newETA,
      difference: Math.round((newETA.getTime() - route.eta.getTime()) / 60000),
      confidence: calculateETAConfidence(newTraffic, newWeather),
      reason: 'Traffic conditions changed',
      timestamp: new Date(),
    };

    updates.push(update);

    // Update route
    route.durationWithTraffic = totalNewDuration;
    route.trafficDelay = newTrafficDelay;
    route.eta = newETA;
    route.trafficConditions = newTraffic;
    route.weatherImpact = newWeather;
    route.confidence = update.confidence;
    route.lastUpdated = new Date();

    saveRoute(route);

    // Notify driver
    notifyDriverOfETAChange(route.driverId, update);
  }

  return updates;
}

export async function updateETAFromDriverLocation(routeId: string, currentLocation: { lat: number; lng: number }): Promise<void> {
  const route = getRoute(routeId);
  if (!route) return;

  // Find next stop
  const nextStopIndex = route.stops.findIndex(s => !s.actualArrival);
  if (nextStopIndex === -1) return;

  const nextStop = route.stops[nextStopIndex];

  // Calculate remaining distance
  const remainingDistance = calculateDistance(
    { ...currentLocation, address: '', stopType: 'waypoint' },
    nextStop
  );

  // Estimate time with current traffic
  const traffic = await fetchTrafficConditions(route.polyline);
  const avgSpeed = traffic.length > 0 
    ? traffic.reduce((sum, t) => sum + t.speed, 0) / traffic.length
    : 50;

  const remainingTime = (remainingDistance / avgSpeed) * 60; // minutes

  const newETA = new Date();
  newETA.setMinutes(newETA.getMinutes() + remainingTime);

  // Update if changed significantly
  if (Math.abs(newETA.getTime() - route.eta.getTime()) / 60000 > 5) {
    route.eta = newETA;
    route.lastUpdated = new Date();
    saveRoute(route);

    // Notify customer
    notifyCustomerOfETAChange(route.jobIds, newETA);
  }
}

function notifyDriverOfETAChange(driverId: string, update: ETAUpdate): void {
  const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  notifications.push({
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: driverId,
    type: 'eta_update',
    title: update.difference > 0 ? '⏰ Delay Alert' : '✅ Ahead of Schedule',
    message: `ETA changed by ${Math.abs(update.difference)} minutes. Reason: ${update.reason}`,
    timestamp: new Date(),
    read: false,
  });
  localStorage.setItem('notifications', JSON.stringify(notifications));
}

function notifyCustomerOfETAChange(jobIds: string[], newETA: Date): void {
  jobIds.forEach(jobId => {
    const jobs = JSON.parse(localStorage.getItem('mockJobs') || '[]');
    const job = jobs.find((j: any) => j.id === jobId);

    if (job) {
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifications.push({
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: job.customerId,
        type: 'eta_update',
        title: 'Updated Arrival Time',
        message: `Your driver will arrive at ${newETA.toLocaleTimeString()}`,
        timestamp: new Date(),
        read: false,
      });
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  });
}

// ==================== PERSISTENCE ====================

function saveRoute(route: AdvancedRoute): void {
  const routes = getAllRoutes();
  const index = routes.findIndex(r => r.id === route.id);

  if (index !== -1) {
    routes[index] = route;
  } else {
    routes.push(route);
  }

  localStorage.setItem('advanced_routes', JSON.stringify(routes));
}

// ==================== ANALYTICS ====================

export function getRoutePlanningAnalytics(driverId?: string) {
  let routes = getAllRoutes();

  if (driverId) {
    routes = routes.filter(r => r.driverId === driverId);
  }

  const totalDistance = routes.reduce((sum, r) => sum + r.distance, 0);
  const totalFuelCost = routes.reduce((sum, r) => sum + r.fuelCost, 0);
  const totalTrafficDelay = routes.reduce((sum, r) => sum + r.trafficDelay, 0);
  const avgETAConfidence = routes.reduce((sum, r) => sum + r.confidence, 0) / (routes.length || 1);

  return {
    totalRoutes: routes.length,
    totalDistance,
    totalFuelCost,
    totalTrafficDelay,
    avgETAConfidence,
    avgDistancePerRoute: totalDistance / (routes.length || 1),
    totalCO2: routes.reduce((sum, r) => sum + r.co2Emissions, 0),
  };
}

// ==================== SCHEDULED MONITORING ====================

export function monitorActiveRoutes(): void {
  const routes = getAllRoutes().filter(r => r.status === 'in_progress');

  routes.forEach(async route => {
    await updateRouteWithLiveTraffic(route.id);
  });

  console.log(`📍 Monitored ${routes.length} active routes`);
}