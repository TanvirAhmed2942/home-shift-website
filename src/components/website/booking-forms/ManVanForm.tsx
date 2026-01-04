import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Truck, Users, CheckCircle, DollarSign, Clock } from 'lucide-react';

interface ManVanFormProps {
  onShowTerms: () => void;
}

export function ManVanForm({ onShowTerms }: ManVanFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pickupAddress: '',
    dropoffAddress: '',
    date: '',
    time: '',
    vanSize: '',
    helpers: '1',
    estimatedHours: '',
    notes: '',
    agreeToTerms: false,
  });

  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [showQuote, setShowQuote] = useState(false);

  const vanSizes = [
    { value: 'small', label: 'Small Van', description: 'Up to 1 bedroom', hourlyRate: 35, image: '🚐' },
    { value: 'medium', label: 'Medium Van (Luton)', description: '1-2 bedrooms', hourlyRate: 45, image: '🚚' },
    { value: 'large', label: 'Large Van (7.5T)', description: '2-3 bedrooms', hourlyRate: 60, image: '🚛' },
  ];

  const helperOptions = [
    { value: '1', label: '1 Helper (Driver + 1)', cost: 0 },
    { value: '2', label: '2 Helpers (Driver + 2)', cost: 25 },
  ];

  const hourOptions = [
    { value: '2', label: '2 hours (minimum)' },
    { value: '3', label: '3 hours' },
    { value: '4', label: '4 hours' },
    { value: '5', label: '5 hours' },
    { value: '6', label: '6+ hours' },
  ];

  useEffect(() => {
    calculateEstimate();
  }, [formData.vanSize, formData.helpers, formData.estimatedHours]);

  const calculateEstimate = () => {
    const van = vanSizes.find(v => v.value === formData.vanSize);
    const helper = helperOptions.find(h => h.value === formData.helpers);
    const hours = parseInt(formData.estimatedHours) || 2;

    if (!van) {
      setEstimatedPrice(0);
      return;
    }

    const hourlyTotal = van.hourlyRate * hours;
    const helperCost = (helper?.cost || 0) * hours;
    const total = hourlyTotal + helperCost;

    setEstimatedPrice(total);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      alert('Please agree to the Terms & Conditions');
      return;
    }
    setShowQuote(true);
    setTimeout(() => {
      alert('Thank you! Your Man & Van booking has been submitted.');
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
      <section id="booking" className="py-24 px-4 bg-gradient-to-br from-white via-cyan-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="text-center">
              <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-4">Booking Submitted!</h3>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 mb-2">
                £{estimatedPrice.toFixed(2)}
              </div>
              <p className="text-slate-600 mb-6">Estimated total for {formData.estimatedHours || 2} hours</p>
              <button onClick={() => setShowQuote(false)} className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-3 rounded-xl">
                Close
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-24 px-4 bg-gradient-to-br from-white via-cyan-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm px-4 py-2 rounded-full mb-6">
            👥 Man & Van Service
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Flexible Man & Van Hire</h2>
          <p className="text-xl text-slate-600">Professional driver + helper for your small moves</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact */}
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center text-sm">1</div>
                    Your Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Full Name *" className="w-full px-4 py-3 rounded-xl border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email *" className="w-full px-4 py-3 rounded-xl border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none" />
                  </div>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone *" className="mt-4 w-full px-4 py-3 rounded-xl border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none" />
                </div>

                {/* Van Size */}
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center text-sm">2</div>
                    Select Van Size
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {vanSizes.map((van) => (
                      <label key={van.value} className={`cursor-pointer rounded-2xl border-2 p-6 transition-all hover:scale-105 ${formData.vanSize === van.value ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200'}`}>
                        <input type="radio" name="vanSize" value={van.value} checked={formData.vanSize === van.value} onChange={handleChange} className="sr-only" required />
                        <div className="text-center">
                          <div className="text-4xl mb-3">{van.image}</div>
                          <div className="font-bold text-lg mb-1">{van.label}</div>
                          <div className="text-sm text-slate-600 mb-3">{van.description}</div>
                          <div className="text-cyan-600 font-bold">£{van.hourlyRate}/hour</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Helpers & Hours */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-cyan-600" />
                      Number of Helpers
                    </h3>
                    <div className="space-y-3">
                      {helperOptions.map((option) => (
                        <label key={option.value} className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.helpers === option.value ? 'border-cyan-500 bg-cyan-50' : 'border-slate-200 hover:border-cyan-300'}`}>
                          <input type="radio" name="helpers" value={option.value} checked={formData.helpers === option.value} onChange={handleChange} className="sr-only" />
                          <span className="font-semibold">{option.label}</span>
                          <span className="text-cyan-600 font-bold">{option.cost > 0 ? `+£${option.cost}/hr` : 'Included'}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-cyan-600" />
                      Estimated Duration
                    </h3>
                    <select name="estimatedHours" value={formData.estimatedHours} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none">
                      <option value="">Select hours *</option>
                      {hourOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <p className="text-sm text-slate-500 mt-2">💡 Minimum booking: 2 hours</p>
                  </div>
                </div>

                {/* Addresses */}
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center text-sm">3</div>
                    Pickup & Drop-off
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-cyan-600 mt-3" />
                      <input type="text" name="pickupAddress" value={formData.pickupAddress} onChange={handleChange} required placeholder="Pickup Address *" className="flex-1 px-4 py-3 rounded-xl border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none" />
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-cyan-600 mt-3" />
                      <input type="text" name="dropoffAddress" value={formData.dropoffAddress} onChange={handleChange} required placeholder="Drop-off Address *" className="flex-1 px-4 py-3 rounded-xl border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none" />
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center text-sm">4</div>
                    When do you need us?
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="date" name="date" value={formData.date} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 rounded-xl border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none" />
                    <select name="time" value={formData.time} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none">
                      <option value="">Select time *</option>
                      <option value="8am">8:00 AM</option>
                      <option value="10am">10:00 AM</option>
                      <option value="12pm">12:00 PM</option>
                      <option value="2pm">2:00 PM</option>
                      <option value="4pm">4:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} placeholder="What are you moving? Any special requirements?" className="w-full px-4 py-3 rounded-xl border focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none resize-none" />

                {/* Terms */}
                <div className="flex items-start gap-3 p-4 bg-cyan-50 rounded-xl">
                  <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} className="mt-1 w-5 h-5 rounded text-cyan-600" />
                  <label className="text-sm">
                    I agree to the <button type="button" onClick={onShowTerms} className="text-cyan-600 hover:underline font-medium">Terms & Conditions</button>
                  </label>
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 rounded-xl hover:scale-105 transition-all shadow-xl text-lg font-semibold">
                  Request Your Quote
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-3xl shadow-2xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-6 h-6 text-cyan-600" />
                <h3 className="text-xl font-bold">Estimate</h3>
              </div>
              <div className="space-y-4">
                {formData.vanSize && (
                  <div className="flex justify-between pb-3 border-b">
                    <span className="text-slate-600">Van Hire</span>
                    <span className="font-semibold">
                      £{(vanSizes.find(v => v.value === formData.vanSize)?.hourlyRate || 0) * (parseInt(formData.estimatedHours) || 2)}
                    </span>
                  </div>
                )}
                {formData.helpers === '2' && formData.estimatedHours && (
                  <div className="flex justify-between pb-3 border-b">
                    <span className="text-slate-600">Extra Helper</span>
                    <span className="font-semibold">£{25 * parseInt(formData.estimatedHours)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
                    £{estimatedPrice.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl">
                <p className="text-xs text-center text-slate-600">
                  ✓ Pay by the hour<br />
                  ✓ 2 hour minimum<br />
                  ✓ Professional service<br />
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
