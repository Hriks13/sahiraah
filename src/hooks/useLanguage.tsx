
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Basic translations
const translations: Record<string, Record<string, string>> = {
  en: {
    // English translations
    welcome: "Welcome",
    dashboard: "Dashboard",
    settings: "Settings",
    about: "About",
    contact: "Contact",
    login: "Login",
    signup: "Sign Up",
    // Add more translations as needed
  },
  hi: {
    // Hindi translations
    welcome: "स्वागत हे",
    dashboard: "डैशबोर्ड",
    settings: "सेटिंग्स",
    about: "हमारे बारे में",
    contact: "संपर्क",
    login: "लॉग इन",
    signup: "साइन अप",
    // Add more translations as needed
  },
  // Add more languages as needed
};

export const LanguageProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get saved language from localStorage or default to English
    return localStorage.getItem('sahiraah_language') || 'en';
  });

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem('sahiraah_language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    
    // Fallback to English if translation not found
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    
    // Return the key if no translation found
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
