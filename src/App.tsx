import React, { useEffect } from 'react';
import { AppRouter } from './AppRouter';
import { Toaster } from './components/ui/sonner';
import { CookieConsent } from './components/ui/cookie-consent';
import { LanguageProvider } from './components/common/LanguageSwitcher';
import { ThemeProvider } from './components/common/DarkModeToggle';
import { CommandPalette } from './components/common/CommandPalette';
import { JourneyProvider } from './contexts/JourneyContext';
import { initializePWA } from './utils/pwaManager';
import { initializeMonitoring } from './utils/monitoringManager';
import { initializeSEO } from './utils/seoManager';
import { initializeIntegrations, setupScheduledTasks } from './utils/integrationManager';

// ==================== ERROR BOUNDARY ====================
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-12 border border-white/20 shadow-2xl max-w-2xl text-center">
            <h1 className="text-4xl text-white mb-4">Oops! Something went wrong</h1>
            <p className="text-white/70 mb-8">{this.state.error?.message || 'An unexpected error occurred'}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-white text-purple-900 rounded-xl font-bold hover:bg-white/90 transition-all"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ==================== MAIN APP COMPONENT ====================
function App() {
  useEffect(() => {
    // Initialize platform services
    initializePWA();
    initializeMonitoring();
    initializeSEO();
    initializeIntegrations();
    setupScheduledTasks();

    console.log('✅ ShiftMyHome Platform Initialized');
    console.log('📦 2 Applications Ready:');
    console.log('   1. Website (shiftmyhome.com)');
    console.log('   2. Admin Dashboard (admin.shiftmyhome.com)');
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <JourneyProvider>
            {/* AppRouter determines which app to load */}
            <AppRouter />
            
            {/* Global Components */}
            <Toaster />
            <CommandPalette />
            <CookieConsent />
          </JourneyProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
