import React, { useState } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Phone, MessageCircle, Globe, Mail, User } from "lucide-react";
import { motion } from "framer-motion";
import ContactModal from "@/components/ContactModal";
import OnlineIndicator from "@/components/OnlineIndicator";

export default function ContactTeacher() {
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  const { data: teachers, isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Scholar').select('*').eq('type', 'teacher').eq('is_available', true);
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const languages = ["الكل", ...new Set(teachers.flatMap(t => t.languages || []))];
  
  const filteredTeachers = selectedLanguage === "all" 
    ? teachers 
    : teachers.filter(t => t.languages?.includes(selectedLanguage));

  const isTeacherOnline = (teacher) => {
    return Math.random() > 0.5;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 px-6 py-3 rounded-full mb-6">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <span className="text-purple-800 font-semibold">تواصل مع محفظ</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            المحفظون المتاحون
          </h1>
          <p className="text-xl text-gray-600">
            تواصل مع محفظي القرآن الكريم
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang === "الكل" ? "all" : lang)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                (selectedLanguage === "all" && lang === "الكل") || selectedLanguage === lang
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-purple-50"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        ) : filteredTeachers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredTeachers.map((teacher, index) => {
              const isOnline = isTeacherOnline(teacher);
              return (
                <motion.div
                  key={teacher.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm h-full">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg relative">
                          <User className="w-8 h-8 text-white" />
                          <div className="absolute -bottom-0.5 -right-0.5">
                            <OnlineIndicator isOnline={isOnline} size="md" />
                          </div>
                        </div>
                        <div>
                          <CardTitle className="text-xl mb-2">{teacher.name}</CardTitle>
                          {teacher.country && (
                            <p className="text-sm text-gray-600">{teacher.country}</p>
                          )}
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full mt-1 ${
                            isOnline 
                              ? 'text-emerald-600 bg-emerald-50' 
                              : 'text-red-600 bg-red-50'
                          }`}>
                            <OnlineIndicator isOnline={isOnline} size="sm" />
                            {isOnline ? 'متاح' : 'غير متصل'}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {teacher.bio && (
                        <p className="text-gray-600 text-sm leading-relaxed">{teacher.bio}</p>
                      )}

                      {teacher.languages && teacher.languages.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-purple-600" />
                          <div className="flex flex-wrap gap-2">
                            {teacher.languages.map((lang, idx) => (
                              <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs">
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2 pt-3 border-t">
                        {teacher.phone && (
                          <a
                            href={`tel:${teacher.phone}`}
                            className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700"
                          >
                            <Phone className="w-4 h-4" />
                            اتصال تليفوني
                          </a>
                        )}
                        {teacher.whatsapp && (
                          <a
                            href={`https://wa.me/${teacher.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700"
                          >
                            <MessageCircle className="w-4 h-4" />
                            واتساب
                          </a>
                        )}
                        {teacher.email && (
                          <a
                            href={`mailto:${teacher.email}`}
                            className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700"
                          >
                            <Mail className="w-4 h-4" />
                            بريد إلكتروني
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm mb-12">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                لا يوجد محفظون متاحون حالياً
              </h3>
              <p className="text-gray-600">
                يمكنك إرسال طلب وسنتواصل معك قريباً
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <ContactModal
        open={showContactModal}
        onClose={() => setShowContactModal(false)}
        requestType="التعرف على الإسلام"
      />
    </div>
  );
}