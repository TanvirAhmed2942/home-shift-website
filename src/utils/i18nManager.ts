/**
 * Multi-language Support (i18n) Manager
 * Handles translations for Romanian, English, and Hungarian
 * Admin Panel control for employee language preferences
 */

export type Language = 'en' | 'ro' | 'hu';

export interface TranslationKey {
  en: string;
  ro: string;
  hu: string;
}

export interface EmployeeLanguagePreference {
  userId: string;
  language: Language;
  autoDetect: boolean;
  updatedAt: Date;
}

// Comprehensive translations database
export const translations: Record<string, TranslationKey> = {
  // Navigation & Menu
  'nav.home': {
    en: 'Home',
    ro: 'Acasă',
    hu: 'Főoldal',
  },
  'nav.services': {
    en: 'Services',
    ro: 'Servicii',
    hu: 'Szolgáltatások',
  },
  'nav.about': {
    en: 'About Us',
    ro: 'Despre Noi',
    hu: 'Rólunk',
  },
  'nav.contact': {
    en: 'Contact',
    ro: 'Contact',
    hu: 'Kapcsolat',
  },
  'nav.pricing': {
    en: 'Pricing',
    ro: 'Prețuri',
    hu: 'Árak',
  },
  'nav.faq': {
    en: 'FAQ',
    ro: 'Întrebări Frecvente',
    hu: 'GYIK',
  },
  'nav.login': {
    en: 'Login',
    ro: 'Autentificare',
    hu: 'Bejelentkezés',
  },
  'nav.dashboard': {
    en: 'Dashboard',
    ro: 'Panou',
    hu: 'Irányítópult',
  },
  'nav.logout': {
    en: 'Logout',
    ro: 'Deconectare',
    hu: 'Kijelentkezés',
  },
  'nav.language': {
    en: 'Language',
    ro: 'Limbă',
    hu: 'Nyelv',
  },

  // Common Actions
  'action.submit': {
    en: 'Submit',
    ro: 'Trimite',
    hu: 'Küldés',
  },
  'action.cancel': {
    en: 'Cancel',
    ro: 'Anulează',
    hu: 'Mégse',
  },
  'action.save': {
    en: 'Save',
    ro: 'Salvează',
    hu: 'Mentés',
  },
  'action.delete': {
    en: 'Delete',
    ro: 'Șterge',
    hu: 'Törlés',
  },
  'action.edit': {
    en: 'Edit',
    ro: 'Editează',
    hu: 'Szerkesztés',
  },
  'action.view': {
    en: 'View',
    ro: 'Vizualizează',
    hu: 'Megtekintés',
  },
  'action.download': {
    en: 'Download',
    ro: 'Descarcă',
    hu: 'Letöltés',
  },
  'action.upload': {
    en: 'Upload',
    ro: 'Încarcă',
    hu: 'Feltöltés',
  },
  'action.search': {
    en: 'Search',
    ro: 'Caută',
    hu: 'Keresés',
  },
  'action.filter': {
    en: 'Filter',
    ro: 'Filtrează',
    hu: 'Szűrés',
  },
  'action.confirm': {
    en: 'Confirm',
    ro: 'Confirmă',
    hu: 'Megerősítés',
  },
  'action.back': {
    en: 'Back',
    ro: 'Înapoi',
    hu: 'Vissza',
  },
  'action.next': {
    en: 'Next',
    ro: 'Următorul',
    hu: 'Következő',
  },
  'action.previous': {
    en: 'Previous',
    ro: 'Anterior',
    hu: 'Előző',
  },

  // Service Types
  'service.house_move': {
    en: 'House Move',
    ro: 'Mutare Locuință',
    hu: 'Költözés',
  },
  'service.man_van': {
    en: 'Man & Van',
    ro: 'Bărbat & Dubă',
    hu: 'Furgon Szolgáltatás',
  },
  'service.furniture': {
    en: 'Furniture Delivery',
    ro: 'Livrare Mobilier',
    hu: 'Bútor Szállítás',
  },
  'service.office_move': {
    en: 'Office Move',
    ro: 'Mutare Birou',
    hu: 'Iroda Költöztetés',
  },
  'service.store_pickup': {
    en: 'Store Pickup',
    ro: 'Ridicare din Magazin',
    hu: 'Áruház Átvétel',
  },

  // Booking Form
  'booking.title': {
    en: 'Get Your Quote',
    ro: 'Obține Oferta',
    hu: 'Kérjen Ajánlatot',
  },
  'booking.pickup_address': {
    en: 'Pickup Address',
    ro: 'Adresa Ridicare',
    hu: 'Felv Cími',
  },
  'booking.delivery_address': {
    en: 'Delivery Address',
    ro: 'Adresa Livrare',
    hu: 'Szállítási Cím',
  },
  'booking.date': {
    en: 'Moving Date',
    ro: 'Data Mutării',
    hu: 'Költözés Dátuma',
  },
  'booking.time': {
    en: 'Preferred Time',
    ro: 'Ora Preferată',
    hu: 'Preferált Időpont',
  },
  'booking.items': {
    en: 'Select Items',
    ro: 'Selectează Obiecte',
    hu: 'Tárgyak Kiválasztása',
  },
  'booking.total_volume': {
    en: 'Total Volume',
    ro: 'Volum Total',
    hu: 'Teljes Térfogat',
  },
  'booking.estimated_price': {
    en: 'Estimated Price',
    ro: 'Preț Estimat',
    hu: 'Becsült Ár',
  },
  'booking.contact_info': {
    en: 'Contact Information',
    ro: 'Informații Contact',
    hu: 'Kapcsolati Adatok',
  },
  'booking.full_name': {
    en: 'Full Name',
    ro: 'Nume Complet',
    hu: 'Teljes Név',
  },
  'booking.email': {
    en: 'Email Address',
    ro: 'Adresă Email',
    hu: 'Email Cím',
  },
  'booking.phone': {
    en: 'Phone Number',
    ro: 'Număr Telefon',
    hu: 'Telefonszám',
  },
  'booking.notes': {
    en: 'Additional Notes',
    ro: 'Notițe Adiționale',
    hu: 'További Megjegyzések',
  },
  'booking.get_quote': {
    en: 'Get Quote',
    ro: 'Obține Ofertă',
    hu: 'Ajánlatkérés',
  },

  // Dashboard
  'dashboard.welcome': {
    en: 'Welcome back',
    ro: 'Bine ai revenit',
    hu: 'Üdvözöljük vissza',
  },
  'dashboard.my_jobs': {
    en: 'My Jobs',
    ro: 'Joburile Mele',
    hu: 'Munkáim',
  },
  'dashboard.earnings': {
    en: 'Earnings',
    ro: 'Câștiguri',
    hu: 'Bevétel',
  },
  'dashboard.profile': {
    en: 'Profile',
    ro: 'Profil',
    hu: 'Profil',
  },
  'dashboard.settings': {
    en: 'Settings',
    ro: 'Setări',
    hu: 'Beállítások',
  },
  'dashboard.notifications': {
    en: 'Notifications',
    ro: 'Notificări',
    hu: 'Értesítések',
  },
  'dashboard.messages': {
    en: 'Messages',
    ro: 'Mesaje',
    hu: 'Üzenetek',
  },

  // Job Status
  'status.pending': {
    en: 'Pending',
    ro: 'În Așteptare',
    hu: 'Folyamatban',
  },
  'status.accepted': {
    en: 'Accepted',
    ro: 'Acceptat',
    hu: 'Elfogadva',
  },
  'status.in_progress': {
    en: 'In Progress',
    ro: 'În Desfășurare',
    hu: 'Folyamatban',
  },
  'status.completed': {
    en: 'Completed',
    ro: 'Finalizat',
    hu: 'Befejezve',
  },
  'status.cancelled': {
    en: 'Cancelled',
    ro: 'Anulat',
    hu: 'Törölve',
  },

  // Time & Date
  'time.today': {
    en: 'Today',
    ro: 'Astăzi',
    hu: 'Ma',
  },
  'time.tomorrow': {
    en: 'Tomorrow',
    ro: 'Mâine',
    hu: 'Holnap',
  },
  'time.yesterday': {
    en: 'Yesterday',
    ro: 'Ieri',
    hu: 'Tegnap',
  },
  'time.this_week': {
    en: 'This Week',
    ro: 'Săptămâna Asta',
    hu: 'Ezen a héten',
  },
  'time.this_month': {
    en: 'This Month',
    ro: 'Luna Asta',
    hu: 'Ebben a hónapban',
  },

  // Payment
  'payment.method': {
    en: 'Payment Method',
    ro: 'Metodă Plată',
    hu: 'Fizetési Mód',
  },
  'payment.card': {
    en: 'Credit/Debit Card',
    ro: 'Card Credit/Debit',
    hu: 'Hitelkártya/Bankkártya',
  },
  'payment.cash': {
    en: 'Cash',
    ro: 'Numerar',
    hu: 'Készpénz',
  },
  'payment.bank_transfer': {
    en: 'Bank Transfer',
    ro: 'Transfer Bancar',
    hu: 'Banki Átutalás',
  },
  'payment.total': {
    en: 'Total',
    ro: 'Total',
    hu: 'Összesen',
  },
  'payment.subtotal': {
    en: 'Subtotal',
    ro: 'Subtotal',
    hu: 'Részösszeg',
  },
  'payment.vat': {
    en: 'VAT',
    ro: 'TVA',
    hu: 'ÁFA',
  },

  // Notifications
  'notif.new_job': {
    en: 'New job available',
    ro: 'Job nou disponibil',
    hu: 'Új munka elérhető',
  },
  'notif.job_accepted': {
    en: 'Job accepted',
    ro: 'Job acceptat',
    hu: 'Munka elfogadva',
  },
  'notif.job_completed': {
    en: 'Job completed',
    ro: 'Job finalizat',
    hu: 'Munka befejezve',
  },
  'notif.payment_received': {
    en: 'Payment received',
    ro: 'Plată primită',
    hu: 'Fizetés megérkezett',
  },

  // Errors & Validation
  'error.required_field': {
    en: 'This field is required',
    ro: 'Acest câmp este obligatoriu',
    hu: 'Ez a mező kötelező',
  },
  'error.invalid_email': {
    en: 'Invalid email address',
    ro: 'Adresă email invalidă',
    hu: 'Érvénytelen email cím',
  },
  'error.invalid_phone': {
    en: 'Invalid phone number',
    ro: 'Număr telefon invalid',
    hu: 'Érvénytelen telefonszám',
  },
  'error.something_wrong': {
    en: 'Something went wrong',
    ro: 'Ceva nu a mers bine',
    hu: 'Valami hiba történt',
  },

  // Success Messages
  'success.saved': {
    en: 'Successfully saved',
    ro: 'Salvat cu succes',
    hu: 'Sikeresen mentve',
  },
  'success.updated': {
    en: 'Successfully updated',
    ro: 'Actualizat cu succes',
    hu: 'Sikeresen frissítve',
  },
  'success.deleted': {
    en: 'Successfully deleted',
    ro: 'Șters cu succes',
    hu: 'Sikeresen törölve',
  },
  'success.sent': {
    en: 'Successfully sent',
    ro: 'Trimis cu succes',
    hu: 'Sikeresen elküldve',
  },

  // Admin Panel
  'admin.dashboard': {
    en: 'Admin Dashboard',
    ro: 'Panou Admin',
    hu: 'Admin Irányítópult',
  },
  'admin.users': {
    en: 'Users',
    ro: 'Utilizatori',
    hu: 'Felhasználók',
  },
  'admin.jobs': {
    en: 'Jobs',
    ro: 'Joburi',
    hu: 'Munkák',
  },
  'admin.drivers': {
    en: 'Drivers',
    ro: 'Șoferi',
    hu: 'Sofőrök',
  },
  'admin.customers': {
    en: 'Customers',
    ro: 'Clienți',
    hu: 'Ügyfelek',
  },
  'admin.reports': {
    en: 'Reports',
    ro: 'Rapoarte',
    hu: 'Jelentések',
  },
  'admin.settings': {
    en: 'Settings',
    ro: 'Setări',
    hu: 'Beállítások',
  },
  'admin.language_settings': {
    en: 'Language Settings',
    ro: 'Setări Limbă',
    hu: 'Nyelvi Beállítások',
  },
  'admin.employee_language': {
    en: 'Employee Language Preferences',
    ro: 'Preferințe Limbă Angajați',
    hu: 'Alkalmazotti Nyelvi Beállítások',
  },
};

