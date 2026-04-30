import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Home, BookOpen, Heart, MessageSquare, Menu, User as UserIcon,
  Sparkles, Users, GraduationCap, Shield, Star, Settings, Radio, LogOut
} from "lucide-react";
import { useLanguage, LanguageProvider } from "@/contexts/LanguageContext";
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
  useSidebar, // استيراد الخطاف للتحكم في الحالة
} from "@/components/ui/sidebar";
import { supabase } from "@/components/api/supabaseClient";
import NotificationManager from "@/components/NotificationManager";
import { Toaster } from "@/components/ui/sonner";
import ChatWidget from "@/components/ChatWidget";
import ExternalLinksHandler from "@/components/ExternalLinksHandler";

// دوال البيانات المساعدة
const getBottomNavItems = (t) => [
  { titleKey: "الرئيسية", url: createPageUrl("Home"), icon: Home, color: "from-teal-500 to-teal-600" },
  { titleKey: "حسابي", url: createPageUrl("Profile"), icon: UserIcon, color: "from-purple-500 to-purple-600" },
];

export default function Layout({ children, currentPageName }) {
  return (
    <LanguageProvider>
      {/* SidebarProvider يجب أن يغلف المكون الذي يستخدم useSidebar */}
      <SidebarProvider defaultOpen={true}>
        <LayoutContent children={children} currentPageName={currentPageName} />
      </SidebarProvider>
    </LanguageProvider>
  );
}

