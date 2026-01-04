import { projectId, publicAnonKey } from './supabase/info';

export interface AddressResult {
  address: string;
  postcode?: string;
  lat: number;
  lng: number;
  placeId?: string;
}

export interface RouteResult {
  distanceMiles: number;
  durationMinutes: number;
  origin?: string;
  destination?: string;
  geometry?: any;
}

export interface JourneyEstimate {
  totalDistanceMiles: number;
  totalDurationMinutes: number;
  geometry?: any;
  legs: Array<{
    distanceMiles: number;
    durationMinutes: number;
  }>;
}

export interface DriverAllocation {
  driver: any;
  etaMinutes: number;
  distanceMiles: number;
}

class MapService {
  private baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-94f26792`;

  private async callBackend(endpoint: string, data: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Backend request failed');
    }

    return await response.json();
  }

  /**
   * Calculate distance and duration between two points
   * Uses backend Mapbox Directions API
   */
  async calculateRoute(origin: { lat: number; lng: number }, destination: { lat: number; lng: number }): Promise<RouteResult> {
    try {
      const result = await this.callBackend('/api/calculate-distance', {
        origin,
        destination,
      });

      if (!result.success) {
        throw new Error('Failed to calculate route');
      }

      return {
        distanceMiles: result.distanceMiles,
        durationMinutes: result.durationMinutes,
        geometry: result.geometry,
      };
    } catch (error) {
      console.error('Error calculating route via backend:', error);
      // Fallback to Haversine calculation if backend fails
      return this.calculateHaversine(origin, destination);
    }
  }

  /**
   * Calculate journey estimate for multiple waypoints
   * Uses backend Mapbox Directions API for route optimization
   */
  async calculateJourneyEstimate(waypoints: Array<{ lat: number; lng: number }>): Promise<JourneyEstimate> {
    try {
      const result = await this.callBackend('/api/journey/estimate', {
        waypoints,
      });

      if (!result.success) {
        throw new Error('Failed to calculate journey estimate');
      }

      return {
        totalDistanceMiles: result.totalDistanceMiles,
        totalDurationMinutes: result.totalDurationMinutes,
        geometry: result.geometry,
        legs: result.legs,
      };
    } catch (error) {
      console.error('Error calculating journey estimate via backend:', error);
      throw error;
    }
  }

  /**
   * Allocate nearest available driver to a job
   * Uses backend Mapbox Matrix API for optimal driver selection
   */
  async allocateNearestDriver(
    jobLocation: { lat: number; lng: number },
    availableDrivers: Array<{ id: string; lat: number; lng: number; name?: string }>
  ): Promise<DriverAllocation> {
    try {
      const result = await this.callBackend('/api/allocate-driver', {
        jobLocation,
        availableDrivers,
      });

      if (!result.success) {
        throw new Error('Failed to allocate driver');
      }

      return {
        driver: result.driver,
        etaMinutes: result.etaMinutes,
        distanceMiles: result.distanceMiles,
      };
    } catch (error) {
      console.error('Error allocating driver via backend:', error);
      throw error;
    }
  }

  /**
   * Fallback Haversine calculation when backend is unavailable
   * Used only as emergency fallback
   */
  private calculateHaversine(origin: { lat: number; lng: number }, destination: { lat: number; lng: number }): RouteResult {
    const R = 3959; // Earth radius in miles
    const dLat = (destination.lat - origin.lat) * Math.PI / 180;
    const dLon = (destination.lng - origin.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(origin.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distanceMiles = R * c;

    // Estimate: Urban speed avg 20mph, Highway 50mph based on distance
    const avgSpeed = distanceMiles > 20 ? 45 : 20;
    const durationMinutes = (distanceMiles / avgSpeed) * 60 + 10; // +10 mins traffic buffer

    return {
      distanceMiles: parseFloat((distanceMiles * 1.2).toFixed(1)), // Add 20% for road curvature
      durationMinutes: Math.round(durationMinutes),
    };
  }
}

export const mapService = new MapService();