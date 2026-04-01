import React from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Trash2, MessageCircle, Star } from "lucide-react";
import { toast } from "sonner";

export default function CommentsModeration() {
  const queryClient = useQueryClient();

  // --- Comments ---
  const { data: pendingComments } = useQuery({
    queryKey: ['admin_pending_comments'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Comment')
        .select('*')
        .eq('is_approved', false)
        .order('created_date', { ascending: false });
      if (error) throw error;
      return data;
    },
    initialData: []
  });

  const approveCommentMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('Comment').update({ is_approved: true }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_pending_comments'] });
      toast.success("تمت الموافقة على التعليق");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('Comment').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_pending_comments'] });
      toast.success("تم حذف التعليق");
    },
  });

  // --- Ratings ---
  // Assuming ratings don't need approval but moderation means checking reports or low quality
  // For this context, we will list all ratings to allow deletion of inappropriate ones
  const { data: allRatings } = useQuery({
    queryKey: ['admin_ratings_mod'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Rating').select('*').order('created_date', { ascending: false }).limit(50);
      if (error) throw error;
      return data;
    },
    initialData: []
  });

  const deleteRatingMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('Rating').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_ratings_mod'] });
      toast.success("تم حذف التقييم");
    },
  });

  return (
    <Tabs defaultValue="comments" className="space-y-6">
      <TabsList>
        <TabsTrigger value="comments" className="gap-2">
          <MessageCircle className="w-4 h-4" />
          التعليقات المعلقة ({pendingComments.length})
        </TabsTrigger>
        <TabsTrigger value="ratings" className="gap-2">
          <Star className="w-4 h-4" />
          إدارة التقييمات
        </TabsTrigger>
      </TabsList>

      <TabsContent value="comments" className="space-y-4">
        {pendingComments.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">لا توجد تعليقات معلقة</div>
        ) : (
          pendingComments.map(comment => (
            <Card key={comment.id}>
              <CardContent className="p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">{comment.user_name}</span>
                    <span className="text-xs text-gray-500">على {comment.content_type}</span>
                  </div>
                  <p className="text-gray-800">{comment.comment_text}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(comment.created_date).toLocaleString('ar-SA')}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => approveCommentMutation.mutate(comment.id)}
                  >
                    <CheckCircle className="w-4 h-4 ml-2" /> موافقة
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => { if(confirm('حذف؟')) deleteCommentMutation.mutate(comment.id) }}
                  >
                    <Trash2 className="w-4 h-4 ml-2" /> حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>

      <TabsContent value="ratings" className="space-y-4">
        {allRatings.map(rating => (
          <Card key={rating.id}>
             <CardContent className="p-4 flex flex-col md:flex-row gap-4 justify-between items-start">
               <div className="flex-1">
                 <div className="flex items-center gap-2 mb-2">
                   <div className="flex text-amber-500">
                     {[...Array(rating.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                   </div>
                   <span className="text-sm text-gray-600">بواسطة {rating.user_email}</span>
                 </div>
                 {rating.review && <p className="text-gray-800">{rating.review}</p>}
                 <p className="text-xs text-gray-400 mt-2">{rating.content_type} #{rating.content_id}</p>
               </div>
               <Button 
                 size="sm" 
                 variant="outline" 
                 className="text-red-600 hover:bg-red-50"
                 onClick={() => { if(confirm('حذف هذا التقييم؟')) deleteRatingMutation.mutate(rating.id) }}
               >
                 <Trash2 className="w-4 h-4" />
               </Button>
             </CardContent>
          </Card>
        ))}
      </TabsContent>
    </Tabs>
  );
}