'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface AdminAuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    login: () => { },
    logout: () => { },
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export default function AdminAuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Check localStorage for existing session
        const storedToken = localStorage.getItem('admin_token');
        const storedUser = localStorage.getItem('admin_user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Failed to parse admin user', e);
            }
        }

        setIsLoading(false);
    }, []);

    // Route protection logic
    useEffect(() => {
        if (isLoading) return;

        const isAuthRoute = pathname?.startsWith('/admin/login');
        const isAdminRoute = pathname?.startsWith('/admin');

        if (isAdminRoute && !isAuthRoute && !token) {
            // Trying to access protected route without token
            router.push('/admin/login');
        } else if (isAuthRoute && token) {
            // Trying to access login page while already authenticated
            router.push('/admin');
        }
    }, [pathname, token, isLoading, router]);

    const login = (newToken: string, userData: User) => {
        localStorage.setItem('admin_token', newToken);
        localStorage.setItem('admin_user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        router.push('/admin');
    };

    const logout = async () => {
        try {
            if (token) {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://yuvaglow.com/api'}/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                });
            }
        } catch (e) {
            console.error('Logout failed on backend:', e);
        } finally {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            setToken(null);
            setUser(null);
            router.push('/admin/login');
        }
    };

    // Do not render children until initial load is complete to prevent flashing content
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0A0804] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-[#C38636] border-t-transparent animate-spin" />
            </div>
        );
    }

    // If accessing a protected route without being authenticated, maybe return null to avoid flashing
    const isAuthRoute = pathname?.startsWith('/admin/login');
    const isAdminRoute = pathname?.startsWith('/admin');
    if (isAdminRoute && !isAuthRoute && !token) {
        return null; // Will redirect in useEffect
    }

    return (
        <AdminAuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, logout }}>
            {children}
        </AdminAuthContext.Provider>
    );
}
