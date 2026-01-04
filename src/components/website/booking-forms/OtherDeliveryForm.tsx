import React, { useState } from 'react';
import { MapPin, Calendar, Package, CheckCircle, DollarSign, Upload } from 'lucide-react';

interface OtherDeliveryFormProps {
  onShowTerms: () => void;
}

export function OtherDeliveryForm({ onShowTerms }: OtherDeliveryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pickupAddress: '',
    dropoffAddress: '',
    date: '',
    time: '',
    itemCategory: '',
    itemDescription: '',
    weight: '',
    dimensions: '',
    fragile: false,
    notes: '',
    agreeToTerms: false,
  });

  const [showQuote, setShowQuote] = useState(false);

  const itemCategories = [
    { value: 'furniture', label: '🛋️ Furniture', basePrice: 60 },
    { value: 'appliances', label: '🔌 Appliances', basePrice: 70 },
    { value: 'boxes', label: '📦 Boxes/Parcels', basePrice: 40 },
    { value: 'artwork', label: '🖼️ Artwork/Mirrors', basePrice: 80 },
    { value: 'sports', label: '⚽ Sports Equipment', basePrice: 50 },
    { value: 'garden', label: '🌱 Garden Items', basePrice: 55 },
    { value: 'office', label: '💼 Office Equipment', basePrice: 65 },
    { value: 'other', label: '📦 Other Items', basePrice: 50 },
  ];

  const calculatePrice = () => {
    const category = itemCategories.find(c => c.value === formData.itemCategory);
    const basePrice = category?.basePrice || 50;
    const fragileFee = formData.fragile ? 20 : 0;
    return basePrice + fragileFee;
  };

  const estimatedPrice = calculatePrice();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      alert('Please agree to the Terms & Conditions');
      return;
    }
    setShowQuote(true);
    setTimeout(() => {
      alert('Thank you! Your delivery booking has been submitted.');
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
      <section id="booking" className="py-24 px-4 bg-gradient-to-br from-white via-amber-50 to-yellow-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="text-center">
              <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-4">Quote Submitted!</h3>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-600 mb-2">
                £{estimatedPrice.toFixed(2)}
              </div>
              <p className="text-slate-600 mb-6">Our team will review your request and contact you shortly</p>
              <button onClick={() => setShowQuote(false)} className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white px-8 py-3 rounded-xl">
                Close
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-24 px-4 bg-gradient-to-br from-white via-amber-50 to-yellow-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-sm px-4 py-2 rounded-full mb-6">
            📦 Custom Delivery
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Other Delivery Services</h2>
          <p className="text-xl text-slate-600">Custom solutions for any item you need moved</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact */}
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 text-white flex items-center justify-center text-sm">1</div>
                    Contact Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Full Name *" className="w-full px-4 py-3 rounded-xl border focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email *" className="w-full px-4 py-3 rounded-xl border focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none" />
                  </div>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone *" className="mt-4 w-full px-4 py-3 rounded-xl border focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none" />
                </div>

                {/* Item Category */}
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 text-white flex items-center justify-center text-sm">2</div>
                    What are you moving?
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {itemCategories.map((category) => (
                      <label key={category.value} className={`cursor-pointer rounded-2xl border-2 p-4 transition-all hover:scale-105 ${formData.itemCategory === category.value ? 'border-amber-500 bg-amber-50' : 'border-slate-200'}`}>
                        <input type="radio" name="itemCategory" value={category.value} checked={formData.itemCategory === category.value} onChange={handleChange} className="sr-only" required />
                        <div className="text-center">
                          <div className="text-2xl mb-2">{category.label.split(' ')[0]}</div>
                          <div className="text-xs font-semibold">{category.label.substring(2)}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Item Details */}
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 text-white flex items-center justify-center text-sm">3</div>
                    Item Details
                  </h3>
                  <div className="space-y-4">
                    <textarea name="itemDescription" value={formData.itemDescription} onChange={handleChange} required rows={3} placeholder="Describe the item(s) you need moved *" className="w-full px-4 py-3 rounded-xl border focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none resize-none" />
                    <div className="grid md:grid-cols-2 gap-4">
                      <input type="text" name="weight" value={formData.weight} onChange={handleChange} placeholder="Approximate weight (e.g., 25kg)" className="w-full px-4 py-3 rounded-xl border focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none" />
                      <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} placeholder="Dimensions (e.g., 120x80x60cm)" className="w-full px-4 py-3 rounded-xl border focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none" />
                    </div>
                    <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-amber-400">
                      <input type="checkbox" name="fragile" checked={formData.fragile} onChange={handleChange} className="w-5 h-5 rounded text-amber-600" />
                      <div className="flex-1">
                        <div className="font-semibold">Fragile / High Value Item</div>
                        <div className="text-sm text-slate-600">Requires extra care and protection</div>
                      </div>
                      <div className="font-bold text-amber-600">+£20</div>
                    </label>
                  </div>
                </div>

                {/* Addresses */}
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 text-white flex items-center justify-center text-sm">4</div>
                    Collection & Delivery
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-amber-600 mt-3" />
                      <input type="text" name="pickupAddress" value={formData.pickupAddress} onChange={handleChange} required placeholder="Collection Address *" className="flex-1 px-4 py-3 rounded-xl border focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none" />
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-amber-600 mt-3" />
                      <input type="text" name="dropoffAddress" value={formData.dropoffAddress} onChange={handleChange} required placeholder="Delivery Address *" className="flex-1 px-4 py-3 rounded-xl border focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none" />
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 text-white flex items-center justify-center text-sm">5</div>
                    Preferred Date & Time
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="date" name="date" value={formData.date} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 rounded-xl border focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none" />
                    <select name="time" value={formData.time} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none">
                      <option value="">Select time *</option>
                      <option value="morning">Morning</option>
                      <option value="afternoon">Afternoon</option>
                      <option value="evening">Evening</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Special Requirements</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} placeholder="Any additional information (access issues, special handling, etc.)" className="w-full px-4 py-3 rounded-xl border focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none resize-none" />
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl">
                  <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} className="mt-1 w-5 h-5 rounded text-amber-600" />
                  <label className="text-sm">
                    I agree to the <button type="button" onClick={onShowTerms} className="text-amber-600 hover:underline font-medium">Terms & Conditions</button>
                  </label>
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white py-4 rounded-xl hover:scale-105 transition-all shadow-xl text-lg font-semibold">
                  Request Quote
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-3xl shadow-2xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl font-bold">Price Estimate</h3>
              </div>
              <div className="space-y-4">
                {formData.itemCategory && (
                  <div className="flex justify-between pb-3 border-b">
                    <span className="text-slate-600">Base Price</span>
                    <span className="font-semibold">£{itemCategories.find(c => c.value === formData.itemCategory)?.basePrice || 0}</span>
                  </div>
                )}
                {formData.fragile && (
                  <div className="flex justify-between pb-3 border-b">
                    <span className="text-slate-600">Fragile Care</span>
                    <span className="font-semibold">£20</span>
                  </div>
                )}
                <div className="flex justify-between pt-3">
                  <span className="text-lg font-bold">Estimated</span>
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-600">
                    £{estimatedPrice.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl">
                <p className="text-xs text-center text-slate-600">
                  ✓ Custom quote provided<br />
                  ✓ Flexible scheduling<br />
                  ✓ Professional handling<br />
                  ✓ Fully insured
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
