import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn("Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const supabaseRedirectTo = import.meta.env.VITE_SUPABASE_REDIRECT_URL || (typeof window !== 'undefined' ? window.location.origin : '');

export const signInWithProvider = async (provider) => {
  return supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: 'com.alnoorway.tareeqalnoor://home',
      skipBrowserRedirect: false
    },
  });
};

export const signInWithGoogle = () => signInWithProvider('google');
export const signInWithApple = () => signInWithProvider('apple');