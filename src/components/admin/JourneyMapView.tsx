import React, { useState } from 'react';
import { MapPinned, Navigation, Info, ChevronUp, ChevronDown, Package, MapPin } from 'lucide-react';

interface MapStop {
  id: string;
  type: 'pickup' | 'delivery' | 'break';
  bookingNumber: string;
  address: string;
  postcode: string;
  customerName: string;
  lat: number;
  lng: number;
  arrivalTime?: Date;
  loadingTime?: number;
  distanceToNext?: number;
}

interface JourneyMapViewProps {
  stops: MapStop[];
  totalDistance: number;
  totalDrivingTime: number;
  totalJourneyTime: number;
  exceedsLimit: boolean;
}

export function JourneyMapView({ 
  stops, 
  totalDistance, 
  totalDrivingTime, 
  totalJourneyTime,
  exceedsLimit 
}: JourneyMapViewProps) {
  const [showMap, setShowMap] = useState(true);

  const formatTime = (date: Date | undefined) => {
    if (!date) return '--:--';
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const validStops = stops.filter(s => s.type !== 'break');

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-white">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <MapPinned className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Route Map</h3>
            <p className="text-xs text-purple-100">{validStops.length} stops • {totalDistance.toFixed(0)} miles total</p>
          </div>
        </div>
        <button
          onClick={() => setShowMap(!showMap)}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-all font-semibold text-sm text-white flex items-center gap-2"
        >
          {showMap ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {showMap ? 'Hide Map' : 'Show Map'}
        </button>
      </div>

      {showMap && (
        <div className="p-6">
          {/* Map Container */}
          <div className="relative w-full h-[600px] bg-gradient-to-br from-slate-100 to-blue-50 rounded-xl border-2 border-slate-300 overflow-hidden">
            {/* Map Grid Background */}
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}></div>

            {/* Route Lines - SVG Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 0.8 }} />
                  <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#10B981', stopOpacity: 0.8 }} />
                </linearGradient>
                
                {/* Arrow marker */}
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="8"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3, 0 6" fill="#8B5CF6" />
                </marker>
              </defs>

              {/* Draw route lines between stops */}
              {validStops.map((stop, index) => {
                if (index >= validStops.length - 1) return null;
                const nextStop = validStops[index + 1];
                
                // Calculate positions (normalized to map dimensions)
                const x1 = ((stop.lng + 180) / 360) * 100;
                const y1 = ((90 - stop.lat) / 180) * 100;
                const x2 = ((nextStop.lng + 180) / 360) * 100;
                const y2 = ((90 - nextStop.lat) / 180) * 100;

                return (
                  <g key={`route-${index}`}>
                    {/* Dotted background line */}
                    <line
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      stroke="rgba(139, 92, 246, 0.2)"
                      strokeWidth="8"
                      strokeDasharray="5,5"
                    />
                    
                    {/* Main route line */}
                    <line
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      stroke="url(#routeGradient)"
                      strokeWidth="4"
                      markerEnd="url(#arrowhead)"
                      className="drop-shadow-lg"
                    />

                    {/* Distance label */}
                    <text
                      x={`${(x1 + x2) / 2}%`}
                      y={`${(y1 + y2) / 2}%`}
                      fill="#4B5563"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="pointer-events-none"
                    >
                      <tspan className="bg-white px-2 py-1 rounded">
                        {stop.distanceToNext?.toFixed(1)} mi
                      </tspan>
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Stop Markers */}
            {validStops.map((stop, index) => {
              const x = ((stop.lng + 180) / 360) * 100;
              const y = ((90 - stop.lat) / 180) * 100;
              const stopNumber = index + 1;

              return (
                <div
                  key={stop.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    zIndex: 10
                  }}
                >
                  {/* Marker with Number */}
                  <div className="relative">
                    {/* Pulsing Ring Animation */}
                    <div className={`absolute inset-0 rounded-full animate-ping ${
                      stop.type === 'pickup' ? 'bg-blue-400' : 'bg-green-400'
                    }`} style={{ animationDuration: '2s' }}></div>

                    {/* Main Marker */}
                    <div className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border-4 border-white ${
                      stop.type === 'pickup'
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-600'
                        : 'bg-gradient-to-br from-green-500 to-emerald-600'
                    }`}>
                      <div className="text-center">
                        <div className="text-2xl font-black text-white">{stopNumber}</div>
                      </div>
                    </div>

                    {/* Pin Point */}
                    <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent ${
                      stop.type === 'pickup' ? 'border-t-cyan-600' : 'border-t-emerald-600'
                    }`}></div>
                  </div>

                  {/* Tooltip on Hover */}
                  <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50">
                    <div className={`rounded-xl shadow-2xl p-4 border-2 min-w-[280px] ${
                      stop.type === 'pickup'
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-green-50 border-green-300'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                          stop.type === 'pickup' ? 'bg-blue-600' : 'bg-green-600'
                        }`}>
                          #{stopNumber} {stop.type === 'pickup' ? 'PICKUP' : 'DELIVERY'}
                        </span>
                        <span className="font-bold text-slate-900">{stop.bookingNumber}</span>
                      </div>
                      <div className="text-sm font-semibold text-slate-900 mb-1">{stop.customerName}</div>
                      <div className="text-xs text-slate-600 mb-3">
                        <div>{stop.address}</div>
                        <div>{stop.postcode}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="text-slate-600">Arrival</div>
                          <div className="font-bold text-slate-900">{formatTime(stop.arrivalTime)}</div>
                        </div>
                        <div>
                          <div className="text-slate-600">Duration</div>
                          <div className="font-bold text-slate-900">{formatDuration(stop.loadingTime || 0)}</div>
                        </div>
                      </div>
                      {stop.distanceToNext && (
                        <div className="mt-2 pt-2 border-t border-slate-300 text-xs">
                          <div className="flex items-center gap-2 text-purple-700">
                            <Navigation className="w-3 h-3" />
                            <span className="font-semibold">
                              {stop.distanceToNext.toFixed(1)} mi to stop #{stopNumber + 1}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Arrow pointing to marker */}
                    <div className={`absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[8px] border-b-[8px] border-r-[8px] border-t-transparent border-b-transparent ${
                      stop.type === 'pickup' ? 'border-r-blue-300' : 'border-r-green-300'
                    }`}></div>
                  </div>
                </div>
              );
            })}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-4 border-2 border-slate-200">
              <div className="font-bold text-slate-900 mb-3 text-sm">Legend</div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 border-2 border-white shadow flex items-center justify-center">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <span className="text-slate-700 font-semibold">Pickup Point</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 border-2 border-white shadow flex items-center justify-center">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <span className="text-slate-700 font-semibold">Delivery Point</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg width="24" height="4">
                    <line x1="0" y1="2" x2="24" y2="2" stroke="url(#routeGradient)" strokeWidth="4" />
                  </svg>
                  <span className="text-slate-700 font-semibold">Route Path</span>
                </div>
              </div>
            </div>

            {/* Stats Overlay */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-4 border-2 border-slate-200">
              <div className="font-bold text-slate-900 mb-3 text-sm">Route Summary</div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-600">Total Stops:</span>
                  <span className="font-bold text-slate-900">{validStops.length}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-600">Total Distance:</span>
                  <span className="font-bold text-purple-900">{totalDistance.toFixed(1)} mi</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-600">Drive Time:</span>
                  <span className="font-bold text-blue-900">{formatDuration(totalDrivingTime)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-600">Total Time:</span>
                  <span className={`font-bold ${exceedsLimit ? 'text-red-900' : 'text-green-900'}`}>
                    {formatDuration(totalJourneyTime)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Instructions */}
          <div className="mt-4 bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-900">
                <span className="font-semibold">Interactive Map:</span> Hover over numbered markers to see stop details. 
                The route is color-coded from blue (start) to green (end) with distance labels between stops.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
