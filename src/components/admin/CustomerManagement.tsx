import React, { useState } from 'react';
import { Users, Search, UserPlus, Mail, Phone, MapPin, Package, DollarSign, Calendar, Eye, Edit, Trash2, Star } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  totalBookings: number;
  totalSpent: number;
  lastBooking: string;
  rating: number;
  status: 'active' | 'inactive';
}

export function CustomerManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Mock customers data
  const [customers] = useState<Customer[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '07700 900123',
      address: 'London SW1A 1AA',
      joinDate: '2024-01-15',
      totalBookings: 8,
      totalSpent: 2450,
      lastBooking: '2024-12-10',
      rating: 4.8,
      status: 'active',
    },
    {
      id: '2',
      name: 'Emma Wilson',
      email: 'emma.wilson@example.com',
      phone: '07700 900456',
      address: 'Birmingham B1 1AA',
      joinDate: '2024-03-22',
      totalBookings: 5,
      totalSpent: 1280,
      lastBooking: '2024-12-08',
      rating: 5.0,
      status: 'active',
    },
    {
      id: '3',
      name: 'David Brown',
      email: 'david.brown@example.com',
      phone: '07700 900789',
      address: 'Liverpool L1 1AA',
      joinDate: '2024-02-10',
      totalBookings: 12,
      totalSpent: 3890,
      lastBooking: '2024-12-12',
      rating: 4.9,
      status: 'active',
    },
    {
      id: '4',
      name: 'Lisa Anderson',
      email: 'lisa.anderson@example.com',
      phone: '07700 900321',
      address: 'Bristol BS1 1AA',
      joinDate: '2024-05-18',
      totalBookings: 3,
      totalSpent: 890,
      lastBooking: '2024-11-25',
      rating: 4.5,
      status: 'active',
    },
    {
      id: '5',
      name: 'Mark Taylor',
      email: 'mark.taylor@example.com',
      phone: '07700 900654',
      address: 'Oxford OX1 1AA',
      joinDate: '2024-04-05',
      totalBookings: 6,
      totalSpent: 1650,
      lastBooking: '2024-12-05',
      rating: 4.7,
      status: 'active',
    },
    {
      id: '6',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '07700 900987',
      address: 'Manchester M1 1AE',
      joinDate: '2023-11-20',
      totalBookings: 15,
      totalSpent: 4720,
      lastBooking: '2024-12-01',
      rating: 4.9,
      status: 'active',
    },
  ]);

  const filteredCustomers = customers.filter(customer => {
    const query = searchQuery.toLowerCase();
    return customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.includes(query);
  });

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgBookingsPerCustomer = (customers.reduce((sum, c) => sum + c.totalBookings, 0) / customers.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Customer Management</h2>
          <p className="text-slate-600 mt-1">View and manage customer database</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all">
          <UserPlus className="w-5 h-5" />
          Add Customer
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-blue-600">{totalCustomers}</span>
          </div>
          <h3 className="text-slate-600 text-sm">Total Customers</h3>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-green-600">{activeCustomers}</span>
          </div>
          <h3 className="text-slate-600 text-sm">Active Customers</h3>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-purple-600">£{totalRevenue.toLocaleString()}</span>
          </div>
          <h3 className="text-slate-600 text-sm">Total Revenue</h3>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-orange-600">{avgBookingsPerCustomer}</span>
          </div>
          <h3 className="text-slate-600 text-sm">Avg Bookings/Customer</h3>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Join Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Bookings</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Total Spent</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Rating</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{customer.name}</div>
                        <div className="text-xs text-slate-500">ID: #{customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-slate-900">
                        <Mail className="w-4 h-4 text-slate-400" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="w-4 h-4 text-slate-400" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-900">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {customer.address}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-900">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {customer.joinDate}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-center">
                      <div className="font-bold text-slate-900">{customer.totalBookings}</div>
                      <div className="text-xs text-slate-500">bookings</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-green-600">£{customer.totalSpent}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-slate-900">{customer.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      customer.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowDetails(true);
                        }}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-5 h-5 text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-green-100 rounded-lg transition-colors">
                        <Edit className="w-5 h-5 text-green-600" />
                      </button>
                      <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      {showDetails && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-900">Customer Profile</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer Header */}
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold">{selectedCustomer.name}</h4>
                  <p className="text-blue-100">Customer ID: #{selectedCustomer.id}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-bold">{selectedCustomer.rating}</span>
                  </div>
                  <p className="text-sm text-blue-100">Rating</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <Package className="w-6 h-6 text-blue-600 mb-2" />
                  <div className="text-2xl font-bold text-slate-900">{selectedCustomer.totalBookings}</div>
                  <div className="text-sm text-slate-600">Total Bookings</div>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <DollarSign className="w-6 h-6 text-green-600 mb-2" />
                  <div className="text-2xl font-bold text-slate-900">£{selectedCustomer.totalSpent}</div>
                  <div className="text-sm text-slate-600">Total Spent</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <Calendar className="w-6 h-6 text-purple-600 mb-2" />
                  <div className="text-2xl font-bold text-slate-900">{selectedCustomer.joinDate}</div>
                  <div className="text-sm text-slate-600">Member Since</div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900">Contact Information</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-slate-600">Email</p>
                      <p className="font-medium text-slate-900">{selectedCustomer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-slate-600">Phone</p>
                      <p className="font-medium text-slate-900">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl sm:col-span-2">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-xs text-slate-600">Address</p>
                      <p className="font-medium text-slate-900">{selectedCustomer.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900">Recent Activity</h4>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-sm text-amber-900">
                    <span className="font-semibold">Last Booking:</span> {selectedCustomer.lastBooking}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all">
                  Send Email
                </button>
                <button className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all">
                  View Bookings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
