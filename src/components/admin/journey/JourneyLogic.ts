import { Stop } from '../../utils/jobStatusManager';

// --- CONFIGURATION CONSTANTS ---
export const JOURNEY_RULES = {
  MAX_JOURNEY_MINUTES: 540, // 9 Hours (Hard Limit)
  WARNING_THRESHOLD_MINUTES: 480, // 8 Hours (Yellow Zone)
  
  // Default Times (in minutes)
  TIME_LOADING: 20,
  TIME_UNLOADING: 15,
  TIME_BUFFER: 10,
  
  // Speeds (mph)
  SPEED_URBAN: 20,
  SPEED_MOTORWAY: 50,
};

export interface JourneyMetrics {
  totalDrivingTime: number;
  totalLoadingTime: number;
  totalWaitingTime: number;
  totalBufferTime: number;
  totalDuration: number; // Sum of all above
  
  startTime: Date;
  endTime: Date;
  
  totalDistance: number;
  isOverLimit: boolean;
  utilizationScore: number; // 0-100% (based on 9h)
  
  stops: EnrichedStop[];
}

export interface EnrichedStop extends Stop {
  calculatedArrival: Date;
  calculatedDeparture: Date;
  waitingTime: number; // If arrived before time window
  drivingToNext: number;
  distanceToNext: number;
  activityType: 'driving' | 'loading' | 'unloading' | 'waiting';
  activityDuration: number;
}

// --- HELPER: Haversine Distance ---
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 5; // Fallback
  const R = 3959; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// --- HELPER: Time Parsing ---
function parseTimeWindow(timeStr?: string): { hour: number, minute: number } | null {
  if (!timeStr) return null;
  // Expected formats: "09:00", "9:00", "09:00 - 12:00"
  try {
    const startPart = timeStr.split('-')[0].trim();
    const [h, m] = startPart.split(':').map(Number);
    if (!isNaN(h) && !isNaN(m)) return { hour: h, minute: m };
  } catch (e) {
    return null;
  }
  return null;
}

// --- CORE: Calculate Metrics ---
export function calculateJourneyMetrics(
  stops: Stop[], 
  startTimeString: string = "08:00"
): JourneyMetrics {
  
  // 1. Setup Start Time
  const now = new Date();
  const [startHour, startMinute] = startTimeString.split(':').map(Number);
  const startTime = new Date(now);
  startTime.setHours(startHour, startMinute, 0, 0);

  let currentTime = new Date(startTime);
  let totalDriving = 0;
  let totalLoading = 0;
  let totalWaiting = 0;
  let totalBuffer = 0;
  let totalDist = 0;

  const enrichedStops: EnrichedStop[] = [];

  // 2. Iterate Stops
  for (let i = 0; i < stops.length; i++) {
    const stop = stops[i];
    
    // --- A. Driving to this stop (if not first) ---
    let driveTime = 0;
    let dist = 0;

    if (i > 0) {
      const prevStop = stops[i - 1];
      dist = calculateDistance(
        prevStop.address.lat || 0, prevStop.address.lng || 0,
        stop.address.lat || 0, stop.address.lng || 0
      );
      
      // Calculate drive time based on distance (Urban vs Motorway mix)
      const speed = dist > 10 ? JOURNEY_RULES.SPEED_MOTORWAY : JOURNEY_RULES.SPEED_URBAN;
      driveTime = (dist / speed) * 60; // minutes
      
      currentTime = new Date(currentTime.getTime() + driveTime * 60000);
      totalDriving += driveTime;
      totalDist += dist;
    }

    // --- B. Waiting Time (Time Windows) ---
    // If we arrive BEFORE the window starts, we must wait.
    let waitTime = 0;
    
    // Check if stop has a time window property. 
    // Assuming 'timeWindow' string exists on Stop or we use logic based on type
    const windowStart = parseTimeWindow(stop.timeWindow); 
    
    if (windowStart) {
        const windowDate = new Date(currentTime);
        windowDate.setHours(windowStart.hour, windowStart.minute, 0, 0);
        
        // If window is "tomorrow" relative to start, logic gets complex. 
        // For simplicity, assume all same day for now.
        
        if (currentTime < windowDate) {
            waitTime = (windowDate.getTime() - currentTime.getTime()) / 60000;
        }
    }

    if (waitTime > 0) {
      currentTime = new Date(currentTime.getTime() + waitTime * 60000);
      totalWaiting += waitTime;
    }

    const arrivalTime = new Date(currentTime);

    // --- C. Loading / Unloading ---
    const taskTime = stop.type === 'collection' 
      ? JOURNEY_RULES.TIME_LOADING 
      : JOURNEY_RULES.TIME_UNLOADING;
      
    currentTime = new Date(currentTime.getTime() + taskTime * 60000);
    totalLoading += taskTime;

    // --- D. Buffer Time ---
    // Buffer added AFTER the task, before leaving for next
    currentTime = new Date(currentTime.getTime() + JOURNEY_RULES.TIME_BUFFER * 60000);
    totalBuffer += JOURNEY_RULES.TIME_BUFFER;

    const departureTime = new Date(currentTime);

    enrichedStops.push({
      ...stop,
      calculatedArrival: arrivalTime,
      calculatedDeparture: departureTime,
      waitingTime: Math.round(waitTime),
      drivingToNext: 0, // Will be filled by next iteration or remain 0 for last
      distanceToNext: 0,
      activityType: stop.type === 'collection' ? 'loading' : 'unloading',
      activityDuration: taskTime
    });

    // Update previous stop's "ToNext" data
    if (i > 0) {
      enrichedStops[i-1].drivingToNext = driveTime;
      enrichedStops[i-1].distanceToNext = dist;
    }
  }

  const totalDuration = (currentTime.getTime() - startTime.getTime()) / 60000;

  return {
    totalDrivingTime: Math.round(totalDriving),
    totalLoadingTime: Math.round(totalLoading),
    totalWaitingTime: Math.round(totalWaiting),
    totalBufferTime: Math.round(totalBuffer),
    totalDuration: Math.round(totalDuration),
    startTime,
    endTime: currentTime,
    totalDistance: Math.round(totalDist * 10) / 10,
    isOverLimit: totalDuration > JOURNEY_RULES.MAX_JOURNEY_MINUTES,
    utilizationScore: Math.min(100, (totalDuration / JOURNEY_RULES.MAX_JOURNEY_MINUTES) * 100),
    stops: enrichedStops
  };
}

