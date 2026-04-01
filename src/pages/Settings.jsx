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

export default function Settings() {
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
      alert('تم حفظ التغييرات بنجاح');
      loadUser();
    },
    onError: (error) => {
        console.log("Error updating user:", error);
        alert('حدث خطأ أثناء حفظ التغييرات');
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
        alert('تم تفعيل الإشعارات بنجاح');
      } else {
        alert('لم يتم منح إذن الإشعارات');
      }
    }
  };

  const languageOptions = [
    { value: 'ar', label: 'العربية', flag: '🇸🇦' },
    { value: 'en', label: 'English', flag: '🇬🇧' },
    { value: 'fr', label: 'Français', flag: '🇫🇷' },
    { value: 'ur', label: 'اردو', flag: '🇵🇰' },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 md:p-6 flex items-center justify-center">
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl max-w-md w-full mx-4">
          <CardContent className="p-6 md:p-12 text-center">
            <SettingsIcon className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
              يرجى تسجيل الدخول
            </h3>
            <p className="text-gray-600 mb-8 text-sm md:text-base">
              سجل الدخول للوصول إلى إعداداتك
            </p>
            <button
              onClick={() => window.location.href = '/auth'}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 py-4 md:py-6 text-base md:text-lg rounded-2xl text-white font-semibold"
            >
              تسجيل الدخول
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <Breadcrumb items={[{ label: "الإعدادات" }]} />
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
            الإعدادات
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 px-4">
            تخصيص تجربتك في التطبيق
          </p>
        </motion.div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 md:mb-8">
            <TabsTrigger value="profile" className="text-xs md:text-sm">الحساب</TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs md:text-sm">الإشعارات</TabsTrigger>
            <TabsTrigger value="appearance" className="text-xs md:text-sm">المظهر</TabsTrigger>
            <TabsTrigger value="interests" className="text-xs md:text-sm">الاهتمامات</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <User className="w-5 h-5 text-blue-600" />
                  معلومات الحساب
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm md:text-base">الاسم الكامل</Label>
                  <Input
                    id="name"
                    value={user?.full_name || ''}
                    onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm md:text-base">البريد الإلكتروني</Label>
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
                  {updateUserMutation.isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl text-red-600">
                  <Shield className="w-5 h-5" />
                  تغيير كلمة المرور
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="أدخل كلمة المرور الجديدة"
                    className="mt-2"
                    onChange={(e) => window.newPassword = e.target.value}
                  />
                </div>
                <Button
                  onClick={async () => {
                     const newPass = window.newPassword;
                     if (!newPass || newPass.length < 6) {
                        alert("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
                        return;
                     }
                     try {
                        const { error } = await supabase.auth.updateUser({ password: newPass });
                        if (error) throw error;
                        alert("تم تحديث كلمة المرور بنجاح");
                     } catch(e) {
                        alert("خطأ في تحديث كلمة المرور: " + e.message);
                     }
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white w-full"
                >
                  تحديث كلمة المرور
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Bell className="w-5 h-5 text-purple-600" />
                  إعدادات الإشعارات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm md:text-base">إشعارات المتصفح</p>
                    <p className="text-xs md:text-sm text-gray-500">تلقي إشعارات في المتصفح</p>
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
                      تفعيل
                    </Button>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm md:text-base">إشعارات البريد الإلكتروني</p>
                    <p className="text-xs md:text-sm text-gray-500">تلقي الإشعارات عبر البريد</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm md:text-base">تحديثات الفتاوى</p>
                    <p className="text-xs md:text-sm text-gray-500">إشعار عند الرد على فتواك</p>
                  </div>
                  <Switch
                    checked={notifications.fatwa_updates}
                    onCheckedChange={(checked) => handleNotificationChange('fatwa_updates', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm md:text-base">محتوى جديد</p>
                    <p className="text-xs md:text-sm text-gray-500">إشعار عند إضافة محتوى جديد</p>
                  </div>
                  <Switch
                    checked={notifications.new_content}
                    onCheckedChange={(checked) => handleNotificationChange('new_content', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm md:text-base">البث المباشر</p>
                    <p className="text-xs md:text-sm text-gray-500">إشعار عند بدء بث مباشر</p>
                  </div>
                  <Switch
                    checked={notifications.live_streams}
                    onCheckedChange={(checked) => handleNotificationChange('live_streams', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm md:text-base">مواعيد اللقاءات</p>
                    <p className="text-xs md:text-sm text-gray-500">تذكير بمواعيد اللقاءات المجدولة</p>
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
                    إعدادات المظهر
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm md:text-base">الوضع الليلي</p>
                      <p className="text-xs md:text-sm text-gray-500">تفعيل المظهر الداكن</p>
                    </div>
                    <Switch
                      checked={darkMode}
                      onCheckedChange={handleDarkModeToggle}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="fontSize" className="flex items-center gap-2 mb-2 text-sm md:text-base">
                      <Type className="w-4 h-4" />
                      حجم الخط
                    </Label>
                    <Select value={fontSize} onValueChange={handleFontSizeChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">صغير</SelectItem>
                        <SelectItem value="medium">متوسط</SelectItem>
                        <SelectItem value="large">كبير</SelectItem>
                        <SelectItem value="xlarge">كبير جداً</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <Globe className="w-5 h-5 text-emerald-600" />
                    اللغة
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
                    سيتم إعادة تحميل التطبيق عند تغيير اللغة
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
                  إدارة الاهتمامات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs md:text-sm text-gray-600 mb-4 md:mb-6">
                  اختر المواضيع التي تهمك لتحصل على توصيات أفضل
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
              تسجيل الخروج
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}