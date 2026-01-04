import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  MapPin, Truck, Package, RefreshCw, XCircle, Save
} from 'lucide-react';
import { MAPBOX_PUBLIC_TOKEN } from '../../utils/mapboxConfig';

interface Driver {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'offline';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  currentJobs: number;
  rating: number;
  vehicle: string;
  phone: string;
  lastUpdate: Date;
}

interface JobLocation {
  id: string;
  customerName: string;
  pickupAddress: string;
  pickupLocation: {
    lat: number;
    lng: number;
  };
  status: 'pending' | 'assigned' | 'in-progress';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  value: number;
}

// Mock data
const mockDrivers: Driver[] = [
  {
    id: 'DRV001', name: 'John Smith', status: 'available',
    location: { lat: 51.5074, lng: -0.1278, address: 'Central London' },
    currentJobs: 0, rating: 4.8, vehicle: 'Large Van', phone: '+44 7700 900123', lastUpdate: new Date()
  },
  {
    id: 'DRV002', name: 'Maria Garcia', status: 'available',
    location: { lat: 51.5155, lng: -0.1419, address: 'Westminster' },
    currentJobs: 0, rating: 4.9, vehicle: 'Luton Van', phone: '+44 7700 900124', lastUpdate: new Date()
  },
  {
    id: 'DRV003', name: 'Ahmed Hassan', status: 'busy',
    location: { lat: 51.4975, lng: -0.1357, address: 'Southwark' },
    currentJobs: 1, rating: 4.7, vehicle: 'Medium Van', phone: '+44 7700 900125', lastUpdate: new Date()
  },
];

const mockJobs: JobLocation[] = [
  {
    id: 'JOB001', customerName: 'Alice Brown', pickupAddress: '123 Oxford Street',
    pickupLocation: { lat: 51.5154, lng: -0.1419 }, status: 'pending', priority: 'urgent', value: 450
  },
  {
    id: 'JOB002', customerName: 'Bob Wilson', pickupAddress: '789 Camden High Street',
    pickupLocation: { lat: 51.5392, lng: -0.1426 }, status: 'pending', priority: 'high', value: 380
  },
];

