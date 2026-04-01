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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle } from "lucide-react";

export default function ReconciliationRequestModal({ open, onClose, user }) {
  const queryClient = useQueryClient();
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    requester_name: user?.full_name || "",
    requester_email: user?.email || "",
    requester_phone: "",
    requester_whatsapp: "",
    requester_age: "",
    requester_gender: "",
    requester_country: "",
    requester_city: "",
    conflict_type: "",
    conflict_description: "",
    conflict_duration: "",
    parties_involved: "",
    parties_count: "",
    previous_attempts: "",
    urgency_level: "medium",
    preferred_contact_method: "phone",
    preferred_meeting_time: "",
    additional_notes: ""
  });

  const createRequestMutation = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase.from('ReconciliationRequest').insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reconciliation_requests'] });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setStep(1);
        setFormData({
          requester_name: user?.full_name || "",
          requester_email: user?.email || "",
          requester_phone: "",
          requester_whatsapp: "",
          requester_age: "",
          requester_gender: "",
          requester_country: "",
          requester_city: "",
          conflict_type: "",
          conflict_description: "",
          conflict_duration: "",
          parties_involved: "",
          parties_count: "",
          previous_attempts: "",
          urgency_level: "medium",
          preferred_contact_method: "phone",
          preferred_meeting_time: "",
          additional_notes: ""
        });
      }, 3000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      createRequestMutation.mutate(formData);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">تم إرسال طلبك بنجاح</h3>
            <p className="text-lg text-gray-600 mb-2">
              تم استقبال رسالتكم وسيتم الرد عليها في أقرب وقت
            </p>
            <p className="text-md text-gray-500">
              نسأل الله أن يوفقنا لإصلاح ذات البين
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl text-center">
                طلب إصلاح ذات البين - خطوة {step} من 3
              </DialogTitle>
              <div className="flex gap-2 mt-4">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`flex-1 h-2 rounded-full ${
                      s <= step ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">المعلومات الشخصية</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="requester_name">الاسم الكامل *</Label>
                      <Input
                        id="requester_name"
                        value={formData.requester_name}
                        onChange={(e) => setFormData({...formData, requester_name: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requester_gender">الجنس *</Label>
                      <Select
                        value={formData.requester_gender}
                        onValueChange={(value) => setFormData({...formData, requester_gender: value})}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الجنس" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">ذكر</SelectItem>
                          <SelectItem value="female">أنثى</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="requester_email">البريد الإلكتروني *</Label>
                      <Input
                        id="requester_email"
                        type="email"
                        value={formData.requester_email}
                        onChange={(e) => setFormData({...formData, requester_email: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requester_phone">رقم الهاتف *</Label>
                      <Input
                        id="requester_phone"
                        type="tel"
                        value={formData.requester_phone}
                        onChange={(e) => setFormData({...formData, requester_phone: e.target.value})}
                        required
                        placeholder="+966..."
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="requester_whatsapp">رقم الواتساب</Label>
                      <Input
                        id="requester_whatsapp"
                        type="tel"
                        value={formData.requester_whatsapp}
                        onChange={(e) => setFormData({...formData, requester_whatsapp: e.target.value})}
                        placeholder="+966..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requester_age">العمر</Label>
                      <Input
                        id="requester_age"
                        type="number"
                        value={formData.requester_age}
                        onChange={(e) => setFormData({...formData, requester_age: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requester_country">الدولة *</Label>
                      <Input
                        id="requester_country"
                        value={formData.requester_country}
                        onChange={(e) => setFormData({...formData, requester_country: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requester_city">المدينة</Label>
                    <Input
                      id="requester_city"
                      value={formData.requester_city}
                      onChange={(e) => setFormData({...formData, requester_city: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">تفاصيل النزاع</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="conflict_type">نوع النزاع *</Label>
                    <Select
                      value={formData.conflict_type}
                      onValueChange={(value) => setFormData({...formData, conflict_type: value})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر نوع النزاع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="family">نزاع أسري</SelectItem>
                        <SelectItem value="marital">نزاع زوجي</SelectItem>
                        <SelectItem value="financial">نزاع مالي</SelectItem>
                        <SelectItem value="inheritance">قضايا الميراث</SelectItem>
                        <SelectItem value="business">نزاع تجاري/شراكة</SelectItem>
                        <SelectItem value="neighborhood">نزاع جيرة</SelectItem>
                        <SelectItem value="other">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="conflict_description">وصف تفصيلي للمشكلة *</Label>
                    <Textarea
                      id="conflict_description"
                      value={formData.conflict_description}
                      onChange={(e) => setFormData({...formData, conflict_description: e.target.value})}
                      rows={6}
                      required
                      placeholder="يرجى شرح المشكلة بالتفصيل مع ذكر الأسباب والأحداث..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="conflict_duration">مدة النزاع</Label>
                      <Input
                        id="conflict_duration"
                        value={formData.conflict_duration}
                        onChange={(e) => setFormData({...formData, conflict_duration: e.target.value})}
                        placeholder="مثال: شهرين، سنة..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="parties_count">عدد الأطراف المتنازعة</Label>
                      <Input
                        id="parties_count"
                        type="number"
                        value={formData.parties_count}
                        onChange={(e) => setFormData({...formData, parties_count: e.target.value})}
                        placeholder="2، 3، 4..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parties_involved">أطراف النزاع</Label>
                    <Textarea
                      id="parties_involved"
                      value={formData.parties_involved}
                      onChange={(e) => setFormData({...formData, parties_involved: e.target.value})}
                      rows={3}
                      placeholder="من هم الأطراف المتنازعة؟ (بدون ذكر أسماء حقيقية)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="previous_attempts">المحاولات السابقة للصلح</Label>
                    <Textarea
                      id="previous_attempts"
                      value={formData.previous_attempts}
                      onChange={(e) => setFormData({...formData, previous_attempts: e.target.value})}
                      rows={3}
                      placeholder="هل سبق محاولة حل المشكلة؟ ما النتيجة؟"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">تفضيلات التواصل</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="urgency_level">مستوى الأهمية *</Label>
                    <Select
                      value={formData.urgency_level}
                      onValueChange={(value) => setFormData({...formData, urgency_level: value})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">عادي</SelectItem>
                        <SelectItem value="medium">متوسط</SelectItem>
                        <SelectItem value="high">عالي</SelectItem>
                        <SelectItem value="urgent">عاجل جداً</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferred_contact_method">طريقة التواصل المفضلة *</Label>
                    <Select
                      value={formData.preferred_contact_method}
                      onValueChange={(value) => setFormData({...formData, preferred_contact_method: value})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phone">مكالمة هاتفية</SelectItem>
                        <SelectItem value="whatsapp">واتساب</SelectItem>
                        <SelectItem value="email">بريد إلكتروني</SelectItem>
                        <SelectItem value="google_meet">اجتماع عبر Google Meet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferred_meeting_time">الوقت المناسب للتواصل</Label>
                    <Input
                      id="preferred_meeting_time"
                      value={formData.preferred_meeting_time}
                      onChange={(e) => setFormData({...formData, preferred_meeting_time: e.target.value})}
                      placeholder="مثال: صباحاً من 9-12، مساءً بعد 6..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additional_notes">ملاحظات إضافية</Label>
                    <Textarea
                      id="additional_notes"
                      value={formData.additional_notes}
                      onChange={(e) => setFormData({...formData, additional_notes: e.target.value})}
                      rows={4}
                      placeholder="أي معلومات إضافية تود إضافتها..."
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800 leading-relaxed">
                      <strong>ملاحظة:</strong> جميع المعلومات المقدمة سرية تماماً ولن يتم مشاركتها إلا مع أعضاء لجنة الإصلاح. نسأل الله أن يوفقنا لحل نزاعكم بما يرضيه.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-between gap-3 pt-4 border-t">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={handleBack}>
                    السابق
                  </Button>
                )}
                <div className="flex-1" />
                <Button type="button" variant="outline" onClick={onClose}>
                  إلغاء
                </Button>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  disabled={createRequestMutation.isPending}
                >
                  {step < 3 ? 'التالي' : createRequestMutation.isPending ? 'جاري الإرسال...' : 'إرسال الطلب'}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}