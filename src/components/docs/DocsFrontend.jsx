import React, { useState, useEffect } from 'react';
import { supabase } from "@/components/api/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, Calendar, Filter, RefreshCw } from "lucide-react";

export default function DocsFrontend() {
    const [dateFrom, setDateFrom] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
    const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalEvents: 0,
        uniqueUsers: 0,
        eventsByType: [],
        eventsOverTime: [],
        topPages: []
    });

    const fetchStats = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('AnalyticsEvent')
                .select('*')
                .gte('created_date', dateFrom)
                .lte('created_date', new Date(new Date(dateTo).setHours(23, 59, 59)).toISOString());

            const { data, error } = await query;
            
            if (error) throw error;

            processStats(data);
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    const processStats = (data) => {
        if (!data || data.length === 0) {
             setStats({ totalEvents: 0, uniqueUsers: 0, eventsByType: [], eventsOverTime: [], topPages: [] });
             return;
        }

        // 1. Total Events
        const totalEvents = data.length;

        // 2. Unique Users
        const uniqueUsers = new Set(data.map(d => d.user_email)).size;

        // 3. Events by Type
        const typeCount = {};
        data.forEach(d => {
            typeCount[d.event_type] = (typeCount[d.event_type] || 0) + 1;
        });
        const eventsByType = Object.keys(typeCount).map(key => ({ name: key, value: typeCount[key] }));

        // 4. Events Over Time
        const timeCount = {};
        data.forEach(d => {
            const date = new Date(d.created_date).toLocaleDateString('en-GB'); // DD/MM/YYYY
            timeCount[date] = (timeCount[date] || 0) + 1;
        });
        const eventsOverTime = Object.keys(timeCount).map(date => ({ date, count: timeCount[date] }));

        // 5. Top Content/Pages
        const contentCount = {};
        data.filter(d => d.event_type === 'view').forEach(d => {
            const key = d.content_id || 'Unknown';
            contentCount[key] = (contentCount[key] || 0) + 1;
        });
        const topPages = Object.entries(contentCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, value]) => ({ name, value }));

        setStats({ totalEvents, uniqueUsers, eventsByType, eventsOverTime, topPages });
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="space-y-6" dir="rtl">
            {/* Filters */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Filter className="w-5 h-5 text-emerald-600" />
                        تصفية البيانات
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">من تاريخ</label>
                            <Input 
                                type="date" 
                                value={dateFrom} 
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-40"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">إلى تاريخ</label>
                            <Input 
                                type="date" 
                                value={dateTo} 
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-40"
                            />
                        </div>
                        <Button onClick={fetchStats} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                            تحديث
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-blue-50 border-blue-100">
                    <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-blue-700">{stats.totalEvents}</div>
                        <div className="text-sm text-blue-600">إجمالي الأحداث</div>
                    </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-100">
                    <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-green-700">{stats.uniqueUsers}</div>
                        <div className="text-sm text-green-600">مستخدم فريد</div>
                    </CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-100">
                    <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-purple-700">
                            {Math.round(stats.totalEvents / (stats.uniqueUsers || 1))}
                        </div>
                        <div className="text-sm text-purple-600">متوسط الأحداث/مستخدم</div>
                    </CardContent>
                </Card>
                <Card className="bg-orange-50 border-orange-100">
                    <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold text-orange-700">{stats.eventsOverTime.length}</div>
                        <div className="text-sm text-orange-600">أيام نشطة</div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>النشاط عبر الزمن</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stats.eventsOverTime}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" fontSize={12} />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#059669" strokeWidth={2} name="النشاط" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>توزيع أنواع الأحداث</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.eventsByType}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {stats.eventsByType.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Top Pages */}
            <Card>
                <CardHeader>
                    <CardTitle>الصفحات/المحتوى الأكثر زيارة</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.topPages} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={150} fontSize={12} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#059669" name="عدد الزيارات" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}