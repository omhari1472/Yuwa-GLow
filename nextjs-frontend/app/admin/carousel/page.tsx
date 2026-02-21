'use client';

import { useAdminAuth } from '@/components/admin/AdminAuthProvider';
import CustomSelect from '@/components/admin/CustomSelect';
import { Layers, Plus, Trash2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
const STORAGE = 'http://127.0.0.1:8000/storage';

interface CarouselItem { id: number; image_url: string; mobile_image_url: string | null; sort_order: number; status: string; }

export default function AdminCarousel() {
    const { token } = useAdminAuth();
    const [items, setItems] = useState<CarouselItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<CarouselItem | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ status: 'active', sort_order: '0' });
    const [desktopImg, setDesktopImg] = useState<File | null>(null);
    const [mobileImg, setMobileImg] = useState<File | null>(null);
    const [desktopPreview, setDesktopPreview] = useState<string | null>(null);
    const [mobilePreview, setMobilePreview] = useState<string | null>(null);

    const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };
    const fetchItems = async () => { try { setLoading(true); const res = await fetch(`${API}/carousel`, { headers }); const r = await res.json(); if (r.success) setItems(r.data); } catch { } finally { setLoading(false); } };
    useEffect(() => { if (token) fetchItems(); }, [token]);

    const handleFilePreview = (file: File, setter: (v: string | null) => void) => { const reader = new FileReader(); reader.onloadend = () => setter(reader.result as string); reader.readAsDataURL(file); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setSubmitting(true);
        try {
            const fd = new FormData(); fd.append('status', form.status); fd.append('sort_order', form.sort_order);
            if (desktopImg) fd.append('image', desktopImg);
            if (mobileImg) fd.append('mobile_image', mobileImg);
            const res = await fetch(`${API}/carousel`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }, body: fd });
            if (res.ok) { await fetchItems(); setModalOpen(false); } else { const d = await res.json(); alert(d.message || 'Failed'); }
        } catch { alert('Network error'); } finally { setSubmitting(false); }
    };

    const handleDelete = async () => { if (!deleteConfirm) return; try { await fetch(`${API}/carousel/${deleteConfirm.id}`, { method: 'DELETE', headers }); await fetchItems(); setDeleteConfirm(null); } catch { alert('Failed'); } };
    const imgUrl = (url: string) => url?.startsWith('http') ? url : `${STORAGE}/${url}`;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div><h1 className="text-2xl font-serif text-gray-900">Home Carousel ({items.length})</h1><p className="text-sm text-gray-500">Manage homepage banner slides</p></div>
                <button onClick={() => { setModalOpen(true); setDesktopImg(null); setMobileImg(null); setDesktopPreview(null); setMobilePreview(null); setForm({ status: 'active', sort_order: '0' }); }} className="bg-[#13100A] text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-[#1a1610] transition-colors"><Plus size={18} /> Add Slide</button>
            </div>

            {loading ? <div className="text-center py-12 text-gray-400"><div className="w-6 h-6 border-2 border-[#C38636] border-t-transparent rounded-full animate-spin mx-auto mb-2" />Loading...</div> : items.length === 0 ? <div className="text-center py-12 text-gray-400"><Layers className="mx-auto mb-2" size={32} />No carousel slides.</div> : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {items.map((item, i) => (
                        <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
                            <div className="aspect-[16/6] relative bg-gray-100"><Image src={imgUrl(item.image_url)} alt={`Slide ${i + 1}`} fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"><button onClick={() => setDeleteConfirm(item)} className="p-2.5 bg-red-500 text-white rounded-full hover:bg-red-600"><Trash2 size={18} /></button></div>
                                <div className="absolute top-3 left-3"><span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${item.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>{item.status}</span></div>
                                <div className="absolute top-3 right-3"><span className="px-2.5 py-1 rounded-full bg-white/80 text-[10px] font-semibold text-gray-700">Order: {item.sort_order}</span></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── LARGE ADD MODAL ── */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
                    <div className="bg-white rounded-3xl shadow-2xl w-[80vw] max-w-4xl max-h-[80vh] flex flex-col overflow-hidden border border-gray-200">
                        <div className="px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-[#13100A] to-[#2a2318] flex items-center justify-between flex-shrink-0">
                            <div><h3 className="text-xl font-serif text-white">Add Carousel Slide</h3><p className="text-sm text-white/50 mt-0.5">Upload desktop & mobile banner images</p></div>
                            <button onClick={() => setModalOpen(false)} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors"><X size={22} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Desktop Image */}
                                <div className="space-y-3">
                                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Desktop Banner *</label><p className="text-xs text-gray-400 mt-1">Recommended: 1920×600px</p></div>
                                    {desktopPreview && <div className="aspect-[16/6] rounded-2xl overflow-hidden border border-gray-200 bg-white"><Image src={desktopPreview} alt="Desktop preview" width={800} height={300} className="w-full h-full object-cover" /></div>}
                                    <label className="flex flex-col items-center justify-center w-full min-h-[120px] border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-[#C38636] hover:bg-[#C38636]/5 transition-all group">
                                        <Upload size={24} className="text-gray-300 group-hover:text-[#C38636] transition-colors mb-2" />
                                        <span className="text-sm font-medium text-gray-500 group-hover:text-[#C38636]">{desktopImg ? desktopImg.name : 'Upload desktop image'}</span>
                                        <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { setDesktopImg(f); handleFilePreview(f, setDesktopPreview); } }} className="hidden" />
                                    </label>
                                </div>
                                {/* Mobile Image */}
                                <div className="space-y-3">
                                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Mobile Banner (Optional)</label><p className="text-xs text-gray-400 mt-1">Recommended: 768×900px</p></div>
                                    {mobilePreview && <div className="aspect-[9/16] max-h-[200px] rounded-2xl overflow-hidden border border-gray-200 bg-white mx-auto"><Image src={mobilePreview} alt="Mobile preview" width={200} height={356} className="w-full h-full object-cover" /></div>}
                                    <label className="flex flex-col items-center justify-center w-full min-h-[120px] border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-[#C38636] hover:bg-[#C38636]/5 transition-all group">
                                        <Upload size={24} className="text-gray-300 group-hover:text-[#C38636] transition-colors mb-2" />
                                        <span className="text-sm font-medium text-gray-500 group-hover:text-[#C38636]">{mobileImg ? mobileImg.name : 'Upload mobile image'}</span>
                                        <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { setMobileImg(f); handleFilePreview(f, setMobilePreview); } }} className="hidden" />
                                    </label>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Sort Order</label><input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: e.target.value })} className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#C38636]" /></div>
                                <div className="space-y-2"><CustomSelect label="Status" value={form.status} onChange={val => setForm({ ...form, status: val })} options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} /></div>
                            </div>
                        </form>
                        <div className="px-8 py-4 border-t border-gray-100 bg-white flex items-center justify-end gap-3 flex-shrink-0">
                            <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
                            <button onClick={handleSubmit} disabled={submitting || !desktopImg} className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#C38636] to-[#DCB264] text-white font-semibold disabled:opacity-50 transition-all shadow-lg shadow-[#C38636]/20">{submitting ? 'Uploading...' : 'Add Slide'}</button>
                        </div>
                    </div>
                </div>
            )}

            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center border border-gray-200">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5"><Trash2 className="text-red-500" size={28} /></div>
                        <h3 className="text-xl font-serif text-gray-900 mb-2">Delete Slide?</h3>
                        <p className="text-sm text-gray-500 mb-8">This carousel slide will be permanently removed.</p>
                        <div className="flex gap-3"><button onClick={() => setDeleteConfirm(null)} className="flex-1 px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">Cancel</button><button onClick={handleDelete} className="flex-1 px-5 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-lg shadow-red-200">Delete</button></div>
                    </div>
                </div>
            )}
        </div>
    );
}
