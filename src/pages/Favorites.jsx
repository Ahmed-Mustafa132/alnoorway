import React, { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Trash2, Video, BookOpen, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Favorites() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          setUser({ ...authUser, role: 'user' });
        }
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    loadUser();
  }, []);

  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const { data, error } = await supabase.from('Favorite').select('*').eq('user_email', user.email);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    initialData: [],
  });

  const deleteFavoriteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('Favorite').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const lecturesFavorites = favorites.filter(f => f.item_type === 'lecture');
  const storiesFavorites = favorites.filter(f => f.item_type === 'story');
  const fatwasFavorites = favorites.filter(f => f.item_type === 'fatwa');

  const getIcon = (type) => {
    switch(type) {
      case 'lecture': return Video;
      case 'story': return BookOpen;
      case 'fatwa': return MessageSquare;
      default: return Heart;
    }
  };

  const getColor = (type) => {
    switch(type) {
      case 'lecture': return 'from-purple-400 to-purple-600';
      case 'story': return 'from-amber-400 to-amber-600';
      case 'fatwa': return 'from-emerald-400 to-emerald-600';
      default: return 'from-rose-400 to-rose-600';
    }
  };

  const renderFavoriteCard = (favorite) => {
    const Icon = getIcon(favorite.item_type);
    const color = getColor(favorite.item_type);

    return (
      <Card key={favorite.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-md`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{favorite.item_title || 'بدون عنوان'}</h3>
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium mb-3">
                {favorite.item_type === 'lecture' && 'محاضرة'}
                {favorite.item_type === 'story' && 'قصة'}
                {favorite.item_type === 'fatwa' && 'فتوى'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteFavoriteMutation.mutate(favorite.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 ml-2" />
                إزالة من المفضلة
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            المفضلة
          </h1>
          <p className="text-xl text-gray-600">
            المحتوى الذي قمت بحفظه
          </p>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">جاري التحميل...</p>
          </div>
        ) : favorites.length > 0 ? (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 max-w-2xl mx-auto">
              <TabsTrigger value="all">الكل ({favorites.length})</TabsTrigger>
              <TabsTrigger value="lectures">محاضرات ({lecturesFavorites.length})</TabsTrigger>
              <TabsTrigger value="stories">قصص ({storiesFavorites.length})</TabsTrigger>
              <TabsTrigger value="fatwas">فتاوى ({fatwasFavorites.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="grid md:grid-cols-2 gap-6">
              {favorites.map(renderFavoriteCard)}
            </TabsContent>

            <TabsContent value="lectures" className="grid md:grid-cols-2 gap-6">
              {lecturesFavorites.length > 0 ? (
                lecturesFavorites.map(renderFavoriteCard)
              ) : (
                <div className="col-span-2 text-center py-12">
                  <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">لا توجد محاضرات مفضلة</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="stories" className="grid md:grid-cols-2 gap-6">
              {storiesFavorites.length > 0 ? (
                storiesFavorites.map(renderFavoriteCard)
              ) : (
                <div className="col-span-2 text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">لا توجد قصص مفضلة</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="fatwas" className="grid md:grid-cols-2 gap-6">
              {fatwasFavorites.length > 0 ? (
                fatwasFavorites.map(renderFavoriteCard)
              ) : (
                <div className="col-span-2 text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">لا توجد فتاوى مفضلة</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                لا توجد مفضلات بعد
              </h3>
              <p className="text-gray-600">
                ابدأ بحفظ المحاضرات والقصص والفتاوى المفضلة لديك
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}