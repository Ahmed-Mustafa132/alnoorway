import React, { useState } from 'react';
import { CheckCircle2, Star, Shield, Smartphone, Zap, Globe, Users, Database, Download, Sparkles, Copy, RefreshCw } from "lucide-react";
import { jsPDF } from "jspdf";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function DocsFeatures() {
    const [aiInput, setAiInput] = useState("");
    const [aiOutput, setAiOutput] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownloadProfile = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(22);
        doc.setTextColor(5, 150, 105); // Emerald color
        doc.text("Al Nour Way - Platform Profile", 105, 20, { align: "center" });
        
        doc.setFontSize(14);
        doc.setTextColor(100);
        doc.text("Comprehensive Islamic Platform for Education & Guidance", 105, 30, { align: "center" });
        
        doc.setLineWidth(0.5);
        doc.setDrawColor(200);
        doc.line(20, 35, 190, 35);

        let y = 50;

        features.forEach((feature, index) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }

            doc.setFontSize(16);
            doc.setTextColor(0);
            
            // English titles mapping for PDF compatibility
            const englishTitles = [
                "Smart Fatwa System", "Comprehensive Content Management", "Advanced Analytics", 
                "Multi-language Support (i18n)", "Role Based Access Control", "Responsive Design", 
                "Direct Communication", "AI Content Generation"
            ];
            
            doc.text(`${index + 1}. ${englishTitles[index] || feature.title}`, 20, y);
            
            doc.setFontSize(11);
            doc.setTextColor(100);
            const descLines = doc.splitTextToSize(feature.description_en || "Advanced feature for the platform.", 170);
            doc.text(descLines, 20, y + 8);
            
            y += 25;
        });
        
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 290, { align: "center" });

        doc.save("alnourway-profile.pdf");
    };

    const generateContent = async () => {
        if (!aiInput.trim()) return;
        
        setIsGenerating(true);
        try {
            const result = await base44.integrations.Core.InvokeLLM({
                prompt: `You are an expert marketing copywriter for an Islamic educational platform called "Al Nour Way". 
                Rewrite and improve the following text to be more engaging, professional, and persuasive for a feature description or promotional material.
                Keep the tone respectful and inspiring.
                
                Text to improve: "${aiInput}"
                
                Output language: Arabic.`,
            });
            setAiOutput(result);
        } catch (error) {
            console.error("AI Generation failed:", error);
            setAiOutput("عذراً، حدث خطأ أثناء التوليد. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsGenerating(false);
        }
    };

    const features = [
        {
            title: "نظام الفتاوى الذكي",
            description: "إدارة متكاملة للفتاوى مع دعم الذكاء الاصطناعي للاقتراح والتلخيص، وربط مباشر مع العلماء.",
            description_en: "Integrated Fatwa management with AI support for suggestions and summarization, plus direct scholar connection.",
            icon: Star,
            color: "text-amber-500",
            bg: "bg-amber-100"
        },
        {
            title: "إدارة المحتوى الشاملة",
            description: "لوحة تحكم متقدمة لإدارة المقالات، المحاضرات، القصص، والدورات بسهولة ومرونة.",
            description_en: "Advanced dashboard for managing articles, lectures, stories, and courses with ease and flexibility.",
            icon: Database,
            color: "text-blue-500",
            bg: "bg-blue-100"
        },
        {
            title: "تحليلات متقدمة",
            description: "نظام تتبع وتحليل لسلوك المستخدمين والمشاهدات للمساعدة في اتخاذ القرارات وتحسين المحتوى.",
            description_en: "User behavior tracking and analytics system to help in decision making and content improvement.",
            icon: Zap,
            color: "text-purple-500",
            bg: "bg-purple-100"
        },
        {
            title: "تعدد اللغات (i18n)",
            description: "دعم كامل للغات متعددة (العربية، الإنجليزية، الفرنسية، الأردية) مع دعم الاتجاه RTL/LTR.",
            description_en: "Full multi-language support (Arabic, English, French, Urdu) with RTL/LTR support.",
            icon: Globe,
            color: "text-emerald-500",
            bg: "bg-emerald-100"
        },
        {
            title: "نظام الأدوار والصلاحيات",
            description: "حماية متقدمة باستخدام RLS (Row Level Security) وتعدد أدوار (مستخدم، مشرف، مدير).",
            description_en: "Advanced protection using RLS (Row Level Security) and multi-role system (User, Moderator, Admin).",
            icon: Shield,
            color: "text-red-500",
            bg: "bg-red-100"
        },
        {
            title: "تصميم متجاوب وحديث",
            description: "واجهة مستخدم عصرية تعمل بكفاءة على جميع الأجهزة (موبايل، تابلت، ديسكتوب).",
            description_en: "Modern user interface that works efficiently on all devices (Mobile, Tablet, Desktop).",
            icon: Smartphone,
            color: "text-teal-500",
            bg: "bg-teal-100"
        },
        {
            title: "التواصل المباشر",
            description: "أدوات للتواصل الفوري بين المستخدمين والعلماء، وحجز المواعيد.",
            description_en: "Tools for instant communication between users and scholars, and appointment booking.",
            icon: Users,
            color: "text-indigo-500",
            bg: "bg-indigo-100"
        },
        {
            title: "توليد المحتوى بالذكاء الاصطناعي",
            description: "مساعد ذكي لإنشاء مسودات المقالات والفتاوى وتحسين جودة المحتوى.",
            description_en: "AI assistant for creating article and fatwa drafts and improving content quality.",
            icon: Zap,
            color: "text-pink-500",
            bg: "bg-pink-100"
        }
    ];

    return (
        <div className="space-y-8" dir="rtl">
            <div className="text-center max-w-2xl mx-auto mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">لماذا "طريق النور"؟</h2>
                <p className="text-gray-600">
                    منصة متكاملة تجمع بين الأصالة والتقنية الحديثة لتقديم تجربة إسلامية فريدة وشاملة.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                    <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <CardContent className="p-6">
                            <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                                <feature.icon className={`w-6 h-6 ${feature.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                            <div className="mt-4 flex items-center text-sm font-medium text-gray-400">
                                <CheckCircle2 className="w-4 h-4 ml-1 text-emerald-500" />
                                ميزة نشطة
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-12 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 text-white text-center shadow-2xl">
                <h3 className="text-2xl font-bold mb-4">جاهز للبدء؟</h3>
                <p className="text-emerald-100 mb-6 max-w-xl mx-auto">
                    نظام "طريق النور" يوفر لك كل ما تحتاجه لإدارة منصة إسلامية دعوية وتعليمية متكاملة.
                </p>
                <button 
                    onClick={handleDownloadProfile}
                    className="bg-emerald-800/50 text-white px-6 py-2 rounded-full font-bold hover:bg-emerald-800 transition-colors flex items-center gap-2 mx-auto"
                >
                    <Download className="w-5 h-5" />
                    تحميل البروفايل (PDF)
                </button>
            </div>

            {/* AI Content Generator Section */}
            <Card className="mt-12 border-emerald-100 shadow-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
                    <CardTitle className="flex items-center gap-2 text-purple-800">
                        <Sparkles className="w-6 h-6 text-purple-600" />
                        مساعد كتابة المحتوى الدعائي (AI)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <Label htmlFor="ai-input" className="text-base font-semibold">اكتب وصفاً أولياً للميزة أو الإعلان:</Label>
                            <Textarea 
                                id="ai-input"
                                placeholder="مثال: ميزة جديدة تسمح للطلاب بمتابعة تقدمهم في حفظ القرآن..."
                                className="min-h-[150px] bg-white border-purple-200 focus:border-purple-500"
                                value={aiInput}
                                onChange={(e) => setAiInput(e.target.value)}
                            />
                            <Button 
                                onClick={generateContent} 
                                disabled={isGenerating || !aiInput.trim()}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2"
                            >
                                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                تحسين وتوليد النص
                            </Button>
                        </div>
                        <div className="space-y-4">
                            <Label className="text-base font-semibold">النص المقترح:</Label>
                            <div className="min-h-[150px] p-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 leading-relaxed whitespace-pre-wrap relative group">
                                {aiOutput || <span className="text-gray-400 italic">ستظهر النتيجة هنا...</span>}
                                {aiOutput && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => {
                                            navigator.clipboard.writeText(aiOutput);
                                            alert("تم نسخ النص!");
                                        }}
                                    >
                                        <Copy className="w-4 h-4 text-gray-500" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}