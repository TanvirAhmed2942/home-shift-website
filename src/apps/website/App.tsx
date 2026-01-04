import React, { useState, lazy, Suspense } from 'react';
import { Header } from '../../components/website/Header';
import { Hero } from '../../components/website/Hero';
import { CallbackModal } from '../../components/website/CallbackModal';
import { TrustBadges } from '../../components/website/TrustBadges';
import { ServiceCards } from '../../components/website/ServiceCards';
import { BookingForm } from '../../components/website/BookingForm';
import { Footer } from '../../components/website/Footer';
import { TermsModal } from '../../components/website/TermsModal';
import { PrivacyModal } from '../../components/website/PrivacyModal';
import { SitemapModal } from '../../components/website/SitemapModal';
import { LoginModal } from '../../components/website/LoginModal';
import { LiveChat } from '../../components/website/LiveChat';
import { CallMeButton } from '../../components/website/CallMeButton';
import { CookieConsent } from '../../components/ui/cookie-consent';
import { LiveChatWidget } from '../../components/website/LiveChatWidget';
import { QuoteWizard } from '../../components/quote/QuoteWizard';
import { Loader } from 'lucide-react';

import { router } from '../../utils/router';

// Lazy load sections - Using default exports now
const HowItWorks = lazy(() => import('../../components/website/HowItWorks'));
const WhyShiftMyHome = lazy(() => import('../../components/website/WhyShiftMyHome'));
const AboutUs = lazy(() => import('../../components/website/AboutUs'));
const Gallery = lazy(() => import('../../components/website/Gallery'));
const Blog = lazy(() => import('../../components/website/Blog'));
const Reviews = lazy(() => import('../../components/website/Reviews'));
const Contact = lazy(() => import('../../components/website/Contact'));
const FAQ = lazy(() => import('../../components/website/FAQ'));
const ServiceCoverage = lazy(() => import('../../components/website/ServiceCoverage'));

// Pages - Using default exports now
const PricingPage = lazy(() => import('../../components/website/pages/PricingPage'));
const BlogPage = lazy(() => import('../../components/website/pages/BlogPage'));
const TrackingPage = lazy(() => import('../../components/website/pages/TrackingPage'));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
    <div className="text-center">
      <Loader className="w-16 h-16 text-white animate-spin mx-auto mb-4" />
      <p className="text-white text-lg">Loading ShiftMyHome...</p>
    </div>
  </div>
);

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showSitemap, setShowSitemap] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginTab, setLoginTab] = useState<'customer' | 'driver' | 'admin'>('customer');
  const [showCallback, setShowCallback] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleSelectService = (service: string) => {
    setSelectedService(service);
    setCurrentPage('quote');
  };

  const openLogin = (tab: 'customer' | 'driver' | 'admin' = 'customer') => {
    setLoginTab(tab);
    setShowLogin(true);
  };

  const handleAdminLogin = (email: string, pass: string) => {
    // Simple validation for demo purposes
    if (email === 'admin@shiftmyhome.com' && pass === 'admin123') {
      router.navigate({ page: 'admin' });
      return true;
    }
    return false;
  };

  const handleCustomerLogin = (email: string, pass: string) => {
    // Simple validation for demo purposes
    if (email === 'customer@shiftmyhome.com' && pass === 'customer123') {
      router.navigate({ page: 'home' });
      return true;
    }
    return false;
  };

  const handleDriverLogin = (email: string, pass: string) => {
    // Simple validation for demo purposes
    if (email === 'driver@shiftmyhome.com' && pass === 'driver123') {
      router.navigate({ page: 'home' });
      return true;
    }
    return false;
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'pricing':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <PricingPage selectedService={selectedService} onGoBack={() => setCurrentPage('home')} />
          </Suspense>
        );
      case 'quote':
        return <QuoteWizard serviceType={selectedService || 'house-move'} onClose={() => setCurrentPage('home')} />;
      case 'tracking':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <TrackingPage />
          </Suspense>
        );
      case 'blog':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <BlogPage />
          </Suspense>
        );
      default:
        return (
          <>
            <Hero onGetStarted={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} />
            <ServiceCards selectedService={selectedService} onSelectService={handleSelectService} />
            <TrustBadges />
            <div id="booking">
               <BookingForm 
                  selectedService={selectedService}
                  onShowTerms={() => setShowTerms(true)}
                  onShowLogin={(tab) => openLogin(tab)}
                  onViewPricing={() => setCurrentPage('pricing')}
               />
            </div>
            <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
              <HowItWorks />
              <WhyShiftMyHome />
              <ServiceCoverage />
              <Gallery />
              <Reviews />
              <FAQ />
              <Blog />
              <Contact />
            </Suspense>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onGetPrice={() => setCurrentPage('quote')}
        onShowLogin={(tab) => openLogin(tab)}
        onShowCallback={() => setShowCallback(true)}
      />
      
      {renderPage()}
      
      <Footer 
        onShowTerms={() => setShowTerms(true)}
        onShowPrivacy={() => setShowPrivacy(true)}
        onShowSitemap={() => setShowSitemap(true)}
      />

      {/* Modals */}
      {showTerms && <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />}
      {showPrivacy && <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />}
      {showSitemap && <SitemapModal isOpen={showSitemap} onClose={() => setShowSitemap(false)} />}
      {showLogin && (
        <LoginModal 
          isOpen={showLogin} 
          onClose={() => setShowLogin(false)} 
          initialTab={loginTab}
          onAdminLogin={handleAdminLogin}
          onCustomerLogin={handleCustomerLogin}
          onDriverLogin={handleDriverLogin}
        />
      )}
      {showCallback && <CallbackModal isOpen={showCallback} onClose={() => setShowCallback(false)} />}

      {/* Global Widgets */}
      <LiveChatWidget />
      <CallMeButton onClick={() => setShowCallback(true)} />
      <CookieConsent />
    </div>
  );
}

export default App;