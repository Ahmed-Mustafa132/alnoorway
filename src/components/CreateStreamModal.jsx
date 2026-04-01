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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Radio } from "lucide-react";

export default function CreateStreamModal({ open, onClose, user }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    speaker: user?.full_name || "",
    category: "lecture",
    scheduled_time: "",
    stream_url: "",
    thumbnail_url: ""
  });

  const createStreamMutation = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase.from('LiveStream').insert({
        ...data,
        is_live: false, // Default to scheduled
        viewers_count: 0
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['live_streams'] });
      onClose();
      setFormData({
        title: "",
        description: "",
        speaker: user?.full_name || "",
        category: "lecture",
        scheduled_time: "",
        stream_url: "",
        thumbnail_url: ""
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createStreamMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-red-600" />
            جدولة بث جديد
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>عنوان البث</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>المتحدث</Label>
            <Input
              value={formData.speaker}
              onChange={(e) => setFormData({...formData, speaker: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>التصنيف</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({...formData, category: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lecture">محاضرة</SelectItem>
                  <SelectItem value="quran_class">درس قرآن</SelectItem>
                  <SelectItem value="qa_session">أسئلة وأجوبة</SelectItem>
                  <SelectItem value="special_event">حدث خاص</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>موعد البث</Label>
              <Input
                type="datetime-local"
                value={formData.scheduled_time}
                onChange={(e) => setFormData({...formData, scheduled_time: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>رابط البث (YouTube)</Label>
            <Input
              value={formData.stream_url}
              onChange={(e) => setFormData({...formData, stream_url: e.target.value})}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div className="space-y-2">
            <Label>رابط الصورة المصغرة</Label>
            <Input
              value={formData.thumbnail_url}
              onChange={(e) => setFormData({...formData, thumbnail_url: e.target.value})}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label>الوصف</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={createStreamMutation.isPending}
          >
            {createStreamMutation.isPending ? "جاري الحفظ..." : "جدولة البث"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}