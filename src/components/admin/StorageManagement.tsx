import React from 'react';
import { Warehouse, Package, DollarSign, Users, Plus } from 'lucide-react';

export function StorageManagement() {
  const units = [
    { id: 'U-001', customer: 'John Smith', size: '10m³', monthlyFee: 150, occupiedSince: '2024-10-01', status: 'occupied', items: 'Household furniture' },
    { id: 'U-002', customer: 'Sarah Williams', size: '15m³', monthlyFee: 200, occupiedSince: '2024-11-15', status: 'occupied', items: 'Office equipment' },
    { id: 'U-003', customer: null, size: '20m³', monthlyFee: 250, occupiedSince: null, status: 'available', items: null },
    { id: 'U-004', customer: 'Mike Johnson', size: '8m³', monthlyFee: 120, occupiedSince: '2024-09-20', status: 'occupied', items: 'Personal belongings' }
  ];

  const stats = {
    total: units.length,
    occupied: units.filter(u => u.status === 'occupied').length,
    available: units.filter(u => u.status === 'available').length,
    monthlyRevenue: units.filter(u => u.status === 'occupied').reduce((sum, u) => sum + u.monthlyFee, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Storage Management</h1>
          <p className="text-slate-600 mt-1">Manage storage units and contracts</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Storage Unit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Units</p>
              <p className="text-3xl font-bold mt-1">{stats.total}</p>
            </div>
            <Warehouse className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Occupied</p>
              <p className="text-3xl font-bold mt-1">{stats.occupied}</p>
            </div>
            <Package className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Available</p>
              <p className="text-3xl font-bold mt-1">{stats.available}</p>
            </div>
            <Users className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Monthly Revenue</p>
              <p className="text-3xl font-bold mt-1">£{stats.monthlyRevenue}</p>
            </div>
            <DollarSign className="w-12 h-12 opacity-80" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Unit ID</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Customer</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Size</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Monthly Fee</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Occupied Since</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {units.map((unit) => (
              <tr key={unit.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-sm text-slate-900">{unit.id}</td>
                <td className="px-6 py-4 text-slate-900">{unit.customer || '-'}</td>
                <td className="px-6 py-4 text-slate-900">{unit.size}</td>
                <td className="px-6 py-4 font-semibold text-green-600">£{unit.monthlyFee}</td>
                <td className="px-6 py-4 text-slate-600">{unit.occupiedSince || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    unit.status === 'occupied' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {unit.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-sm font-medium">
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
