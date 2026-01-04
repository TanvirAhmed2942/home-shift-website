import React, { useState, useEffect } from 'react';
import { 
  Package, Search, Filter, Download, 
  Map, Clock, CheckCircle, 
  User, Truck, DollarSign, XCircle, AlertTriangle, 
  History, Lock, Edit3, PlayCircle, Navigation, RefreshCcw, AlertOctagon
} from 'lucide-react';
import { jobStatusManager, Job } from '../../utils/jobStatusManager';
import { useJourney } from '../../contexts/JourneyContext';
import { JobDetailsPanel } from './JobDetailsPanel';
import { JobCard } from './JobCard';
import { CreateJobModal } from './CreateJobModal';
import { auditLogger } from '../../utils/auditLogger';
import { authManager } from '../../utils/authManager';

// Extended Job Statuses matching the user's "Critical Missing" list
type ExtendedJobStatus = 
  | 'draft' 
  | 'available' 
  | 'assigned' 
  | 'in-journey'
  | 'in-progress' 
  | 'completed' 
  | 'de-allocated'
  | 'cancelled' 
  | 'failed';

interface JobActionLog {
  id: string;
  action: string;
  user: string;
  timestamp: Date;
  details?: string;
}

// Mock Audit Logs
const mockAuditLogs: Record<string, JobActionLog[]> = {
  'JOB-123': [
    { id: '1', action: 'Created Draft', user: 'Admin (System)', timestamp: new Date(Date.now() - 86400000) },
    { id: '2', action: 'Published', user: 'John Admin', timestamp: new Date(Date.now() - 82000000) },
    { id: '3', action: 'Driver Assigned', user: 'Algo Dispatch', timestamp: new Date(Date.now() - 7200000) },
  ]
};

// Helper icons defined OUTSIDE component to avoid initialization errors
const Layers = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
);

const MOCK_DRIVERS = [
  { id: '1', name: 'Mike Johnson', username: 'mike.j_driver', phone: '07700 900111', vehicle: 'Large Van', status: 'available' },
  { id: '2', name: 'Sarah Davis', username: 'sarah.d_logistics', phone: '07700 900222', vehicle: 'Medium Van', status: 'on-job' },
  { id: '3', name: 'Tom Wilson', username: 'tom_transport', phone: '07700 900333', vehicle: 'Luton Van', status: 'available' },
  { id: '4', name: 'James Brown', username: 'j.brown_exp', phone: '07700 900444', vehicle: 'Small Van', status: 'available' },
];

