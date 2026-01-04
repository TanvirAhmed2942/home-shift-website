import React from 'react';
import { BookOpen, Video, FileText, Award, Download, Play } from 'lucide-react';

export function TrainingDocumentation() {
  const materials = [
    { id: 1, title: 'Driver Safety Training', type: 'video', duration: '45 min', completed: 12, total: 15, category: 'Safety' },
    { id: 2, title: 'Customer Service Guidelines', type: 'document', duration: '15 min', completed: 15, total: 15, category: 'Service' },
    { id: 3, title: 'Vehicle Inspection Checklist', type: 'document', duration: '10 min', completed: 14, total: 15, category: 'Operations' },
    { id: 4, title: 'Emergency Procedures', type: 'video', duration: '30 min', completed: 10, total: 15, category: 'Safety' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Training & Documentation</h1>
          <p className="text-slate-600 mt-1">Manage training materials and SOPs</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
          Upload New Material
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Materials</p>
              <p className="text-3xl font-bold mt-1">{materials.length}</p>
            </div>
            <BookOpen className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Video Tutorials</p>
              <p className="text-3xl font-bold mt-1">{materials.filter(m => m.type === 'video').length}</p>
            </div>
            <Video className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Documents</p>
              <p className="text-3xl font-bold mt-1">{materials.filter(m => m.type === 'document').length}</p>
            </div>
            <FileText className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Completion Rate</p>
              <p className="text-3xl font-bold mt-1">83%</p>
            </div>
            <Award className="w-12 h-12 opacity-80" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Title</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Type</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Category</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Duration</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Completion</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {materials.map((material) => (
              <tr key={material.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-900">{material.title}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {material.type === 'video' ? (
                      <Video className="w-4 h-4 text-purple-600" />
                    ) : (
                      <FileText className="w-4 h-4 text-blue-600" />
                    )}
                    <span className="text-slate-900 capitalize">{material.type}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {material.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{material.duration}</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{material.completed} / {material.total}</span>
                      <span className="text-slate-900 font-semibold">{((material.completed / material.total) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                        style={{ width: `${(material.completed / material.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {material.type === 'video' ? (
                      <button className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors">
                        <Play className="w-4 h-4" />
                      </button>
                    ) : (
                      <button className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    )}
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
