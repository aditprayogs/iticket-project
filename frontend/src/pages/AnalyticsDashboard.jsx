// src/pages/AnalyticsDashboard.jsx
import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Ticket, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];

const AnalyticsDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axiosInstance.get('/analytics/stats');
                setStats(res.data);
            } catch (err) {
                console.error('Gagal mengambil statistik:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
        document.title = 'Analitik & Performa SLA | ITicket';
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Memuat data analitik...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Dashboard Analitik & SLA</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Ringkasan performa dan tren tiket masuk portal IT Support.</p>
            </div>

            {/* KARTU STATISTIK UTAMA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-xl">
                        <Ticket size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tiket Bulan Ini</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.total_this_month}</h3>
                    </div>
                </div>

                <div className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Rata-rata Penyelesaian (SLA)</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.avg_resolution_hours} <span className="text-sm font-normal text-slate-500">Jam</span></h3>
                    </div>
                </div>

                <div className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center gap-4 sm:col-span-2 lg:col-span-1">
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-purple-600 rounded-xl">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Kategori Terbanyak</p>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                            {stats?.category_breakdown[0]?.category_name || '-'}
                        </h3>
                    </div>
                </div>
            </div>

            {/* AREA GRAFIK STATISTIK */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* TREN TIKET 7 HARI TERAKHIR */}
                <div className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tren Tiket (7 Hari Terakhir)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.daily_trend}>
                                <XAxis dataKey="date" stroke="#888888" fontSize={11} />
                                <YAxis stroke="#888888" fontSize={11} allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Jumlah Tiket" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* DISTRIBUTION PER KATEGORI */}
                <div className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Persentase Masalah per Kategori</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats?.category_breakdown}
                                    dataKey="count"
                                    nameKey="category_name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label
                                >
                                    {stats?.category_breakdown.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend fontSize={12} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;