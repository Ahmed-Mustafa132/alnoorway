import React, { useState } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import ArticleCard from "@/components/ArticleCard";
// AI Assistant removed from public page

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const { data: articles, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Article').select('*').eq('is_published', true).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const filteredArticles = articles.filter(article => 
    article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-6 py-3 rounded-full mb-6">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-semibold">المدونة الإسلامية</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            مقالات ومقالات مختارة
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            محتوى متجدد يثري معرفتك ويجيب عن تساؤلاتك
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10">
          <div className="relative w-full md:w-96">
            <Input
              placeholder="ابحث في المقالات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 py-6 text-lg bg-white shadow-sm"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* AI Generator moved to Admin Dashboard */}
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ArticleCard article={article} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-400">لا توجد مقالات منشورة بعد</h3>
            <p className="text-gray-500 mt-2">تابعنا لقراءة أحدث المقالات قريباً.</p>
          </div>
        )}
      </div>
    </div>
  );
}