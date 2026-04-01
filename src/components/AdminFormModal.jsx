import React, { useState, useEffect } from "react";
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

export default function AdminFormModal({ entity, fields, item, open, onClose }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      const defaultData = {};
      fields.forEach(field => {
        defaultData[field.key] = '';
      });
      setFormData(defaultData);
    }
  }, [item, fields]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (item) {
        const { error } = await supabase.from(entity).update(data).eq('id', item.id);
        if (error) throw error;

        // Auto-Notification trigger when answering a FatwaRequest
        if (entity === 'FatwaRequest' && data.status === 'answered' && data.answer && item.email) {
           await supabase.from('Notification').insert({
              user_email: item.email,
              title: "تمت الإجابة على سؤالك",
              message: "أجاب أحد العلماء على سؤالك: " + item.question.substring(0, 30) + "...",
              type: "fatwa_answer",
              is_read: false,
              link: `/Fatwa` // Ideally link to specific fatwa if public, or profile
           });
        }

      } else {
        const { error } = await supabase.from(entity).insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entity] });
      // toast.success("تم الحفظ بنجاح"); // Optional: Add toast import if not present, assumed Layout provides Toaster
      onClose();
    },
    onError: (error) => {
      console.error("Save error:", error);
      alert("حدث خطأ أثناء الحفظ: " + (error.message || "خطأ غير معروف"));
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? 'تعديل' : 'إضافة جديد'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.key}>
              <Label htmlFor={field.key}>
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </Label>
              
              {field.type === 'textarea' ? (
                <Textarea
                  id={field.key}
                  value={formData[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  required={field.required}
                  rows={4}
                  className="mt-2"
                />
              ) : field.type === 'select' ? (
                <Select
                  value={String(formData[field.key] || '')}
                  onValueChange={(value) => {
                    const parsedValue = value === 'true' ? true : value === 'false' ? false : value;
                    handleChange(field.key, parsedValue);
                  }}
                  required={field.required}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder={`اختر ${field.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={String(option.value)}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={field.key}
                  type={field.type || 'text'}
                  value={formData[field.key] || ''}
                  onChange={(e) => {
                    const value = field.type === 'number' ? Number(e.target.value) : e.target.value;
                    handleChange(field.key, value);
                  }}
                  required={field.required}
                  className="mt-2"
                />
              )}
            </div>
          ))}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}