/**
 * GPS TRACKING MANAGER
 * Real-time location tracking pentru drivers și customers
 * Includes: ETA calculation, route optimization
 */

// ==================== TYPES ====================

export interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy?: number; // meters
  speed?: number; // km/h
  heading?: number; // degrees (0-359)
}

export interface RouteInfo {
  distance: number; // km
  duration: number; // minutes
  eta: Date;
  polyline: string; // encoded polyline for rendering
}

export interface TrackingSession {
  sessionId: string;
  jobId: string;
  driverId: string;
  customerId: string;
  startLocation: Location;
  currentLocation: Location;
  destinationLocation: Location;
  route: RouteInfo;
  status: 'pending' | 'active' | 'paused' | 'completed';
  startTime: Date;
  lastUpdate: Date;
}

export interface Geofence {
  center: Location;
  radius: number; // meters
  triggered: boolean;
}

// ==================== GPS TRACKING MANAGER ====================

class GPSTrackingManager {
  private trackingSessions: Map<string, TrackingSession> = new Map();
  private watchIds: Map<string, number> = new Map();
  private listeners: Map<string, Array<(session: TrackingSession) => void>> = new Map();
  private geofences: Map<string, Geofence> = new Map();

  // ==================== START TRACKING ====================
  
  startTracking(
    jobId: string,
    driverId: string,
    customerId: string,
    startLocation: Location,
    destinationLocation: Location
  ): string {
    const sessionId = `track-${jobId}-${Date.now()}`;
    
    // Calculate initial route
    const route = this.calculateRoute(startLocation, destinationLocation);
    
    // Create tracking session
    const session: TrackingSession = {
      sessionId,
      jobId,
      driverId,
      customerId,
      startLocation,
      currentLocation: startLocation,
      destinationLocation,
      route,
      status: 'active',
      startTime: new Date(),
      lastUpdate: new Date(),
    };
    
    this.trackingSessions.set(sessionId, session);
    
    // Setup geofence for destination (500m radius)
    this.setupGeofence(sessionId, destinationLocation, 500);
    
    // Start watching position
    this.startWatchingPosition(sessionId);
    
    console.log(`[GPS] Started tracking session: ${sessionId}`);
    
    return sessionId;
  }

  // ==================== STOP TRACKING ====================
  
  stopTracking(sessionId: string): void {
    const session = this.trackingSessions.get(sessionId);
    if (!session) return;
    
    // Stop watching position
    this.stopWatchingPosition(sessionId);
    
    // Update status
    session.status = 'completed';
    session.lastUpdate = new Date();
    
    // Clean up
    this.listeners.delete(sessionId);
    this.geofences.delete(sessionId);
    
    console.log(`[GPS] Stopped tracking session: ${sessionId}`);
  }

  // ==================== WATCH POSITION ====================
  
  private startWatchingPosition(sessionId: string): void {
    if (!navigator.geolocation) {
      console.error('[GPS] Geolocation not supported');
      return;
    }
    
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed || undefined,
          heading: position.coords.heading || undefined,
        };
        
