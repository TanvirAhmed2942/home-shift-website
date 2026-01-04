import React from 'react';
import { Handshake, Building, DollarSign, TrendingUp, Plus } from 'lucide-react';

export function PartnerProgram() {
  const partners = [
    { id: 1, name: 'ABC Real Estate', type: 'Real Estate', commission: 15, leads: 45, revenue: 12500, status: 'active' },
    { id: 2, name: 'XYZ Property Management', type: 'Property Management', commission: 10, leads: 30, revenue: 8200, status: 'active' },
    { id: 3, name: 'Elite Furniture Store', type: 'Retail', commission: 12, leads: 20, revenue: 5600, status: 'inactive' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Partner Program</h1>
          <p className="text-slate-600 mt-1">Manage business partners and partnerships</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Partner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Partners</p>
              <p className="text-3xl font-bold mt-1">{partners.length}</p>
            </div>
            <Handshake className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Partners</p>
              <p className="text-3xl font-bold mt-1">{partners.filter(p => p.status === 'active').length}</p>
            </div>
            <TrendingUp className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Leads</p>
              <p className="text-3xl font-bold mt-1">{partners.reduce((sum, p) => sum + p.leads, 0)}</p>
            </div>
            <Building className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold mt-1">£{partners.reduce((sum, p) => sum + p.revenue, 0)}</p>
            </div>
            <DollarSign className="w-12 h-12 opacity-80" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Partner Name</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Type</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Commission</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Leads</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Revenue</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {partners.map((partner) => (
              <tr key={partner.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-900">{partner.name}</td>
                <td className="px-6 py-4 text-slate-600">{partner.type}</td>
                <td className="px-6 py-4 text-slate-900">{partner.commission}%</td>
                <td className="px-6 py-4 text-slate-900">{partner.leads}</td>
                <td className="px-6 py-4 font-semibold text-green-600">£{partner.revenue}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    partner.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {partner.status}
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
