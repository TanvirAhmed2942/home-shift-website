import React from 'react';
import { Award, TrendingUp, Users, Heart, Target, Truck, Shield, Zap, Calendar, CheckCircle, Star } from 'lucide-react';

export default function AboutUs() {
  const stats = [
    {
      icon: Calendar,
      value: '10+',
      label: 'Years of Excellence',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Truck,
      value: '50+',
      label: 'Modern Fleet',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Users,
      value: '200+',
      label: 'Dedicated Professionals',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Award,
      value: '15k+',
      label: 'Successful Moves',
      color: 'from-cyan-500 to-blue-500'
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'We put our customers at the heart of everything we do',
      gradient: 'from-rose-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'Your belongings are safe with us, always insured and protected',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for excellence in every delivery and move',
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Users,
      title: 'Teamwork',
      description: 'Our professional team works together to serve you better',
      gradient: 'from-amber-500 to-orange-500'
    }
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full mb-6">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-blue-200 text-sm tracking-wider uppercase">About ShiftMyHome</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Your Trusted Partner in{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400">
              Home Removals
            </span>
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Providing exceptional courier services since 2015
          </p>
        </div>

        {/* Story Section */}
        <div className="mb-20">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Image/Icon side */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-3xl opacity-30 group-hover:opacity-50 blur-2xl transition-all duration-500 animate-pulse"></div>
                <div className="relative aspect-square rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center">
                    {/* Icon representation */}
                    <div className="relative">
                      <div className="w-48 h-48 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center shadow-2xl">
                        <Truck className="w-24 h-24 text-white" />
                      </div>
                      {/* Decorative rings */}
                      <div className="absolute inset-0 rounded-full border-4 border-white/10 animate-ping"></div>
                      <div className="absolute -inset-4 rounded-full border-2 border-white/5"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content side */}
              <div className="text-white space-y-6">
                <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 px-4 py-2 rounded-full mb-4">
                  <TrendingUp className="w-4 h-4 text-blue-300" />
                  <span className="text-sm text-blue-200">Our Journey</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  Moving Lives, Creating Memories
                </h3>
                <p className="text-blue-100 text-lg leading-relaxed">
                  Since 2015, ShiftMyHome has been transforming the way people move across the country. With a vision to make relocation stress-free and seamless, we've grown into one of the most trusted names in the industry.
                </p>
                <p className="text-blue-100 text-lg leading-relaxed">
                  Every day, our team of 200+ dedicated professionals ensures that your belongings reach their destination safely. With a modern fleet of 50+ vehicles and cutting-edge tracking technology, we handle each move with precision and care.
                </p>
                <p className="text-blue-100 text-lg leading-relaxed">
                  From single items to entire households, from local deliveries to cross-country relocations - we've successfully completed over 15,000 moves, earning the trust of thousands of satisfied customers.
                </p>

                {/* Checkmarks */}
                <div className="pt-6 space-y-3">
                  {['Fully Licensed & Insured', '24/7 Customer Support', 'Real-time GPS Tracking'].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-blue-100">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Our Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full mb-6">
              <Target className="w-4 h-4 text-cyan-400" />
              <span className="text-blue-200 text-sm tracking-wider uppercase">Our Values</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">What We Stand For</h3>
            <p className="text-xl text-blue-200">Our core values guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">{value.title}</h4>
                  <p className="text-blue-200 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Excellence Section */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl mb-20 overflow-hidden relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden group border-4 border-white/10 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1754765542024-c1320f23b75a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkZWxpdmVyeSUyMHRlYW0lMjBoYXBweSUyMGxvZ2lzdGljc3xlbnwxfHx8fDE3NjY0OTYzNDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                  alt="Our Team" 
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
             </div>
             <div>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full mb-6">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-blue-200 text-sm tracking-wider uppercase">Excellence Guaranteed</span>
                </div>
                <h3 className="text-4xl font-bold text-white mb-6">Committed to Your Satisfaction</h3>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  Our team of dedicated professionals is trained to handle your belongings with the utmost care and respect. We understand that we're not just moving boxes, we're moving your life.
                </p>
                <div className="space-y-4">
                   <div className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-400/30 group-hover:bg-blue-500/30 transition-colors">
                        <CheckCircle className="w-6 h-6 text-blue-300" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Professional & Courteous Staff</h4>
                        <p className="text-blue-200 text-sm">Trained to the highest standards</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-400/30 group-hover:bg-purple-500/30 transition-colors">
                        <Shield className="w-6 h-6 text-purple-300" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Fully Insured & Secure</h4>
                        <p className="text-blue-200 text-sm">Complete peace of mind for every move</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-400/30 group-hover:bg-cyan-500/30 transition-colors">
                        <TrendingUp className="w-6 h-6 text-cyan-300" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Efficient Service</h4>
                        <p className="text-blue-200 text-sm">Timely delivery, every time</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 border border-white/20 rounded-3xl p-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Experience the Difference?
            </h3>
            <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust ShiftMyHome for their moving needs.
            </p>
            <button
              onClick={() => {
                const bookingSection = document.getElementById('booking');
                if (bookingSection) {
                  bookingSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-10 py-5 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50"
            >
              <span className="text-lg font-semibold">Get Your Free Quote</span>
              <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}
