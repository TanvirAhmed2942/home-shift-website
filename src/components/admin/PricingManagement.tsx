import React, { useState, useEffect } from 'react';
import { DollarSign, Edit, Save, X, Plus, Trash2, Percent, TrendingUp, Settings, RefreshCw } from 'lucide-react';
import { adminPricingManager, PricingRule } from '../../utils/adminPricingManager';

export function PricingManagement() {
  const [rules, setRules] = useState<Record<string, PricingRule>>({});
  const [activeService, setActiveService] = useState('house-move');
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = () => {
    setRules({ ...adminPricingManager.getAllRules() });
  };

  const handleEdit = () => {
    setEditingRule({ ...rules[activeService] });
  };

  const handleSave = () => {
    if (editingRule) {
      adminPricingManager.updateRule(activeService, editingRule);
      loadRules();
      setEditingRule(null);
    }
  };

  const handleCancel = () => {
    setEditingRule(null);
  };

  const updateField = (field: keyof PricingRule, value: any) => {
    if (editingRule) {
      setEditingRule({ ...editingRule, [field]: value });
    }
  };

  const updateMultiplier = (key: string, value: number) => {
    if (editingRule) {
      setEditingRule({
        ...editingRule,
        vanTypeMultiplier: {
          ...editingRule.vanTypeMultiplier,
          [key]: value
        }
      });
    }
  };

  const currentRule = editingRule || rules[activeService];

  if (!currentRule) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Pricing Configuration</h2>
          <p className="text-slate-600 mt-1">Manage base rates, multipliers, and fees for each service</p>
        </div>
        <button 
          onClick={loadRules}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all"
        >
          <RefreshCw className="w-5 h-5" />
          Refresh Rules
        </button>
      </div>

      {/* Service Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2">
        {Object.keys(rules).map((key) => (
          <button
            key={key}
            onClick={() => {
              setActiveService(key);
              setEditingRule(null);
            }}
            className={`px-6 py-3 rounded-xl font-bold capitalize whitespace-nowrap transition-all ${
              activeService === key
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {key.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Pricing Editor */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 capitalize flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            {activeService.replace('-', ' ')} Settings
          </h3>
          
          <div className="flex gap-2">
            {editingRule ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-bold"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-lg"
              >
                <Edit className="w-4 h-4" />
                Edit Pricing
              </button>
            )}
          </div>
        </div>

        <div className="p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Base Rates */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 border-b pb-2 mb-4">Base Rates</h4>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Base Call-out Fee (£)</label>
              <input
                type="number"
                disabled={!editingRule}
                value={currentRule.basePrice}
                onChange={(e) => updateField('basePrice', parseFloat(e.target.value))}
                className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 disabled:opacity-70 font-mono font-bold text-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Price Per Mile (£)</label>
              <input
                type="number"
                step="0.1"
                disabled={!editingRule}
                value={currentRule.pricePerMile}
                onChange={(e) => updateField('pricePerMile', parseFloat(e.target.value))}
                className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 disabled:opacity-70 font-mono font-bold text-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Minimum Price (£)</label>
              <input
                type="number"
                disabled={!editingRule}
                value={currentRule.minPrice}
                onChange={(e) => updateField('minPrice', parseFloat(e.target.value))}
                className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 disabled:opacity-70 font-mono font-bold text-lg"
              />
            </div>
          </div>

          {/* Multipliers & Extras */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 border-b pb-2 mb-4">Multipliers & Fees</h4>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Weekend Multiplier (x)</label>
              <input
                type="number"
                step="0.1"
                disabled={!editingRule}
                value={currentRule.weekendMultiplier}
                onChange={(e) => updateField('weekendMultiplier', parseFloat(e.target.value))}
                className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 disabled:opacity-70 font-mono font-bold text-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Congestion Charge (£)</label>
              <input
                type="number"
                disabled={!editingRule}
                value={currentRule.congestionCharge}
                onChange={(e) => updateField('congestionCharge', parseFloat(e.target.value))}
                className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 disabled:opacity-70 font-mono font-bold text-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Stairs (Per Flight) (£)</label>
              <input
                type="number"
                disabled={!editingRule}
                value={currentRule.stairsPricePerFlight}
                onChange={(e) => updateField('stairsPricePerFlight', parseFloat(e.target.value))}
                className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 disabled:opacity-70 font-mono font-bold text-lg"
              />
            </div>
          </div>

          {/* Vehicle Multipliers */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 border-b pb-2 mb-4">Vehicle Surcharges (Multiplier)</h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Small Van</label>
                <input
                  type="number"
                  step="0.1"
                  disabled={!editingRule}
                  value={currentRule.vanTypeMultiplier.small}
                  onChange={(e) => updateMultiplier('small', parseFloat(e.target.value))}
                  className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 disabled:opacity-70 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Medium Van</label>
                <input
                  type="number"
                  step="0.1"
                  disabled={!editingRule}
                  value={currentRule.vanTypeMultiplier.medium}
                  onChange={(e) => updateMultiplier('medium', parseFloat(e.target.value))}
                  className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 disabled:opacity-70 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Large Van</label>
                <input
                  type="number"
                  step="0.1"
                  disabled={!editingRule}
                  value={currentRule.vanTypeMultiplier.large}
                  onChange={(e) => updateMultiplier('large', parseFloat(e.target.value))}
                  className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 disabled:opacity-70 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Luton Van</label>
                <input
                  type="number"
                  step="0.1"
                  disabled={!editingRule}
                  value={currentRule.vanTypeMultiplier.luton}
                  onChange={(e) => updateMultiplier('luton', parseFloat(e.target.value))}
                  className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 disabled:opacity-70 font-mono font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Calculation Example */}
        <div className="p-6 bg-slate-50 border-t border-slate-200">
          <h4 className="font-bold text-slate-700 mb-2">Rule Preview Logic:</h4>
          <p className="font-mono text-sm text-slate-500">
            Total = (BasePrice + (Miles * {currentRule.pricePerMile}) + Extras) * Multipliers
          </p>
        </div>
      </div>
    </div>
  );
}
