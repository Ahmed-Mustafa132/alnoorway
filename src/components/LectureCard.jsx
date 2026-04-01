import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Mic, Clock, User, Share2, Heart } from "lucide-react";
import VideoPlayer from "./VideoPlayer";
import { motion } from "framer-motion";
import { supabase } from "@/components/api/supabaseClient";
import { toast } from "sonner";

export default function LectureCard({ lecture, isDetailView = false, onClick }) {
  const [isFavorited, setIsFavorited] = React.useState(false);

  React.useEffect(() => {
    checkFavorite();
  }, [lecture.id]);

  const checkFavorite = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('Favorite')
        .select('id')
        .eq('user_email', user.email)
        .eq('item_id', lecture.id)
        .single();
      setIsFavorited(!!data);
    }
  };

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("يرجى تسجيل الدخول للإضافة للمفيدة");
      return;
    }

    if (isFavorited) {
      await supabase.from('Favorite').delete().eq('user_email', user.email).eq('item_id', lecture.id);
      setIsFavorited(false);
      toast.success("تم الحذف من المفضلة");
    } else {
      await supabase.from('Favorite').insert({
        user_email: user.email,
        item_type: 'lecture',
        item_id: lecture.id,
        item_title: lecture.title,
        item_data: lecture
      });
      setIsFavorited(true);
      toast.success("تم الإضافة للمفيدة");
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: lecture.title,
        text: lecture.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("تم نسخ الرابط");
    }
  };

  if (isDetailView) {
    return (
      <Card className="border-0 shadow-xl overflow-hidden bg-white">
        <div className="w-full">
          {lecture.type === 'video' && lecture.url ? (
            <VideoPlayer url={lecture.url} title={lecture.title} />
          ) : (
            <div className="aspect-video bg-gray-900 flex items-center justify-center text-white">
              <Mic className="w-16 h-16" />
            </div>
          )}
        </div>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{lecture.title}</h1>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                <span className="font-semibold">{lecture.speaker}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="w-5 h-5 text-gray-600" />
              </Button>
              <Button 
                variant={isFavorited ? "default" : "outline"} 
                size="icon" 
                onClick={toggleFavorite}
                className={isFavorited ? "bg-rose-500 hover:bg-rose-600 border-rose-500" : ""}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? "text-white fill-current" : "text-rose-500"}`} />
              </Button>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <Badge variant="secondary" className="bg-purple-50 text-purple-700">
              {lecture.category}
            </Badge>
            {lecture.duration && (
              <Badge variant="outline" className="flex gap-1">
                <Clock className="w-3 h-3" />
                {lecture.duration}
              </Badge>
            )}
          </div>

          <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {lecture.description}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col group overflow-hidden bg-white/80 backdrop-blur-sm">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={lecture.thumbnail_url || "https://placehold.co/600x400/e2e8f0/1e293b?text=Lecture"} 
          alt={lecture.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
            {lecture.type === 'video' ? <Play className="w-6 h-6 text-white fill-current" /> : <Mic className="w-6 h-6 text-white" />}
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {lecture.duration || '00:00'}
        </div>
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="mb-2">
          <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-700 mb-2">
            {lecture.category}
          </Badge>
          <h3 className="font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-purple-700 transition-colors">
            {lecture.title}
          </h3>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <User className="w-3 h-3" />
            {lecture.speaker}
          </p>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2 mt-auto">
          {lecture.description}
        </p>
      </CardContent>
    </Card>
  );
}