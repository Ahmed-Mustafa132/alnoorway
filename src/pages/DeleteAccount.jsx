import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';
import { supabase } from '@/components/api/supabaseClient';

export default function DeleteAccount() {
  const [formData, setFormData] = useState({
    email: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    document.title = 'Delete Account / حذف الحساب - Tariq Al-Noor';
    
    const metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = 'Request permanent account deletion';
    document.head.appendChild(metaDescription);

    return () => {
      document.head.removeChild(metaDescription);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save deletion request
      const { error } = await supabase.from('ContactRequest').insert({
        name: 'طلب حذف حساب',
        email: formData.email,
        message: formData.reason || 'طلب حذف الحساب',
        request_type: 'account_deletion',
        status: 'معلق'
      });

      if (error) throw error;

      setSubmitted(true);
      setFormData({ email: '', reason: '' });
    } catch (error) {
      console.error('Error submitting deletion request:', error);
      alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-red-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-green-100 rounded-full">
                  <CheckCircle className="w-16 h-16 text-green-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4" dir="rtl">
                تم استلام طلبك بنجاح
              </h2>
              <p className="text-lg text-slate-600 mb-2" dir="rtl">
                سيتم معالجة طلب حذف حسابك خلال 7 أيام عمل
              </p>
              <p className="text-slate-500 mb-8" dir="rtl">
                سيتم إرسال رسالة تأكيد على بريدك الإلكتروني
              </p>
              <Link 
                to={createPageUrl('Home')} 
                className="text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                العودة للرئيسية | Back to Home
              </Link>

              {/* English Translation */}
              <div className="mt-12 pt-8 border-t border-slate-200" dir="ltr">
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  Request Received Successfully
                </h2>
                <p className="text-slate-600 mb-2">
                  Your account deletion request will be processed within 7 business days
                </p>
                <p className="text-slate-500">
                  A confirmation email will be sent to you
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-red-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back to Home */}
        <Link 
          to={createPageUrl('Home')} 
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للرئيسية | Back to Home
        </Link>

        <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-red-100 rounded-full">
                <Trash2 className="w-12 h-12 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-slate-900">
              حذف الحساب | Delete Account
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            {/* Warning Notice - Arabic */}
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8" dir="rtl">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-red-900 mb-3">
                    تحذير هام: حذف الحساب نهائي
                  </h3>
                  <div className="space-y-2 text-slate-700">
                    <p className="font-semibold">عند حذف حسابك، سيتم حذف:</p>
                    <ul className="list-disc list-inside space-y-1 mr-4">
                      <li>جميع بياناتك الشخصية</li>
                      <li>سجل نشاطك في المنصة</li>
                      <li>المفضلات والتفضيلات</li>
                      <li>أي محتوى مرتبط بحسابك</li>
                    </ul>
                    <p className="font-semibold text-red-700 mt-4">
                      ⚠️ لا يمكن استرجاع الحساب بعد الحذف
                    </p>
                    <p className="text-sm mt-4">
                      <strong>المدة المتوقعة:</strong> سيتم معالجة طلبك خلال 7 أيام عمل
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Notice - English */}
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8" dir="ltr">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-red-900 mb-3">
                    Important Warning: Account Deletion is Permanent
                  </h3>
                  <div className="space-y-2 text-slate-700">
                    <p className="font-semibold">When you delete your account, the following will be removed:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>All your personal data</li>
                      <li>Your activity history on the platform</li>
                      <li>Favorites and preferences</li>
                      <li>Any content associated with your account</li>
                    </ul>
                    <p className="font-semibold text-red-700 mt-4">
                      ⚠️ Account cannot be recovered after deletion
                    </p>
                    <p className="text-sm mt-4">
                      <strong>Processing Time:</strong> Your request will be processed within 7 business days
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Deletion Request Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Arabic Form */}
              <div dir="rtl">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">
                  نموذج طلب حذف الحساب
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      البريد الإلكتروني <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="example@email.com"
                      required
                      className="text-right"
                      dir="ltr"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      أدخل البريد الإلكتروني المسجل في حسابك
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      سبب الحذف (اختياري)
                    </label>
                    <Textarea
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      placeholder="يمكنك إخبارنا بسبب حذف حسابك لتحسين خدماتنا (اختياري)"
                      rows={4}
                      className="text-right resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* English Form Labels */}
              <div dir="ltr" className="pt-6 border-t">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Account Deletion Request Form
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Enter your registered email address and optionally tell us why you're leaving
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg"
                >
                  {isSubmitting ? (
                    'جاري الإرسال... | Sending...'
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5 ml-2" />
                      طلب حذف الحساب | Request Account Deletion
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Alternative Contact */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Arabic */}
                <div className="text-center p-6 bg-slate-50 rounded-lg" dir="rtl">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    تواصل مباشر
                  </h3>
                  <p className="text-slate-600 mb-4">
                    يمكنك أيضًا إرسال طلب الحذف مباشرة عبر البريد الإلكتروني:
                  </p>
                  <a 
                    href="mailto:osakr100@gmail.com?subject=طلب حذف حساب&body=أرغب في حذف حسابي المسجل بالبريد الإلكتروني: "
                    className="font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    osakr100@gmail.com
                  </a>
                </div>

                {/* English */}
                <div className="text-center p-6 bg-slate-50 rounded-lg" dir="ltr">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Direct Contact
                  </h3>
                  <p className="text-slate-600 mb-4">
                    You can also send your deletion request directly via email:
                  </p>
                  <a 
                    href="mailto:osakr100@gmail.com?subject=Account Deletion Request&body=I would like to delete my account registered with email: "
                    className="font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    osakr100@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}