/**
 * Get current language
 */
export function getCurrentLanguage(): Language {
  const stored = localStorage.getItem('app_language');
  return (stored as Language) || 'en';
}

/**
 * Set current language
 */
export function setCurrentLanguage(language: Language): void {
  localStorage.setItem('app_language', language);
  
  // Update HTML lang attribute
  document.documentElement.lang = language;
  
  // Trigger custom event for components to re-render
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language } }));
}

/**
 * Translate a key
 */
export function t(key: string, language?: Language): string {
  const lang = language || getCurrentLanguage();
  const translation = translations[key];
  
  if (!translation) {
    console.warn(`Translation missing for key: ${key}`);
    return key;
  }
  
  return translation[lang] || translation.en;
}

/**
 * Get employee language preference
 */
export function getEmployeeLanguagePreference(userId: string): EmployeeLanguagePreference | null {
  const stored = localStorage.getItem(`employee_language_${userId}`);
  return stored ? JSON.parse(stored) : null;
}

/**
 * Set employee language preference (Admin Panel)
 */
export function setEmployeeLanguagePreference(userId: string, language: Language, autoDetect: boolean = false): void {
  const preference: EmployeeLanguagePreference = {
    userId,
    language,
    autoDetect,
    updatedAt: new Date(),
  };
  
  localStorage.setItem(`employee_language_${userId}`, JSON.stringify(preference));
  
  // Also update global language if this is the current user
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  if (currentUser.id === userId) {
    setCurrentLanguage(language);
  }
}

