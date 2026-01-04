import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Package, Users, Truck, Calendar, MapPin, AlertTriangle, Clock, Camera, AlertCircle, Phone } from 'lucide-react';
import { jobStatusManager, Job } from '../../utils/jobStatusManager';
import { toast } from 'sonner@2.0.3';

// ADMIN PHONE NUMBER FOR ALERTS - In a real app, this would come from user settings or auth profile
const ADMIN_PHONE_NUMBER = "+447700900000"; 

export function AnalyticsDashboard() {
  const [lateJobs, setLateJobs] = useState<{ job: Job, minutesLate: number }[]>([]);

  useEffect(() => {
    const checkLateJobs = async () => {
      const late = jobStatusManager.getLateJobs();
      setLateJobs(late);

      // Check for un-alerted jobs and send SMS
      for (const { job, minutesLate } of late) {
        if (!job.smsAlertSent) {
          console.log(`Triggering SMS alert for job ${job.reference}`);
          
          const message = `ALERT: Driver for job ${job.reference} is ${minutesLate} mins late. Driver: ${job.driverName || 'Unknown'} (${job.driverPhone || 'No phone'}).`;
          
          // Send SMS
          const sent = await jobStatusManager.sendSmsAlert(ADMIN_PHONE_NUMBER, message);
          
          if (sent) {
            await jobStatusManager.markJobAsAlerted(job.id);
            toast.error(`SMS Alert Sent: ${job.reference} is late!`);
          } else {
             // If mock or failed, still mark to avoid spamming loop in dev, 
             // but ideally we'd retry. For this prototype, we mark as alerted so UI doesn't freeze.
             await jobStatusManager.markJobAsAlerted(job.id);
             toast.warning(`Simulated SMS Alert for ${job.reference} (Check console)`);
          }
        }
      }
    };

    // Check immediately and then every minute
    checkLateJobs();
    const interval = setInterval(checkLateJobs, 60000);
    return () => clearInterval(interval);
  }, []);

  // Revenue data by month
  const revenueData = [
    { month: 'Jan', revenue: 18500, bookings: 45 },
    { month: 'Feb', revenue: 22300, bookings: 58 },
    { month: 'Mar', revenue: 24100, bookings: 62 },
    { month: 'Apr', revenue: 21800, bookings: 54 },
    { month: 'May', revenue: 26700, bookings: 71 },
    { month: 'Jun', revenue: 29400, bookings: 78 },
    { month: 'Jul', revenue: 32100, bookings: 85 },
    { month: 'Aug', revenue: 28900, bookings: 76 },
    { month: 'Sep', revenue: 31500, bookings: 82 },
    { month: 'Oct', revenue: 34200, bookings: 91 },
    { month: 'Nov', revenue: 36800, bookings: 98 },
    { month: 'Dec', revenue: 38500, bookings: 102 },
  ];

  const alerts = [
    { id: 1, type: 'critical', message: '3 Jobs without drivers assigned', icon: Users },
    { id: 2, type: 'warning', message: '2 Journeys running late (>30 mins)', icon: Clock },
    { id: 3, type: 'warning', message: '4 Jobs missing mandatory photos', icon: Camera },
    { id: 4, type: 'info', message: '1 New damage claim reported', icon: AlertCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Overview</h2>
        <p className="text-slate-600 mt-1">Real-time monitoring and daily summary</p>
      </div>

      {/* ALERTS SECTION (New) */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* DYNAMIC LATE JOB ALERTS */}
        {lateJobs.map(({ job, minutesLate }) => (
          <div key={job.id} className="p-4 rounded-xl border-l-4 shadow-md flex items-start gap-3 bg-red-50 border-red-600 text-red-900 animate-pulse">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-600" />
            <div className="flex-1">
              <p className="font-bold text-sm text-red-800">LATE DRIVER ALERT</p>
              <p className="text-sm mt-1 font-bold">{minutesLate} mins late</p>
              <p className="text-xs mt-1">Job: {job.reference}</p>
              <p className="text-xs mb-2">Driver: {job.driverName || 'Unknown'}</p>
              
              {job.driverPhone && (
                <a 
                  href={`tel:${job.driverPhone}`}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-red-200 hover:bg-red-300 text-red-900 text-xs font-bold rounded transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  Call Driver
                </a>
              )}
            </div>
          </div>
        ))}

        {alerts.map(alert => (
          <div key={alert.id} className={`p-4 rounded-xl border-l-4 shadow-sm flex items-start gap-3 ${
            alert.type === 'critical' ? 'bg-red-50 border-red-500 text-red-900' :
            alert.type === 'warning' ? 'bg-orange-50 border-orange-500 text-orange-900' :
            'bg-blue-50 border-blue-500 text-blue-900'
          }`}>
            <alert.icon className={`w-5 h-5 flex-shrink-0 ${
              alert.type === 'critical' ? 'text-red-600' :
              alert.type === 'warning' ? 'text-orange-600' :
              'text-blue-600'
            }`} />
            <div>
              <p className="font-bold text-sm">{alert.type.toUpperCase()}</p>
              <p className="text-sm mt-1 font-medium">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* SMALL LIVE MAP (New) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden h-[400px] relative">
          <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
             {/* Simulated Map View */}
             <div className="text-center">
               <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-2" />
               <p className="text-slate-500 font-bold">Live Operations Map</p>
               <p className="text-xs text-slate-400">18 Active Drivers • 24 Active Jobs</p>
               
               {/* Mock Pins */}
               <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
               <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-green-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
               <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
             </div>
          </div>
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 text-xs font-bold">
            🟢 15 Online • 🟡 3 Busy • ⚪ 2 Offline
          </div>
        </div>

        {/* TODAY'S SUMMARY (New) */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-200">
            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Jobs Today
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-slate-600">Available / Pending</span>
                <span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">12</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-slate-600">In Progress</span>
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Completed</span>
                <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">24</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-200">
             <div className="flex items-center justify-between mb-2">
               <span className="text-slate-500 text-sm">Revenue Today</span>
               <TrendingUp className="w-4 h-4 text-green-500" />
             </div>
             <p className="text-3xl font-black text-slate-900">£3,850</p>
             <p className="text-xs text-green-600 font-medium mt-1">+12% vs last week</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-5 border border-slate-200">
             <div className="flex items-center justify-between mb-2">
               <span className="text-slate-500 text-sm">Driver Fleet Weekly</span>
               <Truck className="w-4 h-4 text-orange-500" />
             </div>
             <p className="text-3xl font-black text-slate-900">£18,450</p>
             <p className="text-xs text-orange-600 font-medium mt-1">24 Active Drivers</p>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-5 text-white">
            <p className="font-bold mb-1">Active Journeys</p>
            <p className="text-3xl font-black">6</p>
            <p className="text-xs text-blue-100 mt-2">2 running late</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Monthly Bookings</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="bookings" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
