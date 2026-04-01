import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Map, BookOpen, Clock, ArrowRight, CheckCircle, PenTool, BrainCircuit, Share2, Save, Trash2 } from "lucide-react";
// Removed invalid import
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/components/api/supabaseClient";
import ShareButtons from "@/components/ShareButtons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function AILearningPath() {
  const [loading, setLoading] = useState(false);
  const [learningPath, setLearningPath] = useState(null); // { id, path_data: [], completed_steps: [], notes: {} }
  const [user, setUser] = useState(null);
  
  // States for interactive features
  const [activeNoteStep, setActiveNoteStep] = useState(null);
  const [noteContent, setNoteContent] = useState("");
  const [activeQuizStep, setActiveQuizStep] = useState(null);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    checkUserAndPath();
  }, []);

  const checkUserAndPath = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      const { data, error } = await supabase
        .from('UserLearningPath')
        .select('*')
        .eq('user_email', user.email)
        .eq('status', 'active')
        .single();
      
      if (data) {
        setLearningPath(data);
      }
    }
  };

  const generatePath = async () => {
    if (!user) {
      toast.error("يرجى تسجيل الدخول لإنشاء مسار تعليمي");
      return;
    }
    setLoading(true);
    try {
      const context = {
        level: "beginner",
        interests: ["aqeedah", "seerah"],
        goal: "Learn basics of Islam"
      };

      const { data: responseData, error: fnError } = await supabase.functions.invoke('aiAssistant', {
        body: {
          action: 'generate_learning_path',
          context: context
        }
      });

      if (fnError) throw fnError;
      
      // The function returns the result directly, so we use responseData
      const data = responseData;
      if (!data || !data.steps) throw new Error("لم يتم استلام خطوات المسار");
      
      // Save to DB
      const pathObject = {
        user_email: user.email,
        path_data: data.steps,
        completed_steps: [],
        notes: {},
        status: 'active'
      };

      const { data: savedPath, error } = await supabase
        .from('UserLearningPath')
        .insert([pathObject])
        .select()
        .single();
      
      if (error) throw error;
      
      setLearningPath(savedPath);
      toast.success("تم إنشاء المسار التعليمي بنجاح!");

    } catch (error) {
      console.error("Error generating path:", error);
      toast.error("حدث خطأ أثناء إنشاء المسار: " + (error.message || "خطأ غير معروف"));
    } finally {
      setLoading(false);
    }
  };

  const toggleStepCompletion = async (stepIndex) => {
    if (!learningPath) return;
    
    let newCompleted = [...(learningPath.completed_steps || [])];
    if (newCompleted.includes(stepIndex)) {
      newCompleted = newCompleted.filter(i => i !== stepIndex);
    } else {
      newCompleted.push(stepIndex);
      toast.success("أحسنت! تم إكمال الخطوة.");
    }

    // Optimistic update
    setLearningPath({ ...learningPath, completed_steps: newCompleted });

    const { error } = await supabase
      .from('UserLearningPath')
      .update({ completed_steps: newCompleted })
      .eq('id', learningPath.id);

    if (error) {
      toast.error("فشل حفظ التقدم");
      // Revert if needed
    }
  };

  const saveNote = async (stepIndex) => {
    if (!learningPath) return;
    
    const newNotes = { ...(learningPath.notes || {}), [stepIndex]: noteContent };
    
    // Optimistic update
    setLearningPath({ ...learningPath, notes: newNotes });
    setActiveNoteStep(null);
    setNoteContent("");
    toast.success("تم حفظ الملاحظة");

    const { error } = await supabase
      .from('UserLearningPath')
      .update({ notes: newNotes })
      .eq('id', learningPath.id);

    if (error) toast.error("فشل حفظ الملاحظة");
  };

  const deletePath = async () => {
    if (!confirm("هل أنت متأكد من حذف المسار الحالي؟")) return;
    
    const { error } = await supabase
        .from('UserLearningPath')
        .update({ status: 'archived' }) // Soft delete or just update status
        .eq('id', learningPath.id);
        
    if (!error) {
        setLearningPath(null);
        toast.success("تم حذف المسار");
    }
  };

  const checkQuizAnswer = (step) => {
    if (quizAnswer === step.quiz?.correct_answer) {
      setQuizResult("correct");
      toast.success("إجابة صحيحة! أحسنت.");
      if (!learningPath.completed_steps?.includes(activeQuizStep)) {
          toggleStepCompletion(activeQuizStep);
      }
      setTimeout(() => {
          setActiveQuizStep(null);
          setQuizResult(null);
          setQuizAnswer("");
      }, 2000);
    } else {
      setQuizResult("wrong");
      toast.error("إجابة خاطئة، حاول مرة أخرى.");
    }
  };

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50 overflow-hidden">
      <CardHeader className="bg-white/50 backdrop-blur-sm border-b border-purple-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <CardTitle className="text-purple-900">مسار التعلم الذكي</CardTitle>
          </div>
          {!learningPath ? (
            <Button 
              onClick={generatePath} 
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? "جاري الإنشاء..." : "إنشاء مسار شخصي"}
            </Button>
          ) : (
             <Button variant="ghost" size="sm" onClick={deletePath} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="w-4 h-4 ml-1" /> حذف المسار
             </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {!learningPath ? (
          <div className="text-center py-8 text-gray-500">
            <Map className="w-16 h-16 mx-auto mb-4 text-purple-200" />
            <p className="mb-4">اضغط على "إنشاء مسار شخصي" للحصول على خطة تعليمية مخصصة لك بالذكاء الاصطناعي</p>
            {!user && <p className="text-xs text-amber-600">يجب تسجيل الدخول أولاً</p>}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="relative border-r-2 border-purple-200 mr-4 space-y-8">
              {learningPath.path_data.map((step, index) => {
                const isCompleted = learningPath.completed_steps?.includes(index);
                return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pr-8"
                >
                  <div className={`absolute -right-[9px] top-6 w-4 h-4 rounded-full border-4 ${isCompleted ? 'bg-green-500 border-green-100' : 'bg-purple-500 border-purple-100'}`}></div>
                  
                  <Card className={`border transition-all duration-300 ${isCompleted ? 'border-green-200 bg-green-50/50' : 'border-purple-100 shadow-sm hover:shadow-md'}`}>
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <h4 className={`font-bold text-lg ${isCompleted ? 'text-green-800 line-through' : 'text-purple-900'}`}>{step.title}</h4>
                            {isCompleted && <CheckCircle className="w-5 h-5 text-green-600" />}
                        </div>
                        <div className="flex items-center text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                          <Clock className="w-3 h-3 ml-1" />
                          {step.duration}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{step.description}</p>
                      
                      {step.resources && step.resources.length > 0 && (
                        <div className="bg-white/60 p-3 rounded-lg mb-4 border border-purple-50">
                          <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center">
                            <BookOpen className="w-3 h-3 ml-1" /> المصادر المقترحة:
                          </p>
                          <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                            {step.resources.map((res, i) => (
                              <li key={i}>{res}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Notes Section */}
                      {learningPath.notes && learningPath.notes[index] && (
                          <div className="bg-amber-50 p-3 rounded-lg mb-4 border border-amber-100 text-sm text-amber-800">
                              <strong className="block mb-1 text-xs text-amber-600">ملاحظاتي:</strong>
                              {learningPath.notes[index]}
                          </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                         {/* Mark Complete Button */}
                         <Button 
                            variant={isCompleted ? "outline" : "default"}
                            size="sm"
                            onClick={() => toggleStepCompletion(index)}
                            className={isCompleted ? "text-green-600 border-green-200 hover:bg-green-50" : "bg-purple-600 hover:bg-purple-700 text-white"}
                         >
                            {isCompleted ? "تم الإنجاز" : "تحديد كمكتمل"}
                         </Button>

                         {/* Quiz Button */}
                         {step.quiz && (
                             <Dialog open={activeQuizStep === index} onOpenChange={(open) => {
                                 if(!open) { setActiveQuizStep(null); setQuizResult(null); setQuizAnswer(""); }
                                 else setActiveQuizStep(index);
                             }}>
                                 <DialogTrigger asChild>
                                     <Button variant="outline" size="sm" className="gap-1 border-purple-200 text-purple-700 hover:bg-purple-50">
                                         <BrainCircuit className="w-4 h-4" /> اختبار قصير
                                     </Button>
                                 </DialogTrigger>
                                 <DialogContent>
                                     <DialogHeader>
                                         <DialogTitle>اختبر معلوماتك: {step.title}</DialogTitle>
                                     </DialogHeader>
                                     <div className="py-4">
                                         <p className="font-medium text-lg mb-4">{step.quiz.question}</p>
                                         <RadioGroup value={quizAnswer} onValueChange={setQuizAnswer} className="space-y-3">
                                             {step.quiz.options?.map((opt, i) => (
                                                 <div key={i} className={`flex items-center space-x-2 space-x-reverse p-3 rounded-lg border ${
                                                     quizResult === 'correct' && opt === step.quiz.correct_answer ? 'bg-green-100 border-green-500' : 
                                                     quizResult === 'wrong' && opt === quizAnswer ? 'bg-red-100 border-red-500' : 'border-gray-200'
                                                 }`}>
                                                     <RadioGroupItem value={opt} id={`opt-${i}`} />
                                                     <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer">{opt}</Label>
                                                 </div>
                                             ))}
                                         </RadioGroup>
                                         {quizResult === 'correct' && <p className="text-green-600 mt-4 font-bold flex items-center gap-2"><CheckCircle className="w-5 h-5"/> إجابة صحيحة!</p>}
                                         {quizResult === 'wrong' && <p className="text-red-500 mt-4 font-bold">إجابة خاطئة، حاول مرة أخرى.</p>}
                                     </div>
                                     <div className="flex justify-end">
                                         <Button onClick={() => checkQuizAnswer(step)} disabled={!quizAnswer || quizResult === 'correct'}>
                                             تحقق من الإجابة
                                         </Button>
                                     </div>
                                 </DialogContent>
                             </Dialog>
                         )}

                         {/* Notes Button */}
                         <Dialog open={activeNoteStep === index} onOpenChange={(open) => {
                             if(open) {
                                 setNoteContent(learningPath.notes?.[index] || "");
                                 setActiveNoteStep(index);
                             } else {
                                 setActiveNoteStep(null);
                             }
                         }}>
                             <DialogTrigger asChild>
                                 <Button variant="ghost" size="sm" className="gap-1 text-gray-500">
                                     <PenTool className="w-4 h-4" /> ملاحظات
                                 </Button>
                             </DialogTrigger>
                             <DialogContent>
                                 <DialogHeader>
                                     <DialogTitle>ملاحظاتي على: {step.title}</DialogTitle>
                                 </DialogHeader>
                                 <div className="space-y-4 py-4">
                                     <Textarea 
                                         value={noteContent}
                                         onChange={(e) => setNoteContent(e.target.value)}
                                         placeholder="سجل فوائدك وملاحظاتك هنا..."
                                         rows={6}
                                     />
                                     <Button onClick={() => saveNote(index)} className="w-full">
                                         <Save className="w-4 h-4 ml-2" /> حفظ الملاحظة
                                     </Button>
                                 </div>
                             </DialogContent>
                         </Dialog>

                         {/* Share Button */}
                         <div className="mr-auto">
                            <ShareButtons title={`تعلمت عن ${step.title} في تطبيق طريق النور`} url={window.location.href} />
                         </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )})}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}