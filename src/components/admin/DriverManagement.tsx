import React, { useState } from 'react';
import { Truck, Search, UserPlus, Phone, Mail, MapPin, Star, Calendar, DollarSign, Package, Navigation, Eye, Edit, ToggleLeft, ToggleRight, TrendingUp, User, LogIn, Shield } from 'lucide-react';
import { DriverDashboard } from './DriverDashboard'; // Import the new dashboard

interface Driver {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  vehicleType: string;
  vehicleReg: string;
  location: string;
  status: 'available' | 'on-job' | 'offline';
  rating: number;
  completedJobs: number;
  earnings: number;
  weeklyEarnings: number;
  joinDate: string;
  licenseExpiry: string;
}

export function DriverManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [impersonatingDriver, setImpersonatingDriver] = useState<Driver | null>(null); // NEW State

  // Mock drivers data
  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: '1',
      name: 'Mike Johnson',
      username: 'mike.j_driver',
      email: 'mike.j@shiftmyhome.com',
      phone: '07700 900111',
      vehicleType: 'Large Van (LWB)',
      vehicleReg: 'AB12 CDE',
      location: 'London',
      status: 'available',
      rating: 4.9,
      completedJobs: 156,
      earnings: 12450,
      weeklyEarnings: 850,
      joinDate: '2023-06-15',
      licenseExpiry: '2026-08-20',
    },
    {
      id: '2',
      name: 'Sarah Davis',
      username: 'sarah.d_logistics',
      email: 'sarah.d@shiftmyhome.com',
      phone: '07700 900222',
      vehicleType: 'Medium Van (SWB)',
      vehicleReg: 'FG34 HIJ',
      location: 'Manchester',
      status: 'on-job',
      rating: 4.8,
      completedJobs: 203,
      earnings: 15780,
      weeklyEarnings: 1240,
      joinDate: '2023-03-10',
      licenseExpiry: '2027-01-15',
    },
    {
      id: '3',
      name: 'Tom Wilson',
      username: 'tom_transport',
      email: 'tom.w@shiftmyhome.com',
      phone: '07700 900333',
      vehicleType: 'Luton Van',
      vehicleReg: 'KL56 MNO',
      location: 'Birmingham',
      status: 'available',
      rating: 5.0,
      completedJobs: 289,
      earnings: 22340,
      weeklyEarnings: 450,
      joinDate: '2022-11-20',
      licenseExpiry: '2025-12-10',
    },
    {
      id: '4',
      name: 'James Brown',
      username: 'j.brown_exp',
      email: 'james.b@shiftmyhome.com',
      phone: '07700 900444',
      vehicleType: 'Small Van',
      vehicleReg: 'PQ78 RST',
      location: 'Leeds',
      status: 'available',
      rating: 4.7,
      completedJobs: 134,
      earnings: 9850,
      weeklyEarnings: 0,
      joinDate: '2023-08-05',
      licenseExpiry: '2026-03-22',
    },
    {
      id: '5',
      name: 'Emily White',
      username: 'emily_w_driver',
      email: 'emily.w@shiftmyhome.com',
      phone: '07700 900555',
      vehicleType: 'Medium Van (SWB)',
      vehicleReg: 'UV90 WXY',
      location: 'Bristol',
      status: 'offline',
      rating: 4.9,
      completedJobs: 178,
      earnings: 13290,
      weeklyEarnings: 920,
      joinDate: '2023-05-18',
      licenseExpiry: '2027-06-30',
    },
  ]);

  const statusConfig = {
    available: { bg: 'bg-green-100', text: 'text-green-700', label: 'Available', icon: '🟢' },
    'on-job': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'On Job', icon: '🔵' },
    offline: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Offline', icon: '⚫' },
  };

  const filteredDrivers = drivers.filter(driver => {
    const query = searchQuery.toLowerCase();
    return driver.name.toLowerCase().includes(query) ||
      driver.username.toLowerCase().includes(query) ||
      driver.email.toLowerCase().includes(query) ||
      driver.vehicleReg.toLowerCase().includes(query);
  });

  const totalDrivers = drivers.length;
  const availableDrivers = drivers.filter(d => d.status === 'available').length;
  const onJobDrivers = drivers.filter(d => d.status === 'on-job').length;
  const totalWeeklyEarnings = drivers.reduce((sum, d) => sum + d.weeklyEarnings, 0);

  const toggleDriverStatus = (driverId: string) => {
    setDrivers(drivers.map(driver => {
      if (driver.id === driverId) {
        const newStatus = driver.status === 'available' ? 'offline' : 'available';
        return { ...driver, status: newStatus };
      }
      return driver;
    }));
  };

  // If impersonating, show the Driver Dashboard instead of the Admin view
  if (impersonatingDriver) {
    return (
      <DriverDashboard 
        driver={impersonatingDriver} 
        onBackToAdmin={() => setImpersonatingDriver(null)} 
      />
    );
  }

  // New Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'history' | 'payouts'>('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Driver Management</h2>
          <p className="text-slate-600 mt-1">Manage drivers, assignments, and availability</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all">
          <UserPlus className="w-5 h-5" />
          Add Driver
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-blue-600">{totalDrivers}</span>
          </div>
          <h3 className="text-slate-600 text-sm">Total Drivers</h3>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Truck className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-green-600">{availableDrivers}</span>
          </div>
          <h3 className="text-slate-600 text-sm">Available Now</h3>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Navigation className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-purple-600">{onJobDrivers}</span>
          </div>
          <h3 className="text-slate-600 text-sm">On Active Jobs</h3>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-orange-600">£{totalWeeklyEarnings.toLocaleString()}</span>
          </div>
          <h3 className="text-slate-600 text-sm">Fleet Weekly Revenue</h3>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, username, email or vehicle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
          />
        </div>
      </div>

      {/* Drivers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => (
          <div key={driver.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all">
            {/* Driver Header */}
            <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                    {driver.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{driver.name}</h3>
                    <p className="text-blue-200 text-sm font-medium flex items-center gap-1">
                      <User className="w-3 h-3" /> @{driver.username}
                    </p>
                  </div>
                </div>
                {/* Actions Top Right */}
                <div className="flex gap-1">
                  <button
                    onClick={() => setImpersonatingDriver(driver)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors group relative"
                    title="Login as Driver"
                  >
                    <LogIn className="w-6 h-6" />
                    <span className="absolute hidden group-hover:block right-0 top-full mt-1 bg-black text-xs px-2 py-1 rounded whitespace-nowrap">Login as Driver</span>
                  </button>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[driver.status].bg} ${statusConfig[driver.status].text}`}>
                  {statusConfig[driver.status].icon} {statusConfig[driver.status].label}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{driver.rating}</span>
                </div>
              </div>
            </div>

            {/* Driver Info */}
            <div className="p-6 space-y-4">
              {/* WEEKLY EARNINGS HIGHLIGHT */}
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex justify-between items-center">
                 <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-bold text-orange-800">This Week:</span>
                 </div>
                 <span className="text-lg font-bold text-orange-600">£{driver.weeklyEarnings.toLocaleString()}</span>
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {driver.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" />
                  {driver.phone}
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-slate-900">{driver.vehicleType}</span>
                </div>
                <p className="text-sm text-slate-600">Reg: {driver.vehicleReg}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-green-50 rounded-xl">
                  <Package className="w-4 h-4 text-green-600 mb-1" />
                  <div className="font-bold text-slate-900">{driver.completedJobs}</div>
                  <div className="text-xs text-slate-600">Jobs</div>
                </div>
                <div className="p-3 bg-slate-100 rounded-xl">
                  <DollarSign className="w-4 h-4 text-slate-600 mb-1" />
                  <div className="font-bold text-slate-900">£{driver.earnings.toLocaleString()}</div>
                  <div className="text-xs text-slate-600">Total Lifetime</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setSelectedDriver(driver);
                    setShowDetails(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button 
                  onClick={() => setImpersonatingDriver(driver)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-all text-sm font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  Log In
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Driver Details Modal */}
      {showDetails && selectedDriver && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Driver Profile</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-6 border-b border-slate-200">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`pb-3 font-medium text-sm transition-colors relative ${activeTab === 'overview' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Overview
                  {activeTab === 'overview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
                </button>
                <button 
                  onClick={() => setActiveTab('documents')}
                  className={`pb-3 font-medium text-sm transition-colors relative ${activeTab === 'documents' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Documents
                  {activeTab === 'documents' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
                </button>
                 <button 
                  onClick={() => setActiveTab('payouts')}
                  className={`pb-3 font-medium text-sm transition-colors relative ${activeTab === 'payouts' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Payout & Bank Details
                  {activeTab === 'payouts' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              
              {/* PAYOUTS TAB CONTENT */}
              {activeTab === 'payouts' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                       Stripe Connect Status
                    </h4>
                    
                    <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                           {/* Stripe-like icon placeholder */}
                           <span className="text-xl font-bold text-slate-400">S</span>
                         </div>
                         <div>
                           <p className="font-bold text-slate-900">Stripe Account</p>
                           <p className="text-sm text-slate-500">Not connected</p>
                         </div>
                       </div>
                       <button className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors">
                         Connect Stripe Account
                       </button>
                    </div>
                    
                    <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      We do not store bank details directly. All payments are processed securely via Stripe Connect.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-900">Payout Preferences</h4>
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                           <p className="text-xs text-slate-500">Bank Country</p>
                           <p className="font-medium text-slate-900">United Kingdom (GB)</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                           <p className="text-xs text-slate-500">Currency</p>
                           <p className="font-medium text-slate-900">GBP (£)</p>
                        </div>
                         <div className="bg-white p-3 rounded-lg border border-slate-200">
                           <p className="text-xs text-slate-500">Payout Schedule</p>
                           <p className="font-medium text-slate-900">Standard (Weekly)</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="font-bold text-slate-900">Recent Activity</h4>
                       <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                          <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <span className="text-xs font-bold text-slate-500">Last Payout</span>
                            <span className="text-xs font-mono text-slate-400">NEVER</span>
                          </div>
                          <div className="p-8 text-center text-slate-400 text-sm">
                             No payout history available
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* EXISTING OVERVIEW CONTENT */
                <div className="space-y-6">
                  {/* Driver Header */}
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
                  {selectedDriver.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold">{selectedDriver.name}</h4>
                  <p className="text-blue-100 flex items-center gap-2">
                    <User className="w-4 h-4" /> @{selectedDriver.username}
                  </p>
                  <p className="text-blue-200 text-sm mt-1">ID: #{selectedDriver.id}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-bold">{selectedDriver.rating}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[selectedDriver.status].bg} ${statusConfig[selectedDriver.status].text}`}>
                    {statusConfig[selectedDriver.status].label}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid sm:grid-cols-3 gap-4">
                 {/* WEEKLY EARNINGS CARD */}
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-orange-600 mb-2" />
                  <div className="text-2xl font-bold text-slate-900">£{selectedDriver.weeklyEarnings.toLocaleString()}</div>
                  <div className="text-sm text-orange-700 font-medium">This Week</div>
                </div>

                <div className="p-4 bg-green-50 rounded-xl">
                  <DollarSign className="w-6 h-6 text-green-600 mb-2" />
                  <div className="text-2xl font-bold text-slate-900">£{selectedDriver.earnings.toLocaleString()}</div>
                  <div className="text-sm text-slate-600">Total Lifetime</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <Package className="w-6 h-6 text-blue-600 mb-2" />
                  <div className="text-2xl font-bold text-slate-900">{selectedDriver.completedJobs}</div>
                  <div className="text-sm text-slate-600">Total Jobs</div>
                </div>
              </div>

              {/* Contact & Vehicle Info */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-xs text-slate-600">Email</p>
                        <p className="font-medium text-slate-900">{selectedDriver.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <Phone className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-xs text-slate-600">Phone</p>
                        <p className="font-medium text-slate-900">{selectedDriver.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-xs text-slate-600">Location</p>
                        <p className="font-medium text-slate-900">{selectedDriver.location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900">Vehicle Information</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-600">Vehicle Type</p>
                      <p className="font-medium text-slate-900">{selectedDriver.vehicleType}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-600">Registration</p>
                      <p className="font-medium text-slate-900">{selectedDriver.vehicleReg}</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-xs text-amber-900">License Expiry</p>
                      <p className="font-medium text-amber-900">{selectedDriver.licenseExpiry}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {activeTab === 'overview' && (
                  <>
                 <button 
                  onClick={() => {
                      setShowDetails(false);
                      setImpersonatingDriver(selectedDriver);
                  }}
                  className="flex-1 px-4 py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  Log in as Driver
                </button>
                <button className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all">
                  Assign to Job
                </button>
                <button className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-all">
                  <Edit className="w-5 h-5" />
                </button>
                  </>
                )}
              </div>
            </div>
              )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
