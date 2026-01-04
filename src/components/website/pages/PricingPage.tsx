import React from 'react';
import { ArrowLeft, DollarSign, Check, Phone } from 'lucide-react';

interface PricingPageProps {
  selectedService: string | null;
  onGoBack: () => void;
}

export default function PricingPage({ selectedService, onGoBack }: PricingPageProps) {
  const servicePricing = {
    'house-move': {
      title: '🏠 House Move Pricing',
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-white via-blue-50 to-cyan-50',
      packages: [
        {
          name: 'Studio',
          basePrice: 250,
          features: ['Up to 0 bedrooms', '2 professional movers', 'Basic packing materials', 'Fully insured', 'Standard van']
        },
        {
          name: '1 Bedroom',
          basePrice: 350,
          features: ['1 bedroom apartment', '2 professional movers', 'Basic packing materials', 'Fully insured', 'Large van']
        },
        {
          name: '2 Bedroom',
          basePrice: 500,
          features: ['2 bedroom house/flat', '3 professional movers', 'Packing materials included', 'Fully insured', 'Luton van', 'Popular choice'],
          popular: true
        },
        {
          name: '3 Bedroom',
          basePrice: 700,
          features: ['3 bedroom house', '3-4 professional movers', 'Full packing materials', 'Fully insured', 'Large Luton van']
        },
        {
          name: '4+ Bedroom',
          basePrice: 950,
          features: ['4+ bedroom house', '4 professional movers', 'Premium packing service', 'Fully insured', '7.5T truck']
        }
      ],
      addons: [
        { name: 'Professional Packing Service', price: 150 },
        { name: 'Temporary Storage (1 month)', price: 200 },
        { name: 'Furniture Disassembly/Assembly', price: 100 },
        { name: 'Piano Moving', price: 120 }
      ]
    },
    'furniture': {
      title: '🛋️ Furniture Delivery Pricing',
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-white via-purple-50 to-pink-50',
      packages: [
        {
          name: 'Small Items',
          basePrice: 50,
          features: ['Base delivery fee', 'Coffee table, chairs', 'TV stand, bookshelf', '2 professional movers', 'Fully insured']
        },
        {
          name: 'Medium Furniture',
          basePrice: 85,
          features: ['2-3 seater sofa', 'Double bed frame', 'Single wardrobe', 'Assembly available (+£80)', 'Safe handling'],
          popular: true
        },
        {
          name: 'Large Furniture',
          basePrice: 150,
          features: ['King size bed', 'Double wardrobe', 'Large dining table', 'Professional assembly', 'Premium protection']
        }
      ],
      addons: [
        { name: 'Professional Assembly', price: 80 },
        { name: 'Additional Helper', price: 40 },
        { name: 'Stair Carry (per floor)', price: 25 }
      ]
    },
    'man-van': {
      title: '👥 Man & Van Hourly Rates',
      gradient: 'from-cyan-500 to-blue-600',
      bgGradient: 'from-white via-cyan-50 to-blue-50',
      packages: [
        {
          name: 'Small Van',
          basePrice: 35,
          features: ['£35 per hour', 'Driver + 1 helper', 'Up to 1 bedroom', 'Perfect for small moves', '2 hour minimum']
        },
        {
          name: 'Medium Van (Luton)',
          basePrice: 45,
          features: ['£45 per hour', 'Driver + 1 helper', '1-2 bedrooms', 'Most popular choice', '2 hour minimum'],
          popular: true
        },
        {
          name: 'Large Van (7.5T)',
          basePrice: 60,
          features: ['£60 per hour', 'Driver + 1 helper', '2-3 bedrooms', 'Large capacity', '2 hour minimum']
        }
      ],
      addons: [
        { name: 'Extra Helper', price: 25, note: 'per hour' },
        { name: 'Weekend Service', price: 15, note: 'per hour surcharge' },
        { name: 'Evening Service (after 6pm)', price: 20, note: 'per hour surcharge' }
      ]
    },
    'motorbike': {
      title: '🏍️ Vehicle Transport Pricing',
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-white via-orange-50 to-red-50',
      packages: [
        {
          name: 'Bicycle',
          basePrice: 40,
          features: ['Standard bicycles', 'E-bikes included', 'Secure strapping', 'Same day available', 'Fully insured']
        },
        {
          name: 'Scooter (50-125cc)',
          basePrice: 80,
          features: ['Small motorcycles', 'Mopeds & scooters', 'Professional loading', 'Tie-down included', 'Full insurance']
        },
        {
          name: 'Motorcycle (125-600cc)',
          basePrice: 120,
          features: ['Standard motorcycles', 'Sport bikes included', 'Specialist transport', 'Premium protection', 'Track record'],
          popular: true
        },
        {
          name: 'Large Bike (600cc+)',
          basePrice: 150,
          features: ['Heavy motorcycles', 'Cruisers & tourers', 'Expert handling', 'Maximum protection', 'Premium service']
        }
      ],
      addons: [
        { name: 'Non-Running Vehicle', price: 30 },
        { name: 'Same Day Service', price: 50 },
        { name: 'Multiple Bikes Discount', price: -20, note: 'per additional bike' }
      ]
    },
    'store-pickup': {
      title: '🏪 Store Pickup Pricing',
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-white via-emerald-50 to-teal-50',
      packages: [
        {
          name: 'Standard Pickup',
          basePrice: 55,
          features: ['IKEA, B&Q, Argos', 'Up to 5 items', 'Basic loading help', 'Same day available', 'Fully insured'],
          popular: true
        },
        {
          name: 'Large Pickup',
          basePrice: 85,
          features: ['Multiple large items', 'Flat-pack furniture', 'Full loading service', 'Professional handling', 'Assembly available']
        }
      ],
      addons: [
        { name: 'Loading Help Service', price: 25 },
        { name: 'Assembly at Home', price: 60 },
        { name: 'Urgent Same-Day', price: 30 }
      ]
    },
    'other': {
      title: '📦 Custom Delivery Pricing',
      gradient: 'from-amber-500 to-yellow-600',
      bgGradient: 'from-white via-amber-50 to-yellow-50',
      packages: [
        {
          name: 'Small Items',
          basePrice: 40,
          features: ['Boxes & parcels', 'Sports equipment', 'Small appliances', 'Quick delivery', 'Standard protection']
        },
        {
          name: 'Medium Items',
          basePrice: 60,
          features: ['Garden furniture', 'Office equipment', 'Medium appliances', 'Professional handling', 'Fully insured'],
          popular: true
        },
        {
          name: 'Fragile/Artwork',
          basePrice: 100,
          features: ['Artwork & mirrors', 'Antiques', 'Fragile items', 'Premium protection', 'Specialist care']
        }
      ],
      addons: [
        { name: 'Fragile Item Handling', price: 20 },
        { name: 'Packaging Service', price: 35 },
        { name: 'Express Delivery', price: 45 }
      ]
    }
  };

  const pricing = servicePricing[selectedService as keyof typeof servicePricing];

  if (!pricing) {
    return null;
  }

  return (
    <section className={`py-24 px-4 bg-gradient-to-br ${pricing.bgGradient} relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-300/20 to-blue-300/20 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Button */}
        <button
          onClick={onGoBack}
          className={`inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-xl border-2 border-slate-200 hover:scale-105 transition-all shadow-lg mb-8 font-semibold text-slate-700`}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Booking Form
        </button>

        {/* Header */}
        <div className="text-center mb-16">
          <div className={`inline-block bg-gradient-to-r ${pricing.gradient} text-white text-sm px-4 py-2 rounded-full mb-6`}>
            Transparent Pricing
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">{pricing.title}</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            No hidden fees. What you see is what you pay. All prices include VAT and insurance.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {pricing.packages.map((pkg, index) => (
            <div
              key={index}
              className={`bg-white rounded-3xl shadow-2xl p-8 border-2 transition-all hover:scale-105 ${
                pkg.popular ? `border-transparent bg-gradient-to-br ${pricing.gradient} text-white` : 'border-slate-200'
              }`}
            >
              {pkg.popular && (
                <div className="bg-white/20 text-white text-xs px-3 py-1 rounded-full inline-block mb-4 font-semibold">
                  ⭐ Most Popular
                </div>
              )}
              <h3 className={`text-2xl font-bold mb-2 ${pkg.popular ? 'text-white' : 'text-slate-900'}`}>
                {pkg.name}
              </h3>
              <div className="mb-6">
                <span className={`text-5xl font-bold ${pkg.popular ? 'text-white' : `text-transparent bg-clip-text bg-gradient-to-r ${pricing.gradient}`}`}>
                  £{pkg.basePrice}
                </span>
                {selectedService === 'man-van' && (
                  <span className={`text-lg ${pkg.popular ? 'text-white/80' : 'text-slate-600'}`}>/hour</span>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${pkg.popular ? 'text-white' : 'text-green-600'}`} />
                    <span className={`text-sm ${pkg.popular ? 'text-white/90' : 'text-slate-600'}`}>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={onGoBack}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  pkg.popular
                    ? 'bg-white text-slate-900 hover:bg-slate-100'
                    : `bg-gradient-to-r ${pricing.gradient} text-white hover:opacity-90`
                }`}
              >
                Select This Package
              </button>
            </div>
          ))}
        </div>

        {/* Add-ons */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-200">
          <div className="flex items-center gap-3 mb-8">
            <DollarSign className="w-8 h-8 text-slate-700" />
            <h3 className="text-3xl font-bold text-slate-900">Additional Services</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricing.addons.map((addon, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                <div>
                  <div className="font-semibold text-slate-900">{addon.name}</div>
                  {addon.note && <div className="text-xs text-slate-500">{addon.note}</div>}
                </div>
                <div className={`text-xl font-bold ${addon.price < 0 ? 'text-green-600' : `text-transparent bg-clip-text bg-gradient-to-r ${pricing.gradient}`}`}>
                  {addon.price > 0 ? '+' : ''}£{Math.abs(addon.price)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className={`mt-16 bg-gradient-to-r ${pricing.gradient} rounded-3xl p-12 text-center text-white`}>
          <h3 className="text-3xl font-bold mb-4">Ready to Book?</h3>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Fill out the booking form and get your personalized quote in minutes!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGoBack}
              className="bg-white text-slate-900 px-8 py-4 rounded-xl hover:scale-105 transition-all shadow-xl text-lg font-semibold"
            >
              Continue to Booking Form
            </button>
            <a
              href="tel:02012345678"
              className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white/20 transition-all text-lg font-semibold flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call: 020 1234 5678
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
