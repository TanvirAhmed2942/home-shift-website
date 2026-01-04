/**
 * Route Optimization for Multi-stop Jobs
 * Google Maps integration, ETA optimization, fuel cost estimation
 */

export interface RouteStop {
  id: string;
  address: string;
  lat: number;
  lng: number;
  type: 'pickup' | 'delivery' | 'waypoint';
  arrivalTime?: Date;
  departureTime?: Date;
  duration?: number; // minutes
  jobReference?: string;
}

export interface OptimizedRoute {
  id: string;
  driverId: string;
  driverName: string;
  vehicleType: string;
  date: Date;
  
  // Stops in optimized order
  stops: RouteStop[];
  
  // Route metrics
  totalDistance: number; // km
  totalDuration: number; // minutes
  estimatedFuel: number; // liters
  fuelCost: number; // GBP
  
  // Time windows
  startTime: Date;
  endTime: Date;
  
  // Optimization details
  optimizationScore: number; // 0-100
  savings: {
    distance: number; // km saved vs non-optimized
    time: number; // minutes saved
    fuel: number; // liters saved
    cost: number; // GBP saved
  };
  
  // Route polyline for map display
  polyline?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface FuelCalculation {
  vehicleType: string;
  fuelEfficiency: number; // km per liter
  fuelPrice: number; // per liter
  distance: number; // km
  estimatedFuel: number; // liters
  totalCost: number; // GBP
}

/**
 * Optimize route for multiple stops
 */
export async function optimizeRoute(stops: RouteStop[], vehicleType: string): Promise<OptimizedRoute> {
  // Mock implementation - in production, use Google Maps Directions API with waypoint optimization
  // Example: https://maps.googleapis.com/maps/api/directions/json?optimize=true&waypoints=...
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple optimization: sort by proximity (in production, use actual routing algorithm)
  const optimizedStops = [...stops];
  
  // Start from first pickup
  const startStop = optimizedStops.find(s => s.type === 'pickup') || optimizedStops[0];
  const remainingStops = optimizedStops.filter(s => s !== startStop);
  
  // Sort remaining stops by distance (simplified)
  const sorted = [startStop];
  let current = startStop;
  
  while (remainingStops.length > 0) {
    const nearest = remainingStops.reduce((closest, stop) => {
      const distToCurrent = calculateDistance(current.lat, current.lng, stop.lat, stop.lng);
      const distToClosest = calculateDistance(current.lat, current.lng, closest.lat, closest.lng);
      return distToCurrent < distToClosest ? stop : closest;
    });
    
    sorted.push(nearest);
    current = nearest;
    remainingStops.splice(remainingStops.indexOf(nearest), 1);
  }
  
  // Calculate route metrics
  let totalDistance = 0;
  let totalDuration = 0;
  
  for (let i = 0; i < sorted.length - 1; i++) {
    const dist = calculateDistance(
      sorted[i].lat,
      sorted[i].lng,
      sorted[i + 1].lat,
      sorted[i + 1].lng
    );
    totalDistance += dist;
    totalDuration += estimateDuration(dist);
  }
  
  // Calculate fuel cost
  const fuelCalc = calculateFuelCost(vehicleType, totalDistance);
  
  // Calculate time windows
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + totalDuration * 60 * 1000);
  
  // Add arrival times to stops
  let currentTime = new Date(startTime);
  sorted.forEach((stop, index) => {
    stop.arrivalTime = new Date(currentTime);
    stop.duration = index < sorted.length - 1 ? 15 : 0; // 15 min per stop
    stop.departureTime = new Date(currentTime.getTime() + (stop.duration * 60 * 1000));
    
    if (index < sorted.length - 1) {
      const distToNext = calculateDistance(
        stop.lat,
        stop.lng,
        sorted[index + 1].lat,
        sorted[index + 1].lng
      );
      currentTime = new Date(currentTime.getTime() + (estimateDuration(distToNext) + stop.duration) * 60 * 1000);
    }
  });
  
  // Calculate savings (assume 20% improvement over non-optimized)
  const nonOptimizedDistance = totalDistance * 1.2;
  const savings = {
    distance: nonOptimizedDistance - totalDistance,
    time: (nonOptimizedDistance - totalDistance) / 60 * 60, // Rough estimate
    fuel: (nonOptimizedDistance - totalDistance) / fuelCalc.fuelEfficiency,
    cost: ((nonOptimizedDistance - totalDistance) / fuelCalc.fuelEfficiency) * fuelCalc.fuelPrice,
  };
  
