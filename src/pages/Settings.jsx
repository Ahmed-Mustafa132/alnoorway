import React, { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, User, Bell, Moon, Type, Globe, Save, Heart, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InterestsSelector from "@/components/InterestsSelector";
import Breadcrumb from "@/components/Breadcrumb";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Settings() {
  const { t } = useLanguage()
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [fontSize, setFontSize] = useState(localStorage.getItem('fontSize') || 'medium');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'ar');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    fatwa_updates: true,
    new_content: true,
    live_streams: true,
    scheduled_meetings: true
  });

  useEffect(() => {
    loadUser();
    loadNotificationSettings();
  }, []);

  const loadUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser({ ...authUser, role: 'user' });
      }
    } catch (error) {
      console.log("User not logged in");
    }
  };

  const loadNotificationSettings = () => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  };

  const { data: userPreferences } = useQuery({
    queryKey: ['user_preferences', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const { data, error } = await supabase.from('UserPreference').select('*').eq('user_email', user.email);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    initialData: [],
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase.auth.updateUser({ data });
      if (error) throw error;
    },
    onSuccess: () => {
      alert(t('profileSuccessMessage'));
      loadUser();
    },
    onError: (error) => {
      console.log("Error updating user:", error);
      alert(t('profileErrorMessage'));
    }
  });

  const handleDarkModeToggle = (checked) => {
    setDarkMode(checked);
    localStorage.setItem('darkMode', checked);
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
    const sizes = { small: '14px', medium: '16px', large: '18px', xlarge: '20px' };
    document.documentElement.style.fontSize = sizes[size];
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    window.location.reload();
  };

  const handleNotificationChange = (key, value) => {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const handleSaveProfile = () => {
    if (user) {
      updateUserMutation.mutate({
        full_name: user.full_name,
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        handleNotificationChange('push', true);
        alert(t('notificationsSuccessPush'));
      } else {
        alert(t('notificationsErrorPush'));
      }
    }
  };

  const languageOptions = [
    { value: 'ar', label: t('languagesAr'), flag: '🇸🇦' },
    { value: 'en', label: t('languagesEn'), flag: '🇬🇧' },
    { value: 'fr', label: t('languagesFr'), flag: '🇫🇷' },
    { value: 'ur', label: t('languagesUr'), flag: '🇵🇰' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <Breadcrumb items={[{ label: t('settingsBreadcrumb') }]} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
            <SettingsIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
            {t('settingsTitle')}
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 px-4">
            {t('settingsSubtitle')}
          </p>
        </motion.div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 md:mb-8">
            <TabsTrigger value="profile" className="text-xs md:text-sm">{t('settingsTabProfile')}</TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs md:text-sm">{t('settingsTabNotifications')}</TabsTrigger>
            <TabsTrigger value="appearance" className="text-xs md:text-sm">{t('settingsTabAppearance')}</TabsTrigger>
            <TabsTrigger value="interests" className="text-xs md:text-sm">{t('settingsTabInterests')}</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <User className="w-5 h-5 text-blue-600" />
                  {t('profileTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm md:text-base">{t('profileFullName')}</Label>
                  <Input
                    id="name"
                    value={user?.full_name || ''}
                    onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm md:text-base">{t('profileEmail')}</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="mt-2 bg-gray-50"
                  />
                </div>
                <Button
                  onClick={handleSaveProfile}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 w-full"
                  disabled={updateUserMutation.isLoading}
                >
                  <Save className="w-4 h-4 ml-2" />
                  {updateUserMutation.isLoading ? t('profileSaving') : t('profileSaveBtn')}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl text-red-600">
                  <div className="w-5 h-5" />
                  {t('passwordTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="new-password">{t('passwordNewLabel')}</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder={t('passwordPlaceholder')}
                    className="mt-2"
                    onChange={(e) => window.newPassword = e.target.value}
                  />
                </div>
                <Button
                  onClick={async () => {
                    const newPass = window.newPassword;
                    if (!newPass || newPass.length < 6) {
                      alert(t('passwordErrorLength'));
                      return;
                    }
                    try {
                      const { error } = await supabase.auth.updateUser({ password: newPass });
                      if (error) throw error;
                      alert(t('passwordSuccess'));
                    } catch (e) {
                      alert(t('passwordErrorGeneral') + e.message);
                    }
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white w-full"
                >
                  {t('passwordUpdateBtn')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Bell className="w-5 h-5 text-purple-600" />
                  {t('notificationsTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm md:text-base">{t('notificationsBrowserTitle')}</p>
                    <p className="text-xs md:text-sm text-gray-500">{t('notificationsBrowserDesc')}</p>
                  </div>
                  {notifications.push ? (
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                    />
                  ) : (
                    <Button
                      size="sm"
                      onClick={requestNotificationPermission}
                      className="bg-purple-500 hover:bg-purple-600 text-xs md:text-sm"
                    >
                      {t('notificationsActivateBtn')}
                    </Button>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm md:text-base">{t('notificationsEmailTitle')}</p>
                    <p className="text-xs md:text-sm text-gray-500">{t('notificationsEmailDesc')}</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm md:text-base">{t('notificationsFatwaTitle')}</p>
                    <p className="text-xs md:text-sm text-gray-500">{t('notificationsFatwaDesc')}</p>
                  </div>
                  <Switch
                    checked={notifications.fatwa_updates}
                    onCheckedChange={(checked) => handleNotificationChange('fatwa_updates', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm md:text-base">{t('notificationsContentTitle')}</p>
                    <p className="text-xs md:text-sm text-gray-500">{t('notificationsContentDesc')}</p>
                  </div>
                  <Switch
                    checked={notifications.new_content}
                    onCheckedChange={(checked) => handleNotificationChange('new_content', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm md:text-base">{t('notificationsLiveTitle')}</p>
                    <p className="text-xs md:text-sm text-gray-500">{t('notificationsLiveDesc')}</p>
                  </div>
                  <Switch
                    checked={notifications.live_streams}
                    onCheckedChange={(checked) => handleNotificationChange('live_streams', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm md:text-base">{t('notificationsMeetingsTitle')}</p>
                    <p className="text-xs md:text-sm text-gray-500">{t('notificationsMeetingsDesc')}</p>
                  </div>
                  <Switch
                    checked={notifications.scheduled_meetings}
                    onCheckedChange={(checked) => handleNotificationChange('scheduled_meetings', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <div className="space-y-4 md:space-y-6">
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    {darkMode ? <Moon className="w-5 h-5 text-indigo-600" /> : <Sun className="w-5 h-5 text-amber-500" />}
                    {t('appearanceTitle')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm md:text-base">{t('appearanceDarkMode')}</p>
                      <p className="text-xs md:text-sm text-gray-500">{t('appearanceDarkModeDesc')}</p>
                    </div>
                    <Switch
                      checked={darkMode}
                      onCheckedChange={handleDarkModeToggle}
                    />
                  </div>

                  <div>
                    <Label htmlFor="fontSize" className="flex items-center gap-2 mb-2 text-sm md:text-base">
                      <Type className="w-4 h-4" />
                      {t('appearanceFontSize')}
                    </Label>
                    <Select value={fontSize} onValueChange={handleFontSizeChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">{t('appearanceFontSmall')}</SelectItem>
                        <SelectItem value="medium">{t('appearanceFontMedium')}</SelectItem>
                        <SelectItem value="large">{t('appearanceFontLarge')}</SelectItem>
                        <SelectItem value="xlarge">{t('appearanceFontXLarge')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <Globe className="w-5 h-5 text-emerald-600" />
                    {t('appearanceLanguage')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languageOptions.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          <div className="flex items-center gap-2">
                            <span className="text-xl md:text-2xl">{lang.flag}</span>
                            <span className="text-sm md:text-base">{lang.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs md:text-sm text-gray-500 mt-2">
                    {t('appearanceLanguageReloadHint')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="interests">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Heart className="w-5 h-5 text-rose-600" />
                  {t('interestsTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6">
                  {t('interestsSubtitle')}
                </p>
                <InterestsSelector userEmail={user?.email} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-red-500 to-red-600 text-white mt-6 md:mt-8">
          <CardContent className="p-4 md:p-6">
            <Button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = '/';
              }}
              variant="ghost"
              className="w-full text-white hover:bg-white/20 hover:text-white text-sm md:text-base"
            >
              {t('settingsLogout')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}