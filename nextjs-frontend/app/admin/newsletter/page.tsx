'use client';

import { useAdminAuth } from '@/components/admin/AdminAuthProvider';
import { Download, Mail, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://yuvaglow.com/api';

interface Subscriber { id: number; email: string; created_at: string; }

export default function AdminNewsletter() {
    const { token } = useAdminAuth();
    const [subs, setSubs] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState<Subscriber | null>(null);

    const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };

    const fetchSubs = async () => { try { setLoading(true); const res = await fetch(`${API}/newsletter`, { headers }); const r = await res.json(); if (r.success) setSubs(r.data); } catch { } finally { setLoading(false); } };
    useEffect(() => { if (token) fetchSubs(); }, [token]);

    const handleDelete = async () => { if (!deleteConfirm) return; try { await fetch(`${API}/newsletter/${deleteConfirm.id}`, { method: 'DELETE', headers }); await fetchSubs(); setDeleteConfirm(null); } catch { alert('Failed'); } };

    const exportCSV = () => {
        const csv = 'Email,Date\n' + subs.map(s => `${s.email},${new Date(s.created_at).toLocaleDateString()}`).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'newsletter_subscribers.csv'; a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="admin-page max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div><h1 className="text-2xl font-serif text-gray-900">Newsletter Subscribers ({subs.length})</h1><p className="text-sm text-gray-500">Email addresses collected from the website footer subscribe form</p></div>
                {subs.length > 0 && <button onClick={exportCSV} className="bg-[#13100A] text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-[#1a1610] transition-colors"><Download size={16} /> Export CSV</button>}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[10px] uppercase tracking-wider text-gray-500 bg-gray-50 border-b border-gray-100">
                            <tr><th className="px-6 py-4 font-semibold w-12">#</th><th className="px-6 py-4 font-semibold">Email Address</th><th className="px-6 py-4 font-semibold">Date Subscribed</th><th className="px-6 py-4 font-semibold text-right">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400"><div className="w-6 h-6 border-2 border-[#C38636] border-t-transparent rounded-full animate-spin mx-auto mb-2" />Loading...</td></tr>
                                : subs.length === 0 ? <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400"><Mail className="mx-auto mb-2" size={32} />No subscribers yet. Emails will appear here once users subscribe from the website footer.</td></tr>
                                    : subs.map((s, i) => (
                                        <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 text-gray-400 text-xs font-mono">{i + 1}</td>
                                            <td className="px-6 py-4"><p className="font-medium text-gray-900">{s.email}</p></td>
                                            <td className="px-6 py-4 text-gray-500">{new Date(s.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                            <td className="px-6 py-4 text-right"><button onClick={() => setDeleteConfirm(s)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remove subscriber"><Trash2 size={16} /></button></td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center border border-gray-200">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5"><Trash2 className="text-red-500" size={28} /></div>
                        <h3 className="text-xl font-serif text-gray-900 mb-2">Remove Subscriber?</h3>
                        <p className="text-sm text-gray-500 mb-8">Remove <strong className="text-gray-700">{deleteConfirm.email}</strong> from the newsletter list?</p>
                        <div className="flex gap-3"><button onClick={() => setDeleteConfirm(null)} className="flex-1 px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">Cancel</button><button onClick={handleDelete} className="flex-1 px-5 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-lg shadow-red-200">Remove</button></div>
                    </div>
                </div>
            )}
        </div>
    );
}
