import React, { useState, useEffect } from 'react';
import { Calculator, Package, Truck, Users, Plus, Minus, Navigation, Download, Loader2, ArrowRight, TrendingUp } from 'lucide-react';
import { PricingEngine, QuoteResponse } from '../../utils/pricingEngine';

// Local constants for Admin Calculator
const VEHICLE_TYPES = [
  { id: 'small', name: 'Small Van', icon: <Truck className="w-5 h-5" />, minVolume: 0, maxVolume: 5 },
  { id: 'medium', name: 'Medium Van', icon: <Truck className="w-6 h-6" />, minVolume: 5, maxVolume: 10 },
  { id: 'large', name: 'Large Van', icon: <Truck className="w-7 h-7" />, minVolume: 10, maxVolume: 18 },
  { id: 'luton', name: 'Luton Van', icon: <Truck className="w-8 h-8" />, minVolume: 18, maxVolume: 25 },
];

const EXTRAS_CATALOG = [
  { id: 'assembly', name: 'Assembly Service', price: 30, type: 'flat' },
  { id: 'disassembly', name: 'Disassembly Service', price: 30, type: 'flat' },
  { id: 'packaging', name: 'Packaging Materials', price: 50, type: 'flat' },
];

// Mock items library
const ITEMS_LIBRARY = [
  { id: '11', name: '2-seat sofa', category: 'Living Room', volume: 1.22 },
  { id: '12', name: '3-seat sofa', category: 'Living Room', volume: 1.84 },
  { id: '34', name: 'Double mattress', category: 'Bedroom', volume: 0.61 },
  { id: '38', name: 'Double bed frame', category: 'Bedroom', volume: 1.02 },
  { id: '48', name: 'Wardrobe 2 doors', category: 'Bedroom', volume: 1.22 },
  { id: '56', name: 'Fridge freezer', category: 'Kitchen', volume: 1.02 },
  { id: '59', name: 'Washing machine', category: 'Kitchen', volume: 0.61 },
  { id: '70', name: 'Dining table (6 seats)', category: 'Dining', volume: 1.22 },
  { id: '2', name: 'Medium box', category: 'Boxes', volume: 0.05 },
  { id: '3', name: 'Large box', category: 'Boxes', volume: 0.08 },
];

interface SelectedItem {
  itemId: string;
  quantity: number;
}

