'use client';

import { useAdminAuth } from '@/components/admin/AdminAuthProvider';
import CustomSelect from '@/components/admin/CustomSelect';
import { Image as ImageIcon, Plus, Trash2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
const STORAGE = 'http://127.0.0.1:8000/storage';

interface GalleryItem { id: number; title: string; type: string; media_url: string; status: string; created_at: string; }

export default function AdminGallery() {
    const { token } = useAdminAuth();
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<GalleryItem | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ title: '', type: 'image', status: 'published' });
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);

    const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };

    const fetchItems = async () => { try { setLoading(true); const res = await fetch(`${API}/gallery`, { headers }); const r = await res.json(); if (r.success) setItems(r.data); } catch { } finally { setLoading(false); } };
    useEffect(() => { if (token) fetchItems(); }, [token]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]; if (!f) return; setFile(f);
        if (f.type.startsWith('image/')) { const reader = new FileReader(); reader.onloadend = () => setFilePreview(reader.result as string); reader.readAsDataURL(f); }
        else { setFilePreview(null); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setSubmitting(true);
        try {
            const fd = new FormData(); fd.append('title', form.title); fd.append('type', form.type); fd.append('status', form.status);
            if (file) fd.append('image', file);
            const res = await fetch(`${API}/gallery`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }, body: fd });
            if (res.ok) { await fetchItems(); setModalOpen(false); setForm({ title: '', type: 'image', status: 'published' }); setFile(null); setFilePreview(null); }
            else { const d = await res.json(); alert(d.message || 'Failed'); }
        } catch { alert('Network error'); } finally { setSubmitting(false); }
    };

    const handleDelete = async () => { if (!deleteConfirm) return; try { await fetch(`${API}/gallery/${deleteConfirm.id}`, { method: 'DELETE', headers }); await fetchItems(); setDeleteConfirm(null); } catch { alert('Failed'); } };
    const mediaUrl = (url: string) => url?.startsWith('http') ? url : `${STORAGE}/${url}`;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div><h1 className="text-2xl font-serif text-gray-900">Gallery ({items.length})</h1><p className="text-sm text-gray-500">Manage gallery images and videos</p></div>
                <button onClick={() => { setModalOpen(true); setFile(null); setFilePreview(null); setForm({ title: '', type: 'image', status: 'published' }); }} className="bg-[#13100A] text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-[#1a1610] transition-colors"><Plus size={18} /> Add Media</button>
            </div>

            {loading ? <div className="text-center py-12 text-gray-400"><div className="w-6 h-6 border-2 border-[#C38636] border-t-transparent rounded-full animate-spin mx-auto mb-2" />Loading...</div> : items.length === 0 ? <div className="text-center py-12 text-gray-400"><ImageIcon className="mx-auto mb-2" size={32} />No gallery items.</div> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {items.map(item => (
                        <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
                            <div className="aspect-square relative bg-gray-100">{item.type === 'video' ? <video src={mediaUrl(item.media_url)} className="w-full h-full object-cover" muted /> : <Image src={mediaUrl(item.media_url)} alt={item.title} fill className="object-cover" />}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"><button onClick={() => setDeleteConfirm(item)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"><Trash2 size={18} /></button></div>
                            </div>
                            <div className="p-3"><p className="text-sm font-medium text-gray-900 truncate">{item.title}</p><div className="flex items-center justify-between mt-1"><span className="text-[10px] uppercase tracking-wider text-gray-400">{item.type}</span><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{item.status}</span></div></div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── LARGE ADD MODAL ── */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
                    <div className="bg-white rounded-3xl shadow-2xl w-[80vw] max-w-4xl max-h-[80vh] flex flex-col overflow-hidden border border-gray-200">
                        <div className="px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-[#13100A] to-[#2a2318] flex items-center justify-between flex-shrink-0">
                            <div><h3 className="text-xl font-serif text-white">Add Gallery Item</h3><p className="text-sm text-white/50 mt-0.5">Upload a new image or video to the gallery</p></div>
                            <button onClick={() => setModalOpen(false)} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors"><X size={22} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 min-h-[40vh]">
                                <div className="lg:col-span-3 p-8 space-y-6 border-r border-gray-100">
                                    <div className="space-y-2"><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Title *</label><input required type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#C38636] focus:ring-2 focus:ring-[#C38636]/20" placeholder="Gallery item title" /></div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-2"><CustomSelect label="Media Type" value={form.type} onChange={val => setForm({ ...form, type: val })} options={[{ value: 'image', label: 'Image' }, { value: 'video', label: 'Video' }]} /></div>
                                        <div className="space-y-2"><CustomSelect label="Visibility" value={form.status} onChange={val => setForm({ ...form, status: val })} options={[{ value: 'published', label: 'Published' }, { value: 'draft', label: 'Draft' }]} /></div>
                                    </div>
                                </div>
                                <div className="lg:col-span-2 p-8 bg-gray-50/50 space-y-5">
                                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Media File *</label><p className="text-xs text-gray-400 mt-1">Upload an image or video file</p></div>
                                    {filePreview && <div className="aspect-video rounded-2xl overflow-hidden border border-gray-200 bg-white"><Image src={filePreview} alt="Preview" width={400} height={225} className="w-full h-full object-cover" /></div>}
                                    {file && !filePreview && <div className="rounded-2xl border border-gray-200 bg-white p-4 text-center"><p className="text-sm font-medium text-gray-700">{file.name}</p><p className="text-xs text-gray-400 mt-1">{(file.size / 1024 / 1024).toFixed(1)} MB</p></div>}
                                    <label className="flex flex-col items-center justify-center w-full min-h-[140px] border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-[#C38636] hover:bg-[#C38636]/5 transition-all group">
                                        <Upload size={28} className="text-gray-300 group-hover:text-[#C38636] transition-colors mb-2" />
                                        <span className="text-sm font-medium text-gray-500 group-hover:text-[#C38636]">{file ? 'Replace file' : 'Click to upload'}</span>
                                        <span className="text-xs text-gray-400 mt-1">JPG, PNG, MP4, WebM</span>
                                        <input type="file" accept="image/*,video/*" onChange={handleFileSelect} className="hidden" />
                                    </label>
                                </div>
                            </div>
                        </form>
                        <div className="px-8 py-4 border-t border-gray-100 bg-white flex items-center justify-end gap-3 flex-shrink-0">
                            <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
                            <button onClick={handleSubmit} disabled={submitting || !file} className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#C38636] to-[#DCB264] text-white font-semibold hover:from-[#a8722e] hover:to-[#C38636] disabled:opacity-50 transition-all shadow-lg shadow-[#C38636]/20">{submitting ? 'Uploading...' : 'Add to Gallery'}</button>
                        </div>
                    </div>
                </div>
            )}

            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center border border-gray-200">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5"><Trash2 className="text-red-500" size={28} /></div>
                        <h3 className="text-xl font-serif text-gray-900 mb-2">Delete Item?</h3>
                        <p className="text-sm text-gray-500 mb-8 leading-relaxed">Delete <strong className="text-gray-700">{deleteConfirm.title}</strong>? The media file will be permanently removed.</p>
                        <div className="flex gap-3"><button onClick={() => setDeleteConfirm(null)} className="flex-1 px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">Cancel</button><button onClick={handleDelete} className="flex-1 px-5 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-lg shadow-red-200">Delete</button></div>
                    </div>
                </div>
            )}
        </div>
    );
}
