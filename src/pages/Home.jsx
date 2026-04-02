import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, Heart, MessageSquare, Users, Globe, Calendar, Library, Video, Search, User, Handshake } from "lucide-react";
import { supabase } from "@/components/api/supabaseClient";
import AIRecommendations from "@/components/AIRecommendations";
import { useLanguage } from "@/contexts/LanguageContext";

const verses = [
  { text: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", ref: "سورة الشرح - آية 6" },
  { text: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا", ref: "سورة الطلاق - آية 2" },
  { text: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", ref: "سورة الشرح - آية 5" },
  { text: "وَقُل رَّبِّ زِدْنِي عِلْمًا", ref: "سورة طه - آية 114" },
  { text: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", ref: "سورة البقرة - آية 153" },
  { text: "ادْعُونِي أَسْتَجِبْ لَكُمْ", ref: "سورة غافر - آية 60" },
  { text: "وَاللَّهُ خَيْرٌ حَافِظًا وَهُوَ أَرْحَمُ الرَّاحِمِينَ", ref: "سورة يوسف - آية 64" }
];

const hadiths = [
  { text: "إنما الأعمال بالنيات", ref: "رواه البخاري ومسلم" },
  { text: "خيركم من تعلم القرآن وعلمه", ref: "رواه البخاري" },
  { text: "الدين النصيحة", ref: "رواه مسلم" },
  { text: "من دعا إلى هدى كان له من الأجر مثل أجور من تبعه", ref: "رواه مسلم" }
];

const allQuotes = [...verses, ...hadiths];

export default function Home() {
  const { t } = useLanguage();
  const [randomQuote] = useState(() => allQuotes[Math.floor(Math.random() * allQuotes.length)]);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlineCount, setOnlineCount] = useState({ scholars: 0, preachers: 0, teachers: 0 });
  const [appSettings, setAppSettings] = useState({
    features: { azkar: true, library: true, lectures: true, stories: true, fatwas: true },
    languages: { ar: true, en: true, fr: true, ur: true }
  });
  const [user, setUser] = useState(null);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleOnline = () => { setIsOnline(true); loadData(); };
    const handleOffline = () => { setIsOnline(false); setIsLoading(false); };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    try {
      const saved = localStorage.getItem('appSettings');
      if (saved) setAppSettings(JSON.parse(saved));
    } catch (e) { }

    if (navigator.onLine) {
      loadData();
    } else {
      setIsLoading(false);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
      await loadOnlineCounts();
      if (data?.user) {
        trackEvent('view', 'page', 'home').catch(() => { });
      }
    } catch (e) {
      console.log('Home load error:', e);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const loadOnlineCounts = async () => {
    try {
      const [scholars, preachers, teachers] = await Promise.all([
        supabase.from('Scholar').select('*', { count: 'exact' }).eq('type', 'mufti').eq('is_available', true),
        supabase.from('Scholar').select('*', { count: 'exact' }).eq('type', 'preacher').eq('is_available', true),
        supabase.from('Scholar').select('*', { count: 'exact' }).eq('type', 'teacher').eq('is_available', true)
      ]);
      setOnlineCount({
        scholars: scholars?.count || 0,
        preachers: preachers?.count || 0,
        teachers: teachers?.count || 0
      });
    } catch (error) {
      console.log('Error loading online counts:', error);
      setOnlineCount({ scholars: 0, preachers: 0, teachers: 0 });
    }
  };

  const trackEvent = async (eventType, contentType, contentId) => {
    try {
      if (!navigator.onLine) return;
      const { data } = await supabase.auth.getUser();
      await supabase.from('AnalyticsEvent').insert({
        event_type: eventType,
        user_email: data?.user?.email || 'guest',
        content_type: contentType,
        content_id: contentId,
        device_type: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
      });
    } catch (error) {
      console.log('Analytics error:', error);
    }
  };

  const handleSearch = () => {
    if (!isOnline) return;
    if (searchQuery.trim()) {
      trackEvent('search', 'query', searchQuery).catch(() => { });
      window.location.href = createPageUrl("Search") + `?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const features = [
    {
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/v1769612733/learn_islam_w24ajs.png",
      title: t('learn_islam'),
      description: t('learn_islam_desc'),
      color: "from-teal-100 to-teal-200",
      link: createPageUrl("LearnIslam")
    },
    {
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/v1769612737/repentance_pqgrov.png",
      title: t('repentance'),
      description: t('repentance_desc'),
      color: "from-rose-100 to-rose-200",
      link: createPageUrl("Repentance")
    },
    {
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/v1769612644/fatwa_ay8xyw.png",
      title: t('fatwa'),
      description: t('fatwa_desc'),
      color: "from-emerald-100 to-emerald-200",
      link: createPageUrl("Fatwa"),
      onlineCount: onlineCount.scholars,
      countLabel: t('contact_scholar')
    },
    {
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/v1769612738/reconciliation_yq58qe.png",
      title: t('reconciliation'),
      description: t('reconciliation_desc'),
      color: "from-cyan-100 to-cyan-200",
      link: createPageUrl("ReconciliationCommittee")
    }
  ];

  const additionalFeatures = [
    {
      icon: BookOpen,
      title: t('quran_courses'),
      description: t('quran_courses_desc'),
      color: "from-teal-100 to-teal-200",
      iconColor: "text-teal-700",
      link: createPageUrl("QuranCourses"),
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/v1769612644/courses_kuv6yk.png",
      show: true,
      onlineCount: onlineCount.teachers,
      countLabel: t('contact_teacher')
    },
    {
      icon: Calendar,
      title: t('daily_azkar'),
      description: t('daily_azkar_desc'),
      color: "from-amber-100 to-amber-200",
      iconColor: "text-amber-700",
      link: createPageUrl("Azkar"),
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/v1769612644/azkar_xfmtkq.png",
      show: appSettings.features.azkar
    },
    {
      icon: Library,
      title: t('islamic_library'),
      description: t('islamic_library_desc'),
      color: "from-indigo-100 to-indigo-200",
      iconColor: "text-indigo-700",
      link: createPageUrl("Library"),
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/v1769612734/library_qeqidv.png",
      show: appSettings.features.library
    }
  ];

  const stats = [
    { icon: Users, value: "10,000+", label: t('happy_user') },
    { icon: BookOpen, value: "500+", label: t('lecture') },
    { icon: Globe, value: "50+", label: t('country') }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-700 via-teal-600 to-teal-800 p-4 md:p-6">
      {/* Offline Banner */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white text-center py-3 px-4 text-sm font-bold shadow-lg">
          ❌ لا يوجد اتصال بالإنترنت، تحقق من الشبكة وحاول مرة أخرى
        </div>
      )}

      <div className="max-w-7xl mx-auto" style={!isOnline ? { paddingTop: '52px' } : {}}>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-6">
            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-white font-medium">جاري التحميل...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && !isLoading && (
          <div className="text-center py-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 inline-block">
              <p className="text-white font-medium mb-2">حدث خطأ، حاول مرة أخرى</p>
              <button onClick={loadData} className="bg-white text-teal-700 px-5 py-2 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
                إعادة المحاولة
              </button>
            </div>
          </div>
        )}

        {/* Search and Join Team */}
        <div className="flex flex-col md:flex-row items-center gap-3 max-w-3xl mx-auto mb-8 pt-4">
          <div className="relative flex-1 w-full">
            <Input
              placeholder="ابحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pr-12 py-6 text-lg bg-white/95 backdrop-blur-sm rounded-full border-0 shadow-lg"
            />
            <button
              onClick={handleSearch}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-teal-600 hover:bg-teal-700 rounded-full flex items-center justify-center transition-colors"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
          </div>

          <Link to={createPageUrl("JoinTeam")} className="w-full md:w-auto">
            <Button
              className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg rounded-full px-8 py-6 text-lg whitespace-nowrap"
            >
              <Users className="w-5 h-5 ml-2" />
              {t('join_team')}
            </Button>
          </Link>
        </div>

        {/* AI Recommendations */}
        {user && <AIRecommendations userEmail={user.email} />}

        {/* الأقسام الرئيسية - 2 في الموبايل، 4 في الديسكتوب */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {features.map((feature, index) => (
            <Link key={index} to={feature.link} onClick={() => trackEvent('view', 'section', feature.title)}>
              <Card className={`group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br ${feature.color} overflow-hidden h-full hover:-translate-y-2 rounded-3xl relative flex flex-col`}>
                {feature.onlineCount > 0 && (
                  <div className="absolute top-2 left-2 z-10 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    {feature.onlineCount} {feature.countLabel}
                  </div>
                )}
                {/* To change image size, modify aspect ratio below (e.g. aspect-[16/9] for smaller height) */}
                <div className="w-full aspect-[7/8] overflow-hidden flex items-center justify-center">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-[90%] h-[90%] object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-4 md:p-6 text-center flex-1 flex flex-col justify-center">
                  <h3 className="text-base md:text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-[10px] md:text-xs text-gray-700 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* الأقسام الإضافية - 2 في الموبايل، 3 في الديسكتوب */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {additionalFeatures.filter(f => f.show).map((feature, index) => (
            <Link key={index} to={feature.link} onClick={() => trackEvent('view', 'section', feature.title)}>
              <Card className={`group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br ${feature.color} overflow-hidden h-full hover:-translate-y-2 rounded-3xl relative flex flex-col`}>
                {feature.onlineCount > 0 && (
                  <div className="absolute top-2 left-2 z-10 bg-teal-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    {feature.onlineCount} {feature.countLabel}
                  </div>
                )}
                {/* To change image size, modify aspect ratio below */}
                <div className="w-full aspect-[8/8] overflow-hidden flex items-center justify-center">
                  {feature.image ? (
                    <img src={feature.image} alt={feature.title} className="w-[90%] h-[90%] object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/30">
                      <feature.icon className={`w-16 h-16 ${feature.iconColor}`} />
                    </div>
                  )}
                </div>
                <CardContent className="p-4 md:p-6 text-center flex-1 flex flex-col justify-center">
                  <h3 className="text-sm md:text-base font-bold text-gray-800 mb-1">{feature.title}</h3>
                  <p className="text-xs text-gray-700 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* الإحصائيات - صف واحد */}
        <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl mb-8">
          <div className="flex flex-row justify-around items-center gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 md:w-10 md:h-10 text-amber-300 mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-amber-100 text-xs md:text-sm whitespace-nowrap">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* الآية/الحديث */}
        <div className="text-center">
          <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3 leading-relaxed">
              {randomQuote.text}
            </h2>
            <p className="text-amber-200 text-sm md:text-base">{randomQuote.ref}</p>
          </div>
        </div>
      </div>
    </div>
  );
}