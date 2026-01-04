import React, { useState, useEffect } from 'react';
import { FileCheck, User, Clock, Search, Filter, Download } from 'lucide-react';
import { auditLogger, AuditLogEntry } from '../../utils/auditLogger';

export function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    setLogs(auditLogger.getLogs());
  }, []);

  const getActionColor = (type: string) => {
    switch (type) {
      case 'create': return 'bg-green-100 text-green-700';
      case 'update': return 'bg-blue-100 text-blue-700';
      case 'delete': return 'bg-red-100 text-red-700';
      case 'approve': return 'bg-purple-100 text-purple-700';
      case 'refund': return 'bg-red-100 text-red-700 border border-red-200';
      case 'financial': return 'bg-yellow-100 text-yellow-700';
      case 'export': return 'bg-orange-100 text-orange-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const filteredLogs = logs.filter(log => 
    log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.jobId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Audit Logs</h1>
          <p className="text-slate-600 mt-1">Track all system activities and changes</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Logs
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search logs by user, action, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-all flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Timestamp</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">User</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Action</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Type</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    {auditLogger.formatDate(log.timestamp)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-900 font-medium">{log.user}</span>
                    <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded capitalize">{log.role.replace('_', ' ')}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <p className="text-slate-900 font-medium">{log.action}</p>
                   {log.details && <p className="text-xs text-slate-500 mt-0.5">{log.details}</p>}
                   {log.jobId && <span className="inline-block mt-1 text-xs font-mono bg-slate-100 px-1 rounded text-slate-600">Ref: {log.jobId}</span>}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${getActionColor(log.type)}`}>
                    {log.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-sm text-slate-600">{log.ip}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
