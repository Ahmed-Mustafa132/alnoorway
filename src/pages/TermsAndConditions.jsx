import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, FileText, Shield, AlertTriangle, Copyright, UserX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsAndConditions() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Terms & Conditions | الشروط والأحكام - طريق النور";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
            <FileText className="w-5 h-5 text-blue-700" />
            <span className="text-blue-800 font-semibold">Terms & Conditions / الشروط والأحكام</span>
          </div>
        </div>

        {/* Back to Home Button */}
        <button 
          onClick={() => navigate('/')}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 group"
        >
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          العودة للرئيسية / Back to Home
        </button>

        {/* Arabic Section */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-8" dir="rtl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <FileText className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">الشروط والأحكام</h1>
            </div>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                مرحباً بك في <strong>طريق النور</strong>. باستخدامك لهذه المنصة، فإنك توافق على الالتزام بالشروط والأحكام التالية.
              </p>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h2 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  استخدام المنصة
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  <li>يجب أن يكون عمرك 13 عاماً أو أكثر لاستخدام المنصة</li>
                  <li>يجب عليك تقديم معلومات دقيقة وصحيحة عند التسجيل</li>
                  <li>أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور الخاصة بك</li>
                  <li>يُحظر استخدام المنصة لأي أغراض غير قانونية أو محظورة</li>
                  <li>يجب احترام جميع المستخدمين والمساهمين في المنصة</li>
                </ul>
              </div>

              <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                <h2 className="text-xl font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  مسؤولية المستخدم
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  <li>أنت مسؤول بالكامل عن جميع الأنشطة التي تتم من خلال حسابك</li>
                  <li>يحظر نشر محتوى مسيء أو مخالف للشريعة الإسلامية</li>
                  <li>يحظر محاولة اختراق أو إلحاق الضرر بالمنصة</li>
                  <li>يحظر استخدام المنصة لأغراض تجارية دون إذن مسبق</li>
                  <li>يجب عليك الإبلاغ عن أي محتوى أو سلوك غير لائق</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                <h2 className="text-xl font-bold text-purple-900 mb-3 flex items-center gap-2">
                  <Copyright className="w-5 h-5" />
                  الملكية الفكرية
                </h2>
                <p className="text-gray-800 mb-3">
                  جميع المحتويات المتاحة على المنصة (نصوص، صور، فيديوهات، صوتيات) محمية بحقوق الملكية الفكرية:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  <li>لا يجوز نسخ أو إعادة نشر المحتوى دون إذن كتابي</li>
                  <li>يمكن مشاركة المحتوى للأغراض التعليمية والدعوية مع الإشارة للمصدر</li>
                  <li>جميع العلامات التجارية والشعارات مملوكة لـ طريق النور</li>
                  <li>المحتوى المقدم من المستخدمين يخضع لمراجعة وموافقة الإدارة</li>
                </ul>
              </div>

              <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                <h2 className="text-xl font-bold text-red-900 mb-3 flex items-center gap-2">
                  <UserX className="w-5 h-5" />
                  إيقاف الحسابات
                </h2>
                <p className="text-gray-800 mb-3">
                  نحتفظ بالحق في إيقاف أو حذف أي حساب في الحالات التالية:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  <li>انتهاك الشروط والأحكام</li>
                  <li>نشر محتوى مسيء أو مخالف</li>
                  <li>محاولة إساءة استخدام المنصة</li>
                  <li>الاحتيال أو انتحال الشخصية</li>
                  <li>الإضرار بسمعة المنصة أو المستخدمين الآخرين</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-3">إخلاء المسؤولية الشرعية</h2>
                <p className="text-gray-800">
                  المعلومات والفتاوى المقدمة على المنصة هي لأغراض إرشادية فقط. يُنصح بالرجوع إلى علماء موثوقين في منطقتك للحصول على فتاوى مخصصة.
                  <strong> نحن لا نتحمل مسؤولية أي قرارات تتخذ بناءً على المعلومات المقدمة.</strong>
                </p>
              </div>

              <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                <h2 className="text-xl font-bold text-emerald-900 mb-3">التعديلات على الشروط</h2>
                <p className="text-gray-800">
                  نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت. سيتم إخطارك بأي تغييرات جوهرية، واستمرارك في استخدام المنصة يعني موافقتك على الشروط المحدثة.
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
              <FileText className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Terms & Conditions</h1>
            </div>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                Welcome to <strong>Tariq Al-Noor</strong>. By using this platform, you agree to comply with the following terms and conditions.
              </p>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h2 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Platform Usage
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  <li>You must be 13 years or older to use the platform</li>
                  <li>You must provide accurate and truthful information when registering</li>
                  <li>You are responsible for maintaining the confidentiality of your account and password</li>
                  <li>Use of the platform for any unlawful or prohibited purposes is forbidden</li>
                  <li>All users and contributors must be treated with respect</li>
                </ul>
              </div>

              <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                <h2 className="text-xl font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  User Responsibility
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  <li>You are fully responsible for all activities conducted through your account</li>
                  <li>Posting offensive or non-Islamic content is prohibited</li>
                  <li>Attempting to hack or damage the platform is forbidden</li>
                  <li>Commercial use without prior permission is not allowed</li>
                  <li>You must report any inappropriate content or behavior</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                <h2 className="text-xl font-bold text-purple-900 mb-3 flex items-center gap-2">
                  <Copyright className="w-5 h-5" />
                  Intellectual Property
                </h2>
                <p className="text-gray-800 mb-3">
                  All content available on the platform (texts, images, videos, audio) is protected by intellectual property rights:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  <li>Content may not be copied or republished without written permission</li>
                  <li>Content can be shared for educational and dawah purposes with source attribution</li>
                  <li>All trademarks and logos are owned by Tariq Al-Noor</li>
                  <li>User-submitted content is subject to administrative review and approval</li>
                </ul>
              </div>

              <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                <h2 className="text-xl font-bold text-red-900 mb-3 flex items-center gap-2">
                  <UserX className="w-5 h-5" />
                  Account Suspension
                </h2>
                <p className="text-gray-800 mb-3">
                  We reserve the right to suspend or delete any account in the following cases:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  <li>Violation of terms and conditions</li>
                  <li>Posting offensive or inappropriate content</li>
                  <li>Attempted abuse of the platform</li>
                  <li>Fraud or impersonation</li>
                  <li>Damaging the reputation of the platform or other users</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Religious Disclaimer</h2>
                <p className="text-gray-800">
                  The information and fatwas provided on the platform are for guidance purposes only. It is advised to consult trusted scholars in your area for personalized fatwas.
                  <strong> We are not responsible for any decisions made based on the information provided.</strong>
                </p>
              </div>

              <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                <h2 className="text-xl font-bold text-emerald-900 mb-3">Modifications to Terms</h2>
                <p className="text-gray-800">
                  We reserve the right to modify these terms and conditions at any time. You will be notified of any material changes, and your continued use of the platform constitutes acceptance of the updated terms.
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            <ArrowRight className="w-5 h-5" />
            العودة للرئيسية / Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}