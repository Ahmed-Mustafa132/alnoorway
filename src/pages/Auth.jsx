import React, { useState } from 'react';
import { supabase, signInWithProvider } from '@/components/api/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useLanguage } from '@/contexts/LanguageContext';
import { Apple, Loader2 } from 'lucide-react';

export default function AuthPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast.success(t('signup_success'));
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success(t('login_success'));
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    setLoading(true);
    try {
      const { error } = await signInWithProvider(provider);
      if (error) throw error;
      toast.success(t('redirecting_to_provider') || `Redirecting to ${provider}`);
    } catch (error) {
      toast.error(error.message || error.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4" dir="rtl">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ecdfbb3578091a5f1e1c54/3f7f97347_android-chrome-192x192.png"
              alt="طريق النور"
              className="w-16 h-16"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-emerald-800">
            طريق النور
          </CardTitle>
          <p className="text-sm text-gray-500 mt-4">
            {isSignUp ? t('create_account') : t('login')}
          </p>

        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <form onSubmit={handleAuth} className="space-y-4 pt-1">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700"> {t("email")}</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-right"
                  placeholder="name@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700"> {t("password")}</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-right"
                />
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={loading}>
                {loading ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('processing')}
                  </span>
                ) : (isSignUp ? t('signup') : t('login'))}
              </Button>
            </form>
          </div>
          <div className="space-y-3 pt-5">
            <div className="grid grid-cols-9 gap-2">
              <Button
                type="button"
                className="inline-flex col-span-4 items-center justify-center  gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
                onClick={() => handleOAuthLogin('google')}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
                  className="w-12"
                />}
                {t('continue_with_google')}
              </Button>
              <div className=" cal-span-1  top-0 flex items-center">
                <span className="mx-3 text-sm text-gray-500">{t('or') || 'OR'}</span>
              </div>
              <Button
                type="button"
                className="inline-flex col-span-4 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={loading}
                onClick={() => handleOAuthLogin('apple')}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Apple className="w-5 h-5" />}
                {t('continue_with_apple')}
              </Button>
            </div>
            <p className="text-center text-xs text-gray-500">{t('oauth_note') || 'Use Google or Apple to sign in quickly and securely.'}</p>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-emerald-600 hover:underline"
            >
              {isSignUp ? t('already_have_account') : t('dont_have_account')}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}