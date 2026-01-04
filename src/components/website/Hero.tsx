import React from 'react';
import { ArrowRight, CheckCircle, Star, Users, Zap, Shield, Award } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { TrustpilotInline } from './TrustpilotWidget';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1757233451731-9a34e164b208?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMGJ1aWxkaW5nc3xlbnwxfHx8fDE3NjU3ODkzNzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="City skyline"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-indigo-900/95" />
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-float"></div>
        <div className="absolute top-2/3 left-1/2 w-3 h-3 bg-cyan-400 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-blue-300 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-16 relative z-10 w-full flex-grow flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center mb-12">
          {/* Left side - Content */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-4 lg:mb-6 shadow-xl">
              <div className="flex -space-x-2">
                <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 border-2 border-white"></div>
                <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white"></div>
                <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 border-2 border-white"></div>
              </div>
              <span className="text-xs lg:text-sm font-medium">Trusted by 50,000+ happy customers</span>
              <Star className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-400 fill-yellow-400" />
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-6xl xl:text-7xl mb-4 lg:mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent font-extrabold">
                Move anything,
              </span>
              <span className="block bg-gradient-to-r from-cyan-100 via-blue-100 to-white bg-clip-text text-transparent font-extrabold">
                anywhere in the UK
              </span>
            </h1>
            
            <p className="text-base md:text-lg lg:text-xl mb-6 lg:mb-8 text-blue-100 leading-relaxed max-w-xl">
              Professional removals made simple. Get instant quotes, book trusted drivers, and relax while we handle your move.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 mb-6 lg:mb-8">
              <div className="flex items-center gap-2 lg:gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg lg:rounded-xl p-2 lg:p-3">
                <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-400 shrink-0" />
                <span className="text-xs lg:text-sm text-blue-100">Instant online quotes</span>
              </div>
              <div className="flex items-center gap-2 lg:gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg lg:rounded-xl p-2 lg:p-3">
                <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-400 shrink-0" />
                <span className="text-xs lg:text-sm text-blue-100">Licensed & insured drivers</span>
              </div>
              <div className="flex items-center gap-2 lg:gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg lg:rounded-xl p-2 lg:p-3">
                <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-400 shrink-0" />
                <span className="text-xs lg:text-sm text-blue-100">Real-time tracking</span>
              </div>
              <div className="flex items-center gap-2 lg:gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg lg:rounded-xl p-2 lg:p-3">
                <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-400 shrink-0" />
                <span className="text-xs lg:text-sm text-blue-100">24/7 support</span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              <button
                onClick={onGetStarted}
                className="group px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold text-base lg:text-lg rounded-full transition-all shadow-2xl hover:shadow-blue-500/50 hover:scale-105 flex items-center justify-center gap-2"
              >
                Get Free Quote
                <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => {
                  const element = document.getElementById('how-it-works');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 lg:px-8 py-3 lg:py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-semibold text-base lg:text-lg rounded-full transition-all"
              >
                How It Works
              </button>
            </div>
          </div>

          {/* Right side - Stats Cards */}
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl lg:rounded-2xl p-4 lg:p-6 hover:bg-white/15 transition-all group">
              <Users className="w-8 h-8 lg:w-10 lg:h-10 text-blue-400 mb-2 lg:mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-2xl lg:text-3xl font-bold text-white mb-1">50,000+</div>
              <div className="text-xs lg:text-sm text-blue-200">Happy Customers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl lg:rounded-2xl p-4 lg:p-6 hover:bg-white/15 transition-all group">
              <Zap className="w-8 h-8 lg:w-10 lg:h-10 text-yellow-400 mb-2 lg:mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-2xl lg:text-3xl font-bold text-white mb-1">30 mins</div>
              <div className="text-xs lg:text-sm text-blue-200">Average Response</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl lg:rounded-2xl p-4 lg:p-6 hover:bg-white/15 transition-all group">
              <Shield className="w-8 h-8 lg:w-10 lg:h-10 text-green-400 mb-2 lg:mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-2xl lg:text-3xl font-bold text-white mb-1">£5M</div>
              <div className="text-xs lg:text-sm text-blue-200">Insurance Cover</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl lg:rounded-2xl p-4 lg:p-6 hover:bg-white/15 transition-all group">
              <Award className="w-8 h-8 lg:w-10 lg:h-10 text-purple-400 mb-2 lg:mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-2xl lg:text-3xl font-bold text-white mb-1">4.9/5</div>
              <div className="text-xs lg:text-sm text-blue-200">Customer Rating</div>
            </div>
          </div>
        </div>

        {/* Trustpilot Trust Badge */}
        <div className="flex justify-center mt-8 lg:mt-12">
          <TrustpilotInline />
        </div>
      </div>
    </section>
  );
}
