import React, { createContext, useState, useContext, useEffect } from "react";
import { translations } from "@/i18n";
import { supabase } from "@/components/api/supabaseClient";

const LanguageContext = createContext();

// رقم إصدار localStorage - غيّره عند التحديثات المهمة
const STORAGE_VERSION = "1.0";
const VERSION_KEY = "app_storage_version";

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    if (typeof window !== "undefined") {
      // تحقق من إصدار localStorage
      const currentVersion = localStorage.getItem(VERSION_KEY);

      // إذا الإصدار مختلف، امسح المفاتيح المشكلة فقط
      if (currentVersion !== STORAGE_VERSION) {
        const keysToRemove = ["language", "theme", "app_settings"];
        keysToRemove.forEach((key) => localStorage.removeItem(key));

        localStorage.setItem(VERSION_KEY, STORAGE_VERSION);
        return localStorage.getItem("language") || "ar";
      }

      return localStorage.getItem("language") || "ar";
    }
    return "ar";
  });
  const [isRTL, setIsRTL] = useState(language === "ar" || language === "ur");

  useEffect(() => {
    const fetchUserPreference = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from("UserPreference")
            .select("default_language")
            .eq("user_email", user.email)
            .maybeSingle();

          if (
            !error &&
            data?.default_language &&
            data.default_language !== language
          ) {
            setLanguage(data.default_language);
          }
        }
      } catch (e) {
        console.log("Error fetching language preference:", e);
      }
    };
    fetchUserPreference();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("language", language);
    }
    const rtl = language === "ar" || language === "ur";
    setIsRTL(rtl);
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const t = (key, defaultText = "") => {
    // إذا اللغة عربية، نرجع النص الافتراضي أو المفتاح (لأن النص موجود في الكود أصلاً)
    if (language === "ar") {
      return defaultText || key;
    }

    try {
      // دعم النقطة: repentance.title
      if (key.includes(".")) {
        const parts = key.split(".");
        let value = translations[language];

        for (const part of parts) {
          if (value && typeof value === "object") {
            value = value[part];
          } else {
            break;
          }
        }

        if (value && typeof value === "string") {
          return value;
        }
      }

      // البحث المباشر
      const translation = translations[language]?.[key];

      if (translation && typeof translation === "string") {
        return translation;
      }

      // Fallback للنص الافتراضي أو المفتاح
      return defaultText || key;
    } catch (error) {
      console.warn("Translation error for key:", key, error);
      return defaultText || key;
    }
  };

  const changeLanguage = async (lang) => {
    setLanguage(lang);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("UserPreference").upsert(
          {
            user_email: user.email,
            default_language: lang,
            updated_date: new Date().toISOString(),
          },
          {
            onConflict: "user_email",
          },
        );
      }
    } catch (e) {
      console.log("Error saving language preference:", e);
    }
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
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
