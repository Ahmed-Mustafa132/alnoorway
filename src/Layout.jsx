import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, BookOpen, Heart, MessageSquare, Menu, Bell, User as UserIcon, Sparkles, Users, GraduationCap, Shield, Star, Settings, Radio, Globe, LogOut } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { supabase } from "@/components/api/supabaseClient";
import NotificationManager from "@/components/NotificationManager";
import { Toaster } from "@/components/ui/sonner";
import ChatWidget from "@/components/ChatWidget";
import ExternalLinksHandler from "@/components/ExternalLinksHandler";

// استخدام النصوص العربية مباشرة

const getBottomNavItems = (t) => [
  { titleKey: "الرئيسية", url: createPageUrl("Home"), icon: Home, color: "from-teal-500 to-teal-600" },
  { titleKey: "حسابي", url: createPageUrl("Profile"), icon: UserIcon, color: "from-purple-500 to-purple-600" },
];
export default function Layout({ children, currentPageName }) {
  return (
    <LanguageProvider><LayoutContent children={children} currentPageName={currentPageName} /></LanguageProvider>
  );
}
function LayoutContent({ children, currentPageName }) {
  const { changeLanguage, language, t } = useLanguage();
  const getNavigationItems = () => [
    { titleKey: t("home"), url: createPageUrl("Home"), icon: Home, color: "text-teal-600" },
    { titleKey: t("learn_islam"), url: createPageUrl("LearnIslam"), icon: BookOpen, color: "text-teal-600" },
    { titleKey: t("repentance"), url: createPageUrl("Repentance"), icon: Heart, color: "text-rose-600" },
    { titleKey: t("fatwa"), url: createPageUrl("Fatwa"), icon: MessageSquare, color: "text-emerald-600" },
    { titleKey: t("live_streams"), url: createPageUrl("LiveStreams"), icon: Radio, color: "text-red-600" },
    { titleKey: t("reconciliation"), url: createPageUrl("ReconciliationCommittee"), icon: Users, color: "text-cyan-600" },
    { titleKey: t("ai_guide"), url: createPageUrl("AIGuide"), icon: Sparkles, color: "text-emerald-600" },
    { titleKey: t("courses"), url: createPageUrl("Courses"), icon: GraduationCap, color: "text-teal-600" },
  ];

  const getQuickLinks = (t, user) => [
    { titleKey: t("contact_scholar"), url: createPageUrl("ContactScholar"), icon: UserIcon, color: "text-emerald-600" },
    { titleKey: t("contact_preacher"), url: createPageUrl("ContactPreacher"), icon: Users, color: "text-teal-600" },
    { titleKey: t("contact_teacher"), url: createPageUrl("ContactTeacher"), icon: BookOpen, color: "text-purple-600" },
    { titleKey: t("quran_courses"), url: createPageUrl("QuranCourses"), icon: GraduationCap, color: "text-teal-600" },
    { titleKey: t("recommendations"), url: createPageUrl("Recommendations"), icon: Star, color: "text-purple-600" },
    { titleKey: t("settings"), url: createPageUrl("Settings"), icon: Settings, color: "text-gray-600" }
  ];

  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [sidebarOpen, setSidebarOpen] = React.useState(window.innerWidth >= 768);

  // إنشاء القوائم باستخدام الترجمة
  const navigationItems = React.useMemo(() => getNavigationItems(t), [language]);
  const quickLinks = React.useMemo(() => getQuickLinks(t), [language]);
  const bottomNavItems = React.useMemo(() => getBottomNavItems(t), [language]);


  React.useEffect(() => {
    loadUser();
    registerServiceWorker();
  }, []);
  const loadUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase
          .from('Profile')
          .select('role')
          .eq('user_id', authUser.id)
          .single();

        // Emergency override for admin
        let role = profile?.role || 'user';
        if (authUser.email === 'osakr100@gmail.com') {
          role = 'admin';
        }

        setUser({ ...authUser, role });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log("User not logged in");
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({ ...session.user, role: 'user' });
      } else {
        setUser(null);
      }
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  const registerServiceWorker = async () => {
    // Detect iOS devices
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    // Detect if running in WebView (WKWebView for iOS)
    // Check for custom User-Agent or WebKit without Safari
    const isWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent) ||
      /TariqAlNoorApp\/iOS/.test(navigator.userAgent);

    // Disable Service Worker on iOS WebView for App Store compliance
    if (isIOS && isWebView) {
      console.log('Service Worker disabled on iOS WebView for App Store compliance');
      return;
    }

    // Enable Service Worker for web browsers and Android
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service Worker registered');
      } catch (error) {
        console.log('Service Worker registration failed:', error);
      }
    }
  };
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };
  const [isDarkMode, setIsDarkMode] = React.useState(localStorage.getItem("theme") === "dark");
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  return (
    <SidebarProvider defaultOpen={true} open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <style>{`
* { direction: rtl; text-align: right; }
:root {
--emerald: #059669;
--emerald-dark: #047857;
--gold: #D4AF37;
--gold-light: #F3E5AB;
}
.dark {
 color-scheme: dark;
}
`}</style>
      <NotificationManager />
      <Toaster position="top-center" richColors />
      <ChatWidget />
      <ExternalLinksHandler />
      <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#059669" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <div className="min-h-screen flex w-full bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950 transition-colors duration-300">
        <Sidebar side="right" className="border-r border-emerald-100 dark:border-emerald-900 dark:bg-gray-900">
          <SidebarHeader className="border-b border-emerald-100 dark:border-emerald-900 p-6 bg-gradient-to-br from-emerald-600 to-emerald-700 dark:from-emerald-900 dark:to-emerald-950">
            <Link to={createPageUrl("Home")} onClick={handleLinkClick} className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity">
              <img
                src="/icon-192.png"
                alt="طريق النور"
                className="w-12 h-12 rounded-full shadow-lg border-2 border-white/20"
              />
              <div>
                <h1 className="text-xl font-bold text-white drop-shadow-lg">طريق النور</h1>
                <p className="text-xs text-emerald-100">منصة إسلامية شاملة</p>
              </div>
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.titleKey}>
                      <SidebarMenuButton asChild className={`hover:bg-emerald-50 dark:hover:bg-emerald-900/50 dark:text-gray-200 transition-all duration-300 rounded-xl mb-2 ${location.pathname === item.url ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md' : ''}`}>
                        <Link to={item.url} onClick={handleLinkClick} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className={`w-5 h-5 ${location.pathname === item.url ? 'text-white' : item.color}`} />
                          <span className="font-semibold text-base">{t(item.titleKey)}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="px-4 py-2 text-sm font-semibold text-gray-500">
                {t("quick_links")}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {quickLinks.map((link) => (
                    <SidebarMenuItem key={link.titleKey}>
                      <SidebarMenuButton asChild className="hover:bg-emerald-50 transition-all duration-300 rounded-xl mb-1">
                        <Link to={link.url} onClick={handleLinkClick} className="flex items-center gap-3 px-4 py-2">
                          <link.icon className={`w-4 h-4 ${link.color}`} />
                          <span className="text-sm">{t(link.titleKey)}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {!loading && (user?.role === 'admin' || user?.role === 'moderator') && (
              <SidebarGroup className="mt-6">
                <SidebarGroupLabel className="px-4 py-2 text-sm font-semibold text-red-500">
                  {t("dashboard")}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className={`hover:bg-red-50 hover:text-red-700 transition-all duration-300 rounded-xl ${location.pathname === createPageUrl("Admin") ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md' : ''}`}>
                        <Link to={createPageUrl("Admin")} onClick={handleLinkClick} className="flex items-center gap-3 px-4 py-2">
                          <Shield className={`w-4 h-4 ${location.pathname === createPageUrl("Admin") ? 'text-white' : 'text-red-600'}`} />
                          <span className="text-sm">{t("content_management")}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className={`hover:bg-red-50 hover:text-red-700 transition-all duration-300 rounded-xl ${location.pathname === createPageUrl("AdvancedAnalytics") ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md' : ''}`}>
                        <Link to={createPageUrl("AdvancedAnalytics")} onClick={handleLinkClick} className="flex items-center gap-3 px-4 py-2">
                          <Sparkles className={`w-4 h-4 ${location.pathname === createPageUrl("AdvancedAnalytics") ? 'text-white' : 'text-red-600'}`} />
                          <span className="text-sm">{t("advanced_analytics")}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
            {user && (
              <div className="p-4 mt-auto border-t border-emerald-100 dark:border-emerald-900">
                <div className="flex gap-2 mb-2 flex-wrap">
                  <button
                    onClick={() => changeLanguage('ar')}
                    className={`flex-1 min-w-[60px] px-2 py-1.5 text-xs rounded-lg transition-all ${language === 'ar' ? 'bg-emerald-600 text-white font-bold shadow-md' : 'hover:bg-gray-50 text-gray-600 dark:hover:bg-gray-800 dark:text-gray-300'}`}
                  >
                    عربي
                  </button>
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`flex-1 min-w-[60px] px-2 py-1.5 text-xs rounded-lg transition-all ${language === 'en' ? 'bg-emerald-600 text-white font-bold shadow-md' : 'hover:bg-gray-50 text-gray-600 dark:hover:bg-gray-800 dark:text-gray-300'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage('fr')}
                    className={`flex-1 min-w-[60px] px-2 py-1.5 text-xs rounded-lg transition-all ${language === 'fr' ? 'bg-emerald-600 text-white font-bold shadow-md' : 'hover:bg-gray-50 text-gray-600 dark:hover:bg-gray-800 dark:text-gray-300'}`}
                  >
                    Français
                  </button>
                  <button
                    onClick={() => changeLanguage('ur')}
                    className={`flex-1 min-w-[60px] px-2 py-1.5 text-xs rounded-lg transition-all ${language === 'zh' ? 'bg-emerald-600 text-white font-bold shadow-md' : 'hover:bg-gray-50 text-gray-600 dark:hover:bg-gray-800 dark:text-gray-300'}`}
                  >
                    اردو
                  </button>
                </div>

                <button
                  onClick={toggleDarkMode}
                  className="flex items-center gap-3 px-4 py-2 mb-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl w-full transition-all duration-300"
                >
                  {isDarkMode ? <span className="flex items-center gap-3"><span className="text-xl">☀️</span> وضع النهار</span> : <span className="flex items-center gap-3"><span className="text-xl">🌙</span> وضع الليل</span>}
                </button>

                <button
                  onClick={async () => {
                    try {
                      await supabase.auth.signOut();
                    } catch (e) {
                      console.error("Logout error", e);
                    } finally {
                      window.location.href = '/';
                    }
                  }}
                  className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl w-full transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-semibold text-sm">تسجيل الخروج</span>
                </button>
              </div>
            )}
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 flex flex-col min-h-screen w-full overflow-x-hidden">
          <header className="bg-white border-b border-emerald-100 px-4 md:px-6 py-4 block md:hidden shadow-sm">
            <div className="flex items-center gap-4 justify-between max-w-full">
              <SidebarTrigger onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-emerald-50 p-2 rounded-lg transition-colors duration-200">
                <Menu className="w-6 h-6 text-emerald-700" />
              </SidebarTrigger>
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src="/icon-192.png"
                  alt="طريق النور"
                  className="w-8 h-8 flex-shrink-0"
                />
                <h2 className="text-lg md:text-xl font-bold text-emerald-700 truncate">طريق النور</h2>
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-auto pb-20 md:pb-16 w-full">
            {children}
          </div>
          <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-lg border-t border-gray-200 shadow-2xl md:hidden">
            <div className="flex items-center justify-around px-2 py-1.5 w-full max-w-full">
              {bottomNavItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <Link
                    key={item.titleKey}
                    to={item.url}
                    className="flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 flex-1 min-w-0 transition-all duration-200"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${isActive
                      ? `bg-gradient-to-br ${item.color} shadow-lg scale-105`
                      : 'bg-transparent hover:bg-gray-50'
                      }`}>
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    </div>
                    <span className={`text-[9px] font-medium truncate w-full text-center ${isActive ? 'text-gray-900' : 'text-gray-600'
                      }`}>
                      {t(item.titleKey)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6 text-center text-sm text-gray-600 dark:text-gray-300 hidden md:block">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-2">
                <Link to={createPageUrl("PrivacyPolicy")} className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:underline transition-colors">
                  {t('privacy_policy')}
                </Link>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <Link to={createPageUrl("TermsAndConditions")} className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:underline transition-colors">
                  {t('terms_and_conditions')}
                </Link>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <Link to={createPageUrl("CookiesPolicy")} className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:underline transition-colors">
                  {t('cookies_policy')}
                </Link>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <Link to={createPageUrl("ContactPreacher")} className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:underline transition-colors">
                  {t('contact')}
                </Link>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <Link to={createPageUrl("Support")} className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:underline transition-colors">
                  {t('support')}
                </Link>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <Link to={createPageUrl("DeleteAccount")} className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:underline transition-colors">
                  حذف الحساب | Delete Account
                </Link>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                © 2026 طريق النور - جميع الحقوق محفوظة / Tariq Al-Noor - All Rights Reserved
              </div>
            </div>
          </footer>
        </main>
      </div>
    </SidebarProvider>
  );
}