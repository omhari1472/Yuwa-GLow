'use client';

import { useAdminAuth } from '@/components/admin/AdminAuthProvider';
import CustomSelect from '@/components/admin/CustomSelect';
import { Plus, Sparkles, Trash2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://yuvaglow.com/api';
const STORAGE = process.env.NEXT_PUBLIC_STORAGE_URL || 'https://yuvaglow.com/storage';

interface Transformation { id: number; title: string; description: string | null; before_image: string; after_image: string; sort_order: number; status: string; }

export default function AdminTransformations() {
    const { token } = useAdminAuth();
    const [items, setItems] = useState<Transformation[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<Transformation | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', status: 'published', sort_order: '0' });
    const [beforeImg, setBeforeImg] = useState<File | null>(null);
    const [afterImg, setAfterImg] = useState<File | null>(null);
    const [beforePreview, setBeforePreview] = useState<string | null>(null);
    const [afterPreview, setAfterPreview] = useState<string | null>(null);

    const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };
    const fetchItems = async () => { try { setLoading(true); const res = await fetch(`${API}/transformations`, { headers }); const r = await res.json(); if (r.success) setItems(r.data); } catch { } finally { setLoading(false); } };
    useEffect(() => { if (token) fetchItems(); }, [token]);

    const handleFilePreview = (file: File, setter: (v: string | null) => void) => { const reader = new FileReader(); reader.onloadend = () => setter(reader.result as string); reader.readAsDataURL(file); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setSubmitting(true);
        try {
            const fd = new FormData(); fd.append('title', form.title); fd.append('description', form.description); fd.append('status', form.status); fd.append('sort_order', form.sort_order);
            if (beforeImg) fd.append('before_image', beforeImg);
            if (afterImg) fd.append('after_image', afterImg);
            const res = await fetch(`${API}/transformations`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }, body: fd });
            if (res.ok) { await fetchItems(); setModalOpen(false); } else { const d = await res.json(); alert(d.message || 'Failed'); }
        } catch { alert('Network error'); } finally { setSubmitting(false); }
    };

    const handleDelete = async () => { if (!deleteConfirm) return; try { await fetch(`${API}/transformations/${deleteConfirm.id}`, { method: 'DELETE', headers }); await fetchItems(); setDeleteConfirm(null); } catch { alert('Failed'); } };
    const imgUrl = (url: string) => url?.startsWith('http') ? url : `${STORAGE}/${url}`;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div><h1 className="text-2xl font-serif text-gray-900">Transformations ({items.length})</h1><p className="text-sm text-gray-500">Manage before & after transformation showcases</p></div>
                <button onClick={() => { setModalOpen(true); setBeforeImg(null); setAfterImg(null); setBeforePreview(null); setAfterPreview(null); setForm({ title: '', description: '', status: 'published', sort_order: '0' }); }} className="bg-[#13100A] text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-[#1a1610] transition-colors"><Plus size={18} /> Add Transformation</button>
            </div>

            {loading ? <div className="text-center py-12 text-gray-400"><div className="w-6 h-6 border-2 border-[#C38636] border-t-transparent rounded-full animate-spin mx-auto mb-2" />Loading...</div> : items.length === 0 ? <div className="text-center py-12 text-gray-400"><Sparkles className="mx-auto mb-2" size={32} />No transformations yet.</div> : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {items.map(item => (
                        <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="grid grid-cols-2 gap-0.5">
                                <div className="aspect-square relative bg-gray-100"><Image src={imgUrl(item.before_image)} alt="Before" fill className="object-cover" /><span className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-full">BEFORE</span></div>
                                <div className="aspect-square relative bg-gray-100"><Image src={imgUrl(item.after_image)} alt="After" fill className="object-cover" /><span className="absolute bottom-2 left-2 text-[10px] bg-[#C38636] text-white px-2 py-0.5 rounded-full">AFTER</span></div>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <div><p className="font-medium text-gray-900">{item.title}</p>{item.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.description}</p>}</div>
                                <div className="flex items-center gap-2"><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{item.status}</span><button onClick={() => setDeleteConfirm(item)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── LARGE ADD MODAL ── */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
                    <div className="bg-white rounded-3xl shadow-2xl w-[85vw] max-w-5xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-200">
                        <div className="px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-[#13100A] to-[#2a2318] flex items-center justify-between flex-shrink-0">
                            <div><h3 className="text-xl font-serif text-white">Add Transformation</h3><p className="text-sm text-white/50 mt-0.5">Upload before & after comparison images</p></div>
                            <button onClick={() => setModalOpen(false)} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors"><X size={22} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                            <div className="p-8 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="sm:col-span-2 space-y-2"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Title *</label><input required type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#C38636] focus:ring-2 focus:ring-[#C38636]/20" placeholder="e.g. Keratin Treatment Results" /></div>
                                    <div className="sm:col-span-2 space-y-2"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Description</label><textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#C38636] resize-none" placeholder="Brief description of the transformation..." /></div>
                                </div>

                                {/* Before / After side by side */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Before Image *</label>
                                        {beforePreview && <div className="aspect-square rounded-2xl overflow-hidden border-2 border-gray-200 bg-white max-h-[250px]"><Image src={beforePreview} alt="Before" width={400} height={400} className="w-full h-full object-cover" /></div>}
                                        <label className="flex flex-col items-center justify-center w-full min-h-[120px] border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-[#C38636] hover:bg-[#C38636]/5 transition-all group">
                                            <Upload size={24} className="text-gray-300 group-hover:text-[#C38636] mb-2" />
                                            <span className="text-sm text-gray-500 group-hover:text-[#C38636]">{beforeImg ? beforeImg.name : 'Upload before image'}</span>
                                            <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { setBeforeImg(f); handleFilePreview(f, setBeforePreview); } }} className="hidden" />
                                        </label>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">After Image *</label>
                                        {afterPreview && <div className="aspect-square rounded-2xl overflow-hidden border-2 border-[#C38636]/30 bg-white max-h-[250px]"><Image src={afterPreview} alt="After" width={400} height={400} className="w-full h-full object-cover" /></div>}
                                        <label className="flex flex-col items-center justify-center w-full min-h-[120px] border-2 border-dashed border-[#C38636]/30 rounded-2xl cursor-pointer hover:border-[#C38636] hover:bg-[#C38636]/5 transition-all group">
                                            <Upload size={24} className="text-[#C38636]/40 group-hover:text-[#C38636] mb-2" />
                                            <span className="text-sm text-gray-500 group-hover:text-[#C38636]">{afterImg ? afterImg.name : 'Upload after image'}</span>
                                            <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { setAfterImg(f); handleFilePreview(f, setAfterPreview); } }} className="hidden" />
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-2"><CustomSelect label="Status" value={form.status} onChange={val => setForm({ ...form, status: val })} options={[{ value: 'published', label: 'Published' }, { value: 'draft', label: 'Draft' }]} /></div>
                                    <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Sort Order</label><input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: e.target.value })} className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#C38636]" /></div>
                                </div>
                            </div>
                        </form>
                        <div className="px-8 py-4 border-t border-gray-100 bg-white flex items-center justify-end gap-3 flex-shrink-0">
                            <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
                            <button onClick={handleSubmit} disabled={submitting} className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#C38636] to-[#DCB264] text-white font-semibold disabled:opacity-50 transition-all shadow-lg shadow-[#C38636]/20">{submitting ? 'Uploading...' : 'Add Transformation'}</button>
                        </div>
                    </div>
                </div>
            )}

            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center border border-gray-200">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5"><Trash2 className="text-red-500" size={28} /></div>
                        <h3 className="text-xl font-serif text-gray-900 mb-2">Delete Transformation?</h3>
                        <p className="text-sm text-gray-500 mb-8">Delete <strong className="text-gray-700">{deleteConfirm.title}</strong>? Both images will be removed.</p>
                        <div className="flex gap-3"><button onClick={() => setDeleteConfirm(null)} className="flex-1 px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">Cancel</button><button onClick={handleDelete} className="flex-1 px-5 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-lg shadow-red-200">Delete</button></div>
                    </div>
                </div>
            )}
        </div>
    );
}
