'use client';

import { useState } from 'react';
import { BRAND } from '@/lib/constants';
import API from '@/lib/api';
import ScrollReveal from '@/components/shared/ScrollReveal';

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
          <h1 className="section-title text-4xl sm:text-6xl" style={{ color: 'rgba(255,255,255,0.95)' }}>
            Contact Us
          </h1>
        </ScrollReveal>
      </section>

      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Info */}
          <ScrollReveal direction="left">
            <h2 className="font-serif text-3xl font-light mb-6" style={{ color: '#2c2c2c' }}>
              Let&apos;s Connect
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: '#666' }}>
              Whether you have a product enquiry, partnership interest, or just want to say hello —
              we&apos;d love to hear from you.
            </p>

            <div className="space-y-5">
              <a href={BRAND.tel} className="flex items-center gap-4 group">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'radial-gradient(circle, #f0e8da, #ddd4c4)' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C38636" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6 19.79 19.79 0 0 1 1.61 5.1 2 2 0 0 1 3.58 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6 6l.92-1.9a2 2 0 0 1 2.11-.45c.908.34 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.1em] uppercase mb-0.5" style={{ color: '#C38636' }}>Call Us</p>
                  <p className="font-semibold text-sm group-hover:text-[#C38636] transition-colors" style={{ color: '#2c2c2c' }}>{BRAND.phone}</p>
                </div>
              </a>

              <a href={`mailto:${BRAND.email}`} className="flex items-center gap-4 group">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'radial-gradient(circle, #f0e8da, #ddd4c4)' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C38636" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.1em] uppercase mb-0.5" style={{ color: '#C38636' }}>Email Us</p>
                  <p className="font-semibold text-sm group-hover:text-[#C38636] transition-colors" style={{ color: '#2c2c2c' }}>{BRAND.email}</p>
                </div>
              </a>

              <a href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: '#e8f5e9' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.1em] uppercase mb-0.5" style={{ color: '#25D366' }}>WhatsApp</p>
                  <p className="font-semibold text-sm group-hover:text-[#25D366] transition-colors" style={{ color: '#2c2c2c' }}>{BRAND.phone}</p>
                </div>
              </a>
            </div>
          </ScrollReveal>

          {/* Form */}
          <ScrollReveal direction="right">
            <div
              className="rounded-2xl p-8"
              style={{ background: 'white', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}
            >
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
    </div>
  );
}
