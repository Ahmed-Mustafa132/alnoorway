import React, { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, MessageSquare, BookOpen, Globe, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import ContactModal from "@/components/ContactModal";
import OnlineIndicator from "@/components/OnlineIndicator";

export default function ContactScholar() {
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedScholar, setSelectedScholar] = useState(null);

  const [onlineFilter, setOnlineFilter] = useState(false);

  const { data: scholars, isLoading } = useQuery({
    queryKey: ['scholars_mufti'],
    queryFn: async () => {
      // Fetch all scholars first, then we can simulate online status or filter
      const { data, error } = await supabase.from('Scholar').select('*').eq('type', 'mufti');
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const onlineCount = scholars.filter(s => isScholarOnline(s)).length;
  
  const displayedScholars = onlineFilter 
    ? scholars.filter(s => isScholarOnline(s))
    : scholars;

  const handleContact = (scholar) => {
    setSelectedScholar(scholar);
    setShowContactModal(true);
  };

  // محاكاة حالة Online (في التطبيق الحقيقي، ستأتي من قاعدة البيانات)
  const isScholarOnline = (scholar) => {
    // يمكن إضافة منطق حقيقي هنا - مثلاً التحقق من آخر نشاط
    return Math.random() > 0.5;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 px-6 py-3 rounded-full mb-6">
            <User className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-800 font-semibold">تواصل مع مفتي</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            علماؤنا في خدمتك
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            تواصل مباشرة مع علماء موثوقين للحصول على الفتاوى والإرشاد الشرعي
          </p>

          <div className="flex justify-center gap-4 mb-8">
             <div 
               onClick={() => setOnlineFilter(false)}
               className={`cursor-pointer px-6 py-3 rounded-2xl shadow-sm border transition-all ${!onlineFilter ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-emerald-50'}`}
             >
               <span className="block text-2xl font-bold">{scholars.length}</span>
               <span className="text-sm">إجمالي المفتين</span>
             </div>
             <div 
               onClick={() => setOnlineFilter(true)}
               className={`cursor-pointer px-6 py-3 rounded-2xl shadow-sm border transition-all ${onlineFilter ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-emerald-50'}`}
             >
               <span className="block text-2xl font-bold flex items-center justify-center gap-2">
                 {onlineCount}
                 <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-400/50"></span>
               </span>
               <span className="text-sm">متواجدون الآن</span>
             </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          </div>
        ) : displayedScholars.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedScholars.map((scholar, index) => {
              const isOnline = isScholarOnline(scholar);
              return (
                <motion.div
                  key={scholar.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm h-full hover:-translate-y-1">
                    <CardHeader className="text-center pb-4 relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-xl relative">
                        <User className="w-12 h-12 text-white" />
                        <div className="absolute bottom-0 right-0">
                          <OnlineIndicator isOnline={isOnline} size="lg" />
                        </div>
                      </div>
                      <CardTitle className="text-2xl mb-2">{scholar.name}</CardTitle>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${
                        isOnline 
                          ? 'text-emerald-600 bg-emerald-50' 
                          : 'text-red-600 bg-red-50'
                      }`}>
                        <OnlineIndicator isOnline={isOnline} size="sm" />
                        {isOnline ? 'متاح الآن' : 'غير متصل'}
                      </span>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {scholar.specialization && (
                        <div className="flex items-start gap-2">
                          <BookOpen className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-gray-900">التخصص:</p>
                            <p className="text-gray-600">{scholar.specialization}</p>
                          </div>
                        </div>
                      )}

                      {scholar.languages && scholar.languages.length > 0 && (
                        <div className="flex items-start gap-2">
                          <Globe className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-gray-900">اللغات:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {scholar.languages.map((lang, idx) => (
                                <span key={idx} className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                                  {lang}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {scholar.bio && (
                        <p className="text-gray-600 text-sm leading-relaxed">{scholar.bio}</p>
                      )}

                      <Button
                        onClick={() => handleContact(scholar)}
                        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                      >
                        <MessageSquare className="w-5 h-5 ml-2" />
                        {isOnline ? 'تواصل الآن' : 'إرسال رسالة'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">لا يوجد علماء متاحون حالياً</p>
            </CardContent>
          </Card>
        )}
      </div>

      <ContactModal
        open={showContactModal}
        onClose={() => {
          setShowContactModal(false);
          setSelectedScholar(null);
        }}
        requestType="scholar"
        scholarName={selectedScholar?.name}
      />
    </div>
  );
}