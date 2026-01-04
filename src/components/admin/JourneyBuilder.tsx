import React, { useState, useEffect } from 'react';
import { MapPin, Plus, X, Navigation, Clock, Ruler, DollarSign, Truck, Package, Zap, AlertCircle, Check, ChevronDown, ChevronUp, Save, Send } from 'lucide-react';

interface Waypoint {
  id: string;
  address: string;
  postcode: string;
  type: 'pickup' | 'delivery';
  floor: string;
  hasLift: boolean;
  lat?: number;
  lng?: number;
}

export function JourneyBuilder() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([
    {
      id: '1',
      address: '',
      postcode: '',
      type: 'pickup',
      floor: 'ground',
      hasLift: false,
    },
    {
      id: '2',
      address: '',
      postcode: '',
      type: 'delivery',
      floor: 'ground',
      hasLift: false,
    },
  ]);

  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [vehicleType, setVehicleType] = useState('small-van');
  const [serviceType, setServiceType] = useState('house-move');
  const [helpers, setHelpers] = useState(1);
  const [totalDistance, setTotalDistance] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Simulate route calculation
  useEffect(() => {
    const validWaypoints = waypoints.filter(w => w.postcode.length > 3);
    if (validWaypoints.length >= 2) {
      // Simulate distance calculation
      const distance = Math.floor(Math.random() * 80) + 20;
      setTotalDistance(distance);
      setEstimatedTime(Math.floor(distance * 1.8 + 30));
      
      // Calculate price
      calculatePrice(distance);
    }
  }, [waypoints, vehicleType, serviceType, helpers]);

  const calculatePrice = (distance: number) => {
    let basePrice = 0;
    
    // Vehicle type pricing
    const vehiclePricing: { [key: string]: number } = {
      'small-van': 45,
      'medium-van': 65,
      'large-van': 85,
      'luton-van': 110,
    };
    
    basePrice = vehiclePricing[vehicleType] || 45;
    
    // Distance pricing (per mile after first 10 miles)
    const extraMiles = Math.max(0, distance - 10);
    const distancePrice = extraMiles * 2.5;
    
    // Helper pricing
    const helpersPrice = (helpers - 1) * 25;
    
    // Floor pricing (stairs)
    const floorPrice = waypoints.reduce((sum, w) => {
      if (w.floor !== 'ground' && !w.hasLift) {
        return sum + (parseInt(w.floor) || 1) * 10;
      }
      return sum;
    }, 0);
    
    const total = basePrice + distancePrice + helpersPrice + floorPrice;
    setCalculatedPrice(total);
  };

  const addWaypoint = () => {
    const newWaypoint: Waypoint = {
      id: Date.now().toString(),
      address: '',
      postcode: '',
      type: 'delivery',
      floor: 'ground',
      hasLift: false,
    };
    setWaypoints([...waypoints, newWaypoint]);
  };

  const removeWaypoint = (id: string) => {
    if (waypoints.length > 2) {
      setWaypoints(waypoints.filter(w => w.id !== id));
    }
  };

  const updateWaypoint = (id: string, field: string, value: any) => {
    setWaypoints(waypoints.map(w => 
      w.id === id ? { ...w, [field]: value } : w
    ));
  };

  const moveWaypoint = (id: string, direction: 'up' | 'down') => {
    const index = waypoints.findIndex(w => w.id === id);
    if (
      (direction === 'up' && index > 0) ||
      (direction === 'down' && index < waypoints.length - 1)
    ) {
      const newWaypoints = [...waypoints];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newWaypoints[index], newWaypoints[targetIndex]] = [newWaypoints[targetIndex], newWaypoints[index]];
      setWaypoints(newWaypoints);
    }
  };

  const vehicleTypes = [
    { id: 'small-van', name: 'Small Van', capacity: '250 cu ft', price: '£45' },
    { id: 'medium-van', name: 'Medium Van (SWB)', capacity: '380 cu ft', price: '£65' },
    { id: 'large-van', name: 'Large Van (LWB)', capacity: '500 cu ft', price: '£85' },
    { id: 'luton-van', name: 'Luton Van', capacity: '650 cu ft', price: '£110' },
  ];

  const serviceTypes = [
    { id: 'house-move', name: 'House Move', icon: '🏠' },
    { id: 'furniture-delivery', name: 'Furniture Delivery', icon: '🛋️' },
    { id: 'clearance', name: 'Clearance & Removal', icon: '🗑️' },
    { id: 'office-move', name: 'Office Move', icon: '💼' },
  ];

  const handleCreateBooking = () => {
    const validWaypoints = waypoints.filter(w => w.postcode.length > 3);
    if (validWaypoints.length >= 2) {
      setShowSuccessModal(true);
      // In production, this would send data to backend
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    } else {
      alert('Please add at least 2 valid postcodes to create a booking');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Journey Builder</h2>
          <p className="text-slate-600 mt-1">Plan routes, calculate prices, and optimize deliveries</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all">
            <Save className="w-5 h-5" />
            Save Draft
          </button>
          <button
            onClick={handleCreateBooking}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <Send className="w-5 h-5" />
            Create Booking
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Panel - Journey Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Type Selection */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Service Type
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {serviceTypes.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setServiceType(service.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    serviceType === service.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{service.icon}</div>
                  <div className="text-sm font-semibold">{service.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Selection */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              Vehicle Type
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {vehicleTypes.map((vehicle) => (
                <button
                  key={vehicle.id}
                  onClick={() => setVehicleType(vehicle.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    vehicleType === vehicle.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-bold text-slate-900">{vehicle.name}</div>
                    <div className="text-blue-600 font-bold">{vehicle.price}</div>
                  </div>
                  <div className="text-sm text-slate-600">Capacity: {vehicle.capacity}</div>
                </button>
              ))}
            </div>

            {/* Number of Helpers */}
            <div className="mt-6 p-4 bg-slate-50 rounded-xl">
              <label className="block text-sm font-semibold text-slate-900 mb-3">Number of Helpers</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setHelpers(Math.max(1, helpers - 1))}
                  className="w-10 h-10 rounded-lg bg-white border-2 border-slate-300 hover:border-blue-500 transition-all"
                >
                  <span className="text-xl">−</span>
                </button>
                <div className="flex-1 text-center">
                  <div className="text-2xl font-bold text-blue-600">{helpers}</div>
                  <div className="text-xs text-slate-600">
                    {helpers === 1 ? '1 Helper' : `${helpers} Helpers`}
                  </div>
                </div>
                <button
                  onClick={() => setHelpers(Math.min(4, helpers + 1))}
                  className="w-10 h-10 rounded-lg bg-white border-2 border-slate-300 hover:border-blue-500 transition-all"
                >
                  <span className="text-xl">+</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">
                £25 per additional helper
              </p>
            </div>
          </div>

          {/* Waypoints */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Stops & Waypoints ({waypoints.length})
              </h3>
              <button
                onClick={addWaypoint}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Stop
              </button>
            </div>

            <div className="space-y-4">
              {waypoints.map((waypoint, index) => (
                <div
                  key={waypoint.id}
                  className={`relative p-4 rounded-xl border-2 ${
                    waypoint.type === 'pickup'
                      ? 'border-blue-200 bg-blue-50/50'
                      : 'border-green-200 bg-green-50/50'
                  }`}
                >
                  {/* Waypoint Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          waypoint.type === 'pickup' ? 'bg-blue-600' : 'bg-green-600'
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <select
                        value={waypoint.type}
                        onChange={(e) => updateWaypoint(waypoint.id, 'type', e.target.value)}
                        className="px-3 py-1 rounded-lg border border-slate-300 text-sm font-medium"
                      >
                        <option value="pickup">Pickup</option>
                        <option value="delivery">Delivery</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Move up/down */}
                      {index > 0 && (
                        <button
                          onClick={() => moveWaypoint(waypoint.id, 'up')}
                          className="p-1 hover:bg-white rounded transition-colors"
                        >
                          <ChevronUp className="w-4 h-4 text-slate-600" />
                        </button>
                      )}
                      {index < waypoints.length - 1 && (
                        <button
                          onClick={() => moveWaypoint(waypoint.id, 'down')}
                          className="p-1 hover:bg-white rounded transition-colors"
                        >
                          <ChevronDown className="w-4 h-4 text-slate-600" />
                        </button>
                      )}
                      {waypoints.length > 2 && (
                        <button
                          onClick={() => removeWaypoint(waypoint.id)}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Address Inputs */}
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Full Address *"
                      value={waypoint.address}
                      onChange={(e) => updateWaypoint(waypoint.id, 'address', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Postcode *"
                        value={waypoint.postcode}
                        onChange={(e) => updateWaypoint(waypoint.id, 'postcode', e.target.value.toUpperCase())}
                        className="px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      />
                      <select
                        value={waypoint.floor}
                        onChange={(e) => updateWaypoint(waypoint.id, 'floor', e.target.value)}
                        className="px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      >
                        <option value="ground">Ground Floor</option>
                        <option value="1">1st Floor</option>
                        <option value="2">2nd Floor</option>
                        <option value="3">3rd Floor</option>
                        <option value="4">4th Floor</option>
                        <option value="5">5th Floor</option>
                        <option value="6">6th Floor+</option>
                      </select>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={waypoint.hasLift}
                        onChange={(e) => updateWaypoint(waypoint.id, 'hasLift', e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600"
                      />
                      <span className="text-sm text-slate-700">Lift Available</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map Preview */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-blue-600" />
              Route Map
            </h3>
            
            {/* Interactive Map Placeholder */}
            <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50 rounded-xl overflow-hidden border-2 border-slate-200">
              {/* Map SVG Visualization */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400">
                <defs>
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>

                {/* Background grid */}
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="0.5" opacity="0.3" />
                </pattern>
                <rect width="800" height="400" fill="url(#grid)" />

                {/* Route Path */}
                {waypoints.length >= 2 && (
                  <>
                    {/* Curved route line */}
                    <path
                      d={`M 100 300 Q 200 150, 350 200 T 600 150 T 700 100`}
                      stroke="url(#routeGradient)"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="10,5"
                      className="animate-pulse"
                    />

                    {/* Waypoint markers */}
                    {[
                      { x: 100, y: 300, label: 'A', color: '#3b82f6' },
                      { x: 350, y: 200, label: 'B', color: '#06b6d4' },
                      { x: 700, y: 100, label: 'C', color: '#10b981' },
                    ].slice(0, waypoints.length).map((marker, i) => (
                      <g key={i}>
                        {/* Marker circle */}
                        <circle
                          cx={marker.x}
                          cy={marker.y}
                          r="20"
                          fill={marker.color}
                          stroke="white"
                          strokeWidth="3"
                          className="drop-shadow-lg"
                        />
                        {/* Label */}
                        <text
                          x={marker.x}
                          y={marker.y + 6}
                          fontSize="16"
                          fill="white"
                          textAnchor="middle"
                          fontWeight="bold"
                        >
                          {marker.label}
                        </text>
                        {/* Address label */}
                        <text
                          x={marker.x}
                          y={marker.y + 40}
                          fontSize="12"
                          fill="#475569"
                          textAnchor="middle"
                          fontWeight="600"
                        >
                          {waypoints[i]?.postcode || 'Enter postcode'}
                        </text>
                      </g>
                    ))}
                  </>
                )}
              </svg>

              {/* Map Controls */}
              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-2 space-y-2">
                <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded transition-colors">
                  <Plus className="w-4 h-4 text-slate-600" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded transition-colors">
                  <span className="text-slate-600">−</span>
                </button>
              </div>

              {/* Route Info Overlay */}
              {totalDistance > 0 && (
                <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg p-4 border border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-slate-900">{totalDistance} miles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-600" />
                      <span className="text-sm font-semibold text-slate-900">{estimatedTime} mins</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900">Interactive Map Feature</p>
                <p className="text-xs text-amber-700 mt-1">
                  This is a visual representation. In production, integrate Google Maps API or Mapbox for real-time routing and live tracking.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Price Calculator */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Price Summary */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-8 h-8" />
                <h3 className="text-2xl font-bold">Total Price</h3>
              </div>
              <div className="text-5xl font-bold mb-6">
                £{calculatedPrice.toFixed(2)}
              </div>

              <button
                onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                className="w-full bg-white/20 hover:bg-white/30 py-3 rounded-xl transition-all font-medium flex items-center justify-center gap-2"
              >
                {showPriceBreakdown ? 'Hide' : 'Show'} Breakdown
                {showPriceBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showPriceBreakdown && (
                <div className="mt-4 pt-4 border-t border-white/20 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-100">Base Vehicle Rate</span>
                    <span className="font-semibold">£{vehicleTypes.find(v => v.id === vehicleType)?.price}</span>
                  </div>
                  {totalDistance > 10 && (
                    <div className="flex justify-between">
                      <span className="text-blue-100">Distance ({totalDistance - 10} extra miles)</span>
                      <span className="font-semibold">£{((totalDistance - 10) * 2.5).toFixed(2)}</span>
                    </div>
                  )}
                  {helpers > 1 && (
                    <div className="flex justify-between">
                      <span className="text-blue-100">Additional Helpers (x{helpers - 1})</span>
                      <span className="font-semibold">£{(helpers - 1) * 25}</span>
                    </div>
                  )}
                  {waypoints.some(w => w.floor !== 'ground' && !w.hasLift) && (
                    <div className="flex justify-between">
                      <span className="text-blue-100">Floor Access (No Lift)</span>
                      <span className="font-semibold">
                        £{waypoints.reduce((sum, w) => {
                          if (w.floor !== 'ground' && !w.hasLift) {
                            return sum + (parseInt(w.floor) || 1) * 10;
                          }
                          return sum;
                        }, 0)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 space-y-4">
              <h4 className="font-bold text-slate-900 mb-4">Journey Stats</h4>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Ruler className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-600">Total Distance</p>
                  <p className="font-bold text-slate-900">{totalDistance} miles</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-cyan-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-600">Est. Duration</p>
                  <p className="font-bold text-slate-900">{Math.floor(estimatedTime / 60)}h {estimatedTime % 60}m</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-600">Total Stops</p>
                  <p className="font-bold text-slate-900">{waypoints.length} locations</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-600">Route Efficiency</p>
                  <p className="font-bold text-slate-900">Optimized</p>
                </div>
              </div>
            </div>

            {/* Validation Status */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-4">Validation Status</h4>
              <div className="space-y-2">
                {waypoints.filter(w => w.postcode.length > 3).length >= 2 ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-5 h-5" />
                    <span className="text-sm font-medium">Route is valid</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Add at least 2 postcodes</span>
                  </div>
                )}
                
                {vehicleType && (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-5 h-5" />
                    <span className="text-sm font-medium">Vehicle selected</span>
                  </div>
                )}
                
                {serviceType && (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-5 h-5" />
                    <span className="text-sm font-medium">Service type selected</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Booking Created Successfully!</h3>
            <p className="text-slate-600 mb-4">
              Your booking has been created with reference number <strong>SMH-{Math.floor(Math.random() * 9000) + 1000}</strong>
            </p>
            <p className="text-sm text-slate-500">
              Price: <span className="font-bold text-green-600">£{calculatedPrice.toFixed(2)}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}