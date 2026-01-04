import React from 'react';
import { MapPin, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const scotlandCities = [
  { name: 'Edinburgh', region: 'Lothian', popular: true },
  { name: 'Glasgow', region: 'Strathclyde', popular: true },
  { name: 'Aberdeen', region: 'Aberdeenshire', popular: true },
  { name: 'Dundee', region: 'Tayside', popular: true },
  { name: 'Inverness', region: 'Highlands' },
  { name: 'Perth', region: 'Perthshire' },
  { name: 'Stirling', region: 'Central Scotland' },
  { name: 'Paisley', region: 'Renfrewshire' },
  { name: 'East Kilbride', region: 'South Lanarkshire' },
  { name: 'Livingston', region: 'West Lothian' },
  { name: 'Hamilton', region: 'South Lanarkshire' },
  { name: 'Kirkcaldy', region: 'Fife' },
  { name: 'Dunfermline', region: 'Fife' },
  { name: 'Ayr', region: 'Ayrshire' },
  { name: 'Kilmarnock', region: 'East Ayrshire' },
  { name: 'Greenock', region: 'Inverclyde' },
  { name: 'Coatbridge', region: 'North Lanarkshire' },
  { name: 'Glenrothes', region: 'Fife' },
  { name: 'Falkirk', region: 'Falkirk' },
  { name: 'Motherwell', region: 'North Lanarkshire' },
];

const englandCities = [
  { name: 'Carlisle', region: 'Cumbria', popular: true },
];

const coverageStats = [
  { icon: MapPin, value: '21+', label: 'Cities covered', gradient: 'from-blue-500 to-indigo-600' },
  { icon: CheckCircle, value: '5,000+', label: 'Deliveries/month', gradient: 'from-emerald-500 to-teal-600' },
  { icon: Clock, value: '24/7', label: 'Service available', gradient: 'from-amber-500 to-orange-600' },
  { icon: TrendingUp, value: '98%', label: 'On-time delivery', gradient: 'from-purple-500 to-pink-600' },
];

export default function ServiceCoverage() {
  return (
    <section id="coverage" className="py-24 px-4 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background images */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-1/2 h-full">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1620476440980-e2247cef12c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY290bGFuZCUyMGVkaW5idXJnaCUyMGNhc3RsZXxlbnwxfHx8fDE3NjU4MTk3ODV8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Edinburgh"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1641379413799-720f9f6e9770?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGFzZ293JTIwc2NvdGxhbmQlMjBjaXR5fGVufDF8fHx8MTc2NTgxOTc4NXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Glasgow"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm px-4 py-2 rounded-full mb-6">
            📍 Service Coverage
          </div>
          <h2 className="text-white mb-4 text-4xl md:text-5xl">We cover all of Scotland</h2>
          <p className="text-blue-100 text-xl max-w-2xl mx-auto">
            From Edinburgh to Inverness, and beyond into Northern England
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {coverageStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 text-center"
              >
                <div className={`bg-gradient-to-br ${stat.gradient} w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-3xl text-white mb-1">{stat.value}</div>
                <div className="text-sm text-blue-100">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Cities Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Scotland */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">🏴󠁧󠁢󠁳󠁣󠁴󠁿</span>
              </div>
              <div>
                <h3 className="text-white text-2xl">Scotland</h3>
                <p className="text-blue-100 text-sm">All major cities & towns</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {scotlandCities.map((city, index) => (
                <div 
                  key={index}
                  className={`
                    group bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 
                    hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105
                    ${city.popular ? 'ring-2 ring-blue-400/30' : ''}
                  `}
                >
                  <div className="flex items-start gap-2">
                    <div className={`mt-0.5 ${city.popular ? 'text-blue-400' : 'text-emerald-400'}`}>
                      {city.popular ? '⭐' : '✓'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white group-hover:text-blue-200 transition-colors truncate">
                        {city.name}
                      </div>
                      <div className="text-xs text-blue-200/60">{city.region}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-blue-500/20 border border-blue-400/30 rounded-xl p-4">
              <p className="text-blue-100 text-sm">
                ⭐ <strong>Most popular</strong> routes with daily availability
              </p>
            </div>
          </div>

          {/* Northern England */}
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-red-500 to-rose-600 w-12 h-12 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">🏴󠁧󠁢󠁥󠁮󠁧󠁿</span>
                </div>
                <div>
                  <h3 className="text-white text-2xl">Northern England</h3>
                  <p className="text-blue-100 text-sm">Cross-border coverage</p>
                </div>
              </div>

              <div className="grid gap-3">
                {englandCities.map((city, index) => (
                  <div 
                    key={index}
                    className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 ring-2 ring-red-400/30"
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 text-red-400">⭐</div>
                      <div className="flex-1">
                        <div className="text-white text-lg group-hover:text-blue-200 transition-colors">
                          {city.name}
                        </div>
                        <div className="text-sm text-blue-200/60">{city.region}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expansion Notice */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-400/30 rounded-3xl p-8">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-14 h-14 rounded-2xl flex items-center justify-center shrink-0">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-white text-xl mb-2">Expanding Soon</h3>
                  <p className="text-purple-100 text-sm leading-relaxed mb-4">
                    We're constantly growing our coverage area. Don't see your city listed?
                  </p>
                  <a 
                    href="tel:02012345678"
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all text-sm"
                  >
                    <span>📞</span>
                    <span>Call us: 020 1234 5678</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Fun Fact */}
            <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-xl border border-amber-400/30 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🚚</span>
                <h4 className="text-white text-lg">Did you know?</h4>
              </div>
              <p className="text-amber-100 text-sm leading-relaxed">
                Our drivers complete an average of <strong>150+ successful moves per week</strong> across Scotland, making us the most trusted moving service in the region.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <a 
            href="#booking"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/80 hover:scale-105 duration-300"
          >
            <MapPin className="w-5 h-5" />
            <span>Book your move now</span>
          </a>
        </div>
      </div>
    </section>
  );
}
