import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight, Shield, Lock, Eye, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-emerald-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full mb-4">
            <Shield className="w-5 h-5 text-emerald-700" />
            <span className="text-emerald-800 font-semibold">Privacy Policy / سياسة الخصوصية</span>
          </div>
        </div>

        {/* Back to Home Button */}
        <Link to={createPageUrl("Home")} className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6 group">
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          العودة للرئيسية / Back to Home
        </Link>

        {/* Arabic Section */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-8" dir="rtl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <FileText className="w-8 h-8 text-emerald-600" />
              <h1 className="text-3xl font-bold text-gray-900">سياسة الخصوصية</h1>
            </div>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                في <strong>طريق النور</strong>، نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. 
                توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية المعلومات التي تقدمها عند استخدام منصتنا.
              </p>

              <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                <h2 className="text-xl font-bold text-emerald-900 mb-3 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  المعلومات التي نجمعها
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  <li>المعلومات الشخصية: الاسم، البريد الإلكتروني، رقم الهاتف (عند التسجيل)</li>
                  <li>معلومات الاستخدام: سجل التصفح، المحتوى المفضل، والتفاعلات داخل التطبيق</li>
                  <li>البيانات التقنية: عنوان IP، نوع المتصفح، نظام التشغيل</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h2 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  كيف نستخدم معلوماتك
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  <li>تقديم وتحسين خدماتنا التعليمية والإرشادية</li>
                  <li>إرسال الإشعارات والتحديثات المهمة</li>
                  <li>الرد على استفساراتك وطلبات الدعم</li>
                  <li>تحليل الاستخدام لتطوير المنصة</li>
                  <li>حماية أمن وسلامة المنصة</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                <h2 className="text-xl font-bold text-purple-900 mb-3">حماية البيانات</h2>
                <p className="text-gray-800">
                  نستخدم إجراءات أمنية متقدمة لحماية بياناتك من الوصول غير المصرح به أو التعديل أو الكشف أو الإتلاف. 
                  يتم تشفير جميع البيانات الحساسة أثناء النقل والتخزين.
                </p>
              </div>

              <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                <h2 className="text-xl font-bold text-amber-900 mb-3">حقوقك</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  <li>الوصول إلى بياناتك الشخصية ومراجعتها</li>
                  <li>طلب تصحيح أو تحديث معلوماتك</li>
                  <li>حذف حسابك وبياناتك</li>
                  <li>الاعتراض على معالجة بياناتك</li>
                  <li>سحب موافقتك في أي وقت</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-3">مشاركة البيانات</h2>
                <p className="text-gray-800">
                  نحن <strong>لا نبيع</strong> بياناتك الشخصية لأطراف ثالثة. قد نشارك المعلومات مع مقدمي الخدمات الموثوقين 
                  فقط للمساعدة في تشغيل المنصة، وذلك بموجب اتفاقيات صارمة للسرية.
                </p>
              </div>

              <p className="text-sm text-gray-600 pt-4 border-t border-gray-200">
                <strong>آخر تحديث:</strong> يناير 2026<br/>
                <strong>للاستفسارات:</strong> يرجى التواصل معنا عبر صفحة <Link to={createPageUrl("ContactPreacher")} className="text-emerald-600 hover:text-emerald-700 underline">التواصل</Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* English Section */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-8" dir="ltr">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <FileText className="w-8 h-8 text-emerald-600" />
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            </div>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                At <strong>Tariq Al-Noor</strong>, we respect your privacy and are committed to protecting your personal data. 
                This Privacy Policy explains how we collect, use, and safeguard the information you provide when using our platform.
              </p>

              <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                <h2 className="text-xl font-bold text-emerald-900 mb-3 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Information We Collect
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  <li>Personal Information: Name, email, phone number (when registering)</li>
                  <li>Usage Information: Browsing history, favorite content, and in-app interactions</li>
                  <li>Technical Data: IP address, browser type, operating system</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h2 className="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  How We Use Your Information
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  <li>Provide and improve our educational and guidance services</li>
                  <li>Send important notifications and updates</li>
                  <li>Respond to your inquiries and support requests</li>
                  <li>Analyze usage to develop the platform</li>
                  <li>Protect the security and integrity of the platform</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                <h2 className="text-xl font-bold text-purple-900 mb-3">Data Protection</h2>
                <p className="text-gray-800">
                  We use advanced security measures to protect your data from unauthorized access, modification, disclosure, or destruction. 
                  All sensitive data is encrypted during transmission and storage.
                </p>
              </div>

              <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                <h2 className="text-xl font-bold text-amber-900 mb-3">Your Rights</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  <li>Access and review your personal data</li>
                  <li>Request correction or update of your information</li>
                  <li>Delete your account and data</li>
                  <li>Object to data processing</li>
                  <li>Withdraw your consent at any time</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Data Sharing</h2>
                <p className="text-gray-800">
                  We <strong>do not sell</strong> your personal data to third parties. We may share information with trusted service providers 
                  only to help operate the platform, under strict confidentiality agreements.
                </p>
              </div>

              <p className="text-sm text-gray-600 pt-4 border-t border-gray-200">
                <strong>Last Updated:</strong> January 2026<br/>
                <strong>Contact Us:</strong> Please reach out via our <Link to={createPageUrl("ContactPreacher")} className="text-emerald-600 hover:text-emerald-700 underline">Contact page</Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home at Bottom */}
        <div className="text-center mt-8">
          <Link 
            to={createPageUrl("Home")} 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
          >
            <ArrowRight className="w-5 h-5" />
            العودة للرئيسية / Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}