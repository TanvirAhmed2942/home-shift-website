import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Clock, Truck, Home, AlertCircle, RefreshCw } from 'lucide-react';
import { gpsTrackingManager, Location, TrackingSession } from '../../utils/gpsTrackingManager';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface LiveTrackingMapProps {
  jobId: string;
  pickupLocation: Location;
  deliveryLocation: Location;
  customerName: string;
  driverName: string;
  showControls?: boolean;
}

export function LiveTrackingMap({
  jobId,
  pickupLocation,
  deliveryLocation,
  customerName,
  driverName,
  showControls = true,
}: LiveTrackingMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const driverMarker = useRef<mapboxgl.Marker | null>(null);

  const [session, setSession] = useState<TrackingSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to get token
  const getMapboxToken = () => {
    const envToken = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_MAPBOX_TOKEN) || 
                     (typeof import.meta !== 'undefined' && (import.meta as any).env?.NEXT_PUBLIC_MAPBOX_TOKEN);
    const localToken = typeof window !== 'undefined' ? localStorage.getItem('mapbox_token') : null;
    return envToken || localToken;
  };

  // ==================== INITIALIZE MAP ====================

  useEffect(() => {
    const initMap = async () => {
      const token = getMapboxToken();
      if (!token) {
        setError("Missing Mapbox Token");
        setIsLoading(false);
        return;
      }

      if (map.current) return;
      if (!mapContainer.current) return;

      mapboxgl.accessToken = token;

      try {
        setIsLoading(true);

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [pickupLocation.longitude, pickupLocation.latitude],
          zoom: 13,
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        map.current.on('load', () => {
          if (!map.current) return;

          // Add Pickup Marker (Green)
          const pickupEl = document.createElement('div');
          pickupEl.className = 'w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold';
          pickupEl.innerText = 'P';
          new mapboxgl.Marker(pickupEl)
              .setLngLat([pickupLocation.longitude, pickupLocation.latitude])
              .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<b>Pickup</b><br>${customerName}`))
              .addTo(map.current);

          // Add Delivery Marker (Red)
          const deliveryEl = document.createElement('div');
          deliveryEl.className = 'w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold';
          deliveryEl.innerText = 'D';
          new mapboxgl.Marker(deliveryEl)
              .setLngLat([deliveryLocation.longitude, deliveryLocation.latitude])
              .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<b>Delivery</b>`))
              .addTo(map.current);

          // Fit bounds
          const bounds = new mapboxgl.LngLatBounds();
          bounds.extend([pickupLocation.longitude, pickupLocation.latitude]);
          bounds.extend([deliveryLocation.longitude, deliveryLocation.latitude]);
          map.current.fitBounds(bounds, { padding: 100 });

          setIsLoading(false);
        });

      } catch (err) {
        console.error('Failed to initialize map:', err);
        setError('Failed to load map.');
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [pickupLocation, deliveryLocation]);

  // ==================== START TRACKING ====================

  useEffect(() => {
    if (!map.current) return;

    // Check if tracking session already exists
    let existingSession = gpsTrackingManager.getSessionByJobId(jobId);

    if (!existingSession) {
      // Start new tracking session
      const sessionId = gpsTrackingManager.startTracking(
        jobId,
        'DRV001', // Driver ID
        'CUST001', // Customer ID
        pickupLocation, // Driver starts at pickup
        deliveryLocation
      );

      existingSession = gpsTrackingManager.getSession(sessionId);
    }

    if (existingSession) {
      setSession(existingSession);

      // Subscribe to location updates
      const unsubscribe = gpsTrackingManager.onLocationUpdate(
        existingSession.sessionId,
        (updatedSession) => {
          setSession({ ...updatedSession });
          updateMapMarkers(updatedSession);
        }
      );

      // Initial marker update
      updateMapMarkers(existingSession);

      return () => {
        unsubscribe();
      };
    }
  }, [jobId, pickupLocation, deliveryLocation]);

  // ==================== UPDATE MAP MARKERS ====================

  const updateMapMarkers = (trackingSession: TrackingSession) => {
    if (!map.current) return;

    const { currentLocation } = trackingSession;

    // Update or create driver marker (blue truck)
    if (driverMarker.current) {
      driverMarker.current.setLngLat([currentLocation.longitude, currentLocation.latitude]);
      
      // Update rotation
      const el = driverMarker.current.getElement();
      const icon = el.querySelector('.driver-icon-wrapper');
      if (icon && currentLocation.heading) {
          (icon as HTMLElement).style.transform = `rotate(${currentLocation.heading}deg)`;
      }

    } else {
      const driverEl = document.createElement('div');
      driverEl.innerHTML = `
        <div class="driver-icon-wrapper" style="transform: rotate(${currentLocation.heading || 0}deg); transition: transform 0.3s ease;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600 fill-blue-100 drop-shadow-lg">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        </div>
      `;
      
      driverMarker.current = new mapboxgl.Marker(driverEl)
        .setLngLat([currentLocation.longitude, currentLocation.latitude])
        .addTo(map.current);
    }

    // Update route polyline (if we had real route geometry from tracking manager)
    // For now we rely on the initial route drawing or we can implement real-time route update
    // using Mapbox Directions API if needed.
    // Since gpsTrackingManager.calculateRoute returns a 'polyline' string (likely Google encoded),
    // we should probably just re-fetch route from Mapbox if needed.
    // For this implementation, I'll add the basic route drawing similar to LiveMapTracker.
    if (trackingSession.status === 'active' && !map.current.getSource('route')) {
        drawRoute(pickupLocation, deliveryLocation);
    }
  };
  
  const drawRoute = async (start: Location, end: Location) => {
      if (!map.current) return;
      const token = getMapboxToken();
      if (!token) return;
      
      const coords = `${start.longitude},${start.latitude};${end.longitude},${end.latitude}`;
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?geometries=geojson&access_token=${token}`;
      
      try {
          const response = await fetch(url);
          const data = await response.json();
          const route = data.routes?.[0]?.geometry;
          
          if (route) {
               if (map.current.getSource('route')) {
                    (map.current.getSource('route') as mapboxgl.GeoJSONSource).setData({
                        type: 'Feature',
                        properties: {},
                        geometry: route
                    });
               } else {
                    map.current.addLayer({
                        id: 'route',
                        type: 'line',
                        source: {
                            type: 'geojson',
                            data: {
                                type: 'Feature',
                                properties: {},
                                geometry: route
                            }
                        },
                        layout: { 'line-join': 'round', 'line-cap': 'round' },
                        paint: { 'line-color': '#6366F1', 'line-width': 4, 'line-opacity': 0.75 }
                    });
               }
          }
      } catch (e) {
          console.error("Route error:", e);
      }
  };

  // ==================== MOCK LOCATION UPDATE (For Testing) ====================

  const simulateMovement = () => {
    if (!session) return;

    // Simulate driver moving towards destination
    const current = session.currentLocation;
    const destination = session.destinationLocation;

    // Move 10% closer to destination
    const newLat = current.latitude + (destination.latitude - current.latitude) * 0.1;
    const newLng = current.longitude + (destination.longitude - current.longitude) * 0.1;

    gpsTrackingManager.mockUpdateLocation(session.sessionId, newLat, newLng);
  };

  // ==================== RENDER ====================

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden bg-slate-100">
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full min-h-[500px]" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm z-50">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-white">Loading map...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-yellow-500/90 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 z-50">
          <AlertCircle className="w-6 h-6 text-white flex-shrink-0" />
          <p className="text-white text-sm">{error}</p>
        </div>
      )}

      {/* Info Card */}
      {session && (
        <div className="absolute top-4 left-4 right-4 md:right-auto md:w-96 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl z-40">
          {/* Driver Status */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold">{driverName}</p>
              <p className="text-white/70 text-sm">En route to delivery</p>
            </div>
          </div>

          {/* ETA */}
          <div className="backdrop-blur-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 mb-4 border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-white" />
                <span className="text-white/80 text-sm">Estimated Arrival</span>
              </div>
              <span className="text-white text-lg font-bold">
                {gpsTrackingManager.formatETA(session.route.eta)}
              </span>
            </div>
          </div>

          {/* Distance & Speed */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="backdrop-blur-lg bg-white/10 rounded-xl p-3 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <Navigation className="w-4 h-4 text-blue-400" />
                <span className="text-white/70 text-xs">Distance</span>
              </div>
              <p className="text-white text-lg font-bold">{session.route.distance} km</p>
            </div>

            <div className="backdrop-blur-lg bg-white/10 rounded-xl p-3 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <Truck className="w-4 h-4 text-green-400" />
                <span className="text-white/70 text-xs">Speed</span>
              </div>
              <p className="text-white text-lg font-bold">
                {session.currentLocation.speed ? `${Math.round(session.currentLocation.speed)} km/h` : 'N/A'}
              </p>
            </div>
          </div>

          {/* Route Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0" />
              <span className="text-white/80">Pickup: {customerName}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0" />
              <span className="text-white/80">Delivery Address</span>
            </div>
          </div>

          {/* Last Update */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-white/50 text-xs">
              Last updated: {new Date(session.lastUpdate).toLocaleTimeString()}
            </p>
          </div>
        </div>
      )}

      {/* Mock Movement Button (Testing Only) */}
      {showControls && session && (
        <button
          onClick={simulateMovement}
          className="absolute bottom-4 right-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-lg transition-all hover:scale-105 z-40"
        >
          Simulate Movement
        </button>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 z-40">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-white">Pickup Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full" />
            <span className="text-white">Driver Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-white">Delivery Location</span>
          </div>
        </div>
      </div>
    </div>
  );
}
