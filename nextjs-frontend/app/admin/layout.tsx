'use client';

import AdminAuthProvider from '@/components/admin/AdminAuthProvider';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname?.startsWith('/admin/login');

    return (
        <AdminAuthProvider>
            {isLoginPage ? (
                children
            ) : (
                <AdminSidebar>
                    {children}
                </AdminSidebar>
            )}
        </AdminAuthProvider>
    );
}
