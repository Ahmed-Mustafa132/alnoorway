import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function ArticleCard({ article }) {
  return (
    <Link to={createPageUrl(`ArticleView?id=${article.id}`)}>
      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col group overflow-hidden bg-white">
        <div className="h-48 overflow-hidden relative">
          <img 
            src={article.image_url || "https://placehold.co/600x400/e2e8f0/1e293b?text=Article"} 
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <CardContent className="p-5 flex-1 flex flex-col">
          <div className="flex gap-2 mb-3">
            {article.tags?.slice(0, 2).map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                {tag}
              </Badge>
            ))}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">
            {article.meta_description || article.content}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-4 border-t">
            <div className="flex items-center gap-2">
              <User className="w-3 h-3" />
              {article.author || 'طريق النور'}
            </div>
            <div className="flex items-center gap-1 text-blue-600 font-medium">
              اقرأ المزيد
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}