import React, { useState, useEffect } from "react";
import { supabase } from "@/components/api/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Award, Briefcase, GraduationCap, Heart, Sparkles, Shield, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import ReconciliationRequestModal from "@/components/ReconciliationRequestModal";
import { useLanguage } from "@/components/LanguageContext";

export default function ReconciliationCommittee() {
  const { t } = useLanguage();
  const [showRequestModal, setShowRequestModal] = useState(false);
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
      console.log("User not logged in");
    }
  };

  const { data: committee, isLoading } = useQuery({
    queryKey: ['reconciliation_committee'],
    queryFn: async () => {
      const { data, error } = await supabase.from('ReconciliationCommittee').select('*').eq('is_active', true);
      if (error) throw error;
      return data;
    },
    initialData: [],
  });

  const sortedCommittee = [...committee].sort((a, b) => (a.order || 0) - (b.order || 0));

  const features = [
    {
      icon: Heart,
      title: t('confidentiality'),
      description: t('confidentiality_desc'),
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/v1769612644/Complete_confidentiality_ulurse.png"
    },
    {
      icon: Shield,
      title: t('neutrality'),
      description: t('neutrality_desc'),
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/v1769612646/Impartiality_and_fairness_uutpgd.png"
    },
    {
      icon: Users,
      title: t('experience'),
      description: t('experience_desc'),
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/v1769612644/High_expertise_nbdzp7.png"
    },
    {
      icon: CheckCircle,
      title: t('high_success'),
      description: t('high_success_desc'),
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/v1769612644/High_success_rate_aqaxl6.png"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-700 via-cyan-600 to-blue-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 pt-4"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 px-6 py-3 rounded-full mb-6">
            <Heart className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-semibold">{t('reconciliation')}</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {t('reconciliation_title')}
          </h1>

          <div className="max-w-4xl mx-auto bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl p-6 md:p-10 shadow-2xl border-2 border-amber-200 mb-8">
            <p className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed mb-3">
              "وَإِن طَائِفَتَانِ مِنَ الْمُؤْمِنِينَ اقْتَتَلُوا فَأَصْلِحُوا بَيْنَهُمَا"
            </p>
            <p className="text-lg text-cyan-700 font-semibold">سورة الحجرات - آية 9</p>
          </div>

          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            {t('reconciliation_subtitle')}
          </p>
        </motion.div>

        {/* مميزات اللجنة - 2 في الموبايل، 4 في الديسكتوب */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm h-full rounded-3xl">
                <CardContent className="p-4 md:p-6 flex items-center gap-3 md:gap-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden">
                    <img src={feature.image} alt={feature.title} className="w-10 h-10 md:w-12 md:h-12 object-contain" />
                  </div>
                  <div className="flex-1 text-right">
                    <h3 className="text-sm md:text-base font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-xs text-gray-600">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* أعضاء اللجنة */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {t('committee_members')}
            </h2>
            <p className="text-lg text-white/80">
              {t('members_desc')}
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            </div>
          ) : sortedCommittee.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCommittee.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/95 backdrop-blur-sm h-full rounded-3xl">
                    <CardHeader className="text-center pb-4">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center mx-auto mb-4 shadow-xl">
                        {member.photo_url ? (
                          <img src={member.photo_url} alt={member.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <Users className="w-12 h-12 text-white" />
                        )}
                      </div>
                      <CardTitle className="text-xl mb-2">{member.name}</CardTitle>
                      <p className="text-base text-cyan-600 font-semibold">{member.title}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {member.position && (
                        <div className="flex items-start gap-2">
                          <Briefcase className="w-4 h-4 text-cyan-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">المنصب:</p>
                            <p className="text-gray-600 text-sm">{member.position}</p>
                          </div>
                        </div>
                      )}

                      {member.qualifications && member.qualifications.length > 0 && (
                        <div className="flex items-start gap-2">
                          <GraduationCap className="w-4 h-4 text-cyan-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">المؤهلات:</p>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                              {member.qualifications.map((qual, idx) => (
                                <li key={idx} className="text-xs">{qual}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {member.specialization && member.specialization.length > 0 && (
                        <div className="flex items-start gap-2">
                          <Award className="w-4 h-4 text-cyan-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">التخصص:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {member.specialization.map((spec, idx) => (
                                <span key={idx} className="px-2 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs">
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {member.experience_years && (
                        <div className="text-center py-2 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg">
                          <p className="text-xs text-gray-600">سنوات الخبرة</p>
                          <p className="text-xl font-bold text-cyan-600">{member.experience_years}+</p>
                        </div>
                      )}

                      {member.bio && (
                        <div className="pt-3 border-t">
                          <p className="text-gray-600 leading-relaxed text-xs">{member.bio}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm rounded-3xl">
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">جاري تشكيل اللجنة...</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* أنواع القضايا */}
        <div className="mb-8">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-3xl">
            <CardHeader>
              <CardTitle className="text-xl text-center">{t('case_types')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "النزاعات الأسرية", desc: "خلافات بين الأزواج، الأبناء، الأقارب" }, // Translations can be added for these later if needed
                  { title: "النزاعات الزوجية", desc: "مشاكل زوجية، حالات طلاق، نفقة" },
                  { title: "قضايا الميراث", desc: "خلافات حول توزيع الميراث والتركات" },
                  { title: "النزاعات المالية", desc: "ديون، شراكات تجارية، عقود" },
                  { title: "نزاعات الجيرة", desc: "خلافات بين الجيران حول الحقوق" },
                  { title: "قضايا أخرى", desc: "أي نزاعات أخرى تحتاج للإصلاح" }
                ].map((item, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 shadow-md">
                    <h4 className="font-bold text-base text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* زر تقديم الطلب */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white overflow-hidden relative rounded-3xl">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-32 translate-y-32"></div>
            
            <CardContent className="p-8 md:p-12 text-center relative z-10">
              <Sparkles className="w-16 h-16 mx-auto mb-6 text-amber-300" />
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                {t('need_help')}
              </h2>
              <p className="text-lg md:text-xl text-cyan-50 mb-8 max-w-2xl mx-auto">
                {t('submit_request_desc')}
              </p>
              <Button
                onClick={() => setShowRequestModal(true)}
                size="lg"
                className="bg-white text-cyan-600 hover:bg-cyan-50 text-lg md:text-xl px-8 md:px-10 py-6 md:py-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <Heart className="w-5 h-5 md:w-6 md:h-6 ml-2" />
                {t('submit_request')}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <ReconciliationRequestModal
        open={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        user={user}
      />
    </div>
  );
}