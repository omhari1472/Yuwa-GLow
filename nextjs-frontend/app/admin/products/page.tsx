'use client';

import { useAdminAuth } from '@/components/admin/AdminAuthProvider';
import CustomSelect from '@/components/admin/CustomSelect';
import { Edit, Package, Plus, Search, Trash2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://yuvaglow.com/api';
const STORAGE = process.env.NEXT_PUBLIC_STORAGE_URL || 'https://yuvaglow.com/storage';

interface Category { id: number; name: string; }
interface ProductImage { id: number; image_url: string; is_primary: boolean; }
interface ProductVariant { id: number; name: string | null; sku: string | null; price: number; sale_price: number | null; stock: number; }
interface Product { id: number; name: string; description: string; category_id: number; category: Category; status: string; images: ProductImage[]; variants: ProductVariant[]; created_at: string; }

export default function AdminProducts() {
    const { token } = useAdminAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ name: '', description: '', category_id: '', status: 'active' });
    const [formImages, setFormImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };

    const fetchProducts = async () => {
        try { setLoading(true); const res = await fetch(`${API}/products`, { headers }); const r = await res.json(); if (r.success) setProducts(r.data); }
        catch { setError('Failed to load products'); } finally { setLoading(false); }
    };

    const fetchCategories = async () => {
        try { const res = await fetch(`${API}/categories`, { headers }); const r = await res.json(); if (r.success) setCategories(r.data); } catch { }
    };

    useEffect(() => { if (token) { fetchProducts(); fetchCategories(); } }, [token]);

    const openAdd = () => { setEditProduct(null); setForm({ name: '', description: '', category_id: categories[0]?.id?.toString() || '', status: 'active' }); setFormImages([]); setImagePreviews([]); setModalOpen(true); };
    const openEdit = (p: Product) => { setEditProduct(p); setForm({ name: p.name, description: p.description || '', category_id: p.category_id?.toString() || '', status: p.status }); setFormImages([]); setImagePreviews([]); setModalOpen(true); };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setFormImages(prev => [...prev, ...files]);
        files.forEach(file => { const reader = new FileReader(); reader.onloadend = () => setImagePreviews(prev => [...prev, reader.result as string]); reader.readAsDataURL(file); });
    };

    const removePreview = (index: number) => { setFormImages(prev => prev.filter((_, i) => i !== index)); setImagePreviews(prev => prev.filter((_, i) => i !== index)); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); setSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('name', form.name); fd.append('description', form.description); fd.append('category_id', form.category_id); fd.append('status', form.status);
            formImages.forEach(img => fd.append('images[]', img));
            const url = editProduct ? `${API}/products/${editProduct.id}` : `${API}/products`;
            let res;
            if (editProduct && formImages.length === 0) {
                res = await fetch(url, { method: 'PUT', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
            } else {
                res = await fetch(url, { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }, body: fd });
            }
            if (res.ok) { await fetchProducts(); setModalOpen(false); } else { const d = await res.json(); alert(d.message || 'Failed to save'); }
        } catch { alert('Network error'); } finally { setSubmitting(false); }
    };

    const handleDelete = async () => {
        if (!deleteConfirm) return;
        try { await fetch(`${API}/products/${deleteConfirm.id}`, { method: 'DELETE', headers }); await fetchProducts(); setDeleteConfirm(null); } catch { alert('Failed to delete'); }
    };

    const getImg = (imgs: ProductImage[]) => { if (!imgs?.length) return null; const p = imgs.find(i => i.is_primary) || imgs[0]; if (!p?.image_url) return null; return p.image_url.startsWith('http') ? p.image_url : `${STORAGE}/${p.image_url}`; };
    const getPrice = (v: ProductVariant[]) => { if (!v?.length) return 'N/A'; const m = v[0]; return m.sale_price ? `₹${Number(m.sale_price).toLocaleString()}` : `₹${Number(m.price).toLocaleString()}`; };
    const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div><h1 className="text-2xl font-serif text-gray-900">Products ({products.length})</h1><p className="text-sm text-gray-500">Manage your entire product inventory and variants</p></div>
                <div className="flex gap-3">
                    <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} /><input type="text" placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#C38636] w-full sm:w-64" /></div>
                    <button onClick={openAdd} className="bg-[#13100A] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-[#1a1610] transition-colors whitespace-nowrap"><Plus size={16} /> Add Product</button>
                </div>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[10px] uppercase tracking-wider text-gray-500 bg-gray-50 border-b border-gray-100">
                            <tr><th className="px-6 py-4 font-semibold">Product</th><th className="px-6 py-4 font-semibold">Category</th><th className="px-6 py-4 font-semibold">Price</th><th className="px-6 py-4 font-semibold">Stock</th><th className="px-6 py-4 font-semibold">Status</th><th className="px-6 py-4 font-semibold text-right">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400"><div className="w-6 h-6 border-2 border-[#C38636] border-t-transparent rounded-full animate-spin mx-auto mb-2" />Loading...</td></tr>
                                : filtered.length === 0 ? <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400"><Package className="mx-auto text-gray-300 mb-2" size={32} />No products found.</td></tr>
                                    : filtered.map(p => {
                                        const img = getImg(p.images); const stock = p.variants?.reduce((s, v) => s + v.stock, 0) || 0;
                                        return (
                                            <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">{img ? <Image src={img} alt={p.name} width={48} height={48} className="object-cover w-full h-full" /> : <Package size={20} className="text-gray-400" />}</div><div><p className="font-medium text-gray-900 truncate max-w-xs">{p.name}</p><p className="text-xs text-gray-400 mt-0.5">{p.variants?.length || 0} variant(s)</p></div></div></td>
                                                <td className="px-6 py-4"><span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium border border-gray-200">{p.category?.name || 'Uncategorized'}</span></td>
                                                <td className="px-6 py-4 font-semibold text-gray-900">{getPrice(p.variants)}</td>
                                                <td className="px-6 py-4"><div className="flex items-center gap-2 text-sm"><span className={`w-2 h-2 rounded-full ${stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />{stock} in stock</div></td>
                                                <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{p.status || 'Draft'}</span></td>
                                                <td className="px-6 py-4 text-right"><div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => openEdit(p)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"><Edit size={16} /></button>
                                                    <button onClick={() => setDeleteConfirm(p)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                                </div></td>
                                            </tr>
                                        );
                                    })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── LARGE ADD/EDIT MODAL ── */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
                    <div className="bg-white rounded-3xl shadow-2xl w-[85vw] max-w-5xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-200">
                        {/* Header */}
                        <div className="px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-[#13100A] to-[#2a2318] flex items-center justify-between flex-shrink-0">
                            <div>
                                <h3 className="text-xl font-serif text-white">{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
                                <p className="text-sm text-white/50 mt-0.5">{editProduct ? 'Update product details and media' : 'Create a new product listing with images'}</p>
                            </div>
                            <button onClick={() => setModalOpen(false)} className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors"><X size={22} /></button>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 min-h-[50vh]">
                                {/* Left Section — Form Fields */}
                                <div className="lg:col-span-3 p-8 space-y-6 border-r border-gray-100">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="sm:col-span-2 space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Product Name *</label>
                                            <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#C38636] focus:ring-2 focus:ring-[#C38636]/20 transition-all" placeholder="e.g. Argan Oil Hair Serum" />
                                        </div>
                                        <div className="space-y-2">
                                            <CustomSelect label="Category" value={String(form.category_id)} onChange={val => setForm({ ...form, category_id: val })} placeholder="Select category" options={[{ value: '', label: 'Select category' }, ...categories.map(c => ({ value: String(c.id), label: c.name }))]} />
                                        </div>
                                        <div className="space-y-2">
                                            <CustomSelect label="Status" value={form.status} onChange={val => setForm({ ...form, status: val })} options={[{ value: 'active', label: 'Active — Visible in store' }, { value: 'draft', label: 'Draft — Hidden from store' }]} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Description</label>
                                        <textarea rows={6} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#C38636] focus:ring-2 focus:ring-[#C38636]/20 resize-none" placeholder="Detailed product description..." />
                                    </div>
                                </div>

                                {/* Right Section — Image Upload */}
                                <div className="lg:col-span-2 p-8 bg-gray-50/50 space-y-5">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Product Images</label>
                                        <p className="text-xs text-gray-400 mt-1">Upload high-quality product photos (JPG, PNG)</p>
                                    </div>

                                    {/* Existing images for edit mode */}
                                    {editProduct && editProduct.images?.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Current Images</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                {editProduct.images.map(img => (
                                                    <div key={img.id} className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-white">
                                                        <Image src={img.image_url.startsWith('http') ? img.image_url : `${STORAGE}/${img.image_url}`} alt="Product" width={120} height={120} className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Upload area */}
                                    <label className="flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-[#C38636] hover:bg-[#C38636]/5 transition-all group">
                                        <Upload size={28} className="text-gray-300 group-hover:text-[#C38636] transition-colors mb-2" />
                                        <span className="text-sm font-medium text-gray-500 group-hover:text-[#C38636]">Click to upload images</span>
                                        <span className="text-xs text-gray-400 mt-1">or drag and drop</span>
                                        <input type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
                                    </label>

                                    {/* Previews */}
                                    {imagePreviews.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">New Uploads ({imagePreviews.length})</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                {imagePreviews.map((src, i) => (
                                                    <div key={i} className="aspect-square rounded-xl overflow-hidden border-2 border-[#C38636]/30 bg-white relative group/img">
                                                        <Image src={src} alt={`Preview ${i}`} width={120} height={120} className="w-full h-full object-cover" />
                                                        <button type="button" onClick={() => removePreview(i)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity"><X size={12} /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="px-8 py-4 border-t border-gray-100 bg-white flex items-center justify-end gap-3 flex-shrink-0">
                            <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                            <button onClick={handleSubmit} disabled={submitting} className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#C38636] to-[#DCB264] text-white font-semibold hover:from-[#a8722e] hover:to-[#C38636] disabled:opacity-50 transition-all shadow-lg shadow-[#C38636]/20">{submitting ? 'Saving...' : editProduct ? 'Update Product' : 'Create Product'}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── DELETE CONFIRMATION ── */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center border border-gray-200">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5"><Trash2 className="text-red-500" size={28} /></div>
                        <h3 className="text-xl font-serif text-gray-900 mb-2">Delete Product?</h3>
                        <p className="text-sm text-gray-500 mb-8 leading-relaxed">Are you sure you want to permanently delete <strong className="text-gray-700">{deleteConfirm.name}</strong>? This will also remove all associated images and variants.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 px-5 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-200">Delete Permanently</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
