import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, User, ChevronDown, ChevronUp, Heart } from "lucide-react";

export default function FatwaCard({ fatwa, isFavorited, onToggleFavorite }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm relative overflow-hidden group">
      <div className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
         <Button 
            size="icon" 
            variant="ghost" 
            className={`rounded-full ${isFavorited ? 'bg-rose-50 text-rose-500 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-300'} hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/50`}
            onClick={(e) => {
               e.stopPropagation();
               if(onToggleFavorite) onToggleFavorite();
            }}
         >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
         </Button>
      </div>
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
               <CardTitle className="text-xl leading-snug mb-2 text-gray-900 dark:text-white">{fatwa.question}</CardTitle>
               <span className="text-xs text-gray-400 whitespace-nowrap mr-2">
                  {new Date(fatwa.created_date).toLocaleDateString('ar-SA')}
               </span>
            </div>
            {fatwa.category && (
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-full text-xs font-medium">
                {fatwa.category}
              </span>
            )}
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
               <User className="w-3 h-3" />
               <span>{fatwa.mufti || "مفتي"}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {expanded && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-xl p-6 border-r-4 border-emerald-500">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-emerald-100 dark:border-emerald-800">
              <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold text-lg text-emerald-800 dark:text-emerald-300">
                أجاب الشيخ: {fatwa.mufti || "المفتي"}
              </span>
            </div>
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
              {fatwa.answer}
            </p>
            {fatwa.reference && (
              <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">المرجع: </span>
                  {fatwa.reference}
                </p>
              </div>
            )}
          </div>
        )}

        <Button
          variant="ghost"
          onClick={() => setExpanded(!expanded)}
          className="w-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4 ml-2" />
              إخفاء الجواب
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 ml-2" />
              عرض الجواب
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}