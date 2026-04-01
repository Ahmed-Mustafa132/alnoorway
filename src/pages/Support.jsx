import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Mail, MessageSquare, CheckCircle } from 'lucide-react';
import { supabase } from '@/components/api/supabaseClient';

export default function Support() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = 'Support / الدعم الفني - Smart Home Management';
    
    const metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = 'Contact our support team for help and assistance';
    document.head.appendChild(metaDescription);

    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = 'index, follow';
    document.head.appendChild(metaRobots);

    return () => {
      document.head.removeChild(metaDescription);
      document.head.removeChild(metaRobots);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save support request to Supabase
      const { error } = await supabase.from('ContactRequest').insert({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        request_type: 'support',
        status: 'معلق'
      });

      if (error) throw error;

      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending support request:', error);
      alert('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-green-100 rounded-full">
                  <CheckCircle className="w-16 h-16 text-green-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                تم إرسال رسالتك بنجاح!
              </h2>
              <p className="text-lg text-slate-600 mb-2">
                شكراً لتواصلك معنا
              </p>
              <p className="text-slate-500 mb-8">
                سنقوم بالرد عليك في أقرب وقت ممكن
              </p>
              <div className="space-y-4">
                <Button
                  onClick={() => setSubmitted(false)}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  إرسال رسالة أخرى
                </Button>
                <div>
                  <Link 
                    to={createPageUrl('Home')} 
                    className="text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    العودة للرئيسية
                  </Link>
                </div>
              </div>

              {/* English Translation */}
              <div className="mt-12 pt-8 border-t border-slate-200" dir="ltr">
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  Message Sent Successfully!
                </h2>
                <p className="text-slate-600 mb-2">
                  Thank you for contacting us
                </p>
                <p className="text-slate-500">
                  We will reply to you as soon as possible
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4">
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
              <div className="p-4 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full">
                <MessageSquare className="w-12 h-12 text-emerald-600" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              الدعم الفني | Support
            </CardTitle>
            <p className="text-slate-600 mt-4" dir="rtl">
              نحن هنا لمساعدتك! يرجى ملء النموذج أدناه وسنتواصل معك في أقرب وقت
            </p>
            <p className="text-slate-600 mt-2" dir="ltr">
              We're here to help! Please fill out the form below and we'll get back to you soon
            </p>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Arabic Form */}
              <div dir="rtl">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      الاسم <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="أدخل اسمك الكامل"
                      required
                      className="text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      البريد الإلكتروني <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="example@email.com"
                        required
                        className="pr-3 pl-10"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      رسالتك <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="اكتب رسالتك هنا... كيف يمكننا مساعدتك؟"
                      required
                      rows={6}
                      className="text-right resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 px-8 py-6 text-lg"
                >
                  {isSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة | Send Message'}
                </Button>
              </div>
            </form>

            {/* Contact Info */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Arabic */}
                <div className="text-center p-6 bg-slate-50 rounded-lg" dir="rtl">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    طرق أخرى للتواصل
                  </h3>
                  <div className="space-y-2 text-slate-600">
                    <p>📧 البريد الإلكتروني:</p>
                    <p className="font-medium text-emerald-600">osakr100@gmail.com</p>
                    <p className="mt-4 text-sm">
                      نرد على جميع الرسائل خلال 24-48 ساعة
                    </p>
                  </div>
                </div>

                {/* English */}
                <div className="text-center p-6 bg-slate-50 rounded-lg" dir="ltr">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    Other Ways to Contact
                  </h3>
                  <div className="space-y-2 text-slate-600">
                    <p>📧 Email:</p>
                    <p className="font-medium text-emerald-600">osakr100@gmail.com</p>
                    <p className="mt-4 text-sm">
                      We respond to all messages within 24-48 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}