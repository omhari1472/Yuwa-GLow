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
    <section className="py-20 px-4" style={{ background: 'white' }}>
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-14">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: '#C38636' }}>
            Results That Speak
          </p>
          <h2 className="section-title text-4xl sm:text-5xl">Transformations</h2>
        </ScrollReveal>

        <div className="flex flex-col gap-12">
          {items.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 0.1}>
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
                {/* Before */}
                <div className="relative flex-1 w-full">
                  <div className="relative rounded-xl overflow-hidden aspect-square max-w-xs mx-auto sm:max-w-none sm:h-64">
                    <Image
                      src={getImageUrl(item.before_image)}
                      alt="Before"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 90vw, 40vw"
                    />
                  </div>
                  <span
                    className="absolute top-3 left-3 text-[10px] font-semibold tracking-[0.1em] uppercase px-3 py-1"
                    style={{ background: 'rgba(44,44,44,0.7)', color: '#fff', backdropFilter: 'blur(4px)' }}
                  >
                    Before
                  </span>
                </div>

                {/* Arrow */}
                <div className="flex-shrink-0 text-[#C38636]">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>

                {/* After */}
                <div className="relative flex-1 w-full">
                  <div className="relative rounded-xl overflow-hidden aspect-square max-w-xs mx-auto sm:max-w-none sm:h-64">
                    <Image
                      src={getImageUrl(item.after_image)}
                      alt="After"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 90vw, 40vw"
                    />
                  </div>
                  <span
                    className="absolute top-3 right-3 text-[10px] font-semibold tracking-[0.1em] uppercase px-3 py-1"
                    style={{ background: 'rgba(195,134,54,0.85)', color: '#fff', backdropFilter: 'blur(4px)' }}
                  >
                    After
                  </span>
                </div>

                {/* Caption */}
                <div className="sm:w-48 text-center sm:text-left flex-shrink-0">
                  <h3 className="font-serif text-lg font-semibold mb-1" style={{ color: '#2c2c2c' }}>
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-[12px] leading-relaxed" style={{ color: '#888' }}>
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