        this.updateLocation(sessionId, location);
      },
      (error) => {
        console.error('[GPS] Position error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );
    
    this.watchIds.set(sessionId, watchId);
  }

  private stopWatchingPosition(sessionId: string): void {
    const watchId = this.watchIds.get(sessionId);
    if (watchId !== undefined) {
      navigator.geolocation.clearWatch(watchId);
      this.watchIds.delete(sessionId);
    }
  }

  // ==================== UPDATE LOCATION ====================
  
  updateLocation(sessionId: string, location: Location): void {
    const session = this.trackingSessions.get(sessionId);
    if (!session || session.status !== 'active') return;
    
    // Update current location
    session.currentLocation = location;
    session.lastUpdate = new Date();
    
    // Recalculate route (ETA, distance)
    session.route = this.calculateRoute(location, session.destinationLocation);
    
    // Check geofence
    this.checkGeofence(sessionId, location);
    
    // Notify listeners
    this.notifyListeners(sessionId, session);
    
    console.log(`[GPS] Location updated for session: ${sessionId}`, location);
  }

  // ==================== CALCULATE ROUTE ====================
  
  private calculateRoute(start: Location, end: Location): RouteInfo {
    // Calculate straight-line distance (Haversine formula)
    const distance = this.calculateDistance(start, end);
    
    // Estimate duration (average speed 60 km/h)
    const averageSpeed = 60; // km/h
    const duration = (distance / averageSpeed) * 60; // minutes
    
    // Calculate ETA
    const eta = new Date(Date.now() + duration * 60 * 1000);
    
    // Mock polyline (In production, should fetch from Mapbox/Google)
    const polyline = this.encodePolyline([start, end]);
    
    return {
      distance: parseFloat(distance.toFixed(2)),
      duration: Math.ceil(duration),
      eta,
      polyline,
    };
  }

  // ==================== DISTANCE CALCULATION (Haversine) ====================
  
  private calculateDistance(loc1: Location, loc2: Location): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(loc2.latitude - loc1.latitude);
    const dLon = this.toRad(loc2.longitude - loc1.longitude);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(loc1.latitude)) *
        Math.cos(this.toRad(loc2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // ==================== GEOFENCING ====================
  
  private setupGeofence(sessionId: string, center: Location, radius: number): void {
    this.geofences.set(sessionId, {
      center,
      radius,
      triggered: false,
    });
  }

  private checkGeofence(sessionId: string, currentLocation: Location): void {
    const geofence = this.geofences.get(sessionId);
    if (!geofence || geofence.triggered) return;
    
    const distance = this.calculateDistance(currentLocation, geofence.center);
    const distanceInMeters = distance * 1000;
    
    // Trigger if within radius
    if (distanceInMeters <= geofence.radius) {
      geofence.triggered = true;
      this.onGeofenceEntered(sessionId);
    }
  }

  private onGeofenceEntered(sessionId: string): void {
    console.log(`[GPS] Geofence entered for session: ${sessionId}`);
    
    // In production, trigger notification:
    // - "Driver is approaching your location"
    // - Auto-update job status
  }

  // ==================== POLYLINE ENCODING ====================
  
  private encodePolyline(points: Location[]): string {
    // Simplified polyline encoding for internal use
    return points.map(p => `${p.latitude},${p.longitude}`).join('|');
  }

  // ==================== LISTENERS ====================
  
  onLocationUpdate(
    sessionId: string,
    callback: (session: TrackingSession) => void
  ): () => void {
    if (!this.listeners.has(sessionId)) {
      this.listeners.set(sessionId, []);
    }
    
    const listeners = this.listeners.get(sessionId)!;
    listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(sessionId: string, session: TrackingSession): void {
    const listeners = this.listeners.get(sessionId);
    if (!listeners) return;
    
    listeners.forEach(callback => callback(session));
  }

  // ==================== GET TRACKING SESSION ====================
  
  getSession(sessionId: string): TrackingSession | null {
    return this.trackingSessions.get(sessionId) || null;
  }

  getSessionByJobId(jobId: string): TrackingSession | null {
    for (const session of this.trackingSessions.values()) {
      if (session.jobId === jobId && session.status === 'active') {
        return session;
      }
    }
    return null;
  }

  getAllActiveSessions(): TrackingSession[] {
    return Array.from(this.trackingSessions.values()).filter(
      s => s.status === 'active'
    );
  }

  // ==================== MOCK LOCATION (For Testing) ====================
  
  mockUpdateLocation(sessionId: string, latitude: number, longitude: number): void {
    const location: Location = {
      latitude,
      longitude,
      timestamp: Date.now(),
      accuracy: 10,
      speed: 50,
      heading: 90,
    };
    
    this.updateLocation(sessionId, location);
  }

  // ==================== GET CURRENT POSITION ====================
  
  getCurrentPosition(): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: position.timestamp,
            accuracy: position.coords.accuracy,
            speed: position.coords.speed || undefined,
            heading: position.coords.heading || undefined,
          });
        },
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }

  // ==================== FORMAT ETA ====================
  
  formatETA(eta: Date): string {
    const now = new Date();
    const diff = eta.getTime() - now.getTime();
    const minutes = Math.ceil(diff / 1000 / 60);
    
    if (minutes < 1) return 'Arriving now';
    if (minutes === 1) return '1 minute';
    if (minutes < 60) return `${minutes} minutes`;
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (mins === 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    return `${hours}h ${mins}m`;
  }

  // ==================== CLEAR ALL ====================
  
  clearAll(): void {
    // Stop all watching
    this.watchIds.forEach((watchId) => {
      navigator.geolocation.clearWatch(watchId);
    });
    
    // Clear all data
    this.trackingSessions.clear();
    this.watchIds.clear();
    this.listeners.clear();
    this.geofences.clear();
    
    console.log('[GPS] Cleared all tracking sessions');
  }
}

// ==================== SINGLETON INSTANCE ====================

export const gpsTrackingManager = new GPSTrackingManager();

// ==================== MOCK DATA (For Testing) ====================

export const mockLocations = {
  // London coordinates for testing
  pickupAddress: { latitude: 51.5074, longitude: -0.1278 }, // Central London
  deliveryAddress: { latitude: 51.5155, longitude: -0.0922 }, // East London
  currentDriver: { latitude: 51.5100, longitude: -0.1150 }, // Between pickup & delivery
};