export function FleetMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [jobs, setJobs] = useState<JobLocation[]>(mockJobs);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobLocation | null>(null);
  
  const [showDrivers, setShowDrivers] = useState(true);
  const [showJobs, setShowJobs] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState('');

  // Helper to get token
  const getMapboxToken = () => {
    // 1. Try env var
    const envToken = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_MAPBOX_TOKEN) || 
                     (typeof import.meta !== 'undefined' && (import.meta as any).env?.NEXT_PUBLIC_MAPBOX_TOKEN);
    
    // 2. Try localStorage
    const localToken = typeof window !== 'undefined' ? localStorage.getItem('mapbox_token') : null;

    // 3. Use hardcoded token as final fallback
    return envToken || localToken || MAPBOX_PUBLIC_TOKEN;
  };

  const handleSaveToken = () => {
    if (tokenInput.trim()) {
      localStorage.setItem('mapbox_token', tokenInput.trim());
      window.location.reload();
    }
  };

  // Initialize Map
  useEffect(() => {
    const token = getMapboxToken();
                  
    if (!token) {
      setError("Missing Mapbox Token");
      return;
    }
    if (map.current) return;

    mapboxgl.accessToken = token;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-0.1278, 51.5074],
        zoom: 11
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
    } catch (err) {
      console.error("Map init error:", err);
      setError("Failed to initialize map");
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update Markers
  useEffect(() => {
    if (!map.current) return;
    // Effect logic handled by marker refresh below
  }, [drivers, jobs, showDrivers, showJobs]);
  
  // Ref for markers to clear them
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!map.current) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add Drivers
    if (showDrivers) {
      drivers.forEach(driver => {
        const el = document.createElement('div');
        el.className = 'w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center';
        el.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M10 17h4v5h-4z"/><path d="M20 17h2v5h-2z"/><path d="M15 17h2v5h-2z"/><rect x="2" y="5" width="20" height="12" rx="2"/></svg>'; // Truck iconish
        
        // Color based on status
        if (driver.status === 'busy') el.style.backgroundColor = '#eab308';
        if (driver.status === 'offline') el.style.backgroundColor = '#94a3b8';

        const marker = new mapboxgl.Marker(el)
          .setLngLat([driver.location.lng, driver.location.lat])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <div class="p-2">
              <div class="font-bold">${driver.name}</div>
              <div class="text-xs text-gray-500">${driver.status}</div>
              <div class="text-xs mt-1">${driver.vehicle}</div>
            </div>
          `))
          .addTo(map.current!);
        
        // Add click listener workaround via element
        el.addEventListener('click', () => setSelectedDriver(driver));
        
        markersRef.current.push(marker);
      });
    }

    // Add Jobs
    if (showJobs) {
      jobs.forEach(job => {
        const el = document.createElement('div');
        el.className = 'w-8 h-8 bg-purple-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center';
        el.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>'; // Package iconish

        if (job.priority === 'urgent') el.style.backgroundColor = '#ef4444';

        const marker = new mapboxgl.Marker(el)
          .setLngLat([job.pickupLocation.lng, job.pickupLocation.lat])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <div class="p-2">
              <div class="font-bold">${job.id}</div>
              <div class="text-xs text-gray-500">${job.priority}</div>
              <div class="text-xs mt-1">${job.pickupAddress}</div>
            </div>
          `))
          .addTo(map.current!);

        el.addEventListener('click', () => setSelectedJob(job));

        markersRef.current.push(marker);
      });
    }

  }, [drivers, jobs, showDrivers, showJobs]);

  // Auto Refresh Simulation
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setDrivers(prev => prev.map(d => ({
        ...d,
        location: {
          ...d.location,
          lat: d.location.lat + (Math.random() - 0.5) * 0.001,
          lng: d.location.lng + (Math.random() - 0.5) * 0.001
        }
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center text-red-600">
        <h3 className="font-bold text-lg mb-2">Map Error</h3>
        <p>{error}</p>
        <p className="text-sm mt-2 text-red-500 mb-4">Please ensure NEXT_PUBLIC_MAPBOX_TOKEN is set in your environment.</p>
        
        <div className="max-w-md mx-auto bg-white p-4 rounded-lg shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Manual Token Entry (Fallback)</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="pk.eyJ1..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <button 
              onClick={handleSaveToken}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-left">This will save to your browser's local storage.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h2 className="font-bold text-slate-800">Live Fleet Map</h2>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setShowDrivers(!showDrivers)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 ${showDrivers ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
          >
            <Truck className="w-4 h-4" /> Drivers
          </button>
          <button 
            onClick={() => setShowJobs(!showJobs)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 ${showJobs ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}
          >
            <Package className="w-4 h-4" /> Jobs
          </button>
          <button 
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 ${autoRefresh ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} /> Live
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map */}
        <div className="lg:col-span-3 h-[600px] bg-slate-100 rounded-xl overflow-hidden relative shadow-lg border border-slate-200">
           <div ref={mapContainer} className="w-full h-full" />
           
           {/* Legend */}
           <div className="absolute top-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-md text-xs space-y-2">
              <div className="font-bold mb-1">Legend</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> Available Driver</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div> Busy Driver</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-purple-500 rounded-full"></div> Job</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Urgent Job</div>
           </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4 h-[600px] overflow-y-auto pr-1">
          {selectedDriver ? (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold">Driver Info</h3>
                <button onClick={() => setSelectedDriver(null)}><XCircle className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Name:</span> <strong>{selectedDriver.name}</strong></p>
                <p><span className="text-gray-500">Status:</span> <span className="uppercase font-bold text-xs px-2 py-0.5 bg-gray-100 rounded">{selectedDriver.status}</span></p>
                <p><span className="text-gray-500">Vehicle:</span> {selectedDriver.vehicle}</p>
                <p><span className="text-gray-500">Phone:</span> {selectedDriver.phone}</p>
                <hr className="my-2"/>
                <p className="text-xs text-gray-400">Last updated: {selectedDriver.lastUpdate.toLocaleTimeString()}</p>
              </div>
            </div>
          ) : selectedJob ? (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold">Job Info</h3>
                <button onClick={() => setSelectedJob(null)}><XCircle className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">ID:</span> <strong>{selectedJob.id}</strong></p>
                <p><span className="text-gray-500">Priority:</span> <span className="uppercase font-bold text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded">{selectedJob.priority}</span></p>
                <p><span className="text-gray-500">Pickup:</span> {selectedJob.pickupAddress}</p>
                <p><span className="text-gray-500">Customer:</span> {selectedJob.customerName}</p>
              </div>
            </div>
          ) : (
             <div className="bg-slate-50 p-6 rounded-xl text-center text-gray-500 text-sm border border-dashed border-slate-300 h-full flex items-center justify-center">
               <p>Select a marker on the map to view details</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}