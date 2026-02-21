'use client';

import { useAdminAuth } from '@/components/admin/AdminAuthProvider';
import CustomSelect from '@/components/admin/CustomSelect';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { Edit, FileText, Plus, Trash2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://yuvaglow.com/api';
const STORAGE = process.env.NEXT_PUBLIC_STORAGE_URL || 'https://yuvaglow.com/storage';

interface Blog { id: number; title: string; slug: string; featured_image: string | null; content: string; status: string; created_at: string; }

export default function AdminBlogs() {
    const { token } = useAdminAuth();
    const [items, setItems] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<Blog | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<Blog | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ title: '', content: '', status: 'draft' });
    const [featuredImage, setFeaturedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };

    const fetchItems = async () => { try { setLoading(true); const res = await fetch(`${API}/blogs`, { headers }); const r = await res.json(); if (r.success) setItems(r.data); } catch { } finally { setLoading(false); } };
    useEffect(() => { if (token) fetchItems(); }, [token]);

    const openAdd = () => { setEditItem(null); setForm({ title: '', content: '', status: 'draft' }); setFeaturedImage(null); setImagePreview(null); setModalOpen(true); };
    const openEdit = (b: Blog) => { setEditItem(b); setForm({ title: b.title, content: b.content, status: b.status }); setFeaturedImage(null); setImagePreview(b.featured_image ? (b.featured_image.startsWith('http') ? b.featured_image : `${STORAGE}/${b.featured_image}`) : null); setModalOpen(true); };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]; if (!f) return; setFeaturedImage(f);
        const reader = new FileReader(); reader.onloadend = () => setImagePreview(reader.result as string); reader.readAsDataURL(f);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setSubmitting(true);
        try {
            const url = editItem ? `${API}/blogs/${editItem.id}` : `${API}/blogs`;
            let res;
            if (featuredImage) {
                const fd = new FormData(); fd.append('title', form.title); fd.append('content', form.content); fd.append('status', form.status); fd.append('featured_image', featuredImage);
                if (editItem) fd.append('_method', 'PUT');
                res = await fetch(url, { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }, body: fd });
            } else {
                res = await fetch(url, { method: editItem ? 'PUT' : 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
            }
            if (res.ok) { await fetchItems(); setModalOpen(false); } else { const d = await res.json(); alert(d.message || 'Failed'); }
        } catch { alert('Network error'); } finally { setSubmitting(false); }
    };

    const handleDelete = async () => { if (!deleteConfirm) return; try { await fetch(`${API}/blogs/${deleteConfirm.id}`, { method: 'DELETE', headers }); await fetchItems(); setDeleteConfirm(null); } catch { alert('Failed'); } };

    return (
        <div className="admin-page max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div><h1 className="text-2xl font-serif text-gray-900">Blogs ({items.length})</h1><p className="text-sm text-gray-500">Manage blog posts and articles</p></div>
                <button onClick={openAdd} className="bg-[#13100A] text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-[#1a1610] transition-colors"><Plus size={18} /> New Post</button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[10px] uppercase tracking-wider text-gray-500 bg-gray-50 border-b border-gray-100">
                            <tr><th className="px-6 py-4 font-semibold">Title</th><th className="px-6 py-4 font-semibold">Slug</th><th className="px-6 py-4 font-semibold">Status</th><th className="px-6 py-4 font-semibold">Date</th><th className="px-6 py-4 font-semibold text-right">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400"><div className="w-6 h-6 border-2 border-[#C38636] border-t-transparent rounded-full animate-spin mx-auto mb-2" />Loading...</td></tr>
                                : items.length === 0 ? <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400"><FileText className="mx-auto mb-2" size={32} />No blog posts.</td></tr>
                                    : items.map(b => (
                                        <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">{b.title}</td>
                                            <td className="px-6 py-4 text-gray-500 font-mono text-xs">/{b.slug}</td>
                                            <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase ${b.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{b.status}</span></td>
                                            <td className="px-6 py-4 text-gray-500 text-xs">{new Date(b.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-right"><div className="flex items-center justify-end gap-2"><button onClick={() => openEdit(b)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg"><Edit size={16} /></button><button onClick={() => setDeleteConfirm(b)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button></div></td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── LARGE ADD/EDIT MODAL ── */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
                    <div className="bg-white rounded-3xl shadow-2xl w-[85vw] max-w-5xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-200">
                        <div className="px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-[#13100A] to-[#2a2318] flex items-center justify-between flex-shrink-0">
                            <div><h3 className="text-xl font-serif text-white">{editItem ? 'Edit Blog Post' : 'New Blog Post'}</h3><p className="text-sm text-white/50 mt-0.5">{editItem ? 'Update your article content and settings' : 'Create a new article with rich text formatting'}</p></div>
                            <button onClick={() => setModalOpen(false)} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors"><X size={22} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 min-h-[50vh]">
                                {/* Left — Content */}
                                <div className="lg:col-span-3 p-8 space-y-6 border-r border-gray-100">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Post Title *</label>
                                        <input required type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#C38636] focus:ring-2 focus:ring-[#C38636]/20" placeholder="Enter blog post title" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Content *</label>
                                        <RichTextEditor value={form.content} onChange={val => setForm({ ...form, content: val })} placeholder="Write your blog content with rich formatting..." />
                                    </div>
                                </div>
                                {/* Right — Settings & Image */}
                                <div className="lg:col-span-2 p-8 bg-gray-50/50 space-y-6">
                                    <div className="space-y-2">
                                        <CustomSelect label="Publish Status" value={form.status} onChange={val => setForm({ ...form, status: val })} options={[{ value: 'draft', label: 'Draft — Not visible' }, { value: 'published', label: 'Published — Live on site' }]} />
                                    </div>
                                    <div className="space-y-3">
                                        <div><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Featured Image</label><p className="text-xs text-gray-400 mt-1">Cover image for the blog post</p></div>
                                        {imagePreview && <div className="aspect-video rounded-2xl overflow-hidden border border-gray-200 bg-white"><Image src={imagePreview} alt="Preview" width={400} height={225} className="w-full h-full object-cover" /></div>}
                                        <label className="flex flex-col items-center justify-center w-full min-h-[100px] border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-[#C38636] hover:bg-[#C38636]/5 transition-all group">
                                            <Upload size={24} className="text-gray-300 group-hover:text-[#C38636] mb-2" />
                                            <span className="text-sm text-gray-500 group-hover:text-[#C38636]">{imagePreview ? 'Replace image' : 'Upload cover image'}</span>
                                            <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div className="px-8 py-4 border-t border-gray-100 bg-white flex items-center justify-end gap-3 flex-shrink-0">
                            <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
                            <button onClick={handleSubmit} disabled={submitting} className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#C38636] to-[#DCB264] text-white font-semibold disabled:opacity-50 transition-all shadow-lg shadow-[#C38636]/20">{submitting ? 'Saving...' : editItem ? 'Update Post' : 'Publish Post'}</button>
                        </div>
                    </div>
                </div>
            )}

            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center border border-gray-200">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5"><Trash2 className="text-red-500" size={28} /></div>
                        <h3 className="text-xl font-serif text-gray-900 mb-2">Delete Post?</h3>
                        <p className="text-sm text-gray-500 mb-8">Delete <strong className="text-gray-700">{deleteConfirm.title}</strong>? This cannot be undone.</p>
                        <div className="flex gap-3"><button onClick={() => setDeleteConfirm(null)} className="flex-1 px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">Cancel</button><button onClick={handleDelete} className="flex-1 px-5 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-lg shadow-red-200">Delete</button></div>
                    </div>
                </div>
            )}
        </div>
    );
}
