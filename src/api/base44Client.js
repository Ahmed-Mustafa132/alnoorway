// ملف بديل لـ base44Client
// المشروع يستخدم Supabase الآن، هذا الملف للتوافق فقط

export const base44 = {
  integrations: {
    Core: {
      InvokeLLM: async () => {
        throw new Error('base44 integration is not available in this project');
      }
    }
  }
};

export default base44;