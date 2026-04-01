import React, { useState } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Send, Clock, User } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function FatwaModeration() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [answer, setAnswer] = useState("");
  const [publish, setPublish] = useState(false);
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['fatwa_requests_pending'],
    queryFn: async () => {
      const { data, error } = await supabase.from('FatwaRequest')
        .select('*')
        .eq('status', 'pending')
        .order('created_date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const answerMutation = useMutation({
    mutationFn: async ({ requestId, answerText, shouldPublish, requestData }) => {
      // 1. Update request status
      const { error: updateError } = await supabase.from('FatwaRequest').update({
        status: 'answered',
        answer: answerText,
        answered_by: 'Moderator' // Ideally get current user name
      }).eq('id', requestId);
      if (updateError) throw updateError;

      // 2. Publish to public Fatwa table if requested
      if (shouldPublish) {
        const { error: insertError } = await supabase.from('Fatwa').insert({
          question: requestData.question,
          answer: answerText,
          category: requestData.category,
          mufti: 'لجنة الفتوى', // Or specific mufti
          created_date: new Date().toISOString()
        });
        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fatwa_requests_pending'] });
      toast.success("تم إرسال الإجابة بنجاح");
      setSelectedRequest(null);
      setAnswer("");
    },
    onError: (err) => toast.error("حدث خطأ: " + err.message)
  });

  const handleReject = async (id) => {
      if(confirm('هل أنت متأكد من رفض هذا الطلب؟')) {
          await supabase.from('FatwaRequest').update({ status: 'rejected' }).eq('id', id);
          queryClient.invalidateQueries({ queryKey: ['fatwa_requests_pending'] });
          toast.success("تم رفض الطلب");
      }
  };

  const handleSubmit = () => {
    if (!answer.trim()) return;
    answerMutation.mutate({
      requestId: selectedRequest.id,
      answerText: answer,
      shouldPublish: publish,
      requestData: selectedRequest
    });
  };

  if (isLoading) return <div>جاري التحميل...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">طلبات الفتاوى المعلقة</h2>
        <Badge variant="outline">{requests?.length || 0} طلب</Badge>
      </div>

      <div className="grid gap-4">
        {requests?.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">لا توجد طلبات معلقة</div>
        )}
        
        {requests?.map(req => (
          <Card key={req.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                   <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900">{req.name}</span>
                      <span className="text-xs text-gray-500">{new Date(req.created_date).toLocaleDateString('ar-SA')}</span>
                   </div>
                   <Badge variant="secondary" className="mb-2">{req.category}</Badge>
                   <p className="font-medium text-lg text-gray-800">{req.question}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setSelectedRequest(req)}>
                    <Send className="w-4 h-4 ml-2" /> إجابة
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleReject(req.id)}>
                    <XCircle className="w-4 h-4 ml-2" /> رفض
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>إجابة الفتوى</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">السؤال:</p>
              <p className="font-medium">{selectedRequest?.question}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">نص الإجابة</label>
              <Textarea 
                value={answer} 
                onChange={(e) => setAnswer(e.target.value)} 
                rows={6}
                placeholder="اكتب الإجابة هنا..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="publish" 
                checked={publish} 
                onChange={(e) => setPublish(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="publish" className="text-sm text-gray-700">نشر في أرشيف الفتاوى العام</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>إلغاء</Button>
            <Button onClick={handleSubmit} disabled={answerMutation.isPending}>
              {answerMutation.isPending ? "جاري الإرسال..." : "إرسال الإجابة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}