function AssignDriverModal({ onClose, onAssign }: { onClose: () => void; onAssign: (driver: any) => void }) {
  const [search, setSearch] = useState('');
  const filtered = MOCK_DRIVERS.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.vehicle.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-900">Select Driver</h3>
          <button onClick={onClose}><XCircle className="w-6 h-6 text-slate-400 hover:text-slate-600" /></button>
        </div>
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Search drivers..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto max-h-[400px]">
          {filtered.map(driver => (
            <button 
              key={driver.id}
              onClick={() => onAssign(driver)}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50 border-b border-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${driver.status === 'available' ? 'bg-green-500' : 'bg-slate-400'}`}>
                  {driver.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{driver.name}</p>
                  <p className="text-xs text-slate-500">{driver.vehicle} • {driver.status}</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">Select</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function JobsManagement() {
  const [activeTab, setActiveTab] = useState<ExtendedJobStatus | 'all'>('all');
  const [assignJobId, setAssignJobId] = useState<string | null>(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [chargeFilter, setChargeFilter] = useState<'all' | 'charged' | 'no-charge'>('all');

  // Extended mock jobs to include missing statuses
  const [jobs, setJobs] = useState<Job[]>([]);
  const { addJobToJourney, isJobInJourney } = useJourney();
  const currentUser = authManager.getUser();

  // Permissions
  const canCreateJob = authManager.hasPermission('CREATE_JOB');

  const loadJobs = () => {
    const baseJobs = jobStatusManager.getAllJobs();
    
    // Injecting mock jobs for critical missing statuses to demonstrate functionality
    const mockDraft: Job = {
      ...baseJobs[0],
      id: 'DRAFT-001',
      status: 'draft',
      reference: 'DRAFT-REF-1',
      customerName: 'Pending Customer',
      pickup: { ...baseJobs[0]?.pickup, address: 'TBD' },
      date: '2024-01-01', // Future
    };

    const mockFailed: Job = {
      ...baseJobs[0],
      id: 'FAIL-001',
      status: 'failed',
      reference: 'FAIL-REF-1',
      customerName: 'Angry Customer',
      date: '2023-12-25',
    };
    
    // Only add if not exists to prevent duplicates on re-render
    const allJobs = [...baseJobs];
    if (!allJobs.find(j => j.id === 'DRAFT-001')) allJobs.push(mockDraft);
    if (!allJobs.find(j => j.id === 'FAIL-001')) allJobs.push(mockFailed);

    setJobs(allJobs);
  };

  // Load jobs and inject some mock data for new statuses
  useEffect(() => {
    loadJobs();
    const events = ['job_created', 'job_accepted', 'job_status_changed', 'job_assigned'];
    events.forEach(e => jobStatusManager.on(e, loadJobs));
    return () => events.forEach(e => jobStatusManager.off(e, loadJobs));
  }, []);

  const handleJobCreated = () => {
    setShowCreateModal(false);
    loadJobs(); // Refresh list
  };

  const handleAssignDriver = (driver: any) => {
    if (!assignJobId) return;
    
    // Call the manager
    const success = jobStatusManager.assignJob(assignJobId, driver);
    
    if (success) {
      auditLogger.log({
          user: currentUser.name,
          role: currentUser.role,
          action: 'Driver Assigned',
          details: `Assigned driver ${driver.name} to job`,
          jobId: assignJobId,
          type: 'update'
      });
      // Refresh list
      loadJobs();
      setAssignJobId(null);
    } else {
      alert("Failed to assign driver. Please try again.");
    }
  };

  const filteredJobs = jobs.filter(job => {
    // Exact status filtering
    if (activeTab !== 'all') {
      if (activeTab === 'history') {
         // Show history items (completed, cancelled, de-allocated, failed)
         if (!['completed', 'cancelled', 'de-allocated', 'failed'].includes(job.status)) return false;
      } else if (activeTab === 'in-progress') {
         if (!['in-transit', 'picked-up', 'in-progress'].includes(job.status)) return false; 
      } else if (job.status !== activeTab) {
        return false;
      }
    }

    // Charge Filter Logic for De-allocated/Cancelled
    if ((activeTab === 'de-allocated' || activeTab === 'cancelled' || activeTab === 'history') && chargeFilter !== 'all') {
       const isCharged = job.customerPrice > 0;
       if (chargeFilter === 'charged' && !isCharged) return false;
       if (chargeFilter === 'no-charge' && isCharged) return false;
    }

    const searchLower = searchQuery.toLowerCase();
    return (
      job.reference?.toLowerCase().includes(searchLower) ||
      job.customerName?.toLowerCase().includes(searchLower) ||
      job.pickup.address.toLowerCase().includes(searchLower) ||
      job.delivery.address.toLowerCase().includes(searchLower) ||
      job.id.toLowerCase().includes(searchLower)
    );
  });

  const tabs: { id: ExtendedJobStatus | 'all' | 'history', label: string, icon: any }[] = [
    { id: 'all', label: 'All Jobs', icon: Layers },
    { id: 'available', label: 'Available', icon: Package },
    { id: 'assigned', label: 'Assigned', icon: User },
    { id: 'in-journey', label: 'In Journey', icon: Map },
    { id: 'in-progress', label: 'In Progress', icon: Truck },
    { id: 'completed', label: 'Completed', icon: CheckCircle },
    { id: 'de-allocated', label: 'De-allocated', icon: AlertTriangle },
    { id: 'cancelled', label: 'Cancelled', icon: XCircle },
    { id: 'history', label: 'Job History & Charges', icon: History },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Jobs Management</h2>
          <p className="text-slate-600 mt-1">Full lifecycle control: Draft → Assigned → Paid → Completed</p>
        </div>
        <div className="flex gap-3 items-center">
           {/* Role Switcher for Demo */}
           <div className="flex items-center gap-2 mr-2 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
             <span className="text-xs text-slate-500 font-medium">Role:</span>
             <select 
               className="text-xs bg-transparent border-none outline-none font-bold text-slate-700 cursor-pointer"
               value={currentUser.role}
               onChange={(e) => authManager.switchUser(e.target.value as any)}
             >
                <option value="owner">Owner</option>
                <option value="finance_admin">Finance Admin</option>
                <option value="operations">Operations</option>
                <option value="support">Support</option>
                <option value="viewer">Viewer</option>
             </select>
           </div>

           {canCreateJob ? (
             <button 
               onClick={() => setShowCreateModal(true)}
               className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-md"
             >
              <Edit3 className="w-4 h-4" />
              Create Job
            </button>
           ) : (
             <button disabled className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 rounded-xl cursor-not-allowed">
                <Lock className="w-4 h-4" />
                Create Job
             </button>
           )}
           <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all">
             <Download className="w-5 h-5" />
             Export
           </button>
        </div>
      </div>

      {/* Tabs / Filters */}
      <div className="space-y-4">
        {/* Main Status Tabs */}
        <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setChargeFilter('all'); }}
                className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-filters for De-allocated / Cancelled / History */}
        {(activeTab === 'de-allocated' || activeTab === 'cancelled' || activeTab === 'history') && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Charge Filter:</span>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setChargeFilter('all')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${chargeFilter === 'all' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                All
              </button>
              <button
                onClick={() => setChargeFilter('charged')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${chargeFilter === 'charged' ? 'bg-white shadow text-green-700' : 'text-slate-500 hover:text-slate-700'}`}
              >
                With Charge
              </button>
              <button
                onClick={() => setChargeFilter('no-charge')}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${chargeFilter === 'no-charge' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                No Charge
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search jobs by reference, customer, postcode, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white shadow-sm"
          />
        </div>
        <button className="px-4 py-2 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-700 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Advanced Filter
        </button>
      </div>

      {/* Jobs List (NEW COMPACT VIEW) */}
      <div className="flex flex-col gap-3">
        {filteredJobs.length === 0 ? (
          <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300 p-12 text-center">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">No jobs found</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2">
              There are no jobs matching the current filter 
              <span className="font-bold px-2">"{activeTab !== 'all' ? tabs.find(t => t.id === activeTab)?.label : 'All'}"</span>
              and search criteria.
            </p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Create New Job
            </button>
          </div>
        ) : (
          filteredJobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              onClick={() => setSelectedJob(job)}
            />
          ))
        )}
      </div>

      {/* Job Details Panel (NEW) */}
      {selectedJob && (
        <JobDetailsPanel
          job={selectedJob}
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          onAction={(action, id) => {
             console.log("Action trigger:", action, id);
             if (action === 'assign') setAssignJobId(id);
             // Implement other actions here
          }}
        />
      )}

      {showCreateModal && (
        <CreateJobModal 
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleJobCreated}
        />
      )}

      {assignJobId && (
        <AssignDriverModal 
          onClose={() => setAssignJobId(null)}
          onAssign={handleAssignDriver}
        />
      )}
    </div>
  );
}
