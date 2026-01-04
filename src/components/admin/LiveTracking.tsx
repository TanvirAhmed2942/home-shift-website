import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Phone, Clock, Package, User, Truck, CheckCircle, AlertCircle, Play, Pause } from 'lucide-react';

interface ActiveJob {
  id: string;
  bookingNumber: string;
  driver: {
    name: string;
    phone: string;
    vehicle: string;
  };
  customer: {
    name: string;
    phone: string;
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
  eta: string;
  distance: number;
  completedDistance: number;
}

export function LiveTracking() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(true);

  // Mock active jobs with GPS coordinates
  const [activeJobs] = useState<ActiveJob[]>([
    {
      id: '1',
      bookingNumber: 'SMH-1002',
      driver: { name: 'Mike Johnson', phone: '07700 900111', vehicle: 'Large Van - AB12 CDE' },
      customer: { name: 'Emma Wilson', phone: '07700 900456' },
      pickup: { address: 'Birmingham B1 1AA', postcode: 'B1 1AA', lat: 52.4862, lng: -1.8904 },
      delivery: { address: 'Leeds LS1 1AA', postcode: 'LS1 1AA', lat: 53.7997, lng: -1.5492 },
      status: 'in-transit',
      currentLocation: { lat: 53.1424, lng: -1.6724 }, // Somewhere between
      eta: '14:30',
      distance: 120,
      completedDistance: 65,
    },
    {
      id: '2',
      bookingNumber: 'SMH-1003',
      driver: { name: 'Sarah Davis', phone: '07700 900222', vehicle: 'Medium Van - FG34 HIJ' },
      customer: { name: 'David Brown', phone: '07700 900789' },
      pickup: { address: 'London SW1A 1AA', postcode: 'SW1A 1AA', lat: 51.5014, lng: -0.1419 },
      delivery: { address: 'Oxford OX1 1AA', postcode: 'OX1 1AA', lat: 51.7520, lng: -1.2577 },
      status: 'picked-up',
      currentLocation: { lat: 51.5014, lng: -0.1419 },
      eta: '11:45',
      distance: 60,
      completedDistance: 5,
    },
    {
      id: '3',
      bookingNumber: 'SMH-1005',
      driver: { name: 'Tom Wilson', phone: '07700 900333', vehicle: 'Luton Van - KL56 MNO' },
      customer: { name: 'Lisa Anderson', phone: '07700 900321' },
      pickup: { address: 'Bristol BS1 1AA', postcode: 'BS1 1AA', lat: 51.4545, lng: -2.5879 },
      delivery: { address: 'Cardiff CF10 1AA', postcode: 'CF10 1AA', lat: 51.4816, lng: -3.1791 },
      status: 'near-delivery',
      currentLocation: { lat: 51.4780, lng: -3.1500 },
      eta: '10:15',
      distance: 45,
      completedDistance: 42,
    },
  ]);

  const statusConfig = {
    'picked-up': { label: 'Picked Up', color: 'bg-blue-100 text-blue-700', icon: '📦' },
    'in-transit': { label: 'In Transit', color: 'bg-purple-100 text-purple-700', icon: '🚚' },
    'near-delivery': { label: 'Near Delivery', color: 'bg-orange-100 text-orange-700', icon: '📍' },
    'delivered': { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: '✅' },
  };

  const job = selectedJob ? activeJobs.find(j => j.id === selectedJob) : activeJobs[0];

