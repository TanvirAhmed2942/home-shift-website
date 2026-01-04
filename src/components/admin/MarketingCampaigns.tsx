import React, { useState } from 'react';
import { Mail, Send, Users, TrendingUp, Eye, MousePointer, Plus, Edit, Copy, Trash2 } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms';
  subject: string;
  status: 'draft' | 'scheduled' | 'sent' | 'active';
  recipients: number;
  sent: number;
  opened: number;
  clicked: number;
  scheduledDate: string;
  createdDate: string;
}

export function MarketingCampaigns() {
  const campaigns: Campaign[] = [
    {
      id: 'C-001',
      name: 'Summer Sale 2024',
      type: 'email',
      subject: 'Save 20% on your next move this summer!',
      status: 'sent',
      recipients: 1500,
      sent: 1500,
      opened: 750,
      clicked: 225,
      scheduledDate: '2024-06-01',
      createdDate: '2024-05-25'
    },
    {
      id: 'C-002',
      name: 'Customer Feedback Request',
      type: 'email',
      subject: 'How was your recent move?',
      status: 'active',
      recipients: 500,
      sent: 500,
      opened: 320,
      clicked: 145,
      scheduledDate: '2024-12-15',
      createdDate: '2024-12-10'
    },
    {
      id: 'C-003',
      name: 'Christmas Special Offer',
      type: 'sms',
      subject: 'Christmas moving deals - Book now!',
      status: 'scheduled',
      recipients: 2000,
      sent: 0,
      opened: 0,
      clicked: 0,
      scheduledDate: '2024-12-24',
      createdDate: '2024-12-18'
    }
  ];

  const stats = {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    totalSent: campaigns.reduce((sum, c) => sum + c.sent, 0),
    avgOpenRate: ((campaigns.reduce((sum, c) => sum + (c.sent > 0 ? (c.opened / c.sent) * 100 : 0), 0) / campaigns.length) || 0).toFixed(1)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Marketing Campaigns</h1>
          <p className="text-slate-600 mt-1">Create and manage email & SMS campaigns</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Campaign
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Campaigns</p>
              <p className="text-3xl font-bold mt-1">{stats.totalCampaigns}</p>
            </div>
            <Mail className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Campaigns</p>
              <p className="text-3xl font-bold mt-1">{stats.activeCampaigns}</p>
            </div>
            <TrendingUp className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Sent</p>
              <p className="text-3xl font-bold mt-1">{stats.totalSent}</p>
            </div>
            <Send className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Avg. Open Rate</p>
              <p className="text-3xl font-bold mt-1">{stats.avgOpenRate}%</p>
            </div>
            <Eye className="w-8 h-8 opacity-80" />
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Campaign</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Type</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Recipients</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Opened</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Clicked</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Scheduled</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <span className="font-semibold text-slate-900">{campaign.name}</span>
                      <p className="text-sm text-slate-600 mt-1">{campaign.subject}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      campaign.type === 'email' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {campaign.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-900">{campaign.recipients}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-slate-900">{campaign.opened}</span>
                        {campaign.sent > 0 && (
                          <span className="text-xs text-slate-500">({((campaign.opened / campaign.sent) * 100).toFixed(1)}%)</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MousePointer className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-slate-900">{campaign.clicked}</span>
                      {campaign.sent > 0 && (
                        <span className="text-xs text-slate-500">({((campaign.clicked / campaign.sent) * 100).toFixed(1)}%)</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{campaign.scheduledDate}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      campaign.status === 'sent' ? 'bg-green-100 text-green-700' :
                      campaign.status === 'active' ? 'bg-blue-100 text-blue-700' :
                      campaign.status === 'scheduled' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
                        <Copy className="w-4 h-4" />
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
