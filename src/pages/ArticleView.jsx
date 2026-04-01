import React, { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, User, Share2, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ShareButtons from "@/components/ShareButtons";
import CommentsSection from "@/components/CommentsSection";

export default function ArticleView() {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('Article')
        .select('*')
        .eq('id', articleId)
        .single();
      
      if (error) throw error;
      setArticle(data);
    } catch (error) {
      console.error("Error fetching article:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!article) return <div className="min-h-screen flex items-center justify-center">المقال غير موجود</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Header Image */}
      <div className="h-[40vh] md:h-[50vh] relative w-full bg-gray-900">
        <img 
          src={article.image_url || "https://placehold.co/1200x600/1e293b/ffffff?text=Article"} 
          alt={article.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white max-w-5xl mx-auto">
          <div className="flex gap-2 mb-4">
            {article.category && <Badge className="bg-blue-600 hover:bg-blue-700">{article.category}</Badge>}
            {article.tags?.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-white border-white/30 backdrop-blur-sm">{tag}</Badge>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{article.title}</h1>
          <div className="flex items-center gap-6 text-sm md:text-base text-gray-300">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{article.author || 'طريق النور'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(article.created_at).toLocaleDateString('ar-SA')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 md:p-12 -mt-10 relative z-10 bg-white rounded-t-3xl md:rounded-3xl shadow-xl min-h-[500px]">
        <Link to={createPageUrl("Blog")}>
          <Button variant="ghost" className="mb-8 pl-0 hover:pl-2 transition-all">
            <ArrowRight className="w-4 h-4 ml-2" />
            العودة للمدونة
          </Button>
        </Link>

        <div className="prose prose-lg prose-blue max-w-none mb-12 leading-loose text-gray-800">
          {article.content.split('\n').map((paragraph, idx) => (
            <p key={idx} className="mb-6">{paragraph}</p>
          ))}
        </div>

        <div className="border-t pt-8">
          <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            مشاركة المقال
          </h3>
          <ShareButtons title={article.title} description={article.meta_description} />
        </div>

        <div className="mt-12">
          <CommentsSection contentType="article" contentId={article.id} contentTitle={article.title} />
        </div>
      </div>
    </div>
  );
}