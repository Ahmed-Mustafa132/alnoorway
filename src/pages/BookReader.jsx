import React, { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react"; // Removed ArrowRight, Download, Heart
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

// New imports
import CommentsSection from "@/components/CommentsSection";
import RatingWidget from "@/components/RatingWidget";
import ShareButtons from "@/components/ShareButtons";

export default function BookReader() {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('id');

  const [fontSize, setFontSize] = useState(parseInt(localStorage.getItem('readerFontSize') || '18'));

  const { data: book, isLoading } = useQuery({
    queryKey: ['book', bookId],
    queryFn: async () => {
      const { data: books, error } = await supabase.from('Book').select('*').eq('id', bookId);
      if (error) throw error;
      return books[0];
    },
    enabled: !!bookId,
  });

  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleSummarize = async () => {
      setIsSummarizing(true);
      try {
          // Use description or first chunk of content for summary if content is large
          const textToSummarize = book.description + (book.content ? " " + book.content.substring(0, 1000) : "");
          const { data, error } = await supabase.functions.invoke('aiAssistant', {
              body: {
                  action: 'summarize',
                  text: textToSummarize
              }
          });
          
          if (error) throw error;

          if (data && data.summary) {
              setSummary(data.summary);
          }
      } catch (e) {
          console.error(e);
      } finally {
          setIsSummarizing(false);
      }
  };

  const handleFontSizeChange = (change) => {
    const newSize = fontSize + change;
    if (newSize >= 14 && newSize <= 28) {
      setFontSize(newSize);
      localStorage.setItem('readerFontSize', newSize.toString());
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">الكتاب غير موجود</h2>
            <Link to={createPageUrl("Library")}>
              <Button className="mt-4">العودة إلى المكتبة</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link to={createPageUrl("Library")}>
            <Button variant="outline">
              ← العودة للمكتبة
            </Button>
          </Link>

          <ShareButtons
            title={book.title}
            description={`كتاب ${book.author}`}
          />
        </div>

        {/* AI Summary Section */}
        <div className="mb-6 flex justify-end">
            <Button 
                onClick={handleSummarize} 
                disabled={isSummarizing || summary}
                variant="outline"
                className="gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
            >
                <BookOpen className="w-4 h-4" />
                {isSummarizing ? "جاري التلخيص..." : "تلخيص الكتاب بالذكاء الاصطناعي"}
            </Button>
        </div>
        
        {summary && (
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl p-6"
            >
                <h3 className="text-lg font-bold text-purple-900 dark:text-purple-300 mb-3">ملخص الذكاء الاصطناعي</h3>
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">{summary}</p>
            </motion.div>
        )}

        <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm overflow-hidden">
          {book.pdf_url ? (
             <div className="w-full h-[80vh]">
                <iframe 
                   src={book.pdf_url} 
                   className="w-full h-full border-0" 
                   title={book.title}
                />
             </div>
          ) : (
             <CardContent className="p-8 md:p-12">
               <div className="mb-8 pb-6 border-b dark:border-gray-700">
                 <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">{book.title}</h1>
                 <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">{book.author}</p>
                 {book.pages && <p className="text-sm text-gray-500 dark:text-gray-500">{book.pages} صفحة</p>}
               </div>

               <div
                 className="prose prose-lg max-w-none leading-relaxed text-gray-800 dark:text-gray-200"
                 style={{ fontSize: `${fontSize}px`, lineHeight: '2' }}
               >
                 {book.content ? (
                   <div className="whitespace-pre-wrap">{book.content}</div>
                 ) : (
                   <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                     <p>المحتوى غير متاح للقراءة المباشرة</p>
                   </div>
                 )}
               </div>
             </CardContent>
          )}
        </Card>

        <div className="mt-12 space-y-6">
          <RatingWidget
            contentType="book"
            contentId={book.id}
          />

          <CommentsSection
            contentType="book"
            contentId={book.id}
            contentTitle={book.title}
          />
        </div>
      </div>
    </div>
  );
}