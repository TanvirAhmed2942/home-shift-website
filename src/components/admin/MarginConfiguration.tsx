import React, { useState } from 'react';
import { Percent, DollarSign, TrendingUp, Save, Info, AlertCircle, Settings } from 'lucide-react';
import { AdminExtraPricingSettings } from './AdminExtraPricingSettings';

interface MarginConfig {
  type: 'percentage' | 'fixed' | 'hybrid';
  percentageMargin: number; // %
  fixedMargin: number; // £
  minimumMargin: number; // £
  useDriverRateCards: boolean;
}

const DEFAULT_CONFIG: MarginConfig = {
  type: 'percentage',
  percentageMargin: 30, // Changed from 20 to 30 to match 70/30 split (driver 70%, company 30%)
  fixedMargin: 15,
  minimumMargin: 10,
  useDriverRateCards: true,
};

export function MarginConfiguration() {
  const [config, setConfig] = useState<MarginConfig>(DEFAULT_CONFIG);
  const [savedConfig, setSavedConfig] = useState<MarginConfig>(DEFAULT_CONFIG);
  const [hasChanges, setHasChanges] = useState(false);
  const [showExtraPricingSettings, setShowExtraPricingSettings] = useState(false);

  const handleChange = (field: keyof MarginConfig, value: any) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    setHasChanges(JSON.stringify(newConfig) !== JSON.stringify(savedConfig));
  };

  const handleSave = () => {
    setSavedConfig(config);
    setHasChanges(false);
    // In production, save to database
    alert('Margin configuration saved successfully! ✅');
  };

  // Example calculation
  const exampleCustomerPrice = 150;
  const calculateDriverPrice = () => {
    if (config.type === 'percentage') {
      const margin = (exampleCustomerPrice * config.percentageMargin) / 100;
      return Math.max(exampleCustomerPrice - margin, 0);
    } else if (config.type === 'fixed') {
      return Math.max(exampleCustomerPrice - config.fixedMargin, 0);
    } else {
      // Hybrid: use whichever is higher
      const percentageMargin = (exampleCustomerPrice * config.percentageMargin) / 100;
      const margin = Math.max(percentageMargin, config.fixedMargin, config.minimumMargin);
      return Math.max(exampleCustomerPrice - margin, 0);
    }
  };

  const exampleDriverPrice = calculateDriverPrice();
  const exampleMargin = exampleCustomerPrice - exampleDriverPrice;
  const exampleMarginPercent = (exampleMargin / exampleCustomerPrice) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Margin Configuration</h2>
          <p className="text-slate-600 mt-1">Configure automatic driver/partner pricing</p>
        </div>
        <button
          onClick={() => setShowExtraPricingSettings(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
        >
          <Settings className="w-5 h-5" />
          Extra Items Pricing
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Rate Card Source */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Rate Card Source
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <input
                  type="checkbox"
                  id="useDriverRateCards"
                  checked={config.useDriverRateCards}
                  onChange={(e) => handleChange('useDriverRateCards', e.target.checked)}
                  className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="useDriverRateCards" className="flex-1">
                  <div className="font-semibold text-slate-900">Use Separate Driver Rate Cards</div>
                  <div className="text-sm text-slate-600 mt-1">
                    If enabled, driver pricing will be calculated from separate driver rate cards. If disabled, driver price will be calculated from customer price minus margin.
                  </div>
                </label>
              </div>

              {!config.useDriverRateCards && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-orange-700">
                    <strong>Note:</strong> Driver pricing will be calculated using the margin configuration below.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Margin Type */}
          {!config.useDriverRateCards && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Percent className="w-5 h-5 text-purple-600" />
                Margin Type
              </h3>

              <div className="space-y-3">
                {/* Percentage */}
                <div
                  onClick={() => handleChange('type', 'percentage')}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    config.type === 'percentage'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-slate-200 hover:border-purple-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        config.type === 'percentage' ? 'border-purple-600' : 'border-slate-300'
                      }`}
                    >
                      {config.type === 'percentage' && <div className="w-3 h-3 rounded-full bg-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">Percentage Margin</div>
                      <div className="text-sm text-slate-600">
                        Platform takes a percentage of the customer price
                      </div>
                    </div>
                  </div>

                  {config.type === 'percentage' && (
                    <div className="mt-4 pl-8">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Percentage Margin (%)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={config.percentageMargin}
                          onChange={(e) => handleChange('percentageMargin', parseFloat(e.target.value) || 0)}
                          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none"
                          min="0"
                          max="100"
                          step="0.5"
                        />
                        <span className="text-slate-700 font-semibold">%</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-2">
                        Example: 20% margin on £150 = £30 platform fee, £120 driver earnings
                      </div>
                    </div>
                  )}
                </div>

                {/* Fixed */}
                <div
                  onClick={() => handleChange('type', 'fixed')}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    config.type === 'fixed'
                      ? 'border-green-500 bg-green-50'
                      : 'border-slate-200 hover:border-green-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        config.type === 'fixed' ? 'border-green-600' : 'border-slate-300'
                      }`}
                    >
                      {config.type === 'fixed' && <div className="w-3 h-3 rounded-full bg-green-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">Fixed Margin</div>
                      <div className="text-sm text-slate-600">Platform takes a fixed amount per job</div>
                    </div>
                  </div>

                  {config.type === 'fixed' && (
                    <div className="mt-4 pl-8">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Fixed Margin (£)</label>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-700 font-semibold">£</span>
                        <input
                          type="number"
                          value={config.fixedMargin}
                          onChange={(e) => handleChange('fixedMargin', parseFloat(e.target.value) || 0)}
                          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-200 outline-none"
                          min="0"
                          step="0.5"
                        />
                      </div>
                      <div className="text-xs text-slate-500 mt-2">
                        Example: £15 margin on £150 = £15 platform fee, £135 driver earnings
                      </div>
                    </div>
                  )}
                </div>

                {/* Hybrid */}
                <div
                  onClick={() => handleChange('type', 'hybrid')}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    config.type === 'hybrid'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        config.type === 'hybrid' ? 'border-blue-600' : 'border-slate-300'
                      }`}
                    >
                      {config.type === 'hybrid' && <div className="w-3 h-3 rounded-full bg-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">Hybrid (% + Minimum)</div>
                      <div className="text-sm text-slate-600">Use whichever margin is higher</div>
                    </div>
                  </div>

                  {config.type === 'hybrid' && (
                    <div className="mt-4 pl-8 space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Percentage Margin (%)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={config.percentageMargin}
                            onChange={(e) => handleChange('percentageMargin', parseFloat(e.target.value) || 0)}
                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                            min="0"
                            max="100"
                            step="0.5"
                          />
                          <span className="text-slate-700 font-semibold">%</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Minimum Margin (£)</label>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-700 font-semibold">£</span>
                          <input
                            type="number"
                            value={config.minimumMargin}
                            onChange={(e) => handleChange('minimumMargin', parseFloat(e.target.value) || 0)}
                            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                            min="0"
                            step="0.5"
                          />
                        </div>
                      </div>

                      <div className="text-xs text-slate-500">
                        Example: 20% or min £10, whichever is higher
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          {hasChanges && (
            <button
              onClick={handleSave}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Configuration
            </button>
          )}
        </div>

        {/* RIGHT: Live Preview */}
        <div className="space-y-6">
          {/* Live Example */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg border border-blue-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Live Example
            </h3>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-slate-600 mb-1">Customer Price</div>
                <div className="text-2xl font-bold text-slate-900">£{exampleCustomerPrice.toFixed(2)}</div>
              </div>

              <div className="h-px bg-slate-300"></div>

              <div>
                <div className="text-sm text-slate-600 mb-1">Platform Margin</div>
                <div className="text-xl font-bold text-purple-600">
                  £{exampleMargin.toFixed(2)} ({exampleMarginPercent.toFixed(1)}%)
                </div>
              </div>

              <div className="h-px bg-slate-300"></div>

              <div>
                <div className="text-sm text-slate-600 mb-1">Driver Earnings</div>
                <div className="text-2xl font-bold text-green-600">£{exampleDriverPrice.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-3">How it works</h3>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold text-xs">
                  1
                </div>
                <div>Customer booking is calculated using customer rate cards</div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold text-xs">
                  2
                </div>
                <div>Driver price is calculated automatically based on your configuration</div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold text-xs">
                  3
                </div>
                <div>Admin sees both prices, driver sees only driver price</div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold text-xs">
                  4
                </div>
                <div>Platform margin is calculated automatically</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extra Pricing Settings Modal */}
      {showExtraPricingSettings && (
        <AdminExtraPricingSettings onClose={() => setShowExtraPricingSettings(false)} />
      )}
    </div>
  );
}