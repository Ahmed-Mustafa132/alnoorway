import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Home } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-4">
      <Link 
        to={createPageUrl("Home")} 
        className="text-gray-600 hover:text-emerald-600 transition-colors flex items-center gap-1"
      >
        <Home className="w-4 h-4" />
        <span className="hidden sm:inline">الرئيسية</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronLeft className="w-4 h-4 text-gray-400 rotate-180" />
          {item.href ? (
            <Link 
              to={item.href}
              className="text-gray-600 hover:text-emerald-600 transition-colors truncate max-w-[150px] sm:max-w-none"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-emerald-600 font-semibold truncate max-w-[150px] sm:max-w-none">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}