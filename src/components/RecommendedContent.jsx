import React, { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Heart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

export default function RecommendedContent() {
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser({ ...authUser, role: 'user' });
        await generateRecommendations({ ...authUser, role: 'user' });
      }
    } catch (error) {
      console.log("User not logged in");
    }
  };

  const { data: userPreferences } = useQuery({
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

  const generateRecommendations = async (userData) => {
    try {
      const prefs = userPreferences?.[0];
      const interests = prefs?.interested_topics || [];
      const viewHistory = prefs?.view_history || [];
      
      // Fetch content based on interests
      const [lecturesResponse, booksResponse, fatwasResponse] = await Promise.all([
        supabase.from('Lecture').select('*').order('views_count', { ascending: false }).limit(10),
        supabase.from('Book').select('*').order('created_date', { ascending: false }).limit(10),
        supabase.from('Fatwa').select('*').order('created_date', { ascending: false }).limit(10)
      ]);

      const lectures = lecturesResponse.data || [];
      const books = booksResponse.data || [];
      const fatwas = fatwasResponse.data || [];

      // Simple recommendation algorithm
      const recommended = [];
      
      // Add popular content
      lectures.slice(0, 3).forEach(lecture => {
        recommended.push({
          type: 'lecture',
          data: lecture,
          reason: 'محتوى شائع',
          score: 80
        });
      });

      // Add content matching interests
      if (interests.length > 0) {
        books.slice(0, 2).forEach(book => {
          recommended.push({
            type: 'book',
            data: book,
            reason: 'يطابق اهتماماتك',
            score: 90
          });
        });
      }

      // Add recent fatwas
      fatwas.slice(0, 2).forEach(fatwa => {
        recommended.push({
          type: 'fatwa',
          data: fatwa,
          reason: 'جديد ومميز',
          score: 75
        });
      });

      setRecommendations(recommended.slice(0, 6));
    } catch (error) {
      console.error('Error generating recommendations:', error);
    }
  };

  if (!user || recommendations.length === 0) return null;

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-8">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-xl">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          محتوى مقترح لك
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border border-purple-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                      {rec.type === 'lecture' ? '📹 محاضرة' : rec.type === 'book' ? '📚 كتاب' : '📖 فتوى'}
                    </span>
                    <span className="text-xs text-gray-500">{rec.reason}</span>
                  </div>
                  
                  <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">
                    {rec.data.title || rec.data.question}
                  </h4>
                  
                  {rec.data.speaker && (
                    <p className="text-sm text-gray-600 mb-2">
                      {rec.data.speaker}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    {rec.data.views_count && (
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {rec.data.views_count}
                      </span>
                    )}
                    {rec.data.likes_count && (
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {rec.data.likes_count}
                      </span>
                    )}
                  </div>
                  
                  <Link to={
                    rec.type === 'lecture' ? createPageUrl("Lectures") + `?id=${rec.data.id}` :
                    rec.type === 'book' ? createPageUrl("BookReader") + `?bookId=${rec.data.id}` :
                    createPageUrl("Fatwa") + `?id=${rec.data.id}`
                  }>
                    <Button size="sm" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      عرض الآن
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}