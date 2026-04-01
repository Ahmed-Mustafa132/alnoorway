import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/components/api/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    let mounted = true;
    let isLoadingUser = false; // منع التحميل المتعدد

    const loadUserData = async (authUser) => {
      // منع التحميل المتزامن
      if (isLoadingUser || !mounted) return;
      
      isLoadingUser = true;
      
      try {
        // جلب بيانات المستخدم من جدول Profile
        const { data: profile, error } = await supabase
          .from('Profile')
          .select('*')
          .eq('user_id', authUser.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('⚠️ Error loading profile:', error);
        }

        if (!mounted) return;

        // دمج البيانات
        const userData = {
          id: authUser.id,
          email: authUser.email,
          full_name: profile?.full_name || authUser.user_metadata?.full_name || authUser.email,
          role: profile?.role || 'user',
          avatar_url: profile?.avatar_url,
          ...authUser.user_metadata,
          profile_id: profile?.id
        };

        console.log('✅ User data loaded:', userData.email, 'Role:', userData.role);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('❌ Error in loadUserData:', error);
        if (!mounted) return;
        
        // حتى لو فشل، استخدم بيانات Auth
        setUser({
          id: authUser.id,
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || authUser.email,
          role: 'user',
          ...authUser.user_metadata
        });
        setIsAuthenticated(true);
      } finally {
        isLoadingUser = false;
      }
    };

    const initAuth = async () => {
      try {
        setIsLoadingAuth(true);
        setAuthError(null);
        
        // فحص الجلسة الحالية
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Session check failed:', error);
          setAuthError({
            type: 'auth_error',
            message: error.message
          });
          setIsAuthenticated(false);
          setUser(null);
        } else if (session?.user) {
          await loadUserData(session.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
        
        setIsLoadingAuth(false);
      } catch (error) {
        console.error('Unexpected error:', error);
        if (!mounted) return;
        
        setAuthError({
          type: 'unknown',
          message: error.message || 'An unexpected error occurred'
        });
        setIsLoadingAuth(false);
        setIsAuthenticated(false);
      }
    };

    // الاستماع لتغييرات تسجيل الدخول - مرة واحدة فقط
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.email);
        
        // فقط عند تسجيل الخروج
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
          setIsLoadingAuth(false);
        }
        // تجاهل الأحداث الأخرى لأن initAuth تعاملت معها
      }
    );

    initAuth();

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []); // بدون dependencies - تشغيل مرة واحدة فقط

  const logout = async (shouldRedirect = true) => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      
      if (shouldRedirect) {
        window.location.href = '/auth';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigateToLogin = () => {
    window.location.href = '/auth';
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // سيتم تحميل البيانات تلقائيًا عبر onAuthStateChange
      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      
      const { data: { user: authUser }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      if (authUser) {
        // تحديث البيانات
        const { data: profile } = await supabase
          .from('Profile')
          .select('*')
          .eq('user_id', authUser.id)
          .single();

        const userData = {
          id: authUser.id,
          email: authUser.email,
          full_name: profile?.full_name || authUser.user_metadata?.full_name || authUser.email,
          role: profile?.role || 'user',
          avatar_url: profile?.avatar_url,
          ...authUser.user_metadata,
          profile_id: profile?.id
        };

        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setIsLoadingAuth(false);
    } catch (error) {
      console.error('User auth check failed:', error);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      
      if (error.status === 401 || error.status === 403) {
        setAuthError({
          type: 'auth_required',
          message: 'Authentication required'
        });
      }
    }
  };

  const checkAppState = async () => {
    await checkUserAuth();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      role: user?.role,
      isAdmin: user?.role === 'admin',
      isModerator: user?.role === 'moderator',
      isModeratorOrAdmin: user?.role === 'moderator' || user?.role === 'admin',
      logout,
      navigateToLogin,
      checkAppState,
      checkUserAuth,
      signIn,
      signUp
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};