  // Simulate GPS updates
  useEffect(() => {
    if (!isLive || !job) return;

    const interval = setInterval(() => {
      // In production, this would fetch real GPS data from backend
      console.log('Updating GPS location...');
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive, job]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Live Tracking</h2>
          <p className="text-slate-600 mt-1">Real-time GPS tracking of active deliveries</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              isLive
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isLive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isLive ? 'Live Updates ON' : 'Live Updates OFF'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Active Jobs</p>
              <p className="text-2xl font-bold text-blue-900">{activeJobs.length}</p>
            </div>
            <Truck className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700">In Transit</p>
              <p className="text-2xl font-bold text-purple-900">
                {activeJobs.filter(j => j.status === 'in-transit').length}
              </p>
            </div>
            <Navigation className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700">Near Delivery</p>
              <p className="text-2xl font-bold text-orange-900">
                {activeJobs.filter(j => j.status === 'near-delivery').length}
              </p>
            </div>
            <MapPin className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Avg ETA</p>
              <p className="text-2xl font-bold text-green-900">25 min</p>
            </div>
            <Clock className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Jobs List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Active Deliveries</h3>
          <div className="space-y-3">
            {activeJobs.map((job) => (
              <button
                key={job.id}
                onClick={() => setSelectedJob(job.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selectedJob === job.id || (!selectedJob && job.id === activeJobs[0].id)
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-slate-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-bold text-slate-900">{job.bookingNumber}</div>
                    <div className="text-sm text-slate-600">{job.driver.name}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[job.status].color}`}>
                    {statusConfig[job.status].icon} {statusConfig[job.status].label}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="truncate">{job.delivery.postcode}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span>ETA: {job.eta}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>{job.completedDistance}mi</span>
                    <span>{job.distance}mi</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                      style={{ width: `${(job.completedDistance / job.distance) * 100}%` }}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Map & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Map */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-blue-600" />
                Live Map - {job?.bookingNumber}
              </h3>
              {isLive && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm text-green-700 font-medium">Live</span>
                </div>
              )}
            </div>

            {/* Interactive Map */}
            <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400">
                {/* Background grid */}
                <defs>
                  <pattern id="liveGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="0.5" opacity="0.3" />
                  </pattern>
                  <linearGradient id="routeLive" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                <rect width="800" height="400" fill="url(#liveGrid)" />

                {/* Route line */}
                <path
                  d="M 100 300 Q 300 150, 700 100"
                  stroke="url(#routeLive)"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="10,5"
                />

                {/* Pickup Point */}
                <g>
                  <circle cx="100" cy="300" r="20" fill="#3b82f6" stroke="white" strokeWidth="3" className="drop-shadow-lg" />
                  <text x="100" y="306" fontSize="16" fill="white" textAnchor="middle" fontWeight="bold">A</text>
                  <text x="100" y="330" fontSize="12" fill="#475569" textAnchor="middle" fontWeight="600">
                    {job?.pickup.postcode}
                  </text>
                  <text x="100" y="345" fontSize="10" fill="#64748b" textAnchor="middle">Pickup</text>
                </g>

                {/* Delivery Point */}
                <g>
                  <circle cx="700" cy="100" r="20" fill="#10b981" stroke="white" strokeWidth="3" className="drop-shadow-lg" />
                  <text x="700" y="106" fontSize="16" fill="white" textAnchor="middle" fontWeight="bold">B</text>
                  <text x="700" y="130" fontSize="12" fill="#475569" textAnchor="middle" fontWeight="600">
                    {job?.delivery.postcode}
                  </text>
                  <text x="700" y="145" fontSize="10" fill="#64748b" textAnchor="middle">Delivery</text>
                </g>

                {/* Moving Driver Marker */}
                <g className="animate-pulse">
                  <circle 
                    cx={100 + ((job?.completedDistance || 0) / (job?.distance || 1)) * 600} 
                    cy={300 - ((job?.completedDistance || 0) / (job?.distance || 1)) * 200}
                    r="25" 
                    fill="#8b5cf6" 
                    stroke="white" 
                    strokeWidth="3" 
                    className="drop-shadow-2xl"
                  />
                  <text 
                    x={100 + ((job?.completedDistance || 0) / (job?.distance || 1)) * 600}
                    y={305 - ((job?.completedDistance || 0) / (job?.distance || 1)) * 200}
                    fontSize="20" 
                    textAnchor="middle"
                  >
                    🚚
                  </text>
                  <circle 
                    cx={100 + ((job?.completedDistance || 0) / (job?.distance || 1)) * 600}
                    cy={300 - ((job?.completedDistance || 0) / (job?.distance || 1)) * 200}
                    r="40" 
                    fill="none" 
                    stroke="#8b5cf6" 
                    strokeWidth="2" 
                    opacity="0.3"
                    className="animate-ping"
                  />
                </g>
              </svg>

              {/* Map Info Overlay */}
              <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg p-4 border border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-slate-900">
                      {job?.completedDistance}mi / {job?.distance}mi
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-semibold text-slate-900">ETA: {job?.eta}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Details */}
          {job && (
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Driver Info */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-purple-600" />
                  Driver Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                      {job.driver.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{job.driver.name}</div>
                      <div className="text-sm text-slate-600">{job.driver.vehicle}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4" />
                    {job.driver.phone}
                  </div>
                  <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    Call Driver
                  </button>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Customer Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold">
                      {job.customer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{job.customer.name}</div>
                      <div className="text-sm text-slate-600">{job.bookingNumber}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4" />
                    {job.customer.phone}
                  </div>
                  <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    Call Customer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
