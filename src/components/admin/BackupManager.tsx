import React from 'react';
import { Database, Download, Upload, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export function BackupManager() {
  const backups = [
    { id: 1, name: 'Full System Backup', date: '2024-12-20 02:00', size: '2.4 GB', type: 'automatic', status: 'completed' },
    { id: 2, name: 'Database Backup', date: '2024-12-19 02:00', size: '850 MB', type: 'automatic', status: 'completed' },
    { id: 3, name: 'Manual Backup', date: '2024-12-18 15:30', size: '2.1 GB', type: 'manual', status: 'completed' },
    { id: 4, name: 'Full System Backup', date: '2024-12-17 02:00', size: '2.3 GB', type: 'automatic', status: 'completed' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Backup & Data Management</h1>
          <p className="text-slate-600 mt-1">Manage system backups and data exports</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Create Backup Now
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Backups</p>
              <p className="text-3xl font-bold mt-1">{backups.length}</p>
            </div>
            <Database className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Last Backup</p>
              <p className="text-lg font-bold mt-1">Today 2:00 AM</p>
            </div>
            <Clock className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Size</p>
              <p className="text-3xl font-bold mt-1">7.6 GB</p>
            </div>
            <Database className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Next Backup</p>
              <p className="text-lg font-bold mt-1">Tomorrow 2:00 AM</p>
            </div>
            <Clock className="w-12 h-12 opacity-80" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Backup Schedule</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-slate-900">Full System Backup</h3>
              <p className="text-sm text-slate-600">Daily at 2:00 AM</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">Active</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-slate-900">Database Backup</h3>
              <p className="text-sm text-slate-600">Every 6 hours</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">Active</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-slate-900">Media Files Backup</h3>
              <p className="text-sm text-slate-600">Weekly on Sunday</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">Active</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Backup History</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Backup Name</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Date & Time</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Size</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Type</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {backups.map((backup) => (
              <tr key={backup.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-900">{backup.name}</td>
                <td className="px-6 py-4 text-slate-600">{backup.date}</td>
                <td className="px-6 py-4 text-slate-900">{backup.size}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                    backup.type === 'automatic' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {backup.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    <CheckCircle className="w-3 h-3" />
                    {backup.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
