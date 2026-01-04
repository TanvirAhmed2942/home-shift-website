import React, { useState } from 'react';
import { 
  ArrowLeft, MapPin, Clock, Calendar, CheckCircle, 
  AlertTriangle, Play, Trash2, Edit3, Eye, Navigation, 
  User, Truck, DollarSign, Share2, MoreHorizontal, FileText,
  XCircle, Send, Package
} from 'lucide-react';
import { Button } from '../ui/button';
import { JourneyStatus } from './JourneyCard';
import { JobCard } from './JobCard'; // Reusing your existing JobCard

// Mock Data Interfaces
interface JourneyDetails {
  id: string;
  title: string;
  price: number;
  status: JourneyStatus;
  driverName?: string;
  vehicleReg?: string;
  date: string;
  
  // Stats
  totalJobs: number;
  totalMiles: number;
  totalTime: string;
  capacity: number;
  people: number;
  
  // Locations
  startLocation: string;
  startTime: string;
  endLocation: string;
  endTime: string;
  
  // Breakdown
  breakdown: {
    drivingTime: string;
    loadingTime: string;
    distance: string;
    maxWeight: string;
  };

  // Jobs
  jobs: any[]; // In real app, proper Job type
}

interface JourneyDetailsViewProps {
  journey: JourneyDetails;
  onBack: () => void;
  onStatusChange: (newStatus: JourneyStatus) => void;
}

