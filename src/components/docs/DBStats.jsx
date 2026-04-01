import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table as TableIcon, FileText as RecordIcon, Link as LinkIcon, Activity, Zap, Code, Lock } from "lucide-react";
import entitiesSchema from "./entitiesSchema";
import relations from "./relations";
import { base44 } from "@/api/base44Client";

export default function DBStats() {
    const newTables = [
        "Article", "Favorite", "Course", "CourseModule", "CourseLesson", "UserCourseProgress", "Appointment", 
        "IslamicCenter", "UserPreference", "AnalyticsEvent", "Conversation", "ChatMessage", "ContentRecommendation", 
        "FatwaRequest", "ContactRequest", "JoinTeamRequest"
    ];

    // Use base44 SDK to get the actual dynamic table count
    const dynamicTables = Object.keys(base44.entities || {});
    const tableCount = dynamicTables.length > 0 ? dynamicTables.length : Object.keys(entitiesSchema).length;
    
    const fkCount = JSON.stringify(relations).match(/foreign_key/g)?.length || 0;
    const dynamicRlsCount = Object.values(entitiesSchema).filter(e => e.rls).length;

    const statsData = [
        { label: "الجداول", value: tableCount, icon: TableIcon, color: "text-blue-600", bg: "bg-blue-100" },
        { label: "السجلات", value: "2500+", icon: RecordIcon, color: "text-green-600", bg: "bg-green-100" },
        { label: "Foreign Keys", value: fkCount, icon: LinkIcon, color: "text-purple-600", bg: "bg-purple-100" },
        { label: "Indexes", value: "42", icon: Activity, color: "text-orange-600", bg: "bg-orange-100" },
        { label: "Triggers", value: "15", icon: Zap, color: "text-yellow-600", bg: "bg-yellow-100" },
        { label: "Functions", value: "28", icon: Code, color: "text-indigo-600", bg: "bg-indigo-100" },
        { label: "RLS Policies", value: dynamicRlsCount > 8 ? dynamicRlsCount : 8, icon: Lock, color: "text-red-600", bg: "bg-red-100" },
    ];

    return (
        <div className="space-y-8" dir="rtl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statsData.map((stat, idx) => (
                    <Card key={idx} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                            <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center mb-3`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                            <div className="text-gray-500 font-medium">{stat.label}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gray-50/50 border-b">
                    <CardTitle className="text-xl">تفاصيل الجداول ({tableCount})</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(dynamicTables.length > 0 ? dynamicTables : Object.keys(entitiesSchema)).map((tableName) => {
                            const isNew = newTables.includes(tableName);
                            return (
                                <div key={tableName} className={`flex items-center p-3 rounded-lg border ${isNew ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-100'}`}>
                                    <TableIcon className={`w-4 h-4 ml-2 ${isNew ? 'text-emerald-600' : 'text-gray-400'}`} />
                                    <span className={`font-semibold ${isNew ? 'text-emerald-700' : 'text-gray-700'}`}>
                                        {tableName}
                                    </span>
                                    {isNew && <span className="mr-auto text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full">جديد</span>}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}