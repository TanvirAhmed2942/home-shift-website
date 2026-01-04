import React from 'react';
import { Shield, Award, Clock, ThumbsUp, Star, CheckCircle } from 'lucide-react';

export function TrustBadges() {
  const badges = [
    {
      icon: Shield,
      title: 'Fully Insured',
      subtitle: 'Up to £50,000',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Award,
      title: 'Award Winning',
      subtitle: '2024 Best Service',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      subtitle: 'Always Available',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Star,
      title: '5-Star Rated',
      subtitle: '4.9/5 on Trustpilot',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: ThumbsUp,
      title: 'Money Back',
      subtitle: '100% Guarantee',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: CheckCircle,
      title: 'Verified Pro',
      subtitle: 'Licensed & Certified',
      color: 'from-cyan-500 to-blue-500'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 px-6 py-2 rounded-full mb-4">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-blue-900 text-sm tracking-wide uppercase">Trusted by Thousands</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Trusted</span> Moving Partner
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Industry-leading credentials and guarantees for complete peace of mind
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div
                key={index}
                className="group relative backdrop-blur-sm bg-white/80 border border-slate-200 rounded-2xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                {/* Gradient glow on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${badge.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{badge.title}</h3>
                  <p className="text-sm text-slate-600">{badge.subtitle}</p>
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:translate-x-full transition-all duration-1000"></div>
              </div>
            );
          })}
        </div>

        {/* Statistics bar */}
        <div className="mt-16 backdrop-blur-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">10,000+</div>
              <div className="text-blue-200">Successful Moves</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">99.8%</div>
              <div className="text-blue-200">Customer Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">50+</div>
              <div className="text-blue-200">Cities Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-200">Customer Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
