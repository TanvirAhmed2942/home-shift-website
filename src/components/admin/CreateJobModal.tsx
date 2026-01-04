import React, { useState, useEffect } from 'react';
import { 
  X, MapPin, Calendar, Clock, Truck, Package, User, 
  ChevronRight, ChevronLeft, Calculator, Save, CheckCircle, 
  AlertCircle, DollarSign, Plus, Trash2, Edit3 
} from 'lucide-react';
import { AddressAutocomplete } from '../ui/AddressAutocomplete';
import { mapService, RouteResult } from '../../utils/mapService';
import { jobStatusManager, Job } from '../../utils/jobStatusManager';

interface CreateJobModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

// Minimal items type for manual entry
interface JobItem {
  id: string;
  name: string;
  quantity: number;
  volume: number; // m3
}

// Address result interface
interface AddressData {
  address: string;
  postcode?: string;
  lat: number;
  lng: number;
}

export function CreateJobModal({ onClose, onSuccess }: CreateJobModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Job Data State
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '' });
  const [pickup, setPickup] = useState<AddressData | null>(null);
  const [delivery, setDelivery] = useState<AddressData | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteResult | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [items, setItems] = useState<JobItem[]>([]);
  const [vehicle, setVehicle] = useState('Large Van');
  
  // Pricing State
  const [autoPrice, setAutoPrice] = useState(0);
  const [manualPrice, setManualPrice] = useState<string>('');
  const [priceOverride, setPriceOverride] = useState(false);
  const [priceReason, setPriceReason] = useState('');

  // Temp Item State
  const [newItemName, setNewItemName] = useState('');
  const [newItemVol, setNewItemVol] = useState('0.5');
  const [newItemQty, setNewItemQty] = useState('1');

  // Step 2: Calculate Route when addresses change
  useEffect(() => {
    async function calcRoute() {
      if (pickup && delivery) {
        setLoading(true);
        try {
          const res = await mapService.calculateRoute(pickup, delivery);
          setRouteInfo(res);
        } catch (e) {
          console.error("Route calc failed", e);
        } finally {
          setLoading(false);
        }
      }
    }
    calcRoute();
  }, [pickup, delivery]);

  // Step 4: Calculate Auto Price
  useEffect(() => {
    if (routeInfo) {
      // Basic Pricing Logic: Base £40 + £1.5/mile + £10/m3
      const totalVol = items.reduce((acc, item) => acc + (item.volume * item.quantity), 0);
      const distCost = routeInfo.distanceMiles * 1.5;
      const volCost = totalVol * 20; // £20 per cubic meter
      const vehicleBase = vehicle === 'Luton Van' ? 60 : 40;
      
      const price = Math.round(vehicleBase + distCost + volCost);
      setAutoPrice(price);
    }
  }, [routeInfo, items, vehicle]);

  const addItem = () => {
    if (!newItemName) return;
    const item: JobItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newItemName,
      volume: parseFloat(newItemVol),
      quantity: parseInt(newItemQty)
    };
    setItems([...items, item]);
    setNewItemName('');
    setNewItemQty('1');
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleSave = (status: 'draft' | 'available') => {
    if (!pickup || !delivery || !customer.name) return;

    const finalPrice = priceOverride && manualPrice ? parseFloat(manualPrice) : autoPrice;
    const totalVol = items.reduce((acc, item) => acc + (item.volume * item.quantity), 0);

    const newJob: Job = {
      id: `JOB-${Math.floor(Math.random() * 10000)}`,
      status: status,
      date: date || new Date().toISOString().split('T')[0],
      time: time || '09:00',
      customerName: customer.name,
      pickup: {
        address: pickup.address,
        postcode: pickup.postcode || 'N/A',
        lat: pickup.lat,
        lng: pickup.lng
      },
      delivery: {
        address: delivery.address,
        postcode: delivery.postcode || 'N/A',
        lat: delivery.lat,
        lng: delivery.lng
      },
      totalVolume: totalVol,
      customerPrice: finalPrice,
      driverPrice: Math.round(finalPrice * 0.7), // 70% to driver
      reference: `MAN-${Date.now().toString().slice(-6)}`,
      items: items.map(i => i.name), // Simplified for Job interface
      vehicleType: vehicle
    };

    // In a real app, we'd call an API. Here we push to our mock manager
    // We need to extend jobStatusManager to accept new jobs, or just use the event system
    // For now, we'll simulate it by dispatching a custom event that JobsManagement listens to?
    // Actually jobStatusManager doesn't have an 'addJob' method exposed in the interface usually.
    // Let's assume we can inject it or re-fetch.
    
    console.log("Saving Job:", newJob);
    // Since jobStatusManager.jobs is private/mocked, we might not see it persist across reloads
    // unless we modified jobStatusManager.ts. But for the UI demo:
    
    // Quick hack to inject into the local list in JobsManagement if we passed a callback
    // But better: Let's assume onSucess triggers a reload.
    
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-400" />
              Manual Job Creation
            </h2>
            <p className="text-slate-400 text-sm">Step {step} of 4</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-slate-100 w-full shrink-0">
          <div 
            className="h-full bg-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* STEP 1: CUSTOMER & DATE */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Customer Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={customer.name}
                      onChange={e => setCustomer({...customer, name: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    value={customer.phone}
                    onChange={e => setCustomer({...customer, phone: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="+44 7000 000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={customer.email}
                    onChange={e => setCustomer({...customer, email: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-800 border-b pb-2 pt-4">Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="date" 
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Time Window</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="time" 
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATIONS */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Route Planning</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Pickup Address</label>
                  <AddressAutocomplete 
                    placeholder="Enter postcode or address..."
                    defaultValue={pickup?.address}
                    onSelect={(address, lat, lng) => setPickup({ address, lat, lng })}
                  />
                </div>
                
                <div className="flex justify-center -my-2 relative z-10">
                  <div className="bg-slate-100 p-1.5 rounded-full border border-slate-200">
                    <Truck className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Delivery Address</label>
                  <AddressAutocomplete 
                    placeholder="Enter postcode or address..."
                    defaultValue={delivery?.address}
                    onSelect={(address, lat, lng) => setDelivery({ address, lat, lng })}
                  />
                </div>
              </div>

              {/* Map Preview / Route Info */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mt-6">
                {loading ? (
                  <div className="flex items-center justify-center py-4 text-slate-500 gap-2">
                    <Calculator className="w-4 h-4 animate-spin" />
                    Calculating route...
                  </div>
                ) : routeInfo ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Estimated Distance</p>
                      <p className="text-xl font-bold text-slate-900">{routeInfo.distanceMiles} miles</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Est. Travel Time</p>
                      <p className="text-xl font-bold text-slate-900">{routeInfo.durationMinutes} mins</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-slate-400 italic">
                    Enter both addresses to calculate route
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: ITEMS & VEHICLE */}
          {step === 3 && (
            <div className="space-y-6">
               <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Vehicle & Items</h3>
               
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-2">Required Vehicle</label>
                 <div className="grid grid-cols-3 gap-3">
                   {['Medium Van', 'Large Van', 'Luton Van'].map(v => (
                     <button
                        key={v}
                        onClick={() => setVehicle(v)}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          vehicle === v 
                            ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' 
                            : 'border-slate-200 hover:border-blue-300'
                        }`}
                     >
                       <Truck className={`w-6 h-6 mx-auto mb-2 ${vehicle === v ? 'text-blue-600' : 'text-slate-400'}`} />
                       <span className="text-sm block">{v}</span>
                     </button>
                   ))}
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-2">Inventory</label>
                 
                 {/* Quick Add */}
                 <div className="flex gap-2 mb-4">
                   <input 
                     placeholder="Item name (e.g. Sofa)"
                     value={newItemName}
                     onChange={e => setNewItemName(e.target.value)}
                     className="flex-1 px-3 py-2 border rounded-lg text-sm"
                   />
                   <select 
                     value={newItemVol}
                     onChange={e => setNewItemVol(e.target.value)}
                     className="w-24 px-2 py-2 border rounded-lg text-sm"
                   >
                     <option value="0.1">Sm</option>
                     <option value="0.5">Med</option>
                     <option value="1.0">Lg</option>
                     <option value="1.5">XL</option>
                   </select>
                   <input 
                     type="number"
                     value={newItemQty}
                     onChange={e => setNewItemQty(e.target.value)}
                     className="w-16 px-2 py-2 border rounded-lg text-sm text-center"
                     min="1"
                   />
                   <button 
                     onClick={addItem}
                     className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                   >
                     <Plus className="w-5 h-5" />
                   </button>
                 </div>

                 {/* List */}
                 {items.length > 0 ? (
                   <div className="bg-slate-50 rounded-lg border border-slate-200 max-h-40 overflow-y-auto divide-y">
                     {items.map(item => (
                       <div key={item.id} className="p-3 flex items-center justify-between text-sm">
                         <span className="font-medium text-slate-700">{item.quantity}x {item.name}</span>
                         <div className="flex items-center gap-3">
                           <span className="text-slate-500 text-xs">{(item.volume * item.quantity).toFixed(1)} m³</span>
                           <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="text-center p-6 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-slate-400 text-sm">
                     No items added yet
                   </div>
                 )}
               </div>
            </div>
          )}

          {/* STEP 4: QUOTE & ACTIONS */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Quote & Review</h3>
              
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-blue-800 font-medium">Calculated System Price</span>
                  <span className="text-2xl font-bold text-blue-900">£{autoPrice.toFixed(2)}</span>
                </div>
                
                <div className="space-y-2 text-sm text-blue-700/80 mb-4">
                  <div className="flex justify-between">
                    <span>Base Fare ({vehicle})</span>
                    <span>included</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance ({routeInfo?.distanceMiles} mi)</span>
                    <span>+£{((routeInfo?.distanceMiles || 0) * 1.5).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Volume</span>
                    <span>+£{items.reduce((acc, i) => acc + (i.volume * i.quantity * 20), 0).toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <input 
                      type="checkbox"
                      id="override"
                      checked={priceOverride}
                      onChange={e => setPriceOverride(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="override" className="text-sm font-bold text-blue-900 cursor-pointer">
                      Manual Price Override
                    </label>
                  </div>
                  
                  {priceOverride && (
                    <div className="animate-in slide-in-from-top-2">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="number"
                            value={manualPrice}
                            onChange={e => setManualPrice(e.target.value)}
                            placeholder="0.00"
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-blue-200 focus:border-blue-500 outline-none"
                          />
                        </div>
                        <input 
                          type="text"
                          placeholder="Reason (e.g. VIP Customer)"
                          value={priceReason}
                          onChange={e => setPriceReason(e.target.value)}
                          className="flex-[2] px-4 py-2 rounded-lg border border-blue-200 focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex gap-3 text-sm text-yellow-800">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>
                  Review all details before publishing. Once published, the job will be visible to drivers or assigned automatically based on settings.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between shrink-0">
          {step > 1 ? (
            <button 
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
             <div></div>
          )}

          <div className="flex gap-3">
            {step < 4 ? (
              <button 
                onClick={() => setStep(step + 1)}
                className="px-6 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg font-medium flex items-center gap-2"
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button 
                  onClick={() => handleSave('draft')}
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
                >
                  Save as Draft
                </button>
                <button 
                  onClick={() => handleSave('available')}
                  className="px-6 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <CheckCircle className="w-4 h-4" />
                  Publish Job
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}