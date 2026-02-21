'use client';

import { useAdminAuth } from '@/components/admin/AdminAuthProvider';
import { Briefcase, Check, Trash2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

interface Application { id: number; name: string; email: string; phone: string; type: string; status: string; message?: string; created_at: string; }

export default function AdminCareerApplications() {
    const { token } = useAdminAuth();
    const [apps, setApps] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState<Application | null>(null);

    const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };
    const fetchApps = async () => { try { setLoading(true); const res = await fetch(`${API}/applications`, { headers }); const r = await res.json(); if (r.success) setApps(r.data.filter((a: Application) => a.type === 'career')); } catch { } finally { setLoading(false); } };
    useEffect(() => { if (token) fetchApps(); }, [token]);

    const updateStatus = async (id: number, status: string) => {
        try { await fetch(`${API}/applications/${id}/status`, { method: 'PATCH', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }); await fetchApps(); } catch { alert('Failed'); }
    };

    const handleDelete = async () => { if (!deleteConfirm) return; try { await fetch(`${API}/applications/${deleteConfirm.id}`, { method: 'DELETE', headers }); await fetchApps(); setDeleteConfirm(null); } catch { alert('Failed'); } };

    return (
        <div className="admin-page max-w-7xl mx-auto space-y-6">
            <div><h1 className="text-2xl font-serif text-gray-900">Career Applications ({apps.length})</h1><p className="text-sm text-gray-500">Job applications submitted through the careers page</p></div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[10px] uppercase tracking-wider text-gray-500 bg-gray-50 border-b border-gray-100">
                            <tr><th className="px-6 py-4 font-semibold">Applicant</th><th className="px-6 py-4 font-semibold">Contact</th><th className="px-6 py-4 font-semibold">Message</th><th className="px-6 py-4 font-semibold">Status</th><th className="px-6 py-4 font-semibold">Date</th><th className="px-6 py-4 font-semibold text-right">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400"><div className="w-6 h-6 border-2 border-[#C38636] border-t-transparent rounded-full animate-spin mx-auto mb-2" />Loading...</td></tr>
                                : apps.length === 0 ? <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400"><Briefcase className="mx-auto mb-2" size={32} />No career applications yet.</td></tr>
                                    : apps.map(a => (
                                        <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4"><p className="font-medium text-gray-900">{a.name}</p></td>
                                            <td className="px-6 py-4"><p className="text-gray-600 text-xs">{a.email}</p><p className="text-gray-400 text-xs">{a.phone}</p></td>
                                            <td className="px-6 py-4 text-gray-600 max-w-xs truncate text-xs">{a.message || <span className="text-gray-400 italic">No message</span>}</td>
                                            <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase ${a.status === 'approved' ? 'bg-green-100 text-green-700' : a.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{a.status}</span></td>
                                            <td className="px-6 py-4 text-gray-500 text-xs">{new Date(a.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-right"><div className="flex items-center justify-end gap-1.5">
                                                {a.status === 'pending' && <>
                                                    <button onClick={() => updateStatus(a.id, 'approved')} className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors" title="Approve"><Check size={16} /></button>
                                                    <button onClick={() => updateStatus(a.id, 'rejected')} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject"><XCircle size={16} /></button>
                                                </>}
                                                <button onClick={() => setDeleteConfirm(a)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
                                            </div></td>
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
                        <h3 className="text-xl font-serif text-gray-900 mb-2">Delete Application?</h3>
                        <p className="text-sm text-gray-500 mb-8">Delete <strong className="text-gray-700">{deleteConfirm.name}</strong>&apos;s career application?</p>
                        <div className="flex gap-3"><button onClick={() => setDeleteConfirm(null)} className="flex-1 px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">Cancel</button><button onClick={handleDelete} className="flex-1 px-5 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-lg shadow-red-200">Delete</button></div>
                    </div>
                </div>
            )}
        </div>
    );
}
