'use client';

import { useAdminAuth } from '@/components/admin/AdminAuthProvider';
import { Key, Settings as SettingsIcon, User } from 'lucide-react';
import { useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://yuvaglow.com/api';

export default function AdminSettings() {
    const { token, user } = useAdminAuth();
    const [passwords, setPasswords] = useState({ current_password: '', new_password: '', new_password_confirmation: '' });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new_password !== passwords.new_password_confirmation) { setMessage({ text: 'Passwords do not match', type: 'error' }); return; }
        setSubmitting(true); setMessage({ text: '', type: '' });
        try {
            const res = await fetch(`${API}/change-password`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(passwords)
            });
            const data = await res.json();
            if (res.ok) { setMessage({ text: 'Password updated successfully!', type: 'success' }); setPasswords({ current_password: '', new_password: '', new_password_confirmation: '' }); }
            else { setMessage({ text: data.message || 'Failed to update password', type: 'error' }); }
        } catch { setMessage({ text: 'Network error', type: 'error' }); }
        finally { setSubmitting(false); }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div><h1 className="text-2xl font-serif text-gray-900">Settings</h1><p className="text-sm text-gray-500">Account settings and system configuration</p></div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4"><User size={20} className="text-[#C38636]" /><h2 className="text-lg font-medium text-gray-900">Profile</h2></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1"><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</label><div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800">{user?.name || 'Admin'}</div></div>
                    <div className="space-y-1"><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label><div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800">{user?.email || 'admin@yuvaglow.com'}</div></div>
                </div>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4"><Key size={20} className="text-[#C38636]" /><h2 className="text-lg font-medium text-gray-900">Change Password</h2></div>

                {message.text && (
                    <div className={`p-3 rounded-xl text-sm mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>{message.text}</div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-1"><label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Current Password</label><input required type="password" value={passwords.current_password} onChange={e => setPasswords({ ...passwords, current_password: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C38636] focus:ring-1 focus:ring-[#C38636]" /></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1"><label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">New Password</label><input required type="password" minLength={6} value={passwords.new_password} onChange={e => setPasswords({ ...passwords, new_password: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C38636]" /></div>
                        <div className="space-y-1"><label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Confirm Password</label><input required type="password" minLength={6} value={passwords.new_password_confirmation} onChange={e => setPasswords({ ...passwords, new_password_confirmation: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C38636]" /></div>
                    </div>
                    <div className="pt-2"><button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-xl bg-[#13100A] text-white font-medium text-sm hover:bg-black disabled:opacity-50 transition-colors">{submitting ? 'Updating...' : 'Update Password'}</button></div>
                </form>
            </div>

            {/* System Info */}
            <div className="bg-[#13100A] rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C38636]/10 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-3 mb-4"><SettingsIcon size={20} className="text-[#DCB264]" /><h2 className="text-lg font-serif text-[#DCB264]">System Information</h2></div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><p className="text-white/40 text-xs uppercase tracking-wider mb-1">Platform</p><p className="text-white/80">Next.js + Laravel</p></div>
                    <div><p className="text-white/40 text-xs uppercase tracking-wider mb-1">Version</p><p className="text-white/80">2.0.0</p></div>
                    <div><p className="text-white/40 text-xs uppercase tracking-wider mb-1">Authentication</p><p className="text-white/80">Sanctum Token</p></div>
                    <div><p className="text-white/40 text-xs uppercase tracking-wider mb-1">Environment</p><p className="text-white/80">Development</p></div>
                </div>
            </div>
        </div>
    );
}
