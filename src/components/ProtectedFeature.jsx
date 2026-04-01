import React from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProtectedFeature = ({ children, featureName = "هذه الميزة" }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
        <div className="text-center mb-6">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400 mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {featureName} متاحة للأعضاء فقط
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            سجل دخول أو أنشئ حساب جديد للوصول إلى هذه الميزة
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/auth?mode=signin')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            تسجيل الدخول
          </button>
          <button
            onClick={() => navigate('/auth?mode=signup')}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            إنشاء حساب
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedFeature;