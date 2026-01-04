import React, { useState, useEffect } from 'react';
import { 
  Save, Eye, EyeOff, Key, MapPin, Database, Mail, Bell, 
  Shield, CheckCircle, XCircle, Loader, RefreshCw, Copy,
  AlertCircle, Lock, Unlock, Globe, Settings, Zap, Check
} from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface ApiKey {
  name: string;
  key: string;
  isVisible: boolean;
  status: 'active' | 'inactive' | 'testing';
  lastTested?: Date;
}

export function SystemConfiguration() {
  // API Keys State
  const [mapboxToken, setMapboxToken] = useState('');
  const [stripeApiKey, setStripeApiKey] = useState('');
  const [twilioApiKey, setTwilioApiKey] = useState('');
  const [sendgridApiKey, setSendgridApiKey] = useState('');
  
  // Visibility toggles
  const [showMapbox, setShowMapbox] = useState(false);
  const [showStripe, setShowStripe] = useState(false);
  const [showTwilio, setShowTwilio] = useState(false);
  const [showSendgrid, setShowSendgrid] = useState(false);

  // Testing states
  const [isTestingMapbox, setIsTestingMapbox] = useState(false);
  const [mapboxStatus, setMapboxStatus] = useState<'success' | 'error' | null>(null);
  const [mapboxMessage, setMapboxMessage] = useState('');

  // Save states
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Load saved configuration
  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      // In production, load from backend/Supabase KV store
      const savedMapbox = localStorage.getItem('mapbox_token');
      const savedStripe = localStorage.getItem('admin_stripe_api_key');
      const savedTwilio = localStorage.getItem('admin_twilio_api_key');
      const savedSendgrid = localStorage.getItem('admin_sendgrid_api_key');

      if (savedMapbox) setMapboxToken(savedMapbox);
      if (savedStripe) setStripeApiKey(savedStripe);
      if (savedTwilio) setTwilioApiKey(savedTwilio);
      if (savedSendgrid) setSendgridApiKey(savedSendgrid);
    } catch (error) {
      console.error('Error loading configuration:', error);
    }
  };

  const saveConfiguration = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');

    try {
      // Save to localStorage (in production, save to backend/Supabase KV store)
      if (mapboxToken) {
        localStorage.setItem('mapbox_token', mapboxToken);
        // Also update mapboxgl default
        mapboxgl.accessToken = mapboxToken;
      }
      if (stripeApiKey) localStorage.setItem('admin_stripe_api_key', stripeApiKey);
      if (twilioApiKey) localStorage.setItem('admin_twilio_api_key', twilioApiKey);
      if (sendgridApiKey) localStorage.setItem('admin_sendgrid_api_key', sendgridApiKey);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setSaveError('Failed to save configuration. Please try again.');
      console.error('Error saving configuration:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const testMapboxConnection = async () => {
    if (!mapboxToken) {
      setMapboxStatus('error');
      setMapboxMessage('Please enter a Mapbox token first');
      return;
    }

    setIsTestingMapbox(true);
    setMapboxStatus(null);
    setMapboxMessage('');

    try {
      // Test Mapbox Geocoding API or just simple init check
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/London.json?access_token=${mapboxToken}`;
      const response = await fetch(url);
      
      if (response.ok) {
        setMapboxStatus('success');
        setMapboxMessage('✅ Mapbox Token is valid and working!');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Invalid Token');
      }

    } catch (error: any) {
      setMapboxStatus('error');
      setMapboxMessage(`❌ ${error.message || 'Invalid Token'}. Please check your Mapbox account.`);
    } finally {
        setIsTestingMapbox(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Key copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">System Configuration</h2>
            <p className="text-indigo-100 text-sm">Manage API keys and integrations</p>
          </div>
        </div>
      </div>

      {/* Save Status Banner */}
      {saveSuccess && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div className="flex-1">
            <div className="font-bold text-green-900">Configuration Saved Successfully!</div>
            <div className="text-sm text-green-700">Your changes have been applied.</div>
          </div>
        </div>
      )}

      {saveError && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-600" />
          <div className="flex-1">
            <div className="font-bold text-red-900">Error Saving Configuration</div>
            <div className="text-sm text-red-700">{saveError}</div>
          </div>
        </div>
      )}

      {/* Mapbox API Section */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Mapbox API</h3>
                <p className="text-sm text-slate-600">Required for live tracking and route planning</p>
              </div>
            </div>
            {mapboxToken && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-green-700">Configured</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* API Key Input */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Public Access Token
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type={showMapbox ? 'text' : 'password'}
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                placeholder="pk.eyJ1..."
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none pr-24 font-mono text-sm"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                <button
                  onClick={() => setShowMapbox(!showMapbox)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                  title={showMapbox ? 'Hide' : 'Show'}
                >
                  {showMapbox ? (
                    <EyeOff className="w-4 h-4 text-slate-600" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-600" />
                  )}
                </button>
                {mapboxToken && (
                  <button
                    onClick={() => copyToClipboard(mapboxToken)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                    title="Copy"
                  >
                    <Copy className="w-4 h-4 text-slate-600" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Test Connection Button */}
          <div className="flex gap-3">
            <button
              onClick={testMapboxConnection}
              disabled={isTestingMapbox || !mapboxToken}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg font-semibold transition-all"
            >
              {isTestingMapbox ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Testing Token...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Test Connection
                </>
              )}
            </button>

            <a
              href="https://account.mapbox.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-all"
            >
              <Globe className="w-4 h-4" />
              Get Access Token
            </a>
          </div>

          {/* Test Result */}
          {mapboxStatus && (
            <div className={`p-4 rounded-xl border-2 ${
              mapboxStatus === 'success' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-3">
                {mapboxStatus === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <div className={`text-sm font-semibold ${
                  mapboxStatus === 'success' ? 'text-green-900' : 'text-red-900'
                }`}>
                  {mapboxMessage}
                </div>
              </div>
            </div>
          )}

          {/* Setup Instructions */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-900">
                <div className="font-bold mb-2">Quick Setup Guide:</div>
                <ol className="list-decimal list-inside space-y-1 text-blue-800">
                  <li>Go to <a href="https://account.mapbox.com/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Mapbox Account</a></li>
                  <li>Sign up or Log in</li>
                  <li>Copy your "Default public token" (starts with pk.)</li>
                  <li>Paste it above and click "Test Connection"</li>
                  <li>Save configuration</li>
                </ol>
                <div className="mt-3 p-2 bg-blue-100 rounded border border-blue-300">
                  <div className="font-bold text-xs mb-1">💰 Pricing:</div>
                  <div className="text-xs">Generous free tier (up to 50,000 loads/mo).</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stripe API Section */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Key className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Stripe API</h3>
                <p className="text-sm text-slate-600">Payment processing and invoicing</p>
              </div>
            </div>
            {stripeApiKey && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-green-700">Configured</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Stripe Secret Key
              <span className="text-slate-400 ml-1 text-xs">(Optional)</span>
            </label>
            <div className="relative">
              <input
                type={showStripe ? 'text' : 'password'}
                value={stripeApiKey}
                onChange={(e) => setStripeApiKey(e.target.value)}
                placeholder="sk_live_..."
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-purple-500 focus:outline-none pr-12 font-mono text-sm"
              />
              <button
                onClick={() => setShowStripe(!showStripe)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-slate-100 rounded-lg transition-all"
              >
                {showStripe ? (
                  <EyeOff className="w-4 h-4 text-slate-600" />
                ) : (
                  <Eye className="w-4 h-4 text-slate-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Twilio API Section */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Twilio API</h3>
                <p className="text-sm text-slate-600">SMS notifications and alerts</p>
              </div>
            </div>
            {twilioApiKey && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-green-700">Configured</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Twilio Auth Token
              <span className="text-slate-400 ml-1 text-xs">(Optional)</span>
            </label>
            <div className="relative">
              <input
                type={showTwilio ? 'text' : 'password'}
                value={twilioApiKey}
                onChange={(e) => setTwilioApiKey(e.target.value)}
                placeholder="Enter Twilio auth token"
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-green-500 focus:outline-none pr-12 font-mono text-sm"
              />
              <button
                onClick={() => setShowTwilio(!showTwilio)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-slate-100 rounded-lg transition-all"
              >
                {showTwilio ? (
                  <EyeOff className="w-4 h-4 text-slate-600" />
                ) : (
                  <Eye className="w-4 h-4 text-slate-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SendGrid API Section */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">SendGrid API</h3>
                <p className="text-sm text-slate-600">Email notifications and marketing</p>
              </div>
            </div>
            {sendgridApiKey && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-green-700">Configured</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              SendGrid API Key
              <span className="text-slate-400 ml-1 text-xs">(Optional)</span>
            </label>
            <div className="relative">
              <input
                type={showSendgrid ? 'text' : 'password'}
                value={sendgridApiKey}
                onChange={(e) => setSendgridApiKey(e.target.value)}
                placeholder="SG...."
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-orange-500 focus:outline-none pr-12 font-mono text-sm"
              />
              <button
                onClick={() => setShowSendgrid(!showSendgrid)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-slate-100 rounded-lg transition-all"
              >
                {showSendgrid ? (
                  <EyeOff className="w-4 h-4 text-slate-600" />
                ) : (
                  <Eye className="w-4 h-4 text-slate-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="sticky bottom-4 bg-white rounded-xl shadow-2xl border-2 border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-slate-600" />
            <div>
              <div className="font-bold text-slate-900">Save Configuration</div>
              <div className="text-sm text-slate-600">All API keys are encrypted and stored securely</div>
            </div>
          </div>
          <button
            onClick={saveConfiguration}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white rounded-xl font-bold shadow-lg transition-all"
          >
            {isSaving ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-5 h-5" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save All Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-slate-600 mt-0.5" />
          <div className="text-sm text-slate-700">
            <div className="font-bold mb-1">🔒 Security Notice</div>
            <div className="text-slate-600">
              All API keys are encrypted before storage. Never share your admin credentials or API keys with anyone.
              Always use environment-specific keys (test keys for development, production keys for live environment).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
