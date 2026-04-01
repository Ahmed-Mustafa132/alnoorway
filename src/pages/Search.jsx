import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, BookOpen, Video, FileText, Globe, Filter, Calendar, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/components/LanguageContext";
import { Button } from "@/components/ui/button";

export default function Search() {
  const { t } = useLanguage();
  const urlParams = new URLSearchParams(window.location.search);
  const queryParam = urlParams.get('q') || "";
  
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  
  // Advanced Search States
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [speakerAuthor, setSpeakerAuthor] = useState("");

  const { data: lectures } = useQuery({
    queryKey: ['lectures'],
    queryFn: () => base44.entities.Lecture.list(),
    initialData: [],
  });

  const { data: stories } = useQuery({
    queryKey: ['stories'],
    queryFn: () => base44.entities.Story.list(),
    initialData: [],
  });

  const { data: fatwas } = useQuery({
    queryKey: ['fatwas'],
    queryFn: () => base44.entities.Fatwa.list(),
    initialData: [],
  });

  // تحسين البحث
  const normalizeText = (text) => {
    if (!text) return '';
    return text.toLowerCase().trim();
  };

  const searchInText = (text, query) => {
    if (!text || !query) return false;
    const normalizedText = normalizeText(text);
    const normalizedQuery = normalizeText(query);
    return normalizedText.includes(normalizedQuery);
  };

  const filterByDate = (item) => {
    if (!dateFrom && !dateTo) return true;
    const itemDate = new Date(item.created_date || item.created_at); // Fallback to created_at if created_date missing
    if (isNaN(itemDate.getTime())) return true;
    
    const start = dateFrom ? new Date(dateFrom) : new Date('2000-01-01');
    const end = dateTo ? new Date(dateTo) : new Date();
    
    return itemDate >= start && itemDate <= end;
  };

  const filteredLectures = lectures.filter(item => {
    const textMatch = searchInText(item.title, searchQuery) || 
      searchInText(item.speaker, searchQuery) ||
      searchInText(item.topic, searchQuery) ||
      searchInText(item.description, searchQuery);
    
    const speakerMatch = !speakerAuthor || searchInText(item.speaker, speakerAuthor);
    
    return textMatch && speakerMatch && filterByDate(item);
  });

  const filteredStories = stories.filter(item => {
    const textMatch = searchInText(item.title, searchQuery) || 
      searchInText(item.content, searchQuery) ||
      searchInText(item.author, searchQuery) ||
      searchInText(item.excerpt, searchQuery);

    const countryMatch = selectedCountry === "all" || !item.country || item.country === selectedCountry;
    const authorMatch = !speakerAuthor || searchInText(item.author, speakerAuthor);
    
    return textMatch && countryMatch && authorMatch && filterByDate(item);
  });

  const filteredFatwas = fatwas.filter(item => {
    const textMatch = searchInText(item.question, searchQuery) || 
      searchInText(item.answer, searchQuery) ||
      searchInText(item.category, searchQuery) ||
      searchInText(item.mufti, searchQuery);
      
    const muftiMatch = !speakerAuthor || searchInText(item.mufti, speakerAuthor);
    
    return textMatch && muftiMatch && filterByDate(item);
  });

  const allResults = [
    ...filteredLectures.map(item => ({ ...item, type: 'lecture' })),
    ...filteredStories.map(item => ({ ...item, type: 'story' })),
    ...filteredFatwas.map(item => ({ ...item, type: 'fatwa' }))
  ];

  let displayResults = activeTab === "all" ? allResults :
    activeTab === "lectures" ? filteredLectures.map(item => ({ ...item, type: 'lecture' })) :
    activeTab === "stories" ? filteredStories.map(item => ({ ...item, type: 'story' })) :
    filteredFatwas.map(item => ({ ...item, type: 'fatwa' }));

  // Apply extra filters if necessary for types that don't support them natively in the specific filter above
  if (selectedLanguage !== "all") {
     displayResults = displayResults.filter(item => !item.language || item.language === selectedLanguage);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <SearchIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            {t('advanced_search')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('search_placeholder')}
          </p>
        </motion.div>

        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="relative mb-4">
              <Input
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-lg py-6 pr-12"
              />
              <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">{t('filter_by')}:</span>
                </div>
                <Button 
                    variant="ghost" 
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-indigo-600 hover:bg-indigo-50"
                >
                    {showAdvanced ? 'إخفاء خيارات متقدمة' : t('advanced_search')}
                </Button>
            </div>

            <div className="flex flex-wrap gap-4">
               <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                 <SelectTrigger className="w-[180px]">
                   <SelectValue placeholder="اللغة" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">{t('all')}</SelectItem>
                   <SelectItem value="ar">العربية</SelectItem>
                   <SelectItem value="en">English</SelectItem>
                   <SelectItem value="fr">French</SelectItem>
                   <SelectItem value="ur">Urdu</SelectItem>
                 </SelectContent>
               </Select>

               <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                 <SelectTrigger className="w-[180px]">
                   <SelectValue placeholder="الدولة" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">{t('all')}</SelectItem>
                   <SelectItem value="egypt">مصر</SelectItem>
                   <SelectItem value="saudi">السعودية</SelectItem>
                   <SelectItem value="jordan">الأردن</SelectItem>
                   <SelectItem value="uae">الإمارات</SelectItem>
                 </SelectContent>
               </Select>
            </div>

            {showAdvanced && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                    <div>
                        <label className="text-sm font-medium mb-1 block text-gray-600">{t('date_from')}</label>
                        <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block text-gray-600">{t('date_to')}</label>
                        <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block text-gray-600">{t('speaker_author')}</label>
                        <Input 
                            placeholder="اسم الشيخ / المؤلف" 
                            value={speakerAuthor} 
                            onChange={(e) => setSpeakerAuthor(e.target.value)} 
                        />
                    </div>
                </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
            {[
                { id: "all", label: t('all'), count: allResults.length, icon: Globe },
                { id: "lectures", label: t('lectures'), count: filteredLectures.length, icon: Video },
                { id: "stories", label: t('stories'), count: filteredStories.length, icon: BookOpen },
                { id: "fatwas", label: t('fatwas'), count: filteredFatwas.length, icon: FileText },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all whitespace-nowrap ${
                        activeTab === tab.id 
                        ? "bg-indigo-600 text-white shadow-lg scale-105" 
                        : "bg-white text-gray-600 hover:bg-indigo-50"
                    }`}
                >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                        {tab.count}
                    </span>
                </button>
            ))}
        </div>

        {searchQuery ? (
          <div className="grid gap-6">
            {displayResults.length > 0 ? (
              displayResults.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-indigo-500">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    {result.type === 'lecture' && <Video className="w-4 h-4 text-purple-500" />}
                                    {result.type === 'story' && <BookOpen className="w-4 h-4 text-rose-500" />}
                                    {result.type === 'fatwa' && <FileText className="w-4 h-4 text-emerald-500" />}
                                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                                        {result.type === 'lecture' ? 'محاضرة' : 
                                         result.type === 'story' ? 'قصة' : 'فتوى'}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {result.title || result.question}
                                </h3>
                                <p className="text-gray-600 line-clamp-2">
                                    {result.type === 'lecture' && (result.speaker || result.description)}
                                    {result.type === 'story' && (result.excerpt || result.content?.substring(0, 150))}
                                    {result.type === 'fatwa' && result.answer?.substring(0, 150)}
                                </p>
                            </div>
                            <Button variant="ghost" className="text-indigo-600">
                                عرض التفاصيل
                            </Button>
                        </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SearchIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('no_results')}</h3>
                <p className="text-gray-500">جرب كلمات مفتاحية مختلفة أو قم بإزالة بعض الفلاتر</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 opacity-50">
            <SearchIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-medium text-gray-400">{t('start_search')}</h3>
          </div>
        )}
      </div>
    </div>
  );
}