import React, { useState, useEffect } from 'react';
import { Truck, Users, Send, CheckCircle, AlertCircle, Clock, Search, Filter, MapPin, Calendar, DollarSign, Package, User, Phone, Navigation, Heart, Star, XCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { jobStatusManager, Job } from '../../utils/jobStatusManager';
import { notificationService } from '../../utils/notificationService';

const AVAILABLE_DRIVERS = [
  { id: 'DRV001', name: 'John Driver', phone: '+44 7700 900789', rating: 4.9, vehicle: 'LWB Van', available: true },
  { id: 'DRV002', name: 'Mike Wilson', phone: '+44 7700 900790', rating: 4.8, vehicle: 'Luton Van', available: true },
  { id: 'DRV003', name: 'Sarah Parker', phone: '+44 7700 900791', rating: 4.7, vehicle: 'Small Van', available: false },
  { id: 'DRV004', name: 'Tom Anderson', phone: '+44 7700 900792', rating: 4.9, vehicle: 'LWB Van', available: true },
  { id: 'DRV005', name: 'Emma Davis', phone: '+44 7700 900793', rating: 4.6, vehicle: 'Luton Van', available: true },
];

export function JobDispatch() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<JobStatus | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Load jobs on mount and subscribe to updates
  useEffect(() => {
    loadJobs();

    // Subscribe to real-time updates
    jobStatusManager.on('job_created', loadJobs);
    jobStatusManager.on('job_status_changed', loadJobs);
    jobStatusManager.on('job_assigned', loadJobs);
  }, []);

  const loadJobs = () => {
    const allJobs = jobStatusManager.getAllJobs();
    setJobs(allJobs);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.pickup.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.delivery.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleAssignDriver = () => {
    if (!selectedJob || !selectedDriver) {
      alert('Please select both a job and a driver');
      return;
    }

    const driver = AVAILABLE_DRIVERS.find((d) => d.id === selectedDriver);
    if (!driver) return;

    const success = jobStatusManager.assignJobToDriver(
      selectedJob.id,
      driver.id,
      driver.name,
      driver.phone
    );

    if (success) {
      alert(`✅ Job assigned to ${driver.name}!\n\nThe driver will be notified and can accept the job.`);
      setSelectedJob(null);
      setSelectedDriver('');
      loadJobs();
    } else {
      alert('❌ Failed to assign job. Please try again.');
    }
  };

  const handlePublishToMarketplace = (job: Job) => {
    const success = jobStatusManager.updateJobStatus(job.id, 'available');
    if (success) {
      alert(`✅ Job published to driver marketplace!\n\nDrivers can now view and accept this job.`);
      loadJobs();
    }
  };

  const handleToggleInterestOnly = (jobId: string, enabled: boolean) => {
    const success = jobStatusManager.toggleInterestOnlyMode(jobId, enabled);
    if (success) {
      if (enabled) {
        alert('✅ Interest Only mode enabled!\n\nDrivers can only express interest. You must assign the job manually.');
      } else {
        alert('✅ Interest Only mode disabled!\n\nDrivers can now accept the job directly.');
      }
      loadJobs();
    } else {
      alert('❌ Failed to toggle Interest Only mode.');
    }
  };

  const handleAssignFromInterest = (jobId: string, driverId: string) => {
    const job = jobStatusManager.getJob(jobId);
    if (!job) return;

    const interestedDriver = job.interestedDrivers?.find(d => d.id === driverId);
    if (!interestedDriver) return;

    const success = jobStatusManager.assignJobToDriver(
      jobId,
      interestedDriver.id,
      interestedDriver.name,
      interestedDriver.phone
    );

    if (success) {
      alert(`✅ Job assigned to ${interestedDriver.name}!\n\nThe driver will be notified.`);
      loadJobs();
    } else {
      alert('❌ Failed to assign job.');
    }
  };

  const getStatusBadge = (status: JobStatus) => {
    const styles: Record<JobStatus, string> = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      assigned: 'bg-blue-100 text-blue-700 border-blue-300',
      available: 'bg-purple-100 text-purple-700 border-purple-300',
      accepted: 'bg-green-100 text-green-700 border-green-300',
      'in-progress': 'bg-indigo-100 text-indigo-700 border-indigo-300',
      completed: 'bg-slate-100 text-slate-700 border-slate-300',
      cancelled: 'bg-red-100 text-red-700 border-red-300',
      disputed: 'bg-orange-100 text-orange-700 border-orange-300',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const pendingCount = jobs.filter((j) => j.status === 'pending').length;
  const assignedCount = jobs.filter((j) => j.status === 'assigned').length;
  const inProgressCount = jobs.filter((j) => j.status === 'in-progress').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Job Dispatch</h2>
          <p className="text-slate-600 mt-1">Assign jobs to drivers and manage job status</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-xs text-yellow-700">Pending</div>
            <div className="text-xl font-bold text-yellow-900">{pendingCount}</div>
          </div>
          <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-xs text-blue-700">Assigned</div>
            <div className="text-xl font-bold text-blue-900">{assignedCount}</div>
          </div>
          <div className="px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-lg">
            <div className="text-xs text-indigo-700">In Progress</div>
            <div className="text-xl font-bold text-indigo-900">{inProgressCount}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer, location, job title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as JobStatus | 'all')}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="available">Available (Marketplace)</option>
            <option value="accepted">Accepted</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Jobs List */}
      <div className="grid gap-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-xl shadow-lg border border-slate-200 hover:border-blue-300 transition-all overflow-hidden"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg text-slate-900">{job.title}</h3>
                    {getStatusBadge(job.status)}
                  </div>
                  <p className="text-sm text-blue-600 font-semibold">{job.service}</p>
                  <p className="text-sm text-slate-600 mt-1">Job #{job.id}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 mb-1">Customer Price</div>
                  <div className="text-2xl font-bold text-slate-900">£{job.customerPrice.toFixed(2)}</div>
                  <div className="text-xs text-green-600 font-semibold mt-1">
                    Driver: £{job.driverPrice.toFixed(2)} | Margin: £{job.platformFee.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-slate-900">Customer: {job.customerName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-700">
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-500" />
                    {job.customerPhone}
                  </div>
                </div>
              </div>

              {/* Driver Info (if assigned) */}
              {job.driverId && (
                <div className="bg-green-50 rounded-lg p-3 mb-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-slate-900">Driver: {job.driverName}</span>
                  </div>
                  <div className="text-sm text-slate-700 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-500" />
                    {job.driverPhone}
                  </div>
                </div>
              )}

              {/* Route */}
              <div className="flex items-start gap-3 mb-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <div className="w-0.5 h-8 bg-slate-300"></div>
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="text-xs text-slate-500">Pickup</div>
                    <div className="font-semibold text-slate-900">{job.pickup.address}</div>
                    <div className="text-xs text-slate-600">{job.pickup.postcode}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Delivery</div>
                    <div className="font-semibold text-slate-900">{job.delivery.address}</div>
                    <div className="text-xs text-slate-600">{job.delivery.postcode}</div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">Date & Time</div>
                  <div className="font-semibold text-slate-900 text-sm">{job.date}</div>
                  <div className="text-xs text-slate-600">{job.time}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">Distance</div>
                  <div className="font-semibold text-slate-900 text-sm">{job.distance} mi</div>
                  <div className="text-xs text-slate-600">{job.duration}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">Volume</div>
                  <div className="font-semibold text-slate-900 text-sm">{job.totalVolume} m³</div>
                  <div className="text-xs text-slate-600">{job.vehicle}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="text-xs text-slate-500 mb-1">Crew</div>
                  <div className="font-semibold text-slate-900 text-sm">{job.crew} people</div>
                  <div className="text-xs text-slate-600">Required</div>
                </div>
              </div>

              {/* Items */}
              <div className="bg-slate-50 rounded-lg p-3 mb-4">
                <div className="text-xs text-slate-500 mb-2">Items ({job.items.length})</div>
                <div className="text-sm text-slate-700">{job.description}</div>
              </div>

              {/* ⚠️ COMPLETION METHOD - ONLY FOR COMPLETED JOBS ⚠️ */}
              {job.status === 'completed' && job.completionMethod && (
                <div className={`rounded-lg p-4 mb-4 border-2 ${
                  job.completionMethod === 'mobile' 
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' 
                    : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-300'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${job.completionMethod === 'mobile' ? 'text-green-600' : 'text-red-600'}`}>
                      {job.completionMethod === 'mobile' ? '✅' : '⚠️'}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 mb-1 flex items-center gap-2">
                        <span>Completion Method:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          job.completionMethod === 'mobile'
                            ? 'bg-green-600 text-white'
                            : 'bg-red-600 text-white'
                        }`}>
                          {job.completionMethod.toUpperCase()}
                        </span>
                      </div>
                      
                      {job.completionMethod === 'mobile' ? (
                        <div className="space-y-1 text-sm">
                          <p className="text-green-700 font-semibold">
                            ✅ Job completed via MOBILE APP (GPS Verified)
                          </p>
                          {job.completionLocation && job.completionLocation.lat && job.completionLocation.lng && (
                            <p className="text-slate-600 text-xs">
                              📍 GPS Location: {job.completionLocation.lat.toFixed(6)}, {job.completionLocation.lng.toFixed(6)}
                            </p>
                          )}
                          <p className="text-slate-500 text-xs">
                            Completed at delivery location with GPS proof
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1 text-sm">
                          <p className="text-red-700 font-semibold">
                            ⚠️ Job marked complete via WEB DASHBOARD
                          </p>
                          <p className="text-orange-600 text-xs font-semibold">
                            No GPS verification available - manual review recommended
                          </p>
                          <p className="text-slate-500 text-xs">
                            Driver acknowledged account termination risk
                          </p>
                        </div>
                      )}

                      {job.completedAt && (
                        <p className="text-slate-500 text-xs mt-2">
                          Completed: {new Date(job.completedAt).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Interest Only Mode Toggle - Only for available/pending jobs */}
              {(job.status === 'pending' || job.status === 'available') && (
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 mb-4 border-2 border-pink-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-pink-600" />
                      <div>
                        <h4 className="font-bold text-slate-900">Interest Only Mode</h4>
                        <p className="text-xs text-slate-600">
                          {job.interestOnly 
                            ? 'Drivers can only express interest - you must assign manually' 
                            : 'Drivers can accept the job directly'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleInterestOnly(job.id, !job.interestOnly);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                        job.interestOnly
                          ? 'bg-pink-600 hover:bg-pink-700 text-white'
                          : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                      }`}
                    >
                      {job.interestOnly ? (
                        <>
                          <ToggleRight className="w-5 h-5" />
                          <span>ON</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-5 h-5" />
                          <span>OFF</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Interested Drivers List */}
                  {job.interestOnly && job.interestedDrivers && job.interestedDrivers.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-pink-200">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-bold text-slate-900 flex items-center gap-2">
                          <Users className="w-4 h-4 text-pink-600" />
                          Interested Drivers ({job.interestedDrivers.length})
                        </h5>
                      </div>
                      <div className="space-y-2">
                        {job.interestedDrivers.map((driver) => (
                          <div
                            key={driver.id}
                            className="bg-white rounded-lg p-3 border border-pink-200 hover:border-pink-400 transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-bold text-sm">
                                  {driver.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold text-slate-900">{driver.name}</div>
                                  <div className="text-xs text-slate-600">{driver.phone}</div>
                                  <div className="text-xs text-slate-500 mt-1">
                                    Interested: {new Date(driver.timestamp).toLocaleString('en-GB', {
                                      day: '2-digit',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3 mr-3">
                                <div className="text-center bg-yellow-50 rounded-lg px-3 py-2">
                                  <div className="text-xs text-yellow-700">Rating</div>
                                  <div className="font-bold text-yellow-800 flex items-center justify-center gap-1">
                                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                    {driver.rating}
                                  </div>
                                </div>
                                <div className="text-center bg-blue-50 rounded-lg px-3 py-2">
                                  <div className="text-xs text-blue-700">Vehicle</div>
                                  <div className="font-bold text-blue-800 text-xs">{driver.vehicle}</div>
                                </div>
                                <div className="text-center bg-purple-50 rounded-lg px-3 py-2">
                                  <div className="text-xs text-purple-700">Capacity</div>
                                  <div className="font-bold text-purple-800">{driver.capacity} m³</div>
                                </div>
                                <div className="text-center bg-green-50 rounded-lg px-3 py-2">
                                  <div className="text-xs text-green-700">Distance</div>
                                  <div className="font-bold text-green-800">{driver.distanceFromJob.toFixed(1)} mi</div>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAssignFromInterest(job.id, driver.id);
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all shadow-md flex items-center gap-2"
                              >
                                <Send className="w-4 h-4" />
                                Assign
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No interested drivers message */}
                  {job.interestOnly && (!job.interestedDrivers || job.interestedDrivers.length === 0) && (
                    <div className="mt-4 pt-4 border-t border-pink-200 text-center py-4">
                      <Heart className="w-8 h-8 text-pink-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-600">No drivers have expressed interest yet</p>
                      <p className="text-xs text-slate-500 mt-1">Wait for drivers to show interest or assign manually</p>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                {job.status === 'pending' && (
                  <>
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Assign to Driver
                    </button>
                    <button
                      onClick={() => handlePublishToMarketplace(job)}
                      className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <Package className="w-4 h-4" />
                      Publish to Marketplace
                    </button>
                  </>
                )}

                {job.status === 'assigned' && (
                  <div className="flex-1 py-2 bg-blue-50 border-2 border-blue-300 text-blue-700 rounded-lg font-semibold text-center">
                    Waiting for driver to accept...
                  </div>
                )}

                {job.status === 'available' && (
                  <div className="flex-1 py-2 bg-purple-50 border-2 border-purple-300 text-purple-700 rounded-lg font-semibold text-center">
                    Published in driver marketplace
                  </div>
                )}

                {job.status === 'accepted' && (
                  <div className="flex-1 py-2 bg-green-50 border-2 border-green-300 text-green-700 rounded-lg font-semibold flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Accepted by driver
                  </div>
                )}

                {job.status === 'in-progress' && (
                  <div className="flex-1 py-2 bg-indigo-50 border-2 border-indigo-300 text-indigo-700 rounded-lg font-semibold flex items-center justify-center gap-2">
                    <Navigation className="w-4 h-4" />
                    Job in progress
                  </div>
                )}

                {job.status === 'completed' && (
                  <div className="flex-1 py-2 bg-slate-50 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredJobs.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-12 text-center">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No jobs found</h3>
            <p className="text-slate-500">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Assign Driver Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-900">Assign Driver to Job</h3>
              <p className="text-sm text-slate-600 mt-1">{selectedJob.title}</p>
            </div>

            <div className="p-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">Select Driver</label>
              <div className="space-y-3">
                {AVAILABLE_DRIVERS.map((driver) => (
                  <button
                    key={driver.id}
                    onClick={() => setSelectedDriver(driver.id)}
                    disabled={!driver.available}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedDriver === driver.id
                        ? 'border-blue-500 bg-blue-50'
                        : driver.available
                        ? 'border-slate-200 hover:border-blue-300'
                        : 'border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                          {driver.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{driver.name}</div>
                          <div className="text-sm text-slate-600">{driver.phone}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-600">{driver.vehicle}</div>
                        <div className="text-sm font-semibold text-yellow-600">★ {driver.rating}</div>
                        <div className={`text-xs font-semibold mt-1 ${driver.available ? 'text-green-600' : 'text-red-600'}`}>
                          {driver.available ? 'Available' : 'Busy'}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedJob(null);
                  setSelectedDriver('');
                }}
                className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignDriver}
                disabled={!selectedDriver}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign Driver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}