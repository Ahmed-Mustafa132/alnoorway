import React, { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Shield, BookOpen, Video, MessageSquare, Users, Heart, Building2, GraduationCap, Calendar, Eye, ThumbsUp, MessageCircleMore, Star, TrendingUp, Activity, Upload, Sparkles } from "lucide-react";
import AdminTable from "@/components/AdminTable";
import AppSettingsAdmin from "@/components/AppSettingsAdmin";
import BulkUploadModal from "@/components/BulkUploadModal";
import UsersManagement from "@/components/UsersManagement";
import CourseManager from "@/components/admin/CourseManager";
import FatwaModeration from "@/components/admin/FatwaModeration";
import CommentsModeration from "@/components/admin/CommentsModeration";
import AIContentGenerator from "@/components/admin/AIContentGenerator";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Admin() {
  const { t } = useLanguage();

  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("analytics");
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkUploadEntity, setBulkUploadEntity] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      // 1. التحقق من تسجيل الدخول
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError || !authUser) {
        console.error('User not authenticated:', authError);
        window.location.href = '/auth';
        return;
      }

      // 2. جلب الصلاحية من جدول Profile
      const { data: profileData, error: profileError } = await supabase
        .from('Profile')
        .select('role')
        .eq('user_id', authUser.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        window.location.href = '/';
        return;
      }

      // 3. التحقق من صلاحية Admin أو Moderator
      if (profileData?.role !== 'admin' && profileData?.role !== 'moderator') {
        console.warn('Access denied: User is not admin or moderator');
        window.location.href = '/unauthorized';
        return;
      }

      // 4. حفظ بيانات المستخدم
      setUser({ ...authUser, role: profileData.role });


    } catch (error) {
      console.error("Error loading user:", error);
      window.location.href = '/';
    }
  };

  const { data: lectures } = useQuery({
    queryKey: ['admin_lectures'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Lecture').select('*');
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const { data: stories } = useQuery({
    queryKey: ['admin_stories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Story').select('*');
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const { data: fatwas } = useQuery({
    queryKey: ['admin_fatwas'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Fatwa').select('*');
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const { data: comments } = useQuery({
    queryKey: ['admin_comments'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Comment').select('*');
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const { data: ratings } = useQuery({
    queryKey: ['admin_ratings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Rating').select('*');
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const { data: liveStreams } = useQuery({
    queryKey: ['admin_live_streams'],
    queryFn: async () => {
      const { data, error } = await supabase.from('LiveStream').select('*');
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const { data: users } = useQuery({
    queryKey: ['admin_users'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('Profile').select('*');
        if (error) return [];
        return data;
      } catch (e) {
        return [];
      }
    },
    initialData: [],
  });

  const { data: searchTerms } = useQuery({
    queryKey: ['search_analytics'],
    queryFn: async () => {
      // هنا يمكن إضافة entity لتتبع عمليات البحث
      return [];
    },
    initialData: [],
  });

  const totalViews = lectures.reduce((sum, l) => sum + (l.views_count || 0), 0);
  const totalLikes = lectures.reduce((sum, l) => sum + (l.likes_count || 0), 0);
  const totalShares = lectures.reduce((sum, l) => sum + (l.shares_count || 0), 0);
  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : 0;
  const pendingComments = comments.filter(c => !c.is_approved).length;
  const upcomingStreams = liveStreams.filter(s => !s.is_live && new Date(s.scheduled_time) > new Date()).length;
  const liveNow = liveStreams.filter(s => s.is_live).length;

  // محتوى الأسبوع الماضي
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const lecturesThisWeek = lectures.filter(l => new Date(l.created_date) > lastWeek).length;
  const storiesThisWeek = stories.filter(s => new Date(s.created_date) > lastWeek).length;
  const fatwasThisWeek = fatwas.filter(f => new Date(f.created_date) > lastWeek).length;

  // أكثر المحاضرات مشاهدة
  const topLectures = [...lectures]
    .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
    .slice(0, 5);

  const exportToText = () => {
    const report = `
تقرير إحصائيات طريق النور
تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}

=================================
الإحصائيات الرئيسية
=================================
إجمالي المستخدمين: ${users.length}
المشاهدات: ${totalViews.toLocaleString()}
الإعجابات: ${totalLikes.toLocaleString()}
التعليقات: ${comments.length}
متوسط التقييم: ${averageRating.toFixed(1)}/5
المشاركات: ${totalShares.toLocaleString()}

=================================
إحصائيات المحتوى
=================================
المحاضرات: ${lectures.length}
القصص: ${stories.length}
الفتاوى: ${fatwas.length}
البثوث المباشرة: ${liveStreams.length}

=================================
معلومات سريعة
=================================
التعليقات المعلقة: ${pendingComments}
بث مباشر الآن: ${liveNow}
بثوث قادمة: ${upcomingStreams}
`;

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tariq-alnoor-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleBulkUpload = (entityType) => {
    setBulkUploadEntity(entityType);
    setShowBulkUpload(true);
  };

  const statsCards = [
    { title: t("total_users"), value: users.length, icon: Users, color: "from-blue-500 to-blue-600" },
    { title: t("total_views"), value: totalViews.toLocaleString(), icon: Eye, color: "from-purple-500 to-purple-600" },
    { title: t("total_likes"), value: totalLikes.toLocaleString(), icon: ThumbsUp, color: "from-rose-500 to-rose-600" },
    { title: t("total_comments"), value: comments.length, icon: MessageCircleMore, color: "from-emerald-500 to-emerald-600" },
    { title: t("average_rating"), value: averageRating.toFixed(1) + "/5", icon: Star, color: "from-amber-500 to-amber-600" },
    { title: t("total_shares"), value: totalShares.toLocaleString(), icon: TrendingUp, color: "from-cyan-500 to-cyan-600" },
  ];

  const contentStats = [
    { title: t("lectures"), count: lectures.length, icon: Video, color: "bg-purple-100 text-purple-700" },
    { title: t("stories"), count: stories.length, icon: Heart, color: "bg-rose-100 text-rose-700" },
    { title: t("fatwas"), count: fatwas.length, icon: MessageSquare, color: "bg-emerald-100 text-emerald-700" },
    { title: t("live_streams"), count: liveStreams.length, icon: Activity, color: "bg-red-100 text-red-700" },
  ];

  const sections = [
    {
      id: "ai_generation",
      title: t("ai_content_generation"),
      icon: Sparkles,
      component: AIContentGenerator
    },
    {
      id: "books",
      title: t("books"),
      icon: BookOpen,
      entity: "Book",
      supportsBulkUpload: true,
      fields: [
        { key: "title", label: t("title"), type: "text", required: true },
        { key: "author", label: t("author"), type: "text", required: true },
        { key: "description", label: t("description"), type: "textarea" },
        {
          key: "category",
          label: t("category"),
          type: "select",
          options: [
            { value: "hadith", label: t("hadith") },
            { value: "tafsir", label: t("tafsir") },
            { value: "fiqh", label: t("fiqh") },
            { value: "azkar", label: t("azkar") },
            { value: "seerah", label: t("seerah") },
            { value: "general", label: t("general") }
          ],
          required: true
        },
        { key: "language", label: t("language"), type: "text" },
        { key: "pages", label: t("pages"), type: "number" },
        { key: "cover_url", label: t("cover_url"), type: "text" },
        { key: "pdf_url", label: t("pdf_url"), type: "text" },
        { key: "content", label: t("content"), type: "textarea" },
      ]
    },
    {
      id: "courses_management",
      title: t("courses_management"),
      icon: GraduationCap,
      component: CourseManager
    },
    {
      id: "lectures",
      title: t("lectures"),
      icon: Video,
      entity: "Lecture",
      supportsBulkUpload: true,
      fields: [
        { key: "title", label: t("title"), type: "text", required: true },
        { key: "speaker", label: t("speaker"), type: "text", required: true },
        { key: "description", label: t("description"), type: "textarea" },
        {
          key: "type",
          label: t("type"),
          type: "select",
          options: [
            { value: "audio", label: t("audio") },
            { value: "video", label: t("video") }
          ],
          required: true
        },
        {
          key: "category",
          label: t("category"),
          type: "select",
          options: [
            { value: "learn_islam", label: t("learn_islam") },
            { value: "repentance", label: t("repentance") },
            { value: "general", label: t("general") }
          ],
          required: true
        },
        { key: "topic", label: t("topic"), type: "text" },
        { key: "url", label: t("url"), type: "text" },
        { key: "duration", label: t("duration"), type: "text" },
        { key: "thumbnail_url", label: t("thumbnail_url"), type: "text" },
      ]
    },
    {
      id: "stories",
      title: t("stories"),
      icon: Heart,
      entity: "Story",
      supportsBulkUpload: true,
      fields: [
        { key: "title", label: t("title"), type: "text", required: true },
        { key: "author", label: t("author"), type: "text" },
        { key: "content", label: t("content"), type: "textarea", required: true },
        {
          key: "category",
          label: t("category"),
          type: "select",
          options: [
            { value: "convert", label: t("convert_stories") },
            { value: "repentance", label: t("repentance_stories") }
          ],
          required: true
        },
        { key: "excerpt", label: t("excerpt"), type: "text" },
        { key: "image_url", label: t("image_url"), type: "text" },
        { key: "country", label: t("country"), type: "text" },
      ]
    },
    {
      id: "fatwas",
      title: t("fatwas"),
      icon: MessageSquare,
      entity: "Fatwa",
      supportsBulkUpload: true,
      fields: [
        { key: "question", label: t("question"), type: "text", required: true },
        { key: "answer", label: t("answer"), type: "textarea", required: true },
        { key: "mufti", label: t("mufti_name"), type: "text" },
        { key: "category", label: t("category"), type: "text", required: true },
        { key: "reference", label: t("reference"), type: "text" },
      ]
    },
    {
      id: "fatwa_moderation",
      title: t("fatwa_moderation"),
      icon: Shield,
      component: FatwaModeration
    },
    {
      id: "comments_moderation",
      title: t("comments_moderation"),
      icon: MessageCircleMore,
      component: CommentsModeration
    },
    {
      id: "users_management",
      title: t("users_management"),
      icon: Users,
      component: UsersManagement
    },
    {
      id: "islamic_centers",
      title: t("islamic_centers"),
      icon: Building2,
      entity: "IslamicCenter",
      supportsBulkUpload: true,
      fields: [
        { key: "name", label: t("name"), type: "text", required: true },
        { key: "city", label: t("city"), type: "text", required: true },
        { key: "country", label: t("country"), type: "text", required: true },
        { key: "address", label: t("address"), type: "text" },
        { key: "phone", label: t("phone"), type: "text" },
        { key: "email", label: t("email"), type: "text" },
        { key: "latitude", label: t("latitude"), type: "number" },
        { key: "longitude", label: t("longitude"), type: "number" },
      ]
    },
    {
      id: "scholars",
      title: t("scholars"),
      icon: Users,
      entity: "Scholar",
      supportsBulkUpload: true,
      fields: [
        { key: "name", label: t("name"), type: "text", required: true },
        {
          key: "type",
          label: t("type"),
          type: "select",
          options: [
            { value: "mufti", label: t("mufti") },
            { value: "preacher", label: t("preacher") },
            { value: "teacher", label: t("teacher") },
            { value: "scholar", label: t("scholar") }
          ],
          required: true
        },
        { key: "specialization", label: t("specialization"), type: "text" },
        { key: "country", label: t("country"), type: "text" },
        { key: "phone", label: t("phone"), type: "text" },
        { key: "whatsapp", label: t("whatsapp"), type: "text" },
        { key: "bio", label: t("bio"), type: "textarea" },
      ]
    },
    {
      id: "app_settings",
      title: t("app_settings"),
      icon: Sparkles,
      component: AppSettingsAdmin
    }
  ];

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
        <p className="text-gray-500">{t("loading")}</p>
      </div>
    );
  }

  // تصفية الأقسام للمشرفين (Moderators)
  const allowedSectionsForModerator = ['comments_moderation', 'fatwa_moderation', 'lectures', 'stories'];
  const filteredSections = user.role === 'admin'
    ? sections
    : sections.filter(s => allowedSectionsForModerator.includes(s.id));

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2"> {t("dashboard")}</h1>
            <p className="text-gray-500">{t("hello")} {user.email}، {t("you_have_permission")} {user.role === 'admin' ? t("admin") : t("moderator")}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportToText}>
              <Upload className="w-4 h-4 ml-2" />
              {t("export_report")}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white p-1 border shadow-sm w-full md:w-auto overflow-x-auto justify-start h-auto">
            <TabsTrigger value="analytics" className="px-6 py-2.5">
              <Activity className="w-4 h-4 ml-2" />
              {t("analyses")}
            </TabsTrigger>
            {filteredSections.map(section => (
              <TabsTrigger key={section.id} value={section.id} className="px-6 py-2.5">
                <section.icon className="w-4 h-4 ml-2" />
                {section.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {statsCards.map((stat, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-all border-0 shadow-md">
                  <div className={`h-2 bg-gradient-to-r ${stat.color}`}></div>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                      <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                    </div>
                    <div className={`p-4 rounded-full bg-gray-50 text-gray-600`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">{t("content_statistics")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contentStats.map((stat, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${stat.color}`}>
                            <stat.icon className="w-5 h-5" />
                          </div>
                          <span className="font-medium">{stat.title}</span>
                        </div>
                        <span className="font-bold text-lg">{stat.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">{t("top_lectures")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topLectures.map((lecture, index) => (
                      <div key={lecture.id} className="flex items-center gap-4">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm line-clamp-1">{lecture.title}</h4>
                          <p className="text-xs text-gray-500">{lecture.speaker}</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-600">
                          {lecture.views_count || 0}
                        </span>
                      </div>
                    ))}
                    {topLectures.length === 0 && (
                      <p className="text-center text-gray-500 py-4">{t("no_enough_data")}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {filteredSections.map(section => (
            <TabsContent key={section.id} value={section.id}>
              {section.component ? (
                <section.component />
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <section.icon className="w-6 h-6" />
                      {t("manage")} {section.title}
                    </h2>
                    {section.supportsBulkUpload && (
                      <Button onClick={() => handleBulkUpload(section.entity)} variant="outline">
                        <Upload className="w-4 h-4 ml-2" />
                        {t("bulk_upload")} (Excel)
                      </Button>
                    )}
                  </div>
                  <AdminTable
                    entity={section.entity}
                    fields={section.fields}
                    title={section.title}
                  />
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {showBulkUpload && (
          <BulkUploadModal
            entityName={bulkUploadEntity}
            isOpen={showBulkUpload}
            onClose={() => setShowBulkUpload(false)}
          />
        )}
      </div>
    </div>
  );
}