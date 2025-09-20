import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

// Basic shape for translation dictionaries
export type TranslationDict = Record<string, string>;

interface LanguageContextValue {
  lang: 'en' | 'si';
  setLang: (lang: 'en' | 'si') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

// English dictionary (baseline)
const en: TranslationDict = {
  'nav.home': 'Home',
  'nav.addMarks': 'Add Marks',
  'nav.analysis': 'Analysis',
  'nav.profile': 'Profile',
  'nav.credits': 'Credits',
  'nav.help': 'Help',
  'nav.about': 'About',

  'greeting.morning': 'Good Morning',
  'greeting.afternoon': 'Good Afternoon',
  'greeting.evening': 'Good Evening',
  'home.ready': 'Ready to track your academic progress?',

  'stats.subjects': 'Subjects',
  'stats.average': 'Average',
  'stats.tests': 'Tests',
  'stats.streak': 'Streak',

  'activity.recent': 'Recent Activity',
  'activity.noneTitle': 'Welcome to Marksy!',
  'activity.noneSubtitle': 'Add your first marks to get started',

  'notices.title': 'Notices & Updates',
  'quick.actions': 'Quick Actions',
  'quick.continueLearning': 'Continue Learning',
  'quick.addFirst': 'Add Your First Marks',
  'quick.explore': 'Explore Features',
  'quick.subjectAnalysis': 'Subject Analysis',

  'credits.panel': 'Credits Panel',
  'credits.tagline': 'Meet the incredible team and contributors who made Marksy possible',
  'credits.support': 'Support Our Work',
  'credits.visitSite': 'Visit Site',
  'credits.version': 'Version',
  'credits.release': 'Release',

  'footer.rights': 'All rights reserved.',
  'footer.madeWith': 'Made with',
  'footer.forExcellence': 'for Educational Excellence.'
};

// Sinhala dictionary (initial human + assisted translation; refine as needed)
// NOTE: Some phrases adapted for natural usage; refine with native feedback.
const si: TranslationDict = {
  'nav.home': 'මුල්',
  'nav.addMarks': 'ලකුණු ඇතුල් කරන්න',
  'nav.analysis': 'විශ්ලේෂණය',
  'nav.profile': 'පැතිකඩ',
  'nav.credits': 'ගෞරව',
  'nav.help': 'උදව්',
  'nav.about': 'අප ගැන',

  'greeting.morning': 'සුභ උදෑසනක්',
  'greeting.afternoon': 'සුභ දහවලක්',
  'greeting.evening': 'සුභ සැන්දෑවක්',
  'home.ready': 'ඔබගේ අධ්‍යාපන ප්‍රගතිය දැන් පාලනය කරන්න',

  'stats.subjects': 'විෂය',
  'stats.average': 'ආසල්ම',
  'stats.tests': 'පරීක්ෂණ',
  'stats.streak': 'අඛණ්ඩ දින',

  'activity.recent': 'අලුත් ක්‍රියාකාරකම්',
  'activity.noneTitle': 'Marksy වෙත සාදරයෙන් පිළිගනිමු!',
  'activity.noneSubtitle': 'ඇරඹීමට පළමු ලකුණු ඇතුල් කරන්න',

  'notices.title': 'දැනුම්දීම් & යාවත්කාල',
  'quick.actions': 'ක්‍රියා වේගයෙන්',
  'quick.continueLearning': 'ඉගෙනීම දිගටම කරගන්න',
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
