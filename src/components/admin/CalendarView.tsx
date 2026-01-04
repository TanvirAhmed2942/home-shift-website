import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, MapPin, User, Truck, Filter } from 'lucide-react';
import { JobCard } from './JobCard';
import { Job } from '../../utils/jobStatusManager';

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  // Mock bookings converted to Job interface structure
  const mockJobs: Job[] = [
    { 
      id: 'JOB-101', 
      date: '2024-12-16', 
      time: '09:00', 
      customerName: 'John Smith', 
      service: 'House Move', 
      pickup: { address: 'Westminster, London', postcode: 'SW1A 1AA' },
      delivery: { address: 'Camden, London', postcode: 'N1 9AG' },
      driverName: 'Mike Johnson', 
      status: 'completed',
      customerPrice: 350,
      capacity: '20m³',
      reference: 'REF-101'
    },
    { 
      id: 'JOB-102', 
      date: '2024-12-16', 
      time: '14:00', 
      customerName: 'Sarah Williams', 
      service: 'Furniture Delivery', 
      pickup: { address: 'IKEA Croydon', postcode: 'CR0 4UZ' },
      delivery: { address: 'Brixton, London', postcode: 'SW2 1QA' },
      driverName: 'John Smith', 
      status: 'pending',
      customerPrice: 85,
      capacity: '5m³',
      reference: 'REF-102'
    },
    { 
      id: 'JOB-103', 
      date: '2024-12-17', 
      time: '10:30', 
      customerName: 'David Brown', 
      service: 'Clearance & Removal', 
      pickup: { address: 'Shoreditch, London', postcode: 'E1 6AN' },
      delivery: { address: 'Hackney, London', postcode: 'E8 3RL' },
      driverName: 'Mike Johnson', 
      status: 'assigned',
      customerPrice: 120,
      capacity: '10m³',
      reference: 'REF-103'
    },
    { 
      id: 'JOB-104', 
      date: '2024-12-17', 
      time: '15:00', 
      customerName: 'Emma Davis', 
      service: 'Store Pickup', 
      pickup: { address: 'Currys PC World', postcode: 'W1 5AA' },
      delivery: { address: 'Kensington, London', postcode: 'W8 4PT' },
      driverName: 'Tom Wilson', 
      status: 'confirmed',
      customerPrice: 65,
      capacity: '2m³',
      reference: 'REF-104'
    },
    { 
      id: 'JOB-105', 
      date: '2024-12-18', 
      time: '08:00', 
      customerName: 'James Wilson', 
      service: 'House Move', 
      pickup: { address: 'Battersea, London', postcode: 'SW11 3RA' },
      delivery: { address: 'Clapham, London', postcode: 'SW4 7SS' },
      driverName: 'Mike Johnson', 
      status: 'in-progress',
      customerPrice: 420,
      capacity: '30m³',
      reference: 'REF-105'
    }
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    return { daysInMonth, startDayOfWeek, year, month };
  };

  const { daysInMonth, startDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getBookingsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return mockJobs.filter((b) => b.date === dateStr);
  };

  // Helper to match the calendar "mini card" style to the main JobCard style
  const getMiniCardStyle = (status: string) => {
    switch (status) {
      case 'completed': return 'border-l-green-500 bg-green-50 text-green-900';
      case 'in-progress': return 'border-l-blue-500 bg-blue-50 text-blue-900';
      case 'assigned': return 'border-l-purple-500 bg-purple-50 text-purple-900';
      case 'cancelled': return 'border-l-red-500 bg-red-50 text-red-900';
      default: return 'border-l-slate-400 bg-slate-50 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Calendar</h2>
          <p className="text-slate-600 mt-1">Schedule and manage bookings</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-medium">
             <Filter className="w-5 h-5" /> Filter
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-md">
            <Plus className="w-5 h-5" />
            New Booking
          </button>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          {/* Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-900 min-w-[200px] text-center">
              {monthNames[month]} {year}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* View Switcher */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
            {['Month', 'Week', 'Day'].map((v) => (
               <button
                  key={v}
                  onClick={() => setView(v.toLowerCase() as any)}
                  className={`px-4 py-1.5 rounded-md font-semibold text-sm transition-all ${
                    view === v.toLowerCase()
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {v}
                </button>
            ))}
          </div>
        </div>

        {/* Calendar Grid */}
        {view === 'month' && (
          <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-lg overflow-hidden border border-slate-200">
            {/* Day Headers */}
            {dayNames.map((day) => (
              <div key={day} className="text-center font-bold text-slate-500 bg-slate-50 py-3 text-sm uppercase tracking-wide">
                {day}
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {Array.from({ length: startDayOfWeek }).map((_, idx) => (
              <div key={`empty-${idx}`} className="bg-slate-50/50 min-h-[140px]"></div>
            ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const dayBookings = getBookingsForDate(day);
              const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

              return (
                <div
                  key={day}
                  className={`bg-white min-h-[140px] p-2 hover:bg-slate-50 transition-colors group relative ${isToday ? 'bg-blue-50/30' : ''}`}
                >
                  <div className={`font-bold text-sm mb-2 w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-slate-700'}`}>
                     {day}
                  </div>
                  
                  <div className="space-y-1.5">
                    {dayBookings.slice(0, 3).map((job) => (
                      <div
                        key={job.id}
                        className={`text-[10px] p-1.5 rounded border-l-2 cursor-pointer hover:shadow-sm transition-all ${getMiniCardStyle(job.status)}`}
                        onClick={() => console.log('View job', job.id)}
                      >
                        <div className="font-bold truncate">{job.time}</div>
                        <div className="truncate font-medium">{job.service}</div>
                      </div>
                    ))}
                    {dayBookings.length > 3 && (
                      <div className="text-[10px] text-slate-400 font-bold pl-1">
                        +{dayBookings.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming Bookings List - Using Shared JobCard Component */}
      <div>
        <div className="flex items-center justify-between mb-4">
           <h3 className="font-bold text-slate-900 text-xl flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-500" />
            Upcoming Schedule
          </h3>
          <button className="text-blue-600 font-bold text-sm hover:underline">View All</button>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {mockJobs
            .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
            .map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onClick={() => console.log('View job', job.id)}
                // We use default card here so it looks consistent with the List View
              />
            ))}
        </div>
      </div>
    </div>
  );
}
