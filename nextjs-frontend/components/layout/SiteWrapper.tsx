'use client';


import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import ChatBot from '@/components/shared/ChatBot';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import { usePathname } from 'next/navigation';

export default function SiteWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith('/admin');

    if (isAdminRoute) {
        return <main className="min-h-screen bg-[#0A0804]">{children}</main>;
    }

    return (
        <>

            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <WhatsAppFloat />
            <ChatBot />
        </>
    );
}
