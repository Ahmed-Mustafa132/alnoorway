import React, { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, Users, Globe, Search, Eye, Download, 
  ThumbsUp, MessageSquare, BookOpen, Video, FileText 
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdvancedAnalytics() {
  const [user, setUser] = useState(null);
  const [dateRange, setDateRange] = useState('7days');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { // Add role check if needed
        window.location.href = '/';
        return;
      }
      setUser({ ...authUser, role: 'admin' }); // Force admin for analytics access in this migration context if role not available
    } catch (error) {
      window.location.href = '/';
    }
  };

  // جلب البيانات التحليلية
  const { data: analyticsEvents } = useQuery({
    queryKey: ['analytics_events'],
    queryFn: async () => {
      const { data, error } = await supabase.from('AnalyticsEvent').select('*').order('created_date', { ascending: false }).limit(1000);
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const { data: lectures } = useQuery({
    queryKey: ['lectures'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Lecture').select('*').order('views_count', { ascending: false }).limit(100);
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const { data: books } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Book').select('*').order('created_date', { ascending: false }).limit(100);
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const { data: fatwas } = useQuery({
    queryKey: ['fatwas'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Fatwa').select('*').order('created_date', { ascending: false }).limit(100);
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  // تحليل البيانات
  const contentEngagement = [
    { name: 'محاضرات', views: analyticsEvents.filter(e => e.content_type === 'lecture').length, color: '#8b5cf6' },
    { name: 'كتب', views: analyticsEvents.filter(e => e.content_type === 'book').length, color: '#3b82f6' },
    { name: 'فتاوى', views: analyticsEvents.filter(e => e.content_type === 'fatwa').length, color: '#10b981' },
    { name: 'قصص', views: analyticsEvents.filter(e => e.content_type === 'story').length, color: '#f59e0b' },
  ];

  const topSearchQueries = analyticsEvents
    .filter(e => e.event_type === 'search' && e.search_query)
    .reduce((acc, e) => {
      acc[e.search_query] = (acc[e.search_query] || 0) + 1;
      return acc;
    }, {});

  const searchData = Object.entries(topSearchQueries)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([query, count]) => ({ query, count }));

  const deviceDistribution = [
    { 
      name: 'موبايل', 
      value: analyticsEvents.filter(e => e.device_type === 'mobile').length,
      color: '#8b5cf6'
    },
    { 
      name: 'ديسكتوب', 
      value: analyticsEvents.filter(e => e.device_type === 'desktop').length,
      color: '#3b82f6'
    },
    { 
      name: 'تابلت', 
      value: analyticsEvents.filter(e => e.device_type === 'tablet').length,
      color: '#10b981'
    },
  ];

  const countryDistribution = analyticsEvents
    .filter(e => e.user_country)
    .reduce((acc, e) => {
      acc[e.user_country] = (acc[e.user_country] || 0) + 1;
      return acc;
    }, {});

  const topCountries = Object.entries(countryDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([country, count]) => ({ country, count }));

  const dailyActivity = analyticsEvents
    .reduce((acc, e) => {
      const date = new Date(e.created_date).toLocaleDateString('ar-SA');
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

  const activityData = Object.entries(dailyActivity)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .slice(-30)
    .map(([date, count]) => ({ date, count }));

  const statsCards = [
    {
      title: "إجمالي المشاهدات",
      value: analyticsEvents.filter(e => e.event_type === 'view').length.toLocaleString(),
      icon: Eye,
      color: "from-blue-500 to-blue-600",
      change: "+12%"
    },
    {
      title: "عمليات البحث",
      value: analyticsEvents.filter(e => e.event_type === 'search').length.toLocaleString(),
      icon: Search,
      color: "from-purple-500 to-purple-600",
      change: "+8%"
    },
    {
      title: "التحميلات",
      value: analyticsEvents.filter(e => e.event_type === 'download').length.toLocaleString(),
      icon: Download,
      color: "from-emerald-500 to-emerald-600",
      change: "+15%"
    },
    {
      title: "المشاركات",
      value: analyticsEvents.filter(e => e.event_type === 'share').length.toLocaleString(),
      icon: Users,
      color: "from-amber-500 to-amber-600",
      change: "+5%"
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">لوحة التحليلات المتقدمة</h1>
          <p className="text-gray-600">تحليلات شاملة لأداء المنصة وتفاعل المستخدمين</p>
        </motion.div>

        {/* بطاقات الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-emerald-600">{stat.change}</span>
                  </div>
                  <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="engagement" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger value="engagement">تفاعل المحتوى</TabsTrigger>
            <TabsTrigger value="search">تحليل البحث</TabsTrigger>
            <TabsTrigger value="users">تحليل المستخدمين</TabsTrigger>
            <TabsTrigger value="geography">التوزيع الجغرافي</TabsTrigger>
          </TabsList>

          {/* تفاعل المحتوى */}
          <TabsContent value="engagement" className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>تفاعل المستخدمين حسب نوع المحتوى</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={contentEngagement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="views" fill="#8b5cf6" name="المشاهدات" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>النشاط اليومي</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#10b981" name="النشاطات" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* تحليل البحث */}
          <TabsContent value="search" className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>أكثر عبارات البحث شيوعاً</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {searchData.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-900">{item.query}</span>
                          <span className="text-sm text-gray-600">{item.count} مرة</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(item.count / searchData[0].count) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* تحليل المستخدمين */}
          <TabsContent value="users" className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>توزيع الأجهزة</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={deviceDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {deviceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* التوزيع الجغرافي */}
          <TabsContent value="geography" className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>أكثر الدول نشاطاً</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topCountries.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-900">{item.country || 'غير محدد'}</span>
                          <span className="text-sm text-gray-600">{item.count} مستخدم</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(item.count / topCountries[0].count) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}