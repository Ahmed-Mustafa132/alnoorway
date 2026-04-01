import React, { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, BookOpen, Sparkles, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const topics = [
  { id: "quran", label: "القرآن الكريم", icon: "📖", color: "bg-emerald-100 text-emerald-700" },
  { id: "hadith", label: "الحديث الشريف", icon: "📜", color: "bg-blue-100 text-blue-700" },
  { id: "fiqh", label: "الفقه", icon: "⚖️", color: "bg-purple-100 text-purple-700" },
  { id: "tafsir", label: "التفسير", icon: "💡", color: "bg-amber-100 text-amber-700" },
  { id: "aqeedah", label: "العقيدة", icon: "🕌", color: "bg-cyan-100 text-cyan-700" },
  { id: "seerah", label: "السيرة النبوية", icon: "🌟", color: "bg-rose-100 text-rose-700" },
  { id: "azkar", label: "الأذكار", icon: "🤲", color: "bg-teal-100 text-teal-700" },
  { id: "repentance", label: "التوبة", icon: "💚", color: "bg-green-100 text-green-700" }
];

export default function InterestsSelector({ user, compact = false }) {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const queryClient = useQueryClient();

  const { data: preferences } = useQuery({
    queryKey: ['user_preferences', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const { data, error } = await supabase.from('UserPreference').select('*').eq('user_email', user.email);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    initialData: [],
  });

  useEffect(() => {
    if (preferences?.[0]?.interested_topics) {
      setSelectedTopics(preferences[0].interested_topics);
    }
  }, [preferences]);

  const savePreferencesMutation = useMutation({
    mutationFn: async (data) => {
      if (preferences?.[0]) {
        const { error } = await supabase.from('UserPreference').update(data).eq('id', preferences[0].id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('UserPreference').insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_preferences', user?.email] });
    },
  });

  const toggleTopic = (topicId) => {
    const newTopics = selectedTopics.includes(topicId)
      ? selectedTopics.filter(t => t !== topicId)
      : [...selectedTopics, topicId];
    
    setSelectedTopics(newTopics);
    
    savePreferencesMutation.mutate({
      user_email: user.email,
      interested_topics: newTopics
    });
  };

  if (!user) return null;

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {topics.slice(0, 4).map((topic) => (
          <Badge
            key={topic.id}
            onClick={() => toggleTopic(topic.id)}
            className={`cursor-pointer transition-all duration-200 ${
              selectedTopics.includes(topic.id) ? topic.color : 'bg-gray-100 text-gray-600'
            }`}
          >
            {topic.icon} {topic.label}
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-t-xl">
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-6 h-6" />
          اختر اهتماماتك
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <p className="text-gray-600 mb-4">
          ساعدنا في تقديم محتوى مخصص لك بتحديد المواضيع التي تهتم بها
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {topics.map((topic, index) => {
            const isSelected = selectedTopics.includes(topic.id);
            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  onClick={() => toggleTopic(topic.id)}
                  variant={isSelected ? "default" : "outline"}
                  className={`w-full h-auto py-4 flex flex-col items-center gap-2 transition-all duration-200 ${
                    isSelected ? 'bg-gradient-to-br from-pink-500 to-purple-500 text-white' : ''
                  }`}
                >
                  <span className="text-2xl">{topic.icon}</span>
                  <span className="text-sm font-semibold">{topic.label}</span>
                  {isSelected && (
                    <CheckCircle className="w-4 h-4" />
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>
        
        {selectedTopics.length > 0 && (
          <div className="mt-4 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg">
            <p className="text-sm text-emerald-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              رائع! لقد اخترت {selectedTopics.length} {selectedTopics.length === 1 ? 'موضوع' : 'مواضيع'}. سنقترح محتوى مناسب لك.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}