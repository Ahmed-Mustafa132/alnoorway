import React, { useState, useEffect } from 'react';
import { supabase } from '@/components/api/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2 } from 'lucide-react';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { SignInWithApple } from '@capacitor-community/apple-sign-in';
import { Capacitor } from '@capacitor/core';

export default function AuthPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // تهيئة جوجل للموبايل فقط
    if (Capacitor.isNativePlatform()) {
      GoogleAuth.initialize({
        clientId: '829658324868-lrbdqm9ekjpaunpaecm4bk4stn16ifte.apps.googleusercontent.com',
        iosClientId: 'apps.googleusercontent.com.829658324868-lrbdqm9ekjpaunpaecm4bk4stn16ifte', // أضف هذا السطر تحديداً للـ iOS
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });
    }
  }, []);

  const performUnifiedAuth = async (provider) => {
    setLoading(true);
    // البديل الذكي لـ @capacitor/device هو استخدام Core مباشرة
    const platform = Capacitor.getPlatform(); // 'ios' | 'android' | 'web'
    try {
      // 1. التعامل مع الويب (Web)
      if (platform === 'web') {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: provider,
          options: { redirectTo: window.location.origin }
        });
        if (error) throw error;
        return;
      }

      // 2. تسجيل الدخول بجوجل (Native Android & iOS)
      if (provider === 'google') {
        const googleUser = await GoogleAuth.signIn();
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: googleUser.authentication.idToken,
        });
        if (error) throw error;
        handleSuccess();
      }

      // 3. تسجيل الدخول بآبل (Native iOS فقط)
      if (provider === 'apple') {
        if (platform === 'ios') {
          const appleResult = await SignInWithApple.authorize({
            clientId: 'com.alnoorway.app', // تأكد من مطابقة الـ Bundle ID في Xcode
            redirectURI: 'https://raxudhplkjawspqajjqu.supabase.co/auth/v1/callback',
            scopes: 'email name',
          });

          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'apple',
            token: appleResult.response.identityToken,
          });
          if (error) throw error;
          handleSuccess();
        } else {
          // أندرويد أو غيره يستخدم الويب لآبل
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'apple',
            options: { redirectTo: window.location.origin }
          });
          if (error) throw error;
        }
      }
    } catch (error) {
      console.error(`${provider} Auth Error:`, error);
      toast.error(error.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    toast.success(t('login_success'));
    navigate('/');
  };

  const handleGoogleLogin = () => performUnifiedAuth('google');
  const handleAppleLogin = () => performUnifiedAuth('apple');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: 'com.alnoorway.app://home' }
        });
        if (error) throw error;
        toast.success(t('signup_success'));
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        handleSuccess();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4" dir="rtl">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/3f7f97347_android-chrome-192x192.png" alt="طريق النور" className="w-16 h-16" />
          </div>
          <CardTitle className="text-2xl font-bold text-emerald-800">طريق النور</CardTitle>
          <p className="text-sm text-gray-500 mt-4">{isSignUp ? t('create_account') : t('login')}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t("email")}</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="text-right" placeholder="name@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">{t("password")}</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="text-right" />
            </div>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isSignUp ? t('signup') : t('login'))}
            </Button>
          </form>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={handleGoogleLogin} disabled={loading} className="flex gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" className="w-4" alt="Google" />
              Google
            </Button>
            <Button variant="outline" onClick={handleAppleLogin} disabled={loading} className="bg-black text-white hover:bg-slate-800 flex gap-2">
              <svg className="w-4 h-4" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" /></svg>
              Apple
            </Button>
          </div>

          <div className="mt-4 text-center">
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-emerald-600 hover:underline">
              {isSignUp ? t('already_have_account') : t('dont_have_account')}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}