export function JourneyDetailsView({ journey, onBack, onStatusChange }: JourneyDetailsViewProps) {
  const [activeTab, setActiveTab] = useState<'breakdown' | 'schedule'>('schedule');

  // Helper to render Status Badge
  const renderStatusBadge = () => {
    let colorClass = '';
    let label = journey.status.toUpperCase();
    
    switch(journey.status) {
      case 'draft': colorClass = 'bg-slate-100 text-slate-600'; break;
      case 'published': colorClass = 'bg-blue-100 text-blue-700'; break;
      case 'allocated': colorClass = 'bg-purple-100 text-purple-700'; break;
      case 'in-progress': colorClass = 'bg-orange-100 text-orange-700'; label = 'ON ROUTE'; break;
      case 'completed': colorClass = 'bg-green-100 text-green-700'; break;
    }
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${colorClass}`}>
        {label}
      </span>
    );
  };

  // Helper for Message Box
  const renderMessageBox = () => {
    if (journey.status === 'draft') return null;
    
    let title = '';
    let message = '';
    let bg = 'bg-blue-50 border-blue-200 text-blue-900';

    if (journey.status === 'allocated') {
       title = "You've been allocated to this journey";
       message = "AnyVan will pay you directly for this journey upon completion of all pickups and deliveries.";
    } else if (journey.status === 'published') {
       title = "Journey Published to Marketplace";
       message = "Waiting for drivers to accept. You will be notified when allocated.";
       bg = 'bg-yellow-50 border-yellow-200 text-yellow-900';
    } else if (journey.status === 'completed') {
       title = "Journey Completed";
       message = "All jobs have been marked as complete. Payout is processing.";
       bg = 'bg-green-50 border-green-200 text-green-900';
    } else {
        return null;
    }

    return (
      <div className={`mb-6 p-4 rounded-lg border ${bg} text-sm`}>
        <div className="font-bold mb-1">{title}</div>
        <div>{message}</div>
        {journey.status === 'allocated' && journey.driverName && (
           <div className="flex items-center gap-4 mt-3 pt-3 border-t border-blue-200/50">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase">
                 <span className="w-2 h-2 rounded-full bg-green-500"></span> {journey.vehicleReg || 'No Reg'}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase">
                 <span className="w-2 h-2 rounded-full bg-blue-500"></span> {journey.driverName}
              </div>
              <button className="ml-auto text-blue-600 hover:underline">
                 <Edit3 className="w-3 h-3 inline mr-1" /> Edit
              </button>
           </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 1. Header & Actions */}
      <div className="border-b border-slate-200 p-6 bg-white">
        <div className="flex items-center gap-3 mb-4">
           <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-500" />
           </button>
           <h2 className="text-xl font-bold text-slate-900">Journey Details</h2>
        </div>

        {renderMessageBox()}

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <span className="text-xs font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
                   {journey.id}
                 </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">{journey.title}</h1>
              <div className="text-3xl font-bold text-slate-900">£{journey.price.toFixed(2)}</div>
           </div>

           {/* ACTION BUTTONS */}
           <div className="flex flex-wrap gap-2 justify-end">
              {journey.status === 'draft' && (
                 <>
                   <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                     <Trash2 className="w-4 h-4 mr-2" /> Delete
                   </Button>
                   <Button variant="outline">
                     <Edit3 className="w-4 h-4 mr-2" /> Edit
                   </Button>
                   <Button 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => onStatusChange('published')}
                   >
                     <Send className="w-4 h-4 mr-2" /> Publish to Marketplace
                   </Button>
                 </>
              )}

              {journey.status === 'published' && (
                 <>
                   <Button variant="outline" onClick={() => onStatusChange('draft')}>
                     <XCircle className="w-4 h-4 mr-2" /> Unpublish
                   </Button>
                   <Button variant="outline">
                     <Eye className="w-4 h-4 mr-2" /> View in Marketplace
                   </Button>
                   <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => onStatusChange('allocated')}
                   >
                     <User className="w-4 h-4 mr-2" /> Allocate Driver
                   </Button>
                 </>
              )}

              {(journey.status === 'allocated' || journey.status === 'in-progress') && (
                 <>
                   <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                     <XCircle className="w-4 h-4 mr-2" /> Deallocate
                   </Button>
                   <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                     <Navigation className="w-4 h-4 mr-2" /> Live Tracking
                   </Button>
                   <Button 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => onStatusChange('completed')}
                   >
                     <CheckCircle className="w-4 h-4 mr-2" /> Complete Journey
                   </Button>
                 </>
              )}
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid lg:grid-cols-3 gap-0 min-h-full">
           
           {/* LEFT PANEL: Overview & Stats */}
           <div className="lg:col-span-1 p-6 border-r border-slate-200 bg-slate-50/50">
              {/* Timeline Card */}
              <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm mb-6">
                 <div className="flex gap-4">
                    {/* Visual Line */}
                    <div className="flex flex-col items-center pt-2">
                       <div className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold border border-orange-200">1</div>
                       <div className="w-0.5 flex-1 bg-slate-300 my-1"></div>
                       <div className="w-6 h-6 rounded bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold border border-green-200">{journey.totalJobs * 2}</div>
                    </div>

                    <div className="flex-1 space-y-6">
                       <div>
                          <h4 className="font-bold text-slate-900 text-sm">{journey.startLocation}</h4>
                          <p className="text-xs text-slate-500">{journey.startTime}</p>
                       </div>
                       
                       <div className="py-2 space-y-1">
                          <div className="flex gap-4 text-xs font-medium text-slate-600">
                             <span>{journey.totalJobs} jobs</span>
                             <span>{journey.totalMiles} miles</span>
                          </div>
                          <div className="flex gap-4 text-xs font-medium text-slate-600">
                             <span>{journey.totalTime}</span>
                             <span>{journey.capacity}m³</span>
                          </div>
                       </div>

                       <div>
                          <h4 className="font-bold text-slate-900 text-sm">{journey.endLocation}</h4>
                          <p className="text-xs text-slate-500">{journey.endTime}</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Map Thumbnail */}
              <div className="h-48 bg-slate-200 rounded-lg border border-slate-300 mb-6 relative overflow-hidden group cursor-pointer">
                  {/* Mock Map Image/Overlay */}
                  <div className="absolute inset-0 bg-slate-300 flex items-center justify-center">
                     <MapPin className="w-8 h-8 text-slate-400" />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                     <span className="bg-white/90 px-3 py-1 rounded text-xs font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to expand map
                     </span>
                  </div>
              </div>

              {/* Special Requirements */}
              <div className="mb-6">
                 <h4 className="font-bold text-slate-900 text-sm mb-2">Special requirements</h4>
                 <div className="flex items-center gap-2 text-xs text-slate-600 bg-white border border-slate-200 p-2 rounded">
                    <Share2 className="w-3 h-3" />
                    <span>Multi-stop route</span>
                 </div>
              </div>

              {/* Tabs Control */}
              <div className="flex border-b border-slate-200 mb-6">
                 <button 
                   onClick={() => setActiveTab('breakdown')}
                   className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'breakdown' ? 'border-green-500 text-green-700' : 'border-transparent text-slate-500'}`}
                 >
                   Breakdown
                 </button>
                 <button 
                   onClick={() => setActiveTab('schedule')}
                   className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'schedule' ? 'border-green-500 text-green-700' : 'border-transparent text-slate-500'}`}
                 >
                   Schedule
                 </button>
              </div>

              {/* Breakdown Content */}
              {activeTab === 'breakdown' && (
                 <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3 text-sm">
                    <div className="flex justify-between">
                       <span className="text-slate-500">Total driving time</span>
                       <span className="font-medium text-slate-900">{journey.breakdown.drivingTime}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-slate-500">Total loading time</span>
                       <span className="font-medium text-slate-900">{journey.breakdown.loadingTime}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-slate-500">Total distance</span>
                       <span className="font-medium text-slate-900">{journey.breakdown.distance}</span>
                    </div>
                     <div className="flex justify-between border-t border-slate-100 pt-2">
                       <span className="text-slate-500">Max capacity</span>
                       <span className="font-medium text-slate-900">{journey.capacity}m³</span>
                    </div>
                     <div className="flex justify-between">
                       <span className="text-slate-500">Max weight</span>
                       <span className="font-medium text-slate-900">{journey.breakdown.maxWeight}</span>
                    </div>
                 </div>
              )}
           </div>

           {/* RIGHT PANEL: Schedule List */}
           <div className="lg:col-span-2 p-6 bg-slate-100/50">
              {activeTab === 'schedule' && (
                 <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2">
                       <h3 className="font-bold text-slate-900">Schedule</h3>
                       <button className="text-xs text-blue-600 font-medium bg-white px-2 py-1 rounded border border-slate-200">
                          Expand all
                       </button>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-lg p-4 text-sm text-slate-600 mb-4">
                       Please make sure you complete each job as you go. If there are additional items or changes, select 'Job Complete With Issue' and tell us.
                    </div>

                    {/* JOB LIST */}
                    {journey.jobs.map((job, idx) => (
                       <div key={idx} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                          {/* Job Status Banner */}
                          <div className={`px-4 py-2 text-xs font-bold flex justify-between items-center ${
                             job.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                             <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${job.status === 'completed' ? 'bg-green-600' : 'bg-slate-400'}`}></span>
                                {job.status === 'completed' ? 'JOB COMPLETED' : 'PENDING'}
                             </div>
                             {job.completedAt && <span>{job.completedAt}</span>}
                          </div>

                          <div className="p-4">
                             {/* Route Line */}
                             <div className="flex items-start gap-4 mb-4">
                                <div className="flex flex-col items-center pt-1">
                                   <ArrowLeft className="w-4 h-4 text-slate-400 rotate-90" />
                                </div>
                                <div className="flex-1 grid md:grid-cols-2 gap-4">
                                   <div>
                                      <div className="font-bold text-slate-900 mb-1">{job.pickup.address}</div>
                                      <div className="text-xs text-slate-500 flex items-center gap-1">
                                         <Clock className="w-3 h-3" /> {job.time}
                                      </div>
                                   </div>
                                    <div className="text-right md:text-left">
                                      <div className="font-bold text-slate-900 mb-1">{job.customerName}</div>
                                      <div className="text-xs text-blue-500 font-medium">{job.phone}</div>
                                      <div className="text-xs text-slate-500 mt-1">Ground floor • No Lift</div>
                                   </div>
                                </div>
                             </div>

                             {/* Actions */}
                             <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                                <Button variant="outline" size="sm" className="h-8 text-xs text-blue-600 border-blue-200 hover:bg-blue-50">
                                   <FileText className="w-3 h-3 mr-1" /> View Job Sheet
                                </Button>
                                {job.status !== 'completed' && (
                                   <div className="ml-auto flex gap-2">
                                      <Button variant="outline" size="sm" className="h-8 text-xs text-orange-600 border-orange-200 hover:bg-orange-50">
                                         Issues
                                      </Button>
                                      <Button size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white">
                                         Complete Job
                                      </Button>
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
      </div>
    </div>
  );
}
