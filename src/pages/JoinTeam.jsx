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
import { useLanguage } from "@/contexts/LanguageContext";
export default function JoinTeam() {
  const { t } = useLanguage();
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
    setFormData({ ...formData, languages });
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('request_submitted')}</h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('request_review')}
          </p>
          <Button
            onClick={() => window.location.href = createPageUrl("Home")}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
          >
            {t('back_to_home')}
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
            <span className="text-emerald-800 font-semibold">{t('join_our_team')}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            {t('become_a_contributor')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('join_team_desc')}
          </p>
        </motion.div>

        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{t('join_team_form')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="role_type"> {t('role_type')} *</Label>
                <Select
                  value={formData.role_type}
                  onValueChange={(value) => setFormData({ ...formData, role_type: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('select_role')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mufti">{t('mufti')}</SelectItem>
                    <SelectItem value="preacher">{t('preacher')}</SelectItem>
                    <SelectItem value="teacher">{t('teacher')}</SelectItem>
                    <SelectItem value="islamic_center">{t('islamic_center')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name"> {t('full_name')} *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age"> {t('age')}</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country"> {t('country')} *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="languages"> {t('languages')}</Label>
                  <Input
                    id="languages"
                    placeholder="العربية, English, Français"
                    onChange={handleLanguageInput}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address"> {t('address')}</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualification"> {t('qualification')}</Label>
                <Input
                  id="qualification"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  placeholder={t('qualification_placeholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="courses"> {t('courses')}</Label>
                <Textarea
                  id="courses"
                  value={formData.courses}
                  onChange={(e) => setFormData({ ...formData, courses: e.target.value })}
                  rows={3}
                  placeholder={t('courses_placeholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender"> {t('gender')} *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('select_gender')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t('male')}</SelectItem>
                    <SelectItem value="female">{t('female')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email"> {t('email')} *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone"> {t('phone')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp"> {t('whatsapp')}</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-lg py-6"
                disabled={createRequestMutation.isPending}
              >
                {createRequestMutation.isPending ? t('sending') : t('submit_request')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}