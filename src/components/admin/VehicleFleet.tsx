import React, { useState } from 'react';
import { Truck, Plus, Edit2, Trash2, Save, X, MapPin, Gauge, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  type: 'small-van' | 'small-van-plus' | 'lwb' | 'luton' | 'luton-xl';
  registration: string;
  status: 'available' | 'in-use' | 'maintenance' | 'offline';
  driver: string | null;
  mileage: number;
  lastService: string;
  nextService: string;
  capacity: string;
  fuelType: 'diesel' | 'petrol' | 'electric' | 'hybrid';
  location: string;
}

export function VehicleFleet() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: '1',
      name: 'Van Alpha',
      type: 'small-van',
      registration: 'AB12 CDE',
      status: 'in-use',
      driver: 'John Smith',
      mileage: 45230,
      lastService: '2024-11-15',
      nextService: '2025-01-15',
      capacity: '6 m³',
      fuelType: 'diesel',
      location: 'Central London'
    },
    {
      id: '2',
      name: 'Van Beta',
      type: 'lwb',
      registration: 'FG34 HIJ',
      status: 'available',
      driver: null,
      mileage: 32100,
      lastService: '2024-12-01',
      nextService: '2025-02-01',
      capacity: '12 m³',
      fuelType: 'diesel',
      location: 'North London'
    },
    {
      id: '3',
      name: 'Van Gamma',
      type: 'luton',
      registration: 'KL56 MNO',
      status: 'in-use',
      driver: 'Mike Johnson',
      mileage: 67890,
      lastService: '2024-11-20',
      nextService: '2025-01-20',
      capacity: '20 m³',
      fuelType: 'diesel',
      location: 'East London'
    },
    {
      id: '4',
      name: 'Van Delta',
      type: 'small-van-plus',
      registration: 'PQ78 RST',
      status: 'maintenance',
      driver: null,
      mileage: 28450,
      lastService: '2024-12-10',
      nextService: '2025-02-10',
      capacity: '8 m³',
      fuelType: 'diesel',
      location: 'Service Center'
    },
    {
      id: '5',
      name: 'Van Epsilon',
      type: 'luton',
      registration: 'UV90 WXY',
      status: 'available',
      driver: null,
      mileage: 19200,
      lastService: '2024-12-05',
      nextService: '2025-02-05',
      capacity: '20 m³',
      fuelType: 'diesel',
      location: 'West London'
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const getStatusColor = (status: Vehicle['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in-use':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'maintenance':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'offline':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getVehicleIcon = (type: Vehicle['type']) => {
    switch (type) {
      case 'small-van':
        return '🚐';
      case 'small-van-plus':
        return '🚙';
      case 'lwb':
        return '🚚';
      case 'luton':
      case 'luton-xl':
        return '🚛';
      default:
        return '🚐';
    }
  };

  const stats = {
    total: vehicles.length,
    available: vehicles.filter((v) => v.status === 'available').length,
    inUse: vehicles.filter((v) => v.status === 'in-use').length,
    maintenance: vehicles.filter((v) => v.status === 'maintenance').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Vehicle Fleet</h2>
          <p className="text-slate-600 mt-1">Manage your fleet of vehicles</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Vehicle
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-600">Total Vehicles</span>
            <Truck className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-600">Available</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600">{stats.available}</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-600">In Use</span>
            <Truck className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-600">{stats.inUse}</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-600">Maintenance</span>
            <AlertCircle className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-orange-600">{stats.maintenance}</div>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all"
          >
            {/* Vehicle Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-slate-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{getVehicleIcon(vehicle.type)}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{vehicle.name}</h3>
                    <p className="text-sm text-slate-600">{vehicle.registration}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingId(vehicle.id)}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-blue-600" />
                  </button>
                  <button className="p-2 hover:bg-white rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              <div
                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                  vehicle.status
                )}`}
              >
                {vehicle.status.toUpperCase()}
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Type:</span>
                <span className="font-semibold text-slate-900 capitalize">{vehicle.type.replace('-', ' ')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Capacity:</span>
                <span className="font-semibold text-blue-600">{vehicle.capacity}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Driver:</span>
                <span className="font-semibold text-slate-900">{vehicle.driver || 'Unassigned'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 flex items-center gap-1">
                  <Gauge className="w-4 h-4" />
                  Mileage:
                </span>
                <span className="font-semibold text-slate-900">{vehicle.mileage.toLocaleString()} mi</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Location:
                </span>
                <span className="font-semibold text-slate-900">{vehicle.location}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Fuel Type:</span>
                <span className="font-semibold text-slate-900 capitalize">{vehicle.fuelType}</span>
              </div>
              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Next Service:</span>
                  <span className="font-semibold text-orange-600">{vehicle.nextService}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <button
                onClick={() => alert(`Viewing details for ${vehicle.name}`)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-all"
              >
                View Full Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Add New Vehicle</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Vehicle Name</label>
                  <input
                    type="text"
                    placeholder="Van Alpha"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Registration</label>
                  <input
                    type="text"
                    placeholder="AB12 CDE"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Vehicle Type</label>
                  <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none">
                    <option value="small-van">Small Van</option>
                    <option value="small-van-plus">Small Van Plus</option>
                    <option value="lwb">LWB</option>
                    <option value="luton">Luton</option>
                    <option value="luton-xl">Luton XL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Fuel Type</label>
                  <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none">
                    <option value="diesel">Diesel</option>
                    <option value="petrol">Petrol</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Current Mileage</label>
                  <input
                    type="number"
                    placeholder="45000"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="Central London"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 px-6 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-xl font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Vehicle added!');
                    setShowAddModal(false);
                  }}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
