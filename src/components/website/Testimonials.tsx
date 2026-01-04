import React, { useState } from 'react';
import { Star, Quote, ThumbsUp, Filter, Search } from 'lucide-react';

export default function Testimonials() {
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const reviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'Edinburgh',
      rating: 5,
      date: 'December 10, 2024',
      service: 'House Removal',
      avatar: '👩',
      review: 'Absolutely fantastic service! The team arrived on time, handled all my belongings with extreme care, and made what could have been a stressful day completely smooth. Andrei and his team are true professionals. Highly recommend ShiftMyHome!',
      helpful: 45,
      verified: true
    },
    {
      id: 2,
      name: 'James McGregor',
      location: 'Glasgow',
      rating: 5,
      date: 'December 8, 2024',
      service: 'Office Relocation',
      avatar: '👨',
      review: 'We moved our entire office with ShiftMyHome and couldn\'t be happier. They were efficient, professional, and nothing was damaged. The team worked after hours to minimize disruption to our business. Excellent value for money!',
      helpful: 38,
      verified: true
    },
    {
      id: 3,
      name: 'Emma Wilson',
      location: 'Aberdeen',
      rating: 5,
      date: 'December 5, 2024',
      service: 'Furniture Delivery',
      avatar: '👩‍🦰',
      review: 'Called them last minute for a furniture delivery and they accommodated me the same day! The drivers were friendly, careful with my new sofa, and even helped position it exactly where I wanted. Outstanding customer service!',
      helpful: 32,
      verified: true
    },
    {
      id: 4,
      name: 'Michael Brown',
      location: 'Dundee',
      rating: 4,
      date: 'December 3, 2024',
      service: 'Storage Service',
      avatar: '👨‍💼',
      review: 'Great storage solution while we were between homes. Facilities are clean, secure, and reasonably priced. Only minor issue was the paperwork took a bit longer than expected, but overall very satisfied with the service.',
      helpful: 28,
      verified: true
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      location: 'Inverness',
      rating: 5,
      date: 'November 30, 2024',
      service: 'Packing Service',
      avatar: '👩‍💻',
      review: 'The packing service saved me so much time and stress! They brought all materials and packed everything professionally. When we unpacked, not a single item was broken. Worth every penny. Thank you ShiftMyHome!',
      helpful: 41,
      verified: true
    },
    {
      id: 6,
      name: 'David Taylor',
      location: 'Perth',
      rating: 5,
      date: 'November 28, 2024',
      service: 'Clearance & Removal',
      avatar: '👨‍🔧',
      review: 'Needed a quick clearance service for some old office furniture. The team was punctual, efficient, and disposed of everything responsibly. Brilliant service!',
      helpful: 25,
      verified: true
    },
    {
      id: 7,
      name: 'Rachel Green',
      location: 'Stirling',
      rating: 5,
      date: 'November 25, 2024',
      service: 'House Removal',
      avatar: '👩‍🎓',
      review: 'Moving house is stressful but ShiftMyHome made it so easy! From the initial quote to the final box being unloaded, everything was perfect. The team was friendly, fast, and professional. 10/10 would recommend!',
      helpful: 36,
      verified: true
    },
    {
      id: 8,
      name: 'Tom Harris',
      location: 'Carlisle',
      rating: 4,
      date: 'November 22, 2024',
      service: 'Courier Service',
      avatar: '👨‍🏫',
      review: 'Used their courier service for business deliveries. Reliable, trackable, and great communication throughout. Only reason it\'s not 5 stars is pricing is slightly higher than competitors, but you get what you pay for in terms of quality.',
      helpful: 19,
      verified: true
    },
    {
      id: 9,
      name: 'Sophie Martin',
      location: 'Edinburgh',
      rating: 5,
      date: 'November 20, 2024',
      service: 'House Removal',
      avatar: '👩‍⚕️',
      review: 'Amazing experience from start to finish! The team handled my antique furniture with such care. They even helped me rearrange things when I changed my mind about placement. Customer service is exceptional!',
      helpful: 44,
      verified: true
    },
    {
      id: 10,
      name: 'Chris Evans',
      location: 'Glasgow',
      rating: 5,
      date: 'November 18, 2024',
      service: 'Packing Service',
      avatar: '👨‍✈️',
      review: 'Professional packing service that exceeded expectations. They wrapped everything securely, labeled all boxes clearly, and made unpacking a breeze. The attention to detail was impressive. Highly recommended!',
      helpful: 31,
      verified: true
    },
    {
      id: 11,
      name: 'Jennifer Lee',
      location: 'Aberdeen',
      rating: 5,
      date: 'November 15, 2024',
      service: 'Office Relocation',
      avatar: '👩‍💼',
      review: 'Relocated our startup office with ShiftMyHome. They were flexible with timing, handled IT equipment with care, and completed everything within budget. The project manager kept us informed every step of the way. Excellent!',
      helpful: 27,
      verified: true
    },
    {
      id: 12,
      name: 'Peter Thompson',
      location: 'Dundee',
      rating: 5,
      date: 'November 12, 2024',
      service: 'Furniture Delivery',
      avatar: '👨‍🎨',
      review: 'Delivered a large wardrobe to my 3rd floor flat with no elevator. The team managed it perfectly without any damage to walls or the furniture. Strong, skilled, and friendly. Couldn\'t ask for better service!',
      helpful: 23,
      verified: true
    },
  ];

  const stats = [
    { label: 'Total Reviews', value: '2,847', gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Average Rating', value: '4.9', gradient: 'from-purple-500 to-pink-500' },
    { label: 'Verified Customers', value: '98%', gradient: 'from-green-500 to-emerald-500' },
    { label: 'Recommend Us', value: '96%', gradient: 'from-amber-500 to-orange-500' }
  ];

  const filteredReviews = reviews.filter(review => {
    const matchesRating = filterRating ? review.rating === filterRating : true;
    const matchesSearch = searchTerm
      ? review.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.service.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesRating && matchesSearch;
  });

  return (
    <section id="reviews" className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 px-6 py-3 rounded-full mb-6">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-blue-900 text-sm tracking-wider uppercase">Customer Reviews</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            What Our{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Customers Say
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Real reviews from real customers. See why thousands trust ShiftMyHome
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                {stat.value}
              </div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              />
            </div>

            {/* Rating Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterRating(null)}
                  className={`px-4 py-2 rounded-xl transition-all ${
                    filterRating === null
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  All
                </button>
                {[5, 4].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setFilterRating(rating)}
                    className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1 ${
                      filterRating === rating
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {rating} <Star className="w-4 h-4 fill-current" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl">
                    {review.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900">{review.name}</h4>
                      {review.verified && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500">{review.location}</p>
                  </div>
                </div>
                <Quote className="w-8 h-8 text-blue-200" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-slate-200 fill-slate-200'
                    }`}
                  />
                ))}
              </div>

              {/* Service badge */}
              <div className="inline-block bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-xs px-3 py-1.5 rounded-full mb-3">
                {review.service}
              </div>

              {/* Review text */}
              <p className="text-slate-700 mb-4 leading-relaxed">{review.review}</p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-500">{review.date}</span>
                <button className="flex items-center gap-1 text-sm text-slate-600 hover:text-blue-600 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{review.helpful}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="backdrop-blur-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-3xl p-8 md:p-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Ready to Join Our Happy Customers?
            </h3>
            <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
              Experience the service that earned us thousands of 5-star reviews
            </p>
            <button
              onClick={() => {
                const bookingSection = document.getElementById('booking');
                if (bookingSection) {
                  bookingSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              <span className="font-semibold">Get Your Free Quote</span>
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
      `}</style>
    </section>
  );
}