export function QuoteCalculator() {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [distance, setDistance] = useState(15);
  const [crewSize, setCrewSize] = useState(2);
  const [selectedExtras, setSelectedExtras] = useState<Record<string, boolean>>({});
  const [manualVehicleOverride, setManualVehicleOverride] = useState<string>('auto');
  
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalVolume, setTotalVolume] = useState(0);

  // Recalculate volume when items change
  useEffect(() => {
    const vol = selectedItems.reduce((acc, item) => {
      const libItem = ITEMS_LIBRARY.find(i => i.id === item.itemId);
      return acc + (libItem ? libItem.volume * item.quantity : 0);
    }, 0);
    setTotalVolume(vol);
  }, [selectedItems]);

  // Recalculate Quote
  useEffect(() => {
    const calculate = async () => {
      if (selectedItems.length === 0) {
        setQuote(null);
        return;
      }

      setIsLoading(true);
      
      // Determine vehicle based on volume if auto
      let vehicleType = manualVehicleOverride;
      if (vehicleType === 'auto') {
        const vol = totalVolume * 1.1; // 10% safety margin
        if (vol <= 5) vehicleType = 'small';
        else if (vol <= 10) vehicleType = 'medium';
        else if (vol <= 18) vehicleType = 'large';
        else vehicleType = 'luton';
      }

      try {
        const response = await PricingEngine.calculateQuote({
          serviceType: 'house-move',
          pickup: { address: 'Admin Entry', postcode: 'ADMIN', floor: 0, hasLift: true },
          dropoff: { address: 'Admin Entry', postcode: 'ADMIN', floor: 0, hasLift: true },
          date: new Date(),
          items: selectedItems,
          distance: distance,
          selectedVehicle: vehicleType as any,
          extras: {
            assembly: !!selectedExtras['assembly'],
            disassembly: !!selectedExtras['disassembly'],
            packaging: !!selectedExtras['packaging'],
            helpers: crewSize
          }
        });
        setQuote(response);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(calculate, 500); // Debounce
    return () => clearTimeout(timer);
  }, [selectedItems, distance, crewSize, selectedExtras, manualVehicleOverride, totalVolume]);


  // Add item
  const addItem = (itemId: string) => {
    const existing = selectedItems.find((i) => i.itemId === itemId);
    if (existing) {
      setSelectedItems(selectedItems.map((i) => (i.itemId === itemId ? { ...i, quantity: i.quantity + 1 } : i)));
    } else {
      setSelectedItems([...selectedItems, { itemId, quantity: 1 }]);
    }
  };

  // Remove item
  const removeItem = (itemId: string) => {
    const existing = selectedItems.find((i) => i.itemId === itemId);
    if (existing && existing.quantity > 1) {
      setSelectedItems(selectedItems.map((i) => (i.itemId === itemId ? { ...i, quantity: i.quantity - 1 } : i)));
    } else {
      setSelectedItems(selectedItems.filter((i) => i.itemId !== itemId));
    }
  };

  const toggleExtra = (id: string) => {
    setSelectedExtras(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Admin Projections
  const platformMargin = quote ? quote.breakdown.total * 0.3 : 0; // 30% margin
  const driverEarnings = quote ? quote.breakdown.total * 0.7 : 0; // 70% to driver

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Quote Calculator</h2>
          <p className="text-slate-600 mt-1">Admin tool for instant phone quotes</p>
        </div>
        {quote && (
          <button
            onClick={() => alert('Feature coming soon')}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <Download className="w-5 h-5" />
            Export PDF
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT: Inputs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Items Selector */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Select Items
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {ITEMS_LIBRARY.map((item) => {
                const selected = selectedItems.find((i) => i.itemId === item.id);
                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      selected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900 text-sm">{item.name}</div>
                        <div className="text-xs text-slate-500">{item.category}</div>
                        <div className="text-xs font-bold text-blue-600 mt-1">{item.volume.toFixed(2)} m³</div>
                      </div>
                      {selected ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-7 h-7 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold text-slate-900 w-6 text-center">{selected.quantity}</span>
                          <button
                            onClick={() => addItem(item.id)}
                            className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addItem(item.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-all"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Job Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-purple-600" />
                Parameters
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Distance (miles)
                  </label>
                  <input
                    type="number"
                    value={distance}
                    onChange={(e) => setDistance(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Crew Size
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((size) => (
                      <button
                        key={size}
                        onClick={() => setCrewSize(size)}
                        className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                          crewSize === size
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {size} Man
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
               <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-600" />
                Vehicle & Extras
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Vehicle Type</label>
                  <select
                    value={manualVehicleOverride}
                    onChange={(e) => setManualVehicleOverride(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  >
                    <option value="auto">Auto-select (Best Fit)</option>
                    {VEHICLE_TYPES.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                   {EXTRAS_CATALOG.map(extra => (
                     <label key={extra.id} className="flex items-center gap-2 cursor-pointer">
                       <input 
                         type="checkbox" 
                         checked={!!selectedExtras[extra.id]}
                         onChange={() => toggleExtra(extra.id)}
                         className="w-4 h-4 text-blue-600 rounded"
                       />
                       <span className="text-sm text-slate-700">{extra.name} (+£{extra.price})</span>
                     </label>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Results */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            {isLoading && !quote ? (
               <div className="bg-white rounded-2xl shadow-lg p-12 flex items-center justify-center">
                 <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
               </div>
            ) : quote ? (
              <div className="space-y-4">
                {/* Volume Summary */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 border border-blue-200">
                  <h3 className="font-bold text-slate-900 mb-4">Volume Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Total Items Volume:</span>
                      <span className="font-bold text-slate-900">{totalVolume.toFixed(2)} m³</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Safety Margin (+10%):</span>
                      <span className="font-bold text-blue-600">
                        +{(totalVolume * 0.1).toFixed(2)} m³
                      </span>
                    </div>
                    <div className="pt-3 border-t border-blue-200">
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-900">Est. Volume:</span>
                        <span className="font-bold text-blue-600 text-lg">{(totalVolume * 1.1).toFixed(2)} m³</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-slate-900 text-white rounded-2xl shadow-xl p-6">
                  <div className="text-slate-400 text-sm font-bold uppercase mb-1">Estimated Price</div>
                  <div className="text-4xl font-extrabold flex items-center gap-1">
                    <span className="text-2xl text-slate-500">£</span>
                    {quote.breakdown.total.toFixed(2)}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-700 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Base Fare</span>
                      <span>£{quote.breakdown.basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Distance ({distance} mi)</span>
                      <span>£{quote.breakdown.distancePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Vehicle Surcharge</span>
                      <span>£{quote.breakdown.vehicleSurcharge.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between">
                      <span className="text-slate-400">Extras & Crew</span>
                      <span>£{quote.breakdown.extrasPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">VAT (20%)</span>
                      <span>£{quote.breakdown.vat.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Platform Margin (Admin Only View) */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border-2 border-purple-300">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    Admin Insights
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Platform Margin (30%):</span>
                      <span className="font-bold text-purple-600 text-lg">£{platformMargin.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Driver Earnings (70%):</span>
                      <span className="font-bold text-blue-600 text-lg">£{driverEarnings.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-3">Job Summary</h3>
                  <div className="space-y-3 text-sm">
                     <div className="flex justify-between p-2 bg-slate-50 rounded">
                       <span className="text-slate-600">Vehicle</span>
                       <span className="font-bold capitalize">{quote.recommendedVehicle}</span>
                     </div>
                     <div className="flex justify-between p-2 bg-slate-50 rounded">
                       <span className="text-slate-600">Distance</span>
                       <span className="font-bold">{quote.distance} miles</span>
                     </div>
                     <div className="flex justify-between p-2 bg-slate-50 rounded">
                       <span className="text-slate-600">Est. Duration</span>
                       <span className="font-bold">{quote.estimatedDuration}</span>
                     </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 border border-slate-200 text-center">
                <Calculator className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500">Add items to calculate price</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
