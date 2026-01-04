import React, { useState } from 'react';
import { X, MapPin, Clock, Camera, FileText, CheckCircle, AlertTriangle, User, Phone, Mail, Truck, DollarSign, CreditCard, RotateCcw, AlertCircle, History, Shield, Lock } from 'lucide-react';
import { Job } from '../../utils/jobStatusManager';
import { auditLogger, AuditLogEntry } from '../../utils/auditLogger';
import { authManager } from '../../utils/authManager';

interface RefundModalProps {
  job: Job;
  onClose: () => void;
  onConfirm: (data: RefundData) => void;
}

interface RefundData {
  type: 'full' | 'partial';
  amount: number;
  reason: string;
  notes?: string;
}

function RefundModal({ job, onClose, onConfirm }: RefundModalProps) {
  const [type, setType] = useState<'full' | 'partial'>('full');
  const [amount, setAmount] = useState<number>(job.customerPrice || 0);
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  const handleConfirm = () => {
    if (!reason) return alert('Please select a reason');
    if (type === 'partial' && (amount <= 0 || amount > (job.customerPrice || 0))) {
        return alert('Invalid refund amount');
    }
    
    onConfirm({
      type,
      amount: type === 'full' ? (job.customerPrice || 0) : amount,
      reason: reason === 'Other' ? otherReason : reason,
      notes: otherReason
    });
  };

  // Logic checks based on job status
  const isJobCompleted = job.status === 'completed';
  const isJobInProgress = job.status === 'in-progress' || job.status === 'picked-up';
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 bg-red-50 flex justify-between items-center">
          <div className="flex items-center gap-2 text-red-700">
            <RotateCcw className="w-5 h-5" />
            <h3 className="font-bold text-lg">Process Refund</h3>
          </div>
          <button onClick={onClose}><X className="w-6 h-6 text-red-400 hover:text-red-600" /></button>
        </div>
        
        <div className="p-6 space-y-6">
           {/* Warning Banner based on Job Status */}
           <div className={`p-3 rounded-lg border flex gap-3 text-sm ${
               !isJobCompleted && !isJobInProgress ? 'bg-green-50 border-green-200 text-green-800' :
               isJobCompleted ? 'bg-orange-50 border-orange-200 text-orange-800' :
               'bg-blue-50 border-blue-200 text-blue-800'
           }`}>
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                 <strong>Status: {job.status.toUpperCase()}</strong>
                 <p className="mt-1">
                   { !isJobCompleted && !isJobInProgress ? 'Job not started. Driver payout will be reset to £0.' :
                     isJobCompleted ? 'Job completed. Refund requires dispute/damage verification.' :
                     'Job in progress. Driver payout requires manual recalculation.'
                   }
                 </p>
              </div>
           </div>

           {/* Refund Type */}
           <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700">Refund Type</label>
              <div className="grid grid-cols-2 gap-3">
                 <button 
                   onClick={() => { setType('full'); setAmount(job.customerPrice || 0); }}
                   className={`p-3 rounded-xl border text-sm font-medium transition-all ${type === 'full' ? 'bg-red-600 text-white border-red-600 shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                 >
                    Full Refund
                 </button>
                 <button 
                   onClick={() => setType('partial')}
                   className={`p-3 rounded-xl border text-sm font-medium transition-all ${type === 'partial' ? 'bg-red-600 text-white border-red-600 shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                 >
                    Partial Refund
                 </button>
              </div>
           </div>

           {/* Amount Input (Only for Partial) */}
           {type === 'partial' && (
             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Refund Amount (£)</label>
                <div className="relative">
                   <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input 
                     type="number" 
                     value={amount}
                     onChange={(e) => setAmount(Number(e.target.value))}
                     className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-500 outline-none"
                   />
                </div>
                <p className="text-xs text-slate-500">Max refundable: £{job.customerPrice}</p>
             </div>
           )}

           {/* Reason */}
           <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Reason (Mandatory)</label>
              <select 
                value={reason} 
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-200 outline-none bg-white"
              >
                 <option value="">Select a reason...</option>
                 <option value="Cancelled Job">Cancelled Job</option>
                 <option value="Driver No-show">Driver No-show</option>
                 <option value="Delay">Delay</option>
                 <option value="Damage">Damage</option>
                 <option value="Pricing Error">Pricing Error</option>
                 <option value="Other">Other</option>
              </select>
           </div>

           {/* Other Reason Text */}
           {reason === 'Other' && (
              <textarea 
                placeholder="Please specify details..."
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg h-20 text-sm focus:ring-2 focus:ring-red-200 outline-none resize-none"
              />
           )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
           <button onClick={onClose} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
           <button 
             onClick={handleConfirm}
             className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-sm transition-colors flex items-center gap-2"
           >
              <RotateCcw className="w-4 h-4" />
              Confirm Refund
           </button>
        </div>
      </div>
    </div>
  );
}


interface AdminJobDetailsModalProps {
  job: Job;
  onClose: () => void;
}

export function AdminJobDetailsModal({ job, onClose }: AdminJobDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'photos' | 'financial' | 'audit'>('details');
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundInfo, setRefundInfo] = useState<{amount: number, date: string, reason: string} | null>(null);
  
  // Fetch logs for this job
  const [jobLogs, setJobLogs] = useState<AuditLogEntry[]>([]);
  const currentUser = authManager.getUser();

  // Permissions
  const canProcessRefund = authManager.hasPermission('PROCESS_REFUND');
  const canApprovePayout = authManager.hasPermission('APPROVE_PAYOUT');

  useEffect(() => {
    if (activeTab === 'audit') {
      setJobLogs(auditLogger.getLogs(job.id));
    }
  }, [activeTab, job.id]);

  const handleRefundConfirm = (data: RefundData) => {
      console.log("Processing Refund:", data);
      
      // LOG TO AUDIT SYSTEM
      auditLogger.log({
          user: currentUser.name,
          role: currentUser.role,
          action: `Refund Processed (${data.type})`,
          details: `Amount: £${data.amount}, Reason: ${data.reason}. Notes: ${data.notes || 'N/A'}`,
          jobId: job.id,
          type: 'refund'
      });
      
      // Update local logs if we are on that tab (or force refresh next time)
      if (activeTab === 'audit') {
          setJobLogs(auditLogger.getLogs(job.id));
      }

      // MOCK BACKEND LOGIC
      // 1. Update Job Status
      if (data.type === 'full') {
          // job.status = 'refunded'; (In real app, call updateJob)
      } else {
          // job.status = 'partially-refunded';
      }

      // 2. Handle Payment Method
      console.log(`Calling Stripe Refund API for amount: £${data.amount}...`);

      // 3. Update Driver Payout Logic
      if (job.status !== 'completed' && job.status !== 'in-progress' && job.status !== 'picked-up') {
          // Rule A: Not completed -> Driver Pay £0
          setFinancialData(prev => ({ ...prev, basePay: 0, status: 'approved' })); // Or 'cancelled' status for pay
      } else if (job.status === 'in-progress' || job.status === 'picked-up') {
          // Rule B: Partially completed -> Recalculate (Manual block)
          setFinancialData(prev => ({ ...prev, status: 'pending' })); // Reset to pending for review
          alert("Driver payout status reset to PENDING for manual review.");
      } else {
          // Rule C: Completed -> Do not auto-delete payout
          // Leave as is, just log refund
      }

      setRefundInfo({
          amount: data.amount,
          date: new Date().toLocaleString(),
          reason: data.reason
      });

      setShowRefundModal(false);
  };

  if (!job) return null;

  const collectionPhotos = job.photos?.filter(p => p.type === 'pickup') || [];
  const dropoffPhotos = job.photos?.filter(p => p.type === 'dropoff') || [];

  // MOCK FINANCIAL DATA STATE (Simulating backend)
  const [financialData, setFinancialData] = useState({
      basePay: job.driverPrice || 0,
      extras: 0,
      deductions: 0,
      status: 'pending' as 'pending' | 'approved' | 'paid'
  });

  const netPay = financialData.basePay + financialData.extras - financialData.deductions;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold">Job #{job.reference || job.id}</h2>
              <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                job.status === 'completed' ? 'bg-green-500 text-white' :
                job.status === 'in-progress' ? 'bg-blue-500 text-white' :
                'bg-slate-700 text-slate-300 border border-slate-600'
              }`}>
                {job.status}
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">{job.service} • {job.date} • {job.time}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-slate-200 px-6 flex gap-6">
            <button 
              onClick={() => setActiveTab('details')}
              className={`py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              Job Details
            </button>
            <button 
              onClick={() => setActiveTab('financial')}
              className={`py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'financial' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              Charges & Payments
            </button>
            <button 
              onClick={() => setActiveTab('audit')}
              className={`py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'audit' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'} flex items-center gap-2`}
            >
              <History className="w-4 h-4" />
              Audit Log
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
          
          {activeTab === 'financial' ? (
            <div className="max-w-3xl mx-auto space-y-6">
               {/* 1. CUSTOMER PAYMENTS SECTION */}
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                     <div>
                       <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-slate-500" />
                          Customer Charges
                       </h3>
                       <p className="text-sm text-slate-500">Payment method: <span className="font-mono font-bold">Card (Stripe)</span></p>
                     </div>
                     <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                         refundInfo ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                     }`}>
                         {refundInfo ? (refundInfo.amount === job.customerPrice ? 'Fully Refunded' : 'Partially Refunded') : 'Paid'}
                     </div>
                  </div>
                  
                  <div className="p-6">
                     <div className="flex justify-between items-center mb-6">
                        <span className="text-slate-600 font-medium">Total Charge</span>
                        <span className="font-bold text-2xl text-slate-900">£{job.customerPrice?.toFixed(2)}</span>
                     </div>

                     {refundInfo && (
                        <div className="mb-6 bg-red-50 border border-red-100 rounded-lg p-4">
                           <div className="flex justify-between items-start">
                              <div>
                                 <p className="text-xs font-bold text-red-700 uppercase mb-1">Refund Issued</p>
                                 <p className="text-sm text-red-900 font-medium">Reason: {refundInfo.reason}</p>
                                 <p className="text-xs text-red-500 mt-1">{refundInfo.date}</p>
                              </div>
                              <span className="text-lg font-bold text-red-600">-£{refundInfo.amount.toFixed(2)}</span>
                           </div>
                        </div>
                     )}

                     {!refundInfo && (
                        <div className="flex justify-end pt-4 border-t border-slate-100">
                           {canProcessRefund ? (
                             <button 
                               onClick={() => setShowRefundModal(true)}
                               className="px-4 py-2 border border-red-200 text-red-700 hover:bg-red-50 rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
                             >
                                <RotateCcw className="w-4 h-4" />
                                Process Refund
                             </button>
                           ) : (
                             <div className="flex items-center gap-2 text-slate-400 text-sm px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
                                <Lock className="w-4 h-4" />
                                Refund Restricted ({currentUser.role})
                             </div>
                           )}
                        </div>
                     )}
                  </div>
               </div>

               {/* 2. DRIVER EARNINGS SECTION */}
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                     <div>
                       <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                          <Truck className="w-5 h-5 text-slate-500" />
                          Driver Earnings
                       </h3>
                       <p className="text-sm text-slate-500">Calculated for {job.driverName || 'Assigned Driver'}</p>
                     </div>
                     <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                         financialData.status === 'paid' ? 'bg-green-100 text-green-700' : 
                         financialData.status === 'approved' ? 'bg-blue-100 text-blue-700' : 
                         'bg-orange-100 text-orange-700'
                     }`}>
                         {financialData.status}
                     </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                     <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-slate-600">Base Job Pay</span>
                        <span className="font-mono font-medium">£{financialData.basePay.toFixed(2)}</span>
                     </div>
                     
                     <div className="flex justify-between items-center py-2 border-b border-slate-100 group">
                        <div className="flex items-center gap-2">
                           <span className="text-slate-600">Extras / Adjustments</span>
                           {financialData.status === 'pending' && (
                              <button 
                                onClick={() => setFinancialData(prev => ({ ...prev, extras: prev.extras + 10 }))}
                                className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded hover:bg-green-100 border border-green-200 transition-colors"
                              >
                                + Add £10
                              </button>
                           )}
                        </div>
                        <span className="font-mono font-medium text-green-600">+£{financialData.extras.toFixed(2)}</span>
                     </div>
                     
                     <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                           <span className="text-slate-600">Deductions / Penalties</span>
                            {financialData.status === 'pending' && (
                              <button 
                                onClick={() => setFinancialData(prev => ({ ...prev, deductions: prev.deductions + 10 }))}
                                className="px-2 py-0.5 bg-red-50 text-red-600 text-xs rounded hover:bg-red-100 border border-red-200 transition-colors"
                              >
                                + Add £10
                              </button>
                           )}
                        </div>
                        <span className="font-mono font-medium text-red-600">-£{financialData.deductions.toFixed(2)}</span>
                     </div>
                     
                     <div className="flex justify-between items-center py-4">
                        <span className="font-bold text-slate-900 text-lg">Net Payable</span>
                        <span className="font-bold text-slate-900 text-2xl">£{netPay.toFixed(2)}</span>
                     </div>
                  </div>

                  <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                     {financialData.status === 'pending' && (
                         canApprovePayout ? (
                           <button 
                             onClick={() => {
                               setFinancialData(prev => ({ ...prev, status: 'approved' }));
                               auditLogger.log({
                                   user: currentUser.name,
                                   role: currentUser.role,
                                   action: 'Approved Driver Payout',
                                   details: `Net Amount: £${netPay.toFixed(2)}`,
                                   jobId: job.id,
                                   type: 'approve'
                               });
                             }}
                             className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2"
                           >
                             <CheckCircle className="w-4 h-4" />
                             Approve for Payout
                           </button>
                         ) : (
                           <div className="flex items-center gap-2 text-slate-400 text-sm px-4 py-2 bg-slate-100 rounded-lg border border-slate-200">
                               <Lock className="w-4 h-4" />
                               Approval Restricted
                           </div>
                         )
                     )}
                     {financialData.status === 'approved' && (
                         <span className="text-sm text-slate-500 italic flex items-center gap-2">
                             <CheckCircle className="w-4 h-4 text-green-500" />
                             Approved - Scheduled for next payout cycle
                         </span>
                     )}
                  </div>
               </div>

               <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                     <h4 className="font-bold text-blue-900 text-sm">Payout Policy</h4>
                     <p className="text-xs text-blue-800 mt-1">
                        Payouts are processed 3-7 days after job completion to allow for any customer disputes. 
                        Once approved, the funds will be released to the driver's connected Stripe account.
                     </p>
                  </div>
               </div>
            </div>
          ) : activeTab === 'audit' ? (
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                     <History className="w-5 h-5 text-slate-500" />
                     Activity Timeline
                  </h3>
                  <span className="text-xs text-slate-500">{jobLogs.length} entries found</span>
               </div>
               <div className="p-0">
                  {jobLogs.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {jobLogs.map((log) => (
                        <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex gap-4">
                           <div className="flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                  log.type === 'refund' ? 'bg-red-100 text-red-700' :
                                  log.type === 'approve' ? 'bg-green-100 text-green-700' :
                                  log.type === 'create' ? 'bg-blue-100 text-blue-700' :
                                  'bg-slate-100 text-slate-600'
                              }`}>
                                  {log.user.charAt(0)}
                              </div>
                              <div className="w-px h-full bg-slate-100 mt-2"></div>
                           </div>
                           <div className="flex-1">
                              <div className="flex justify-between items-start">
                                 <div>
                                    <p className="font-medium text-slate-900">{log.action}</p>
                                    <p className="text-sm text-slate-500 mt-0.5">{log.details || 'No details'}</p>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-xs text-slate-400 font-mono">{auditLogger.formatDate(log.timestamp)}</p>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                                      {log.role}
                                    </span>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                 <User className="w-3 h-3 text-slate-400" />
                                 <span className="text-xs text-slate-600">{log.user}</span>
                              </div>
                           </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center text-slate-500">
                       <History className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                       <p>No audit logs found for this job.</p>
                    </div>
                  )}
               </div>
            </div>
          ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              
              {/* LEFT: COLLECTION SECTION */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
                <div className="px-5 py-3 border-b border-slate-200 bg-blue-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">A</div>
                    <h3 className="font-bold text-slate-800">COLLECTION</h3>
                  </div>
                  {job.startedAt && <span className="text-xs font-mono text-slate-500">{new Date(job.startedAt).toLocaleTimeString()}</span>}
                </div>
                
                <div className="p-5 space-y-6 flex-1">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <p className="font-bold text-lg text-slate-900">{job.pickup.address}</p>
                      <p className="text-slate-500">{job.pickup.postcode}</p>
                      <div className="mt-2 text-sm bg-slate-50 p-2 rounded border border-slate-100 text-slate-600">
                        <strong>Access Notes:</strong> {job.pickup.details || 'Ground floor, street parking available.'}
                      </div>
                    </div>
                  </div>

                  {/* Evidence / Photos */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Mandatory Photos</h4>
                    {collectionPhotos.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {collectionPhotos.map(photo => (
                          <div key={photo.id} className="aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative group cursor-pointer">
                            <img src={photo.url} alt="Proof" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs">
                              {new Date(photo.uploadedAt).toLocaleTimeString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-red-200 bg-red-50 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                        <Camera className="w-8 h-8 text-red-300 mb-2" />
                        <p className="text-sm font-bold text-red-700">Missing Collection Photos</p>
                        <p className="text-xs text-red-500 mt-1">Job cannot be verified without proof.</p>
                      </div>
                    )}
                  </div>

                  {/* Timeline */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Driver Arrived</span>
                      <span className="font-mono font-medium">{job.startedAt ? new Date(job.startedAt).toLocaleTimeString() : '--:--'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Loading Started</span>
                      <span className="font-mono font-medium">--:--</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Departed</span>
                      <span className="font-mono font-medium">--:--</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: DROP-OFF SECTION */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
                <div className="px-5 py-3 border-b border-slate-200 bg-green-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">B</div>
                    <h3 className="font-bold text-slate-800">DROP-OFF</h3>
                  </div>
                  {job.completedAt && <span className="text-xs font-mono text-slate-500">{new Date(job.completedAt).toLocaleTimeString()}</span>}
                </div>
                
                <div className="p-5 space-y-6 flex-1">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <p className="font-bold text-lg text-slate-900">{job.delivery.address}</p>
                      <p className="text-slate-500">{job.delivery.postcode}</p>
                      <div className="mt-2 text-sm bg-slate-50 p-2 rounded border border-slate-100 text-slate-600">
                        <strong>Access Notes:</strong> {job.delivery.details || 'Has lift, 2nd floor.'}
                      </div>
                    </div>
                  </div>

                  {/* Evidence / Photos */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Mandatory Photos</h4>
                    {dropoffPhotos.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {dropoffPhotos.map(photo => (
                          <div key={photo.id} className="aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative group cursor-pointer">
                            <img src={photo.url} alt="Proof" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs">
                              {new Date(photo.uploadedAt).toLocaleTimeString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-red-200 bg-red-50 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                        <Camera className="w-8 h-8 text-red-300 mb-2" />
                        <p className="text-sm font-bold text-red-700">Missing Drop-off Photos</p>
                        <p className="text-xs text-red-500 mt-1">Job cannot be marked complete without proof.</p>
                      </div>
                    )}
                  </div>

                  {/* Timeline */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Driver Arrived</span>
                      <span className="font-mono font-medium">--:--</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Unloading Finished</span>
                      <span className="font-mono font-medium">--:--</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Completed</span>
                      <span className="font-mono font-medium">{job.completedAt ? new Date(job.completedAt).toLocaleTimeString() : '--:--'}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Customer & Driver Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-500" /> Customer
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-sm">Name</span>
                    <span className="font-medium">{job.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-sm">Phone</span>
                    <span className="font-medium">{job.customerPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-sm">Email</span>
                    <span className="font-medium">{job.customerEmail}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-slate-500" /> Assigned Driver
                </h4>
                {job.driverName ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-sm">Name</span>
                      <span className="font-medium">{job.driverName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-sm">Phone</span>
                      <span className="font-medium">{job.driverPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-sm">Vehicle</span>
                      <span className="font-medium">{job.vehicle}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-orange-50 text-orange-700 p-3 rounded-lg text-sm text-center font-medium">
                    No Driver Assigned
                  </div>
                )}
              </div>
            </div>
          </>
          )}
        </div>
      </div>

      {showRefundModal && (
        <RefundModal 
          job={job} 
          onClose={() => setShowRefundModal(false)} 
          onConfirm={handleRefundConfirm}
        />
      )}
    </div>
  );
}
