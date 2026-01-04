import React from 'react';
import { Wrench, Package, AlertTriangle, CheckCircle, Plus } from 'lucide-react';

export function EquipmentInventory() {
  const equipment = [
    { id: 1, name: 'Hand Truck', category: 'Moving Tools', quantity: 15, condition: 'good', location: 'Warehouse A', lastMaintenance: '2024-12-01' },
    { id: 2, name: 'Moving Blankets', category: 'Protection', quantity: 50, condition: 'good', location: 'Warehouse A', lastMaintenance: '2024-11-15' },
    { id: 3, name: 'Furniture Dolly', category: 'Moving Tools', quantity: 8, condition: 'fair', location: 'Warehouse B', lastMaintenance: '2024-10-20' },
    { id: 4, name: 'Straps & Ropes', category: 'Securing', quantity: 30, condition: 'good', location: 'Warehouse A', lastMaintenance: '2024-12-10' },
    { id: 5, name: 'Tool Kit', category: 'Tools', quantity: 5, condition: 'poor', location: 'Warehouse B', lastMaintenance: '2024-09-05' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Equipment Inventory</h1>
          <p className="text-slate-600 mt-1">Manage tools and equipment inventory</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Equipment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Items</p>
              <p className="text-3xl font-bold mt-1">{equipment.length}</p>
            </div>
            <Wrench className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Good Condition</p>
              <p className="text-3xl font-bold mt-1">{equipment.filter(e => e.condition === 'good').length}</p>
            </div>
            <CheckCircle className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Fair Condition</p>
              <p className="text-3xl font-bold mt-1">{equipment.filter(e => e.condition === 'fair').length}</p>
            </div>
            <AlertTriangle className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Needs Replacement</p>
              <p className="text-3xl font-bold mt-1">{equipment.filter(e => e.condition === 'poor').length}</p>
            </div>
            <Package className="w-12 h-12 opacity-80" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Equipment</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Category</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Quantity</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Condition</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Location</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Last Maintenance</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {equipment.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-900">{item.name}</td>
                <td className="px-6 py-4 text-slate-600">{item.category}</td>
                <td className="px-6 py-4 text-slate-900">{item.quantity}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                    item.condition === 'good' ? 'bg-green-100 text-green-700' :
                    item.condition === 'fair' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {item.condition}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{item.location}</td>
                <td className="px-6 py-4 text-slate-600">{item.lastMaintenance}</td>
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
