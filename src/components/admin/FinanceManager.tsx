import React, { useState, useEffect, useMemo } from 'react';
import { 
  Download, Search, ChevronRight, ChevronLeft, 
  CheckCircle, XCircle, AlertCircle, Calendar, 
  CreditCard, User, Building
} from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner@2.0.3';

// --- TYPES ---
interface Driver {
  id: string;
  name: string;
  email: string;
  bankStatus: 'verified' | 'unverified';
  totalPending: number;
  totalPaid: number;
}

interface PayoutRecord {
  id: string;
  driverId: string;
  driverName: string;
  periodStart: string;
  periodEnd: string;
  jobsCount: number;
  grossAmount: number;
  extrasAmount: number;
  feesAmount: number;
  netAmount: number;
  status: 'pending' | 'processing' | 'paid';
  paidDate?: string;
}

// --- MOCK DATA ---
const MOCK_DRIVERS: Driver[] = [
  { id: 'DRV-001', name: 'John Smith', email: 'john.smith@example.com', bankStatus: 'verified', totalPending: 1250.50, totalPaid: 45000.00 },
  { id: 'DRV-002', name: 'Sarah Johnson', email: 'sarah.j@example.com', bankStatus: 'verified', totalPending: 850.25, totalPaid: 32150.00 },
  { id: 'DRV-003', name: 'Michael Brown', email: 'm.brown@example.com', bankStatus: 'unverified', totalPending: 0, totalPaid: 1200.00 },
  { id: 'DRV-004', name: 'Emma Wilson', email: 'emma.w@example.com', bankStatus: 'verified', totalPending: 2100.75, totalPaid: 15400.00 },
  { id: 'DRV-005', name: 'David Lee', email: 'david.l@example.com', bankStatus: 'verified', totalPending: 450.00, totalPaid: 8900.00 },
];

const GENERATE_MOCK_PAYOUTS = (): PayoutRecord[] => {
  const payouts: PayoutRecord[] = [];
  
  MOCK_DRIVERS.forEach(driver => {
    // 1. Pending Payout (if any)
    if (driver.totalPending > 0) {
      payouts.push({
        id: `PAY-${Math.floor(Math.random() * 10000)}`,
        driverId: driver.id,
        driverName: driver.name,
        periodStart: '01 Dec 2024',
        periodEnd: '07 Dec 2024',
        jobsCount: Math.floor(Math.random() * 10) + 1,
        grossAmount: driver.totalPending * 0.9,
        extrasAmount: driver.totalPending * 0.15,
        feesAmount: driver.totalPending * 0.05,
        netAmount: driver.totalPending,
        status: 'pending'
      });
    }

    // 2. History Payouts
    for (let i = 1; i <= 3; i++) {
      const net = Math.floor(Math.random() * 1000) + 500;
      payouts.push({
        id: `PAY-HIST-${driver.id}-${i}`,
        driverId: driver.id,
        driverName: driver.name,
        periodStart: `01 Nov 2024`,
        periodEnd: `07 Nov 2024`,
        jobsCount: Math.floor(Math.random() * 15) + 5,
        grossAmount: net * 0.9,
        extrasAmount: net * 0.15,
        feesAmount: net * 0.05,
        netAmount: net,
        status: 'paid',
        paidDate: '10 Nov 2024'
      });
    }
  });

  return payouts;
};

const MOCK_PAYOUTS = GENERATE_MOCK_PAYOUTS();

// --- COMPONENTS ---

interface FinanceManagerProps {
  userId: string;
  userType: string;
  activeTab?: string; // Passed from App.tsx
}

