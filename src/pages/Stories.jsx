import React, { useState } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import StoryCard from "@/components/StoryCard";
import CommentsSection from "@/components/CommentsSection";
import RatingWidget from "@/components/RatingWidget";
import ShareButtons from "@/components/ShareButtons";

export default function Stories() {
  const urlParams = new URLSearchParams(window.location.search);
  const typeParam = urlParams.get('type');
  
  const [selectedType, setSelectedType] = useState(typeParam || "all");
  const [selectedStory, setSelectedStory] = useState(null);

  const { data: stories, isLoading } = useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Story').select('*').order('created_date', { ascending: false });
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const filteredStories = selectedType === "all" 
    ? stories 
    : stories.filter(story => story.category === selectedType);

  // عرض القصة المختارة
  if (selectedStory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 p-6 md:p-12">
        <div className="max-w-5xl mx-auto">
          <Button 
            variant="outline" 
            onClick={() => setSelectedStory(null)}
            className="mb-6"
          >
            ← العودة إلى القصص
          </Button>

          <div className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              {selectedStory.image_url && (
                <div className="h-64 overflow-hidden rounded-t-xl">
                  <img 
                    src={selectedStory.image_url} 
                    alt={selectedStory.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-gray-900">{selectedStory.title}</h1>
                  <ShareButtons 
                    title={selectedStory.title}
                    description={selectedStory.excerpt || 'قصة ملهمة'}
                  />
                </div>

                {selectedStory.author && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Heart className="w-5 h-5" />
                    <span className="font-semibold">صاحب القصة:</span>
                    <span>{selectedStory.author}</span>
                  </div>
                )}

                {selectedStory.country && (
                  <div className="inline-flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full">
                    <span className="text-amber-700 font-semibold">{selectedStory.country}</span>
                  </div>
                )}

                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                    {selectedStory.content}
                  </p>
                </div>
              </CardContent>
            </Card>

            <RatingWidget 
              contentType="story" 
              contentId={selectedStory.id} 
            />

            <CommentsSection 
              contentType="story" 
              contentId={selectedStory.id}
              contentTitle={selectedStory.title}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            قصص ملهمة
          </h1>
          <p className="text-xl text-gray-600">
            رحلات إيمانية حقيقية تلامس القلوب
          </p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <Tabs value={selectedType} onValueChange={setSelectedType}>
            <TabsList className="bg-white shadow-lg">
              <TabsTrigger value="all" className="gap-2">
                <BookOpen className="w-4 h-4" />
                جميع القصص
              </TabsTrigger>
              <TabsTrigger value="convert" className="gap-2">
                <Heart className="w-4 h-4" />
                قصص المهتدين
              </TabsTrigger>
              <TabsTrigger value="repentance" className="gap-2">
                <Heart className="w-4 h-4" />
                قصص التائبين
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">جاري التحميل...</p>
          </div>
        ) : filteredStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredStories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedStory(story)}
                className="cursor-pointer"
              >
                <StoryCard story={story} />
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                لا توجد قصص حالياً
              </h3>
              <p className="text-gray-600">
                سنضيف المزيد من القصص الملهمة قريباً
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}