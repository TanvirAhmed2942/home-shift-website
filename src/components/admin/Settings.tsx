import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, MapPin, Clock, Mail, Phone, Globe, Shield, Bell, Users, CreditCard, Database } from 'lucide-react';

export function Settings() {
  const [activeSection, setActiveSection] = useState('general');

  const sections = [
    { id: 'general', icon: SettingsIcon, label: 'General' },
    { id: 'coverage', icon: MapPin, label: 'Coverage Areas' },
    { id: 'business-hours', icon: Clock, label: 'Business Hours' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'users', icon: Users, label: 'Admin Users' },
    { id: 'payment', icon: CreditCard, label: 'Payment' },
    { id: 'security', icon: Shield, label: 'Security' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Settings</h2>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <section.icon className="w-5 h-5" />
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeSection === 'general' && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-6">
              <h3 className="text-xl font-bold text-slate-900">General Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Company Name</label>
                  <input
                    type="text"
                    defaultValue="ShiftMyHome"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Contact Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      defaultValue="info@shiftmyhome.com"
                      className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      defaultValue="0800 123 4567"
                      className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Website</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="url"
                      defaultValue="https://shiftmyhome.com"
                      className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    />
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-medium">
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeSection === 'coverage' && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Coverage Areas</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Postcodes (comma separated)</label>
                  <textarea
                    rows={6}
                    defaultValue="SW1, E1, N1, W1, SE1, NW1, M1, M2, B1, B2, L1, L2, LS1, LS2"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                  <p className="text-sm text-slate-500 mt-2">Enter postcode prefixes for areas you service</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Maximum Distance (miles)</label>
                  <input
                    type="number"
                    defaultValue="250"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>

                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-medium">
                  <Save className="w-5 h-5" />
                  Save Coverage Settings
                </button>
              </div>
            </div>
          )}

          {activeSection === 'business-hours' && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Business Hours</h3>
              
              <div className="space-y-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <div key={day} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-32">
                      <span className="font-semibold text-slate-900">{day}</span>
                    </div>
                    <input
                      type="time"
                      defaultValue={day === 'Sunday' ? '10:00' : '08:00'}
                      className="px-4 py-2 border border-slate-300 rounded-lg"
                    />
                    <span className="text-slate-600">to</span>
                    <input
                      type="time"
                      defaultValue={day === 'Sunday' ? '16:00' : '18:00'}
                      className="px-4 py-2 border border-slate-300 rounded-lg"
                    />
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span className="text-sm text-slate-600">Open</span>
                    </label>
                  </div>
                ))}

                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-medium">
                  <Save className="w-5 h-5" />
                  Save Business Hours
                </button>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Notification Settings</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-semibold text-slate-900">New Booking Alerts</div>
                      <div className="text-sm text-slate-600">Get notified when a new booking is made</div>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </label>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-semibold text-slate-900">Payment Notifications</div>
                      <div className="text-sm text-slate-600">Receive alerts for payment transactions</div>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </label>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-semibold text-slate-900">Driver Status Updates</div>
                      <div className="text-sm text-slate-600">Track when drivers go online/offline</div>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </label>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="font-semibold text-slate-900">Email Notifications</div>
                      <div className="text-sm text-slate-600">Receive email alerts for important events</div>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </label>
                </div>

                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-medium">
                  <Save className="w-5 h-5" />
                  Save Notification Settings
                </button>
              </div>
            </div>
          )}

          {activeSection === 'users' && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Admin Users</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all">
                  <Users className="w-5 h-5" />
                  Add User
                </button>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: 'Admin User', email: 'admin@shiftmyhome.com', role: 'Super Admin', status: 'active' },
                  { name: 'John Manager', email: 'john@shiftmyhome.com', role: 'Manager', status: 'active' },
                  { name: 'Sarah Support', email: 'sarah@shiftmyhome.com', role: 'Support', status: 'active' },
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{user.name}</div>
                        <div className="text-sm text-slate-600">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {user.role}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        {user.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'payment' && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Payment Settings</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <CreditCard className="w-6 h-6 text-green-600" />
                    <h4 className="font-bold text-slate-900">Payment Gateway</h4>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">Configure your payment processing provider</p>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">Provider</label>
                      <select className="w-full px-4 py-3 border border-slate-300 rounded-xl">
                        <option>Stripe</option>
                        <option>PayPal</option>
                        <option>Square</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-2">API Key</label>
                      <input
                        type="password"
                        placeholder="sk_live_..."
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-medium">
                  <Save className="w-5 h-5" />
                  Save Payment Settings
                </button>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Security Settings</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-6 h-6 text-amber-600" />
                    <h4 className="font-bold text-slate-900">Two-Factor Authentication</h4>
                  </div>
                  <p className="text-sm text-amber-900 mb-3">Add an extra layer of security to your account</p>
                  <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-all text-sm font-medium">
                    Enable 2FA
                  </button>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900">Change Password</h4>
                  <input
                    type="password"
                    placeholder="Current Password"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl"
                  />
                </div>

                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-medium">
                  <Save className="w-5 h-5" />
                  Update Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
