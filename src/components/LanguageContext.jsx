import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from './translations';
import { supabase } from "@/components/api/supabaseClient";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'ar');
  const [isRTL, setIsRTL] = useState(language === 'ar' || language === 'ur');

  useEffect(() => {
    const fetchUserPreference = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase.from('UserPreference').select('language').eq('user_email', user.email).single();
          if (data?.language && data.language !== language) {
            setLanguage(data.language);
          }
        }
      } catch (e) {
        console.log("Error fetching language preference", e);
      }
    };
    fetchUserPreference();
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    const rtl = language === 'ar' || language === 'ur';
    setIsRTL(rtl);
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations['ar'][key] || key;
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};