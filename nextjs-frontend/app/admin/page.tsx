'use client';

import { useAdminAuth } from '@/components/admin/AdminAuthProvider';
import { Activity, FileText, Package, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DashboardStats {
    total_products: number;
    pending_applications: number;
    active_distributors: number;
    total_blogs: number;
}

export default function AdminDashboard() {
    const { token, user } = useAdminAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/dashboard/stats`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                const result = await res.json();
                if (result.success) {
                    setStats(result.data);
                } else {
                    setError(result.message || 'Failed to fetch stats');
                }
            } catch (err) {
                setError('Error connecting to API');
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchStats();
    }, [token]);

    if (loading) return <div className="animate-pulse flex gap-4"><div className="w-full h-32 bg-gray-200 rounded-xl" /></div>;

    return (
        <div className="max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-serif text-gray-900 mb-1">Welcome back, {user?.name}</h1>
                <p className="text-gray-500 text-sm">Here's a quick overview of YuvaGlow's system status today.</p>
            </div>

            {error ? (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 mb-6">
                    {error}
                </div>
            ) : null}

            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard
                        title="Total Products"
                        value={stats.total_products?.toString() || '0'}
                        icon={Package}
                        trend="Active catalog"
                        color="bg-blue-50 text-blue-600"
                    />
                    <StatCard
                        title="Pending Applications"
                        value={stats.pending_applications?.toString() || '0'}
                        icon={Users}
                        trend="Needs review"
                        color="bg-amber-50 text-amber-600"
                    />
                    <StatCard
                        title="Active Distributors"
                        value={stats.active_distributors?.toString() || '0'}
                        icon={Activity}
                        trend="Approved partners"
                        color="bg-emerald-50 text-emerald-600"
                    />
                    <StatCard
                        title="Total Blogs"
                        value={stats.total_blogs?.toString() || '0'}
                        icon={FileText}
                        trend="Published content"
                        color="bg-purple-50 text-purple-600"
                    />
                </div>
            )}

            {/* Placeholder for future charting or quick actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="flex flex-wrap gap-4">
                        {/* Placeholders */}
                        <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 transition-colors">Add New Product</button>
                        <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 transition-colors">Review Applications</button>
                    </div>
                </div>
                <div className="bg-[#13100A] rounded-2xl p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#C38636]/10 rounded-full blur-2xl pointer-events-none" />
                    <h3 className="font-serif text-lg text-[#DCB264] mb-2">System Status</h3>
                    <p className="text-sm text-white/60 mb-6">All systems are operational. The Next.js frontend is connected to Laravel API successfully.</p>
                    <div className="h-px bg-white/10 w-full mb-4" />
                    <p className="text-xs text-white/40 uppercase tracking-wider">Version 2.0.0 — Live</p>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, trend, color }: any) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon size={24} />
                </div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">{title}</span>
            </div>
            <div>
                <h4 className="text-3xl font-semibold text-gray-900 mb-1">{value}</h4>
                <p className="text-xs text-gray-500">{trend}</p>
            </div>
        </div>
    );
}