// --- OPTIMIZATION: Logic with Precedence Constraints ---
export function optimizeStops(stops: Stop[]): Stop[] {
  if (stops.length <= 2) return stops; 

  // 1. Identify Jobs and their stops
  const jobMap = new Map<string, { pickup?: Stop, dropoff?: Stop }>();
  
  stops.forEach(stop => {
      // Assuming stop.jobId exists. If not, we can't enforce precedence
      if (!stop.jobId) return;
      
      if (!jobMap.has(stop.jobId)) {
          jobMap.set(stop.jobId, {});
      }
      
      if (stop.type === 'collection') {
          jobMap.get(stop.jobId)!.pickup = stop;
      } else {
          jobMap.get(stop.jobId)!.dropoff = stop;
      }
  });

  // 2. Setup Optimization
  // Start is locked (first stop of input array)
  const lockedStart = stops[0];
  const optimized: Stop[] = [lockedStart];
  
  // Set of fulfilled pickups (to allow dropoffs)
  const pickedUpJobs = new Set<string>();
  if (lockedStart.type === 'collection' && lockedStart.jobId) {
      pickedUpJobs.add(lockedStart.jobId);
  }

  // Available stops to visit
  // Filter out start stop
  let remaining = stops.slice(1);
  let currentLocation = lockedStart;

  while (remaining.length > 0) {
      let bestIdx = -1;
      let minScore = Infinity;

      for (let i = 0; i < remaining.length; i++) {
          const candidate = remaining[i];
          
          // CONSTRAINT CHECK:
          // If it's a delivery, we MUST have visited the pickup
          if (candidate.type === 'delivery' && candidate.jobId) {
              // If pickup is in the original list but hasn't been visited yet -> invalid
              const jobData = jobMap.get(candidate.jobId);
              if (jobData?.pickup && !pickedUpJobs.has(candidate.jobId)) {
                  continue; // Skip this candidate, not unlocked yet
              }
          }

          // DISTANCE SCORE
          const dist = calculateDistance(
            currentLocation.address.lat || 0, currentLocation.address.lng || 0,
            candidate.address.lat || 0, candidate.address.lng || 0
          );
          
          // TIME WINDOW SCORE (Simple heuristic)
          // If candidate has early window, boost score (reduce value)
          let timeBonus = 0;
          /*
          const win = parseTimeWindow(candidate.timeWindow);
          if (win) {
             // Logic to prioritize early windows
          }
          */

          const score = dist + timeBonus;

          if (score < minScore) {
              minScore = score;
              bestIdx = i;
          }
      }

      // If no valid candidate found (should be rare/impossible if graph is connected), take first valid
      if (bestIdx === -1) {
          // Fallback: take first remaining to prevent infinite loop
          bestIdx = 0;
      }

      const bestStop = remaining[bestIdx];
      
      // Update State
      if (bestStop.type === 'collection' && bestStop.jobId) {
          pickedUpJobs.add(bestStop.jobId);
      }
      
      optimized.push(bestStop);
      currentLocation = bestStop;
      remaining.splice(bestIdx, 1);
  }

  return optimized;
}
