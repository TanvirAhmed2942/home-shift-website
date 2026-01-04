import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, User, 
  CheckCircle, XCircle, Clock, AlertCircle 
} from 'lucide-react';

// --- TYPES ---
type AvailabilityStatus = 'available' | 'off' | 'sick' | 'holiday' | 'booked';

interface DriverDayStatus {
  date: string; // YYYY-MM-DD
  status: AvailabilityStatus;
  note?: string;
}

interface DriverRota {
  id: string;
  name: string;
  vehicle: string;
  schedule: DriverDayStatus[];
}

// --- MOCK DATA ---
// Generate next 7 days dates
const getDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
};

const DATES = getDates();
const DATE_STRINGS = DATES.map(d => d.toISOString().split('T')[0]);

const MOCK_ROTA: DriverRota[] = [
  {
    id: 'd1', name: 'John Smith', vehicle: 'Luton Van',
    schedule: [
      { date: DATE_STRINGS[0], status: 'available' },
      { date: DATE_STRINGS[1], status: 'available' },
      { date: DATE_STRINGS[2], status: 'off', note: 'Requested OFF' },
      { date: DATE_STRINGS[3], status: 'available' },
      { date: DATE_STRINGS[4], status: 'available' },
      { date: DATE_STRINGS[5], status: 'holiday', note: 'Annual Leave' },
      { date: DATE_STRINGS[6], status: 'holiday' },
    ]
  },
  {
    id: 'd2', name: 'Michael Dave', vehicle: 'Sprinter LWB',
    schedule: [
      { date: DATE_STRINGS[0], status: 'booked', note: 'Full Day Job' },
      { date: DATE_STRINGS[1], status: 'available' },
      { date: DATE_STRINGS[2], status: 'available' },
      { date: DATE_STRINGS[3], status: 'sick', note: 'Medical Leave' },
      { date: DATE_STRINGS[4], status: 'sick' },
      { date: DATE_STRINGS[5], status: 'available' },
      { date: DATE_STRINGS[6], status: 'off' },
    ]
  },
  {
    id: 'd3', name: 'Sarah Connor', vehicle: 'Luton Tail Lift',
    schedule: DATE_STRINGS.map(d => ({ date: d, status: 'available' }))
  }
];

export function DriverAvailability() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const getStatusColor = (status: AvailabilityStatus) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700 border-green-200';
      case 'off': return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'sick': return 'bg-red-100 text-red-700 border-red-200';
      case 'holiday': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'booked': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100';
    }
  };

  const getStatusIcon = (status: AvailabilityStatus) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-3 h-3" />;
      case 'off': return <XCircle className="w-3 h-3" />;
      case 'sick': return <AlertCircle className="w-3 h-3" />;
      case 'holiday': return <User className="w-3 h-3" />;
      case 'booked': return <Clock className="w-3 h-3" />;
    }
  };

  const getStatusLabel = (status: AvailabilityStatus) => {
    switch (status) {
      case 'available': return 'Open';
      case 'off': return 'Off';
      case 'sick': return 'Sick';
      case 'holiday': return 'Leave';
      case 'booked': return 'Busy';
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Driver Availability</h2>
          <p className="text-slate-600 mt-1">Manage shift patterns, holidays, and availability</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-white border border-slate-200 rounded-lg p-1">
             <button className="p-2 hover:bg-slate-100 rounded-md"><ChevronLeft className="w-4 h-4" /></button>
             <div className="px-4 py-2 font-medium text-slate-700 flex items-center gap-2">
               <CalendarIcon className="w-4 h-4" />
               This Week
             </div>
             <button className="p-2 hover:bg-slate-100 rounded-md"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-lg">
            Approve Requests
          </button>
        </div>
      </div>

      {/* Rota Grid */}
      <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Header */}
        <div className="grid grid-cols-[250px_1fr] border-b border-slate-200 bg-slate-50">
           <div className="p-4 font-bold text-slate-700 border-r border-slate-200 flex items-center">
             Driver Details
           </div>
           <div className="grid grid-cols-7 divide-x divide-slate-200">
             {DATES.map(date => (
               <div key={date.toISOString()} className="p-3 text-center">
                 <p className="text-xs font-bold text-slate-500 uppercase">{date.toLocaleDateString('en-GB', { weekday: 'short' })}</p>
                 <p className="text-lg font-bold text-slate-900">{date.getDate()}</p>
               </div>
             ))}
           </div>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto">
          {MOCK_ROTA.map(driver => (
            <div key={driver.id} className="grid grid-cols-[250px_1fr] border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
              {/* Driver Col */}
              <div className="p-4 border-r border-slate-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{driver.name}</p>
                  <p className="text-xs text-slate-500">{driver.vehicle}</p>
                </div>
              </div>

              {/* Days Col */}
              <div className="grid grid-cols-7 divide-x divide-slate-200">
                {driver.schedule.map((day, idx) => (
                  <div key={idx} className="p-2">
                    <button 
                      className={`w-full h-full min-h-[60px] rounded-lg border flex flex-col items-center justify-center gap-1 transition-all hover:brightness-95 ${getStatusColor(day.status)}`}
                    >
                      <div className="flex items-center gap-1 text-xs font-bold uppercase">
                        {getStatusIcon(day.status)}
                        {getStatusLabel(day.status)}
                      </div>
                      {day.note && (
                        <span className="text-[9px] opacity-75 truncate max-w-full px-1">{day.note}</span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-6 text-sm">
          <div className="flex items-center gap-2">
             <span className="w-3 h-3 rounded-full bg-green-500"></span> Available
          </div>
          <div className="flex items-center gap-2">
             <span className="w-3 h-3 rounded-full bg-blue-500"></span> Booked (Job Assigned)
          </div>
          <div className="flex items-center gap-2">
             <span className="w-3 h-3 rounded-full bg-purple-500"></span> Holiday (Approved)
          </div>
          <div className="flex items-center gap-2">
             <span className="w-3 h-3 rounded-full bg-slate-400"></span> Off Shift
          </div>
          <div className="flex items-center gap-2">
             <span className="w-3 h-3 rounded-full bg-red-500"></span> Sick Leave
          </div>
        </div>
      </div>
    </div>
  );
}
