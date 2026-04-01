import React, { useState } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, CheckCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function JoinTeam() {
  const queryClient = useQueryClient();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    role_type: "",
    full_name: "",
    age: "",
    address: "",
    country: "",
    languages: [],
    qualification: "",
    courses: "",
    phone: "",
    email: "",
    whatsapp: "",
    gender: ""
  });

  const createRequestMutation = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase.from('JoinTeamRequest').insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['join_team_requests'] });
      setSubmitted(true);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createRequestMutation.mutate(formData);
  };

  const handleLanguageInput = (e) => {
    const languages = e.target.value.split(',').map(l => l.trim()).filter(l => l);
    setFormData({...formData, languages});
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-6 md:p-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">تم إرسال طلبك بنجاح!</h2>
          <p className="text-xl text-gray-600 mb-8">
            سنراجع طلبك ونتواصل معك قريباً إن شاء الله
          </p>
          <Button
            onClick={() => window.location.href = createPageUrl("Home")}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
          >
            العودة للرئيسية
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-amber-100 px-6 py-3 rounded-full mb-6">
            <Users className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-800 font-semibold">انضم إلى فريقنا</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            كن جزءاً من طريق النور
          </h1>
          <p className="text-xl text-gray-600">
            شارك في نشر الهداية والعلم النافع
          </p>
        </motion.div>

        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center">نموذج الانضمام</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="role_type">نوع الدور *</Label>
                <Select
                  value={formData.role_type}
                  onValueChange={(value) => setFormData({...formData, role_type: value})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الدور" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mufti">مفتي</SelectItem>
                    <SelectItem value="preacher">داعية</SelectItem>
                    <SelectItem value="teacher">محفظ قرآن</SelectItem>
                    <SelectItem value="islamic_center">مركز دعوة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">الاسم الكامل *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">السن</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">البلد *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="languages">اللغات (افصل بفاصلة)</Label>
                  <Input
                    id="languages"
                    placeholder="العربية, English, Français"
                    onChange={handleLanguageInput}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">العنوان</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualification">المؤهل</Label>
                <Input
                  id="qualification"
                  value={formData.qualification}
                  onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                  placeholder="مثال: ليسانس شريعة، ماجستير حديث..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="courses">الدورات الحاصل عليها</Label>
                <Textarea
                  id="courses"
                  value={formData.courses}
                  onChange={(e) => setFormData({...formData, courses: e.target.value})}
                  rows={3}
                  placeholder="اذكر الدورات والشهادات الحاصل عليها..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">الجنس *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({...formData, gender: value})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">ذكر</SelectItem>
                    <SelectItem value="female">أنثى</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
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
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">رقم الواتساب</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-lg py-6"
                disabled={createRequestMutation.isPending}
              >
                {createRequestMutation.isPending ? "جاري الإرسال..." : "إرسال الطلب"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}