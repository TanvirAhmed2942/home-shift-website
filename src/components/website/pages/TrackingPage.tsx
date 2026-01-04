import React from 'react';
import { LiveTrackingMap } from '../LiveTrackingMap';

export default function TrackingPage() {
  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Live Tracking</h1>
        <div className="h-[600px] rounded-2xl overflow-hidden shadow-xl border border-slate-200">
           {/* Mock props for demo */}
           <LiveTrackingMap 
             jobId="demo-job"
             pickupLocation={{ latitude: 51.5074, longitude: -0.1278, address: 'London' }}
             deliveryLocation={{ latitude: 55.9533, longitude: -3.1883, address: 'Edinburgh' }}
             customerName="John Doe"
             driverName="Mike Smith"
           />
        </div>
      </div>
    </div>
  );
}
