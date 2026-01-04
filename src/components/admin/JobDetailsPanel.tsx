import React from 'react';
import { Job } from '../../utils/jobStatusManager';
import { 
  X, MapPin, Calendar, Clock, Truck, User, 
  Package, CheckCircle, AlertTriangle, RefreshCcw, 
  XCircle, Navigation, Phone, Mail, FileText, ChevronRight, ArrowRight 
} from 'lucide-react';
import { Button } from '../ui/button';
import mapPlaceholder from '../../imports/map-placeholder.png'; // Assuming you might have an asset like this, or we can use a colored div as before but better styled

interface JobDetailsPanelProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onAction?: (action: string, jobId: string) => void;
}

export function JobDetailsPanel({ job, isOpen, onClose, onAction }: JobDetailsPanelProps) {
  if (!isOpen) return null;

  // Mock Items List (as requested in spec)
  const mockItems = [
    { qty: 3, name: 'Television' },
    { qty: 2, name: 'Tool Box' },
    { qty: 1, name: 'Ironing Board' },
    { qty: 6, name: 'Tools' },
    { qty: 1, name: 'Garden Set' },
    { qty: 1, name: 'Coffee Table' },
    { qty: 2, name: 'Armchair' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity" 
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-[60] flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* HEADER */}
        <div className="px-6 py-6 border-b border-slate-100 bg-white">
          <div className="flex items-center justify-between mb-3">
             <div className="flex items-center gap-3">
               <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-bold border border-slate-200">
                 {job.id}
               </span>
               <a href="#" className="text-sm text-blue-500 hover:underline">View listing page</a>
             </div>
             <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
               <X className="w-5 h-5 text-slate-400" />
             </button>
          </div>

          <h2 className="text-xl font-bold text-slate-900 leading-snug mb-1">
            {job.service || '3 Bed House'} / 2 People / 20.0 m³ to 24.0 m³
          </h2>
          <p className="text-slate-500 text-sm mb-4">
            {new Date(job.date).toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <div className="text-2xl font-bold text-slate-900 mb-2">£{job.customerPrice}</div>
          <p className="text-slate-400 text-sm font-bold">Admin</p>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto">
          
          {/* ACTION BUTTONS */}
          <div className="p-6 pb-0 flex gap-3">
             <Button className="flex-1 bg-[#2ea3f2] hover:bg-[#2589cc] text-white shadow-none font-bold">
               Complete
             </Button>
             <Button className="flex-1 bg-[#2ea3f2] hover:bg-[#2589cc] text-white shadow-none font-bold">
               Complete with issues
             </Button>
          </div>

          {/* ASSIGNMENT */}
          <div className="p-6 space-y-3 text-sm">
            <div className="grid grid-cols-[80px_1fr] items-baseline gap-2">
               <span className="font-bold text-slate-900">Vehicle</span>
               <span className="text-slate-600">{job.driverName ? 'Luton Van' : 'No vehicle assigned'}</span>
            </div>
            <div className="grid grid-cols-[80px_1fr] items-baseline gap-2">
               <span className="font-bold text-slate-900">Driver</span>
               <div className="flex gap-2">
                 <span className="text-slate-600">{job.driverName || 'No driver assigned'}</span>
                 <a href="#" className="text-blue-500 hover:underline">Change driver</a>
               </div>
            </div>
            <div className="grid grid-cols-[80px_1fr] items-center gap-2">
               <span className="font-bold text-slate-900">Job sheet</span>
               <a href="#" className="text-blue-500 hover:underline flex items-center gap-1">
                 <FileText className="w-3.5 h-3.5" /> View Job Sheet
               </a>
            </div>
            
            <button className="text-red-500 hover:underline text-sm mt-2 flex items-center gap-1">
               <X className="w-3.5 h-3.5" /> Deallocate me
            </button>
          </div>

          {/* JOB DETAILS HEADER */}
          <div className="px-6 pb-2">
            <h3 className="text-slate-500 font-normal text-lg">Job details</h3>
          </div>

          {/* BOX MAP SECTION - Replaced per request */}
          <div className="w-full h-64 bg-[#eef0f2] relative mb-6 border-y border-slate-200">
             {/* Map Background */}
             <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none select-none overflow-hidden">
                {/* Simulated Map Pattern */}
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
             </div>
             
             {/* Route Line */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path d="M100 80 Q 250 150, 400 120" stroke="#94a3b8" strokeWidth="4" fill="none" strokeDasharray="8 4" />
             </svg>

             {/* Markers Container */}
             <div className="absolute inset-0">
                {/* Pickup Marker */}
                <div className="absolute top-[80px] left-[100px] -translate-x-1/2 -translate-y-full flex flex-col items-center group cursor-pointer hover:z-10">
                   <div className="bg-orange-500 text-white w-8 h-10 flex items-center justify-center rounded shadow-lg font-bold text-sm relative z-10 
                                after:content-[''] after:absolute after:bottom-[-6px] after:left-1/2 after:-translate-x-1/2 after:border-[6px] after:border-transparent after:border-t-orange-500">
                      1
                   </div>
                   <div className="mt-2 bg-white px-2 py-1 rounded shadow-md text-xs font-bold text-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity absolute top-full">
                      Pickup: {job.pickup.postcode}
                   </div>
                </div>

                {/* Delivery Marker */}
                <div className="absolute top-[120px] left-[400px] -translate-x-1/2 -translate-y-full flex flex-col items-center group cursor-pointer hover:z-10">
                   <div className="bg-lime-500 text-white w-8 h-10 flex items-center justify-center rounded shadow-lg font-bold text-sm relative z-10 
                                after:content-[''] after:absolute after:bottom-[-6px] after:left-1/2 after:-translate-x-1/2 after:border-[6px] after:border-transparent after:border-t-lime-500">
                      2
                   </div>
                   <div className="mt-2 bg-white px-2 py-1 rounded shadow-md text-xs font-bold text-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity absolute top-full">
                      Drop: {job.delivery.postcode}
                   </div>
                </div>
             </div>

             {/* Map Controls */}
             <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <button className="w-8 h-8 bg-white rounded shadow text-slate-600 flex items-center justify-center hover:bg-slate-50 font-bold">+</button>
                <button className="w-8 h-8 bg-white rounded shadow text-slate-600 flex items-center justify-center hover:bg-slate-50 font-bold">-</button>
             </div>
          </div>

          {/* LOCATIONS */}
          <div className="px-6 space-y-8 mb-8">
             {/* Pickup */}
             <div className="grid grid-cols-[80px_1fr] gap-2">
               <span className="font-bold text-slate-900">Pickup</span>
               <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-700 text-sm">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{job.date}, {job.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{job.pickup.address.split(',')[0]}, {job.pickup.postcode.split(' ')[0]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 text-sm">
                    {/* Stairs Icon Mock */}
                    <div className="w-4 h-4 flex flex-col justify-center gap-0.5">
                       <div className="h-0.5 w-2 bg-slate-400 ml-auto"></div>
                       <div className="h-0.5 w-4 bg-slate-400"></div>
                    </div>
                    <span>Ground floor</span>
                  </div>
               </div>
             </div>

             {/* Delivery */}
             <div className="grid grid-cols-[80px_1fr] gap-2">
               <span className="font-bold text-slate-900">Delivery</span>
               <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-700 text-sm">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Same day</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{job.delivery.address.split(',')[0]}, {job.delivery.postcode.split(' ')[0]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 text-sm">
                     <div className="w-4 h-4 flex flex-col justify-center gap-0.5">
                       <div className="h-0.5 w-2 bg-slate-400 ml-auto"></div>
                       <div className="h-0.5 w-4 bg-slate-400"></div>
                    </div>
                    <span>Ground floor</span>
                  </div>
               </div>
             </div>
          </div>

          {/* METRICS */}
          <div className="px-6 space-y-3 mb-8 text-sm">
             <div className="grid grid-cols-[100px_1fr]">
               <span className="font-bold text-slate-900">Created</span>
               <span className="text-slate-600">November 7, 2025</span>
             </div>
             <div className="grid grid-cols-[100px_1fr]">
               <span className="font-bold text-slate-900">Distance</span>
               <span className="text-slate-600">21 mile</span>
             </div>
             <div className="grid grid-cols-[100px_1fr]">
               <span className="font-bold text-slate-900">Capacity</span>
               <span className="text-slate-600">{job.capacity || '21.4'}m³</span>
             </div>
             <div className="grid grid-cols-[100px_1fr]">
               <span className="font-bold text-slate-900">People</span>
               <span className="text-slate-600">2</span>
             </div>
          </div>

          {/* ITEMS LIST */}
          <div className="px-6 pb-12">
             <h3 className="text-slate-500 font-normal text-lg mb-4">Items</h3>
             <ul className="space-y-2 text-sm text-slate-700">
               {mockItems.map((item, idx) => (
                 <li key={idx} className="flex items-start gap-2">
                   <span className="mt-1.5 w-1 h-1 bg-slate-400 rounded-full flex-shrink-0"></span>
                   <span>{item.qty} x {item.name}</span>
                 </li>
               ))}
             </ul>
          </div>

        </div>
      </div>
    </>
  );
}

