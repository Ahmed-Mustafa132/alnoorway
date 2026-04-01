import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Cookie, Database, Shield, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function CookiesPolicy() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Cookies Policy | سياسة الكوكيز - طريق النور";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-orange-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full mb-4">
            <Cookie className="w-5 h-5 text-orange-700" />
            <span className="text-orange-800 font-semibold">Cookies Policy / سياسة الكوكيز</span>
          </div>
        </div>

        {/* Back to Home Button */}
        <button 
          onClick={() => navigate('/')}
          className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6 group"
        >
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          العودة للرئيسية / Back to Home
        </button>

        {/* Arabic Section */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-8" dir="rtl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <Cookie className="w-8 h-8 text-orange-600" />
              <h1 className="text-3xl font-bold text-gray-900">سياسة الكوكيز</h1>
            </div>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                نستخدم في <strong>طريق النور</strong> تقنيات التخزين المحلي (Cookies و LocalStorage) لتحسين تجربتك وتقديم خدمة أفضل.
              </p>

              <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                <h2 className="text-xl font-bold text-orange-900 mb-3 flex items-center gap-2">
                  <Cookie className="w-5 h-5" />
                  ما هي الكوكيز؟
                </h2>
                <p className="text-gray-800">
                  الكوكيز (Cookies) هي ملفات نصية صغيرة يتم تخزينها على جهازك عند زيارة المواقع الإلكترونية. 
                  تساعد هذه الملفات في حفظ تفضيلاتك وتحسين أداء الموقع.
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h2 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  أنواع البيانات المخزنة
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  <li><strong>Cookies:</strong> لحفظ جلسة تسجيل الدخول والتفضيلات الأساسية</li>
                  <li><strong>LocalStorage:</strong> لحفظ اللغة المفضلة، الوضع الليلي، وإعدادات العرض</li>
                  <li><strong>Supabase Auth Sessions:</strong> لإدارة جلسات المصادقة بشكل آمن</li>
                  <li><strong>Cache:</strong> لتحسين سرعة تحميل المحتوى المتكرر</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                <h2 className="text-xl font-bold text-purple-900 mb-3 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  كيف نستخدم الكوكيز
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  <li>تذكر تسجيل دخولك للبقاء متصلاً</li>
                  <li>حفظ اللغة المفضلة لديك (عربي، إنجليزي، فرنسي، إلخ)</li>
                  <li>تذكر إعدادات الوضع الليلي وحجم الخط</li>
                  <li>تحليل استخدام المنصة لتحسين الخدمات</li>
                  <li>عرض المحتوى المخصص لاهتماماتك</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                <h2 className="text-xl font-bold text-green-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  التحكم في الكوكيز
                </h2>
                <p className="text-gray-800 mb-3">
                  يمكنك التحكم في الكوكيز من خلال:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  <li>إعدادات المتصفح الخاص بك لحذف أو حظر الكوكيز</li>
                  <li>استخدام وضع التصفح الخاص (Incognito/Private)</li>
                  <li>تسجيل الخروج من حسابك لإنهاء الجلسة</li>
                  <li>مسح بيانات التصفح (LocalStorage و Cache)</li>
                </ul>
                <p className="text-gray-800 mt-3 font-semibold">
                  ملاحظة: حظر الكوكيز قد يؤثر على تجربتك في استخدام المنصة.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-3">أمان البيانات</h2>
                <p className="text-gray-800">
                  نحن نستخدم تقنيات التشفير لحماية البيانات المخزنة. جلسات المصادقة (Supabase Auth) محمية بأعلى معايير الأمان.
                  نحن <strong>لا نشارك</strong> أو <strong>نبيع</strong> أي بيانات مخزنة لديك مع أطراف ثالثة.
                </p>
              </div>

              <p className="text-sm text-gray-600 pt-4 border-t border-gray-200">
                <strong>آخر تحديث:</strong> يناير 2026<br/>
                <strong>للاستفسارات:</strong> يرجى التواصل معنا عبر صفحة التواصل
              </p>
            </div>
          </CardContent>
        </Card>

        {/* English Section */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-8" dir="ltr">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <Cookie className="w-8 h-8 text-orange-600" />
              <h1 className="text-3xl font-bold text-gray-900">Cookies Policy</h1>
            </div>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                At <strong>Tariq Al-Noor</strong>, we use local storage technologies (Cookies and LocalStorage) to enhance your experience and provide better service.
              </p>

              <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                <h2 className="text-xl font-bold text-orange-900 mb-3 flex items-center gap-2">
                  <Cookie className="w-5 h-5" />
                  What are Cookies?
                </h2>
                <p className="text-gray-800">
                  Cookies are small text files stored on your device when you visit websites. 
                  These files help save your preferences and improve website performance.
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h2 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Types of Data Stored
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  <li><strong>Cookies:</strong> To save login sessions and basic preferences</li>
                  <li><strong>LocalStorage:</strong> To save preferred language, dark mode, and display settings</li>
                  <li><strong>Supabase Auth Sessions:</strong> To securely manage authentication sessions</li>
                  <li><strong>Cache:</strong> To improve loading speed of recurring content</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                <h2 className="text-xl font-bold text-purple-900 mb-3 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  How We Use Cookies
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  <li>Remember your login to keep you connected</li>
                  <li>Save your preferred language (Arabic, English, French, etc.)</li>
                  <li>Remember dark mode and font size settings</li>
                  <li>Analyze platform usage to improve services</li>
                  <li>Display content personalized to your interests</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                <h2 className="text-xl font-bold text-green-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Cookie Control
                </h2>
                <p className="text-gray-800 mb-3">
                  You can control cookies through:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  <li>Your browser settings to delete or block cookies</li>
                  <li>Using private browsing mode (Incognito/Private)</li>
                  <li>Logging out of your account to end the session</li>
                  <li>Clearing browsing data (LocalStorage and Cache)</li>
                </ul>
                <p className="text-gray-800 mt-3 font-semibold">
                  Note: Blocking cookies may affect your experience using the platform.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Data Security</h2>
                <p className="text-gray-800">
                  We use encryption technologies to protect stored data. Authentication sessions (Supabase Auth) are protected with the highest security standards.
                  We <strong>do not share</strong> or <strong>sell</strong> any of your stored data with third parties.
                </p>
              </div>

              <p className="text-sm text-gray-600 pt-4 border-t border-gray-200">
                <strong>Last Updated:</strong> January 2026<br/>
                <strong>Contact Us:</strong> Please reach out via our Contact page
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home at Bottom */}
        <div className="text-center mt-8">
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
          >
            <ArrowRight className="w-5 h-5" />
            العودة للرئيسية / Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}