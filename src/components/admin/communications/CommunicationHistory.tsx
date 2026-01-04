import React from 'react';
import { Mail, MessageSquare, Smartphone, Clock, CheckCircle, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { NotificationLog } from '../../utils/notificationTemplates';

interface CommunicationHistoryProps {
  logs: NotificationLog[];
  filterBy?: string; // e.g. "Job 123" or "Driver Mike"
  className?: string;
}

export function CommunicationHistory({ logs, filterBy, className = '' }: CommunicationHistoryProps) {
  // Filter logs if a filter is provided
  const displayLogs = filterBy 
    ? logs.filter(log => 
        log.recipient.includes(filterBy) || 
        log.event.includes(filterBy) ||
        (log.metadata && JSON.stringify(log.metadata).includes(filterBy))
      )
    : logs;

  if (displayLogs.length === 0) {
    return (
      <div className={`p-8 text-center border rounded-lg bg-slate-50 border-slate-200 ${className}`}>
        <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <p className="text-slate-500 font-medium">No communication history found.</p>
        {filterBy && <p className="text-xs text-slate-400 mt-1">Filter: {filterBy}</p>}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Communication Timeline
      </h3>
      
      <div className="relative border-l-2 border-slate-200 ml-2 space-y-6 pb-2">
        {displayLogs.map((log) => (
          <div key={log.id} className="relative pl-6">
            {/* Timeline Dot */}
            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
              log.status === 'opened' || log.status === 'delivered' ? 'bg-green-500' :
              log.status === 'failed' ? 'bg-red-500' : 'bg-blue-500'
            }`} />

            {/* Content Card */}
            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-slate-800 text-sm">{log.event}</span>
                <span className="text-xs text-slate-400 font-mono">{log.date}</span>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <span className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded">
                  {log.channel === 'email' ? <Mail className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                  {log.channel.toUpperCase()}
                </span>
                <ArrowUpRight className="w-3 h-3 text-slate-300" />
                <span>{log.recipient}</span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                 <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                   log.status === 'opened' ? 'bg-green-100 text-green-700' :
                   log.status === 'delivered' ? 'bg-green-50 text-green-600' :
                   log.status === 'failed' ? 'bg-red-100 text-red-600' :
                   'bg-blue-50 text-blue-600'
                 }`}>
                   {log.status}
                 </span>
                 <button className="text-[10px] text-blue-600 font-medium hover:underline">
                   View Content
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
