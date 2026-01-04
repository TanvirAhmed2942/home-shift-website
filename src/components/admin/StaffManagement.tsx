import React from 'react';
import { UserCog, Shield, Plus, Edit, Trash2, Check, X } from 'lucide-react';

export function StaffManagement() {
  const staff = [
    { id: 1, name: 'Admin User', email: 'admin@shiftmyhome.com', role: 'Super Admin', status: 'active', lastLogin: '2024-12-20' },
    { id: 2, name: 'John Manager', email: 'john@shiftmyhome.com', role: 'Operations Manager', status: 'active', lastLogin: '2024-12-19' },
    { id: 3, name: 'Sarah Support', email: 'sarah@shiftmyhome.com', role: 'Customer Support', status: 'active', lastLogin: '2024-12-20' },
    { id: 4, name: 'Mike Finance', email: 'mike@shiftmyhome.com', role: 'Finance Manager', status: 'inactive', lastLogin: '2024-12-10' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Staff & Team Management</h1>
          <p className="text-slate-600 mt-1">Manage admin users and permissions</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Staff Member
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Name</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Email</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Role</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Last Login</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staff.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-medium text-slate-900">{member.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{member.email}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-slate-900">{member.role}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{member.lastLogin}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
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
  );
}
