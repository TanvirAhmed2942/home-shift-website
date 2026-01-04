import React from 'react';
import { Clock, Shield, DollarSign, Headphones } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const features = [
  {
    icon: Clock,
    title: 'Same-day availability',
    description: 'Need a move today? We have drivers ready and available for urgent bookings.',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    icon: Shield,
    title: 'Insured drivers',
    description: 'All our drivers are fully insured and vetted for your peace of mind.',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    icon: DollarSign,
    title: 'Transparent pricing',
    description: 'No hidden fees or surprise charges. What you see is what you pay.',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    icon: Headphones,
    title: 'Customer & driver support',
    description: 'Our dedicated support team is here to help every step of the way.',
    gradient: 'from-purple-500 to-pink-600',
  },
];

export default function WhyShiftMyHome() {
  return (
    <section className="py-20 px-4 bg-white relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 opacity-5">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1657049199023-87fb439d47c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXJuaXR1cmUlMjBtb3Zpbmd8ZW58MXx8fHwxNzY1ODE4NjgyfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Moving service"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-slate-900 mb-4">Why ShiftMyHome?</h2>
          <p className="text-slate-600 text-lg">
            We're committed to making your move as smooth as possible
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group overflow-hidden border border-slate-100"
              >
                {/* Background gradient effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-all duration-300 rounded-3xl`} />
                
                <div className="relative z-10">
                  <div className={`bg-gradient-to-br ${feature.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-md transition-all duration-300 group-hover:scale-110`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
