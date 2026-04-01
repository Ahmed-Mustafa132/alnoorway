import React, { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingUp, BookOpen, Video, Heart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import Breadcrumb from "@/components/Breadcrumb";
import LectureCard from "@/components/LectureCard";

export default function Recommendations() {
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState({ lectures: [], stories: [], fatwas: [], books: [] });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const userData = { ...authUser, role: 'user' };
        setUser(userData);
        await loadRecommendations(userData);
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

  const { data: lectures, isLoading: lecturesLoading } = useQuery({
    queryKey: ['lectures'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Lecture').select('*').order('views_count', { ascending: false }).limit(20);
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const { data: stories, isLoading: storiesLoading } = useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Story').select('*').order('created_date', { ascending: false }).limit(20);
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const { data: fatwas, isLoading: fatwasLoading } = useQuery({
    queryKey: ['fatwas'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Fatwa').select('*').order('created_date', { ascending: false }).limit(20);
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const { data: books, isLoading: booksLoading } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Book').select('*').order('created_date', { ascending: false }).limit(20);
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const loadRecommendations = async (userData) => {
    try {
      const { data: prefs } = await supabase.from('UserPreference').select('*').eq('user_email', userData.email);
      const userPref = prefs?.[0];

      const topics = userPref?.interested_topics || [];
      const viewHistory = userPref?.view_history || [];
      const searchHistory = userPref?.search_history || [];

      const { data: allLectures } = await supabase.from('Lecture').select('*').order('views_count', { ascending: false }).limit(50);
      const { data: allStories } = await supabase.from('Story').select('*').order('created_date', { ascending: false }).limit(50);
      const { data: allFatwas } = await supabase.from('Fatwa').select('*').order('created_date', { ascending: false }).limit(50);
      const { data: allBooks } = await supabase.from('Book').select('*').order('created_date', { ascending: false }).limit(50);

      const scoredLectures = allLectures
        .map(item => ({ ...item, score: calculateScore(item, topics, searchHistory, 'lecture') }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);

      const scoredStories = allStories
        .map(item => ({ ...item, score: calculateScore(item, topics, searchHistory, 'story') }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);

      const scoredFatwas = allFatwas
        .map(item => ({ ...item, score: calculateScore(item, topics, searchHistory, 'fatwa') }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);

      const scoredBooks = allBooks
        .map(item => ({ ...item, score: calculateScore(item, topics, searchHistory, 'book') }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);

      setRecommendations({
        lectures: scoredLectures,
        stories: scoredStories,
        fatwas: scoredFatwas,
        books: scoredBooks
      });
    } catch (error) {
      console.log('Error loading recommendations:', error);
    }
  };

  const calculateScore = (item, topics, searchHistory, type) => {
    let score = 0;

    if (topics && topics.length > 0) {
      const itemText = (item.title + ' ' + (item.description || '') + ' ' + (item.category || '')).toLowerCase();
      topics.forEach(topic => {
        if (itemText.includes(topic.toLowerCase())) {
          score += 10;
        }
      });
    }

    if (searchHistory && searchHistory.length > 0) {
      const itemText = (item.title + ' ' + (item.description || '')).toLowerCase();
      searchHistory.slice(-10).forEach(query => {
        if (itemText.includes(query.toLowerCase())) {
          score += 5;
        }
      });
    }

    if (type === 'lecture' && item.views_count) {
      score += Math.min(item.views_count / 100, 20);
    }

    return score;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-800 p-4 md:p-6 flex items-center justify-center">
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm rounded-3xl max-w-md w-full mx-4">
          <CardContent className="p-6 md:p-12 text-center">
            <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
              يرجى تسجيل الدخول
            </h3>
            <p className="text-gray-600 mb-8 text-sm md:text-base">
              سجل الدخول للحصول على توصيات مخصصة بناءً على اهتماماتك
            </p>
            <Link to="/auth">
              <button
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 py-4 md:py-6 text-base md:text-lg rounded-2xl text-white font-semibold"
              >
                تسجيل الدخول
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isLoading = lecturesLoading || storiesLoading || fatwasLoading || booksLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <Breadcrumb items={[{ label: "التوصيات المخصصة" }]} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 pt-4"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-indigo-100 px-4 md:px-6 py-2 md:py-3 rounded-full mb-4 md:mb-6">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
            <span className="text-purple-800 font-semibold text-sm md:text-base">مخصص لك</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 px-4">
            توصيات مخصصة لك
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto px-4">
            محتوى منتقى بعناية بناءً على اهتماماتك وسجل تصفحك
          </p>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-white mt-4">جاري تحميل التوصيات...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {recommendations.lectures.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4 px-2">
                  <Video className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  <h2 className="text-xl md:text-2xl font-bold text-white">محاضرات مقترحة</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.lectures.map((lecture, index) => (
                    <motion.div
                      key={lecture.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => window.location.href = createPageUrl("Lectures") + `?id=${lecture.id}`}
                    >
                      <LectureCard lecture={lecture} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {recommendations.stories.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4 px-2">
                  <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  <h2 className="text-xl md:text-2xl font-bold text-white">قصص ملهمة</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.stories.map((story, index) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link to={createPageUrl("Stories") + `?id=${story.id}`}>
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-sm h-full hover:-translate-y-1 rounded-2xl">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-2 mb-2">
                              <Star className="w-4 h-4 text-purple-600 flex-shrink-0 mt-1" />
                              <h3 className="font-bold text-gray-900 text-sm md:text-base line-clamp-2">{story.title}</h3>
                            </div>
                            <p className="text-xs md:text-sm text-gray-600 line-clamp-3">{story.excerpt || story.content?.substring(0, 100)}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {recommendations.books.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4 px-2">
                  <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  <h2 className="text-xl md:text-2xl font-bold text-white">كتب مقترحة</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {recommendations.books.map((book, index) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link to={createPageUrl("BookReader") + `?id=${book.id}`}>
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-sm h-full hover:-translate-y-1 rounded-2xl">
                          <CardContent className="p-3 md:p-4">
                            {book.cover_url && (
                              <img src={book.cover_url} alt={book.title} className="w-full h-32 md:h-48 object-cover rounded-lg mb-2 md:mb-3" />
                            )}
                            <div className="flex items-start gap-2 mb-2">
                              <Star className="w-4 h-4 text-purple-600 flex-shrink-0 mt-1" />
                              <h3 className="font-bold text-gray-900 text-xs md:text-sm line-clamp-2">{book.title}</h3>
                            </div>
                            <p className="text-xs text-gray-600 truncate">{book.author}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}