import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Check, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner@2.0.3';

interface NewsletterSignupProps {
  variant?: 'inline' | 'modal' | 'footer';
}

export function NewsletterSignup({ variant = 'inline' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Save to localStorage
    const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
    if (!subscribers.includes(email)) {
      subscribers.push({
        email,
        subscribedAt: new Date().toISOString(),
        source: variant,
      });
      localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
    }

    setIsSubmitting(false);
    setIsSubscribed(true);

    toast.success('Successfully subscribed!', {
      description: 'Check your email for a confirmation link.',
    });

    setTimeout(() => {
      setEmail('');
      setIsSubscribed(false);
    }, 3000);
  };

  if (variant === 'footer') {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h4 className="font-semibold">Stay Updated</h4>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={isSubscribed}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isSubmitting || isSubscribed}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 whitespace-nowrap"
          >
            {isSubscribed ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Subscribed
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Subscribe
              </>
            )}
          </Button>
        </form>
      </div>
    );
  }

  if (variant === 'modal') {
    return (
      <div className="text-center space-y-4 p-6">
        <div className="inline-flex p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold">Join Our Newsletter</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Get exclusive moving tips, special discounts, and early access to new features!
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
            disabled={isSubscribed}
            className="text-center"
          />
          <Button
            type="submit"
            disabled={isSubmitting || isSubscribed}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isSubmitting && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
              />
            )}
            {isSubscribed ? 'Successfully Subscribed!' : 'Subscribe Now'}
          </Button>
        </form>
        <p className="text-xs text-gray-500">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    );
  }

  // Default inline variant
  return (
    <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 rounded-2xl p-8 text-white">
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <div className="inline-flex p-3 bg-white/10 backdrop-blur-sm rounded-full">
          <Mail className="w-6 h-6" />
        </div>
        <h3 className="text-3xl font-bold">Never Miss a Deal!</h3>
        <p className="text-purple-100">
          Join 10,000+ subscribers and get weekly moving tips, exclusive discounts, and early bird access to new services.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            disabled={isSubscribed}
            className="flex-1 bg-white/90 text-gray-900 placeholder:text-gray-500 border-0"
          />
          <Button
            type="submit"
            disabled={isSubmitting || isSubscribed}
            className="bg-white text-purple-600 hover:bg-gray-100 font-semibold whitespace-nowrap"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full"
              />
            ) : isSubscribed ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Subscribed!
              </>
            ) : (
              'Subscribe Free'
            )}
          </Button>
        </form>
        <p className="text-sm text-purple-200">
          🔒 We respect your privacy. Unsubscribe anytime with one click.
        </p>
        <div className="flex items-center justify-center gap-6 text-sm text-purple-100">
          <div className="flex items-center gap-1">
            <Check className="w-4 h-4" />
            <span>No spam</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="w-4 h-4" />
            <span>Weekly tips</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="w-4 h-4" />
            <span>Exclusive deals</span>
          </div>
        </div>
      </div>
    </div>
  );
}
