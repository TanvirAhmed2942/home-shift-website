import React, { useState, useEffect, useRef } from 'react';
import { 
  Navigation, MapPin, Phone, Clock, Package, User, Truck, CheckCircle, 
  AlertCircle, Play, Pause, MessageSquare, RefreshCw, Maximize2, Eye,
  TrendingUp, Zap, Route, Activity, Bell, Share2, ExternalLink,
  ChevronRight, Info, Settings, Filter, Search, X, Mail
} from 'lucide-react';
import LiveMapTracker from '../map/LiveMapTracker';

interface ActiveJob {
  id: string;
  bookingNumber: string;
  driver: {
    name: string;
    phone: string;
    vehicle: string;
    photo?: string;
    rating: number;
  };
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  pickup: {
    address: string;
    postcode: string;
    lat: number;
    lng: number;
  };
  delivery: {
    address: string;
    postcode: string;
    lat: number;
    lng: number;
  };
  status: 'picked-up' | 'in-transit' | 'near-delivery' | 'delivered';
  currentLocation: {
    lat: number;
    lng: number;
  };
  driverHeading: number;
  driverSpeed: number;
  eta: string;
  distance: number;
  completedDistance: number;
  startTime: Date;
  estimatedArrival: Date;
  lastUpdate: Date;
  priority: 'normal' | 'urgent';
  value: number;
}

