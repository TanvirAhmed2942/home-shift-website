import React, { useState, useEffect } from 'react';
import { Plug, Check, X, Settings, Zap, MapPin, Save, AlertTriangle } from 'lucide-react';

export function IntegrationsManager() {
  const [mapConfig, setMapConfig] = useState({
    provider: 'mapbox',
    apiKey: '',
    enabled: false
  });
  
  const [isEditingMap, setIsEditingMap] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Load initial config from localStorage or environment
  useEffect(() => {
    const storedConfig = localStorage.getItem('map_config');
    if (storedConfig) {
      setMapConfig(JSON.parse(storedConfig));
    }
  }, []);

  const handleSaveMapConfig = () => {
    setSaveStatus('saving');
    localStorage.setItem('map_config', JSON.stringify(mapConfig));
    
    // Simulate save delay
    setTimeout(() => {
      setSaveStatus('saved');
      setIsEditingMap(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
  };

  const integrations = [
    { 
      id: 1, 
      name: 'Mapbox API', 
      type: 'Maps', 
      status: mapConfig.enabled ? 'connected' : 'disconnected', 
      config: mapConfig.enabled ? `API Key: ••••••••${mapConfig.apiKey.slice(-4)}` : 'Not Configured',
      icon: MapPin 
    },
    { id: 2, name: 'Stripe', type: 'Payment', status: 'connected', config: 'sk_live_...9x2d', icon: Zap },
    { id: 3, name: 'Twilio', type: 'Communication', status: 'disconnected', config: 'Not configured', icon: Plug },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Integrations</h1>
          <p className="text-slate-600 mt-1">Manage API keys and third-party services</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MAPS INTEGRATION CARD */}
        <div className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all ${isEditingMap ? 'border-blue-500 ring-4 ring-blue-50 col-span-2' : 'border-slate-200'}`}>
          <div className="p-6 border-b border-slate-100 flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Maps & Geocoding</h3>
                <p className="text-sm text-slate-500">Power address search and distance calculations</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${mapConfig.enabled ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
              {mapConfig.enabled ? 'Active' : 'Disabled'}
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {isEditingMap ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Provider</label>
                    <select 
                      value={mapConfig.provider}
                      onChange={(e) => setMapConfig({...mapConfig, provider: e.target.value as any})}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    >
                      <option value="google">Google Maps Platform</option>
                      <option value="mapbox">Mapbox</option>
                    </select>
                   </div>
                   <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                    <div className="flex items-center gap-2 mt-2">
                      <input 
                        type="checkbox" 
                        checked={mapConfig.enabled}
                        onChange={(e) => setMapConfig({...mapConfig, enabled: e.target.checked})}
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <span className="text-sm text-slate-600">Enable Integration</span>
                    </div>
                   </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">API Key</label>
                  <input 
                    type="password"
                    value={mapConfig.apiKey}
                    onChange={(e) => setMapConfig({...mapConfig, apiKey: e.target.value})}
                    placeholder="Enter API Key starting with AIza..."
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 font-mono text-sm"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Key is stored locally in your browser for security.
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2 text-sm text-blue-800">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>
                    Ensure "Places API" and "Distance Matrix API" are enabled in your Google Cloud Console for this key.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    onClick={() => setIsEditingMap(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveMapConfig}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2"
                  >
                    {saveStatus === 'saved' ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saveStatus === 'saved' ? 'Saved' : 'Save Configuration'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                 <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                   <span className="text-slate-500">Provider</span>
                   <span className="font-medium capitalize">{mapConfig.provider}</span>
                 </div>
                 <div className="flex justify-between text-sm border-b border-slate-100 pb-2">
                   <span className="text-slate-500">API Key</span>
                   <span className="font-mono text-slate-700">
                     {mapConfig.apiKey ? `••••••••${mapConfig.apiKey.slice(-4)}` : 'Not Set'}
                   </span>
                 </div>
                 <div className="pt-2">
                   <button 
                    onClick={() => setIsEditingMap(true)}
                    className="w-full py-2 border border-slate-200 hover:border-blue-400 hover:text-blue-600 rounded-lg font-semibold transition-all"
                   >
                     Manage Settings
                   </button>
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Other Integrations (Read Only for Demo) */}
        {integrations.slice(1).map((integration) => (
           <div key={integration.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 opacity-75 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                  <integration.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{integration.name}</h3>
                  <p className="text-xs text-slate-500">{integration.type}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Status</span>
                  <span className={`font-medium ${integration.status === 'connected' ? 'text-green-600' : 'text-slate-400'}`}>
                    {integration.status}
                  </span>
                </div>
                <button className="w-full mt-2 py-1.5 bg-slate-50 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-100">
                  Configure
                </button>
              </div>
           </div>
        ))}

      </div>
    </div>
  );
}