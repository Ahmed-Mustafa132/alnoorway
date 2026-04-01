import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, User, Sparkles, Loader2, Video, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
// Removed base44 import

export default function AIGuide() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "السلام عليكم ورحمة الله وبركاته! 🌟\n\nمرحباً بك في المرشد الإسلامي الذكي. أنا هنا لمساعدتك في:\n📖 التعرف على أركان الإسلام والإيمان\n🕌 فهم المبادئ والقيم الإسلامية\n📚 معرفة قصص الأنبياء\n💚 الإرشاد نحو المصادر التعليمية\n\nكيف يمكنني مساعدتك اليوم؟"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Lectures are fetched dynamically inside handleSend to provide context

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Fetch relevant lectures to provide as context
      const { data: lecturesList } = await supabase.from('Lecture').select('*').limit(10).order('created_date', { ascending: false });
      const lecturesContext = lecturesList?.map(l => `- ${l.title} by ${l.speaker} (Topic: ${l.topic})`).join("\n") || "";

      // Fetch Books and User Preferences for deeper context
      const { data: booksList } = await supabase.from('Book').select('*').limit(5);
      const booksContext = booksList?.map(b => `- Book: ${b.title} by ${b.author}`).join("\n") || "";
      
      const { data: { user } } = await supabase.auth.getUser();
      let userContext = "";
      if (user) {
         const { data: prefs } = await supabase.from('UserPreference').select('*').eq('user_email', user.email);
         if (prefs && prefs.length > 0) {
             userContext = `User Interests: ${prefs[0].interested_topics?.join(", ")}`;
         }
      }

      const prompt = `
          You are a helpful, knowledgeable, and polite Islamic Guide Assistant named "المرشد الإسلامي".
          Your goal is to help users learn about Islam, answer their questions based on mainstream Islamic teachings (Quran and Sunnah), and guide them to resources within the app "طريق النور" (Al-Nour Way).
          
          Context about the app:
          - "طريق النور" is an app for learning Islam, asking fatwas, listening to lectures, and connecting with scholars.
          - We have sections for: Learn Islam, Repentance, Fatwa, Live Streams, Reconciliation, Stories, Library (Books), and more.
          
          User Context:
          ${userContext}

          Available Resources Context:
          Lectures:
          ${lecturesContext}
          
          Books:
          ${booksContext}
          
          Instructions:
          - Answer in ARABIC only.
          - Be gentle, welcoming, and wise.
          - If the question involves complex Fiqh (jurisprudence) issues that require a Fatwa, advise the user to use the "طلب فتوى" (Request Fatwa) feature in the app or contact a scholar directly via "تواصل مع مفتي". Do not give specific fatwas yourself if it's complex.
          - For general questions (beliefs, stories, history, general ethics), provide clear and accurate answers.
          - Analyze the user's question and their interests (if provided).
          - RECOMMEND RESOURCES: If you find relevant lectures or books in the context provided above, YOU MUST recommend them.
          - FORMATTING: Use Markdown for the text. 
          - IMPORTANT: If you recommend specific resources from the list, append a special JSON block at the VERY END of your response (after all text) in this format:
            [[RECOMMENDATIONS]]
            [
              {"type": "lecture", "title": "Exact Title", "reason": "Why relevance"},
              {"type": "book", "title": "Exact Title", "reason": "Why relevance"}
            ]
            [[/RECOMMENDATIONS]]
            If no specific resources from the list are relevant, do not include this block.
          
          User Question: ${input}
      `;

      // Call AI Assistant function via Supabase
      const { data: res, error } = await supabase.functions.invoke('aiAssistant', {
          body: {
              action: 'chat',
              prompt: prompt
          }
      });

      if (error) throw error;

      // Parse response for recommendations
      // Assuming res returns { text: "..." } or similar, adapting based on typical response
      let content = res?.text || res || ""; // Fallback

      let recommendations = [];
      const recRegex = /\[\[RECOMMENDATIONS\]\]([\s\S]*?)\[\[\/RECOMMENDATIONS\]\]/;
      const match = res.match(recRegex);
      
      if (match && match[1]) {
        try {
          recommendations = JSON.parse(match[1]);
          content = res.replace(recRegex, "").trim();
        } catch (e) {
          console.error("Failed to parse recommendations", e);
        }
      }

      const aiMessage = { role: "assistant", content: content, recommendations: recommendations }; 
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage = { role: "assistant", content: "عذراً، حدث خطأ أثناء الاتصال بالمرشد الذكي. يرجى المحاولة مرة أخرى." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-700 via-teal-600 to-teal-800 p-4 md:p-6 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-emerald-100 px-6 py-3 rounded-full mb-4 shadow-sm">
            <Bot className="w-6 h-6 text-emerald-600" />
            <span className="text-blue-800 font-bold text-lg">المرشد الإسلامي الذكي</span>
          </div>
          <p className="text-white/90 text-lg">
            اسأل عن الإسلام، العقيدة، الأخلاق، والتاريخ الإسلامي
          </p>
        </motion.div>

        <Card className="flex-1 border-0 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden flex flex-col min-h-[600px] rounded-3xl">
          <CardContent className="flex-1 p-0 flex flex-col">
            <ScrollArea className="flex-1 p-4 md:p-6">
              <div className="space-y-6">
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                      msg.role === "user" 
                        ? "bg-gradient-to-br from-blue-500 to-blue-600" 
                        : "bg-gradient-to-br from-emerald-500 to-emerald-600"
                    }`}>
                      {msg.role === "user" ? <User className="w-5 h-5 text-white" /> : <Sparkles className="w-5 h-5 text-white" />}
                    </div>
                    
                    <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                      msg.role === "user"
                        ? "bg-blue-50 text-blue-900 rounded-tr-none"
                        : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                    }`}>
                      <div className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                      {msg.recommendations && msg.recommendations.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <p className="text-xs font-bold text-gray-500 mb-2">مصادر مقترحة لك:</p>
                          <div className="space-y-2">
                            {msg.recommendations.map((rec, i) => (
                              <div key={i} className="bg-gray-50 p-2 rounded-lg text-sm border border-gray-100 hover:bg-emerald-50 transition-colors cursor-pointer">
                                <div className="flex items-center gap-2 font-semibold text-emerald-700">
                                  {rec.type === 'lecture' ? <Video className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                                  {rec.title}
                                </div>
                                <div className="text-gray-500 text-xs mt-0.5">{rec.reason}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-4 shadow-sm">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-hide">
                {[
                  { text: "ما هي أركان الإسلام؟", icon: "🕌" },
                  { text: "كيف أتوب إلى الله؟", icon: "💚" },
                  { text: "قصة النبي يوسف", icon: "📖" },
                  { text: "فضل الصلاة", icon: "🤲" }
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(suggestion.text)}
                    className="bg-white border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 px-4 py-3 rounded-2xl text-sm transition-all whitespace-nowrap flex items-center gap-2 shadow-sm"
                  >
                    <span className="text-2xl">{suggestion.icon}</span>
                    <span className="text-gray-700 font-medium">{suggestion.text}</span>
                  </button>
                ))}
              </div>
              <form onSubmit={handleSend} className="relative flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="اكتب سؤالك هنا..."
                  className="flex-1 pr-4 pl-12 py-6 text-lg rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  disabled={!input.trim() || isLoading}
                  className="absolute left-2 top-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg w-10 h-10 p-0 flex items-center justify-center transition-all"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
              <p className="text-xs text-gray-400 text-center mt-3">
                ملاحظة: هذا نظام ذكاء اصطناعي للمساعدة العامة، يرجى استشارة العلماء في المسائل الفقهية المعقدة.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}