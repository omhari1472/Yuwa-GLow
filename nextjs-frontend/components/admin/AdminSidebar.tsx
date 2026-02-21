'use client';

import { useAdminAuth } from '@/components/admin/AdminAuthProvider';
import {
    Briefcase,
    FileText,
    Handshake,
    Image as ImageIcon, Layers,
    LayoutDashboard,
    LogOut,
    Mail,
    Menu,
    MessageSquare,
    Package,
    Settings,
    Sparkles,
    Tags,
    X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const MENU_ITEMS = [
    { group: 'Overview' },
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },

    { group: 'E-Commerce' },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Tags },

    { group: 'Media & Features' },
    { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
    { name: 'Home Carousel', href: '/admin/carousel', icon: Layers },
    { name: 'Transformations', href: '/admin/transformations', icon: Sparkles },

    { group: 'Content' },
    { name: 'Blogs', href: '/admin/blogs', icon: FileText },
    { name: 'Careers', href: '/admin/careers', icon: Briefcase },

    { group: 'Engagement' },
    { name: 'Partner Apps', href: '/admin/partner-applications', icon: Handshake },
    { name: 'Career Apps', href: '/admin/career-applications', icon: Briefcase },
    { name: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare },
    { name: 'Newsletter', href: '/admin/newsletter', icon: Mail },

    { group: 'System' },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAdminAuth();

    return (
        <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] flex relative">

            {/* Mobile Nav Toggle */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#13100A] z-40 flex items-center justify-between px-4 border-b border-white/10">
                <svg
                    className="w-24 h-auto text-white"
                    viewBox="0 0 200 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M22.5 13.75L12.5 36.25H16.25L20 27.5L23.75 18.75L27.5 27.5L31.25 36.25H35L25 13.75H22.5ZM47.5 13.75V36.25H51.25V13.75H47.5ZM65 13.75V36.25H68.75V13.75H65Z" fill="currentColor" />
                    <text x="75" y="32" fontFamily="Cormorant Garamond, serif" fontSize="24" fill="currentColor" letterSpacing="0.05em">YUVA GLOW</text>
                    <text x="75" y="44" fontFamily="Inter, sans-serif" fontSize="6" fill="#DCB264" letterSpacing="0.3em">PROFESSIONAL CO.</text>
                </svg>
                <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Focus Overlay for Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-[#13100A] text-[#FAFAFA] flex flex-col border-r border-[#C38636]/10 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

                {/* Logo Area */}
                <div className="h-20 flex items-center px-8 border-b border-white/5 flex-shrink-0">
                    <svg
                        className="w-32 h-auto text-white"
                        viewBox="0 0 200 50"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M22.5 13.75L12.5 36.25H16.25L20 27.5L23.75 18.75L27.5 27.5L31.25 36.25H35L25 13.75H22.5ZM47.5 13.75V36.25H51.25V13.75H47.5ZM65 13.75V36.25H68.75V13.75H65Z" fill="currentColor" />
                        <text x="75" y="32" fontFamily="Cormorant Garamond, serif" fontSize="24" fill="currentColor" letterSpacing="0.05em">YUVA GLOW</text>
                        <text x="75" y="44" fontFamily="Inter, sans-serif" fontSize="6" fill="#DCB264" letterSpacing="0.3em">PROFESSIONAL CO.</text>
                    </svg>
                </div>

                {/* Navigation Wrapper */}
                <div className="flex-1 overflow-y-auto py-6 px-4 webkit-scrollbar" style={{ scrollbarWidth: 'thin' }}>
                    <style dangerouslySetInnerHTML={{
                        __html: `
            .webkit-scrollbar::-webkit-scrollbar { width: 4px; }
            .webkit-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .webkit-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
          `}} />

                    <nav className="space-y-1">
                        {MENU_ITEMS.map((item, index) => {
                            if (item.group) {
                                return (
                                    <div key={index} className="pt-6 pb-2 px-4">
                                        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#C38636]">
                                            {item.group}
                                        </p>
                                    </div>
                                );
                            }

                            const Icon = item.icon as React.ElementType;
                            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href!));

                            return (
                                <Link
                                    key={index}
                                    href={item.href!}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${isActive
                                        ? 'bg-[#C38636]/10 text-[#DCB264] border border-[#C38636]/20'
                                        : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                                        }`}
                                >
                                    <Icon size={18} className={isActive ? 'text-[#DCB264]' : 'text-white/40'} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* User Card & Logout */}
                <div className="p-4 border-t border-white/5 flex-shrink-0">
                    <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/5 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C38636] to-[#DCB264] flex items-center justify-center text-black font-bold text-xs uppercase">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">{user?.name || 'Admin User'}</p>
                            <p className="text-[10px] text-white/40 truncate">{user?.email || 'admin@yuvaglow.com'}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 pt-16 lg:pt-0">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-gray-200 hidden lg:flex items-center justify-between px-8 sticky top-0 z-30">
                    <h2 className="text-lg font-serif font-medium text-gray-800 tracking-wide capitalize">
                        {pathname === '/admin' ? 'Dashboard Overview' : pathname.split('/').pop()?.replace(/-/g, ' ')}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1 bg-green-50 border border-green-200 rounded-full text-[10px] font-semibold uppercase tracking-wider text-green-700 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            System Live
                        </div>
                    </div>
                </header>

                {/* Page Content area */}
                <div className="p-6 lg:p-8 flex-1 overflow-y-auto relative">
                    {children}
                </div>
            </main>

        </div>
    );
}
