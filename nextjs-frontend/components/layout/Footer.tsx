import Link from 'next/link';
import { BRAND, NAV_LINKS } from '@/lib/constants';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: '#2c2a26', color: '#c9b99a' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="font-serif text-2xl font-semibold tracking-wider mb-3" style={{ color: '#C38636' }}>
              YUVAGLOW
            </div>
            <p className="text-xs leading-relaxed tracking-wide mb-4" style={{ color: '#b09070' }}>
              Premium salon hair care crafted with nature&apos;s finest ingredients. Cruelty-free, professional-grade.
            </p>
            <div className="flex gap-3 mt-2">
              <a href={BRAND.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-8 h-8 border border-[#5a4f40] flex items-center justify-center hover:border-[#C38636] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href={BRAND.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="w-8 h-8 border border-[#5a4f40] flex items-center justify-center hover:border-[#C38636] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: '#C38636' }}>
              Quick Links
            </h4>
            <ul className="space-y-2">
              {NAV_LINKS.slice(0, 5).map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-[12px] tracking-wide transition-colors hover:text-[#DCB264]"
                    style={{ color: '#9a8a78' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div>
            <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: '#C38636' }}>
              Company
            </h4>
            <ul className="space-y-2">
              {NAV_LINKS.slice(5).map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-[12px] tracking-wide transition-colors hover:text-[#DCB264]"
                    style={{ color: '#9a8a78' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/privacy-policy/"
                  className="text-[12px] tracking-wide transition-colors hover:text-[#DCB264]"
                  style={{ color: '#9a8a78' }}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms/"
                  className="text-[12px] tracking-wide transition-colors hover:text-[#DCB264]"
                  style={{ color: '#9a8a78' }}>
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: '#C38636' }}>
              Get In Touch
            </h4>
            <ul className="space-y-3">
              <li>
                <a href={BRAND.tel}
                  className="text-[12px] tracking-wide transition-colors hover:text-[#DCB264] flex items-center gap-2"
                  style={{ color: '#9a8a78' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6 19.79 19.79 0 0 1 1.61 5.1 2 2 0 0 1 3.58 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6 6l.92-1.9a2 2 0 0 1 2.11-.45c.908.34 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  {BRAND.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${BRAND.email}`}
                  className="text-[12px] tracking-wide transition-colors hover:text-[#DCB264] flex items-center gap-2"
                  style={{ color: '#9a8a78' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  {BRAND.email}
                </a>
              </li>
              <li>
                <a href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer"
                  className="text-[12px] tracking-wide transition-colors hover:text-[#DCB264] flex items-center gap-2"
                  style={{ color: '#9a8a78' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp Chat
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: '#3d3830' }}>
          <p className="text-[11px] tracking-wide" style={{ color: '#6a5f52' }}>
            © {year} YuvaGlow Professional Co. All rights reserved.
          </p>
          <p className="text-[11px] tracking-wide" style={{ color: '#6a5f52' }}>
            Cruelty-Free &bull; Natural &bull; Professional
          </p>
        </div>
      </div>
    </footer>
  );
}
