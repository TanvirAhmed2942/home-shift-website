import React from 'react';
import { Loader2, Car, MapPin, Clock, Info, Check } from 'lucide-react';
import { QuoteResponse } from '../../utils/pricingEngine';

interface QuoteSummaryPanelProps {
  quote: QuoteResponse | null;
  isLoading: boolean;
  serviceType: string;
}

export function QuoteSummaryPanel({ quote, isLoading, serviceType }: QuoteSummaryPanelProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <h3 className="text-lg font-bold mb-1">Your Quote</h3>
        <p className="text-blue-100 text-sm">Instant estimate based on your inputs</p>
      </div>

      <div className="p-6">
        {isLoading && !quote ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-3" />
            <p className="text-sm">Calculating best price...</p>
          </div>
        ) : !quote ? (
          <div className="text-center py-12 text-slate-400">
            <Info className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Enter pickup & delivery details to see your price.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Total Price */}
            <div className="text-center pb-6 border-b border-slate-100">
              <div className="text-sm text-slate-500 font-medium mb-1 uppercase tracking-wider">Estimated Total</div>
              <div className="text-4xl font-extrabold text-slate-900 flex items-center justify-center gap-1">
                <span className="text-2xl text-slate-400 font-normal top-0">£</span>
                {quote.breakdown.total.toFixed(2)}
              </div>
              <div className="text-xs text-green-600 font-medium mt-2 flex items-center justify-center gap-1">
                <Check className="w-3 h-3" />
                Includes VAT & Insurance
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Car className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Vehicle</span>
                </div>
                <div className="font-semibold text-slate-900 capitalize text-sm">
                  {quote.recommendedVehicle}
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">Duration</span>
                </div>
                <div className="font-semibold text-slate-900 text-sm">
                  ~{quote.estimatedDuration}
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Base Fare ({quote.distance.toFixed(1)} miles)</span>
                <span className="font-medium text-slate-900">£{(quote.breakdown.basePrice + quote.breakdown.distancePrice).toFixed(2)}</span>
              </div>
              
              {quote.breakdown.vehicleSurcharge > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Vehicle Upgrade</span>
                  <span className="font-medium text-slate-900">£{quote.breakdown.vehicleSurcharge.toFixed(2)}</span>
                </div>
              )}
              
              {quote.breakdown.stairsSurcharge > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Stairs / Access</span>
                  <span className="font-medium text-slate-900">£{quote.breakdown.stairsSurcharge.toFixed(2)}</span>
                </div>
              )}

              {quote.breakdown.extrasPrice > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Extras & Helpers</span>
                  <span className="font-medium text-slate-900">£{quote.breakdown.extrasPrice.toFixed(2)}</span>
                </div>
              )}

              {quote.breakdown.congestionZone > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Congestion / ULEZ</span>
                  <span className="font-medium text-slate-900">£{quote.breakdown.congestionZone.toFixed(2)}</span>
                </div>
              )}
               
               <div className="flex justify-between text-sm pt-2 border-t border-slate-100">
                  <span className="text-slate-600">VAT (20%)</span>
                  <span className="font-medium text-slate-900">£{quote.breakdown.vat.toFixed(2)}</span>
               </div>
            </div>

            {/* Deposit Info */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-blue-800">To Pay Now (Deposit)</span>
                <span className="text-lg font-bold text-blue-800">£{quote.breakdown.deposit.toFixed(2)}</span>
              </div>
              <p className="text-xs text-blue-600">
                Remaining £{(quote.breakdown.total - quote.breakdown.deposit).toFixed(2)} paid on completion.
              </p>
            </div>
            
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
