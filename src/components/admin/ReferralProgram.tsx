import React from 'react';
import { Gift, Users, DollarSign, TrendingUp, Share2 } from 'lucide-react';

export function ReferralProgram() {
  const referrals = [
    { id: 1, referrer: 'John Smith', referee: 'Mike Johnson', status: 'completed', reward: 50, date: '2024-12-20' },
    { id: 2, referrer: 'Sarah Williams', referee: 'Emily Davis', status: 'pending', reward: 50, date: '2024-12-19' },
    { id: 3, referrer: 'John Smith', referee: 'David Brown', status: 'completed', reward: 50, date: '2024-12-15' }
  ];

  const stats = {
    totalReferrals: referrals.length,
    successful: referrals.filter(r => r.status === 'completed').length,
    totalRewards: referrals.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.reward, 0),
    topReferrer: 'John Smith'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Referral Program</h1>
          <p className="text-slate-600 mt-1">Track customer referrals and rewards</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
          Configure Settings
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Referrals</p>
              <p className="text-3xl font-bold mt-1">{stats.totalReferrals}</p>
            </div>
            <Users className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Successful</p>
              <p className="text-3xl font-bold mt-1">{stats.successful}</p>
            </div>
            <TrendingUp className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Rewards</p>
              <p className="text-3xl font-bold mt-1">£{stats.totalRewards}</p>
            </div>
            <DollarSign className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Top Referrer</p>
              <p className="text-lg font-bold mt-1">{stats.topReferrer}</p>
            </div>
            <Gift className="w-12 h-12 opacity-80" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Referrer</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Referee</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Reward</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Date</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {referrals.map((ref) => (
              <tr key={ref.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-900">{ref.referrer}</td>
                <td className="px-6 py-4 text-slate-900">{ref.referee}</td>
                <td className="px-6 py-4 font-semibold text-green-600">£{ref.reward}</td>
                <td className="px-6 py-4 text-slate-600">{ref.date}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    ref.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {ref.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
