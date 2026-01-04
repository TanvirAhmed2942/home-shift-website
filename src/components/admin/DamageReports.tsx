import React from 'react';
import { AlertTriangle, Camera, FileText, CheckCircle } from 'lucide-react';

export function DamageReports() {
  const reports = [
    { id: 'DR-001', jobId: 'J-12345', item: 'Antique Chair', severity: 'high', reported: '2024-12-20', photos: 3, status: 'investigating' },
    { id: 'DR-002', jobId: 'J-12346', item: 'Coffee Table', severity: 'medium', reported: '2024-12-19', photos: 2, status: 'resolved' },
    { id: 'DR-003', jobId: 'J-12347', item: 'TV Screen', severity: 'high', reported: '2024-12-18', photos: 4, status: 'pending' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Damage Reports</h1>
          <p className="text-slate-600 mt-1">Track and manage damage reports</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Report ID</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Job</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Damaged Item</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Severity</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Evidence</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-sm text-slate-900">{report.id}</td>
                <td className="px-6 py-4 font-mono text-sm text-slate-600">{report.jobId}</td>
                <td className="px-6 py-4 text-slate-900">{report.item}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    report.severity === 'high' ? 'bg-red-100 text-red-700' :
                    report.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {report.severity}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-slate-900">{report.photos} photos</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    report.status === 'resolved' ? 'bg-green-100 text-green-700' :
                    report.status === 'investigating' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-sm font-medium">
                    View Details
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
