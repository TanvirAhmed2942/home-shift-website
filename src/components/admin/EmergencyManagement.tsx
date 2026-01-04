import React from 'react';
import { Siren, Phone, AlertTriangle, MapPin, Clock, Plus } from 'lucide-react';

export function EmergencyManagement() {
  const emergencies = [
    { id: 'EM-001', type: 'accident', driver: 'Mike Johnson', location: '123 Main St, London', time: '2024-12-20 14:30', status: 'active', severity: 'high' },
    { id: 'EM-002', type: 'vehicle_breakdown', driver: 'David Brown', location: '456 Oak Ave, Manchester', time: '2024-12-19 11:20', status: 'resolved', severity: 'medium' },
    { id: 'EM-003', type: 'medical', driver: 'James Wilson', location: '789 Park Rd, Birmingham', time: '2024-12-18 16:45', status: 'resolved', severity: 'high' }
  ];

  const contacts = [
    { name: 'Emergency Services', number: '999', type: 'emergency' },
    { name: 'Road Assistance', number: '0800 123 4567', type: 'support' },
    { name: 'Insurance Hotline', number: '0800 765 4321', type: 'insurance' },
    { name: 'Operations Manager', number: '07700 900 123', type: 'internal' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Emergency Management</h1>
          <p className="text-slate-600 mt-1">Handle emergency situations and incidents</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Report Emergency
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Active Emergencies</p>
              <p className="text-3xl font-bold mt-1">{emergencies.filter(e => e.status === 'active').length}</p>
            </div>
            <Siren className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Total Incidents</p>
              <p className="text-3xl font-bold mt-1">{emergencies.length}</p>
            </div>
            <AlertTriangle className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Resolved</p>
              <p className="text-3xl font-bold mt-1">{emergencies.filter(e => e.status === 'resolved').length}</p>
            </div>
            <AlertTriangle className="w-12 h-12 opacity-80" />
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Emergency Contacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((contact, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{contact.name}</h3>
                  <p className="text-sm text-slate-600 mt-1">{contact.type}</p>
                </div>
                <a 
                  href={`tel:${contact.number}`}
                  className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  {contact.number}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Incidents */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Recent Incidents</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Incident ID</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Type</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Driver</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Location</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Time</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Severity</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {emergencies.map((emergency) => (
              <tr key={emergency.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-sm text-slate-900">{emergency.id}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full capitalize">
                    {emergency.type.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-900">{emergency.driver}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4" />
                    {emergency.location}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4" />
                    {emergency.time}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                    emergency.severity === 'high' ? 'bg-red-100 text-red-700' :
                    emergency.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {emergency.severity}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                    emergency.status === 'active' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {emergency.status}
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
