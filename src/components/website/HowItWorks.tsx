import React from 'react';
import { MessageSquare, Zap, Users, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: MessageSquare,
    title: "Tell us what you're moving",
    description: 'Share the details through our simple booking form',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    icon: Zap,
    title: 'Get an instant price',
    description: 'Receive a transparent quote immediately',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    icon: Users,
    title: 'We match you with a driver',
    description: 'Our system finds the perfect trusted driver',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    icon: CheckCircle,
    title: 'Job completed',
    description: 'Items delivered safely and you rate the service',
    gradient: 'from-emerald-500 to-teal-600',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm px-4 py-2 rounded-full mb-6">
            Simple Process
          </div>
          <h2 className="text-white mb-4 text-4xl md:text-5xl">How it works</h2>
          <p className="text-blue-100 text-xl max-w-2xl mx-auto">
            Getting your items moved is simple with ShiftMyHome
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative group">
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-[60%] w-[80%] h-0.5">
                    <div className="w-full h-full bg-gradient-to-r from-white/40 to-white/10" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white/40 rounded-full" />
                  </div>
                )}
                
                <div className="relative z-10 text-center">
                  {/* Step number badge */}
                  <div className="absolute -top-4 -right-4 bg-gradient-to-br from-white to-blue-100 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-20">
                    <span className="bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent text-xl">
                      {index + 1}
                    </span>
                  </div>

                  {/* Card */}
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                    <div className={`bg-gradient-to-br ${step.gradient} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-white text-xl mb-3">{step.title}</h3>
                    <p className="text-blue-100 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
