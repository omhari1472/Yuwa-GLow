'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import API, { getImageUrl } from '@/lib/api';
import type { Transformation } from '@/lib/types';
import ScrollReveal from '@/components/shared/ScrollReveal';

export default function TransformationStrip() {
  const [items, setItems] = useState<Transformation[]>([]);

  useEffect(() => {
    API.getTransformations().then((res) => {
      if (res.success && Array.isArray(res.data)) {
        setItems(res.data.slice(0, 3));
      }
    });
  }, []);

  if (items.length === 0) return null;

  return (
    <section
      className="py-24 px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0d0600 0%, #1a0c00 60%, #0a0400 100%)' }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(195,134,54,0.3), transparent 70%)', filter: 'blur(2px)' }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(220,178,100,0.25), transparent 70%)', filter: 'blur(2px)' }} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <ScrollReveal className="text-center mb-16">
          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase mb-3" style={{ color: '#DCB264' }}>
            Real Results
          </p>
          <h2 className="section-title text-4xl sm:text-5xl" style={{ color: 'rgba(255,255,255,0.93)' }}>
            Transformations
          </h2>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-px w-16" style={{ background: 'rgba(195,134,54,0.4)' }} />
            <div className="w-1.5 h-1.5 rotate-45 flex-shrink-0" style={{ background: '#C38636' }} />
            <div className="h-px w-16" style={{ background: 'rgba(195,134,54,0.4)' }} />
          </div>
        </ScrollReveal>

        <div className="flex flex-col gap-10">
          {items.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 0.12}>
              {/* Split-screen card */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}
              >
                {/* Before / After split */}
                <div className="relative flex" style={{ height: 'clamp(260px, 40vw, 420px)' }}>

                  {/* BEFORE */}
                  <div className="relative w-1/2 overflow-hidden">
                    <Image
                      src={getImageUrl(item.before_image)}
                      alt="Before"
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                    {/* dark tint */}
                    <div className="absolute inset-0 bg-black/20" />
                    {/* Label */}
                    <div className="absolute bottom-0 left-0 right-0 px-4 py-3"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                      <span className="text-[9px] font-bold tracking-[0.2em] uppercase"
                        style={{ color: 'rgba(255,255,255,0.8)' }}>
                        Before
                      </span>
                    </div>
                  </div>

                  {/* Gold centre divider */}
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                    <div className="flex-1 w-px" style={{ background: 'linear-gradient(to bottom, transparent, #C38636 30%, #C38636 70%, transparent)' }} />
                    {/* Icon circle */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                      style={{ background: '#C38636', boxShadow: '0 0 20px rgba(195,134,54,0.6)' }}
                    >
                      ✦
                    </div>
                    <div className="flex-1 w-px" style={{ background: 'linear-gradient(to top, transparent, #C38636 30%, #C38636 70%, transparent)' }} />
                  </div>

                  {/* AFTER */}
                  <div className="relative w-1/2 overflow-hidden">
                    <Image
                      src={getImageUrl(item.after_image)}
                      alt="After"
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                    {/* Label */}
                    <div className="absolute bottom-0 left-0 right-0 px-4 py-3"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                      <span className="text-right block text-[9px] font-bold tracking-[0.2em] uppercase"
                        style={{ color: '#DCB264' }}>
                        After
                      </span>
                    </div>
                  </div>
                </div>

                {/* Caption bar */}
                {(item.title || item.description) && (
                  <div
                    className="px-6 py-4 flex items-center gap-4"
                    style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)', borderTop: '1px solid rgba(195,134,54,0.15)' }}
                  >
                    <div className="w-px h-6 flex-shrink-0" style={{ background: '#C38636' }} />
                    <div>
                      {item.title && (
                        <p className="font-serif text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>
                          {item.title}
                        </p>
                      )}
                      {item.description && (
                        <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
