import React from 'react';
import { Navigation, MapPin, Clock, TrendingUp, Zap } from 'lucide-react';

export function RouteOptimization() {
  const routes = [
    { id: 1, driver: 'Mike Johnson', jobs: 3, distance: '45 miles', estimatedTime: '4.5 hours', fuelCost: 18, optimized: true },
    { id: 2, driver: 'David Brown', jobs: 2, distance: '30 miles', estimatedTime: '3 hours', fuelCost: 12, optimized: true },
    { id: 3, driver: 'James Wilson', jobs: 4, distance: '60 miles', estimatedTime: '5.5 hours', fuelCost: 24, optimized: false }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Route Optimization</h1>
          <p className="text-slate-600 mt-1">Optimize driver routes for efficiency</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Optimize All Routes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Active Routes</p>
              <p className="text-3xl font-bold mt-1">{routes.length}</p>
            </div>
            <Navigation className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Optimized</p>
              <p className="text-3xl font-bold mt-1">{routes.filter(r => r.optimized).length}</p>
            </div>
            <TrendingUp className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Distance</p>
              <p className="text-3xl font-bold mt-1">{routes.reduce((sum, r) => sum + parseInt(r.distance), 0)} mi</p>
            </div>
            <MapPin className="w-12 h-12 opacity-80" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Driver</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Jobs</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Distance</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Est. Time</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Fuel Cost</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {routes.map((route) => (
              <tr key={route.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-900">{route.driver}</td>
                <td className="px-6 py-4 text-slate-900">{route.jobs} jobs</td>
                <td className="px-6 py-4 text-slate-900">{route.distance}</td>
                <td className="px-6 py-4 text-slate-600">{route.estimatedTime}</td>
                <td className="px-6 py-4 text-slate-900">£{route.fuelCost}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    route.optimized ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {route.optimized ? 'Optimized' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-sm font-medium">
                    View Route
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
