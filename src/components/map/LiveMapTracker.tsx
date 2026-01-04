import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { fetchSystemConfig } from '../../utils/configService';
import { MAPBOX_PUBLIC_TOKEN } from '../../utils/mapboxConfig';

interface Location {
  lat: number;
  lng: number;
  address?: string;
  postcode?: string;
}

interface LiveMapTrackerProps {
  pickupLocation: Location;
  deliveryLocation: Location;
  driverLocation: Location;
  driverHeading?: number;
  driverSpeed?: number;
  showTraffic?: boolean;
  className?: string;
}

export default function LiveMapTracker({
  pickupLocation,
  deliveryLocation,
  driverLocation,
  driverHeading = 0,
  showTraffic = false,
  className = "w-full h-full"
}: LiveMapTrackerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const driverMarker = useRef<mapboxgl.Marker | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState('');
  const [loadedToken, setLoadedToken] = useState<string | null>(null);

  // Helper to get token
  const getMapboxToken = async () => {
    // 1. Try env var
    const envToken = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_MAPBOX_TOKEN) || 
                     (typeof import.meta !== 'undefined' && (import.meta as any).env?.NEXT_PUBLIC_MAPBOX_TOKEN);
    
    if (envToken) return envToken;

    // 2. Try localStorage
    const localToken = typeof window !== 'undefined' ? localStorage.getItem('mapbox_token') : null;
    if (localToken) return localToken;

    // 3. Fetch from backend
    const config = await fetchSystemConfig();
    if (config?.mapboxToken) {
        localStorage.setItem('mapbox_token', config.mapboxToken);
        return config.mapboxToken;
    }

    // 4. Use hardcoded token as final fallback
    if (MAPBOX_PUBLIC_TOKEN) {
        return MAPBOX_PUBLIC_TOKEN;
    }

    return null;
  };

  const handleSaveToken = () => {
    if (tokenInput.trim()) {
      localStorage.setItem('mapbox_token', tokenInput.trim());
      window.location.reload();
    }
  };

  useEffect(() => {
    const initMap = async () => {
        const token = await getMapboxToken();
        if (!token) {
            setError("Missing Mapbox Token");
            return;
        }
        setLoadedToken(token);

        if (map.current) return;
        if (!mapContainer.current) return;

        mapboxgl.accessToken = token;

        try {
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/light-v11',
            center: [driverLocation.lng, driverLocation.lat],
            zoom: 13,
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        map.current.on('load', () => {
            if (!map.current) return;

            // Add Traffic Layer
            if (showTraffic) {
                map.current.addLayer({
                    id: 'traffic',
                    source: {
                        type: 'vector',
                        url: 'mapbox://mapbox.mapbox-traffic-v1'
                    },
                    'source-layer': 'traffic',
                    type: 'line',
                    paint: {
                        'line-width': 2,
                        'line-color': [
                            'case',
                            ['==', 'low', ['get', 'congestion']], '#aab7ef',
                            ['==', 'moderate', ['get', 'congestion']], '#4264fb',
                            ['==', 'heavy', ['get', 'congestion']], '#ee4e8b',
                            ['==', 'severe', ['get', 'congestion']], '#b43b71',
                            '#000000'
                        ]
                    }
                });
            }

            // Add Pickup Marker
            const pickupEl = document.createElement('div');
            pickupEl.className = 'w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold';
            pickupEl.innerText = 'P';
            new mapboxgl.Marker(pickupEl)
                .setLngLat([pickupLocation.lng, pickupLocation.lat])
                .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<b>Pickup</b><br>${pickupLocation.address || ''}`))
                .addTo(map.current);

            // Add Delivery Marker
            const deliveryEl = document.createElement('div');
            deliveryEl.className = 'w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold';
            deliveryEl.innerText = 'D';
            new mapboxgl.Marker(deliveryEl)
                .setLngLat([deliveryLocation.lng, deliveryLocation.lat])
                .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<b>Delivery</b><br>${deliveryLocation.address || ''}`))
                .addTo(map.current);

            // Add Driver Marker
            const driverEl = document.createElement('div');
            driverEl.className = 'driver-marker';
            driverEl.innerHTML = `
            <div style="transform: rotate(${driverHeading}deg); transition: transform 0.3s ease;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-600 fill-purple-100 drop-shadow-lg">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />
                </svg>
            </div>
            `;
            
            driverMarker.current = new mapboxgl.Marker(driverEl)
                .setLngLat([driverLocation.lng, driverLocation.lat])
                .addTo(map.current);

            // Draw Route
            drawRoute(token); // Pass token to drawRoute
            
            // Fit bounds
            const bounds = new mapboxgl.LngLatBounds();
            bounds.extend([pickupLocation.lng, pickupLocation.lat]);
            bounds.extend([deliveryLocation.lng, deliveryLocation.lat]);
            bounds.extend([driverLocation.lng, driverLocation.lat]);
            map.current.fitBounds(bounds, { padding: 50 });
        });

        } catch (err) {
            console.error("Mapbox Error:", err);
            setError("Failed to load map");
        }
    };

    initMap();

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update Driver Position
  useEffect(() => {
    if (!map.current || !driverMarker.current) return;
    
    driverMarker.current.setLngLat([driverLocation.lng, driverLocation.lat]);
    
    // Update rotation
    const el = driverMarker.current.getElement();
    const icon = el.querySelector('div');
    if (icon) {
        icon.style.transform = `rotate(${driverHeading}deg)`;
    }
  }, [driverLocation, driverHeading]);

  // Update Traffic
  useEffect(() => {
      if (!map.current || !map.current.isStyleLoaded()) return;
      
      if (showTraffic) {
          if (!map.current.getLayer('traffic')) {
               map.current.addLayer({
                id: 'traffic',
                source: {
                    type: 'vector',
                    url: 'mapbox://mapbox.mapbox-traffic-v1'
                },
                'source-layer': 'traffic',
                type: 'line',
                paint: {
                    'line-width': 2,
                    'line-color': [
                        'case',
                        ['==', 'low', ['get', 'congestion']], '#aab7ef',
                        ['==', 'moderate', ['get', 'congestion']], '#4264fb',
                        ['==', 'heavy', ['get', 'congestion']], '#ee4e8b',
                        ['==', 'severe', ['get', 'congestion']], '#b43b71',
                        '#000000'
                    ]
                }
             });
          }
      } else {
          if (map.current.getLayer('traffic')) {
              map.current.removeLayer('traffic');
              if (map.current.getSource('traffic')) {
                   map.current.removeSource('traffic');
              }
          }
      }
  }, [showTraffic]);


  const drawRoute = async (token?: string) => {
    if (!map.current) return;
    
    // If token not passed, try to get from loaded state or fetch again (but async here is tricky if not awaited)
    // In initMap we pass it.
    if (!token && loadedToken) token = loadedToken;
    if (!token) return; 

    const coords = `${pickupLocation.lng},${pickupLocation.lat};${deliveryLocation.lng},${deliveryLocation.lat}`;
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
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#3b82f6',
                        'line-width': 4,
                        'line-opacity': 0.75
                    }
                });
            }
        }
    } catch (e) {
        console.error("Error fetching route:", e);
    }
  };

  if (error) {
    return (
      <div className={`bg-slate-100 flex flex-col items-center justify-center rounded-xl border border-gray-300 ${className} p-4`}>
        <div className="text-center mb-4">
           <p className="font-bold text-gray-500">Map Unavailable</p>
           <p className="text-xs text-gray-400">{error}</p>
        </div>
        
        <div className="w-full max-w-xs bg-white p-3 rounded shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Enter Mapbox Public Token:</p>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="pk.eyJ1..."
              className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-xs w-full"
            />
            <button 
              onClick={handleSaveToken}
              className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 whitespace-nowrap"
            >
              Save
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            You can also set this in System Configuration.
          </p>
        </div>
      </div>
    );
  }

  return <div ref={mapContainer} className={className} />;
}