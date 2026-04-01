import React, { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, Trash2, BellOff, Video, BookOpen, MessageSquare, Calendar, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

export default function Notifications() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser({ ...authUser, role: 'user' });
      }
    } catch (error) {
      console.log("User not logged in");
    } finally {
      setLoading(false);
    }
  };

  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ['notifications', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const { data, error } = await supabase.from('Notification').select('*').eq('user_email', user.email).order('created_date', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    initialData: [],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('Notification').update({ is_read: true }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.email] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('Notification').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.email] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('Notification').update({ is_read: true }).eq('user_email', user?.email);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.email] });
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('Notification').delete().eq('user_email', user?.email);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.email] });
    },
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'live_stream': return Video;
      case 'new_content': return BookOpen;
      case 'comment_reply': return MessageSquare;
      default: return Bell;
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading || notificationsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-700 via-amber-600 to-orange-800 p-6 md:p-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-700 via-amber-600 to-orange-800 p-4 md:p-6">
        <div className="max-w-2xl mx-auto pt-12">
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl">
            <CardContent className="p-8 md:p-12 text-center">
              <BellOff className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                يرجى تسجيل الدخول
              </h3>
              <p className="text-gray-600 mb-8">
                سجل الدخول لمشاهدة إشعاراتك
              </p>
              <Link to="/auth">
                <Button
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 py-5 md:py-6 px-8 md:px-10 text-base md:text-lg rounded-2xl"
                >
                  تسجيل الدخول
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-700 via-amber-600 to-orange-800 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 md:mb-8 pt-4"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-3 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span className="text-amber-800 font-semibold">الإشعارات</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            إشعاراتك
          </h1>
          
          {unreadCount > 0 && (
            <p className="text-base md:text-lg text-white/90">
              لديك {unreadCount} إشعار غير مقروء
            </p>
          )}
        </motion.div>

        {notifications.length > 0 && (
          <div className="flex flex-wrap gap-2 md:gap-3 mb-6 justify-center">
            <Button
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={unreadCount === 0 || markAllAsReadMutation.isPending}
              variant="outline"
              className="bg-white/95 backdrop-blur-sm hover:bg-white text-sm md:text-base rounded-2xl"
            >
              <CheckCircle className="w-4 h-4 ml-2" />
              تعليم الكل كمقروء
            </Button>
            <Button
              onClick={() => deleteAllMutation.mutate()}
              disabled={deleteAllMutation.isPending}
              variant="outline"
              className="bg-white/95 backdrop-blur-sm hover:bg-white text-red-600 border-red-200 text-sm md:text-base rounded-2xl"
            >
              <Trash2 className="w-4 h-4 ml-2" />
              حذف الكل
            </Button>
          </div>
        )}

        <div className="space-y-3 md:space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => {
              const Icon = getNotificationIcon(notification.type);
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`border-0 shadow-lg hover:shadow-xl transition-all ${
                    notification.is_read ? 'bg-white/90' : 'bg-white/95'
                  } backdrop-blur-sm rounded-3xl`}>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          notification.is_read 
                            ? 'bg-gray-100' 
                            : 'bg-gradient-to-br from-amber-400 to-orange-600'
                        } shadow-md`}>
                          <Icon className={`w-5 h-5 md:w-6 md:h-6 ${
                            notification.is_read ? 'text-gray-500' : 'text-white'
                          }`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-base md:text-lg font-bold mb-1 md:mb-2 ${
                            notification.is_read ? 'text-gray-700' : 'text-gray-900'
                          }`}>
                            {notification.title}
                          </h3>
                          <p className={`text-sm md:text-base leading-relaxed mb-2 md:mb-3 ${
                            notification.is_read ? 'text-gray-500' : 'text-gray-700'
                          }`}>
                            {notification.message}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 md:gap-3">
                            <span className="text-xs md:text-sm text-gray-500">
                              {new Date(notification.created_date).toLocaleDateString('ar-SA')}
                            </span>
                            
                            {notification.link && (
                              <Link to={notification.link}>
                                <Button size="sm" variant="link" className="text-amber-600 hover:text-amber-700 p-0 h-auto text-xs md:text-sm">
                                  عرض التفاصيل ←
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          {!notification.is_read && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markAsReadMutation.mutate(notification.id)}
                              disabled={markAsReadMutation.isPending}
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-2 h-auto"
                            >
                              <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteMutation.mutate(notification.id)}
                            disabled={deleteMutation.isPending}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 h-auto"
                          >
                            <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm rounded-3xl">
              <CardContent className="p-8 md:p-12 text-center">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  لا توجد إشعارات
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  ستظهر هنا جميع الإشعارات الجديدة
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}