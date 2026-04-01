import React, { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, FileText, Download, CheckCircle, Lock, GraduationCap, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import jsPDF from "jspdf";

export default function CourseView() {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('id');
  const [activeLesson, setActiveLesson] = useState(null);
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const { data: course } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data, error } = await supabase.from('Course').select('*').eq('id', courseId).single();
      if (error) throw error;
      return data;
    },
    enabled: !!courseId
  });

  const { data: modules } = useQuery({
    queryKey: ['modules', courseId],
    queryFn: async () => {
      const { data, error } = await supabase.from('CourseModule').select('*, CourseLesson(*)').eq('course_id', courseId).order('order');
      if (error) throw error;
      // Sort lessons
      return data.map(m => ({
        ...m,
        CourseLesson: m.CourseLesson.sort((a, b) => a.order - b.order)
      }));
    },
    enabled: !!courseId
  });

  const { data: userProgress } = useQuery({
    queryKey: ['user_progress', courseId, user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const { data, error } = await supabase.from('UserCourseProgress').select('*').eq('course_id', courseId).eq('user_email', user.email).single();
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "Row not found"
      return data || { completed_lessons: [] };
    },
    enabled: !!courseId && !!user
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (lessonId) => {
      if (!user) return;
      let newCompleted = [...(userProgress?.completed_lessons || [])];
      if (!newCompleted.includes(lessonId)) {
        newCompleted.push(lessonId);
        
        const { error } = await supabase.from('UserCourseProgress').upsert({
          user_email: user.email,
          course_id: courseId,
          completed_lessons: newCompleted,
          // Simple completion check logic could be added here
        }, { onConflict: 'user_email, course_id' });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_progress'] });
    }
  });

  if (!course || !modules) return <div className="p-12 text-center">Loading...</div>;

  const totalLessons = modules.reduce((acc, m) => acc + m.CourseLesson.length, 0);
  const completedCount = userProgress?.completed_lessons?.length || 0;
  const progressPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  const handleDownloadCertificate = () => {
     if (!user || !course) return;
     
     const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
     });

     // Certificate Border
     doc.setDrawColor(5, 150, 105); // Emerald color
     doc.setLineWidth(2);
     doc.rect(10, 10, 277, 190);
     doc.setDrawColor(212, 175, 55); // Gold color
     doc.setLineWidth(1);
     doc.rect(15, 15, 267, 180);

     // Content
     // Note: jsPDF default fonts don't support Arabic. In a real production app, 
     // we would load a custom font (Amiri or Cairo) using doc.addFileToVFS and doc.addFont.
     // For this environment, we'll generate an English/Transliterated certificate or assume standard font support
     // Since I cannot upload font files easily here, I will use English for the generated PDF to avoid garbage text.
     
     doc.setFont("helvetica", "bold");
     doc.setFontSize(40);
     doc.setTextColor(5, 150, 105);
     doc.text("CERTIFICATE OF COMPLETION", 148.5, 50, { align: "center" });

     doc.setFont("helvetica", "normal");
     doc.setFontSize(20);
     doc.setTextColor(60, 60, 60);
     doc.text("This is to certify that", 148.5, 80, { align: "center" });

     doc.setFont("helvetica", "bolditalic");
     doc.setFontSize(30);
     doc.setTextColor(0, 0, 0);
     doc.text(user.user_metadata?.full_name || user.email, 148.5, 100, { align: "center" });

     doc.setFont("helvetica", "normal");
     doc.setFontSize(20);
     doc.text("has successfully completed the course", 148.5, 120, { align: "center" });

     doc.setFont("helvetica", "bold");
     doc.setFontSize(25);
     doc.setTextColor(5, 150, 105);
     doc.text(course.title, 148.5, 140, { align: "center" });

     doc.setFont("helvetica", "normal");
     doc.setFontSize(15);
     doc.setTextColor(100, 100, 100);
     const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
     doc.text(`Date: ${date}`, 50, 170);
     doc.text("Tariq Al-Noor Academy", 220, 170);

     doc.save("certificate.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Link to={createPageUrl("Courses")}>
             <Button variant="ghost" className="gap-2">
               <ChevronLeft className="w-4 h-4" />
               عودة للدورات
             </Button>
          </Link>
          {progressPercentage === 100 && (
             <Button onClick={handleDownloadCertificate} className="bg-amber-500 hover:bg-amber-600 text-white gap-2 shadow-lg animate-pulse">
                <GraduationCap className="w-5 h-5" />
                تنزيل الشهادة
             </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <RatingWidget contentType="course" contentId={courseId} />
            {activeLesson ? (
              <Card className="overflow-hidden border-0 shadow-lg">
                 <div className="bg-black aspect-video flex items-center justify-center relative">
                    {activeLesson.content_type === 'video' ? (
                       <iframe 
                         src={activeLesson.video_url} 
                         className="w-full h-full" 
                         allowFullScreen 
                         title={activeLesson.title}
                       />
                    ) : (
                       <div className="text-white text-center p-8">
                          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <h3 className="text-xl font-bold">محتوى نصي</h3>
                       </div>
                    )}
                 </div>
                 <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                       <h2 className="text-2xl font-bold text-gray-900">{activeLesson.title}</h2>
                       <Button 
                         onClick={() => updateProgressMutation.mutate(activeLesson.id)}
                         disabled={userProgress?.completed_lessons?.includes(activeLesson.id)}
                         className={userProgress?.completed_lessons?.includes(activeLesson.id) ? "bg-green-600 hover:bg-green-700" : ""}
                       >
                         {userProgress?.completed_lessons?.includes(activeLesson.id) ? (
                            <>
                              <CheckCircle className="w-4 h-4 ml-2" />
                              مكتمل
                            </>
                         ) : "تحديد كمكتمل"}
                       </Button>
                    </div>
                    <div className="prose max-w-none text-gray-700 leading-relaxed">
                       {activeLesson.text_content}
                    </div>
                    {activeLesson.attachment_url && (
                       <div className="mt-6 pt-6 border-t">
                          <a href={activeLesson.attachment_url} target="_blank" rel="noopener noreferrer">
                             <Button variant="outline" className="gap-2">
                                <Download className="w-4 h-4" />
                                تحميل المرفقات
                             </Button>
                          </a>
                       </div>
                    )}
                 </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-lg bg-white p-8 text-center">
                 <GraduationCap className="w-20 h-20 text-teal-600 mx-auto mb-6" />
                 <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
                 <p className="text-xl text-gray-600 mb-8">{course.description}</p>
                 <p className="text-gray-500">اختر درساً من القائمة لبدء التعلم</p>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
             <Card className="border-0 shadow-lg sticky top-6">
                <CardHeader className="bg-teal-50 border-b border-teal-100">
                   <CardTitle>محتوى الدورة</CardTitle>
                   <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                         <span>نسبة الإنجاز</span>
                         <span>{Math.round(progressPercentage)}%</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                   </div>
                </CardHeader>
                <CardContent className="p-0">
                   <Accordion type="multiple" defaultValue={modules.map(m => m.id)} className="w-full">
                      {modules.map((module, idx) => (
                         <AccordionItem key={module.id} value={module.id} className="border-b px-4">
                            <AccordionTrigger className="hover:no-underline py-4">
                               <div className="text-right">
                                  <div className="font-bold text-gray-900 text-base">{module.title}</div>
                                  <div className="text-xs text-gray-500 font-normal mt-1">{module.CourseLesson.length} دروس</div>
                               </div>
                            </AccordionTrigger>
                            <AccordionContent>
                               <div className="space-y-1 pb-4">
                                  {module.CourseLesson.map((lesson) => {
                                     const isCompleted = userProgress?.completed_lessons?.includes(lesson.id);
                                     const isActive = activeLesson?.id === lesson.id;
                                     return (
                                        <button
                                           key={lesson.id}
                                           onClick={() => setActiveLesson(lesson)}
                                           className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-right ${
                                              isActive ? "bg-teal-100 text-teal-900" : "hover:bg-gray-50 text-gray-700"
                                           }`}
                                        >
                                           {isCompleted ? (
                                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                           ) : (
                                              <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                                           )}
                                           <span className="text-sm font-medium line-clamp-1">{lesson.title}</span>
                                           {lesson.content_type === 'video' ? (
                                              <Play className="w-3 h-3 text-gray-400 mr-auto" />
                                           ) : (
                                              <FileText className="w-3 h-3 text-gray-400 mr-auto" />
                                           )}
                                        </button>
                                     );
                                  })}
                               </div>
                            </AccordionContent>
                         </AccordionItem>
                      ))}
                   </Accordion>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
}