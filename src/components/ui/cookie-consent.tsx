import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X, Shield } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';
import { Switch } from './switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './dialog';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

interface CookieConsentProps {
  isSettingsOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export function CookieConsent({ isSettingsOpen, onOpenChange }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [internalShowSettings, setInternalShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  const showSettings = isSettingsOpen ?? internalShowSettings;
  const setShowSettings = (show: boolean) => {
    if (onOpenChange) {
      onOpenChange(show);
    } else {
      setInternalShowSettings(show);
    }
  };

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    setShowBanner(false);
  };

  const handleDeclineAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    localStorage.setItem('cookieConsent', JSON.stringify(onlyNecessary));
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    setShowSettings(false);
    setShowBanner(false);
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-4 right-4 z-[9999] max-w-[90vw] md:max-w-[400px]"
          >
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Cookie className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 mr-6">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-1 font-medium">
                    Cookie Preferences
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                    We use cookies to improve your experience. By using our site, you agree to our use of cookies.
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={handleAcceptAll}
                      size="sm"
                      className="h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={handleDeclineAll}
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                    >
                      Decline
                    </Button>
                    <Button
                      onClick={() => setShowSettings(true)}
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs px-2"
                    >
                      Manage
                    </Button>
                  </div>
                </div>
                
                <button
                  onClick={handleDeclineAll}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span className="sr-only">Close</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              Cookie Preferences
            </DialogTitle>
            <DialogDescription>
              Manage your cookie preferences. You can enable or disable different types of cookies below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Necessary Cookies */}
            <div className="flex items-start justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">Necessary Cookies</h4>
                  <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                    Always Active
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and accessibility.
                </p>
              </div>
              <Switch checked={true} disabled />
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-start justify-between gap-4 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Analytics Cookies</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                </p>
              </div>
              <Switch
                checked={preferences.analytics}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, analytics: checked })
                }
              />
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-start justify-between gap-4 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Marketing Cookies</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.
                </p>
              </div>
              <Switch
                checked={preferences.marketing}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, marketing: checked })
                }
              />
            </div>

            {/* Preference Cookies */}
            <div className="flex items-start justify-between gap-4 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Preference Cookies</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  These cookies enable the website to remember your choices (such as language or region) and provide enhanced, more personal features.
                </p>
              </div>
              <Switch
                checked={preferences.preferences}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, preferences: checked })
                }
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Button
              onClick={handleSavePreferences}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
            >
              Save Preferences
            </Button>
            <Button
              onClick={() => setShowSettings(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
