import React, { useState } from 'react';
import { 
  Trello, Phone, Mail, Clock, CheckCircle, XCircle, 
  MoreHorizontal, Plus, Search, DollarSign, Calendar 
} from 'lucide-react';
import { jobStatusManager, CallbackRequest } from '../../utils/jobStatusManager';

// --- TYPES ---
type LeadStatus = 'new' | 'contacted' | 'negotiating' | 'won' | 'lost';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  price: number;
  date: string; // Date of move
  generatedAt: string; // When quote was made
  status: LeadStatus;
  notes?: string;
  origin: string;
  destination: string;
}

// --- MOCK DATA ---
const MOCK_LEADS: Lead[] = [
  { id: 'l1', name: 'Alice Walker', email: 'alice@test.com', phone: '07123456789', price: 450, date: '2024-02-15', generatedAt: '2 hours ago', status: 'new', origin: 'London', destination: 'Manchester' },
  { id: 'l2', name: 'Bob Builder', email: 'bob@test.com', phone: '07987654321', price: 280, date: '2024-01-20', generatedAt: '5 hours ago', status: 'new', origin: 'Bristol', destination: 'Bath' },
  { id: 'l3', name: 'Charlie Day', email: 'charlie@test.com', phone: '07555555555', price: 1200, date: '2024-03-01', generatedAt: '1 day ago', status: 'contacted', notes: 'Left voicemail', origin: 'Leeds', destination: 'London' },
  { id: 'l4', name: 'Diana Prince', email: 'diana@test.com', phone: '07444444444', price: 650, date: '2024-02-10', generatedAt: '2 days ago', status: 'negotiating', notes: 'Asked for 10% discount', origin: 'Oxford', destination: 'Cambridge' },
  { id: 'l5', name: 'Evan Peters', email: 'evan@test.com', phone: '07333333333', price: 320, date: '2024-01-25', generatedAt: '3 days ago', status: 'lost', notes: 'Too expensive', origin: 'Liverpool', destination: 'Manchester' },
];

export function LeadManagement() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);

  React.useEffect(() => {
    const loadLeads = () => {
      const callbackRequests = jobStatusManager.getCallbackRequests();
      
      // Convert callback requests to Leads format
      const convertedLeads: Lead[] = callbackRequests.map(cb => ({
        id: cb.id,
        name: cb.name,
        email: cb.email || 'N/A',
        phone: cb.phone,
        price: 0, // Unknown yet
        date: 'TBD',
        generatedAt: new Date(cb.date).toLocaleDateString(),
        status: cb.status === 'called' ? 'contacted' : 
                cb.status === 'converted' ? 'won' : 'new',
        notes: cb.notes || 'Website Callback Request',
        origin: 'Unknown',
        destination: 'Unknown'
      }));

      // Merge with MOCK_LEADS (avoid duplicates if IDs clash, though unlikely here)
      // In a real app, MOCK_LEADS wouldn't exist, we'd just use the store.
      // For demo, we prepend real requests to mock data
      setLeads([...convertedLeads, ...MOCK_LEADS]);
    };

    loadLeads();
    
    // Subscribe to updates
    jobStatusManager.on('leads_updated', loadLeads);
    return () => {
      jobStatusManager.off('leads_updated', loadLeads);
    };
  }, []);

  const getColumns = () => [
    { id: 'new', label: 'New Quotes', color: 'border-blue-500 bg-blue-50' },
    { id: 'contacted', label: 'Contacted', color: 'border-orange-500 bg-orange-50' },
    { id: 'negotiating', label: 'Negotiating', color: 'border-purple-500 bg-purple-50' },
    { id: 'won', label: 'Won (Booked)', color: 'border-green-500 bg-green-50' },
    { id: 'lost', label: 'Lost', color: 'border-slate-500 bg-slate-50' },
  ];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('leadId', id);
  };

  const handleDrop = (e: React.DragEvent, status: LeadStatus) => {
    const id = e.dataTransfer.getData('leadId');
    setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Sales Pipeline</h2>
          <p className="text-slate-600 mt-1">Track and convert abandoned quotes into bookings</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input type="text" placeholder="Search leads..." className="pl-9 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Manual Lead
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto min-h-0">
        <div className="flex gap-4 h-full min-w-max pb-4">
          {getColumns().map(col => (
            <div 
              key={col.id} 
              className={`w-80 flex-shrink-0 flex flex-col rounded-xl border-t-4 ${col.color.split(' ')[0]} bg-slate-50/50`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id as LeadStatus)}
            >
              {/* Col Header */}
              <div className="p-4 flex justify-between items-center border-b border-slate-200/50">
                <h3 className="font-bold text-slate-700">{col.label}</h3>
                <span className="text-xs font-bold bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-500">
                  {leads.filter(l => l.status === col.id).length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                {leads.filter(l => l.status === col.id).map(lead => (
                  <div 
                    key={lead.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead.id)}
                    className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md cursor-grab active:cursor-grabbing group relative"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-900">{lead.name}</h4>
                      <span className="font-bold text-green-600 text-sm">£{lead.price}</span>
                    </div>
                    
                    <div className="text-xs text-slate-500 space-y-1 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Move: {lead.date}
                      </div>
                      <div className="flex items-center gap-1 truncate">
                        <span className="font-medium text-slate-700">{lead.origin}</span>
                        <span>→</span>
                        <span className="font-medium text-slate-700">{lead.destination}</span>
                      </div>
                    </div>

                    {lead.notes && (
                      <div className="bg-yellow-50 border border-yellow-100 p-2 rounded text-xs text-yellow-800 mb-3 italic">
                        "{lead.notes}"
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                      <div className="flex gap-2">
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-600" title="Call">
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-green-600" title="Email">
                          <Mail className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400">{lead.generatedAt}</span>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
