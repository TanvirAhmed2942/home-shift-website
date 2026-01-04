import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Clock, MapPin, DollarSign, Camera, FileText, ChevronRight, User } from 'lucide-react';
import { VARIATION_REASONS } from '../../utils/pricingRules';

// Mock data
const INITIAL_REQUESTS = [
  {
    id: 'VAR-001',
    jobId: 'JOB-1234',
    driverName: 'John Driver',
    reasonId: 'extra_floor',
    reasonLabel: 'Extra Floors (No Lift)',
    value: 2,
    unit: 'floors',
    cost: 20,
    notes: 'Lift is broken, had to carry sofa up 2 floors.',
    status: 'pending',
    timestamp: '2024-05-20T10:30:00Z',
    hasPhoto: true
  },
  {
    id: 'VAR-002',
    jobId: 'JOB-5678',
    driverName: 'Sarah Smith',
    reasonId: 'waiting_time',
    reasonLabel: 'Waiting Time',
    value: 45,
    unit: 'minutes',
    cost: 45,
    notes: 'Customer not home, waited 45 mins.',
    status: 'pending',
    timestamp: '2024-05-20T11:15:00Z',
    hasPhoto: true
  },
  {
    id: 'VAR-003',
    jobId: 'JOB-9012',
    driverName: 'Mike Jones',
    reasonId: 'extra_items',
    reasonLabel: 'Extra Items',
    value: 5,
    unit: 'items',
    cost: 75,
    notes: '5 extra boxes not declared.',
    status: 'approved',
    timestamp: '2024-05-19T14:20:00Z',
    hasPhoto: true
  }
];

export function VariationRequests() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [filter, setFilter] = useState('pending');

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    setRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: action } : req
    ));
  };

  const filteredRequests = requests.filter(r => filter === 'all' || r.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Variation Requests</h2>
          <p className="text-slate-500">Manage on-site extra charges submitted by drivers</p>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {['pending', 'approved', 'rejected', 'all'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${
                filter === f 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Pending Review</span>
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {requests.filter(r => r.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Approved Today</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            £{requests.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.cost, 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Rejected</span>
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {requests.filter(r => r.status === 'rejected').length}
          </p>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <p>No requests found in this category.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col lg:flex-row gap-6">
                  
                  {/* Left: Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                        request.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        request.status === 'approved' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {request.status}
                      </span>
                      <span className="text-sm text-slate-400">
                        {new Date(request.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      {request.reasonLabel}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {request.driverName}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        Job #{request.jobId}
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <p className="text-sm text-slate-700 italic">"{request.notes}"</p>
                      {request.hasPhoto && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-blue-600 font-medium cursor-pointer hover:underline">
                          <Camera className="w-4 h-4" />
                          View Evidence Photo
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Cost & Actions */}
                  <div className="flex flex-col items-end justify-between min-w-[200px]">
                    <div className="text-right mb-4">
                      <p className="text-sm text-slate-500 mb-1">Requested Amount</p>
                      <p className="text-3xl font-bold text-slate-900">£{request.cost.toFixed(2)}</p>
                      <p className="text-xs text-slate-400">
                        {request.value} {request.unit} @ Rate
                      </p>
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex gap-2 w-full">
                        <button 
                          onClick={() => handleAction(request.id, 'rejected')}
                          className="flex-1 px-4 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 font-medium transition-colors"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => handleAction(request.id, 'approved')}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors shadow-sm"
                        >
                          Approve
                        </button>
                      </div>
                    )}
                    
                    {request.status !== 'pending' && (
                      <div className="flex items-center gap-2 text-sm font-medium">
                        {request.status === 'approved' ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" /> Approved
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Rejected
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
