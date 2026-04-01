import React, { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, Heart, FileText, Activity, Clock, ArrowRight, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/auth';
      return;
    }
    setUser(user);
  };

  // Fetch Statistics
  const { data: stats } = useQuery({
    queryKey: ['admin_dashboard_stats'],
    queryFn: async () => {
      const [
        { count: usersCount },
        { count: fatwaCount },
        { count: reconciliationCount },
        { count: contactCount },
        { count: learningPathsCount }
      ] = await Promise.all([
        supabase.from('Profile').select('*', { count: 'exact', head: true }),
        supabase.from('FatwaRequest').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('ReconciliationRequest').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('ContactRequest').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('UserLearningPath').select('*', { count: 'exact', head: true })
      ]);

      return {
        users: usersCount || 0,
        pendingFatwas: fatwaCount || 0,
        pendingReconciliations: reconciliationCount || 0,
        pendingContacts: contactCount || 0,
        activeLearningPaths: learningPathsCount || 0
      };
    },
    initialData: { users: 0, pendingFatwas: 0, pendingReconciliations: 0, pendingContacts: 0, activeLearningPaths: 0 }
  });

  // Fetch Recent Requests
  const { data: recentRequests } = useQuery({
    queryKey: ['recent_requests'],
    queryFn: async () => {
      const { data: fatwas } = await supabase
        .from('FatwaRequest')
        .select('id, question, created_date, status, name')
        .order('created_date', { ascending: false })
        .limit(3);
      
      const { data: reconciliations } = await supabase
        .from('ReconciliationRequest')
        .select('id, conflict_type, created_date, status, requester_name')
        .order('created_date', { ascending: false })
        .limit(3);

      return {
        fatwas: fatwas || [],
        reconciliations: reconciliations || []
      };
    },
    initialData: { fatwas: [], reconciliations: [] }
  });

  const statCards = [
    { 
      title: "المستخدمين النشطين", 
      value: stats.users, 
      icon: Users, 
      color: "text-blue-600", 
      bg: "bg-blue-100" 
    },
    { 
      title: "فتاوى معلقة", 
      value: stats.pendingFatwas, 
      icon: MessageSquare, 
      color: "text-amber-600", 
      bg: "bg-amber-100",
      alert: stats.pendingFatwas > 0
    },
    { 
      title: "طلبات صلح جديدة", 
      value: stats.pendingReconciliations, 
      icon: Heart, 
      color: "text-rose-600", 
      bg: "bg-rose-100",
      alert: stats.pendingReconciliations > 0
    },
    { 
      title: "مسارات تعلم", 
      value: stats.activeLearningPaths, 
      icon: Activity, 
      color: "text-purple-600", 
      bg: "bg-purple-100" 
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'قيد الانتظار';
      case 'completed': return 'مكتمل';
      case 'rejected': return 'مرفوض';
      case 'answered': return 'تمت الإجابة';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">لوحة القيادة</h1>
            <p className="text-gray-500 mt-1">نظرة عامة على نشاط المنصة والطلبات الواردة</p>
          </div>
          <Link to={createPageUrl("Admin")}>
            <Button variant="outline">
              إدارة المحتوى الكاملة <ArrowRight className="w-4 h-4 mr-2" />
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                      <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  {stat.alert && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 animate-pulse"></div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Fatwas */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-500" />
                أحدث طلبات الفتوى
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-amber-600">عرض الكل</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRequests.fatwas.length > 0 ? (
                  recentRequests.fatwas.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 font-bold text-sm">
                          {item.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 line-clamp-1">{item.question}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <Clock className="w-3 h-3" />
                            {new Date(item.created_date).toLocaleDateString('ar-SA')}
                            <span>•</span>
                            <span>{item.name}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">لا توجد طلبات حديثة</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Reconciliations */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                أحدث طلبات الصلح
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-rose-600">عرض الكل</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRequests.reconciliations.length > 0 ? (
                  recentRequests.reconciliations.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 font-bold text-sm">
                          {item.requester_name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 line-clamp-1">{item.conflict_type}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <Clock className="w-3 h-3" />
                            {new Date(item.created_date).toLocaleDateString('ar-SA')}
                            <span>•</span>
                            <span>{item.requester_name}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">لا توجد طلبات حديثة</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0">
            <CardContent className="p-6">
              <Activity className="w-8 h-8 mb-4 opacity-80" />
              <h3 className="text-lg font-bold mb-2">تقرير الأداء</h3>
              <p className="text-indigo-100 text-sm mb-4">عرض تقارير تفصيلية عن أداء المنصة وتفاعل المستخدمين</p>
              <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white border-0">
                عرض التقارير
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
            <CardContent className="p-6">
              <Users className="w-8 h-8 mb-4 opacity-80" />
              <h3 className="text-lg font-bold mb-2">إدارة المستخدمين</h3>
              <p className="text-emerald-100 text-sm mb-4">مراجعة حسابات المستخدمين والصلاحيات</p>
              <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white border-0">
                إدارة المستخدمين
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <FileText className="w-8 h-8 mb-4 opacity-80" />
              <h3 className="text-lg font-bold mb-2">المحتوى الجديد</h3>
              <p className="text-purple-100 text-sm mb-4">مراجعة ونشر المحتوى الجديد المقترح</p>
              <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white border-0">
                مراجعة المحتوى
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}