import React, { useState } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { 
  ChevronRight, Plus, Pencil, Trash2, BookOpen, Layers, FileVideo, ArrowLeft 
} from "lucide-react";
import { toast } from "sonner";
import AdminFormModal from "../AdminFormModal";

export default function CourseManager() {
  const [view, setView] = useState("courses"); // courses, modules, lessons
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const queryClient = useQueryClient();

  // --- Courses ---
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['admin_courses'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Course').select('*').order('created_date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // --- Modules ---
  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: ['admin_modules', selectedCourse?.id],
    enabled: !!selectedCourse,
    queryFn: async () => {
      const { data, error } = await supabase.from('CourseModule')
        .select('*')
        .eq('course_id', selectedCourse.id)
        .order('order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // --- Lessons ---
  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ['admin_lessons', selectedModule?.id],
    enabled: !!selectedModule,
    queryFn: async () => {
      const { data, error } = await supabase.from('CourseLesson')
        .select('*')
        .eq('module_id', selectedModule.id)
        .order('order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // --- Delete Mutation ---
  const deleteMutation = useMutation({
    mutationFn: async ({ id, table }) => {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_courses'] });
      queryClient.invalidateQueries({ queryKey: ['admin_modules'] });
      queryClient.invalidateQueries({ queryKey: ['admin_lessons'] });
      toast.success("تم الحذف بنجاح");
    },
    onError: (err) => toast.error(err.message)
  });

  const handleDelete = (id, table) => {
    if (confirm("هل أنت متأكد من الحذف؟ سيتم حذف جميع البيانات المرتبطة.")) {
      deleteMutation.mutate({ id, table });
    }
  };

  // --- Fields Definitions ---
  const courseFields = [
    { key: "title", label: "عنوان الدورة", type: "text", required: true },
    { key: "instructor", label: "المدرب", type: "text", required: true },
    { key: "description", label: "الوصف", type: "textarea" },
    { 
      key: "category", label: "التصنيف", type: "select",
      options: [
        { value: "aqeedah", label: "عقيدة" }, { value: "fiqh", label: "فقه" },
        { value: "hadith", label: "حديث" }, { value: "tafsir", label: "تفسير" },
        { value: "general", label: "عام" }
      ], required: true 
    },
    { 
      key: "level", label: "المستوى", type: "select",
      options: [
        { value: "beginner", label: "مبتدئ" }, { value: "intermediate", label: "متوسط" },
        { value: "advanced", label: "متقدم" }
      ]
    },
    { key: "thumbnail_url", label: "صورة الدورة", type: "text" },
    { 
      key: "is_published", label: "نشر", type: "select",
      options: [{ value: true, label: "نعم" }, { value: false, label: "لا" }]
    },
  ];

  const moduleFields = [
    { key: "title", label: "عنوان الوحدة", type: "text", required: true },
    { key: "order", label: "ترتيب", type: "number" },
    // course_id is injected automatically
  ];

  const lessonFields = [
    { key: "title", label: "عنوان الدرس", type: "text", required: true },
    { 
      key: "content_type", label: "نوع المحتوى", type: "select",
      options: [
        { value: "video", label: "فيديو" }, { value: "text", label: "نص" },
        { value: "audio", label: "صوت" }
      ], required: true
    },
    { key: "video_url", label: "رابط الفيديو", type: "text" },
    { key: "text_content", label: "محتوى نصي", type: "textarea" },
    { key: "attachment_url", label: "رابط مرفق", type: "text" },
    { key: "duration", label: "المدة", type: "text" },
    { key: "order", label: "ترتيب", type: "number" },
    // module_id is injected automatically
  ];

  // --- Render ---

  if (view === "lessons") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => setView("modules")}>
            <ArrowLeft className="w-4 h-4 ml-2" />
            عودة للوحدات
          </Button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{selectedModule.title}</h2>
            <p className="text-sm text-gray-500">إدارة الدروس</p>
          </div>
        </div>

        <div className="flex justify-end mb-4">
          <Button onClick={() => { setEditingItem({ module_id: selectedModule.id }); setShowModal(true); }}>
            <Plus className="w-4 h-4 ml-2" /> إضافة درس
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الترتيب</TableHead>
              <TableHead>عنوان الدرس</TableHead>
              <TableHead>النوع</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lessons?.map(lesson => (
              <TableRow key={lesson.id}>
                <TableCell>{lesson.order}</TableCell>
                <TableCell>{lesson.title}</TableCell>
                <TableCell>{lesson.content_type}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => { setEditingItem(lesson); setShowModal(true); }}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDelete(lesson.id, 'CourseLesson')}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {showModal && (
          <AdminFormModal
            entity="CourseLesson"
            fields={lessonFields}
            item={editingItem}
            open={showModal}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    );
  }

  if (view === "modules") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => setView("courses")}>
            <ArrowLeft className="w-4 h-4 ml-2" />
            عودة للدورات
          </Button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{selectedCourse.title}</h2>
            <p className="text-sm text-gray-500">إدارة الوحدات</p>
          </div>
        </div>

        <div className="flex justify-end mb-4">
          <Button onClick={() => { setEditingItem({ course_id: selectedCourse.id }); setShowModal(true); }}>
            <Plus className="w-4 h-4 ml-2" /> إضافة وحدة
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الترتيب</TableHead>
              <TableHead>عنوان الوحدة</TableHead>
              <TableHead>الدروس</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules?.map(module => (
              <TableRow key={module.id}>
                <TableCell>{module.order}</TableCell>
                <TableCell className="font-medium">{module.title}</TableCell>
                <TableCell>
                  <Button variant="link" onClick={() => { setSelectedModule(module); setView("lessons"); }}>
                    عرض الدروس
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => { setEditingItem(module); setShowModal(true); }}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-600" onClick={() => handleDelete(module.id, 'CourseModule')}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {showModal && (
          <AdminFormModal
            entity="CourseModule"
            fields={moduleFields}
            item={editingItem}
            open={showModal}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    );
  }

  // Courses View
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">الدورات التدريبية</h2>
        <Button onClick={() => { setEditingItem({}); setShowModal(true); }}>
          <Plus className="w-4 h-4 ml-2" /> إضافة دورة
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map(course => (
          <Card key={course.id} className="group hover:shadow-lg transition-all cursor-pointer border-gray-100">
            <div className="aspect-video bg-gray-100 relative">
               {course.thumbnail_url ? (
                 <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
               ) : (
                 <div className="flex items-center justify-center h-full text-gray-400">
                   <BookOpen className="w-10 h-10" />
                 </div>
               )}
               <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-semibold">
                 {course.is_published ? 'منشور' : 'مسودة'}
               </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-1">{course.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{course.instructor}</p>
              
              <div className="flex gap-2">
                <Button 
                   className="flex-1" 
                   variant="secondary"
                   onClick={() => { setSelectedCourse(course); setView("modules"); }}
                >
                  <Layers className="w-4 h-4 ml-2" />
                  المحتوى
                </Button>
                <Button size="icon" variant="outline" onClick={() => { setEditingItem(course); setShowModal(true); }}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(course.id, 'Course')}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showModal && (
        <AdminFormModal
          entity="Course"
          fields={courseFields}
          item={editingItem}
          open={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}