export function LiveTrackingAdvanced() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMap, setShowMap] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'picked-up' | 'in-transit' | 'near-delivery'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTraffic, setShowTraffic] = useState(true);
  const [autoSelect, setAutoSelect] = useState(true);

  // Mock active jobs with GPS coordinates
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([
    {
      id: '1',
      bookingNumber: 'SMH-1002',
      driver: { 
        name: 'Mike Johnson', 
        phone: '+44 7700 900111', 
        vehicle: 'Large Van - AB12 CDE',
        rating: 4.8
      },
      customer: { 
        name: 'Emma Wilson', 
        phone: '+44 7700 900456',
        email: 'emma@example.com'
      },
      pickup: { 
        address: '123 High Street, Birmingham', 
        postcode: 'B1 1AA', 
        lat: 52.4862, 
        lng: -1.8904 
      },
      delivery: { 
        address: '456 Park Lane, Leeds', 
        postcode: 'LS1 1AA', 
        lat: 53.7997, 
        lng: -1.5492 
      },
      status: 'in-transit',
      currentLocation: { lat: 53.1424, lng: -1.6724 },
      driverHeading: 45,
      driverSpeed: 55,
      eta: '14:30',
      distance: 120,
      completedDistance: 65,
      startTime: new Date(Date.now() - 7200000),
      estimatedArrival: new Date(Date.now() + 3600000),
      lastUpdate: new Date(),
      priority: 'urgent',
      value: 450
    },
    {
      id: '2',
      bookingNumber: 'SMH-1003',
      driver: { 
        name: 'Sarah Davis', 
        phone: '+44 7700 900222', 
        vehicle: 'Medium Van - FG34 HIJ',
        rating: 4.9
      },
      customer: { 
        name: 'David Brown', 
        phone: '+44 7700 900789',
        email: 'david@example.com'
      },
      pickup: { 
        address: '10 Westminster Road, London', 
        postcode: 'SW1A 1AA', 
        lat: 51.5014, 
        lng: -0.1419 
      },
      delivery: { 
        address: '25 Oxford Street, Oxford', 
        postcode: 'OX1 1AA', 
        lat: 51.7520, 
        lng: -1.2577 
      },
      status: 'picked-up',
      currentLocation: { lat: 51.5014, lng: -0.1419 },
      driverHeading: 270,
      driverSpeed: 15,
      eta: '11:45',
      distance: 60,
      completedDistance: 5,
      startTime: new Date(Date.now() - 1800000),
      estimatedArrival: new Date(Date.now() + 5400000),
      lastUpdate: new Date(),
      priority: 'normal',
      value: 320
    },
    {
      id: '3',
      bookingNumber: 'SMH-1005',
      driver: { 
        name: 'Tom Wilson', 
        phone: '+44 7700 900333', 
        vehicle: 'Luton Van - KL56 MNO',
        rating: 5.0
      },
      customer: { 
        name: 'Lisa Anderson', 
        phone: '+44 7700 900321',
        email: 'lisa@example.com'
      },
      pickup: { 
        address: '88 City Center, Bristol', 
        postcode: 'BS1 1AA', 
        lat: 51.4545, 
        lng: -2.5879 
      },
      delivery: { 
        address: '99 Queen Street, Cardiff', 
        postcode: 'CF10 1AA', 
        lat: 51.4816, 
        lng: -3.1791 
      },
      status: 'near-delivery',
      currentLocation: { lat: 51.4780, lng: -3.1500 },
      driverHeading: 180,
      driverSpeed: 25,
      eta: '10:15',
      distance: 45,
      completedDistance: 42,
      startTime: new Date(Date.now() - 5400000),
      estimatedArrival: new Date(Date.now() + 900000),
      lastUpdate: new Date(),
      priority: 'urgent',
      value: 380
    },
  ]);

  const statusConfig = {
    'picked-up': { 
      label: 'Picked Up', 
      color: 'bg-blue-100 text-blue-700 border-blue-300', 
      icon: '📦',
      gradient: 'from-blue-500 to-cyan-500'
    },
    'in-transit': { 
      label: 'In Transit', 
      color: 'bg-purple-100 text-purple-700 border-purple-300', 
      icon: '🚚',
      gradient: 'from-purple-500 to-pink-500'
    },
    'near-delivery': { 
      label: 'Near Delivery', 
      color: 'bg-orange-100 text-orange-700 border-orange-300', 
      icon: '📍',
      gradient: 'from-orange-500 to-red-500'
    },
    'delivered': { 
      label: 'Delivered', 
      color: 'bg-green-100 text-green-700 border-green-300', 
      icon: '✅',
      gradient: 'from-green-500 to-emerald-500'
    },
  };

  const job = selectedJob ? activeJobs.find(j => j.id === selectedJob) : activeJobs[0];

  // Simulate GPS updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setActiveJobs(prev => prev.map(j => {
        if (j.status === 'delivered') return j;
        
        // Simulate movement
        const progress = (j.completedDistance / j.distance);
        const newCompleted = Math.min(j.completedDistance + 0.5, j.distance);
        
        // Calculate new position (simplified)
        const latDiff = j.delivery.lat - j.pickup.lat;
        const lngDiff = j.delivery.lng - j.pickup.lng;
        const newLat = j.pickup.lat + (latDiff * (newCompleted / j.distance));
        const newLng = j.pickup.lng + (lngDiff * (newCompleted / j.distance));

        // Update status based on progress
        let newStatus = j.status;
        if (progress > 0.9) newStatus = 'near-delivery';
        else if (progress > 0.1) newStatus = 'in-transit';

        return {
          ...j,
          completedDistance: newCompleted,
          currentLocation: { lat: newLat, lng: newLng },
          driverSpeed: 40 + Math.random() * 20,
          driverHeading: Math.atan2(lngDiff, latDiff) * (180 / Math.PI),
          status: newStatus,
          lastUpdate: new Date()
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Auto-select first job
  useEffect(() => {
    if (autoSelect && !selectedJob && activeJobs.length > 0) {
      setSelectedJob(activeJobs[0].id);
    }
  }, [activeJobs, selectedJob, autoSelect]);

  // Filter jobs
  const filteredJobs = activeJobs.filter(job => {
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      job.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getTimeElapsed = (startTime: Date) => {
    const minutes = Math.floor((Date.now() - startTime.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  const getTimeRemaining = (eta: Date) => {
    const minutes = Math.floor((eta.getTime() - Date.now()) / 60000);
    if (minutes < 0) return 'Delayed';
    if (minutes < 60) return `${minutes}m`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Live Tracking Dashboard</h2>
              <p className="text-purple-100 text-sm">Real-time GPS monitoring with Google Maps integration</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsLive(!isLive)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all backdrop-blur-sm ${
                isLive
                  ? 'bg-white/20 hover:bg-white/30 border-2 border-white/40'
                  : 'bg-white/10 hover:bg-white/20 border-2 border-white/20'
              }`}
            >
              {isLive ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span className="font-semibold text-sm">Live ON</span>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span className="font-semibold text-sm">Live OFF</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowTraffic(!showTraffic)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all backdrop-blur-sm ${
                showTraffic
                  ? 'bg-white/20 hover:bg-white/30 border-2 border-white/40'
                  : 'bg-white/10 hover:bg-white/20 border-2 border-white/20'
              }`}
            >
              <Route className="w-4 h-4" />
              <span className="font-semibold text-sm">Traffic</span>
            </button>

            <button
              onClick={() => setShowMap(!showMap)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 border-2 border-white/40 transition-all backdrop-blur-sm"
            >
              <MapPin className="w-4 h-4" />
              <span className="font-semibold text-sm">{showMap ? 'Live Map' : 'Simple View'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Truck className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold mb-1">{activeJobs.length}</div>
          <div className="text-sm text-blue-100">Active Jobs</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Navigation className="w-8 h-8 opacity-80" />
            <Activity className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold mb-1">
            {activeJobs.filter(j => j.status === 'in-transit').length}
          </div>
          <div className="text-sm text-purple-100">In Transit</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <MapPin className="w-8 h-8 opacity-80" />
            <Zap className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold mb-1">
            {activeJobs.filter(j => j.status === 'near-delivery').length}
          </div>
          <div className="text-sm text-orange-100">Near Delivery</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 opacity-80" />
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold mb-1">
            {Math.round(activeJobs.reduce((sum, j) => sum + ((j.completedDistance / j.distance) * 100), 0) / activeJobs.length)}%
          </div>
          <div className="text-sm text-green-100">Avg Progress</div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-3xl font-bold mb-1">£{activeJobs.reduce((sum, j) => sum + j.value, 0)}</div>
          <div className="text-sm text-indigo-100">Total Value</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-slate-200 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by booking, driver, or customer..."
              className="w-full pl-10 pr-4 py-2 border-2 border-slate-300 rounded-lg text-sm focus:border-purple-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border-2 border-slate-300 rounded-lg text-sm font-semibold focus:border-purple-500 focus:outline-none"
          >
            <option value="all">All Status ({activeJobs.length})</option>
            <option value="picked-up">Picked Up ({activeJobs.filter(j => j.status === 'picked-up').length})</option>
            <option value="in-transit">In Transit ({activeJobs.filter(j => j.status === 'in-transit').length})</option>
            <option value="near-delivery">Near Delivery ({activeJobs.filter(j => j.status === 'near-delivery').length})</option>
          </select>

          {/* View Mode */}
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                viewMode === 'grid' ? 'bg-white shadow text-purple-600' : 'text-slate-600'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                viewMode === 'list' ? 'bg-white shadow text-purple-600' : 'text-slate-600'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Jobs List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              Active Deliveries ({filteredJobs.length})
            </h3>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-all">
              <RefreshCw className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
            {filteredJobs.map((job) => (
              <button
                key={job.id}
                onClick={() => setSelectedJob(job.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selectedJob === job.id || (!selectedJob && job.id === activeJobs[0].id)
                    ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                    : 'border-slate-200 bg-white hover:border-purple-300 hover:shadow'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-bold text-slate-900">{job.bookingNumber}</div>
                      {job.priority === 'urgent' && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                          URGENT
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-600">{job.driver.name}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[job.status].color} border-2`}>
                    {statusConfig[job.status].icon} {statusConfig[job.status].label}
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-2 text-sm mb-3">
                  <div className="flex items-center gap-2 text-slate-600">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="truncate">{job.customer.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span className="truncate">{job.delivery.postcode}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span>ETA: {job.eta}</span>
                    </div>
                    <div className="font-semibold text-purple-600">
                      £{job.value}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>{job.completedDistance.toFixed(1)}mi</span>
                    <span>{((job.completedDistance / job.distance) * 100).toFixed(0)}%</span>
                    <span>{job.distance}mi</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${statusConfig[job.status].gradient} transition-all duration-500`}
                      style={{ width: `${(job.completedDistance / job.distance) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Time Info */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200 text-xs">
                  <span className="text-slate-600">
                    ⏱️ {getTimeElapsed(job.startTime)} elapsed
                  </span>
                  <span className="text-slate-600">
                    🎯 {getTimeRemaining(job.estimatedArrival)} remaining
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Map & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Map */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${job ? statusConfig[job.status].gradient : 'from-slate-400 to-slate-500'} flex items-center justify-center text-white`}>
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Live GPS Tracking</h3>
                  <p className="text-sm text-slate-600">{job?.bookingNumber || 'Select a job'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isLive && (
                  <div className="flex items-center gap-2 bg-green-100 px-3 py-1.5 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-green-700 font-semibold">Live Updates</span>
                  </div>
                )}
                <button className="p-2 hover:bg-white/50 rounded-lg transition-all">
                  <Maximize2 className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Live Map or Simulated Map */}
            <div className="h-[500px]">
              {job && showMap ? (
                <LiveMapTracker
                  pickupLocation={{
                    lat: job.pickup.lat,
                    lng: job.pickup.lng,
                    address: job.pickup.address,
                    postcode: job.pickup.postcode
                  }}
                  deliveryLocation={{
                    lat: job.delivery.lat,
                    lng: job.delivery.lng,
                    address: job.delivery.address,
                    postcode: job.delivery.postcode
                  }}
                  driverLocation={{
                    lat: job.currentLocation.lat,
                    lng: job.currentLocation.lng
                  }}
                  driverHeading={job.driverHeading}
                  driverSpeed={job.driverSpeed}
                  showTraffic={showTraffic}
                />
              ) : (
                // Fallback Simulated Map
                <div className="relative w-full h-full bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500">
                    <defs>
                      <pattern id="liveGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="0.5" opacity="0.3" />
                      </pattern>
                      <linearGradient id="routeLive" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                      </linearGradient>
                    </defs>
                    <rect width="800" height="500" fill="url(#liveGrid)" />

                    {/* Route line */}
                    <path
                      d="M 100 400 Q 300 200, 700 100"
                      stroke="url(#routeLive)"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="15,10"
                      className="animate-pulse"
                    />

                    {/* Pickup Point */}
                    <g>
                      <circle cx="100" cy="400" r="25" fill="#3b82f6" stroke="white" strokeWidth="4" className="drop-shadow-2xl" />
                      <text x="100" y="408" fontSize="18" fill="white" textAnchor="middle" fontWeight="bold">A</text>
                      <text x="100" y="435" fontSize="14" fill="#475569" textAnchor="middle" fontWeight="600">
                        {job?.pickup.postcode || 'Pickup'}
                      </text>
                    </g>

                    {/* Delivery Point */}
                    <g>
                      <circle cx="700" cy="100" r="25" fill="#10b981" stroke="white" strokeWidth="4" className="drop-shadow-2xl" />
                      <text x="700" y="108" fontSize="18" fill="white" textAnchor="middle" fontWeight="bold">B</text>
                      <text x="700" y="135" fontSize="14" fill="#475569" textAnchor="middle" fontWeight="600">
                        {job?.delivery.postcode || 'Delivery'}
                      </text>
                    </g>

                    {/* Moving Driver Marker */}
                    {job && (
                      <g className="animate-pulse">
                        <circle 
                          cx={100 + ((job.completedDistance / job.distance) * 600)} 
                          cy={400 - ((job.completedDistance / job.distance) * 300)}
                          r="30" 
                          fill="#8b5cf6" 
                          stroke="white" 
                          strokeWidth="4" 
                          className="drop-shadow-2xl"
                        />
                        <text 
                          x={100 + ((job.completedDistance / job.distance) * 600)}
                          y={408 - ((job.completedDistance / job.distance) * 300)}
                          fontSize="24" 
                          textAnchor="middle"
                        >
                          🚚
                        </text>
                        <circle 
                          cx={100 + ((job.completedDistance / job.distance) * 600)}
                          cy={400 - ((job.completedDistance / job.distance) * 300)}
                          r="50" 
                          fill="none" 
                          stroke="#8b5cf6" 
                          strokeWidth="3" 
                          opacity="0.3"
                          className="animate-ping"
                        />
                      </g>
                    )}
                  </svg>

                  {/* Map Info Overlay */}
                  {job && (
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-4 border-2 border-slate-200">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Navigation className="w-5 h-5 text-purple-600" />
                          <span className="text-sm font-bold text-slate-900">
                            {job.completedDistance.toFixed(1)}mi / {job.distance}mi
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-orange-600" />
                          <span className="text-sm font-bold text-slate-900">ETA: {job.eta}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-bold text-slate-900">{Math.round(job.driverSpeed)} mph</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Last Update Badge */}
                  {job && (
                    <div className="absolute top-4 right-4 bg-purple-600/95 backdrop-blur-md rounded-xl shadow-xl px-4 py-2 border-2 border-purple-400">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-white" />
                        <span className="text-xs font-bold text-white">
                          Updated {Math.floor((Date.now() - job.lastUpdate.getTime()) / 1000)}s ago
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Job Details Cards */}
          {job && (
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Driver Info */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-slate-200">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-purple-600" />
                  Driver Information
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
                      {job.driver.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">{job.driver.name}</div>
                      <div className="text-sm text-slate-600">{job.driver.vehicle}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-600">Rating</div>
                      <div className="font-bold text-yellow-600">⭐ {job.driver.rating}</div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Phone className="w-4 h-4 text-blue-600" />
                      {job.driver.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Zap className="w-4 h-4 text-green-600" />
                      Speed: {Math.round(job.driverSpeed)} mph
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Navigation className="w-4 h-4 text-purple-600" />
                      Heading: {Math.round(job.driverHeading)}°
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center justify-center gap-2 text-sm font-semibold">
                      <Phone className="w-4 h-4" />
                      Call
                    </button>
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all flex items-center justify-center gap-2 text-sm font-semibold">
                      <MessageSquare className="w-4 h-4" />
                      Message
                    </button>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-slate-200">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Customer Information
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold text-lg">
                      {job.customer.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">{job.customer.name}</div>
                      <div className="text-sm text-slate-600">{job.bookingNumber}</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Phone className="w-4 h-4 text-blue-600" />
                      {job.customer.phone}
                    </div>
                    {job.customer.email && (
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Mail className="w-4 h-4 text-purple-600" />
                        {job.customer.email}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <Package className="w-4 h-4 text-green-600" />
                      Value: £{job.value}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all flex items-center justify-center gap-2 text-sm font-semibold">
                      <Phone className="w-4 h-4" />
                      Call
                    </button>
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all flex items-center justify-center gap-2 text-sm font-semibold">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
