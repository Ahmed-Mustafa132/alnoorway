import React, { useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { supabase } from "@/components/api/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, AlertCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Register() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    confirmPassword: ""
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
    setSuccess("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            role: 'user'
          }
        }
      });

      if (error) throw error;

      setSuccess("تم إنشاء الحساب بنجاح! يرجى تفعيل حسابك من البريد الإلكتروني");
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || "فشل إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-4 md:p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-6 py-3 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="text-blue-800 font-semibold">منصة النور الطريق</span>
          </div>
        </div>

        <Card className="border-0 shadow-2xl bg-white dark:bg-slate-800/95 backdrop-blur-sm rounded-3xl transition-colors duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white transition-colors duration-300">
              إنشاء حساب جديد
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 md:p-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">{success}</p>
              </motion.div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="full_name" className="text-gray-700 dark:text-gray-300 font-medium mb-2 block transition-colors duration-300">
                  الاسم الكامل
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="أدخل اسمك الكامل"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                  className="rounded-2xl"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium mb-2 block transition-colors duration-300">
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@domain.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="rounded-2xl"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium mb-2 block transition-colors duration-300">
                  كلمة المرور
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="rounded-2xl"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300 font-medium mb-2 block transition-colors duration-300">
                  تأكيد كلمة المرور
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="rounded-2xl"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 py-6 text-lg rounded-2xl"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>جاري التحميل...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    <span>إنشاء حساب</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                لديك حساب بالفعل؟ تسجيل الدخول
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
