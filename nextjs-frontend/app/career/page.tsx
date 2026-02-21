'use client';

import { DetailSkeleton } from '@/components/shared/LoadingSkeleton';
import ScrollReveal from '@/components/shared/ScrollReveal';
import { Skeleton } from '@/components/ui/skeleton';
import API from '@/lib/api';
import type { Career } from '@/lib/types';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

function CareerDetail({ id }: { id: string }) {
  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    API.getCareer(id).then((res) => {
      if (res.success && res.data) setCareer(res.data);
      else setError(true);
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    setSubmitting(true);
    setSubmitError('');
    const formData = new FormData(formRef.current);
    formData.append('career_id', id);
    const res = await API.submitApplication(formData);
    if (res.success) {
      setSubmitted(true);
      formRef.current.reset();
    } else {
      setSubmitError(res.message || 'Failed to submit.');
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <nav className="flex items-center gap-2 text-[11px] text-gray-400 mb-10 flex-wrap">
        <Link href="/" className="hover:text-[#C38636]">Home</Link>
        <span>/</span>
        <Link href="/career/" className="hover:text-[#C38636]">Careers</Link>
        {career && <><span>/</span><span style={{ color: '#C38636' }}>{career.title}</span></>}
      </nav>

      {loading && <DetailSkeleton />}
      {!loading && error && (
        <div className="text-center py-20">
          <h2 className="font-serif text-3xl mb-4">Position Not Found</h2>
          <Link href="/career/" className="cta-link">View All Openings</Link>
        </div>
      )}

      {!loading && career && (
        <>
          <div className="mb-10">
            {career.department && (
              <p className="text-[10px] tracking-[0.15em] uppercase mb-2" style={{ color: '#C38636' }}>{career.department}</p>
            )}
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-4" style={{ color: '#2c2c2c' }}>{career.title}</h1>
            <div className="flex flex-wrap gap-3 text-[12px] mb-6">
              {career.location && <span className="text-gray-500">{career.location}</span>}
              {career.type && (
                <span className="px-3 py-1 rounded-full text-[11px]" style={{ background: '#f0e8da', color: '#888' }}>{career.type}</span>
              )}
            </div>
            <div className="prose prose-sm max-w-none text-sm leading-relaxed" style={{ color: '#555' }} dangerouslySetInnerHTML={{ __html: career.description.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ') }} />
            {career.requirements && (
              <div className="mt-6">
                <h3 className="font-serif text-xl font-semibold mb-3" style={{ color: '#2c2c2c' }}>Requirements</h3>
                <div className="prose prose-sm max-w-none text-sm leading-relaxed" style={{ color: '#555' }} dangerouslySetInnerHTML={{ __html: career.requirements.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ') }} />
              </div>
            )}
          </div>

          <div className="rounded-2xl p-8" style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <h2 className="font-serif text-2xl font-semibold mb-6" style={{ color: '#2c2c2c' }}>Apply for this Position</h2>
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="font-serif text-xl mb-2">Application Submitted!</h3>
                <p className="text-sm text-gray-500">We will review your application and get back to you soon.</p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="application_type" value="career" />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wide mb-1.5" style={{ color: '#666' }}>Full Name *</label>
                    <input type="text" name="name" required className="w-full px-4 py-3 border text-sm outline-none focus:border-[#C38636] transition-colors" style={{ border: '1.5px solid #e5e0d8', borderRadius: 8 }} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wide mb-1.5" style={{ color: '#666' }}>Email *</label>
                    <input type="email" name="email" required className="w-full px-4 py-3 border text-sm outline-none focus:border-[#C38636] transition-colors" style={{ border: '1.5px solid #e5e0d8', borderRadius: 8 }} />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold tracking-wide mb-1.5" style={{ color: '#666' }}>Phone</label>
                  <input type="tel" name="phone" className="w-full px-4 py-3 border text-sm outline-none focus:border-[#C38636] transition-colors" style={{ border: '1.5px solid #e5e0d8', borderRadius: 8 }} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold tracking-wide mb-1.5" style={{ color: '#666' }}>Cover Letter</label>
                  <textarea name="message" rows={4} className="w-full px-4 py-3 border text-sm outline-none focus:border-[#C38636] transition-colors resize-none" style={{ border: '1.5px solid #e5e0d8', borderRadius: 8 }} placeholder="Tell us about yourself..." />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold tracking-wide mb-1.5" style={{ color: '#666' }}>Resume / CV</label>
                  <label
                    className="flex flex-col items-center justify-center w-full py-5 px-4 rounded-lg cursor-pointer transition-all duration-200 hover:border-[#C38636] hover:bg-[#faf8f4] group"
                    style={{ border: '2px dashed #d4cec4', borderRadius: 8 }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="mb-2 text-gray-400 group-hover:text-[#C38636] transition-colors">
                      <path d="M12 16V4m0 0l-4 4m4-4l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M20 16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-xs font-medium text-gray-500 group-hover:text-[#C38636] transition-colors">Click to upload resume</span>
                    <span className="text-[10px] text-gray-400 mt-1">PDF, DOC, DOCX (Max 5MB)</span>
                    <input type="file" name="resume" accept=".pdf,.doc,.docx" className="hidden" />
                  </label>
                </div>
                {submitError && <p className="text-sm text-red-500">{submitError}</p>}
                <button type="submit" disabled={submitting} className="btn-ghost-gold w-full sm:w-auto">
                  {submitting ? 'Submitting…' : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function CareerList() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.getCareers().then((res) => {
      if (res.success && Array.isArray(res.data)) setCareers(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <section className="py-24 px-4 text-center" style={{ background: 'linear-gradient(135deg, #1a1000, #2c1a00)' }}>
        <ScrollReveal>
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: '#DCB264' }}>Join Our Team</p>
          <h1 className="section-title text-4xl sm:text-6xl mb-4" style={{ color: 'rgba(255,255,255,0.95)' }}>Careers</h1>
          <p className="text-sm max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Be part of a passionate team shaping the future of premium beauty in India.
          </p>
        </ScrollReveal>
      </section>

      <section className="py-16 px-4 max-w-4xl mx-auto">
        <ScrollReveal className="mb-10">
          <h2 className="section-title text-3xl">Open Positions</h2>
        </ScrollReveal>

        {loading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        ) : careers.length === 0 ? (
          <div className="rounded-2xl p-10 text-center" style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <p className="font-serif text-2xl mb-3" style={{ color: '#2c2c2c' }}>No openings right now</p>
            <p className="text-sm text-gray-500 mb-6">We are always looking for talented individuals. Send your CV to:</p>
            <a href="mailto:careers@yuvaglow.com" className="cta-link">careers@yuvaglow.com</a>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {careers.map((career, i) => (
              <ScrollReveal key={career.id} delay={i * 0.05}>
                <Link href={`/career/?id=${career.id}`} className="block group">
                  <div className="rounded-2xl p-6 transition-shadow duration-300 group-hover:shadow-lg" style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h3 className="font-serif text-xl font-semibold mb-1 group-hover:text-[#C38636] transition-colors" style={{ color: '#2c2c2c' }}>{career.title}</h3>
                        <div className="flex flex-wrap gap-3 text-[11px]">
                          {career.department && <span style={{ color: '#C38636' }}>{career.department}</span>}
                          {career.location && <span className="text-gray-400">{career.location}</span>}
                          {career.type && <span className="px-2 py-0.5 rounded-full" style={{ background: '#f0e8da', color: '#888' }}>{career.type}</span>}
                        </div>
                      </div>
                      <span className="cta-link text-[10px] flex-shrink-0">Apply Now</span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}

        <ScrollReveal className="mt-12">
          <div className="rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg, #f0e8da, #e8ddd0)' }}>
            <h3 className="font-serif text-2xl font-light mb-3" style={{ color: '#2c2c2c' }}>Don&apos;t see the right role?</h3>
            <p className="text-sm text-gray-500 mb-6">Send your CV to us and we&apos;ll keep it on file for future openings.</p>
            <a href="mailto:careers@yuvaglow.com" className="btn-ghost-gold">Email Your CV</a>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}

function CareerPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  if (id) return <CareerDetail id={id} />;
  return <CareerList />;
}

export default function CareerPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16"><DetailSkeleton /></div>}>
      <CareerPageContent />
    </Suspense>
  );
}
