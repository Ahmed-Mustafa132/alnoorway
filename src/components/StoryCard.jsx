import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Heart, BookOpen, Quote, MapPin } from "lucide-react";
import { supabase } from "@/components/api/supabaseClient";
import { toast } from "sonner";

export default function StoryCard({ story, isDetailView = false, onClick }) {
  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: story.excerpt,
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
        {story.image_url && (
          <div className="w-full h-64 md:h-96 relative">
            <img 
              src={story.image_url} 
              alt={story.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 right-6 text-white">
              <Badge className="bg-amber-500 hover:bg-amber-600 mb-2">
                {story.category === 'convert' ? 'قصة هداية' : 'قصة توبة'}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold shadow-sm">{story.title}</h1>
            </div>
          </div>
        )}
        <CardContent className="p-6 md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b">
            <div className="flex items-center gap-4">
              {story.author && (
                <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-1 rounded-full">
                  <BookOpen className="w-4 h-4" />
                  <span className="font-semibold">الراوي: {story.author}</span>
                </div>
              )}
              {story.country && (
                <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-3 py-1 rounded-full">
                  <MapPin className="w-4 h-4" />
                  <span>{story.country}</span>
                </div>
              )}
            </div>
            <Button onClick={handleShare} variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              مشاركة القصة
            </Button>
          </div>

          <div className="prose prose-lg max-w-none">
            {story.content.split('\n').map((paragraph, idx) => (
              <p key={idx} className="mb-4 text-gray-700 leading-loose text-lg">
                {paragraph}
              </p>
            ))}
          </div>

          {story.source && (
            <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100 text-sm text-amber-800 flex items-start gap-2">
              <Quote className="w-5 h-5 flex-shrink-0 mt-1" />
              <div>
                <strong>المصدر: </strong> {story.source}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col group overflow-hidden bg-white">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={story.image_url || "https://placehold.co/600x400/fef3c7/78350f?text=Story"} 
          alt={story.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-white/90 text-amber-800 hover:bg-white">
            {story.category === 'convert' ? 'هداية' : 'توبة'}
          </Badge>
        </div>
      </div>
      <CardContent className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors">
          {story.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">
          {story.excerpt || story.content}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-4 border-t">
          <div className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {story.author || 'مجهول'}
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            قراءة المزيد
          </div>
        </div>
      </CardContent>
    </Card>
  );
}