import React, { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, ThumbsUp, Send, User, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "./LanguageContext";

export default function CommentsSection({ contentType, contentId, contentTitle }) {
  const { language } = useLanguage();
  const [user, setUser] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser({ ...authUser, role: 'user' });
      }
    } catch (error) {
      console.log("User not logged in");
    }
  };

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', contentType, contentId],
    queryFn: async () => {
      const { data, error } = await supabase.from('Comment').select('*').eq('content_type', contentType).eq('content_id', contentId).eq('is_approved', true);
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const addCommentMutation = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase.from('Comment').insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', contentType, contentId] });
      setCommentText("");
      setReplyingTo(null);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("يرجى تسجيل الدخول للتعليق");
      return;
    }
    if (!commentText.trim()) return;

    addCommentMutation.mutate({
      user_name: user.full_name,
      user_email: user.email,
      content_type: contentType,
      content_id: contentId,
      comment_text: commentText,
      parent_comment_id: replyingTo?.id || null
    });
  };

  const topLevelComments = comments.filter(c => !c.parent_comment_id);

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          التعليقات ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* نموذج إضافة تعليق */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {replyingTo && (
            <div className="bg-blue-50 p-3 rounded-lg flex items-center justify-between">
              <span className="text-sm text-blue-800">الرد على: {replyingTo.user_name}</span>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => setReplyingTo(null)}
              >
                إلغاء
              </Button>
            </div>
          )}
          <Textarea
            placeholder={user ? "اكتب تعليقك..." : "يرجى تسجيل الدخول للتعليق"}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={3}
            disabled={!user}
          />
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={!user || !commentText.trim() || addCommentMutation.isPending}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              <Send className="w-4 h-4 ml-2" />
              {addCommentMutation.isPending ? "جاري الإرسال..." : "إرسال"}
            </Button>
          </div>
        </form>

        {/* قائمة التعليقات */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : topLevelComments.length > 0 ? (
            <AnimatePresence>
              {topLevelComments.map((comment, index) => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  allComments={comments}
                  onReply={setReplyingTo}
                  index={index}
                  currentLanguage={language}
                />
              ))}
            </AnimatePresence>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>لا توجد تعليقات بعد. كن أول من يعلق!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function CommentItem({ comment, allComments, onReply, index, currentLanguage }) {
  const replies = allComments.filter(c => c.parent_comment_id === comment.id);
  const [translatedText, setTranslatedText] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (translatedText) {
      setTranslatedText(null);
      return;
    }
    setIsTranslating(true);
    try {
      const { data, error } = await supabase.functions.invoke('aiAssistant', {
        body: {
          action: 'translate_content',
          text: comment.comment_text,
          context: { targetLang: currentLanguage }
        }
      });
      if (error) throw error;
      setTranslatedText(data.translated_text);
    } catch (e) {
      console.error("Translation failed", e);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      className="space-y-3"
    >
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">{comment.user_name}</span>
              <span className="text-xs text-gray-500">
                {new Date(comment.created_date).toLocaleDateString('ar-SA')}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed mb-3">
              {comment.comment_text}
              {translatedText && (
                <span className="block mt-2 p-2 bg-blue-50 text-blue-800 text-sm rounded border border-blue-100">
                  <Globe className="w-3 h-3 inline mr-1" /> {translatedText}
                </span>
              )}
            </p>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-gray-500 hover:text-blue-600"
                onClick={handleTranslate}
                disabled={isTranslating}
              >
                <Globe className="w-4 h-4 ml-1" />
                {isTranslating ? "..." : translatedText ? "الأصل" : "ترجمة"}
              </Button>
              <Button 
                variant="ghost"
                size="sm" 
                className="text-blue-600 hover:text-blue-700"
                onClick={() => onReply(comment)}
              >
                <MessageCircle className="w-4 h-4 ml-1" />
                رد
              </Button>
              <div className="flex items-center gap-1 text-gray-500">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm">{comment.likes_count || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* الردود */}
      {replies.length > 0 && (
        <div className="mr-12 space-y-3">
          {replies.map((reply) => (
            <div key={reply.id} className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 text-sm">{reply.user_name}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(reply.created_date).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">{reply.comment_text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}