/**
 * Get all employee language preferences (Admin Panel)
 */
export function getAllEmployeeLanguagePreferences(): EmployeeLanguagePreference[] {
  const preferences: EmployeeLanguagePreference[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('employee_language_')) {
      const data = localStorage.getItem(key);
      if (data) {
        preferences.push(JSON.parse(data));
      }
    }
  }
  
  return preferences;
}

/**
 * Auto-detect browser language
 */
export function detectBrowserLanguage(): Language {
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('ro')) return 'ro';
  if (browserLang.startsWith('hu')) return 'hu';
  return 'en';
}

/**
 * Initialize language on app load
 */
export function initializeLanguage(userId?: string): void {
  if (userId) {
    const preference = getEmployeeLanguagePreference(userId);
    
    if (preference) {
      if (preference.autoDetect) {
        const detectedLang = detectBrowserLanguage();
        setCurrentLanguage(detectedLang);
      } else {
        setCurrentLanguage(preference.language);
      }
      return;
    }
  }
  
  // No preference found, check for stored language
  const storedLang = localStorage.getItem('app_language');
  if (storedLang) {
    setCurrentLanguage(storedLang as Language);
  } else {
    // Auto-detect and set
    const detectedLang = detectBrowserLanguage();
    setCurrentLanguage(detectedLang);
  }
}

