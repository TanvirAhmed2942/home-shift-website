import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, Download, Eye, User, Truck, DollarSign, Phone, Mail, XCircle, AlertTriangle, Map } from 'lucide-react';
import { jobStatusManager, Job } from '../../utils/jobStatusManager';
import { paymentManager } from '../../utils/paymentManager';
import { useJourney } from '../../contexts/JourneyContext';

interface Booking {
  id: string;
  bookingNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  service: string;
  pickup: string;
  delivery: string;
  date: string;
  time: string;
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  driver?: string;
  price: number;
  distance: number;
}

export function BookingsManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [realTimeJobs, setRealTimeJobs] = useState<Job[]>([]);
  const { addJobToJourney, isJobInJourney } = useJourney();

  // Load all jobs from jobStatusManager
  useEffect(() => {
    const loadJobs = () => {
      const jobs = jobStatusManager.getAllJobs();
      setRealTimeJobs(jobs);
    };

    // Initial load
    loadJobs();

    // Subscribe to real-time events
    const handleJobCreated = () => {
      console.log('📥 Admin Panel: New job created!');
      loadJobs();
    };

    const handleJobAccepted = () => {
      console.log('✅ Admin Panel: Job accepted by driver!');
      loadJobs();
    };

    const handleJobStatusChanged = () => {
      console.log('🔄 Admin Panel: Job status changed!');
      loadJobs();
    };

    const handleJobAssigned = () => {
      console.log('👤 Admin Panel: Job assigned to driver!');
      loadJobs();
    };

    // Subscribe to events
    jobStatusManager.on('job_created', handleJobCreated);
    jobStatusManager.on('job_accepted', handleJobAccepted);
    jobStatusManager.on('job_status_changed', handleJobStatusChanged);
    jobStatusManager.on('job_assigned', handleJobAssigned);

    // Cleanup on unmount
    return () => {
      jobStatusManager.off('job_created', handleJobCreated);
      jobStatusManager.off('job_accepted', handleJobAccepted);
      jobStatusManager.off('job_status_changed', handleJobStatusChanged);
      jobStatusManager.off('job_assigned', handleJobAssigned);
    };
  }, []);

  // Mock bookings data
  const [bookings] = useState<Booking[]>([
    {
      id: '1',
      bookingNumber: 'SMH-1001',
      customer: { name: 'John Smith', email: 'john@example.com', phone: '07700 900123' },
      service: 'House Move',
      pickup: 'London SW1A 1AA',
      delivery: 'Manchester M1 1AE',
      date: '2024-12-20',
      time: '09:00',
      status: 'pending',
      price: 450,
      distance: 215,
    },
    {
      id: '2',
      bookingNumber: 'SMH-1002',
      customer: { name: 'Emma Wilson', email: 'emma@example.com', phone: '07700 900456' },
      service: 'Furniture Delivery',
      pickup: 'Birmingham B1 1AA',
      delivery: 'Leeds LS1 1AA',
      date: '2024-12-18',
      time: '14:00',
      status: 'assigned',
      driver: 'Mike Johnson',
      price: 280,
      distance: 120,
    },
    {
      id: '3',
      bookingNumber: 'SMH-1003',
      customer: { name: 'David Brown', email: 'david@example.com', phone: '07700 900789' },
      service: 'Clearance & Removal',
      pickup: 'Liverpool L1 1AA',
      delivery: 'Liverpool L8 5XX',
      date: '2024-12-17',
      time: '10:30',
      status: 'in-progress',
      driver: 'Sarah Davis',
      price: 120,
      distance: 8,
    },
    {
      id: '4',
      bookingNumber: 'SMH-1004',
      customer: { name: 'Lisa Anderson', email: 'lisa@example.com', phone: '07700 900321' },
      service: 'Office Move',
      pickup: 'Bristol BS1 1AA',
      delivery: 'Cardiff CF10 1AA',
      date: '2024-12-15',
      time: '08:00',
      status: 'completed',
      driver: 'Tom Wilson',
      price: 650,
      distance: 45,
    },
    {
      id: '5',
      bookingNumber: 'SMH-1005',
      customer: { name: 'Mark Taylor', email: 'mark@example.com', phone: '07700 900654' },
      service: 'Student Move',
      pickup: 'Oxford OX1 1AA',
      delivery: 'Reading RG1 1AA',
      date: '2024-12-22',
      time: '11:00',
      status: 'pending',
      price: 185,
      distance: 40,
    },
  ]);

  const statusConfig = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300', label: 'Pending' },
    assigned: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', label: 'Assigned' },
    'in-progress': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300', label: 'In Progress' },
    completed: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', label: 'Completed' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', label: 'Cancelled' },
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    assigned: bookings.filter(b => b.status === 'assigned').length,
    'in-progress': bookings.filter(b => b.status === 'in-progress').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Bookings Management</h2>
          <p className="text-slate-600 mt-1">Manage all customer bookings and assignments</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all">
          <Download className="w-5 h-5" />
          Export Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`p-4 rounded-xl border-2 transition-all ${
              statusFilter === status
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-slate-200 bg-white hover:border-blue-300'
            }`}
          >
            <div className="text-2xl font-bold text-slate-900">{count}</div>
            <div className="text-xs text-slate-600 mt-1 capitalize">
              {status === 'all' ? 'All Bookings' : status.replace('-', ' ')}
            </div>
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by booking number or customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all">
            <Filter className="w-5 h-5" />
            More Filters
          </button>
        </div>
      </div>

      {/* Bookings List - Admin Card View with Control Focus */}
      <div className="space-y-3">
        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-xl shadow-md border-2 border-slate-300 hover:border-slate-400 hover:shadow-xl transition-all overflow-hidden"
          >
            {/* Admin Control Header */}
            <div className="bg-gradient-to-r from-slate-100 to-slate-200 px-5 py-3 border-b-2 border-slate-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-slate-700" />
                    <span className="font-black text-slate-900 text-base">{booking.bookingNumber}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-md text-xs font-bold border-2 ${statusConfig[booking.status].bg} ${statusConfig[booking.status].text} ${statusConfig[booking.status].border}`}>
                    {statusConfig[booking.status].label}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-slate-600 font-semibold">REVENUE</div>
                    <div className="text-xl font-black text-slate-900">£{booking.price}</div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowDetails(true);
                    }}
                    className="p-2 hover:bg-slate-300 rounded-lg transition-colors"
                  >
                    <Eye className="w-5 h-5 text-slate-700" />
                  </button>
                </div>
              </div>
            </div>

            {/* Admin Card Body - Professional Layout */}
            <div className="p-5">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {/* Customer Info - Compact */}
                <div className="space-y-2">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wide mb-2">👤 Customer</div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="font-bold text-slate-900">{booking.customer.name}</div>
                    <div className="text-sm text-slate-600 mt-1 flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      {booking.customer.phone}
                    </div>
                  </div>
                </div>

                {/* Driver Assignment */}
                <div className="space-y-2">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wide mb-2">🚚 Driver</div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {booking.driver ? (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                          {booking.driver.charAt(0)}
                        </div>
                        <div className="font-bold text-slate-900">{booking.driver}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-orange-600 font-semibold">⚠️ Not Assigned</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Route - Admin View */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-lg border-2 border-slate-200 mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                    <div className="w-0.5 h-8 bg-slate-400"></div>
                    <div className="w-4 h-4 rounded-full bg-red-600"></div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="text-xs text-blue-700 font-bold uppercase">From</div>
                      <div className="font-bold text-slate-900">{booking.pickup}</div>
                    </div>
                    <div>
                      <div className="text-xs text-red-700 font-bold uppercase">To</div>
                      <div className="font-bold text-slate-900">{booking.delivery}</div>
                    </div>
                  </div>
                  <div className="text-right bg-white px-3 py-2 rounded-lg border border-slate-300">
                    <div className="text-xs text-slate-600">Distance</div>
                    <div className="font-black text-slate-900">{booking.distance}mi</div>
                  </div>
                </div>
              </div>

              {/* Job Details Grid - Professional */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="text-xs text-blue-700 font-semibold mb-1">📅 Date</div>
                  <div className="font-bold text-slate-900 text-sm">{booking.date}</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                  <div className="text-xs text-purple-700 font-semibold mb-1">⏰ Time</div>
                  <div className="font-bold text-slate-900 text-sm">{booking.time}</div>
                </div>
                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                  <div className="text-xs text-indigo-700 font-semibold mb-1">📦 Service</div>
                  <div className="font-bold text-slate-900 text-xs truncate">{booking.service}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 border-t border-slate-200">
                <button
                  onClick={() => {
                    // Use Journey Context to add job
                    addJobToJourney(booking.id);
                  }}
                  disabled={isJobInJourney(booking.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                    isJobInJourney(booking.id)
                      ? 'bg-green-100 text-green-700 border-2 border-green-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-105'
                  }`}
                >
                  <Map className="w-4 h-4" />
                  {isJobInJourney(booking.id) ? '✓ In Journey' : 'Add to Journey'}
                </button>
                <button className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-sm transition-all flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  View
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredBookings.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg border-2 border-slate-200 p-12 text-center">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No bookings found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {showDetails && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-900">Booking Details</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Booking Number */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div>
                  <p className="text-sm text-slate-600">Booking Number</p>
                  <p className="text-xl font-bold text-slate-900">{selectedBooking.bookingNumber}</p>
                </div>
                <span className={`px-4 py-2 rounded-full font-medium ${statusConfig[selectedBooking.status].bg} ${statusConfig[selectedBooking.status].text}`}>
                  {statusConfig[selectedBooking.status].label}
                </span>
              </div>

              {/* Customer Info */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900">Customer Information</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-slate-600">Name</p>
                      <p className="font-medium text-slate-900">{selectedBooking.customer.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-slate-600">Phone</p>
                      <p className="font-medium text-slate-900">{selectedBooking.customer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg sm:col-span-2">
                    <Mail className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-xs text-slate-600">Email</p>
                      <p className="font-medium text-slate-900">{selectedBooking.customer.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900">Service Details</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600">Service Type</p>
                    <p className="font-medium text-slate-900">{selectedBooking.service}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600">Distance</p>
                    <p className="font-medium text-slate-900">{selectedBooking.distance} miles</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600">Date</p>
                    <p className="font-medium text-slate-900">{selectedBooking.date}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600">Time</p>
                    <p className="font-medium text-slate-900">{selectedBooking.time}</p>
                  </div>
                </div>
              </div>

              {/* Route */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900">Route</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      A
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Pickup Location</p>
                      <p className="font-medium text-slate-900">{selectedBooking.pickup}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                      B
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Delivery Location</p>
                      <p className="font-medium text-slate-900">{selectedBooking.delivery}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Driver */}
              {selectedBooking.driver && (
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-xs text-slate-600">Assigned Driver</p>
                      <p className="font-bold text-slate-900">{selectedBooking.driver}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-slate-600">Total Price</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">£{selectedBooking.price}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all">
                  Assign Driver
                </button>
                <button className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all">
                  Mark Completed
                </button>
              </div>

              {/* Cancel & Refund Button - Only show if not cancelled or completed */}
              {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'completed' && (
                <div className="border-t border-slate-200 pt-4">
                  <button
                    onClick={() => {
                      const jobId = `JOB-${selectedBooking.bookingNumber}`;
                      const reason = prompt('Enter cancellation reason:');
                      if (reason) {
                        const result = paymentManager.cancelJob(jobId, reason);
                        if (result.success) {
                          alert(`✅ ${result.message}\n\n💰 Customer Refund: £${result.refundAmount.toFixed(2)}\n💵 Driver Compensation: £${result.driverCompensation.toFixed(2)}`);
                          setShowDetails(false);
                          // In production, update booking status
                        } else {
                          alert(`❌ ${result.message}`);
                        }
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition-all border-2 border-red-200 hover:border-red-300"
                  >
                    <XCircle className="w-5 h-5" />
                    Cancel Job & Process Refund
                  </button>
                  
                  {/* Cancellation Policy Info */}
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-yellow-800">
                        <p className="font-semibold mb-1">Cancellation Policy:</p>
                        <ul className="space-y-0.5 text-yellow-700">
                          <li>• 24+ hours before: 100% refund to customer</li>
                          <li>• 12-24 hours: 50% refund, 25% to driver</li>
                          <li>• Less than 12 hours: No refund, 50% to driver</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Cancelled/Completed Status Message */}
              {(selectedBooking.status === 'cancelled' || selectedBooking.status === 'completed') && (
                <div className={`p-4 rounded-xl border-2 ${
                  selectedBooking.status === 'cancelled'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-green-50 border-green-200'
                }`}>
                  <p className={`text-sm font-medium ${
                    selectedBooking.status === 'cancelled' ? 'text-red-700' : 'text-green-700'
                  }`}>
                    {selectedBooking.status === 'cancelled'
                      ? '❌ This booking has been cancelled and refund has been processed.'
                      : '✅ This booking has been completed successfully.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}