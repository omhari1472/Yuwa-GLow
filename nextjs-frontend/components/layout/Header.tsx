'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { BRAND, NAV_LINKS } from '@/lib/constants';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [announceDismissed, setAnnounceDismissed] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Check for announcement bar
    const dismissed = sessionStorage.getItem('yg-announce-dismissed');
    setAnnounceDismissed(!!dismissed);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  // Top offset: 36px (announcement bar) when visible, 0 when dismissed
  const topOffset = announceDismissed ? 0 : 36;

  const isHeroPage = pathname === '/';

  return (
    <header
      className="fixed inset-x-0 z-50 transition-all duration-500"
      style={{
        top: topOffset,
        background: scrolled
          ? 'rgba(250,248,244,0.95)'
          : isHeroPage
            ? 'transparent'
            : 'rgba(250,248,244,0.95)',
        backdropFilter: scrolled || !isHeroPage ? 'blur(16px) saturate(1.5)' : 'none',
        boxShadow: scrolled ? '0 1px 0 rgba(195,134,54,0.12)' : 'none',
        paddingTop: scrolled ? 12 : 18,
        paddingBottom: scrolled ? 12 : 18,
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between">

        {/* ── WORDMARK ── */}
        <Link href="/" className="flex items-center gap-3 transition-opacity duration-300 hover:opacity-80">
          <Image
            src="/logo.svg"
            alt="YuvaGlow Professional Co."
            width={160}
            height={40}
            className="w-[130px] sm:w-[160px] h-auto object-contain"
            priority
          />
        </Link>

        {/* ── DESKTOP NAV ── */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative group"
              style={{
                fontFamily: "'DM Sans', Arial, sans-serif",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: isActive(link.href)
                  ? '#C38636'
                  : scrolled || !isHeroPage
                    ? '#2c2c2c'
                    : 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }}
            >
              {link.label}
              {/* animated underline */}
              <span
                className="absolute bottom-[-3px] left-0 h-px transition-all duration-300"
                style={{
                  background: '#C38636',
                  width: isActive(link.href) ? '100%' : '0%',
                }}
              />
              <span
                className="absolute bottom-[-3px] left-0 h-px transition-all duration-300 group-hover:w-full"
                style={{
                  background: 'rgba(195,134,54,0.5)',
                  width: '0%',
                }}
              />
            </Link>
          ))}
        </nav>

        {/* ── CTA + MOBILE ── */}
        <div className="flex items-center gap-3">
          <a
            href={BRAND.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 transition-all duration-300 hover:opacity-80"
            style={{
              fontFamily: "'DM Sans', Arial, sans-serif",
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '9px 22px',
              border: '1px solid rgba(195,134,54,0.5)',
              color: '#C38636',
              textDecoration: 'none',
              background: 'transparent',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = '#C38636';
              (e.currentTarget as HTMLElement).style.color = '#fff';
              (e.currentTarget as HTMLElement).style.borderColor = '#C38636';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = '#C38636';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(195,134,54,0.5)';
            }}
          >
            Enquire
          </a>

          {/* Mobile menu trigger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="lg:hidden p-2 flex items-center justify-center transition-opacity hover:opacity-70"
                aria-label="Open menu"
                style={{
                  color: scrolled || !isHeroPage ? '#2c2c2c' : 'rgba(255,255,255,0.85)',
                }}
              >
                <Menu size={22} strokeWidth={1.5} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0" style={{ background: '#0d0906' }}>
              <div className="flex flex-col h-full">
                {/* Sheet header */}
                <div
                  className="flex items-center justify-between px-7 py-6"
                  style={{ borderBottom: '1px solid rgba(195,134,54,0.12)' }}
                >
                  <div className="flex items-baseline gap-1.5 pt-1">
                    <Image
                      src="/logo.svg"
                      alt="YuvaGlow"
                      width={120}
                      height={30}
                      className="w-[120px] h-auto object-contain invert brightness-0"
                    />
                  </div>
                  <button onClick={() => setOpen(false)} style={{ color: 'rgba(255,255,255,0.4)' }}>
                    <X size={18} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-7 py-8 flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      style={{
                        fontFamily: "'DM Sans', Arial, sans-serif",
                        fontSize: 11,
                        fontWeight: 500,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: isActive(link.href) ? '#C38636' : 'rgba(255,255,255,0.55)',
                        textDecoration: 'none',
                        padding: '10px 0',
                        borderBottom: '1px solid rgba(195,134,54,0.07)',
                        transition: 'color 0.2s ease',
                        display: 'block',
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Sheet footer CTA */}
                <div className="px-7 py-6" style={{ borderTop: '1px solid rgba(195,134,54,0.12)' }}>
                  <a
                    href={BRAND.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center"
                    style={{
                      background: '#C38636',
                      color: '#fff',
                      fontFamily: "'DM Sans', Arial, sans-serif",
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      padding: '13px 20px',
                      textDecoration: 'none',
                    }}
                  >
                    WhatsApp Us
                  </a>
                  <p
                    className="text-center mt-3"
                    style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em' }}
                  >
                    {BRAND.phone}
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
