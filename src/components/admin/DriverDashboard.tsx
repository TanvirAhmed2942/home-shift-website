import React, { useState } from 'react';
import { 
  ArrowLeft, MapPin, Navigation, Clock, CheckCircle, 
  DollarSign, Calendar, Bell, Menu, Package, Phone, 
  ChevronRight, Upload, Camera, Signature, History,
  User, Truck, Settings, HelpCircle, LogOut, X
} from 'lucide-react';

interface Driver {
  id: string;
  name: string;
  username: string;
  vehicleReg: string;
  earnings: number;
  weeklyEarnings: number;
}

interface DriverDashboardProps {
  driver: Driver;
  onBackToAdmin: () => void;
}

export function DriverDashboard({ driver, onBackToAdmin }: DriverDashboardProps) {
  const [activeTab, setActiveTab] = useState<'jobs' | 'earnings' | 'rota' | 'menu'>('jobs');
  const [showPOD, setShowPOD] = useState<string | null>(null);
  const [podStep, setPodStep] = useState<'photo' | 'signature' | 'success'>('photo');

  // Mock Active Jobs
  const [activeJobs, setActiveJobs] = useState([
    {
      id: 'JOB-1024',
      pickup: 'Unit 4, Industrial Est, London',
      dropoff: '15 High St, Manchester',
      time: '10:30 AM',
      status: 'in-progress',
      price: 120,
      customer: 'John Doe',
      phone: '07700 900123',
      items: '2 Bed Flat Move'
    },
    {
      id: 'JOB-1025',
      pickup: 'Manchester Depot',
      dropoff: '22 Lake Rd, Liverpool',
      time: '14:00 PM',
      status: 'pending',
      price: 85,
      customer: 'Alice Smith',
      phone: '07700 900456',
      items: 'Sofa & 2 Armchairs'
    }
  ]);

  // Mock Earnings History
  const earningsHistory = [
    { id: 1, date: 'Today', amount: 120, job: 'JOB-1024', type: 'Job Payment' },
    { id: 2, date: 'Yesterday', amount: 85, job: 'JOB-1021', type: 'Job Payment' },
    { id: 3, date: 'Yesterday', amount: 45, job: 'JOB-1020', type: 'Job Payment' },
    { id: 4, date: '26 Dec', amount: 200, job: 'Bonus', type: 'Weekly Bonus' },
  ];

  // Mock Rota
  const rotaSchedule = [
    { day: 'Mon', date: '28', status: 'working', hours: '08:00 - 18:00' },
    { day: 'Tue', date: '29', status: 'working', hours: '08:00 - 18:00' },
    { day: 'Wed', date: '30', status: 'off', hours: '-' },
    { day: 'Thu', date: '31', status: 'working', hours: '09:00 - 17:00' },
    { day: 'Fri', date: '01', status: 'off', hours: 'Holiday' },
  ];

  const handleJobAction = (jobId: string, currentStatus: string) => {
    if (currentStatus === 'pending') {
       setActiveJobs(jobs => jobs.map(j => j.id === jobId ? { ...j, status: 'in-progress' } : j));
    } else if (currentStatus === 'in-progress') {
       setShowPOD(jobId);
       setPodStep('photo');
    }
  };

  const handlePODComplete = () => {
     if (!showPOD) return;
     setActiveJobs(jobs => jobs.filter(j => j.id !== showPOD));
     setShowPOD(null);
  };

  const renderPODModal = () => {
    if (!showPOD) return null;

    return (
      <div className="fixed inset-0 z-[60] bg-black/90 flex flex-col p-4 animate-in fade-in duration-200">
        <div className="flex justify-end">
           <button onClick={() => setShowPOD(null)} className="p-2 bg-white/10 rounded-full text-white">
             <X className="w-6 h-6" />
           </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center space-y-8 text-center">
           {podStep === 'photo' && (
             <>
               <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
                  <Camera className="w-10 h-10 text-white" />
               </div>
               <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Proof of Delivery</h3>
                  <p className="text-slate-400">Please take a photo of the delivered items</p>
               </div>
               <button 
                 onClick={() => setPodStep('signature')}
                 className="w-full max-w-sm py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-500 transition-all"
               >
                 Take Photo
               </button>
             </>
           )}

           {podStep === 'signature' && (
             <>
               <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                  <Signature className="w-10 h-10 text-white" />
               </div>
               <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Customer Signature</h3>
                  <p className="text-slate-400">Ask the customer to sign below</p>
               </div>
               <div className="w-full max-w-sm h-40 bg-white rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
                  <p className="text-slate-400 text-sm">Sign Here</p>
               </div>
               <button 
                 onClick={() => setPodStep('success')}
                 className="w-full max-w-sm py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-500 transition-all"
               >
                 Confirm Delivery
               </button>
             </>
           )}

           {podStep === 'success' && (
             <>
               <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center scale-110">
                  <CheckCircle className="w-12 h-12 text-white" />
               </div>
               <div>
                  <h3 className="text-3xl font-bold text-white mb-2">Job Complete!</h3>
                  <p className="text-slate-400">Great work. Earnings updated.</p>
               </div>
               <button 
                 onClick={handlePODComplete}
                 className="w-full max-w-sm py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all"
               >
                 Back to Jobs
               </button>
             </>
           )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'jobs':
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 text-white shadow-lg shadow-blue-200">
                <div className="flex items-center gap-2 mb-2 opacity-80">
                  <Package className="w-4 h-4" />
                  <span className="text-xs font-medium">Active Jobs</span>
                </div>
                <div className="text-3xl font-bold">{activeJobs.length}</div>
                <div className="text-xs opacity-70 mt-1">
                   {activeJobs.filter(j => j.status === 'pending').length} Pending today
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-slate-500">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs font-medium">This Week</span>
                </div>
                <div className="text-3xl font-bold text-slate-900">£{driver.weeklyEarnings}</div>
                <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  +12% vs last week
                </div>
              </div>
            </div>

            {/* Today's Schedule */}
            <div>
              <h2 className="font-bold text-slate-900 mb-3 flex items-center justify-between">
                <span>Today's Schedule</span>
                <span className="text-xs font-normal text-slate-500">{new Date().toLocaleDateString()}</span>
              </h2>
              
              <div className="space-y-4">
                {activeJobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm relative overflow-hidden">
                    {job.status === 'in-progress' && (
                       <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                    )}
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">#{job.id}</span>
                        {job.status === 'in-progress' && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded-full tracking-wide">
                            In Progress
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-slate-900">£{job.price}</span>
                    </div>

                    <div className="space-y-4">
                      {/* Route */}
                      <div className="relative pl-4 space-y-4">
                        <div className="absolute left-[5px] top-2 bottom-6 w-0.5 bg-slate-200"></div>

                        <div className="relative">
                          <div className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full border-2 border-blue-600 bg-white"></div>
                          <p className="text-xs text-slate-500 mb-0.5">Pickup • {job.time}</p>
                          <p className="font-medium text-slate-900 text-sm">{job.pickup}</p>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                          <p className="text-xs text-slate-500 mb-0.5">Dropoff</p>
                          <p className="font-medium text-slate-900 text-sm">{job.dropoff}</p>
                        </div>
                      </div>

                      <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg flex items-center gap-2">
                        <Package className="w-3 h-3" />
                        {job.items}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2 border-t border-slate-100">
                        {job.status === 'in-progress' ? (
                            <button 
                                onClick={() => handleJobAction(job.id, 'in-progress')}
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 active:scale-95 transition-all"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Complete Job
                            </button>
                        ) : (
                            <button 
                                onClick={() => handleJobAction(job.id, 'pending')}
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 active:scale-95 transition-all"
                            >
                                <Navigation className="w-4 h-4" />
                                Start Job
                            </button>
                        )}
                        <button className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg">
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {activeJobs.length === 0 && (
                   <div className="text-center py-10 text-slate-500">
                      <p>No active jobs today.</p>
                      <p className="text-xs">Enjoy your day off!</p>
                   </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'earnings':
        return (
          <div className="space-y-6">
             <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
                <p className="text-slate-400 text-sm mb-1">Current Balance</p>
                <h2 className="text-4xl font-bold">£{driver.weeklyEarnings}</h2>
                <div className="mt-4 flex gap-3">
                   <button className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg text-sm font-medium transition-colors">
                      Withdraw
                   </button>
                   <button className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg text-sm font-medium transition-colors">
                      Statement
                   </button>
                </div>
             </div>

             <div>
                <h3 className="font-bold text-slate-900 mb-3">Recent Activity</h3>
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                   {earningsHistory.map((item, idx) => (
                      <div key={item.id} className={`p-4 flex items-center justify-between ${idx !== earningsHistory.length - 1 ? 'border-b border-slate-100' : ''}`}>
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                               <DollarSign className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                               <p className="font-medium text-slate-900">{item.type}</p>
                               <p className="text-xs text-slate-500">{item.date} • {item.job}</p>
                            </div>
                         </div>
                         <span className="font-bold text-slate-900">+£{item.amount}</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        );

      case 'rota':
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="font-bold text-slate-900">This Week</h2>
                    <span className="text-sm text-blue-600 font-medium">Dec 28 - Jan 03</span>
                </div>
                
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    {rotaSchedule.map((day, idx) => (
                        <div key={idx} className={`p-4 flex items-center justify-between ${idx !== rotaSchedule.length - 1 ? 'border-b border-slate-100' : ''}`}>
                             <div className="flex items-center gap-4">
                                 <div className={`w-12 flex flex-col items-center justify-center p-2 rounded-lg ${day.status === 'working' ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-400'}`}>
                                     <span className="text-xs font-bold uppercase">{day.day}</span>
                                     <span className="text-lg font-bold">{day.date}</span>
                                 </div>
                                 <div>
                                     <p className={`font-medium ${day.status === 'working' ? 'text-slate-900' : 'text-slate-400'}`}>
                                         {day.status === 'working' ? 'Shift Scheduled' : 'Day Off'}
                                     </p>
                                     <p className="text-xs text-slate-500">{day.hours}</p>
                                 </div>
                             </div>
                             {day.status === 'working' && <ChevronRight className="w-5 h-5 text-slate-300" />}
                        </div>
                    ))}
                </div>

                <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium shadow-lg hover:bg-black transition-all">
                    Request Time Off
                </button>
            </div>
        );

      case 'menu':
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
                        {driver.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{driver.name}</h2>
                        <p className="text-slate-500">@{driver.username}</p>
                        <div className="flex items-center gap-1 mt-1 text-yellow-500 font-bold text-sm">
                            <span>★ 4.9 Rating</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Fleet</h3>
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                         <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-100">
                             <div className="flex items-center gap-3">
                                 <Truck className="w-5 h-5 text-slate-600" />
                                 <span className="font-medium text-slate-900">Vehicle Check</span>
                             </div>
                             <ChevronRight className="w-5 h-5 text-slate-300" />
                         </button>
                         <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                             <div className="flex items-center gap-3">
                                 <History className="w-5 h-5 text-slate-600" />
                                 <span className="font-medium text-slate-900">Job History</span>
                             </div>
                             <ChevronRight className="w-5 h-5 text-slate-300" />
                         </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">App</h3>
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                         <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-100">
                             <div className="flex items-center gap-3">
                                 <Settings className="w-5 h-5 text-slate-600" />
                                 <span className="font-medium text-slate-900">Settings</span>
                             </div>
                             <ChevronRight className="w-5 h-5 text-slate-300" />
                         </button>
                         <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-100">
                             <div className="flex items-center gap-3">
                                 <HelpCircle className="w-5 h-5 text-slate-600" />
                                 <span className="font-medium text-slate-900">Support</span>
                             </div>
                             <ChevronRight className="w-5 h-5 text-slate-300" />
                         </button>
                         <button 
                             onClick={onBackToAdmin}
                             className="w-full p-4 flex items-center justify-between hover:bg-red-50 transition-colors text-red-600"
                         >
                             <div className="flex items-center gap-3">
                                 <LogOut className="w-5 h-5" />
                                 <span className="font-medium">Sign Out</span>
                             </div>
                             <ChevronRight className="w-5 h-5 text-red-200" />
                         </button>
                    </div>
                </div>
                
                <p className="text-center text-xs text-slate-400 pt-4">Version 2.4.0 • Build 892</p>
            </div>
        );

      default:
        return <div className="p-4 text-center text-slate-500">Section under construction</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      {/* POD Overlay */}
      {renderPODModal()}

      {/* Admin Override Banner */}
      <div className="bg-red-600 text-white px-4 py-2 text-sm font-bold flex justify-between items-center shadow-md z-50">
        <div className="flex items-center gap-2">
          <span>👀 Viewing as: @{driver.username}</span>
        </div>
        <button 
          onClick={onBackToAdmin}
          className="bg-white text-red-600 px-3 py-1 rounded-md text-xs hover:bg-red-50 transition-colors uppercase tracking-wider"
        >
          Exit View
        </button>
      </div>

      {/* Driver App Header */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {driver.name.charAt(0)}
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">Hi, {driver.name.split(' ')[0]} 👋</h1>
              <p className="text-xs text-slate-500">{driver.vehicleReg} • Online</p>
            </div>
          </div>
          <button className="p-2 bg-slate-100 rounded-full relative">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {renderContent()}
      </div>

      {/* Driver Bottom Nav */}
      <div className="bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center sticky bottom-0 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
            onClick={() => setActiveTab('jobs')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'jobs' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <Navigation className="w-6 h-6" />
          <span className="text-[10px] font-medium">Jobs</span>
        </button>
        <button 
            onClick={() => setActiveTab('earnings')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'earnings' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <DollarSign className="w-6 h-6" />
          <span className="text-[10px] font-medium">Earnings</span>
        </button>
        <button 
            onClick={() => setActiveTab('rota')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'rota' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <Calendar className="w-6 h-6" />
          <span className="text-[10px] font-medium">Rota</span>
        </button>
        <button 
            onClick={() => setActiveTab('menu')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'menu' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <Menu className="w-6 h-6" />
          <span className="text-[10px] font-medium">Menu</span>
        </button>
      </div>
    </div>
  );
}
