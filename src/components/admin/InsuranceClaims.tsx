import React from 'react';
import { Shield, DollarSign, FileText, Clock, CheckCircle } from 'lucide-react';

export function InsuranceClaims() {
  const claims = [
    { id: 'IC-001', jobId: 'J-12345', customer: 'Robert Taylor', amount: 1200, status: 'approved', date: '2024-12-15', description: 'Damaged antique furniture' },
    { id: 'IC-002', jobId: 'J-12346', customer: 'Lisa Brown', amount: 850, status: 'pending', date: '2024-12-18', description: 'Lost electronics box' },
    { id: 'IC-003', jobId: 'J-12347', customer: 'Mark Wilson', amount: 450, status: 'processing', date: '2024-12-19', description: 'Scratched hardwood table' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Insurance Claims</h1>
          <p className="text-slate-600 mt-1">Manage insurance claims and payouts</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
          File New Claim
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Claims</p>
              <p className="text-3xl font-bold mt-1">{claims.length}</p>
            </div>
            <Shield className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pending</p>
              <p className="text-3xl font-bold mt-1">{claims.filter(c => c.status === 'pending').length}</p>
            </div>
            <Clock className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Amount</p>
              <p className="text-3xl font-bold mt-1">£{claims.reduce((sum, c) => sum + c.amount, 0)}</p>
            </div>
            <DollarSign className="w-12 h-12 opacity-80" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Claim ID</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Job</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Customer</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Description</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Amount</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Date</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {claims.map((claim) => (
              <tr key={claim.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-sm text-slate-900">{claim.id}</td>
                <td className="px-6 py-4 font-mono text-sm text-slate-600">{claim.jobId}</td>
                <td className="px-6 py-4 text-slate-900">{claim.customer}</td>
                <td className="px-6 py-4 text-slate-600">{claim.description}</td>
                <td className="px-6 py-4 font-semibold text-slate-900">£{claim.amount}</td>
                <td className="px-6 py-4 text-slate-600">{claim.date}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    claim.status === 'approved' ? 'bg-green-100 text-green-700' :
                    claim.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {claim.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-sm font-medium">
                    Review
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
