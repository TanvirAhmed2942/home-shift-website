import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentLanguage, setCurrentLanguage, Language } from '../../utils/i18nManager';

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
}>({
  language: 'en',
  setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLang] = useState<Language>(getCurrentLanguage());

  useEffect(() => {
    // Listen for language changes from other parts of the app
    const handleLangChange = (e: CustomEvent) => {
      setLang(e.detail.language);
    };
    window.addEventListener('languageChanged', handleLangChange as EventListener);
    
    // Initial load
    setLang(getCurrentLanguage());

    return () => window.removeEventListener('languageChanged', handleLangChange as EventListener);
  }, []);

  const setLanguageWrapper = (lang: Language) => {
    setCurrentLanguage(lang);
    setLang(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setLanguageWrapper }}>
      {children}
    </LanguageContext.Provider>
  );
}
