import React, { useState, useEffect } from 'react';
import { supabase } from "@/components/api/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layout, Layers, Eye, FileCode, Search, Wand2, RefreshCw } from "lucide-react";

export default function DocsBackend() {
    const [pageStats, setPageStats] = useState({});
    const [generatingSitemap, setGeneratingSitemap] = useState(false);
    const [optimizingPage, setOptimizingPage] = useState(null);

    // Definition of the site structure
    const siteStructure = [
        {
            name: "Home",
            path: "/home",
            description: "Landing page with hero, features, and quick access.",
            sections: ["Hero Section", "Features Grid", "Stats Row", "Daily Quote"],
            type: "Page",
            priority: 1.0
        },
        {
            name: "Learn Islam",
            path: "/learn-islam",
            description: "Educational hub for Islamic principles.",
            sections: ["Principles Cards", "Pillars of Islam", "Faith Pillars"],
            type: "Page",
            priority: 0.9
        },
        {
            name: "Fatwa",
            path: "/fatwa",
            description: "Fatwa browsing and requesting interface.",
            sections: ["Search Bar", "Fatwa List", "Ask Question Modal"],
            type: "Page",
            priority: 0.8
        },
        {
            name: "Courses",
            path: "/courses",
            description: "Course catalog and enrollment.",
            sections: ["Course List", "Filters", "My Courses"],
            type: "Page",
            priority: 0.8
        },
        {
            name: "Blog",
            path: "/blog",
            description: "Articles and written content.",
            sections: ["Article List", "Search", "Featured Article"],
            type: "Page",
            priority: 0.7
        },
        {
            name: "Live Streams",
            path: "/live-streams",
            description: "Live broadcasting and upcoming schedule.",
            sections: ["Live Player", "Upcoming Schedule"],
            type: "Page",
            priority: 0.7
        },
        {
            name: "Admin Dashboard",
            path: "/admin",
            description: "Content management system.",
            sections: ["Analytics", "Content Management", "Users", "Settings"],
            type: "System",
            priority: 0.0
        }
    ];

    useEffect(() => {
        fetchPageStats();
    }, []);

    const fetchPageStats = async () => {
        // Simple client-side aggregation for demo
        const { data } = await supabase
            .from('AnalyticsEvent')
            .select('content_id')
            .eq('event_type', 'view')
            .order('created_date', { ascending: false })
            .limit(2000);

        if (data) {
            const stats = {};
            data.forEach(item => {
                const key = item.content_id?.toLowerCase();
                stats[key] = (stats[key] || 0) + 1;
            });
            setPageStats(stats);
        }
    };

    const getViews = (pageName) => {
        const key = pageName.toLowerCase();
        const keyWithPage = `page_${key}`; 
        return (pageStats[key] || 0) + (pageStats[keyWithPage] || 0) + (pageStats[pageName] || 0);
    };

    const generateSitemap = async () => {
        setGeneratingSitemap(true);
        
        const baseUrl = window.location.origin;
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
        
        siteStructure.filter(p => p.type === "Page").forEach(page => {
            xml += `  <url>\n`;
            xml += `    <loc>${baseUrl}${page.path}</loc>\n`;
            xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
            xml += `    <changefreq>weekly</changefreq>\n`;
            xml += `    <priority>${page.priority}</priority>\n`;
            xml += `  </url>\n`;
        });
        
        xml += `</urlset>`;
        
        const blob = new Blob([xml], { type: "text/xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "sitemap.xml";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        setTimeout(() => setGeneratingSitemap(false), 1000);
    };

    const optimizeMeta = async (page) => {
        setOptimizingPage(page.name);
        
        // Temporarily disabled - base44 integration not available
        alert(`Meta optimization for ${page.name} is currently unavailable.\n\nPlease configure the AI integration.`);
        
        setOptimizingPage(null);
    };

    return (
        <div className="space-y-6" dir="rtl">
            {/* SEO Tools Header */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                        <Search className="w-5 h-5" />
                        أدوات SEO المتقدمة
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap items-center gap-4">
                        <Button 
                            onClick={generateSitemap} 
                            disabled={generatingSitemap}
                            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                        >
                            {generatingSitemap ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileCode className="w-4 h-4" />}
                            توليد Sitemap.xml
                        </Button>
                        <p className="text-sm text-blue-600/80">
                            قم بتوليد ملف خريطة الموقع تلقائياً بناءً على هيكلية الصفحات الحالية لتقديمه لمحركات البحث.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Pages Grid */}
            <div className="grid gap-6">
                {siteStructure.map((page, index) => (
                    <Card key={index} className="overflow-hidden border-l-4 border-l-emerald-500">
                        <CardHeader className="bg-gray-50/50 pb-4">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 rounded-lg">
                                        {page.type === "System" ? <Layout className="w-5 h-5 text-emerald-600" /> : <FileCode className="w-5 h-5 text-emerald-600" />}
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                                            {page.name}
                                            {page.type === "System" && <Badge variant="secondary" className="text-xs">System</Badge>}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                            <code className="bg-gray-200 px-1 py-0.5 rounded text-xs">{page.path}</code>
                                        </div>
                                    </div>
                                </div>
                                
                                {page.type === "Page" && (
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => optimizeMeta(page)}
                                        disabled={optimizingPage === page.name}
                                        className="text-purple-600 border-purple-200 hover:bg-purple-50 gap-2"
                                    >
                                        {optimizingPage === page.name ? <Wand2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                                        تحسين Meta
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <p className="text-gray-600 mb-4 text-sm">{page.description}</p>
                            
                            <div className="flex items-center gap-2 mb-4 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                                <Eye className="w-4 h-4" />
                                <span className="font-semibold">{getViews(page.name)}</span> مشاهدة
                            </div>

                            <div className="space-y-3">
                                <div className="grid grid-cols-3 text-xs font-semibold text-gray-500 border-b pb-2">
                                    <div>القسم الداخلي</div>
                                    <div>الوصف / الوظيفة</div>
                                    <div className="text-left">النوع</div>
                                </div>
                                {page.sections.map((section, sIndex) => (
                                    <div key={sIndex} className="grid grid-cols-3 text-sm items-center hover:bg-gray-50 p-1 rounded transition-colors">
                                        <div className="flex items-center gap-2">
                                            <Layers className="w-3 h-3 text-gray-400" />
                                            {section}
                                        </div>
                                        <div className="text-gray-500 text-xs truncate">جزء من صفحة {page.name}</div>
                                        <div className="text-left">
                                            <Badge variant="outline" className="text-[10px] font-normal">UI Section</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}