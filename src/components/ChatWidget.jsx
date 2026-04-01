import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bot, Send, X, MessageCircle, Minimize2, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/components/api/supabaseClient";
import ReactMarkdown from "react-markdown";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'مرحباً! أنا المرشد الآلي. كيف يمكنني مساعدتك اليوم في تطبيق طريق النور؟' }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('aiAssistant', {
        body: {
          action: 'chat',
          prompt: `You are a helpful support chatbot for "Al-Nour Way" app.
          User Question: ${input}
          Context: The app provides lectures, books, fatwas, courses, and more.
          Answer briefly and politely in Arabic.
          `
        }
      });

      if (error) throw error;
      
      // Handle simple response format from function (assuming it returns { text: "..." })
      const text = data?.text || data?.content || (typeof data === 'string' ? data : "عذراً، لم أفهم ذلك.");
      
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "عذراً، حدث خطأ في الاتصال." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-80 md:w-96 shadow-2xl rounded-2xl overflow-hidden border border-gray-100"
          >
            <Card className="border-0 h-[500px] flex flex-col bg-white">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white flex flex-row justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  <span className="font-bold">المرشد الآلي</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                    <Minimize2 className="w-4 h-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 flex flex-col overflow-hidden bg-gray-50">
                <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-emerald-600 text-white rounded-tr-none' 
                          : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm'
                      }`}>
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-3 shadow-sm">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3 bg-white border-t border-gray-100 shrink-0">
                  <form onSubmit={handleSend} className="flex gap-2">
                    <Input 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="اكتب سؤالك..."
                      className="flex-1 text-right"
                      dir="rtl"
                    />
                    <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
          isOpen ? 'bg-red-500 hover:bg-red-600 rotate-90' : 'bg-emerald-600 hover:bg-emerald-700'
        }`}
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-7 h-7 text-white" />}
      </motion.button>
    </div>
  );
}