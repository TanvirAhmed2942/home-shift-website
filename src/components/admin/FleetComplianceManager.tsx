import React, { useState } from 'react';
import { 
  Shield, FileText, CheckCircle, AlertTriangle, XCircle, 
  Upload, Calendar, User, Search, Eye, Filter, RefreshCw 
} from 'lucide-react';

// --- TYPES ---
type DocStatus = 'valid' | 'expiring' | 'expired' | 'missing' | 'pending_review';

interface DriverDocument {
  id: string;
  name: string; // e.g., "Driving License", "Goods in Transit Insurance"
  type: 'license' | 'insurance' | 'mot' | 'crb';
  expiryDate?: string;
  status: DocStatus;
  lastUploaded?: string;
  fileUrl?: string;
}

interface DriverComplianceProfile {
  id: string;
  name: string;
  vehicle: string;
  overallStatus: 'compliant' | 'non_compliant' | 'review_needed';
  documents: DriverDocument[];
}

// --- MOCK DATA ---
const MOCK_DRIVERS: DriverComplianceProfile[] = [
  {
    id: 'd1',
    name: 'John Smith',
    vehicle: 'Luton Van (Ford Transit)',
    overallStatus: 'compliant',
    documents: [
      { id: 'doc1', name: 'Driving License', type: 'license', expiryDate: '2025-12-01', status: 'valid', lastUploaded: '2023-01-10' },
      { id: 'doc2', name: 'Vehicle Insurance', type: 'insurance', expiryDate: '2024-06-15', status: 'valid', lastUploaded: '2023-06-15' },
      { id: 'doc3', name: 'Goods in Transit', type: 'insurance', expiryDate: '2024-08-01', status: 'valid', lastUploaded: '2023-08-01' },
    ]
  },
  {
    id: 'd2',
    name: 'Michael Dave',
    vehicle: 'LWB Van (Mercedes Sprinter)',
    overallStatus: 'non_compliant',
    documents: [
      { id: 'doc4', name: 'Driving License', type: 'license', expiryDate: '2024-12-01', status: 'valid', lastUploaded: '2022-01-10' },
      { id: 'doc5', name: 'Vehicle Insurance', type: 'insurance', expiryDate: '2023-12-20', status: 'expired', lastUploaded: '2022-12-20' },
      { id: 'doc6', name: 'Goods in Transit', type: 'insurance', expiryDate: '2024-01-15', status: 'expiring', lastUploaded: '2023-01-15' },
    ]
  },
  {
    id: 'd3',
    name: 'Sarah Connor',
    vehicle: 'Luton Van with Tail Lift',
    overallStatus: 'review_needed',
    documents: [
      { id: 'doc7', name: 'Driving License', type: 'license', expiryDate: '2026-05-20', status: 'valid', lastUploaded: '2023-05-20' },
      { id: 'doc8', name: 'Public Liability', type: 'insurance', status: 'pending_review', lastUploaded: '2023-12-27' },
    ]
  }
];

export function FleetComplianceManager() {
  const [selectedDriver, setSelectedDriver] = useState<DriverComplianceProfile | null>(null);
  const [filter, setFilter] = useState<'all' | 'compliant' | 'attention'>('all');

  const filteredDrivers = MOCK_DRIVERS.filter(d => {
    if (filter === 'all') return true;
    if (filter === 'compliant') return d.overallStatus === 'compliant';
    if (filter === 'attention') return d.overallStatus !== 'compliant';
    return true;
  });

  const getStatusColor = (status: DocStatus) => {
    switch (status) {
      case 'valid': return 'text-green-600 bg-green-50 border-green-200';
      case 'expiring': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'expired': return 'text-red-600 bg-red-50 border-red-200';
      case 'missing': return 'text-slate-400 bg-slate-100 border-slate-200';
      case 'pending_review': return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getStatusIcon = (status: DocStatus) => {
    switch (status) {
      case 'valid': return <CheckCircle className="w-4 h-4" />;
      case 'expiring': return <AlertTriangle className="w-4 h-4" />;
      case 'expired': return <XCircle className="w-4 h-4" />;
      case 'missing': return <AlertTriangle className="w-4 h-4" />;
      case 'pending_review': return <RefreshCw className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-6">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Fleet Intelligence</h2>
          <p className="text-slate-600 mt-1">Manage driver compliance, insurance, and legal documents</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white border border-slate-200 rounded-lg p-1 flex">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${filter === 'all' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              All Fleet
            </button>
            <button 
              onClick={() => setFilter('attention')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${filter === 'attention' ? 'bg-red-50 text-red-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Needs Attention ({MOCK_DRIVERS.filter(d => d.overallStatus !== 'compliant').length})
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Left List */}
        <div className="w-1/3 bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search drivers..." 
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredDrivers.map(driver => (
              <div 
                key={driver.id}
                onClick={() => setSelectedDriver(driver)}
                className={`p-4 border-b border-slate-100 cursor-pointer transition-colors hover:bg-slate-50 ${selectedDriver?.id === driver.id ? 'bg-blue-50/50 border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900">{driver.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{driver.vehicle}</p>
                  </div>
                  {driver.overallStatus === 'compliant' ? (
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Active</span>
                  ) : (
                    <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Issues
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Details */}
        <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          {selectedDriver ? (
            <>
              {/* Profile Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/30">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedDriver.name}</h3>
                    <p className="text-slate-600 text-sm flex items-center gap-2">
                       {selectedDriver.vehicle} • ID: {selectedDriver.id.toUpperCase()}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded border font-medium ${selectedDriver.overallStatus === 'compliant' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                         {selectedDriver.overallStatus === 'compliant' ? 'Fully Compliant' : 'Documents Expired / Missing'}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-white transition-colors">
                  Edit Profile
                </button>
              </div>

              {/* Documents List */}
              <div className="flex-1 overflow-y-auto p-6">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Required Documents
                </h4>
                
                <div className="space-y-4">
                  {selectedDriver.documents.map(doc => (
                    <div key={doc.id} className="border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-blue-300 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(doc.status)} bg-opacity-20`}>
                           {getStatusIcon(doc.status)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            {doc.name}
                            {doc.status === 'expiring' && (
                               <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold">Expiring Soon</span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                             <span className="flex items-center gap-1">
                               <Calendar className="w-3 h-3" />
                               Expires: {doc.expiryDate || 'N/A'}
                             </span>
                             {doc.lastUploaded && (
                               <span>• Last uploaded: {doc.lastUploaded}</span>
                             )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                         {doc.status === 'pending_review' && (
                           <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                             Verify Now
                           </button>
                         )}
                         <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Document">
                           <Eye className="w-4 h-4" />
                         </button>
                         <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Upload New Version">
                           <Upload className="w-4 h-4" />
                         </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add New Doc Placeholder */}
                  <button className="w-full border-2 border-dashed border-slate-200 rounded-xl p-4 flex items-center justify-center gap-2 text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-medium">Upload Additional Document</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
              <Shield className="w-16 h-16 mb-4 text-slate-200" />
              <p className="font-medium">Select a driver to manage compliance</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
