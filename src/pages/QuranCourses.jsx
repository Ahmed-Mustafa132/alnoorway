import React, { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BookOpen, Users, Clock, Calendar, Video, Sparkles, CheckCircle, Clock3 } from "lucide-react";
import { motion } from "framer-motion";
import CourseEnrollmentModal from "@/components/CourseEnrollmentModal";
import { Badge } from "@/components/ui/badge";

export default function QuranCourses() {
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("browse");
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser({ ...authUser, role: 'user' });
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const { data: courses, isLoading } = useQuery({
    queryKey: ['quran_courses'],
    queryFn: async () => {
      const { data, error } = await supabase.from('QuranCourse').select('*').eq('is_active', true);
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const { data: myEnrollments } = useQuery({
    queryKey: ['my_enrollments', user?.email],
    queryFn: async () => {
        if (!user?.email) return [];
        const { data, error } = await supabase.from('CourseEnrollment')
            .select('*, course:QuranCourse(*)') // Join with QuranCourse
            .eq('user_email', user.email);
        if (error) throw error;
        return data;
    },
    enabled: !!user?.email,
    initialData: []
  });

  const filteredCourses = courses.filter(course => {
    const matchesGender = selectedGender === "all" || course.gender === selectedGender;
    const matchesType = selectedType === "all" || course.type === selectedType;
    return matchesGender && matchesType;
  });

  const courseTypes = {
    all: "جميع الدورات",
    memorization: "تحفيظ القرآن",
    recitation: "تلاوة القرآن",
    tajweed: "أحكام التجويد"
  };

  const levelLabels = {
    beginner: "مبتدئ",
    intermediate: "متوسط",
    advanced: "متقدم"
  };

  const handleEnroll = (course) => {
    if (!user) {
      alert("يرجى تسجيل الدخول أولاً");
      return;
    }
    setSelectedCourse(course);
    setShowEnrollModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-100 to-cyan-100 px-6 py-3 rounded-full mb-6">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <span className="text-teal-800 font-semibold">دورات القرآن الكريم</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            تعلم وحفظ القرآن الكريم
          </h1>
          <p className="text-xl text-gray-600">
            دورات متخصصة في التحفيظ والتلاوة والتجويد
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="flex justify-center">
                <TabsList className="bg-white shadow-md p-1">
                    <TabsTrigger value="browse" className="px-8">تصفح الدورات</TabsTrigger>
                    {user && <TabsTrigger value="my_courses" className="px-8">دوراتي ({myEnrollments.length})</TabsTrigger>}
                </TabsList>
            </div>

            <TabsContent value="browse">
                <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
                <Tabs value={selectedGender} onValueChange={setSelectedGender}>
                    <TabsList className="bg-white shadow-lg">
                    <TabsTrigger value="all">الكل</TabsTrigger>
                    <TabsTrigger value="male">رجال</TabsTrigger>
                    <TabsTrigger value="female">نساء</TabsTrigger>
                    </TabsList>
                </Tabs>

                <Tabs value={selectedType} onValueChange={setSelectedType}>
                    <TabsList className="bg-white shadow-lg">
                    {Object.entries(courseTypes).map(([key, label]) => (
                        <TabsTrigger key={key} value={key}>{label}</TabsTrigger>
                    ))}
                    </TabsList>
                </Tabs>
                </div>

                {isLoading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                </div>
                ) : filteredCourses.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course, index) => (
                    <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm h-full flex flex-col">
                        <CardHeader className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-t-xl shrink-0">
                            <CardTitle className="text-xl">{course.title}</CardTitle>
                            <div className="flex items-center gap-2 text-teal-50 text-sm">
                            <Users className="w-4 h-4" />
                            <span>{course.teacher_name}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
                            <p className="text-gray-600 line-clamp-2">{course.description}</p>

                            <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">
                                {courseTypes[course.type]}
                            </span>
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                {course.gender === "male" ? "رجال" : course.gender === "female" ? "نساء" : "الكل"}
                            </span>
                            </div>

                            <div className="mt-auto space-y-3 pt-4">
                                {course.schedule && (
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <Clock className="w-4 h-4 text-teal-500" />
                                    <span>{course.schedule}</span>
                                </div>
                                )}
                                <Button
                                    onClick={() => handleEnroll(course)}
                                    className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                                    disabled={course.current_students >= course.max_students}
                                >
                                    {course.current_students >= course.max_students ? "مكتمل" : "سجل الآن"}
                                </Button>
                            </div>
                        </CardContent>
                        </Card>
                    </motion.div>
                    ))}
                </div>
                ) : (
                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-12 text-center">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        لا توجد دورات متاحة
                    </h3>
                    </CardContent>
                </Card>
                )}
            </TabsContent>

            <TabsContent value="my_courses">
                {myEnrollments.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myEnrollments.map((enrollment) => {
                            const course = enrollment.course || {}; // Handle joined data safely
                            return (
                                <Card key={enrollment.id} className="border-0 shadow-lg overflow-hidden">
                                    <div className="h-2 bg-gradient-to-r from-teal-500 to-cyan-500" />
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900">{course.title || "دورة محذوفة"}</h3>
                                                <p className="text-sm text-gray-500">{course.teacher_name}</p>
                                            </div>
                                            <Badge variant={enrollment.status === 'approved' ? 'default' : 'secondary'} 
                                                   className={enrollment.status === 'approved' ? 'bg-green-100 text-green-700' : ''}>
                                                {enrollment.status === 'approved' ? 'نشط' : 'قيد الانتظار'}
                                            </Badge>
                                        </div>
                                        
                                        {enrollment.status === 'approved' && (
                                            <div className="space-y-4">
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span>التقدم</span>
                                                        <span>{enrollment.progress || 0}%</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div className="h-full bg-teal-500" style={{ width: `${enrollment.progress || 0}%` }} />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Clock3 className="w-4 h-4 text-teal-500" />
                                                    <span>موعد الدرس: {course.schedule}</span>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white/50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500 text-lg">لم تسجل في أي دورة بعد</p>
                        <Button variant="link" onClick={() => setActiveTab('browse')}>تصفح الدورات</Button>
                    </div>
                )}
            </TabsContent>
        </Tabs>
      </div>

      {showEnrollModal && (
        <CourseEnrollmentModal
          course={selectedCourse}
          user={user}
          open={showEnrollModal}
          onClose={() => setShowEnrollModal(false)}
        />
      )}
    </div>
  );
}