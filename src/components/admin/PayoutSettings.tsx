import React, { useState } from 'react';
import { 
  CreditCard, Calendar, Clock, AlertCircle, Save, CheckCircle, 
  DollarSign, Landmark, ArrowRight, ShieldCheck, ToggleLeft, ToggleRight
} from 'lucide-react';

// --- TYPES ---
interface PayoutSettingsState {
  payoutMethod: 'stripe_connect' | 'manual';
  payoutFrequency: 'weekly' | 'bi_weekly' | 'manual';
  payoutDelayDays: number; // 3, 5, 7
  autoPayout: boolean;
  minPayoutAmount: number;
}

export function PayoutSettings() {
  const [settings, setSettings] = useState<PayoutSettingsState>({
    payoutMethod: 'stripe_connect',
    payoutFrequency: 'weekly',
    payoutDelayDays: 3,
    autoPayout: true,
    minPayoutAmount: 50,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Payout Settings</h2>
        <p className="text-slate-600 mt-1">Configure global rules for driver payouts and Stripe Connect integration</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Main Configuration Form */}
        <div className="md:col-span-2 space-y-6">
          
          {/* 1. Payment Method */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-600" />
              Payout Method
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-start gap-4 p-4 border rounded-xl cursor-pointer hover:bg-slate-50 transition-all bg-purple-50 border-purple-200">
                <input 
                  type="radio" 
                  name="method" 
                  className="mt-1 w-4 h-4 text-purple-600"
                  checked={settings.payoutMethod === 'stripe_connect'}
                  onChange={() => setSettings({...settings, payoutMethod: 'stripe_connect'})}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Stripe Connect (Recommended)</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">CONNECTED</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">
                    Automated payouts directly to drivers' bank accounts. Handles KYC and compliance automatically.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-4 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-all">
                <input 
                  type="radio" 
                  name="method" 
                  className="mt-1 w-4 h-4 text-purple-600"
                  checked={settings.payoutMethod === 'manual'}
                  onChange={() => setSettings({...settings, payoutMethod: 'manual'})}
                />
                <div className="flex-1">
                  <span className="font-bold text-slate-900">Manual Bank Transfer</span>
                  <p className="text-sm text-slate-600 mt-1">
                    Process payments manually and mark them as paid in the system. High administrative effort.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* 2. Schedule & Rules */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Schedule & Rules
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Payout Frequency</label>
                <select 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  value={settings.payoutFrequency}
                  onChange={(e) => setSettings({...settings, payoutFrequency: e.target.value as any})}
                >
                  <option value="weekly">Weekly (Every Monday)</option>
                  <option value="bi_weekly">Bi-Weekly</option>
                  <option value="manual">Manual Request Only</option>
                </select>
              </div>

              {/* Delay */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Payout Delay (Rolling)</label>
                <select 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  value={settings.payoutDelayDays}
                  onChange={(e) => setSettings({...settings, payoutDelayDays: Number(e.target.value)})}
                >
                  <option value={3}>3 Days after completion</option>
                  <option value={5}>5 Days after completion</option>
                  <option value={7}>7 Days after completion</option>
                  <option value={14}>14 Days after completion</option>
                </select>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Allows time for disputes/chargebacks
                </p>
              </div>

              {/* Min Amount */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Minimum Payout Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="number"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    value={settings.minPayoutAmount}
                    onChange={(e) => setSettings({...settings, minPayoutAmount: Number(e.target.value)})}
                  />
                </div>
              </div>

              {/* Auto Payout */}
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-sm font-bold text-slate-900">Auto Payout</label>
                  <p className="text-xs text-slate-500">Automatically release funds</p>
                </div>
                <button 
                  onClick={() => setSettings({...settings, autoPayout: !settings.autoPayout})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.autoPayout ? 'bg-green-500' : 'bg-slate-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.autoPayout ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
             <button 
               onClick={handleSave}
               disabled={isSaving}
               className={`flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg ${isSaving ? 'opacity-75 cursor-wait' : ''}`}
             >
               {isSaving ? (
                 <>Saving...</>
               ) : saveSuccess ? (
                 <><CheckCircle className="w-5 h-5" /> Saved Rules</>
               ) : (
                 <><Save className="w-5 h-5" /> Save Payout Rules</>
               )}
             </button>
          </div>

        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Payout Safety
            </h4>
            <ul className="space-y-3 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
                <span>Never process payouts instantly. Always use a 3-7 day rolling delay.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
                <span>"Auto Payout" will trigger Stripe transfers automatically on the scheduled day.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600" />
                <span>Drivers must complete Stripe KYC (Identity Verification) before receiving funds.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
             <h4 className="font-bold text-slate-900 mb-3">Platform Fees</h4>
             <div className="flex justify-between items-center py-2 border-b border-slate-100">
               <span className="text-sm text-slate-600">Platform Commission</span>
               <span className="font-mono font-bold text-slate-900">20%</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-slate-100">
               <span className="text-sm text-slate-600">Stripe Connect Fee</span>
               <span className="font-mono font-bold text-slate-900">£2 + 0.25%</span>
             </div>
             <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-500">
               Fees are deducted automatically before the net amount is sent to the driver.
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
