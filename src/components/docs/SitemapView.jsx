import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitMerge, Layout, File, Home, BookOpen, MessageSquare, GraduationCap, Radio, PenTool } from "lucide-react";

export default function SitemapView() {
    const sitemap = [
        {
            name: "Home",
            path: "/",
            icon: Home,
            children: [
                { name: "Search", path: "/search" },
                { name: "Join Team", path: "/join-team" }
            ]
        },
        {
            name: "Learn Islam",
            path: "/learn-islam",
            icon: BookOpen,
            children: [
                { name: "Articles", path: "/articles" },
                { name: "Books", path: "/library" }
            ]
        },
        {
            name: "Fatwa",
            path: "/fatwa",
            icon: MessageSquare,
            children: [
                { name: "Request Fatwa", path: "/fatwa/request" },
                { name: "Fatwa Details", path: "/fatwa/:id" }
            ]
        },
        {
            name: "Courses",
            path: "/courses",
            icon: GraduationCap,
            children: [
                { name: "Quran Courses", path: "/quran-courses" },
                { name: "Course Viewer", path: "/courses/:id" }
            ]
        },
        {
            name: "Live Streams",
            path: "/live-streams",
            icon: Radio,
            children: [
                { name: "Watch Stream", path: "/live-streams/:id" }
            ]
        },
        {
            name: "Blog",
            path: "/blog",
            icon: PenTool,
            children: [
                { name: "Post Details", path: "/blog/:slug" }
            ]
        }
    ];

    return (
        <div className="space-y-6" dir="ltr">
            <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gray-50/50 border-b">
                    <CardTitle className="flex items-center gap-2">
                        <GitMerge className="w-5 h-5 text-emerald-600" />
                        Application Sitemap
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="flex flex-col items-center">
                        {/* Root Node */}
                        <div className="bg-slate-800 text-white px-6 py-3 rounded-lg shadow-md mb-8 relative z-10 font-mono">
                            alnourway.base44.app
                        </div>

                        {/* Connection Line Vertical */}
                        <div className="w-0.5 h-8 bg-gray-300 -mt-8 mb-8"></div>

                        {/* Connection Line Horizontal */}
                        <div className="w-[80%] h-0.5 bg-gray-300 mb-8 relative">
                            {/* Vertical connectors for children */}
                            <div className="absolute left-0 top-0 w-0.5 h-4 bg-gray-300"></div>
                            <div className="absolute right-0 top-0 w-0.5 h-4 bg-gray-300"></div>
                            <div className="absolute left-1/2 top-0 w-0.5 h-4 bg-gray-300"></div>
                        </div>

                        {/* First Level Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                            {sitemap.map((page, idx) => (
                                <div key={idx} className="flex flex-col items-center relative group">
                                    <div className="w-0.5 h-4 bg-gray-300 absolute -top-12 md:-top-4"></div>
                                    
                                    <div className="bg-white border-2 border-emerald-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all w-full max-w-xs text-center z-10">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="p-2 bg-emerald-50 rounded-full text-emerald-600">
                                                <page.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-800">{page.name}</h3>
                                                <code className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">{page.path}</code>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Children */}
                                    {page.children && (
                                        <div className="mt-4 w-full pl-8 border-l-2 border-dashed border-gray-200 ml-16 md:ml-[50%] space-y-2">
                                            {page.children.map((child, cIdx) => (
                                                <div key={cIdx} className="flex items-center gap-2 text-sm text-gray-600 relative">
                                                    <div className="w-4 h-0.5 bg-gray-200 absolute -left-8"></div>
                                                    <File className="w-3 h-3 text-gray-400" />
                                                    <span>{child.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}