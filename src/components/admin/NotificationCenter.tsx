import React, { useState } from 'react';
import { 
  Bell, Mail, MessageSquare, Edit3, Send, Check, Settings, 
  Smartphone, User, Truck, Calendar, Clock 
} from 'lucide-react';

// --- TYPES ---
interface NotificationTemplate {
  id: string;
  name: string;
  trigger: 'job_created' | 'driver_assigned' | 'job_completed' | 'payment_sent';
  channels: ('email' | 'sms')[];
  subject: string;
  body: string;
  active: boolean;
}

interface NotificationLog {
  id: string;
  recipient: string;
  type: 'email' | 'sms';
  template: string;
  status: 'sent' | 'delivered' | 'failed';
  timestamp: string;
}

// --- MOCK DATA ---
const DEFAULT_TEMPLATES: NotificationTemplate[] = [
  {
    id: 't1',
    name: 'Job Confirmation (Customer)',
    trigger: 'job_created',
    channels: ['email'],
    subject: 'Booking Confirmed: {{job_ref}}',
    body: 'Hi {{customer_name}},\n\nYour move is booked for {{date}} at {{time}}.\n\nView details here: {{link}}',
    active: true
  },
  {
    id: 't2',
    name: 'Driver Job Offer',
    trigger: 'job_created',
    channels: ['sms', 'email'],
    subject: 'New Job Offer: £{{price}}',
    body: 'New job available near {{pickup_postcode}}. £{{price}}. Reply YES to accept.',
    active: true
  },
  {
    id: 't3',
    name: 'Driver On Route',
    trigger: 'driver_assigned',
    channels: ['sms'],
    subject: '',
    body: 'Your driver {{driver_name}} is on the way! Track live: {{tracking_link}}',
    active: true
  }
];

const MOCK_LOGS: NotificationLog[] = [
  { id: 'l1', recipient: 'john.doe@email.com', type: 'email', template: 'Job Confirmation', status: 'delivered', timestamp: '10:42 AM' },
  { id: 'l2', recipient: '+447123456789', type: 'sms', template: 'Driver Job Offer', status: 'sent', timestamp: '10:45 AM' },
  { id: 'l3', recipient: '+447987654321', type: 'sms', template: 'Driver On Route', status: 'failed', timestamp: '11:00 AM' },
];

export function NotificationCenter() {
  const [activeTab, setActiveTab] = useState<'templates' | 'logs'>('templates');
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);

  const handleSaveTemplate = () => {
    if (!editingTemplate) return;
    setTemplates(templates.map(t => t.id === editingTemplate.id ? editingTemplate : t));
    setEditingTemplate(null);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Notification Center</h2>
          <p className="text-slate-600 mt-1">Configure automated emails & SMS alerts</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            SMTP Settings
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 shrink-0">
        <button 
          onClick={() => setActiveTab('templates')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'templates' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Message Templates
        </button>
        <button 
          onClick={() => setActiveTab('logs')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'logs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Delivery Logs
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {activeTab === 'templates' ? (
          <div className="flex h-full gap-6">
            {/* List */}
            <div className="w-1/3 overflow-y-auto space-y-3 pr-2">
              {templates.map(template => (
                <div 
                  key={template.id}
                  onClick={() => setEditingTemplate(template)}
                  className={`p-4 border rounded-xl cursor-pointer transition-all hover:shadow-md ${editingTemplate?.id === template.id ? 'bg-blue-50 border-blue-300' : 'bg-white border-slate-200'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900">{template.name}</h4>
                    <div className="flex gap-1">
                      {template.channels.includes('email') && <Mail className="w-4 h-4 text-blue-500" />}
                      {template.channels.includes('sms') && <Smartphone className="w-4 h-4 text-green-500" />}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 rounded px-2 py-1 w-fit">
                    <Bell className="w-3 h-3" />
                    Trigger: {template.trigger.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
              ))}
            </div>

            {/* Editor */}
            <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
              {editingTemplate ? (
                <>
                  <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-900">Edit Template</h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${editingTemplate.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {editingTemplate.active ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 overflow-y-auto space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Email Subject</label>
                      <input 
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={editingTemplate.subject}
                        onChange={e => setEditingTemplate({...editingTemplate, subject: e.target.value})}
                        placeholder="Subject line..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Message Body</label>
                      <textarea 
                        className="w-full h-48 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                        value={editingTemplate.body}
                        onChange={e => setEditingTemplate({...editingTemplate, body: e.target.value})}
                      />
                      <p className="text-xs text-slate-500 mt-2">
                        Variables available: <span className="font-mono bg-slate-100 px-1">{{customer_name}}</span>, <span className="font-mono bg-slate-100 px-1">{{job_ref}}</span>, <span className="font-mono bg-slate-100 px-1">{{date}}</span>
                      </p>
                    </div>
                  </div>
                  <div className="p-6 border-t border-slate-200 flex justify-end gap-3 bg-slate-50/30">
                    <button onClick={() => setEditingTemplate(null)} className="px-4 py-2 text-slate-600 hover:text-slate-800">Cancel</button>
                    <button onClick={handleSaveTemplate} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm flex items-center gap-2">
                      <SaveIcon className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                  <MessageSquare className="w-16 h-16 mb-4 text-slate-200" />
                  <p>Select a template to edit</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-medium">Time</th>
                  <th className="px-6 py-3 font-medium">Recipient</th>
                  <th className="px-6 py-3 font-medium">Template</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_LOGS.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 text-slate-500">{log.timestamp}</td>
                    <td className="px-6 py-3 font-mono text-slate-600">{log.recipient}</td>
                    <td className="px-6 py-3 text-slate-900 font-medium">{log.template}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${
                        log.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        log.status === 'sent' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const SaveIcon = ({className}:{className?:string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
);
