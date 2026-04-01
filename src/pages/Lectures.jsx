import React, { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Video, Music, Search, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import LectureCard from "../components/LectureCard";
import CommentsSection from "../components/CommentsSection";
import RatingWidget from "../components/RatingWidget";
import { Button } from "@/components/ui/button";
import Breadcrumb from "../components/Breadcrumb";

export default function Lectures() {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  const lectureIdParam = urlParams.get('id');
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "all");
  const [selectedLecture, setSelectedLecture] = useState(null);

  const { data: lectures, isLoading } = useQuery({
    queryKey: ['lectures'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Lecture').select('*').order('created_date', { ascending: false });
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  useEffect(() => {
    if (lectureIdParam && lectures.length > 0) {
      const lecture = lectures.find(l => l.id === lectureIdParam);
      if (lecture) {
        setSelectedLecture(lecture);
      }
    }
  }, [lectureIdParam, lectures]);

  const filteredLectures = lectures.filter(lecture => {
    const matchesSearch = lecture.title?.includes(searchQuery) || 
                         lecture.speaker?.includes(searchQuery) ||
                         lecture.topic?.includes(searchQuery);
    const matchesType = selectedType === "all" || lecture.type === selectedType;
    const matchesCategory = selectedCategory === "all" || lecture.category === selectedCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  if (selectedLecture) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-4">
            <Breadcrumb items={[
              { label: "مكتبة المحاضرات", link: "/lectures" },
              { label: selectedLecture.title }
            ]} />
          </div>

          <Button 
            variant="outline" 
            onClick={() => setSelectedLecture(null)}
            className="mb-6"
          >
            <ArrowRight className="w-5 h-5 ml-2" />
            العودة إلى المحاضرات
          </Button>

          <div className="space-y-6">
            <LectureCard lecture={selectedLecture} isDetailView={true} />
            
            <RatingWidget 
              contentType="lecture" 
              contentId={selectedLecture.id} 
            />

            <CommentsSection 
              contentType="lecture" 
              contentId={selectedLecture.id}
              contentTitle={selectedLecture.title}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-700 via-teal-600 to-teal-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 pt-4"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-emerald-100 px-6 py-3 rounded-full mb-6">
            <Video className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-semibold">المكتبة المرئية والصوتية</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            مكتبة المحاضرات
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            استمع وشاهد محاضرات إسلامية قيّمة
          </p>
        </motion.div>

        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-6 md:mb-8">
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div className="relative">
                <Input
                  placeholder="ابحث عن محاضرة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 w-full"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="نوع المحاضرة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  <SelectItem value="audio">صوتية</SelectItem>
                  <SelectItem value="video">مرئية</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التصنيفات</SelectItem>
                  <SelectItem value="learn_islam">التعرف على الإسلام</SelectItem>
                  <SelectItem value="repentance">التوبة</SelectItem>
                  <SelectItem value="general">عام</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">جاري التحميل...</p>
          </div>
        ) : filteredLectures.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredLectures.map((lecture, index) => (
              <motion.div
                key={lecture.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedLecture(lecture)}
                className="cursor-pointer"
              >
                <LectureCard lecture={lecture} />
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12 text-center">
              {selectedType === "audio" ? (
                <Music className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
              ) : (
                <Video className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
              )}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                لا توجد محاضرات
              </h3>
              <p className="text-gray-600">
                {searchQuery ? "لم نجد نتائج لبحثك" : "لا توجد محاضرات متاحة حالياً"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}