import React, { createContext, useContext, useState, useEffect } from 'react';

interface Translations {
  [key: string]: any;
}

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const translations: Record<string, Translations> = {
  en: {
    credits: {
      title: "Credits",
      restart: "Restart",
      pause: "Pause",
      resume: "Resume",
      supportUs: "Support Us",
      buyMeACoffee: "Buy Me A Coffee",
      donate: "Donate",
      manualScroll: "Manual Scroll",
      autoScroll: "Auto Scroll"
    }
  },
  si: {
    credits: {
      title: "සම්මාන",
      restart: "නැවත ආරම්භ කරන්න",
      pause: "විරාමය",
      resume: "නැවත පටන් ගන්න",
      supportUs: "අපට සහාය වන්න",
      buyMeACoffee: "මට කෝපි එකක් ගන්න",
      donate: "පරිත්‍යාග කරන්න",
      manualScroll: "අතින් පරිශීලනය",
      autoScroll: "ස්වයංක්‍රීය පරිශීලනය"
    }
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang && Object.keys(translations).includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (!value[k]) return key;
      value = value[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
  'quick.addFirst': 'පළමු ලකුණු ඇතුල් කරන්න',
  'quick.explore': 'පැතිකඩ විකාශ',
  'quick.subjectAnalysis': 'විෂය විශ්ලේෂණය',

  'credits.panel': 'ගෞරව පුවරුව',
  'credits.tagline': 'Marksy නිර්මාණයට දායක වූ අපගේ කණ්ඩායම',
  'credits.support': 'අපගේ වැඩ ආධාර කරන්න',
  'credits.visitSite': 'වෙබ් අඩවිය',
  'credits.version': 'සංස්කරණය',
  'credits.release': 'නිකුතුව',

  'footer.rights': 'සියලු හිමිකම් ඇවිරිණි.',
  'footer.madeWith': 'හදවතින්',
  'footer.forExcellence': 'අධ්‍යාපන ශ්‍රේෂ්ඨත්වය සඳහා.'
};

const dictionaries: Record<'en' | 'si', TranslationDict> = { en, si };

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<'en' | 'si'>(() => {
    const saved = localStorage.getItem('lang');
    return (saved === 'si' || saved === 'en') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.setAttribute('lang', lang === 'si' ? 'si' : 'en');
  }, [lang]);

  const setLang = useCallback((l: 'en' | 'si') => setLangState(l), []);

  const t = useCallback((key: string) => {
    const dict = dictionaries[lang];
    return dict[key] || dictionaries.en[key] || key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
