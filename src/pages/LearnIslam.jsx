import React, { useState } from "react";
import AILearningPath from "@/components/AILearningPath";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, MapPin, Video, Heart, Sparkles, MessageCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import ContactModal from "@/components/ContactModal";
import { useLanguage } from "@/components/LanguageContext";

export default function LearnIslam() {
  const { t } = useLanguage();
  const [showContactModal, setShowContactModal] = useState(false);

  const sections = [
    {
      icon: BookOpen,
      title: t('principles_title'),
      description: t('principles_desc'),
      color: "from-blue-100 to-blue-200",
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/v1769612734/pillars_of_islam_aex0p2.png",
      action: () => window.scrollTo({ top: document.getElementById('principles').offsetTop - 100, behavior: 'smooth' })
    },
    {
      icon: Users,
      title: t('contact_preacher'),
      description: "احصل على إرشاد شخصي من دعاة متخصصين",
      color: "from-emerald-100 to-emerald-200",
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/v1769612685/Islamic_preacher_zuhvhn.png",
      link: createPageUrl("ContactPreacher")
    },
    {
      icon: MapPin,
      title: t('find_center'),
      description: t('find_center_desc'),
      color: "from-purple-100 to-purple-200",
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/v1769612647/Islamic_Centers_q7ratq.png",
      link: createPageUrl("IslamicCenters")
    },
    {
      icon: Video,
      title: t('lectures_library'),
      description: t('lectures_desc'),
      color: "from-rose-100 to-rose-200",
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/v1769612733/Lecture_Library_ikrogf.png",
      link: createPageUrl("Lectures?category=learn_islam")
    },
    {
      icon: Heart,
      title: t('convert_stories'),
      description: t('convert_stories_desc'),
      color: "from-amber-100 to-amber-200",
      image: "https://res.cloudinary.com/dufjbywcm/image/upload/v1769612644/Stories_of_those_who_converted_to_Islam_zuqxga.png",
      link: createPageUrl("Stories?type=convert")
    }
  ];

  const principles = [
    {
      title: t('islam_pillars'),
      items: [
        "الشهادتان: أشهد أن لا إله إلا الله وأن محمداً رسول الله",
        "إقامة الصلاة: خمس صلوات في اليوم والليلة",
        "إيتاء الزكاة: إخراج جزء من المال للفقراء",
        "صوم رمضان: الامتناع عن الطعام والشراب من الفجر حتى المغرب",
        "حج البيت: لمن استطاع إليه سبيلاً"
      ]
    },
    {
      title: t('faith_pillars'),
      items: [
        "الإيمان بالله: الإيمان بوحدانية الله وأسمائه وصفاته",
        "الإيمان بالملائكة: الإيمان بوجود الملائكة المكرمين",
        "الإيمان بالكتب: القرآن والتوراة والإنجيل والزبور",
        "الإيمان بالرسل: من آدم إلى محمد عليهم الصلاة والسلام",
        "الإيمان باليوم الآخر: يوم البعث والحساب",
        "الإيمان بالقدر: خيره وشره من الله تعالى"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-700 via-teal-600 to-teal-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 pt-4"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-emerald-100 px-6 py-3 rounded-full mb-6">
            <span className="text-blue-800 font-semibold">{t('discover_islam')}</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {t('learn_islam_title')}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            {t('learn_islam_subtitle')}
          </p>
        </motion.div>

        {/* <div className="mb-12">
          <AILearningPath />
        </div> */}

        {/* الأقسام - 2 في الموبايل، 3 في التابلت، 5 في الديسكتوب */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {section.link ? (
                <Link to={section.link}>
                  <Card className={`group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br ${section.color} overflow-hidden h-full hover:-translate-y-1 cursor-pointer rounded-3xl`}>
                    <CardContent className="p-4 md:p-6 flex items-center gap-3 md:gap-4">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg overflow-hidden">
                        <img src={section.image} alt={section.title} className="w-10 h-10 md:w-14 md:h-14 object-contain" />
                      </div>
                      <div className="flex-1 text-right">
                        <h3 className="text-sm md:text-base font-bold text-gray-800 mb-1">{section.title}</h3>
                        <p className="text-xs text-gray-700 leading-relaxed">{section.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ) : (
                <Card 
                  onClick={section.action}
                  className={`group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br ${section.color} overflow-hidden h-full hover:-translate-y-1 cursor-pointer rounded-3xl`}
                >
                  <CardContent className="p-4 md:p-6 flex items-center gap-3 md:gap-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg overflow-hidden">
                      <img src={section.image} alt={section.title} className="w-10 h-10 md:w-14 md:h-14 object-contain" />
                    </div>
                    <div className="flex-1 text-right">
                      <h3 className="text-sm md:text-base font-bold text-gray-800 mb-1">{section.title}</h3>
                      <p className="text-xs text-gray-700 leading-relaxed">{section.description}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ))}
        </div>

        {/* أركان الإسلام والإيمان */}
        <div id="principles" className="space-y-6 mb-8">
          {principles.map((principle, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 md:p-8">
                  <CardTitle className="text-xl md:text-2xl">{principle.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                  <div className="space-y-4">
                    {principle.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex gap-4 items-start bg-gradient-to-br from-emerald-50 to-teal-50 p-4 md:p-5 rounded-2xl shadow-md">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md">
                          <span className="text-white font-bold">{itemIndex + 1}</span>
                        </div>
                        <p className="text-gray-700 text-sm md:text-base leading-relaxed pt-2">{item}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* دعوة للتواصل */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white overflow-hidden relative rounded-3xl">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-32 translate-y-32"></div>
            
            <CardContent className="p-8 md:p-12 text-center relative z-10">
              <MessageCircle className="w-16 h-16 mx-auto mb-6 text-amber-300" />
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                {t('have_questions')}
              </h2>
              <p className="text-lg md:text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
                {t('here_to_help')}
              </p>
              <Button
                onClick={() => setShowContactModal(true)}
                size="lg"
                className="bg-white text-emerald-600 hover:bg-emerald-50 text-lg md:text-xl px-8 md:px-10 py-6 md:py-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5 md:w-6 md:h-6 ml-2" />
                {t('contact_us_now')}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <ContactModal
        open={showContactModal}
        onClose={() => setShowContactModal(false)}
        requestType="learn_islam"
      />
    </div>
  );
}