/**
 * Format number with locale
 */
export function formatNumber(num: number, language?: Language): string {
  const lang = language || getCurrentLanguage();
  const locale = {
    en: 'en-GB',
    ro: 'ro-RO',
    hu: 'hu-HU',
  }[lang];
  
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Format currency with locale
 */
export function formatCurrency(amount: number, language?: Language): string {
  const lang = language || getCurrentLanguage();
  const locale = {
    en: 'en-GB',
    ro: 'ro-RO',
    hu: 'hu-HU',
  }[lang];
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
}

/**
 * Format date with locale
 */
export function formatDate(date: Date, language?: Language): string {
  const lang = language || getCurrentLanguage();
  const locale = {
    en: 'en-GB',
    ro: 'ro-RO',
    hu: 'hu-HU',
  }[lang];
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * React hook for translations
 */
export function useTranslation() {
  const [language, setLanguage] = React.useState<Language>(getCurrentLanguage());
  
  React.useEffect(() => {
    const handleLanguageChange = (e: CustomEvent) => {
      setLanguage(e.detail.language);
    };
    
    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, []);
  
  const translate = React.useCallback((key: string) => t(key, language), [language]);
  
  return {
    t: translate,
    language,
    setLanguage: setCurrentLanguage,
    formatNumber: (num: number) => formatNumber(num, language),
    formatCurrency: (amount: number) => formatCurrency(amount, language),
    formatDate: (date: Date) => formatDate(date, language),
  };
}

// Make React available for the hook
import React from 'react';
