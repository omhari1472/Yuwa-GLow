'use client';

import ScrollReveal from '@/components/shared/ScrollReveal';
import API from '@/lib/api';
import { BRAND } from '@/lib/constants';
import Image from 'next/image';
import { useState } from 'react';

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      phone: fd.get('phone') as string,
      subject: fd.get('subject') as string,
      message: fd.get('message') as string,
    };

    const res = await API.submitEnquiry(data);
    if (res.success) {
      setSubmitted(true);
      (e.target as HTMLFormElement).reset();
    } else {
      setError(res.message || 'Failed to send. Please try again.');
    }
    setSubmitting(false);
  };

  const SOCIAL_LINKS = [
    {
      name: 'Instagram',
      href: BRAND.instagram,
      color: '#E4405F',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3Z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: BRAND.facebook,
      color: '#1877F2',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7h-2.54v-2.9h2.54v-2.21c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: BRAND.youtube,
      color: '#FF0000',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="m10 15 5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73Z" />
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      href: BRAND.whatsapp,
      color: '#25D366',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section
        className="py-24 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #1a1000, #2c1a00)' }}
      >
        <ScrollReveal>
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: '#DCB264' }}>
            Reach Out
          </p>
          <h1 className="section-title text-4xl sm:text-6xl mb-4" style={{ color: 'rgba(255,255,255,0.95)' }}>
            Contact Us
          </h1>
          <p className="text-sm max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
            We&apos;d love to hear from you. Whether it&apos;s a question about our products or a partnership inquiry, we&apos;re here to help.
          </p>
        </ScrollReveal>
      </section>

      {/* Contact Info + Form */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Info Column */}
          <ScrollReveal direction="left">
            <h2 className="font-serif text-3xl font-light mb-6" style={{ color: '#2c2c2c' }}>
              Let&apos;s Connect
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: '#666' }}>
              Whether you have a product enquiry, partnership interest, or just want to say hello —
              we&apos;d love to hear from you.
            </p>

            <div className="space-y-5">
              {/* Phone */}
              <a href={BRAND.tel} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'radial-gradient(circle, #f0e8da, #ddd4c4)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C38636" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6 19.79 19.79 0 0 1 1.61 5.1 2 2 0 0 1 3.58 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6 6l.92-1.9a2 2 0 0 1 2.11-.45c.908.34 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.1em] uppercase mb-0.5" style={{ color: '#C38636' }}>Call Us</p>
                  <p className="font-semibold text-sm group-hover:text-[#C38636] transition-colors" style={{ color: '#2c2c2c' }}>{BRAND.phone}</p>
                </div>
              </a>

              {/* Email */}
              <a href={`mailto:${BRAND.email}`} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'radial-gradient(circle, #f0e8da, #ddd4c4)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C38636" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.1em] uppercase mb-0.5" style={{ color: '#C38636' }}>Email Us</p>
                  <p className="font-semibold text-sm group-hover:text-[#C38636] transition-colors" style={{ color: '#2c2c2c' }}>{BRAND.email}</p>
                </div>
              </a>

              {/* WhatsApp */}
              <a href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#e8f5e9' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.1em] uppercase mb-0.5" style={{ color: '#25D366' }}>WhatsApp</p>
                  <p className="font-semibold text-sm group-hover:text-[#25D366] transition-colors" style={{ color: '#2c2c2c' }}>{BRAND.phone}</p>
                </div>
              </a>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'radial-gradient(circle, #f0e8da, #ddd4c4)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C38636" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.1em] uppercase mb-0.5" style={{ color: '#C38636' }}>Visit Us</p>
                  <p className="font-semibold text-sm leading-relaxed" style={{ color: '#2c2c2c' }}>{BRAND.address}</p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-10">
              <p className="text-[10px] tracking-[0.15em] uppercase font-semibold mb-4" style={{ color: '#C38636' }}>Follow Us</p>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{ background: '#f5f2ed', color: '#888' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = s.color; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#f5f2ed'; e.currentTarget.style.color = '#888'; }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* QR Code */}
            <div className="mt-10 p-6 rounded-2xl" style={{ background: '#faf8f4', border: '1px solid #e8ddd0' }}>
              <p className="text-[10px] tracking-[0.15em] uppercase font-semibold mb-3" style={{ color: '#C38636' }}>Scan to Connect</p>
              <div className="flex items-center gap-5">
                <div className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden" style={{ border: '2px solid #C38636', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }}>
                  <Image
                    src="/yuva_glow_qr.png"
                    alt="Scan to Connect with YuvaGlow"
                    fill
                    className="object-contain p-1"
                    sizes="112px"
                    unoptimized
                  />
                </div>
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: '#2c2c2c' }}>Quick Connect</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#888' }}>
                    Scan this QR code to instantly access all our social media profiles and connect with us.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Form Column */}
          <ScrollReveal direction="right">
            <div
              className="rounded-2xl p-8"
              style={{ background: 'white', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}
            >
              <h3 className="font-serif text-2xl font-light mb-6" style={{ color: '#2c2c2c' }}>Send a Message</h3>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">✅</div>
                  <h3 className="font-serif text-xl mb-2">Message Sent!</h3>
                  <p className="text-sm text-gray-500">We&apos;ll get back to you shortly.</p>
                  <button onClick={() => setSubmitted(false)} className="cta-link mt-6 inline-block">
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold tracking-wide mb-1.5" style={{ color: '#666' }}>Name *</label>
                      <input type="text" name="name" required className="w-full px-4 py-3 text-sm border outline-none focus:border-[#C38636] transition-colors" style={{ border: '1.5px solid #e5e0d8', borderRadius: 8 }} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold tracking-wide mb-1.5" style={{ color: '#666' }}>Phone</label>
                      <input type="tel" name="phone" className="w-full px-4 py-3 text-sm border outline-none focus:border-[#C38636] transition-colors" style={{ border: '1.5px solid #e5e0d8', borderRadius: 8 }} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wide mb-1.5" style={{ color: '#666' }}>Email *</label>
                    <input type="email" name="email" required className="w-full px-4 py-3 text-sm border outline-none focus:border-[#C38636] transition-colors" style={{ border: '1.5px solid #e5e0d8', borderRadius: 8 }} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wide mb-1.5" style={{ color: '#666' }}>Subject</label>
                    <input type="text" name="subject" className="w-full px-4 py-3 text-sm border outline-none focus:border-[#C38636] transition-colors" style={{ border: '1.5px solid #e5e0d8', borderRadius: 8 }} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wide mb-1.5" style={{ color: '#666' }}>Message *</label>
                    <textarea name="message" required rows={5} className="w-full px-4 py-3 text-sm border outline-none focus:border-[#C38636] transition-colors resize-none" style={{ border: '1.5px solid #e5e0d8', borderRadius: 8 }} />
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <button type="submit" disabled={submitting} className="btn-ghost-gold w-full">
                    {submitting ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Google Map */}
      <section className="w-full">
        <ScrollReveal>
          <iframe
            src={BRAND.mapEmbed}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="YuvaGlow Location — Chaudhari Plaza, Jaipur"
          />
        </ScrollReveal>
      </section>
    </div>
  );
}
