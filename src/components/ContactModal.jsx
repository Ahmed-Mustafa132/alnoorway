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

export default function ContactModal({ open, onClose, requestType }) {
  const queryClient = useQueryClient();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    preferred_contact_method: "البريد الإلكتروني", // Changed from "email"
    request_type: requestType
  });

  const createRequestMutation = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase.from('ContactRequest').insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact_requests'] });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          preferred_contact_method: "البريد الإلكتروني",
          request_type: requestType
        });
      }, 2000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createRequestMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">تم الإرسال بنجاح</h3>
            <p className="text-gray-600">تم استقبال رسالتكم وسيتم الرد عليها في أقرب وقت</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl text-center">طلب تواصل</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

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
                <Label htmlFor="preferred_contact">طريقة التواصل المفضلة</Label>
                <Select
                  value={formData.preferred_contact_method}
                  onValueChange={(value) => setFormData({...formData, preferred_contact_method: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="البريد الإلكتروني">بريد إلكتروني</SelectItem> {/* Changed value */}
                    <SelectItem value="الهاتف">هاتف</SelectItem> {/* Changed value */}
                    <SelectItem value="واتساب">واتساب</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">رسالتك *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={4}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                disabled={createRequestMutation.isPending}
              >
                {createRequestMutation.isPending ? "جاري الإرسال..." : "إرسال الطلب"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}