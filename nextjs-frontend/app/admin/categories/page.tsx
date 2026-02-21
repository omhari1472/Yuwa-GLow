'use client';

import { useAdminAuth } from '@/components/admin/AdminAuthProvider';
import { Edit, Image as ImageIcon, Plus, Tags, Trash2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://yuvaglow.com/api';
const STORAGE = process.env.NEXT_PUBLIC_STORAGE_URL || 'https://yuvaglow.com/storage';

interface Category { id: number; name: string; slug: string; description: string | null; image: string | null; is_active: boolean; }

export default function AdminCategories() {
    const { token } = useAdminAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<Category | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ name: '', description: '', is_active: true });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };

    const fetchCategories = async () => {
        try { setLoading(true); const res = await fetch(`${API}/categories`, { headers }); const r = await res.json(); if (r.success) setCategories(r.data); }
        catch { setError('Failed to load categories'); } finally { setLoading(false); }
    };

    useEffect(() => { if (token) fetchCategories(); }, [token]);

    const openAdd = () => { setEditItem(null); setForm({ name: '', description: '', is_active: true }); setImageFile(null); setImagePreview(null); setModalOpen(true); };
    const openEdit = (c: Category) => { setEditItem(c); setForm({ name: c.name, description: c.description || '', is_active: c.is_active }); setImageFile(null); setImagePreview(c.image ? (c.image.startsWith('http') ? c.image : `${STORAGE}/${c.image}`) : null); setModalOpen(true); };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; if (!file) return; setImageFile(file);
        const reader = new FileReader(); reader.onloadend = () => setImagePreview(reader.result as string); reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setSubmitting(true);
        try {
            const url = editItem ? `${API}/categories/${editItem.id}` : `${API}/categories`;
            const method = editItem ? 'PUT' : 'POST';
            const res = await fetch(url, { method, headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
            if (res.ok) { await fetchCategories(); setModalOpen(false); } else { const d = await res.json(); alert(d.message || 'Failed'); }
        } catch { alert('Network error'); } finally { setSubmitting(false); }
    };

    const handleDelete = async () => {
        if (!deleteConfirm) return;
        try { await fetch(`${API}/categories/${deleteConfirm.id}`, { method: 'DELETE', headers }); await fetchCategories(); setDeleteConfirm(null); } catch { alert('Failed to delete'); }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div><h1 className="text-2xl font-serif text-gray-900">Categories</h1><p className="text-sm text-gray-500">Manage your product categories and collections</p></div>
                <button onClick={openAdd} className="bg-[#13100A] text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#1a1610] transition-colors"><Plus size={18} /> Add Category</button>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[10px] uppercase tracking-wider text-gray-500 bg-gray-50 border-b border-gray-100">
                            <tr><th className="px-6 py-4 font-semibold">Category</th><th className="px-6 py-4 font-semibold">Description</th><th className="px-6 py-4 font-semibold">Status</th><th className="px-6 py-4 font-semibold text-right">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400"><div className="w-6 h-6 border-2 border-[#C38636] border-t-transparent rounded-full animate-spin mx-auto mb-2" />Loading...</td></tr>
                                : categories.length === 0 ? <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400"><Tags className="mx-auto mb-2" size={32} />No categories found.</td></tr>
                                    : categories.map(cat => (
                                        <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex flex-shrink-0 items-center justify-center overflow-hidden">{cat.image ? <Image src={cat.image.startsWith('http') ? cat.image : `${STORAGE}/${cat.image}`} alt={cat.name} width={48} height={48} className="object-cover w-full h-full" /> : <ImageIcon size={20} className="text-gray-400" />}</div><div><p className="font-medium text-gray-900">{cat.name}</p><p className="text-xs text-gray-500 font-mono mt-0.5">/{cat.slug}</p></div></div></td>
                                            <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{cat.description || <span className="text-gray-400 italic">No description</span>}</td>
                                            <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{cat.is_active ? 'Active' : 'Hidden'}</span></td>
                                            <td className="px-6 py-4 text-right"><div className="flex items-center justify-end gap-2"><button onClick={() => openEdit(cat)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"><Edit size={16} /></button><button onClick={() => setDeleteConfirm(cat)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button></div></td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── LARGE ADD/EDIT MODAL ── */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
                    <div className="bg-white rounded-3xl shadow-2xl w-[80vw] max-w-4xl max-h-[80vh] flex flex-col overflow-hidden border border-gray-200">
                        <div className="px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-[#13100A] to-[#2a2318] flex items-center justify-between flex-shrink-0">
                            <div><h3 className="text-xl font-serif text-white">{editItem ? 'Edit Category' : 'Create New Category'}</h3><p className="text-sm text-white/50 mt-0.5">{editItem ? 'Update category details' : 'Add a new product collection'}</p></div>
                            <button onClick={() => setModalOpen(false)} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors"><X size={22} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 min-h-[40vh]">
                                <div className="lg:col-span-3 p-8 space-y-6 border-r border-gray-100">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category Name *</label>
                                        <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#C38636] focus:ring-2 focus:ring-[#C38636]/20 transition-all" placeholder="e.g. Hair Care" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Description</label>
                                        <textarea rows={5} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#C38636] focus:ring-2 focus:ring-[#C38636]/20 resize-none" placeholder="Brief category description..." />
                                    </div>
                                    <div className="flex items-center gap-3 pt-2">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C38636]"></div>
                                            <span className="ml-3 text-sm font-medium text-gray-700">Make active on store</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="lg:col-span-2 p-8 bg-gray-50/50 space-y-5">
                                    <div><label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category Image</label><p className="text-xs text-gray-400 mt-1">Upload a cover image for this category</p></div>
                                    {imagePreview && <div className="aspect-video rounded-2xl overflow-hidden border border-gray-200 bg-white"><Image src={imagePreview} alt="Preview" width={400} height={225} className="w-full h-full object-cover" /></div>}
                                    <label className="flex flex-col items-center justify-center w-full min-h-[120px] border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-[#C38636] hover:bg-[#C38636]/5 transition-all group">
                                        <Upload size={28} className="text-gray-300 group-hover:text-[#C38636] transition-colors mb-2" />
                                        <span className="text-sm font-medium text-gray-500 group-hover:text-[#C38636]">{imagePreview ? 'Replace image' : 'Click to upload'}</span>
                                        <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                                    </label>
                                </div>
                            </div>
                        </form>

                        <div className="px-8 py-4 border-t border-gray-100 bg-white flex items-center justify-end gap-3 flex-shrink-0">
                            <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
                            <button onClick={handleSubmit} disabled={submitting} className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#C38636] to-[#DCB264] text-white font-semibold hover:from-[#a8722e] hover:to-[#C38636] disabled:opacity-50 transition-all shadow-lg shadow-[#C38636]/20">{submitting ? 'Saving...' : editItem ? 'Update Category' : 'Create Category'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── DELETE CONFIRMATION ── */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center border border-gray-200">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5"><Trash2 className="text-red-500" size={28} /></div>
                        <h3 className="text-xl font-serif text-gray-900 mb-2">Delete Category?</h3>
                        <p className="text-sm text-gray-500 mb-8 leading-relaxed">Delete <strong className="text-gray-700">{deleteConfirm.name}</strong>? Products under this category may be affected.</p>
                        <div className="flex gap-3"><button onClick={() => setDeleteConfirm(null)} className="flex-1 px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">Cancel</button><button onClick={handleDelete} className="flex-1 px-5 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 shadow-lg shadow-red-200">Delete</button></div>
                    </div>
                </div>
            )}
        </div>
    );
}
