'use client';

import { useAdminAuth } from '@/components/admin/AdminAuthProvider';
import { AlertCircle, Lock, Mail } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAdminAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (result.success) {
                login(result.data.access_token, result.data.user);
            } else {
                setError(result.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('Connection error. Please try again later.');
            console.error('Login Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0804] flex items-center justify-center p-4" style={{ backgroundImage: 'radial-gradient(circle at top right, rgba(195,134,54,0.05) 0%, transparent 40%)' }}>
            <div className="w-full max-w-md bg-[#13100A] p-8 sm:p-12 rounded-2xl shadow-2xl border border-[rgba(195,134,54,0.15)] relative overflow-hidden">

                {/* Glow Effects */}
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#C38636] opacity-5 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute top-1/2 -right-32 w-64 h-64 bg-[#C38636] opacity-5 rounded-full blur-[80px] pointer-events-none transform -translate-y-1/2" />

                <div className="mb-10 text-center relative z-10">
                    <div className="mx-auto w-32 h-14 relative mb-6">
                        <Image
                            src="/assets/icons/logo.svg"
                            alt="YuvaGlow Logo"
                            fill
                            className="object-contain filter brightness-200 contrast-100 invert"
                            priority
                        />
                    </div>
                    <h1 className="text-2xl font-serif text-[#faf8f4] mb-2 tracking-wide">Admin Portal</h1>
                    <p className="text-xs tracking-widest uppercase text-[#C38636]">Authorized Access Only</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400 text-sm relative z-10">
                        <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-semibold tracking-widest uppercase text-white/50 px-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-white/20 focus:outline-none focus:border-[#C38636] focus:ring-1 focus:ring-[#C38636] transition-all text-sm"
                                placeholder="admin@yuvaglow.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-semibold tracking-widest uppercase text-white/50 px-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-white/20 focus:outline-none focus:border-[#C38636] focus:ring-1 focus:ring-[#C38636] transition-all text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-8 bg-gradient-to-r from-[#C38636] to-[#DCB264] hover:from-[#d69c4d] hover:to-[#e9c680] text-black font-semibold py-4 rounded-xl text-sm tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(195,134,54,0.3)] hover:shadow-[0_0_30px_rgba(195,134,54,0.5)] flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                                <span>Authenticating...</span>
                            </>
                        ) : (
                            'Sign In to Dashboard'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
