import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Smartphone, Settings, Toggle, Plus } from 'lucide-react';

export function NotificationsManager() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications Management</h1>
          <p className="text-slate-600 mt-1">Configure notification settings and templates</p>
        </div>
      </div>

      {/* Notification Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Email</h3>
                <p className="text-sm text-slate-600">Send email notifications</p>
              </div>
            </div>
            <button
              onClick={() => setEmailEnabled(!emailEnabled)}
              className={`w-12 h-6 rounded-full transition-colors ${
                emailEnabled ? 'bg-green-500' : 'bg-slate-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                emailEnabled ? 'translate-x-7' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
          <p className="text-sm text-slate-600">Configured: SMTP Server</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">SMS</h3>
                <p className="text-sm text-slate-600">Send SMS notifications</p>
              </div>
            </div>
            <button
              onClick={() => setSmsEnabled(!smsEnabled)}
              className={`w-12 h-6 rounded-full transition-colors ${
                smsEnabled ? 'bg-green-500' : 'bg-slate-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                smsEnabled ? 'translate-x-7' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
          <p className="text-sm text-slate-600">Provider: Twilio</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Push</h3>
                <p className="text-sm text-slate-600">Push notifications</p>
              </div>
            </div>
            <button
              onClick={() => setPushEnabled(!pushEnabled)}
              className={`w-12 h-6 rounded-full transition-colors ${
                pushEnabled ? 'bg-green-500' : 'bg-slate-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                pushEnabled ? 'translate-x-7' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
          <p className="text-sm text-slate-600">Provider: Firebase</p>
        </div>
      </div>

      {/* Notification Templates */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Notification Templates</h2>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">
            <Plus className="w-4 h-4 inline mr-2" />
            New Template
          </button>
        </div>

        <div className="space-y-4">
          {[
            { name: 'Booking Confirmation', trigger: 'Job Created', channels: ['Email', 'SMS'] },
            { name: 'Driver Assigned', trigger: 'Driver Accept', channels: ['Email', 'Push'] },
            { name: 'Job Started', trigger: 'Job In Progress', channels: ['Email', 'SMS', 'Push'] },
            { name: 'Job Completed', trigger: 'Job Complete', channels: ['Email'] },
            { name: 'Payment Received', trigger: 'Payment Success', channels: ['Email'] }
          ].map((template, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{template.name}</h3>
                  <p className="text-sm text-slate-600 mt-1">Trigger: {template.trigger}</p>
                  <div className="flex gap-2 mt-2">
                    {template.channels.map(channel => (
                      <span key={channel} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {channel}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
