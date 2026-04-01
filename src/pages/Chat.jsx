import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, Search, User, Sparkles, Check, CheckCheck, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import OnlineIndicator from "@/components/OnlineIndicator";
import Breadcrumb from "@/components/Breadcrumb";
import { createPageUrl } from "@/utils";

export default function Chat() {
  const [user, setUser] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [appointmentData, setAppointmentData] = useState({ date: "", time: "", notes: "" });

  const scheduleAppointmentMutation = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase.from('Appointment').insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      setShowScheduleModal(false);
      setAppointmentData({ date: "", time: "", notes: "" });
      // Send a system message about the appointment
      sendMessageMutation.mutate({
        conversation_id: selectedConversation.id,
        sender_email: user.email,
        sender_name: user.full_name,
        sender_type: 'user',
        receiver_email: selectedConversation.scholar_email,
        receiver_name: selectedConversation.scholar_name,
        message_text: `تم طلب موعد استشارة بتاريخ ${appointmentData.date} الساعة ${appointmentData.time}`
      });
      alert("تم إرسال طلب الموعد بنجاح");
    },
  });

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!selectedConversation || !user) return;
    
    // Combine date and time
    const scheduledTime = new Date(`${appointmentData.date}T${appointmentData.time}`).toISOString();

    scheduleAppointmentMutation.mutate({
      scholar_email: selectedConversation.scholar_email,
      scholar_name: selectedConversation.scholar_name,
      user_email: user.email,
      user_name: user.full_name,
      scheduled_time: scheduledTime,
      notes: appointmentData.notes,
      status: 'pending'
    });
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedConversation) {
      markMessagesAsRead();
    }
  }, [selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ['conversations', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const { data, error } = await supabase.from('Conversation').select('*').eq('user_email', user.email).eq('status', 'active').order('last_message_time', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    initialData: [],
    refetchInterval: 5000,
  });

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['messages', selectedConversation?.id],
    queryFn: async () => {
      if (!selectedConversation) return [];
      const { data, error } = await supabase.from('ChatMessage').select('*').eq('conversation_id', selectedConversation.id).order('created_date', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!selectedConversation,
    initialData: [],
    refetchInterval: 2000,
  });

  const markMessagesAsRead = async () => {
    if (!selectedConversation) return;
    
    try {
      await supabase.from('ChatMessage').update({ is_read: true }).eq('conversation_id', selectedConversation.id).eq('receiver_email', user.email).eq('is_read', false);

      await supabase.from('Conversation').update({ unread_count_user: 0 }).eq('id', selectedConversation.id);

      queryClient.invalidateQueries({ queryKey: ['conversations', user?.email] });
    } catch (error) {
      console.log('Error marking messages as read:', error);
    }
  };

  const sendMessageMutation = useMutation({
    mutationFn: async (data) => {
      await supabase.from('ChatMessage').insert(data);
      await supabase.from('Conversation').update({
        last_message: data.message_text,
        last_message_time: new Date().toISOString(),
        unread_count_scholar: (selectedConversation.unread_count_scholar || 0) + 1
      }).eq('id', selectedConversation.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', selectedConversation?.id] });
      queryClient.invalidateQueries({ queryKey: ['conversations', user?.email] });
      setMessageText("");
      setIsTyping(false);
    },
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    sendMessageMutation.mutate({
      conversation_id: selectedConversation.id,
      sender_email: user.email,
      sender_name: user.full_name,
      sender_type: 'user',
      receiver_email: selectedConversation.scholar_email,
      receiver_name: selectedConversation.scholar_name,
      message_text: messageText
    });
  };

  const handleTyping = (e) => {
    setMessageText(e.target.value);
    if (e.target.value.length > 0 && !isTyping) {
      setIsTyping(true);
    } else if (e.target.value.length === 0 && isTyping) {
      setIsTyping(false);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.scholar_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-4 md:p-6 flex items-center justify-center">
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl max-w-md w-full">
          <CardContent className="p-8 md:p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
              يرجى تسجيل الدخول
            </h3>
            <p className="text-gray-600 mb-8">
              سجل الدخول لبدء المحادثات مع العلماء والدعاة
            </p>
            <Button
              onClick={() => window.location.href = '/auth'}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 py-5 md:py-6 text-base md:text-lg rounded-2xl"
            >
              تسجيل الدخول
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <Breadcrumb items={[{ label: "الدردشة المباشرة" }]} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 md:mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-6 py-3 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-semibold">الدردشة المباشرة</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            محادثاتك
          </h1>
          <p className="text-base md:text-lg text-white/90">
            تواصل مباشرة مع العلماء والدعاة
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          {/* قائمة المحادثات */}
          <Card className="lg:col-span-1 border-0 shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl max-h-[600px] flex flex-col">
            <CardContent className="p-4 md:p-6 flex-1 flex flex-col overflow-hidden">
              <div className="relative mb-4 flex-shrink-0">
                <Input
                  placeholder="ابحث في المحادثات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 rounded-2xl"
                />
                <Search className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="space-y-2 overflow-y-auto flex-1">
                {conversationsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : filteredConversations.length > 0 ? (
                  filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`w-full text-right p-3 rounded-2xl transition-all duration-200 ${
                        selectedConversation?.id === conv.id
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative flex-shrink-0">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            selectedConversation?.id === conv.id
                              ? 'bg-white/20'
                              : 'bg-gradient-to-br from-blue-400 to-indigo-600'
                          }`}>
                            <User className={`w-6 h-6 ${
                              selectedConversation?.id === conv.id ? 'text-white' : 'text-white'
                            }`} />
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5">
                            <OnlineIndicator isOnline={Math.random() > 0.5} size="sm" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-semibold text-sm truncate ${
                            selectedConversation?.id === conv.id ? 'text-white' : 'text-gray-900'
                          }`}>
                            {conv.scholar_name}
                          </h4>
                          <p className={`text-xs truncate ${
                            selectedConversation?.id === conv.id ? 'text-white/80' : 'text-gray-600'
                          }`}>
                            {conv.last_message || 'لا توجد رسائل'}
                          </p>
                        </div>
                        {conv.unread_count_user > 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                            {conv.unread_count_user}
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 text-sm">لا توجد محادثات</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* نافذة المحادثة */}
          <Card className="lg:col-span-2 border-0 shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl flex flex-col h-[600px]">
            {selectedConversation ? (
              <>
                <div className="p-4 md:p-6 border-b bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-3xl flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5">
                        <OnlineIndicator isOnline={Math.random() > 0.5} size="sm" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{selectedConversation.scholar_name}</h3>
                      <p className="text-sm text-white/80">{selectedConversation.scholar_type === 'mufti' ? 'مفتي' : selectedConversation.scholar_type === 'preacher' ? 'داعية' : 'محفظ'}</p>
                    </div>
                  </div>
                  
                  <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
                    <DialogTrigger asChild>
                      <Button variant="secondary" size="sm" className="gap-2 bg-white/20 hover:bg-white/30 text-white border-0">
                        <CalendarIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">طلب موعد</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>جدولة موعد استشارة</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleScheduleSubmit} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>التاريخ</Label>
                            <Input 
                              type="date" 
                              required
                              value={appointmentData.date}
                              onChange={(e) => setAppointmentData({...appointmentData, date: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>الوقت</Label>
                            <Input 
                              type="time" 
                              required
                              value={appointmentData.time}
                              onChange={(e) => setAppointmentData({...appointmentData, time: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>ملاحظات</Label>
                          <Input 
                            placeholder="سبب الموعد..." 
                            value={appointmentData.notes}
                            onChange={(e) => setAppointmentData({...appointmentData, notes: e.target.value})}
                          />
                        </div>
                        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                          تأكيد الطلب
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
                  {messagesLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                  ) : messages.length > 0 ? (
                    <>
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender_email === user.email ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            msg.sender_email === user.email
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm leading-relaxed">{msg.message_text}</p>
                            <div className="flex items-center gap-1 justify-end mt-1">
                              <p className={`text-xs ${
                                msg.sender_email === user.email ? 'text-white/70' : 'text-gray-500'
                              }`}>
                                {new Date(msg.created_date).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              {msg.sender_email === user.email && (
                                msg.is_read ? (
                                  <CheckCheck className="w-3 h-3 text-blue-200" />
                                ) : (
                                  <Check className="w-3 h-3 text-white/70" />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600">ابدأ المحادثة</p>
                    </div>
                  )}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-2xl px-4 py-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="p-4 md:p-6 border-t bg-gray-50 rounded-b-3xl flex-shrink-0">
                  <div className="flex gap-2">
                    <Input
                      placeholder="اكتب رسالتك..."
                      value={messageText}
                      onChange={handleTyping}
                      className="flex-1 rounded-2xl"
                    />
                    <Button
                      type="submit"
                      disabled={!messageText.trim() || sendMessageMutation.isPending}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-2xl px-6"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    اختر محادثة
                  </h3>
                  <p className="text-gray-600">
                    اختر محادثة من القائمة لبدء المحادثة
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}