import React from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Package, Award } from 'lucide-react';

export function PerformanceAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Performance Analytics</h1>
          <p className="text-slate-600 mt-1">Advanced metrics and performance insights</p>
        </div>
        <select className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 3 Months</option>
          <option>Last Year</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm">Conversion Rate</p>
              <p className="text-3xl font-bold mt-1">68.5%</p>
            </div>
            <TrendingUp className="w-12 h-12 opacity-80" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-200">↑ 12%</span>
            <span className="text-blue-100">vs last period</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-green-100 text-sm">Customer Lifetime Value</p>
              <p className="text-3xl font-bold mt-1">£1,245</p>
            </div>
            <DollarSign className="w-12 h-12 opacity-80" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-200">↑ 8%</span>
            <span className="text-green-100">vs last period</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-purple-100 text-sm">Customer Retention</p>
              <p className="text-3xl font-bold mt-1">87%</p>
            </div>
            <Users className="w-12 h-12 opacity-80" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-200">↑ 5%</span>
            <span className="text-purple-100">vs last period</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-orange-100 text-sm">Avg. Job Value</p>
              <p className="text-3xl font-bold mt-1">£485</p>
            </div>
            <Package className="w-12 h-12 opacity-80" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-200">↑ 15%</span>
            <span className="text-orange-100">vs last period</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-yellow-100 text-sm">Driver Efficiency</p>
              <p className="text-3xl font-bold mt-1">92%</p>
            </div>
            <Award className="w-12 h-12 opacity-80" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-200">↑ 3%</span>
            <span className="text-yellow-100">vs last period</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-indigo-100 text-sm">Revenue Growth</p>
              <p className="text-3xl font-bold mt-1">+24%</p>
            </div>
            <BarChart3 className="w-12 h-12 opacity-80" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-200">↑ 18%</span>
            <span className="text-indigo-100">vs last period</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Revenue Trend</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[65, 75, 85, 70, 90, 95, 100].map((height, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-blue-600 to-indigo-600 rounded-t-lg" style={{ height: `${height}%` }} />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm text-slate-600">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Booking Sources</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-600">Website</span>
                <span className="text-sm font-semibold text-slate-900">45%</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600" style={{ width: '45%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-600">Phone</span>
                <span className="text-sm font-semibold text-slate-900">30%</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: '30%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-600">Referral</span>
                <span className="text-sm font-semibold text-slate-900">15%</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: '15%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-600">Social Media</span>
                <span className="text-sm font-semibold text-slate-900">10%</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-red-500" style={{ width: '10%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
