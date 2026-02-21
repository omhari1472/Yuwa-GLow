'use client';

import { useAdminAuth } from '@/components/admin/AdminAuthProvider';
import CustomSelect from '@/components/admin/CustomSelect';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { Briefcase, Edit, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://yuvaglow.com/api';

interface Career { id: number; title: string; department: string; location: string; description: string; status: string; created_at: string; }

export default function AdminCareers() {
    const { token } = useAdminAuth();
    const [items, setItems] = useState<Career[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<Career | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<Career | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ title: '', department: '', location: '', description: '', status: 'open' });

    const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };
    const jsonHeaders = { ...headers, 'Content-Type': 'application/json' };

    const fetchItems = async () => { try { setLoading(true); const res = await fetch(`${API}/careers`, { headers }); const r = await res.json(); if (r.success) setItems(r.data); } catch { } finally { setLoading(false); } };
    useEffect(() => { if (token) fetchItems(); }, [token]);

    const openAdd = () => { setEditItem(null); setForm({ title: '', department: '', location: '', description: '', status: 'open' }); setModalOpen(true); };
    const openEdit = (c: Career) => { setEditItem(c); setForm({ title: c.title, department: c.department, location: c.location, description: c.description, status: c.status }); setModalOpen(true); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setSubmitting(true);
        try {
            const url = editItem ? `${API}/careers/${editItem.id}` : `${API}/careers`;
            const method = editItem ? 'PUT' : 'POST';
            const res = await fetch(url, { method, headers: jsonHeaders, body: JSON.stringify(form) });
            if (res.ok) { await fetchItems(); setModalOpen(false); } else { const d = await res.json(); alert(d.message || 'Failed'); }
        } catch { alert('Network error'); } finally { setSubmitting(false); }
    };

    const handleDelete = async () => { if (!deleteConfirm) return; try { await fetch(`${API}/careers/${deleteConfirm.id}`, { method: 'DELETE', headers }); await fetchItems(); setDeleteConfirm(null); } catch { alert('Failed'); } };

    return (
        <div className="admin-page max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div><h1 className="text-2xl font-serif text-gray-900">Careers ({items.length})</h1><p className="text-sm text-gray-500">Manage job openings and career positions</p></div>
                <button onClick={openAdd} className="bg-[#13100A] text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-[#1a1610] transition-colors"><Plus size={18} /> Add Position</button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[10px] uppercase tracking-wider text-gray-500 bg-gray-50 border-b border-gray-100">
                            <tr><th className="px-6 py-4 font-semibold">Position</th><th className="px-6 py-4 font-semibold">Department</th><th className="px-6 py-4 font-semibold">Location</th><th className="px-6 py-4 font-semibold">Status</th><th className="px-6 py-4 font-semibold text-right">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400"><div className="w-6 h-6 border-2 border-[#C38636] border-t-transparent rounded-full animate-spin mx-auto mb-2" />Loading...</td></tr>
                                : items.length === 0 ? <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400"><Briefcase className="mx-auto mb-2" size={32} />No career openings.</td></tr>
                                    : items.map(c => (
                                        <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{c.title}</td>
                                            <td className="px-6 py-4 text-gray-600">{c.department}</td>
                                            <td className="px-6 py-4 text-gray-600">{c.location}</td>
                                            <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase ${c.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.status}</span></td>
                                            <td className="px-6 py-4 text-right"><div className="flex items-center justify-end gap-2"><button onClick={() => openEdit(c)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg"><Edit size={16} /></button><button onClick={() => setDeleteConfirm(c)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button></div></td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── LARGE ADD/EDIT MODAL ── */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
                    <div className="bg-white rounded-3xl shadow-2xl w-[80vw] max-w-4xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-200">
                        <div className="px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-[#13100A] to-[#2a2318] flex items-center justify-between flex-shrink-0">
                            <div><h3 className="text-xl font-serif text-white">{editItem ? 'Edit Position' : 'New Career Position'}</h3><p className="text-sm text-white/50 mt-0.5">{editItem ? 'Update job listing details' : 'Create a new job opening'}</p></div>
                            <button onClick={() => setModalOpen(false)} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors"><X size={22} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Job Title *</label><input required type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#C38636] focus:ring-2 focus:ring-[#C38636]/20" placeholder="e.g. Marketing Manager" /></div>
                                <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Department *</label><input required type="text" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#C38636]" placeholder="e.g. Marketing" /></div>
                                <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Location *</label><input required type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#C38636]" placeholder="e.g. Mumbai, India" /></div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Job Description *</label>
                                <RichTextEditor value={form.description} onChange={val => setForm({ ...form, description: val })} placeholder="Describe the role, responsibilities, and requirements..." />
                            </div>
                            <div className="space-y-2 max-w-xs">
                                <CustomSelect label="Status" value={form.status} onChange={val => setForm({ ...form, status: val })} options={[{ value: 'open', label: 'Open — Accepting applications' }, { value: 'closed', label: 'Closed — No longer accepting' }]} />
                            </div>
                        </form>
                        <div className="px-8 py-4 border-t border-gray-100 bg-white flex items-center justify-end gap-3 flex-shrink-0">
                            <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
                            <button onClick={handleSubmit} disabled={submitting} className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#C38636] to-[#DCB264] text-white font-semibold disabled:opacity-50 transition-all shadow-lg shadow-[#C38636]/20">{submitting ? 'Saving...' : editItem ? 'Update Position' : 'Create Position'}</button>
                        </div>
                    </div>
                </div>
            )}

            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center border border-gray-200">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5"><Trash2 className="text-red-500" size={28} /></div>
                        <h3 className="text-xl font-serif text-gray-900 mb-2">Delete Position?</h3>
                        <p className="text-sm text-gray-500 mb-8">Delete <strong className="text-gray-700">{deleteConfirm.title}</strong>? This cannot be undone.</p>
                        <div className="flex gap-3"><button onClick={() => setDeleteConfirm(null)} className="flex-1 px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">Cancel</button><button onClick={handleDelete} className="flex-1 px-5 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-lg shadow-red-200">Delete</button></div>
                    </div>
                </div>
            )}
        </div>
    );
}
