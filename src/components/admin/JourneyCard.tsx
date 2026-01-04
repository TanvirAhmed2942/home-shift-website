import React from 'react';
import { 
  Truck, Calendar, ArrowRight, User, Circle 
} from 'lucide-react';

export type JourneyStatus = 'draft' | 'published' | 'allocated' | 'in-progress' | 'completed';

interface JourneyCardProps {
  id: string;
  title: string;
  date: string;
  price: number;
  status: JourneyStatus;
  onClick: () => void;
}

export function JourneyCard({ id, title, date, price, status, onClick }: JourneyCardProps) {
  const getStatusStyle = (s: JourneyStatus) => {
    switch(s) {
      case 'draft': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'published': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'allocated': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'in-progress': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (s: JourneyStatus) => {
    switch(s) {
      case 'in-progress': return 'ON ROUTE';
      default: return s.toUpperCase();
    }
  };

  return (
    <div 
      onClick={onClick}
      className="group bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
    >
      {/* Top Status Banner (if needed) - Keeping it minimal for list view */}
      
      <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Info */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
             <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getStatusStyle(status)}`}>
                {getStatusLabel(status)}
              </span>
              <span className="text-xs text-slate-400 font-mono">#{id}</span>
            </div>
            <h4 className="font-bold text-slate-900 text-[15px] leading-tight mb-1">
              {title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-500">
               <Calendar className="w-3.5 h-3.5" />
               <span>{date}</span>
            </div>
          </div>
        </div>

        {/* Right: Price */}
        <div className="text-right pl-4 border-l border-slate-100 md:border-l-0 md:pl-0">
           <div className="text-xl font-bold text-slate-900">£{price.toFixed(2)}</div>
           <div className="text-[10px] text-slate-500 uppercase tracking-wide font-bold">Total Payout</div>
        </div>
      </div>
    </div>
  );
}
