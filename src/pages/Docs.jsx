import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Star, Layout, Database, PieChart, GitMerge, FileText, Server, Lock, Link2, FileJson, Table as TableIcon, LayoutDashboard, Code, BarChart3 } from "lucide-react";

// Components
import DocsFeatures from "@/components/docs/DocsFeatures";
import DocsFrontend from "@/components/docs/DocsFrontend";
import DocsBackend from "@/components/docs/DocsBackend";
import SitemapView from "@/components/docs/SitemapView";
import MarkdownView from "@/components/docs/MarkdownView";
import DBStats from "@/components/docs/DBStats";
import GenericDocView from "@/components/docs/GenericDocView";

// Data
import entitiesSchema from "@/components/docs/entitiesSchema";
import relations from "@/components/docs/relations";
import authSchema from "@/components/docs/authSchema";
import apiEndpoints from "@/components/docs/apiEndpoints";
import sampleData from "@/components/docs/sampleData";

export default function Docs() {
  const [mainTab, setMainTab] = useState("features");

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center md:text-right flex items-center justify-between flex-row-reverse md:flex-row">
            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm font-medium">
                Internal Use Only
            </div>
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">توثيق النظام</h1>
                <p className="text-gray-500">المرجع التقني للكيانات والواجهة البرمجية (API) والهيكلية.</p>
            </div>
        </div>

        <Tabs value={mainTab} onValueChange={setMainTab} className="space-y-6">
          <TabsList className="bg-white p-2 shadow-sm border h-auto flex-wrap justify-center w-full md:w-fit mx-auto md:mr-0 rounded-xl">
            <TabsTrigger value="features" className="gap-2 px-6 py-3 text-lg data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
                <Star className="w-5 h-5" />
                مزايا الموقع
            </TabsTrigger>
            <TabsTrigger value="frontend" className="gap-2 px-6 py-3 text-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <Layout className="w-5 h-5" />
                Frontend
            </TabsTrigger>
            <TabsTrigger value="backend" className="gap-2 px-6 py-3 text-lg data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
                <Database className="w-5 h-5" />
                Backend
            </TabsTrigger>
          </TabsList>

          <TabsContent value="features" className="mt-6">
            <DocsFeatures />
          </TabsContent>

          <TabsContent value="frontend" className="mt-6">
            <Tabs defaultValue="sitemap" className="space-y-6">
               <div className="flex justify-center md:justify-start">
                   <TabsList className="bg-white border shadow-sm">
                       <TabsTrigger value="sitemap" className="gap-2">
                           <GitMerge className="w-4 h-4" />
                           Sitemap
                       </TabsTrigger>
                       <TabsTrigger value="markdown" className="gap-2">
                           <FileText className="w-4 h-4" />
                           Markdown
                       </TabsTrigger>
                       <TabsTrigger value="analytics" className="gap-2">
                           <PieChart className="w-4 h-4" />
                           الإحصائيات
                       </TabsTrigger>
                   </TabsList>
               </div>

               <TabsContent value="sitemap">
                   <SitemapView />
               </TabsContent>
               <TabsContent value="markdown">
                   <MarkdownView />
               </TabsContent>
               <TabsContent value="analytics">
                   <DocsFrontend />
               </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="backend" className="mt-6">
             <Tabs defaultValue="pages" className="space-y-6">
                <div className="flex justify-center md:justify-start flex-wrap">
                   <TabsList className="bg-white border shadow-sm h-auto flex-wrap justify-start">
                       <TabsTrigger value="pages" className="gap-2">
                           <LayoutDashboard className="w-4 h-4" />
                           Backend صفحات
                       </TabsTrigger>
                       <TabsTrigger value="db_stats" className="gap-2">
                           <BarChart3 className="w-4 h-4" />
                           إحصائيات DB
                       </TabsTrigger>
                       <TabsTrigger value="entities" className="gap-2">
                           <TableIcon className="w-4 h-4" />
                           هيكل البيانات
                       </TabsTrigger>
                       <TabsTrigger value="relations" className="gap-2">
                           <Link2 className="w-4 h-4" />
                           العلاقات
                       </TabsTrigger>
                       <TabsTrigger value="auth" className="gap-2">
                           <Lock className="w-4 h-4" />
                           المصادقة
                       </TabsTrigger>
                       <TabsTrigger value="api" className="gap-2">
                           <Server className="w-4 h-4" />
                           API Endpoints
                       </TabsTrigger>
                       <TabsTrigger value="sample" className="gap-2">
                           <FileJson className="w-4 h-4" />
                           بيانات تجريبية
                       </TabsTrigger>
                   </TabsList>
               </div>

               <TabsContent value="pages">
                   <DocsBackend />
               </TabsContent>
               <TabsContent value="db_stats">
                   <DBStats />
               </TabsContent>
               <TabsContent value="entities">
                   <GenericDocView title="هيكل البيانات" data={entitiesSchema} icon={TableIcon} />
               </TabsContent>
               <TabsContent value="relations">
                   <GenericDocView title="العلاقات" data={relations} icon={Link2} />
               </TabsContent>
               <TabsContent value="auth">
                   <GenericDocView title="المصادقة" data={authSchema} icon={Lock} />
               </TabsContent>
               <TabsContent value="api">
                   <GenericDocView title="API Endpoints" data={apiEndpoints} icon={Server} />
               </TabsContent>
               <TabsContent value="sample">
                   <GenericDocView title="بيانات تجريبية" data={sampleData} icon={FileJson} />
               </TabsContent>
             </Tabs>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}