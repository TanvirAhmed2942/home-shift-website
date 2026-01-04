import React, { useState } from 'react';
import {
  DollarSign, Send, Save, Download, Copy, Trash2, Edit, Eye,
  Calendar, Clock, MapPin, Package, Truck, Navigation, Users,
  CheckCircle, AlertCircle, MessageSquare, FileText, Settings,
  ArrowLeft, Printer, Mail, Bell, Star, TrendingUp, Activity,
  BarChart3, Zap, Shield, Award, Target, ChevronDown, ChevronUp,
  Phone, MessageCircle, Share2, Archive, MoreHorizontal, PlayCircle
} from 'lucide-react';

interface JourneyCreatedViewProps {
  journeyId: string;
  journeyNumber: string;
  totalPrice: number;
  driverRevenue: number;
  companyRevenue: number;
  startLocation: string;
  endLocation: string;
  startTime: Date;
  endTime: Date;
  totalStops: number;
  totalDistance: number;
  totalDrivingTime: number;
  totalLoadingTime: number;
  vehicleType: string;
  onBack: () => void;
  onModifyPrice: () => void;
  onSendToDriver: () => void;
}

export function JourneyCreatedView({
  journeyId,
  journeyNumber,
  totalPrice,
  driverRevenue,
  companyRevenue,
  startLocation,
  endLocation,
  startTime,
  endTime,
  totalStops,
  totalDistance,
  totalDrivingTime,
  totalLoadingTime,
  vehicleType,
  onBack,
  onModifyPrice,
  onSendToDriver
}: JourneyCreatedViewProps) {
  const [activeTab, setActiveTab] = useState<'breakdown' | 'schedule' | 'notes'>('breakdown');
  const [showPriceEditor, setShowPriceEditor] = useState(false);
  const [editedPrice, setEditedPrice] = useState(totalPrice);
  const [notes, setNotes] = useState('');
  const [driverNotes, setDriverNotes] = useState('');

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const handleSavePrice = () => {
    onModifyPrice();
    setShowPriceEditor(false);
    
    // Toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50';
    toast.innerHTML = `
      <div class="flex items-center gap-3">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span class="font-semibold">💰 Price Updated to £${editedPrice.toFixed(2)}</span>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handleSendToDriver = () => {
    onSendToDriver();
    
    // Toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50';
    toast.innerHTML = `
      <div class="flex items-center gap-3">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span class="font-semibold">🚚 Journey Sent to Driver Dashboard!</span>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handleDuplicateJourney = () => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-purple-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50';
    toast.innerHTML = `
      <div class="flex items-center gap-3">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span class="font-semibold">📋 Journey Duplicated Successfully!</span>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handleExportPDF = () => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-orange-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50';
    toast.innerHTML = `
      <div class="flex items-center gap-3">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <span class="font-semibold">📄 Exporting Journey PDF...</span>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-300 rounded-xl hover:shadow-lg transition-all text-slate-700 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Builder
        </button>

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Journey Created Successfully! 🎉</h2>
              <p className="text-sm text-slate-600">Journey #{journeyNumber} is ready to be dispatched</p>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-slate-600 mb-1">Total Journey Value</div>
          <div className="text-3xl font-black text-green-600">£{totalPrice.toFixed(2)}</div>
          <div className="text-xs text-slate-500">Driver: £{driverRevenue.toFixed(2)} • Company: £{companyRevenue.toFixed(2)}</div>
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-blue-600" />
          <div className="flex-1">
            <div className="font-bold text-blue-900">Next step: Send this Journey to the driver's Dashboard</div>
            <div className="text-sm text-blue-700">Review all details below and click "Send to Driver" when ready.</div>
          </div>
          <button
            onClick={handleSendToDriver}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            Send to Driver
          </button>
        </div>
      </div>

      {/* Journey Summary Card */}
      <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-purple-100 mb-1">Journey ID: {journeyId}</div>
              <h3 className="text-2xl font-bold mb-2">{totalStops} Stops Journey / Full Day / {vehicleType}</h3>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span>{totalStops} jobs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  <span>{totalDistance.toFixed(0)} miles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(totalDrivingTime + totalLoadingTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>{vehicleType}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-all">
                <Star className="w-5 h-5" />
              </button>
              <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-all">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-all">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Route Summary */}
        <div className="p-6 border-b-2 border-slate-200">
          <div className="flex items-center gap-6">
            {/* Start Location */}
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-300">
                  <div className="text-blue-900 font-bold text-sm">1</div>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900 mb-1">{startLocation.split(',')[0]}</div>
                  <div className="text-sm text-slate-600">{formatDate(startTime)}, starting at {formatTime(startTime)}</div>
                </div>
              </div>
            </div>

            {/* Timeline Connector */}
            <div className="relative flex-shrink-0 px-8">
              <div className="absolute left-0 right-0 top-5 h-0.5 bg-gradient-to-r from-blue-300 via-purple-300 to-green-300"></div>
              <div className="relative bg-white px-4 py-2 rounded-lg border-2 border-purple-200 text-center">
                <div className="text-xs text-purple-700 font-semibold mb-1">Journey Duration</div>
                <div className="font-bold text-purple-900">{formatDuration(totalDrivingTime + totalLoadingTime)}</div>
              </div>
            </div>

            {/* End Location */}
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-300">
                  <div className="text-green-900 font-bold text-sm">{totalStops}</div>
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-900 mb-1">{endLocation.split(',')[0]}</div>
                  <div className="text-sm text-slate-600">{formatDate(endTime)}, ending at {formatTime(endTime)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b-2 border-slate-200">
          <div className="flex gap-1 px-6">
            <button
              onClick={() => setActiveTab('breakdown')}
              className={`px-6 py-3 font-semibold transition-all border-b-4 ${
                activeTab === 'breakdown'
                  ? 'border-green-600 text-green-900'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Breakdown
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-6 py-3 font-semibold transition-all border-b-4 ${
                activeTab === 'schedule'
                  ? 'border-green-600 text-green-900'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Schedule
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-6 py-3 font-semibold transition-all border-b-4 ${
                activeTab === 'notes'
                  ? 'border-green-600 text-green-900'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Notes & Instructions
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'breakdown' && (
            <div className="space-y-4">
              <h4 className="font-bold text-lg text-slate-900 mb-4">Journey Breakdown</h4>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-slate-200">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">Total driving time</span>
                    </div>
                    <span className="font-bold text-slate-900">{formatDuration(totalDrivingTime)}</span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-slate-200">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Package className="w-4 h-4 text-orange-600" />
                      <span className="font-semibold">Total loading & unloading time</span>
                    </div>
                    <span className="font-bold text-slate-900">{formatDuration(totalLoadingTime)}</span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-slate-200">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Navigation className="w-4 h-4 text-purple-600" />
                      <span className="font-semibold">Total distance</span>
                    </div>
                    <span className="font-bold text-slate-900">{totalDistance.toFixed(0)} miles</span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-slate-200">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Truck className="w-4 h-4 text-green-600" />
                      <span className="font-semibold">Vehicle type</span>
                    </div>
                    <span className="font-bold text-slate-900">{vehicleType}</span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-slate-200">
                    <div className="flex items-center gap-2 text-slate-700">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <span className="font-semibold">Total stops</span>
                    </div>
                    <span className="font-bold text-slate-900">{totalStops} stops</span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-slate-200">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Calendar className="w-4 h-4 text-cyan-600" />
                      <span className="font-semibold">Journey date</span>
                    </div>
                    <span className="font-bold text-slate-900">{startTime.toLocaleDateString('en-GB')}</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="mt-6 pt-6 border-t-2 border-slate-200">
                <h5 className="font-bold text-slate-900 mb-4">Revenue Split</h5>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                    <div className="text-sm text-blue-700 font-semibold mb-1">Total Price</div>
                    <div className="text-2xl font-black text-blue-900">£{totalPrice.toFixed(2)}</div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                    <div className="text-sm text-green-700 font-semibold mb-1">Driver Revenue (70%)</div>
                    <div className="text-2xl font-black text-green-900">£{driverRevenue.toFixed(2)}</div>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                    <div className="text-sm text-purple-700 font-semibold mb-1">Company Revenue (30%)</div>
                    <div className="text-2xl font-black text-purple-900">£{companyRevenue.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <h4 className="font-bold text-lg text-slate-900 mb-4">Journey Schedule</h4>
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="font-bold text-blue-900">Full schedule available in Journey Builder</div>
                    <div className="text-sm text-blue-700">View detailed timeline with all stops and times</div>
                  </div>
                </div>
                <button
                  onClick={onBack}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                >
                  View Full Timeline
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-6">
              <div>
                <label className="block font-bold text-slate-900 mb-2">Admin Notes (Internal)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add internal notes about this journey..."
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                  rows={4}
                />
              </div>

              <div>
                <label className="block font-bold text-slate-900 mb-2">Driver Instructions</label>
                <textarea
                  value={driverNotes}
                  onChange={(e) => setDriverNotes(e.target.value)}
                  placeholder="Add special instructions for the driver..."
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                  rows={4}
                />
              </div>

              <button className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                <Save className="w-5 h-5" />
                Save Notes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Grid */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-6">
        <h4 className="font-bold text-lg text-slate-900 mb-4">Journey Actions</h4>
        
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Primary Actions */}
          <button
            onClick={() => setShowPriceEditor(!showPriceEditor)}
            className="flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
          >
            <DollarSign className="w-5 h-5" />
            <span>Modify Price</span>
          </button>

          <button
            onClick={handleSendToDriver}
            className="flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
          >
            <Send className="w-5 h-5" />
            <span>Send to Driver</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
          >
            <Download className="w-5 h-5" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={handleDuplicateJourney}
            className="flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
          >
            <Copy className="w-5 h-5" />
            <span>Duplicate</span>
          </button>

          {/* Secondary Actions */}
          <button className="flex items-center gap-3 px-4 py-4 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:shadow-lg transition-all">
            <Save className="w-5 h-5" />
            <span>Save Template</span>
          </button>

          <button className="flex items-center gap-3 px-4 py-4 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:shadow-lg transition-all">
            <Printer className="w-5 h-5" />
            <span>Print</span>
          </button>

          <button className="flex items-center gap-3 px-4 py-4 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:shadow-lg transition-all">
            <Mail className="w-5 h-5" />
            <span>Email</span>
          </button>

          <button className="flex items-center gap-3 px-4 py-4 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:shadow-lg transition-all">
            <MessageSquare className="w-5 h-5" />
            <span>Add Note</span>
          </button>

          <button className="flex items-center gap-3 px-4 py-4 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:shadow-lg transition-all">
            <Eye className="w-5 h-5" />
            <span>Preview</span>
          </button>

          <button className="flex items-center gap-3 px-4 py-4 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:shadow-lg transition-all">
            <Archive className="w-5 h-5" />
            <span>Archive</span>
          </button>

          <button className="flex items-center gap-3 px-4 py-4 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:shadow-lg transition-all">
            <Phone className="w-5 h-5" />
            <span>Call Driver</span>
          </button>

          <button className="flex items-center gap-3 px-4 py-4 bg-white border-2 border-red-300 text-red-700 rounded-xl font-semibold hover:shadow-lg transition-all hover:bg-red-50">
            <Trash2 className="w-5 h-5" />
            <span>Cancel Journey</span>
          </button>
        </div>
      </div>

      {/* Price Editor Modal */}
      {showPriceEditor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Modify Journey Price</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">New Total Price</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">£</span>
                <input
                  type="number"
                  value={editedPrice}
                  onChange={(e) => setEditedPrice(parseFloat(e.target.value))}
                  className="w-full pl-10 pr-4 py-4 text-2xl font-bold border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none"
                  step="0.01"
                />
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200 mb-6">
              <div className="text-sm text-blue-900 font-semibold mb-2">New Revenue Split:</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-blue-700">Driver (70%)</div>
                  <div className="font-bold text-blue-900">£{(editedPrice * 0.7).toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs text-blue-700">Company (30%)</div>
                  <div className="font-bold text-blue-900">£{(editedPrice * 0.3).toFixed(2)}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPriceEditor(false)}
                className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePrice}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Save Price
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
