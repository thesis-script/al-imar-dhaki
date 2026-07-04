import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'fr');

  const toggleLang = () => {
    const next = lang === 'fr' ? 'ar' : 'fr';
    setLang(next);
    localStorage.setItem('lang', next);
  };

  // Apply dir and lang attributes directly on <html> for complete RTL support
  useEffect(() => {
    const isRTL = lang === 'ar';
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    document.body.style.fontFamily = isRTL
      ? '"Tajawal","Cairo",sans-serif'
      : '"Tajawal","Cairo",sans-serif';
  }, [lang]);

  const t = (path) => {
    const keys = path.split('.');
    let val = translations[lang];
    for (const k of keys) { val = val?.[k]; }
    if (val === undefined) {
      let fb = translations['fr'];
      for (const k of keys) { fb = fb?.[k]; }
      return fb ?? path;
    }
    return val;
  };

  const isRTL = lang === 'ar';

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
