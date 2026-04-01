import React, { useState } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, Sparkles, Save, Copy } from "lucide-react";
import { toast } from "sonner";
import { invokeAIAssistant as aiAssistant } from "@/functions/aiAssistant";

export default function AIContentGenerator() {
  const [activeTab, setActiveTab] = useState("lecture");
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  const handleGenerate = async (action) => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await aiAssistant({ action, text: input });
      setResult(response.data);
      toast.success("تم توليد المحتوى بنجاح");
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("حدث خطأ أثناء التوليد");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (entity, data) => {
    try {
      const { error } = await supabase.from(entity).insert(data);
      if (error) throw error;
      toast.success(`تم حفظ ${entity} بنجاح`);
      setResult(null);
      setInput("");
    } catch (error) {
      console.error("Error saving content:", error);
      toast.error("حدث خطأ أثناء الحفظ");
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setResult(null); setInput(""); }}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lecture">توليد محاضرة</TabsTrigger>
          <TabsTrigger value="story">توليد قصة</TabsTrigger>
          <TabsTrigger value="fatwa">مسودة فتوى</TabsTrigger>
          <TabsTrigger value="article">كتابة مقال</TabsTrigger>
        </TabsList>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {activeTab === "lecture" ? "موضوع المحاضرة / كلمات مفتاحية" :
               activeTab === "story" ? "موضوع القصة / حدث تاريخي" :
               activeTab === "article" ? "موضوع المقال / الكلمات المفتاحية" :
               "السؤال الشرعي"}
            </label>
            <Textarea 
              placeholder="اكتب هنا..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={4}
            />
          </div>

          <Button 
            onClick={() => handleGenerate(
              activeTab === "lecture" ? "generate_lecture" :
              activeTab === "story" ? "generate_story" :
              activeTab === "article" ? "generate_article" :
              "generate_fatwa_answer"
            )}
            disabled={loading || !input.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Sparkles className="w-4 h-4 ml-2" />}
            توليد المحتوى باستخدام AI
          </Button>
        </div>

        {result && (
          <Card className="mt-8 border-2 border-purple-100">
            <CardHeader className="bg-purple-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                النتيجة المولدة
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {activeTab === "lecture" && (
                <div className="space-y-3">
                  <div><strong>العنوان:</strong> {result.title}</div>
                  <div><strong>المتحدث المقترح:</strong> {result.speaker}</div>
                  <div><strong>الموضوع:</strong> {result.topic}</div>
                  <div><strong>المدة المقدرة:</strong> {result.duration}</div>
                  <div className="p-3 bg-gray-50 rounded text-sm whitespace-pre-wrap">{result.description}</div>
                  <Button onClick={() => handleSave("Lecture", {
                    title: result.title,
                    speaker: result.speaker,
                    description: result.description,
                    topic: result.topic,
                    duration: result.duration,
                    category: "learn_islam", // Default
                    type: "video" // Default
                  })} className="w-full mt-4 bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 ml-2" /> حفظ في المحاضرات
                  </Button>
                </div>
              )}

              {activeTab === "story" && (
                <div className="space-y-3">
                  <div><strong>العنوان:</strong> {result.title}</div>
                  <div><strong>المؤلف:</strong> {result.author}</div>
                  <div><strong>التصنيف:</strong> {result.category === 'convert' ? 'قصص المهتدين' : 'قصص التائبين'}</div>
                  <div className="p-3 bg-gray-50 rounded text-sm whitespace-pre-wrap">{result.content}</div>
                  <Button onClick={() => handleSave("Story", {
                    title: result.title,
                    author: result.author,
                    content: result.content,
                    excerpt: result.excerpt,
                    category: result.category || "convert"
                  })} className="w-full mt-4 bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 ml-2" /> حفظ في القصص
                  </Button>
                </div>
              )}

              {activeTab === "fatwa" && (
                <div className="space-y-3">
                  <div><strong>السؤال:</strong> {input}</div>
                  <div><strong>المفتي المقترح:</strong> {result.mufti}</div>
                  <div><strong>التصنيف:</strong> {result.category}</div>
                  <div className="p-3 bg-gray-50 rounded text-sm whitespace-pre-wrap">{result.answer}</div>
                  {result.reference && <div><strong>المرجع:</strong> {result.reference}</div>}
                  <Button onClick={() => handleSave("Fatwa", {
                    question: input,
                    answer: result.answer,
                    mufti: result.mufti,
                    category: result.category,
                    reference: result.reference
                  })} className="w-full mt-4 bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 ml-2" /> حفظ في الفتاوى
                  </Button>
                </div>
              )}

              {activeTab === "article" && (
                <div className="space-y-3">
                  <div><strong>العنوان المقترح:</strong> {result.title}</div>
                  <div className="flex gap-2 flex-wrap">
                    {result.tags?.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{tag}</span>
                    ))}
                  </div>
                  <div className="p-3 bg-gray-50 rounded text-sm border-l-4 border-yellow-400">
                    <strong>وصف الميتا:</strong> {result.meta_description}
                  </div>
                  <div className="p-3 bg-white border rounded text-sm whitespace-pre-wrap leading-relaxed">{result.content}</div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => handleGenerate("suggest_titles")} variant="outline" className="flex-1">
                      <Sparkles className="w-4 h-4 ml-2" /> اقتراح عناوين أخرى
                    </Button>
                    <Button onClick={() => handleGenerate("generate_meta_description")} variant="outline" className="flex-1">
                      <Sparkles className="w-4 h-4 ml-2" /> توليد وصف ميتا آخر
                    </Button>
                  </div>

                  <Button onClick={() => handleSave("Article", {
                    title: result.title,
                    content: result.content,
                    tags: result.tags,
                    meta_description: result.meta_description,
                    is_published: true
                  })} className="w-full mt-2 bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 ml-2" /> حفظ المقال
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </Tabs>
    </div>
  );
}