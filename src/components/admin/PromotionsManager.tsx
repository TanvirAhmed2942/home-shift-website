import React, { useState } from 'react';
import { Tag, Plus, Edit, Trash2, Copy, TrendingUp, Users, DollarSign, Calendar, Percent, Package } from 'lucide-react';

interface Promotion {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
  validFrom: string;
  validTo: string;
  usageLimit: number;
  usageCount: number;
  minOrderValue: number;
  status: 'active' | 'inactive' | 'expired';
  serviceTypes: string[];
}

export function PromotionsManager() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const promotions: Promotion[] = [
    {
      id: 'P-001',
      code: 'WELCOME20',
      type: 'percentage',
      value: 20,
      description: 'Welcome discount for new customers',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      usageLimit: 1000,
      usageCount: 234,
      minOrderValue: 100,
      status: 'active',
      serviceTypes: ['house_removal', 'office_move']
    },
    {
      id: 'P-002',
      code: 'SUMMER50',
      type: 'fixed',
      value: 50,
      description: 'Summer special - £50 off',
      validFrom: '2024-06-01',
      validTo: '2024-08-31',
      usageLimit: 500,
      usageCount: 125,
      minOrderValue: 200,
      status: 'active',
      serviceTypes: ['house_removal']
    },
    {
      id: 'P-003',
      code: 'XMAS2023',
      type: 'percentage',
      value: 15,
      description: 'Christmas promotion',
      validFrom: '2023-12-01',
      validTo: '2023-12-31',
      usageLimit: 300,
      usageCount: 300,
      minOrderValue: 150,
      status: 'expired',
      serviceTypes: ['house_removal', 'office_move', 'storage']
    },
    {
      id: 'P-004',
      code: 'STUDENT10',
      type: 'percentage',
      value: 10,
      description: 'Student discount',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      usageLimit: 2000,
      usageCount: 567,
      minOrderValue: 50,
      status: 'active',
      serviceTypes: ['house_removal']
    }
  ];

  const stats = {
    totalPromotions: promotions.length,
    active: promotions.filter(p => p.status === 'active').length,
    totalRedemptions: promotions.reduce((sum, p) => sum + p.usageCount, 0),
    estimatedSavings: 4250
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Promotions & Coupons</h1>
          <p className="text-slate-600 mt-1">Manage discount codes and promotional offers</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Promotion
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Promotions</p>
              <p className="text-3xl font-bold mt-1">{stats.totalPromotions}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Tag className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Codes</p>
              <p className="text-3xl font-bold mt-1">{stats.active}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Redemptions</p>
              <p className="text-3xl font-bold mt-1">{stats.totalRedemptions}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Customer Savings</p>
              <p className="text-3xl font-bold mt-1">£{stats.estimatedSavings}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Promotions Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Code</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Discount</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Description</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Valid Period</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Usage</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Min. Order</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {promotions.map((promo) => (
                <tr key={promo.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white">
                        <Tag className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-mono font-bold text-slate-900">{promo.code}</span>
                        <p className="text-xs text-slate-500">{promo.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {promo.type === 'percentage' ? (
                        <Percent className="w-4 h-4 text-blue-600" />
                      ) : (
                        <DollarSign className="w-4 h-4 text-green-600" />
                      )}
                      <span className="font-semibold text-slate-900">
                        {promo.type === 'percentage' ? `${promo.value}%` : `£${promo.value}`}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600">{promo.description}</p>
                    <div className="flex gap-1 mt-1">
                      {promo.serviceTypes.slice(0, 2).map(type => (
                        <span key={type} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {type.replace('_', ' ')}
                        </span>
                      ))}
                      {promo.serviceTypes.length > 2 && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                          +{promo.serviceTypes.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <div>
                        <div>{promo.validFrom}</div>
                        <div className="text-xs text-slate-500">to {promo.validTo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">{promo.usageCount} / {promo.usageLimit}</span>
                      </div>
                      <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
                          style={{ width: `${(promo.usageCount / promo.usageLimit) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-900">£{promo.minOrderValue}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      promo.status === 'active' ? 'bg-green-100 text-green-700' :
                      promo.status === 'expired' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {promo.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