export function FinanceManager({ activeTab: initialRouteId }: FinanceManagerProps) {
  // State
  const [routeId, setRouteId] = useState(initialRouteId || 'finance-overview');
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<'pending' | 'history'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  // Sync with prop changes
  useEffect(() => {
    if (initialRouteId) {
      setRouteId(initialRouteId);
      // If switching to overview, clear selection
      if (initialRouteId === 'finance-overview') {
        setSelectedDriverId(null);
      }
    }
  }, [initialRouteId]);

  // Derived Data
  const selectedDriver = useMemo(() => 
    MOCK_DRIVERS.find(d => d.id === selectedDriverId), 
    [selectedDriverId]
  );

  const filteredPayouts = useMemo(() => {
    let data = MOCK_PAYOUTS;

    // Filter by Driver
    if (selectedDriverId) {
      data = data.filter(p => p.driverId === selectedDriverId);
    }

    // Filter by Tab Status
    if (currentTab === 'pending') {
      data = data.filter(p => p.status === 'pending' || p.status === 'processing');
    } else {
      data = data.filter(p => p.status === 'paid');
    }

    // Filter by Search (Global Mode only mostly, but useful for history)
    if (searchTerm && !selectedDriverId) {
      const term = searchTerm.toLowerCase();
      data = data.filter(p => 
        p.driverName.toLowerCase().includes(term) || 
        p.id.toLowerCase().includes(term)
      );
    }

    return data;
  }, [selectedDriverId, currentTab, searchTerm]);

  // Actions
  const handleViewDriver = (driverId: string) => {
    setSelectedDriverId(driverId);
    setRouteId('driver-payouts');
    setCurrentTab('pending'); // Reset to pending tab when viewing a driver
  };

  const handleBackToOverview = () => {
    setSelectedDriverId(null);
    setRouteId('finance-overview');
    setSearchTerm('');
  };

  const handleApprovePayout = (payoutId: string) => {
    toast.success('Payout Approved', {
      description: `Payout ${payoutId} has been sent for processing.`
    });
    // In real app, update state here
  };

  const handleExport = () => {
    toast.success(`Exporting ${currentTab} payouts...`, {
      description: 'Your CSV download will start shortly.'
    });
  };

  // --- RENDER HELPERS ---

  // Determine View Mode
  const isDriverView = routeId === 'driver-payouts' && selectedDriverId;
  const isDriverSelectMode = routeId === 'driver-payouts' && !selectedDriverId;
  const isGlobalOverview = routeId === 'finance-overview' && !selectedDriverId; // Default

  // 1. DRIVER SELECTION SCREEN (If clicked "Driver Payouts" but no driver selected)
  if (isDriverSelectMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
             <h2 className="text-3xl font-bold text-slate-900">Driver Payouts</h2>
             <p className="text-slate-600 mt-1">Select a driver to view their financial details</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="p-4 border-b border-slate-200 flex gap-4">
             <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search drivers..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
               <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                 <tr>
                   <th className="px-6 py-3 font-medium">Driver Name</th>
                   <th className="px-6 py-3 font-medium">ID</th>
                   <th className="px-6 py-3 font-medium">Bank Status</th>
                   <th className="px-6 py-3 font-medium text-right">Pending Payout</th>
                   <th className="px-6 py-3 font-medium text-right">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {MOCK_DRIVERS.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase())).map(driver => (
                   <tr key={driver.id} className="hover:bg-slate-50 group">
                     <td className="px-6 py-4 font-bold text-slate-900">{driver.name}</td>
                     <td className="px-6 py-4 text-slate-500">{driver.id}</td>
                     <td className="px-6 py-4">
                       {driver.bankStatus === 'verified' ? (
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                           <CheckCircle className="w-3 h-3" /> Verified
                         </span>
                       ) : (
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                           <XCircle className="w-3 h-3" /> Unverified
                         </span>
                       )}
                     </td>
                     <td className="px-6 py-4 text-right font-bold text-slate-900">£{driver.totalPending.toFixed(2)}</td>
                     <td className="px-6 py-4 text-right">
                       <Button 
                         variant="outline" 
                         size="sm"
                         onClick={() => handleViewDriver(driver.id)}
                         className="group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200"
                       >
                         View Payouts
                       </Button>
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

  // 2. MAIN LAYOUT (Shared for Overview & Driver View)
  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {isGlobalOverview ? (
          // GLOBAL HEADER
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Finance Overview</h2>
            <p className="text-slate-600 mt-1">Global financial summary for all drivers</p>
          </div>
        ) : (
          // DRIVER HEADER
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBackToOverview}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold text-slate-900">{selectedDriver?.name}</h2>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md">
                  {selectedDriver?.id}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center gap-1.5 text-sm">
                  <span className="text-slate-500">Bank Account:</span>
                  {selectedDriver?.bankStatus === 'verified' ? (
                     <span className="text-green-600 font-medium flex items-center gap-1">
                       <CheckCircle className="w-3 h-3" /> Verified
                     </span>
                   ) : (
                     <span className="text-red-600 font-medium flex items-center gap-1">
                       <AlertCircle className="w-3 h-3" /> Not Verified
                     </span>
                   )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          {/* STATS CARDS */}
          {isGlobalOverview ? (
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 flex flex-col items-end min-w-[140px]">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Total Pending</span>
              <span className="text-2xl font-bold text-slate-900">
                £{MOCK_DRIVERS.reduce((acc, d) => acc + d.totalPending, 0).toFixed(2)}
              </span>
            </div>
          ) : (
            <>
              <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 flex flex-col items-end min-w-[120px]">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Paid</span>
                <span className="text-xl font-bold text-slate-700">£{selectedDriver?.totalPaid.toFixed(2)}</span>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 flex flex-col items-end min-w-[140px]">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Total Pending</span>
                <span className="text-2xl font-bold text-slate-900">£{selectedDriver?.totalPending.toFixed(2)}</span>
              </div>
            </>
          )}

          {/* EXPORT BUTTON */}
          <Button 
            onClick={handleExport}
            className="bg-slate-900 text-white hover:bg-slate-800 h-auto px-5 shadow-lg shadow-slate-900/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        
        {/* TABS */}
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          <button 
            onClick={() => setCurrentTab('pending')}
            className={`
              relative px-8 py-4 text-sm font-medium transition-all
              ${currentTab === 'pending' 
                ? 'text-blue-600 bg-white border-t-2 border-t-blue-600 shadow-sm z-10' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }
            `}
          >
            Pending Payouts
            {currentTab === 'pending' && <span className="absolute bottom-0 left-0 right-0 h-px bg-white" />}
          </button>
          <button 
            onClick={() => setCurrentTab('history')}
            className={`
              relative px-8 py-4 text-sm font-medium transition-all
              ${currentTab === 'history' 
                ? 'text-blue-600 bg-white border-t-2 border-t-blue-600 shadow-sm z-10' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }
            `}
          >
            Payment History
             {currentTab === 'history' && <span className="absolute bottom-0 left-0 right-0 h-px bg-white" />}
          </button>
        </div>

        {/* TABLE HEADER (Unified) */}
        <div className="flex-1 flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-xs border-b border-slate-200">
                <tr>
                  {isGlobalOverview && <th className="px-6 py-4 font-medium w-1/5">Driver</th>}
                  <th className="px-6 py-4 font-medium">Period</th>
                  <th className="px-6 py-4 font-medium text-center">Jobs</th>
                  <th className="px-6 py-4 font-medium text-right">Gross</th>
                  <th className="px-6 py-4 font-medium text-right">Extras</th>
                  <th className="px-6 py-4 font-medium text-right text-red-600">Fees</th>
                  <th className="px-6 py-4 font-medium text-right">Net Payout</th>
                  <th className="px-6 py-4 font-medium text-center">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayouts.length === 0 ? (
                  <tr>
                    <td colSpan={isGlobalOverview ? 9 : 8} className="py-24 text-center">
                       <div className="flex flex-col items-center gap-3">
                         <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                           <Calendar className="w-6 h-6 text-slate-400" />
                         </div>
                         <p className="text-slate-500 font-medium">
                           {currentTab === 'pending' ? 'No pending payouts found' : 'No payment history found'}
                         </p>
                       </div>
                    </td>
                  </tr>
                ) : (
                  filteredPayouts.map((payout) => (
                    <tr 
                      key={payout.id} 
                      className={`
                        hover:bg-slate-50 transition-colors group
                        ${selectedDriverId && selectedDriverId !== payout.driverId ? 'opacity-50' : ''}
                      `}
                    >
                      {isGlobalOverview && (
                        <td className="px-6 py-4">
                           <div className="font-bold text-slate-900">{payout.driverName}</div>
                           <div className="text-xs text-slate-500">{payout.driverId}</div>
                        </td>
                      )}
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {payout.periodStart} - {payout.periodEnd}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
                          {payout.jobsCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-500">£{payout.grossAmount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right text-green-600 text-xs font-medium">+£{payout.extrasAmount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right text-red-500 text-xs font-medium">-£{payout.feesAmount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900 text-base">£{payout.netAmount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">
                         {payout.status === 'pending' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>}
                         {payout.status === 'processing' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Processing</span>}
                         {payout.status === 'paid' && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Paid</span>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isGlobalOverview ? (
                          // GLOBAL ACTIONS
                          <div className="flex justify-end gap-2">
                            {payout.status === 'pending' ? (
                               <Button 
                                 size="sm" 
                                 onClick={() => handleViewDriver(payout.driverId)}
                                 className="bg-slate-900 text-white hover:bg-slate-800 h-8 text-xs"
                               >
                                 Review
                               </Button>
                            ) : (
                               <Button 
                                 variant="outline"
                                 size="sm" 
                                 onClick={() => handleViewDriver(payout.driverId)}
                                 className="h-8 text-xs"
                               >
                                 View Details
                               </Button>
                            )}
                          </div>
                        ) : (
                          // DRIVER ACTIONS
                          <div className="flex justify-end gap-2">
                             {currentTab === 'pending' ? (
                               <>
                                 <Button 
                                   variant="outline"
                                   size="sm" 
                                   className="h-8 text-xs"
                                 >
                                   Review
                                 </Button>
                                 <Button 
                                   size="sm" 
                                   onClick={() => handleApprovePayout(payout.id)}
                                   className="bg-green-600 hover:bg-green-700 text-white h-8 text-xs gap-1"
                                 >
                                   <CreditCard className="w-3 h-3" />
                                   Generate Payout
                                 </Button>
                               </>
                             ) : (
                               <Button 
                                 variant="ghost" 
                                 size="sm"
                                 className="h-8 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                               >
                                 View Receipt
                               </Button>
                             )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
