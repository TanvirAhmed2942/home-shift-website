import React, { useState } from 'react';
import { MapPin, Calendar, Store, CheckCircle, DollarSign, ShoppingBag } from 'lucide-react';

interface StorePickupFormProps {
  onShowTerms: () => void;
}

export function StorePickupForm({ onShowTerms }: StorePickupFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    storeName: '',
    storeAddress: '',
    deliveryAddress: '',
    date: '',
    time: '',
    orderNumber: '',
    itemDescription: '',
    helpRequired: false,
    notes: '',
    agreeToTerms: false,
  });

  const [showQuote, setShowQuote] = useState(false);

  const popularStores = [
    { name: 'IKEA', icon: '🛋️' },
    { name: 'B&Q', icon: '🔨' },
    { name: 'Argos', icon: '🛒' },
    { name: 'Currys', icon: '📺' },
    { name: 'Homebase', icon: '🏡' },
    { name: 'John Lewis', icon: '🏬' },
  ];

  const basePrice = 55;
  const helpFee = formData.helpRequired ? 25 : 0;
  const estimatedPrice = basePrice + helpFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      alert('Please agree to the Terms & Conditions');
      return;
    }
    setShowQuote(true);
    setTimeout(() => {
      alert('Thank you! Your store pickup booking has been submitted.');
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
      <section id="booking" className="py-24 px-4 bg-gradient-to-br from-white via-emerald-50 to-teal-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="text-center">
              <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-4">Booking Confirmed!</h3>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mb-2">
                £{estimatedPrice.toFixed(2)}
              </div>
              <button onClick={() => setShowQuote(false)} className="mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-xl">
                Close
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-24 px-4 bg-gradient-to-br from-white via-emerald-50 to-teal-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm px-4 py-2 rounded-full mb-6">
            🏪 Store Pickup Service
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Store & Retail Pickup</h2>
          <p className="text-xl text-slate-600">IKEA, B&Q, Argos and more - we collect & deliver</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact */}
              <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-sm">1</div>
                  Your Details
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Full Name *" className="w-full px-4 py-3 rounded-xl border focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email *" className="w-full px-4 py-3 rounded-xl border focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none" />
                </div>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone *" className="mt-4 w-full px-4 py-3 rounded-xl border focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none" />
              </div>

              {/* Popular Stores */}
              <div>
                <h3 className="text-xl font-bold mb-4">Popular Stores</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                  {popularStores.map((store) => (
                    <button
                      key={store.name}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, storeName: store.name }))}
                      className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${formData.storeName === store.name ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}
                    >
                      <div className="text-2xl mb-1">{store.icon}</div>
                      <div className="text-xs font-semibold">{store.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Store Details */}
              <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-sm">2</div>
                  Store Information
                </h3>
                <div className="space-y-4">
                  <input type="text" name="storeName" value={formData.storeName} onChange={handleChange} required placeholder="Store Name (e.g., IKEA Edinburgh) *" className="w-full px-4 py-3 rounded-xl border focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none" />
                  <input type="text" name="storeAddress" value={formData.storeAddress} onChange={handleChange} required placeholder="Store Address *" className="w-full px-4 py-3 rounded-xl border focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none" />
                  <input type="text" name="orderNumber" value={formData.orderNumber} onChange={handleChange} placeholder="Order/Reference Number (optional)" className="w-full px-4 py-3 rounded-xl border focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none" />
                </div>
              </div>

              {/* Item Description */}
              <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-sm">3</div>
                  What are you collecting?
                </h3>
                <textarea name="itemDescription" value={formData.itemDescription} onChange={handleChange} required rows={3} placeholder="Describe items (e.g., 2x flat-pack wardrobes, 1x dining table) *" className="w-full px-4 py-3 rounded-xl border focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none resize-none" />
                <label className="flex items-center gap-3 mt-4 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-emerald-400">
                  <input type="checkbox" name="helpRequired" checked={formData.helpRequired} onChange={handleChange} className="w-5 h-5 rounded text-emerald-600" />
                  <div className="flex-1">
                    <div className="font-semibold">Need help loading?</div>
                    <div className="text-sm text-slate-600">We'll help load items from store</div>
                  </div>
                  <div className="font-bold text-emerald-600">+£25</div>
                </label>
              </div>

              {/* Delivery Address */}
              <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-sm">4</div>
                  Delivery Address
                </h3>
                <input type="text" name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} required placeholder="Your Delivery Address *" className="w-full px-4 py-3 rounded-xl border focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none" />
              </div>

              {/* Date & Time */}
              <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-sm">5</div>
                  Collection Date
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input type="date" name="date" value={formData.date} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 rounded-xl border focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none" />
                  <select name="time" value={formData.time} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none">
                    <option value="">Select time *</option>
                    <option value="morning">Morning (9-12)</option>
                    <option value="afternoon">Afternoon (12-5)</option>
                    <option value="evening">Evening (5-8)</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} placeholder="Additional notes..." className="w-full px-4 py-3 rounded-xl border focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none resize-none" />

              {/* Price Summary */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    <span className="font-semibold">Total Price</span>
                  </div>
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                    £{estimatedPrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 text-center">
                  ✓ Same-day pickup available<br />
                  ✓ Safe delivery to your door<br />
                  ✓ Fully insured service
                </p>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl">
                <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} className="mt-1 w-5 h-5 rounded text-emerald-600" />
                <label className="text-sm">
                  I agree to the <button type="button" onClick={onShowTerms} className="text-emerald-600 hover:underline font-medium">Terms & Conditions</button>
                </label>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl hover:scale-105 transition-all shadow-xl text-lg font-semibold">
                Book Pickup
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
