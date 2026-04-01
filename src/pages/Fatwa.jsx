import React, { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageSquare, Users, BookOpen, Sparkles, ArrowRight, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import FatwaCard from "@/components/FatwaCard";
import FatwaRequestModal from "@/components/FatwaRequestModal";
import ContactModal from "@/components/ContactModal";
import AIFatwaAssistant from "@/components/AIFatwaAssistant";
import RatingWidget from "@/components/RatingWidget";
import CommentsSection from "@/components/CommentsSection";
import ShareButtons from "@/components/ShareButtons";
import { useLanguage } from "@/components/LanguageContext";

export default function Fatwa() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [muftiQuery, setMuftiQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedFatwa, setSelectedFatwa] = useState(null);
  const [onlineMuftis, setOnlineMuftis] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [user, setUser] = useState(null);
  const [userFavorites, setUserFavorites] = useState([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
       if (data.user) {
          setUser(data.user);
          fetchFavorites(data.user.email);
       }
    });
  }, []);

  const fetchFavorites = async (email) => {
     const { data } = await supabase.from('Favorite').select('item_id').eq('user_email', email).eq('item_type', 'fatwa');
     if (data) setUserFavorites(data.map(f => f.item_id));
  };

  const toggleFavorite = async (fatwa) => {
     if (!user) {
        alert("يرجى تسجيل الدخول");
        return;
     }
     if (userFavorites.includes(fatwa.id)) {
        // Remove
        await supabase.from('Favorite').delete().eq('user_email', user.email).eq('item_id', fatwa.id);
        setUserFavorites(prev => prev.filter(id => id !== fatwa.id));
     } else {
        // Add
        await supabase.from('Favorite').insert({
           user_email: user.email,
           item_type: 'fatwa',
           item_id: fatwa.id,
           item_title: fatwa.question,
           item_data: fatwa
        });
        setUserFavorites(prev => [...prev, fatwa.id]);
     }
  };

  const categories = [
    { value: "all", label: "الكل" },
    { value: "عبادات", label: "عبادات" },
    { value: "معاملات", label: "معاملات" },
    { value: "عقيدة", label: "عقيدة" },
    { value: "أخلاق", label: "أخلاق" },
    { value: "أسرة", label: "أسرة" },
  ];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fatwaId = urlParams.get('id');
    if (fatwaId && fatwas) {
      const fatwa = fatwas.find(f => f.id === fatwaId);
      if (fatwa) setSelectedFatwa(fatwa);
    }
    loadOnlineMuftis();
  }, []);

  const loadOnlineMuftis = async () => {
    try {
      const { count } = await supabase.from('Scholar').select('*', { count: 'exact' }).eq('type', 'mufti').eq('is_available', true);
      setOnlineMuftis(count || 0);
    } catch (error) {
      console.log('Error loading muftis:', error);
    }
  };

  const { data: fatwas, isLoading } = useQuery({
    queryKey: ['fatwas'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Fatwa').select('*').order('created_date', { ascending: false });
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const filteredFatwas = fatwas.filter(fatwa => {
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch = fatwa.question?.toLowerCase().includes(lowerQuery) || fatwa.answer?.toLowerCase().includes(lowerQuery);
    const matchesMufti = !muftiQuery || fatwa.mufti?.toLowerCase().includes(muftiQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || fatwa.category === selectedCategory;
    
    let matchesDate = true;
    if (dateFrom && fatwa.created_date) {
       matchesDate = matchesDate && new Date(fatwa.created_date) >= new Date(dateFrom);
    }
    if (dateTo && fatwa.created_date) {
       matchesDate = matchesDate && new Date(fatwa.created_date) <= new Date(dateTo);
    }
    
    return matchesSearch && matchesMufti && matchesCategory && matchesDate;
  });

  const quickActions = [
    {
      icon: Search,
      title: t('search_fatwa'),
      description: t('search_fatwa_desc'),
      color: "from-blue-100 to-blue-200",
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/v1769612644/ask_your_question_viityb.png",
      action: () => document.getElementById('search-input')?.focus()
    },
    {
      icon: MessageSquare,
      title: t('ask_question'),
      description: t('ask_question_desc'),
      color: "from-emerald-100 to-emerald-200",
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/v1769612644/ask_your_question_viityb.png",
      action: () => setShowRequestModal(true)
    },
    {
      icon: Users,
      title: t('contact_scholar'),
      description: "تحدث مباشرة مع عالم",
      color: "from-purple-100 to-purple-200",
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/v1769612644/Contact_an_Islamic_mufti_glg2c4.png",
      action: () => setShowContactModal(true),
      onlineCount: onlineMuftis,
      countLabel: t('contact_scholar')
    }
  ];

  if (selectedFatwa) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => setSelectedFatwa(null)}
            variant="ghost"
            className="text-white hover:bg-white/20 mb-6"
          >
            <ArrowRight className="w-5 h-5 ml-2" />
            {t('back_to_fatwas')}
          </Button>

          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm rounded-3xl mb-6">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-t-3xl p-6 md:p-8">
              <CardTitle className="text-xl md:text-2xl">{selectedFatwa.question}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600" />
                    {t('answer')}:
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-emerald-600 hover:bg-emerald-50"
                    onClick={async () => {
                        try {
                            const { data, error } = await supabase.functions.invoke('aiAssistant', {
                                body: { action: 'summarize', text: selectedFatwa.answer }
                            });
                            if (error) throw error;
                            alert("ملخص الجواب:\n" + (data.summary || "تعذر التلخيص"));
                        } catch (e) {
                            alert("حدث خطأ أثناء التلخيص");
                        }
                    }}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {t('ai_summarize')}
                  </Button>
                </div>
                <div className="bg-emerald-50/50 p-4 md:p-6 rounded-2xl border border-emerald-100">
                  <p className="text-gray-700 leading-loose text-lg whitespace-pre-wrap">
                    {selectedFatwa.answer}
                  </p>
                </div>
              </div>

              {selectedFatwa.mufti && (
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('answered_by')}</p>
                    <p className="font-semibold text-gray-800">{selectedFatwa.mufti}</p>
                  </div>
                  <div className="mr-auto text-sm text-gray-400">
                    {new Date(selectedFatwa.created_date).toLocaleDateString('ar-SA')}
                  </div>
                </div>
              )}

              {selectedFatwa.reference && (
                <div className="flex items-start gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                  <BookOpen className="w-4 h-4 mt-1" />
                  <p>
                    <span className="font-semibold">{t('reference')}:</span> {selectedFatwa.reference}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4 mb-8">
             <Button
                className="flex-1 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                onClick={async () => {
                   const { data: { user } } = await supabase.auth.getUser();
                   if(!user) { alert('يرجى تسجيل الدخول للحفظ'); return; }
                   const { error } = await supabase.from('Favorite').insert({
                      user_email: user.email,
                      item_type: 'fatwa',
                      item_id: selectedFatwa.id,
                      item_title: selectedFatwa.question,
                      item_data: selectedFatwa
                   });
                   if(error) alert('خطأ في الحفظ');
                   else alert('تم الحفظ في المفضلة');
                }}
             >
                <Heart className="w-4 h-4 mr-2" />
                حفظ في المفضلة
             </Button>
             <ShareButtons title={selectedFatwa.question} url={window.location.href} />
          </div>

          <RatingWidget contentType="fatwa" contentId={selectedFatwa.id} />
          
          <div className="mt-8">
            <CommentsSection contentType="fatwa" contentId={selectedFatwa.id} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 pt-8"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <MessageSquare className="w-4 h-4" />
            {t('fatwa')}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('fatwa_title')}
          </h1>
          <p className="text-xl text-emerald-800 font-amiri mb-4">
            "فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ"
          </p>
          <div className="text-sm text-emerald-600 font-medium">
            سورة النحل - آية 43
          </div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            {t('fatwa_subtitle')}
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto mb-12 relative z-10">
          <div className="relative">
            <Input
              id="search-input"
              placeholder={t('search_fatwa_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-12 py-6 text-lg bg-white/95 dark:bg-gray-800/90 backdrop-blur-sm rounded-full border-0 shadow-lg dark:text-white dark:placeholder-gray-400"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500" />
            
            <div className="absolute left-2 top-1/2 -translate-y-1/2">
               <Button 
                 size="sm" 
                 variant="ghost" 
                 onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                 className="bg-white/10 text-white hover:bg-white/20 border-white/20"
               >
                 {showAdvancedSearch ? t('advanced_search') : t('advanced_search')}
               </Button>
               <Button
                  size="sm"
                  variant="ghost"
                  className="mr-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-full"
                  onClick={() => {
                     // AI Summary for all fatwas context (Demo) - In real app, maybe per fatwa
                     alert("خاصية التلخيص متاحة عند عرض فتوى محددة.");
                  }}
               >
                  <Sparkles className="w-4 h-4" />
                  {t('summarize_fatwas')}
               </Button>
               <Link to={createPageUrl("Favorites")}>
                  <Button size="sm" variant="ghost" className="mr-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-full">
                     <Heart className="w-4 h-4" />
                     {t('favorite_fatwas')}
                  </Button>
               </Link>
            </div>
          </div>

          {showAdvancedSearch && (
             <div className="mt-4 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                   <label className="text-sm font-medium text-gray-700 mb-1 block">{t('mufti_name')}</label>
                   <Input 
                     value={muftiQuery} 
                     onChange={(e) => setMuftiQuery(e.target.value)}
                     placeholder={t('mufti_name')}
                     className="bg-white/80 border-0"
                   />
                </div>
                <div>
                   <label className="text-sm font-medium text-gray-700 mb-1 block">{t('date_from')}</label>
                   <Input 
                     type="date"
                     value={dateFrom} 
                     onChange={(e) => setDateFrom(e.target.value)}
                     className="bg-white/80 border-0"
                   />
                </div>
                <div>
                   <label className="text-sm font-medium text-gray-700 mb-1 block">{t('date_to')}</label>
                   <Input 
                     type="date"
                     value={dateTo} 
                     onChange={(e) => setDateTo(e.target.value)}
                     className="bg-white/80 border-0"
                   />
                </div>
             </div>
          )}
        </div>

        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === cat.value
                  ? "bg-white text-emerald-700 shadow-lg"
                  : "bg-emerald-800/50 text-white/80 hover:bg-emerald-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br ${action.color} overflow-hidden h-full cursor-pointer`}
                onClick={action.action}
              >
                <CardContent className="p-6 flex items-center gap-4 relative">
                  {action.onlineCount > 0 && (
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-emerald-600 flex items-center gap-1 shadow-sm animate-pulse">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      {action.onlineCount} {action.countLabel}
                    </div>
                  )}
                  
                  <div className="w-20 h-20 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300">
                    <img src={action.image} alt={action.title} className="w-14 h-14 object-contain" />
                  </div>
                  
                  <div className="flex-1 text-right">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{action.title}</h3>
                    <p className="text-sm text-gray-700">{action.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">جاري تحميل الفتاوى...</p>
            </div>
          ) : filteredFatwas.length > 0 ? (
            filteredFatwas.map((fatwa, index) => (
              <FatwaCard 
                key={fatwa.id} 
                fatwa={fatwa} 
                onClick={() => setSelectedFatwa(fatwa)}
                isFavorited={userFavorites.includes(fatwa.id)}
                onToggleFavorite={() => toggleFavorite(fatwa)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white/50 rounded-3xl border border-dashed border-gray-300">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">لا توجد نتائج</p>
              <p className="text-sm text-gray-400">جرب كلمات مفتاحية مختلفة</p>
            </div>
          )}
        </div>

        <FatwaRequestModal open={showRequestModal} onClose={() => setShowRequestModal(false)} />
        <ContactModal 
          open={showContactModal} 
          onClose={() => setShowContactModal(false)}
          requestType="fatwa"
        />
      </div>
    </div>
  );
}