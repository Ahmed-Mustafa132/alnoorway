import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Globe, Calendar, BookOpen, Video, MessageSquare, Heart, Save, Eye, EyeOff } from "lucide-react";

export default function AppSettingsAdmin() {
  const [settings, setSettings] = useState({
    features: {
      azkar: true,
      library: true,
      lectures: true,
      stories: true,
      fatwas: true,
      centers: true,
    },
    languages: {
      ar: true,
      en: true,
      fr: true,
      ur: true,
    }
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  };

  const handleSave = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    alert('تم حفظ الإعدادات بنجاح! ✅');
  };

  const handleFeatureToggle = (feature, value) => {
    setSettings({
      ...settings,
      features: { ...settings.features, [feature]: value }
    });
  };

  const handleLanguageToggle = (lang, value) => {
    setSettings({
      ...settings,
      languages: { ...settings.languages, [lang]: value }
    });
  };

  const features = [
    { key: 'azkar', label: 'الأذكار اليومية', icon: Calendar, color: 'text-amber-600' },
    { key: 'library', label: 'المكتبة الإسلامية', icon: BookOpen, color: 'text-purple-600' },
    { key: 'lectures', label: 'المحاضرات', icon: Video, color: 'text-blue-600' },
    { key: 'stories', label: 'القصص الملهمة', icon: Heart, color: 'text-rose-600' },
    { key: 'fatwas', label: 'الفتاوى', icon: MessageSquare, color: 'text-emerald-600' },
  ];

  const languages = [
    { key: 'ar', label: 'العربية', flag: '🇸🇦' },
    { key: 'en', label: 'English', flag: '🇬🇧' },
    { key: 'fr', label: 'Français', flag: '🇫🇷' },
    { key: 'ur', label: 'اردو', flag: '🇵🇰' },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Eye className="w-6 h-6 text-blue-600" />
            إظهار/إخفاء الأقسام
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {features.map((feature) => (
            <div key={feature.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
                <div>
                  <p className="font-medium text-lg">{feature.label}</p>
                  <p className="text-sm text-gray-500">
                    {settings.features[feature.key] ? 'مفعّل' : 'معطّل'}
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.features[feature.key]}
                onCheckedChange={(value) => handleFeatureToggle(feature.key, value)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Globe className="w-6 h-6 text-emerald-600" />
            اللغات المتاحة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {languages.map((lang) => (
            <div key={lang.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{lang.flag}</span>
                <div>
                  <p className="font-medium text-lg">{lang.label}</p>
                  <p className="text-sm text-gray-500">
                    {settings.languages[lang.key] ? 'متاحة' : 'غير متاحة'}
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.languages[lang.key]}
                onCheckedChange={(value) => handleLanguageToggle(lang.key, value)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Button
        onClick={handleSave}
        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-6 text-lg shadow-xl"
      >
        <Save className="w-5 h-5 ml-2" />
        حفظ جميع الإعدادات
      </Button>
    </div>
  );
}