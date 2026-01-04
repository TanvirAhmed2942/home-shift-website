import React from 'react';
import { Job } from '../../utils/jobStatusManager';
import { 
  Calendar, MapPin, Truck, AlertTriangle, 
  CheckCircle, Clock, Package, MoreHorizontal, User, Navigation, ChevronRight 
} from 'lucide-react';

interface JobCardProps {
  job: Job;
  onClick: () => void;
  compact?: boolean; 
}

export function JobCard({ job, onClick, compact = false }: JobCardProps) {
  const isPremium = job.customerPrice > 400;

  // Status-based accent colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-500 bg-green-50/30';
      case 'in-progress': return 'border-blue-500 bg-blue-50/30';
      case 'cancelled': return 'border-red-500 bg-red-50/30';
      case 'assigned': return 'border-purple-500 bg-purple-50/30';
      default: return 'border-slate-300 bg-slate-50/30';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
        case 'in-progress': return 'text-blue-700 bg-blue-100';
        case 'completed': return 'text-green-700 bg-green-100';
        case 'cancelled': return 'text-red-700 bg-red-100';
        case 'assigned': return 'text-purple-700 bg-purple-100';
        default: return 'text-slate-700 bg-slate-100';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`group bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden ${compact ? 'p-3' : 'p-0'}`}
    >
      {/* ShiftMyHome Distinct Style: Left Accent Border */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getStatusColor(job.status).split(' ')[0]}`} />

      {/* Header (Only for full view) */}
      {!compact && (
        <div className="pl-5 pr-4 py-2.5 bg-slate-50/80 border-b border-slate-100 flex justify-between items-center backdrop-blur-sm">
           <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Accepted on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
           </span>
           <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${getStatusBadge(job.status)}`}>
              {job.status === 'in-progress' ? 'On Route' : job.status}
           </span>
        </div>
      )}

      <div className={`${compact ? 'pl-3' : 'pl-5 p-4'}`}>
        {/* Title Row */}
        <div className="flex justify-between items-start mb-2">
           <div className="flex-1 pr-4">
              <h4 className="font-bold text-slate-900 text-[15px] leading-tight">
                {job.service || '3 Bed House Move'} 
                {!compact && <span className="text-slate-400 font-normal text-xs ml-2">/ {job.capacity || '20m³'}</span>}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                 <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">#{job.id}</span>
                 {isPremium && (
                    <span className="px-1.5 py-0.5 bg-yellow-400 text-black text-[10px] font-bold uppercase rounded shadow-sm">
                      Premium
                    </span>
                 )}
              </div>
           </div>
           
           {/* Price (Always Visible) */}
           <div className="text-right">
              <span className="block font-black text-slate-900 text-lg">£{job.customerPrice}</span>
              {!compact && <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total</span>}
           </div>
        </div>

        {/* Route Row */}
        <div className="mb-3">
           <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
             <div className="flex flex-col gap-1 items-center py-1">
                <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                <div className="w-0.5 h-3 bg-slate-200"></div>
                <div className="w-2 h-2 rounded-full bg-slate-900"></div>
             </div>
             <div className="flex flex-col gap-1 flex-1">
                <span className="truncate">{job.pickup.address.split(',')[0]} <span className="text-slate-400 font-normal">({job.pickup.postcode.split(' ')[0]})</span></span>
                <span className="truncate">{job.delivery.address.split(',')[0]} <span className="text-slate-400 font-normal">({job.delivery.postcode.split(' ')[0]})</span></span>
             </div>
           </div>
        </div>

        {/* Footer: Assignment (Hidden in compact) */}
        {!compact && (
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
             <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-2 py-1 rounded-lg">
                   <Truck className="w-3.5 h-3.5 text-blue-500" />
                   <span className="font-medium">{job.driverName || 'Unassigned'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                   <Clock className="w-3.5 h-3.5" />
                   <span>{job.date}, {job.time}</span>
                </div>
             </div>

             <div className="flex items-center gap-2 text-blue-600 font-bold text-xs hover:underline">
                View Details <ChevronRight className="w-3 h-3" />
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

