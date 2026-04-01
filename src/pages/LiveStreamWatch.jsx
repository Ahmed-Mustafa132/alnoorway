import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Radio, Users, Clock, Share2, ArrowRight } from "lucide-react";
import CommentsSection from "@/components/CommentsSection";
import RatingWidget from "@/components/RatingWidget";
import VideoPlayer from "@/components/VideoPlayer";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function LiveStreamWatch() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [stream, setStream] = useState(null);

  const { data: fetchedStream, isLoading } = useQuery({
    queryKey: ['live_stream', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase.from('LiveStream').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (fetchedStream) {
      setStream(fetchedStream);
    }
  }, [fetchedStream]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!stream) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">البث غير موجود</h1>
        <Link to={createPageUrl("LiveStreams")}>
          <Button>العودة للقائمة</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="mb-4">
          <Link to={createPageUrl("LiveStreams")} className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors">
            <ArrowRight className="w-5 h-5 ml-2" />
            عودة للبث المباشر
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg relative">
              <VideoPlayer 
                url={stream.is_live ? stream.stream_url : (stream.recording_url || stream.stream_url)} 
                title={stream.title} 
              />
              {stream.is_live && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-red-600 text-white animate-pulse">
                    <Radio className="w-3 h-3 ml-1" />
                    مباشر الآن
                  </Badge>
                </div>
              )}
            </div>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{stream.title}</h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="font-semibold text-purple-600">{stream.speaker}</span>
                      <span>•</span>
                      <span className="text-sm">{new Date(stream.scheduled_time).toLocaleString('ar-SA')}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex items-center gap-6 text-sm text-gray-500 border-t pt-4">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{stream.viewers_count} مشاهد</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{stream.is_live ? "بدأ البث" : "مجدول"}</span>
                  </div>
                </div>

                {stream.description && (
                  <p className="mt-4 text-gray-700 leading-relaxed">
                    {stream.description}
                  </p>
                )}
              </CardContent>
            </Card>

            {!stream.is_live && (
              <RatingWidget contentType="live_stream" contentId={stream.id} />
            )}
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-1">
            <div className="h-[calc(100vh-100px)] sticky top-6">
              <CommentsSection 
                contentType="live_stream" 
                contentId={stream.id} 
                contentTitle={stream.title} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}