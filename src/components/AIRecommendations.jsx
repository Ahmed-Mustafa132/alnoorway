import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { supabase } from "@/components/api/supabaseClient";

export default function AIRecommendations({ userEmail }) {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['ai_recommendations', userEmail],
    queryFn: async () => {
      // Fetch simplistic history (this could be improved by fetching actual ViewHistory)
      const { data: history } = await supabase.from('UserPreference').select('*').eq('user_email', userEmail);
      
      // Simplified for demo: passing basic context
      const { data, error } = await supabase.functions.invoke('aiAssistant', {
        body: {
          action: 'recommend',
          userHistory: history?.[0]?.interested_topics || ['general']
        }
      });
      
      if (error) {
         console.error("AI Recommendation Error:", error);
         return [];
      }
      return data?.recommendations || [];
    },
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  if (isLoading || !recommendations?.length) return null;

  return (
    <Card className="mb-8 border-purple-100 bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-900">
      <CardHeader>
        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
          <Sparkles className="w-5 h-5" />
          <CardTitle className="text-lg">اقتراحات ذكية لك</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {recommendations.map((rec, i) => (
            <div key={i} className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-purple-100 dark:border-purple-800">
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{rec.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{rec.reason}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}