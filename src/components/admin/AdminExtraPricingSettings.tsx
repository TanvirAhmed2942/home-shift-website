import React, { useState } from 'react';
import { X, Save, DollarSign } from 'lucide-react';
import { EXTRAS_CATALOG } from '../../utils/pricingEngine';

interface ExtraItem {
  id: string;
  name: string;
  price: number;
  type: string;
}

interface AdminExtraPricingSettingsProps {
  onClose: () => void;
}

export function AdminExtraPricingSettings({ onClose }: AdminExtraPricingSettingsProps) {
  // Initialize with the imported catalog
  // In a real app, this would come from a database via the adminPricingManager
  const [extras, setExtras] = useState<ExtraItem[]>(EXTRAS_CATALOG as ExtraItem[]);
  const [hasChanges, setHasChanges] = useState(false);

  const handlePriceChange = (id: string, newPrice: number) => {
    setExtras(extras.map(item => 
      item.id === id ? { ...item, price: newPrice } : item
    ));
    setHasChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would save to backend/storage
    // For now, we just simulate saving and logging
    console.log('Saving extras pricing:', extras);
    alert('Extra items pricing updated!');
    setHasChanges(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Extra Items Pricing</h3>
            <p className="text-slate-500 text-sm">Configure standard prices for extra services</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <div className="space-y-4">
            {extras.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-purple-200 hover:bg-purple-50/30 transition-colors">
                <div className="flex-1">
                  <div className="font-semibold text-slate-900">{item.name}</div>
                  <div className="text-xs text-slate-500 capitalize">
                    {item.type === 'per_floor' ? 'Per Flight of Stairs' : 
                     item.type === 'flat' ? 'Flat Fee' : 
                     item.type.replace('_', ' ')} Charge
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handlePriceChange(item.id, parseFloat(e.target.value) || 0)}
                      className="w-24 pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none font-medium text-slate-900"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${
              hasChanges 
                ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
