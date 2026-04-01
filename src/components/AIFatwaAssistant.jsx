import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Bot, User, AlertTriangle } from "lucide-react";
import { supabase } from "@/components/api/supabaseClient";
import { motion } from "framer-motion";

export default function AIFatwaAssistant() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleAskAI = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('aiAssistant', {
        body: {
          action: 'fatwa_assist',
          text: query
        }
      });
      
      if (error) throw error;
      setResponse(data); // Assuming string response based on function update
    } catch (error) {
      console.error("AI Error:", error);
      alert("حدث خطأ أثناء الاتصال بالمساعد الذكي");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-white mb-8 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <CardTitle className="text-xl">مساعد الفتاوى الذكي</CardTitle>
            <p className="text-emerald-100 text-sm opacity-90">احصل على إجابات أولية مدعومة بالذكاء الاصطناعي</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex gap-3 items-start">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            <strong>تنبيه هام:</strong> هذا المساعد يعمل بالذكاء الاصطناعي وقد يحتمل الخطأ. الإجابات المقدمة هنا للاسترشاد فقط ولا تغني عن استشارة العلماء المتخصصين.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex gap-2">
            <Input
              placeholder="اكتب سؤالك الشرعي هنا..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 py-6 text-lg"
              onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
            />
            <Button 
              onClick={handleAskAI} 
              disabled={loading || !query.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 px-6"
            >
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Send className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {response && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 rounded-xl p-6 border border-gray-100"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1">إجابة المساعد الذكي:</h4>
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {response}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
              <Button variant="outline" size="sm" className="text-gray-500">
                نسخ الإجابة
              </Button>
              <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                عرض فتاوى مشابهة
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}