  return {
    id: `route-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    driverId: '',
    driverName: '',
    vehicleType,
    date: startTime,
    stops: sorted,
    totalDistance,
    totalDuration,
    estimatedFuel: fuelCalc.estimatedFuel,
    fuelCost: fuelCalc.totalCost,
    startTime,
    endTime,
    optimizationScore: 85 + Math.random() * 10, // Mock score
    savings,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Calculate distance between two points (Haversine formula)
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Estimate duration based on distance
 */
function estimateDuration(distance: number): number {
  // Assume average speed of 50 km/h in urban areas
  return (distance / 50) * 60; // minutes
}

/**
 * Calculate fuel cost
 */
export function calculateFuelCost(vehicleType: string, distance: number): FuelCalculation {
  // Fuel efficiency by vehicle type (km per liter)
  const fuelEfficiencies: Record<string, number> = {
    small_van: 12,
    medium_van: 10,
    large_van: 8,
    luton_van: 7,
    motorcycle: 25,
  };
  
  const fuelEfficiency = fuelEfficiencies[vehicleType] || 10;
  const fuelPrice = 1.50; // GBP per liter (update with real-time prices)
  
  const estimatedFuel = distance / fuelEfficiency;
  const totalCost = estimatedFuel * fuelPrice;
  
  return {
    vehicleType,
    fuelEfficiency,
    fuelPrice,
    distance,
    estimatedFuel,
    totalCost,
  };
}

/**
 * Generate multi-stop route for driver's daily jobs
 */
export async function generateDailyRoute(driverId: string, date: Date): Promise<OptimizedRoute | null> {
  // Get all jobs for driver on this date
  const jobs = JSON.parse(localStorage.getItem('mockJobs') || '[]');
  const driverJobs = jobs.filter((j: any) => {
    const jobDate = new Date(j.date);
    return j.driverId === driverId &&
           j.status === 'accepted' &&
           jobDate.toDateString() === date.toDateString();
  });
  
  if (driverJobs.length === 0) return null;
  
  // Create stops from jobs
  const stops: RouteStop[] = [];
  
  driverJobs.forEach((job: any) => {
    // Add pickup stop
    stops.push({
      id: `pickup-${job.id}`,
      address: job.pickupAddress,
      lat: job.pickupLat || (51.5074 + (Math.random() - 0.5) * 0.1),
      lng: job.pickupLng || (-0.1278 + (Math.random() - 0.5) * 0.1),
      type: 'pickup',
      jobReference: job.reference,
    });
    
    // Add delivery stop
    stops.push({
      id: `delivery-${job.id}`,
      address: job.deliveryAddress,
      lat: job.deliveryLat || (51.5074 + (Math.random() - 0.5) * 0.2),
      lng: job.deliveryLng || (-0.1278 + (Math.random() - 0.5) * 0.2),
      type: 'delivery',
      jobReference: job.reference,
    });
  });
  
  // Get driver details
  const drivers = JSON.parse(localStorage.getItem('drivers') || '[]');
  const driver = drivers.find((d: any) => d.id === driverId);
  const vehicleType = driver?.vehicleType || 'medium_van';
  
  // Optimize route
  const optimizedRoute = await optimizeRoute(stops, vehicleType);
  optimizedRoute.driverId = driverId;
  optimizedRoute.driverName = driver?.name || 'Unknown Driver';
  
  // Save route
  saveOptimizedRoute(optimizedRoute);
  
  return optimizedRoute;
}

/**
 * Save optimized route
 */
export function saveOptimizedRoute(route: OptimizedRoute): void {
  const routes = getAllOptimizedRoutes();
  const index = routes.findIndex(r => r.id === route.id);
  
  if (index >= 0) {
    routes[index] = route;
  } else {
    routes.push(route);
  }
  
  localStorage.setItem('optimized_routes', JSON.stringify(routes));
}

/**
 * Get all optimized routes
 */
export function getAllOptimizedRoutes(): OptimizedRoute[] {
  const stored = localStorage.getItem('optimized_routes');
  return stored ? JSON.parse(stored) : [];
}

/**
 * Get route by driver and date
 */
export function getDriverRoute(driverId: string, date: Date): OptimizedRoute | null {
  const routes = getAllOptimizedRoutes();
  return routes.find(r => {
    const routeDate = new Date(r.date);
    return r.driverId === driverId && routeDate.toDateString() === date.toDateString();
  }) || null;
}

/**
 * Calculate route optimization statistics
 */
export function calculateRouteStats(routes: OptimizedRoute[]) {
  return {
    total: routes.length,
    totalDistance: routes.reduce((sum, r) => sum + r.totalDistance, 0),
    totalDuration: routes.reduce((sum, r) => sum + r.totalDuration, 0),
    totalFuelCost: routes.reduce((sum, r) => sum + r.fuelCost, 0),
    totalSavings: routes.reduce((sum, r) => sum + r.savings.cost, 0),
    avgOptimizationScore: routes.length > 0 
      ? routes.reduce((sum, r) => sum + r.optimizationScore, 0) / routes.length 
      : 0,
  };
}
