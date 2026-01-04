import React, { useEffect } from 'react';
import { Star } from 'lucide-react';

interface TrustpilotWidgetProps {
  variant?: 'mini' | 'horizontal' | 'carousel';
  className?: string;
}

export function TrustpilotWidget({ variant = 'horizontal', className = '' }: TrustpilotWidgetProps) {
  useEffect(() => {
    // Load Trustpilot widget script
    const script = document.createElement('script');
    script.src = '//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Trustpilot template IDs
  const templateIds = {
    mini: '5419b6a8b0d04a076446a9ad', // Mini template
    horizontal: '53aa8912dec7e10d38f59f36', // Horizontal template
    carousel: '53aa8807dec7e10d38f59f32', // Carousel template
  };

  return (
    <div className={className}>
      {/* Trustpilot widget */}
      <div
        className="trustpilot-widget"
        data-locale="en-GB"
        data-template-id={templateIds[variant]}
        data-businessunit-id="YOUR_BUSINESS_ID_HERE"
        data-style-height="150px"
        data-style-width="100%"
        data-theme="light"
        data-stars="4,5"
      >
        {/* Fallback content while loading */}
        <div className="flex items-center justify-center gap-3 py-6">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-green-500 text-green-500" />
            ))}
          </div>
          <div className="text-slate-700">
            <span className="font-bold">Excellent</span>
            <span className="text-sm ml-2 text-slate-500">4.8 out of 5</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mini badge component for footer or compact spaces
export function TrustpilotBadge() {
  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <div className="flex items-center gap-2">
        <img 
          src="https://cdn.trustpilot.net/brand-assets/4.1.0/logo-white.svg" 
          alt="Trustpilot" 
          className="h-6"
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-green-500 text-green-500" />
          ))}
        </div>
        <span className="text-sm font-semibold text-slate-700">4.8 / 5</span>
      </div>
      <a 
        href="https://www.trustpilot.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
      >
        Based on 500+ reviews
      </a>
    </div>
  );
}

// Inline trust indicator for hero section
export function TrustpilotInline() {
  return (
    <div className="inline-flex items-center gap-3 bg-white/95 backdrop-blur-sm px-4 sm:px-6 py-3 rounded-full shadow-lg border border-slate-200">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-green-500 text-green-500" />
        ))}
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
        <span className="text-sm font-bold text-slate-900">Excellent 4.8/5</span>
        <span className="text-xs text-slate-600 hidden sm:inline">•</span>
        <span className="text-xs text-slate-600">500+ Trustpilot Reviews</span>
      </div>
    </div>
  );
}

// Reviews carousel for testimonials section
export function TrustpilotReviewsSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-6 py-3 rounded-full mb-6">
            <Star className="w-4 h-4 text-green-600 fill-green-600" />
            <span className="text-green-900 text-sm tracking-wider uppercase">Trusted by Thousands</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            What Our{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
              Customers Say
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Don't just take our word for it - see what our happy customers have to say
          </p>
          
          {/* Trustpilot Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-green-500 text-green-500" />
                ))}
              </div>
              <span className="text-2xl font-bold text-slate-900">4.8</span>
            </div>
            <div className="text-slate-600">
              <span className="font-semibold text-slate-900">500+</span> reviews on
              <img 
                src="https://cdn.trustpilot.net/brand-assets/4.1.0/logo-black.svg" 
                alt="Trustpilot" 
                className="h-5 inline ml-2"
              />
            </div>
          </div>
        </div>

        {/* Sample Reviews */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: 'Sarah Johnson',
              rating: 5,
              date: '2 days ago',
              title: 'Excellent service!',
              review: 'The team was professional, punctual, and handled all our furniture with care. Highly recommend!',
            },
            {
              name: 'Michael Brown',
              rating: 5,
              date: '1 week ago',
              title: 'Great experience',
              review: 'Smooth house move from start to finish. The movers were friendly and efficient. Will use again!',
            },
            {
              name: 'Emma Davis',
              rating: 5,
              date: '2 weeks ago',
              title: 'Very professional',
              review: 'Picked up my IKEA furniture and delivered on time. Great communication throughout the process.',
            },
          ].map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100"
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-green-500 text-green-500" />
                ))}
              </div>
              <h4 className="font-bold text-slate-900 mb-2">{review.title}</h4>
              <p className="text-slate-600 text-sm mb-4">{review.review}</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="font-semibold text-slate-900 text-sm">{review.name}</span>
                <span className="text-xs text-slate-500">{review.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA to Trustpilot */}
        <div className="text-center mt-12">
          <a
            href="https://www.trustpilot.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 hover:scale-105 shadow-xl font-semibold"
          >
            <Star className="w-5 h-5 fill-white" />
            Read All Reviews on Trustpilot
          </a>
        </div>
      </div>
    </section>
  );
}
