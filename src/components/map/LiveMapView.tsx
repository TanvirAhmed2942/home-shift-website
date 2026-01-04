import React, { useState } from 'react';
import { GoogleMapTracker } from '../map/GoogleMapTracker';
import { MapPin, Clock, Truck, AlertTriangle } from 'lucide-react';

interface Location {
  lat: number;
  lng: number;
  address?: string;
  postcode?: string;
}

interface LiveMapViewProps {
  pickupLocation: Location;
  deliveryLocation: Location;
  driverLocation: Location;
  driverHeading?: number;
  driverSpeed?: number;
  driverName?: string;
  showTraffic?: boolean;
  useGoogleMaps?: boolean; // Toggle between real Google Maps and fallback
}

export function LiveMapView({
  pickupLocation,
  deliveryLocation,
  driverLocation,
  driverHeading = 0,
  driverSpeed = 0,
  driverName = 'Driver',
  showTraffic = true,
  useGoogleMaps = true
}: LiveMapViewProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [useSimulatedMap, setUseSimulatedMap] = useState(!useGoogleMaps);

  // Check if Google Maps API key is configured
  const hasGoogleMapsKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY && 
                           (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY !== 'YOUR_API_KEY_HERE';

  // Render Google Maps if enabled and key is available
  if (useGoogleMaps && (hasGoogleMapsKey || mapLoaded)) {
    return (
      <div className="relative w-full h-full">
        <GoogleMapTracker
          pickupLocation={pickupLocation}
          deliveryLocation={deliveryLocation}
          driverLocation={driverLocation}
          driverHeading={driverHeading}
          driverSpeed={driverSpeed}
          showTraffic={showTraffic}
          onMapLoad={() => setMapLoaded(true)}
        />
        
        {/* Fallback button */}
        <button
          onClick={() => setUseSimulatedMap(true)}
          className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-lg shadow-lg px-3 py-2 text-xs text-slate-600 hover:bg-white transition-all z-20 flex items-center gap-2"
        >
          <AlertTriangle className="w-3 h-3" />
          Switch to Simple View
        </button>
      </div>
    );
  }

  // Fallback: Simulated Map (if Google Maps not available or disabled)
  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      {/* Map Background with Grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-blue-100 to-indigo-100">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 30px), repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 30px)',
          }}
        />
      </div>

      {/* Route Path - Animated */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.9 }} />
            <stop offset="50%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 0.9 }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path
          d="M 80 120 Q 200 100, 350 180 T 650 300"
          stroke="url(#routeGradient)"
          strokeWidth="6"
          fill="none"
          strokeDasharray="15,10"
          filter="url(#glow)"
          className="animate-pulse"
        />
      </svg>

      {/* Pickup Location */}
      <div className="absolute top-24 left-16 sm:left-24 transform -translate-x-1/2 -translate-y-full z-10">
        <div className="bg-blue-600 text-white px-3 py-2 rounded-lg shadow-xl text-xs font-bold mb-2 whitespace-nowrap">
          📍 Pickup: {pickupLocation.postcode}
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-600 border-4 border-white shadow-2xl flex items-center justify-center">
          <MapPin className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Driver Location (Animated with pulse) */}
      <div className="absolute top-48 left-1/2 transform -translate-x-1/2 -translate-y-full z-20">
        <div className="relative">
          {/* Multiple pulsing rings */}
          <div className="absolute inset-0 w-20 h-20 -left-4 -top-4 bg-green-500 rounded-full opacity-20 animate-ping" />
          <div className="absolute inset-0 w-16 h-16 -left-2 -top-2 bg-green-500 rounded-full opacity-30 animate-pulse" />
          
          <div className="relative bg-green-600 text-white px-4 py-2 rounded-xl shadow-2xl text-xs font-bold mb-3 whitespace-nowrap flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            🚚 {driverName} - {Math.round(driverSpeed)} mph
          </div>
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 border-4 border-white shadow-2xl flex items-center justify-center transform transition-transform hover:scale-110">
            <Truck className="w-7 h-7 text-white" />
          </div>
          
          {/* Heading indicator */}
          <div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full transition-transform duration-300"
            style={{ transform: `rotate(${driverHeading}deg)` }}
          >
            <div className="w-1 h-8 bg-green-600 rounded-full" />
          </div>
        </div>
      </div>

      {/* Delivery Location */}
      <div className="absolute bottom-24 right-16 sm:right-24 transform translate-x-1/2 translate-y-full z-10">
        <div className="w-10 h-10 rounded-full bg-pink-600 border-4 border-white shadow-2xl flex items-center justify-center mb-2">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <div className="bg-pink-600 text-white px-3 py-2 rounded-lg shadow-xl text-xs font-bold whitespace-nowrap">
          🎯 Delivery: {deliveryLocation.postcode}
        </div>
      </div>

      {/* Live Updates Badge */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-xl shadow-xl px-4 py-2 flex items-center gap-2 border-2 border-green-200">
        <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-lg" />
        <span className="text-xs font-bold text-slate-700">Simulated GPS Tracking</span>
      </div>

      {/* Last Updated */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-xl shadow-xl px-4 py-2 border-2 border-blue-200">
        <div className="text-xs text-slate-600 font-semibold flex items-center gap-2">
          <Clock className="w-3 h-3" />
          {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Enable Google Maps Button */}
      {!useGoogleMaps && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-3 rounded-xl shadow-2xl z-20">
          <div className="text-center">
            <div className="text-sm font-bold mb-1">🗺️ Want Real Maps?</div>
            <div className="text-xs opacity-90 mb-2">Enable Google Maps for better accuracy</div>
            <button
              onClick={() => setUseSimulatedMap(false)}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 transition-all"
            >
              Setup Google Maps
            </button>
          </div>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-lg shadow-lg px-3 py-2 text-xs text-slate-600 z-10">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Pickup</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Driver</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-pink-500"></div>
          <span>Delivery</span>
        </div>
      </div>
    </div>
  );
}