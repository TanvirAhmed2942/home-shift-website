import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Bike, CheckCircle, DollarSign, Shield } from 'lucide-react';

interface MotorbikeFormProps {
  onShowTerms: () => void;
}

export function MotorbikeForm({ onShowTerms }: MotorbikeFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pickupAddress: '',
    dropoffAddress: '',
    date: '',
    vehicleType: '',
    make: '',
    model: '',
    runningCondition: 'yes',
    notes: '',
    agreeToTerms: false,
  });

  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [showQuote, setShowQuote] = useState(false);

  const vehicleTypes = [
    { value: 'bicycle', label: '🚲 Bicycle', basePrice: 40 },
    { value: 'ebike', label: '⚡ E-Bike', basePrice: 50 },
    { value: 'scooter', label: '🛴 Scooter (50-125cc)', basePrice: 80 },
    { value: 'motorcycle', label: '🏍️ Motorcycle (125-600cc)', basePrice: 120 },
    { value: 'large_bike', label: '🏍️ Large Motorcycle (600cc+)', basePrice: 150 },
  ];

  useEffect(() => {
    const vehicle = vehicleTypes.find(v => v.value === formData.vehicleType);
    const basePrice = vehicle?.basePrice || 0;
    const nonRunningFee = formData.runningCondition === 'no' ? 30 : 0;
    setEstimatedPrice(basePrice + nonRunningFee);
  }, [formData.vehicleType, formData.runningCondition]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      alert('Please agree to the Terms & Conditions');
      return;
    }
    setShowQuote(true);
    setTimeout(() => {
      alert('Thank you! Your vehicle transport booking has been submitted.');
      setShowQuote(false);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (showQuote) {
    return (
      <section id="booking" className="py-24 px-4 bg-gradient-to-br from-white via-orange-50 to-red-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="text-center">
              <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-4">Quote Submitted!</h3>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-2">
                £{estimatedPrice.toFixed(2)}
              </div>
              <button onClick={() => setShowQuote(false)} className="mt-6 bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-xl">
                Close
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-24 px-4 bg-gradient-to-br from-white via-orange-50 to-red-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm px-4 py-2 rounded-full mb-6">
            🏍️ Vehicle Transport
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Motorbike & Bicycle Transport</h2>
          <p className="text-xl text-slate-600">Safe and secure vehicle transportation</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact */}
              <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-white flex items-center justify-center text-sm">1</div>
                  Contact Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Full Name *" className="w-full px-4 py-3 rounded-xl border focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email *" className="w-full px-4 py-3 rounded-xl border focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none" />
                </div>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone *" className="mt-4 w-full px-4 py-3 rounded-xl border focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none" />
              </div>

              {/* Vehicle Type */}
              <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-white flex items-center justify-center text-sm">2</div>
                  Vehicle Type
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {vehicleTypes.map((type) => (
                    <label key={type.value} className={`cursor-pointer rounded-2xl border-2 p-6 transition-all hover:scale-105 ${formData.vehicleType === type.value ? 'border-orange-500 bg-orange-50' : 'border-slate-200'}`}>
                      <input type="radio" name="vehicleType" value={type.value} checked={formData.vehicleType === type.value} onChange={handleChange} className="sr-only" required />
                      <div className="text-center">
                        <div className="text-3xl mb-2">{type.label.split(' ')[0]}</div>
                        <div className="font-bold mb-1">{type.label.substring(2)}</div>
                        <div className="text-orange-600 font-bold">£{type.basePrice}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Vehicle Details */}
              <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-white flex items-center justify-center text-sm">3</div>
                  Vehicle Details
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <input type="text" name="make" value={formData.make} onChange={handleChange} placeholder="Make (e.g., Honda, Yamaha)" className="w-full px-4 py-3 rounded-xl border focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none" />
                  <input type="text" name="model" value={formData.model} onChange={handleChange} placeholder="Model (e.g., CBR600, MT-07)" className="w-full px-4 py-3 rounded-xl border focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Running Condition</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer ${formData.runningCondition === 'yes' ? 'border-orange-500 bg-orange-50' : 'border-slate-200'}`}>
                      <input type="radio" name="runningCondition" value="yes" checked={formData.runningCondition === 'yes'} onChange={handleChange} className="sr-only" />
                      <span className="font-semibold">✓ Runs & Rides</span>
                    </label>
                    <label className={`flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer ${formData.runningCondition === 'no' ? 'border-orange-500 bg-orange-50' : 'border-slate-200'}`}>
                      <input type="radio" name="runningCondition" value="no" checked={formData.runningCondition === 'no'} onChange={handleChange} className="sr-only" />
                      <span className="font-semibold">✗ Not Running (+£30)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-white flex items-center justify-center text-sm">4</div>
                  Collection & Delivery
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-orange-600 mt-3" />
                    <input type="text" name="pickupAddress" value={formData.pickupAddress} onChange={handleChange} required placeholder="Collection Address *" className="flex-1 px-4 py-3 rounded-xl border focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none" />
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-orange-600 mt-3" />
                    <input type="text" name="dropoffAddress" value={formData.dropoffAddress} onChange={handleChange} required placeholder="Delivery Address *" className="flex-1 px-4 py-3 rounded-xl border focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none" />
                  </div>
                </div>
              </div>

              {/* Date */}
              <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-white flex items-center justify-center text-sm">5</div>
                  Collection Date
                </h3>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 rounded-xl border focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none" />
              </div>

              {/* Notes */}
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} placeholder="Any modifications, custom parts, or special requirements?" className="w-full px-4 py-3 rounded-xl border focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none resize-none" />

              {/* Price Summary */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-orange-600" />
                    <span className="font-semibold">Estimated Price</span>
                  </div>
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                    £{estimatedPrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 text-center">
                  ✓ Fully insured transport<br />
                  ✓ Professional loading/unloading<br />
                  ✓ Secure tie-down straps
                </p>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl">
                <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} className="mt-1 w-5 h-5 rounded text-orange-600" />
                <label className="text-sm">
                  I agree to the <button type="button" onClick={onShowTerms} className="text-orange-600 hover:underline font-medium">Terms & Conditions</button>
                </label>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl hover:scale-105 transition-all shadow-xl text-lg font-semibold">
                Get Quote
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
