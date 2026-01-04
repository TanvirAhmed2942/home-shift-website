import React, { useState } from 'react';
import { AlertTriangle, Clock, CheckCircle, XCircle, FileText, DollarSign, MessageSquare, Camera, User, Calendar, AlertCircle } from 'lucide-react';

interface Dispute {
  id: string;
  jobId: string;
  customerName: string;
  driverName: string;
  type: 'damage' | 'lost_item' | 'service_quality' | 'pricing' | 'other';
  description: string;
  amount: number;
  status: 'open' | 'in_review' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdDate: string;
  evidence: string[];
}

export function DisputeManagement() {
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'open' | 'in_review' | 'resolved' | 'closed'>('all');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const disputes: Dispute[] = [
    {
      id: 'DSP-001',
      jobId: 'J-12345',
      customerName: 'Robert Taylor',
      driverName: 'James Wilson',
      type: 'damage',
      description: 'Antique chair leg was broken during the move. The chair was properly wrapped but driver was careless when unloading.',
      amount: 450,
      status: 'open',
      priority: 'high',
      createdDate: '2024-12-20',
      evidence: ['photo1.jpg', 'photo2.jpg', 'receipt.pdf']
    },
    {
      id: 'DSP-002',
      jobId: 'J-12346',
      customerName: 'Jessica Brown',
      driverName: 'Mike Johnson',
      type: 'lost_item',
      description: 'Box containing kitchen items (dishes, glasses) is missing. Driver claims it was not loaded.',
      amount: 250,
      status: 'in_review',
      priority: 'medium',
      createdDate: '2024-12-19',
      evidence: ['inventory_list.pdf']
    },
    {
      id: 'DSP-003',
      jobId: 'J-12347',
      customerName: 'Mark Davis',
      driverName: 'David Brown',
      type: 'pricing',
      description: 'Final bill was £200 more than the original quote. No explanation was provided for the additional charges.',
      amount: 200,
      status: 'in_review',
      priority: 'medium',
      createdDate: '2024-12-18',
      evidence: ['quote.pdf', 'invoice.pdf']
    },
    {
      id: 'DSP-004',
      jobId: 'J-12348',
      customerName: 'Amanda Wilson',
      driverName: 'Mike Johnson',
      type: 'service_quality',
      description: 'Driver arrived 2 hours late without notice and rushed through the job.',
      amount: 100,
      status: 'resolved',
      priority: 'low',
      createdDate: '2024-12-15',
      evidence: []
    }
  ];

  const filteredDisputes = disputes.filter(dispute => 
    selectedStatus === 'all' || dispute.status === selectedStatus
  );

  const stats = {
    total: disputes.length,
    open: disputes.filter(d => d.status === 'open').length,
    inReview: disputes.filter(d => d.status === 'in_review').length,
    resolved: disputes.filter(d => d.status === 'resolved').length,
    totalAmount: disputes.reduce((sum, d) => sum + d.amount, 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-700';
      case 'in_review': return 'bg-yellow-100 text-yellow-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'damage': return <AlertTriangle className="w-4 h-4" />;
      case 'lost_item': return <FileText className="w-4 h-4" />;
      case 'pricing': return <DollarSign className="w-4 h-4" />;
      case 'service_quality': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Disputes & Claims</h1>
          <p className="text-slate-600 mt-1">Manage customer disputes and damage claims</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
          Create Manual Dispute
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-100 text-sm">Total Disputes</p>
              <p className="text-3xl font-bold mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Open</p>
              <p className="text-3xl font-bold mt-1">{stats.open}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">In Review</p>
              <p className="text-3xl font-bold mt-1">{stats.inReview}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Resolved</p>
              <p className="text-3xl font-bold mt-1">{stats.resolved}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Amount</p>
              <p className="text-3xl font-bold mt-1">£{stats.totalAmount}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex gap-2 flex-wrap">
          {(['all', 'open', 'in_review', 'resolved', 'closed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                selectedStatus === status
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Disputes Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Dispute ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Type</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Customer</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Driver</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Description</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Amount</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Priority</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDisputes.map((dispute) => (
                <tr key={dispute.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-slate-900">{dispute.id}</span>
                    <p className="text-xs text-slate-500 mt-1">Job: {dispute.jobId}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(dispute.type)}
                      <span className="text-sm text-slate-900 capitalize">{dispute.type.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
                        {dispute.customerName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-slate-900">{dispute.customerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                        {dispute.driverName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-slate-900">{dispute.driverName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600 line-clamp-2 max-w-xs">{dispute.description}</p>
                    {dispute.evidence.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Camera className="w-3 h-3 text-blue-600" />
                        <span className="text-xs text-blue-600">{dispute.evidence.length} evidence files</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-900">£{dispute.amount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${getPriorityColor(dispute.priority)}`}>
                      {dispute.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(dispute.status)}`}>
                      {dispute.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-sm font-medium">
                        Review
                      </button>
                      <button className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
                        <MessageSquare className="w-4 h-4" />
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
