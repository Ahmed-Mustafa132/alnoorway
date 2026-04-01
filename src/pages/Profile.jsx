import React, { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut, Heart, BookOpen, Bell, Mail, Shield, Search, Sparkles, Video, FileText, Activity, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";

export default function Profile() {
  const { t, language, changeLanguage } = useLanguage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ lectures: 0, stories: 0, fatwas: 0 });
  const [interests, setInterests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser({ ...authUser, role: 'user' });
        
        // Load stats
        const { data: preferenceData } = await supabase
           .from('UserPreference')
           .select('*')
           .eq('user_email', authUser.email)
           .single();
           
        if (preferenceData) {
            setInterests(preferenceData.interested_topics || []);
            const history = preferenceData.view_history || [];
            setStats({
                lectures: history.filter(h => h.content_type === 'lecture').length,
                stories: history.filter(h => h.content_type === 'story').length,
                fatwas: 0 // Will fetch from FatwaRequest
            });
        }
        
        // Fetch fatwa requests count
        const { count: fatwaCount } = await supabase
            .from('FatwaRequest')
            .select('*', { count: 'exact' })
            .eq('email', authUser.email);
            
        setStats(prev => ({ ...prev, fatwas: fatwaCount || 0 }));
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
    setLoading(false);
  };

  const handleSavePreferences = async () => {
      if (!user) return;
      try {
          const { error } = await supabase.from('UserPreference').upsert({
              user_email: user.email,
              interested_topics: interests
          }, { onConflict: 'user_email' });
          
          if (error) throw error;
          alert(t('success'));
      } catch (e) {
          alert(t('error'));
      }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const menuItems = [
    { icon: Heart, label: "المفضلة", color: "from-red-400 to-red-600", link: createPageUrl("Favorites") },
    { icon: Search, label: "البحث", color: "from-indigo-400 to-indigo-600", link: createPageUrl("Search") },
    { icon: Settings, label: "الإعدادات", color: "from-gray-400 to-gray-600", link: createPageUrl("Settings") },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-800 p-6 md:p-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-800">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-12 md:py-16 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">الحساب الشخصي</span>
          </div>
          
          <div className="w-20 h-20 md:w-28 md:h-28 mx-auto mb-4 md:mb-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
            <User className="w-10 h-10 md:w-14 md:h-14" />
          </div>
          {user ? (
            <>
              <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-3">
                {user.email ? user.email.split('@')[0] : "User"}
              </h1>
              <p className="text-purple-100 text-base md:text-lg mb-2">{user.email}</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl md:text-4xl font-bold mb-3">{t('login')}</h1>
            </>
          )}
        </div>
      </motion.div>

      {user ? (
        <div className="max-w-3xl mx-auto px-4 py-6 md:py-8">
          {/* Statistics Section */}
          <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 px-2">{t('statistics')}</h2>
              <div className="grid grid-cols-3 gap-4">
                  <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm rounded-2xl">
                      <CardContent className="p-4 text-center">
                          <Video className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                          <h3 className="text-2xl font-bold text-gray-900">{stats.lectures}</h3>
                          <p className="text-xs text-gray-500">{t('watched_lectures')}</p>
                      </CardContent>
                  </Card>
                  <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm rounded-2xl">
                      <CardContent className="p-4 text-center">
                          <BookOpen className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                          <h3 className="text-2xl font-bold text-gray-900">{stats.stories}</h3>
                          <p className="text-xs text-gray-500">{t('read_stories')}</p>
                      </CardContent>
                  </Card>
                  <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm rounded-2xl">
                      <CardContent className="p-4 text-center">
                          <FileText className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                          <h3 className="text-2xl font-bold text-gray-900">{stats.fatwas}</h3>
                          <p className="text-xs text-gray-500">{t('asked_fatwas')}</p>
                      </CardContent>
                  </Card>
              </div>
          </div>

          {/* Preferences Section */}
          <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 px-2">{t('edit_preferences')}</h2>
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm rounded-3xl">
                  <CardContent className="p-6 space-y-4">
                      <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">اللغة المفضلة</label>
                          <Select value={language} onValueChange={changeLanguage}>
                             <SelectTrigger>
                                 <SelectValue />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectItem value="ar">العربية</SelectItem>
                                 <SelectItem value="en">English</SelectItem>
                                 <SelectItem value="fr">Français</SelectItem>
                                 <SelectItem value="ur">Urdu</SelectItem>
                             </SelectContent>
                          </Select>
                      </div>
                      
                      <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">{t('interests')}</label>
                          <div className="flex flex-wrap gap-2">
                              {['quran', 'hadith', 'fiqh', 'tafsir', 'aqeedah', 'seerah', 'azkar'].map(topic => (
                                  <button
                                      key={topic}
                                      onClick={() => {
                                          if (interests.includes(topic)) {
                                              setInterests(interests.filter(i => i !== topic));
                                          } else {
                                              setInterests([...interests, topic]);
                                          }
                                      }}
                                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                                          interests.includes(topic) 
                                          ? 'bg-purple-600 text-white' 
                                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                      }`}
                                  >
                                      {topic}
                                  </button>
                              ))}
                          </div>
                      </div>

                      <Button onClick={handleSavePreferences} className="w-full bg-purple-600 hover:bg-purple-700">
                          <Save className="w-4 h-4 mr-2" />
                          {t('save_changes')}
                      </Button>
                  </CardContent>
              </Card>
          </div>

          {/* User Info & Menu Items */}
          <div className="grid md:grid-cols-2 gap-4 mb-6 md:mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm rounded-3xl h-full">
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('email')}</p>
                      <p className="font-semibold text-gray-900 text-sm md:text-base">{user.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm rounded-3xl h-full">
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('account_type')}</p>
                      <p className="font-semibold text-gray-900 text-sm md:text-base">
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Logout Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="outline"
              className="w-full py-5 md:py-6 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 text-base md:text-lg bg-white/95 backdrop-blur-sm rounded-2xl"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 ml-2" />
              {t('logout')}
            </Button>
          </motion.div>
        </div>
      ) : (
        <div className="max-w-md mx-auto px-4 py-8 md:py-12 text-center">
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl">
            <CardContent className="p-8 md:p-12">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                غير مسجل دخول
              </h3>
              <p className="text-gray-600 mb-8">
                يرجى تسجيل الدخول للوصول إلى حسابك وميزاته
              </p>
              <Link to="/auth">
                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 py-5 md:py-6 text-base md:text-lg rounded-2xl"
                >
                  تسجيل الدخول
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}