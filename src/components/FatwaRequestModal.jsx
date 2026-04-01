import React, { useState } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";

export default function FatwaRequestModal({ open, onClose }) {
  const queryClient = useQueryClient();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    question: "",
    category: ""
  });

  const createRequestMutation = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase.from('FatwaRequest').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fatwa_requests'] });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setFormData({
          name: "",
          email: "",
          question: "",
          category: ""
        });
      }, 2000);
    },
    onError: (error) => {
      console.error("Fatwa request error:", error);
      // alert("حدث خطأ أثناء إرسال السؤال: " + error.message);
      // Using a fallback alert since toast might not be imported here or handled in mutation
      // But better to let the UI show state.
      // We will rely on isError state if needed, but alert is safest for immediate feedback.
      alert("عذراً، حدث خطأ أثناء إرسال السؤال. يرجى المحاولة مرة أخرى.");
    }
  });

  const [isRefining, setIsRefining] = useState(false);
  const [refinedQuestion, setRefinedQuestion] = useState("");

  const handleRefine = async () => {
      if (!formData.question || formData.question.length < 10) return;
      setIsRefining(true);
      try {
          const { data, error } = await supabase.functions.invoke('aiAssistant', {
              body: {
                  action: 'refine_question',
                  text: formData.question
              }
          });
          
          if (error) throw error;

          if (data && data.refined_text) {
              setRefinedQuestion(data.refined_text);
          }
      } catch (e) {
          console.error(e);
      } finally {
          setIsRefining(false);
      }
  };

  const useRefined = () => {
      setFormData({ ...formData, question: refinedQuestion });
      setRefinedQuestion("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createRequestMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">تم إرسال السؤال بنجاح</h3>
            <p className="text-gray-600">تم استقبال رسالتكم وسيتم الرد عليها في أقرب وقت</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl text-center">إرسال سؤال شرعي</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">التصنيف</Label>
                <Input
                  id="category"
                  placeholder="مثال: العبادات، المعاملات، الأحوال الشخصية..."
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="question">سؤالك الشرعي *</Label>
                <Textarea
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  placeholder="اكتب سؤالك بوضوح وتفصيل..."
                  rows={5}
                  required
                />
                 {/* AI Refine Button */}
                 <div className="flex justify-end">
                     <button 
                        type="button"
                        onClick={handleRefine}
                        disabled={isRefining || !formData.question}
                        className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1 mt-1"
                     >
                        <CheckCircle className="w-3 h-3" />
                        {isRefining ? "جاري التحسين..." : "تحسين الصياغة بالذكاء الاصطناعي"}
                     </button>
                 </div>
                 
                 {refinedQuestion && (
                     <div className="bg-purple-50 p-3 rounded-lg mt-2 border border-purple-100">
                         <p className="text-sm text-purple-900 font-medium mb-2">الاقتراح المحسن:</p>
                         <p className="text-sm text-gray-700 mb-2">{refinedQuestion}</p>
                         <div className="flex gap-2">
                             <Button type="button" size="sm" variant="outline" onClick={() => setRefinedQuestion("")}>تجاهل</Button>
                             <Button type="button" size="sm" onClick={useRefined} className="bg-purple-600 hover:bg-purple-700 text-white">استخدام</Button>
                         </div>
                     </div>
                 )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                disabled={createRequestMutation.isPending}
              >
                {createRequestMutation.isPending ? "جاري الإرسال..." : "إرسال السؤال"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}