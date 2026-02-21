'use client';

import { useAdminAuth } from '@/components/admin/AdminAuthProvider';
import { MessageSquare, Send, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

interface Enquiry { id: number; name: string; email: string; phone: string | null; message: string; reply: string | null; status: string; replied_at: string | null; created_at: string; }

export default function AdminEnquiries() {
    const { token } = useAdminAuth();
    const [items, setItems] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [replyTo, setReplyTo] = useState<Enquiry | null>(null);
    const [replyText, setReplyText] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<Enquiry | null>(null);
    const [sending, setSending] = useState(false);

    const headers = { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' };

    const fetchItems = async () => {
        try { setLoading(true); const res = await fetch(`${API}/enquiries`, { headers }); const r = await res.json(); if (r.success) setItems(r.data); } catch { } finally { setLoading(false); }
    };

    useEffect(() => { if (token) fetchItems(); }, [token]);

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault(); if (!replyTo) return; setSending(true);
        try {
            await fetch(`${API}/enquiries/${replyTo.id}/reply`, { method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ reply: replyText }) });
            await fetchItems(); setReplyTo(null); setReplyText('');
        } catch { alert('Failed to send'); } finally { setSending(false); }
    };

    const handleDelete = async () => {
        if (!deleteConfirm) return;
        try { await fetch(`${API}/enquiries/${deleteConfirm.id}`, { method: 'DELETE', headers }); await fetchItems(); setDeleteConfirm(null); } catch { alert('Failed'); }
    };

    const statusBadge = (s: string) => s === 'replied' ? 'bg-green-100 text-green-700' : s === 'resolved' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700';

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div><h1 className="text-2xl font-serif text-gray-900">Enquiries ({items.length})</h1><p className="text-sm text-gray-500">Manage contact form submissions and reply to messages</p></div>

            {loading ? <div className="text-center py-12 text-gray-400"><div className="w-6 h-6 border-2 border-[#C38636] border-t-transparent rounded-full animate-spin mx-auto mb-2" />Loading...</div> : items.length === 0 ? <div className="text-center py-12 text-gray-400"><MessageSquare className="mx-auto mb-2" size={32} />No enquiries.</div> : (
                <div className="space-y-4">
                    {items.map(e => (
                        <div key={e.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <p className="font-medium text-gray-900">{e.name}</p>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${statusBadge(e.status)}`}>{e.status}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-3">{e.email} {e.phone && `· ${e.phone}`} · {new Date(e.created_at).toLocaleDateString()}</p>
                                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700">{e.message}</div>
                                    {e.reply && (
                                        <div className="mt-3 bg-green-50 rounded-xl p-4 text-sm text-green-800 border border-green-100">
                                            <p className="text-[10px] uppercase tracking-wider text-green-600 font-semibold mb-1">Your Reply</p>
                                            {e.reply}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    {!e.reply && <button onClick={() => { setReplyTo(e); setReplyText(''); }} className="px-3 py-1.5 bg-[#13100A] text-white text-xs font-medium rounded-lg hover:bg-black flex items-center gap-1.5"><Send size={12} /> Reply</button>}
                                    <button onClick={() => setDeleteConfirm(e)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {replyTo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between"><h3 className="font-serif text-lg font-medium">Reply to {replyTo.name}</h3><button onClick={() => setReplyTo(null)} className="text-gray-400 hover:text-gray-700"><X size={20} /></button></div>
                        <form onSubmit={handleReply} className="p-6 space-y-4">
                            <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600 max-h-32 overflow-y-auto">{replyTo.message}</div>
                            <div className="space-y-1"><label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Your Reply</label><textarea rows={4} required value={replyText} onChange={e => setReplyText(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C38636] resize-none" placeholder="Type your response..." /></div>
                            <div className="pt-2 flex gap-3">
                                <button type="button" onClick={() => setReplyTo(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={sending} className="flex-1 px-4 py-2.5 rounded-xl bg-[#13100A] text-white font-medium hover:bg-black disabled:opacity-50">{sending ? 'Sending...' : 'Send Reply'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 className="text-red-500" size={24} /></div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Enquiry?</h3>
                        <p className="text-sm text-gray-500 mb-6">Delete enquiry from <strong>{deleteConfirm.name}</strong>?</p>
                        <div className="flex gap-3"><button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">Cancel</button><button onClick={handleDelete} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700">Delete</button></div>
                    </div>
                </div>
            )}
        </div>
    );
}
