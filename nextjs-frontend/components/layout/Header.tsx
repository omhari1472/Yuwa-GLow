'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NAV_LINKS, BRAND } from '@/lib/constants';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-3'
          : 'bg-white/80 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span
            className="font-serif text-2xl font-semibold tracking-wider"
            style={{ color: '#C38636' }}
          >
            YUVA<span style={{ color: '#2c2c2c' }}>GLOW</span>
          </span>
          <span
            className="hidden sm:block text-[9px] font-sans tracking-[0.25em] uppercase border-l pl-2 ml-1"
            style={{ color: '#999', borderColor: '#ddd' }}
          >
            Professional Co.
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[11px] font-sans font-semibold tracking-[0.12em] uppercase transition-all duration-200 ${
                isActive(link.href)
                  ? 'text-[#C38636] border-b border-[#C38636]'
                  : 'text-[#2c2c2c] hover:text-[#C38636]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <a
            href={BRAND.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.12em] uppercase px-4 py-2 border border-[#C38636] text-[#C38636] hover:bg-[#C38636] hover:text-white transition-all duration-200"
          >
            WhatsApp
          </a>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="lg:hidden p-2 text-[#2c2c2c]" aria-label="Open menu">
                <Menu size={22} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-white p-0">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b">
                  <span className="font-serif text-xl font-semibold" style={{ color: '#C38636' }}>
                    YUVAGLOW
                  </span>
                  <button onClick={() => setOpen(false)} className="p-1">
                    <X size={20} className="text-[#2c2c2c]" />
                  </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-6 py-6 flex flex-col gap-4">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`text-[13px] font-semibold tracking-[0.1em] uppercase py-1 border-b border-transparent transition-colors ${
                        isActive(link.href)
                          ? 'text-[#C38636] border-[#C38636]'
                          : 'text-[#2c2c2c] hover:text-[#C38636]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Footer of sheet */}
                <div className="px-6 py-4 border-t">
                  <a
                    href={BRAND.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-[11px] font-semibold tracking-[0.12em] uppercase px-4 py-3 bg-[#C38636] text-white"
                  >
                    WhatsApp Us
                  </a>
                  <p className="text-center text-[11px] text-gray-400 mt-3">{BRAND.phone}</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