function LayoutContent({ children, currentPageName }) {
  const { changeLanguage, language, t } = useLanguage();
  const location = useLocation();
  const { isMobile, setOpenMobile } = useSidebar(); // الوصول لحالة الجوال مباشرة

  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [isDarkMode, setIsDarkMode] = React.useState(localStorage.getItem("theme") === "dark");

  // إغلاق القائمة تلقائياً عند تغيير المسار (الحل الأنظف والأضمن)
  React.useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [location.pathname, isMobile, setOpenMobile]);

  // تعريف القوائم
  const navigationItems = React.useMemo(() => [
    { titleKey: t("home"), url: createPageUrl("Home"), icon: Home, color: "text-teal-600" },
    { titleKey: t("learn_islam"), url: createPageUrl("LearnIslam"), icon: BookOpen, color: "text-teal-600" },
    { titleKey: t("repentance"), url: createPageUrl("Repentance"), icon: Heart, color: "text-rose-600" },
    { titleKey: t("fatwa"), url: createPageUrl("Fatwa"), icon: MessageSquare, color: "text-emerald-600" },
    { titleKey: t("live_streams"), url: createPageUrl("LiveStreams"), icon: Radio, color: "text-red-600" },
    { titleKey: t("reconciliation"), url: createPageUrl("ReconciliationCommittee"), icon: Users, color: "text-cyan-600" },
    { titleKey: t("ai_guide"), url: createPageUrl("AIGuide"), icon: Sparkles, color: "text-emerald-600" },
    { titleKey: t("courses"), url: createPageUrl("Courses"), icon: GraduationCap, color: "text-teal-600" },
  ], [t]);

  const quickLinks = React.useMemo(() => [
    { titleKey: t("contact_scholar"), url: createPageUrl("ContactScholar"), icon: UserIcon, color: "text-emerald-600" },
    { titleKey: t("contact_preacher"), url: createPageUrl("ContactPreacher"), icon: Users, color: "text-teal-600" },
    { titleKey: t("contact_teacher"), url: createPageUrl("ContactTeacher"), icon: BookOpen, color: "text-purple-600" },
    { titleKey: t("quran_courses"), url: createPageUrl("QuranCourses"), icon: GraduationCap, color: "text-teal-600" },
    { titleKey: t("recommendations"), url: createPageUrl("Recommendations"), icon: Star, color: "text-purple-600" },
    { titleKey: t("settings"), url: createPageUrl("Settings"), icon: Settings, color: "text-gray-600" }
  ], [t]);

  const bottomNavItems = React.useMemo(() => getBottomNavItems(t), [t]);

  // Auth & Theme Logic
  React.useEffect(() => {
    loadUser();
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  const loadUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase.from('Profile').select('role').eq('user_id', authUser.id).single();
        let role = profile?.role || 'user';
        if (authUser.email === 'osakr100@gmail.com') role = 'admin';
        setUser({ ...authUser, role });
      }
    } catch (error) { console.log("Auth error"); } finally { setLoading(false); }
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <>
      <style>{`
        * { direction: rtl; text-align: right; }
        .dark { color-scheme: dark; }
      `}</style>

      <NotificationManager />
      <Toaster position="top-center" richColors />
      {/* <ChatWidget /> */}
      <ExternalLinksHandler />

      <div className="min-h-screen flex w-full bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-950 transition-colors duration-300">

        {/*Sidebar*/}
        <Sidebar side="right" className="border-r border-emerald-100 dark:border-emerald-900 dark:bg-gray-900">
          <SidebarHeader className="border-b border-emerald-100 dark:border-emerald-900 p-6 bg-gradient-to-br from-emerald-600 to-emerald-700 dark:from-emerald-900 dark:to-emerald-950">
            <Link to={createPageUrl("Home")} className="flex items-center gap-3">
              <img src="/icon-192.png" alt="Logo" className="w-12 h-12 rounded-full shadow-lg border-2 border-white/20" />
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
                      <SidebarMenuButton asChild className={`rounded-xl mb-2 ${location.pathname === item.url ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md' : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/50'}`}>
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3 w-full">
                          <item.icon className={`w-5 h-5 ${location.pathname === item.url ? 'text-white' : item.color}`} />
                          <span className="font-semibold text-base">{item.titleKey}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="px-4 py-2 text-sm font-semibold text-gray-500">{t("quick_links")}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {quickLinks.map((link) => (
                    <SidebarMenuItem key={link.titleKey}>
                      <SidebarMenuButton asChild className="hover:bg-emerald-50 rounded-xl mb-1">
                        <Link to={link.url} className="flex items-center gap-3 px-4 py-2 w-full">
                          <link.icon className={`w-4 h-4 ${link.color}`} />
                          <span className="text-sm">{link.titleKey}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Dashboard Links for Admin */}
            {!loading && (user?.role === 'admin' || user?.role === 'moderator') && (
              <SidebarGroup className="mt-6">
                <SidebarGroupLabel className="px-4 py-2 text-sm font-semibold text-red-500">{t("dashboard")}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild className={`rounded-xl ${location.pathname === createPageUrl("Admin") ? 'bg-red-500 text-white' : 'hover:bg-red-50'}`}>
                        <Link to={createPageUrl("Admin")} className="flex items-center gap-3 px-4 py-2 w-full">
                          <Shield className="w-4 h-4" />
                          <span className="text-sm">{t("content_management")}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

            {/* Footer buttons within Sidebar */}
            {user && (
              <div className="p-4 mt-auto border-t border-emerald-100 dark:border-emerald-900">
                <button onClick={toggleDarkMode} className="flex items-center gap-3 px-4 py-2 mb-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 rounded-xl w-full">
                  {isDarkMode ? "☀️ وضع النهار" : "🌙 وضع الليل"}
                </button>
                <button
                  onClick={async () => { await supabase.auth.signOut(); window.location.href = '/'; }}
                  className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl w-full"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-semibold text-sm">تسجيل الخروج</span>
                </button>
              </div>
            )}
          </SidebarContent>
        </Sidebar>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-h-screen w-full overflow-x-hidden">
          <header className="bg-white border-b border-emerald-100 px-4 py-4 block md:hidden shadow-sm">
            <div className="flex items-center justify-between">
              <SidebarTrigger className="hover:bg-emerald-50 p-5 rounded-lg z-50">
                <Menu className="w-10 h-10 text-emerald-700 z-50" />
              </SidebarTrigger>
              <div className="flex items-center gap-2">
                <img src="/icon-192.png" className="w-8 h-8" alt="Logo" />
                <h2 className="text-lg font-bold text-emerald-700">طريق النور</h2>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto pb-20 md:pb-16 w-full">
            {children}
          </div>

          {/* Bottom Nav Mobile */}
          <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-lg border-t border-gray-200 md:hidden">
            <div className="flex items-center justify-around px-2 py-1.5">
              {bottomNavItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <Link key={item.titleKey} to={item.url} className="flex flex-col items-center flex-1">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isActive ? `bg-gradient-to-br ${item.color} text-white` : 'text-gray-500'}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] mt-1">{item.titleKey}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </main>
      </div >
    </>
  );
}