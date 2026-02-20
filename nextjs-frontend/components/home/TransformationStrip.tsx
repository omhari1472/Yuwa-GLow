'use client';

import ScrollReveal from '@/components/shared/ScrollReveal';
import API, { getImageUrl } from '@/lib/api';
import type { Transformation } from '@/lib/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';

function BeforeAfterSlider({ beforeUrl, afterUrl }: { beforeUrl: string, afterUrl: string }) {
  const [position, setPosition] = useState(50);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-full overflow-hidden select-none group bg-[#0a0804]"
      style={{ height: 'clamp(350px, 45vw, 600px)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* AFTER IMAGE (Background / right side) */}
      <Image
        src={afterUrl}
        alt="After result"
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 800px"
      />
      <div
        className="absolute top-6 right-6 px-4 py-2 backdrop-blur-md rounded-sm border transition-opacity duration-300 z-10 shadow-lg"
        style={{
          background: 'rgba(10, 8, 4, 0.65)',
          borderColor: 'rgba(195, 134, 54, 0.3)',
          opacity: isHovered ? 1 : 0.7
        }}
      >
        <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#DCB264]">
          After
        </span>
      </div>

      {/* BEFORE IMAGE (Foreground / left side - clipped) */}
      <div
        className="absolute inset-0 z-20"
        style={{ clipPath: `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)` }}
      >
        <Image
          src={beforeUrl}
          alt="Before result"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 800px"
        />
        <div
          className="absolute top-6 left-6 px-4 py-2 backdrop-blur-md rounded-sm border transition-opacity duration-300 shadow-lg"
          style={{
            background: 'rgba(10, 8, 4, 0.65)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            opacity: isHovered ? 1 : 0.7
          }}
        >
          <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-white/90">
            Before
          </span>
        </div>
      </div>

      {/* FILTER OVERLAYS to hide seams for low quality images */}
      <div className="absolute inset-0 pointer-events-none z-10" style={{ boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)' }} />

      {/* CUSTOM DRAG HANDLE */}
      <div
        className="absolute inset-y-0 z-30 flex flex-col items-center justify-center pointer-events-none transition-transform duration-75"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        <div className="w-[1.5px] h-full shadow-lg" style={{ background: 'linear-gradient(to bottom, rgba(195,134,54,0), rgba(195,134,54,0.8) 20%, rgba(195,134,54,0.8) 80%, rgba(195,134,54,0))' }} />
        <div
          className="absolute w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-lg shadow-[0_0_30px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-110"
          style={{ border: '1px solid rgba(195,134,54,0.8)', background: 'rgba(10,8,4,0.65)', color: '#DCB264' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 8L5 12l4 4M15 8l4 4-4 4" />
          </svg>
        </div>
      </div>

      {/* INVISIBLE RANGE INPUT FOR NATIVE INTERACTIONS */}
      <input
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-40"
      />
    </div>
  );
}

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
          style={{ background: 'radial-gradient(circle, rgba(195,134,54,0.3), transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(220,178,100,0.25), transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <ScrollReveal className="text-center mb-16">
          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase mb-3" style={{ color: '#DCB264' }}>
            Real Results
          </p>
          <h2 className="section-title text-4xl sm:text-5xl" style={{ color: 'rgba(255,255,255,0.95)' }}>
            Transformations
          </h2>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-px w-16" style={{ background: 'rgba(195,134,54,0.4)' }} />
            <div className="w-1.5 h-1.5 rotate-45 flex-shrink-0" style={{ background: '#C38636' }} />
            <div className="h-px w-16" style={{ background: 'rgba(195,134,54,0.4)' }} />
          </div>
        </ScrollReveal>

        <div className="flex flex-col gap-14">
          {items.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 0.12}>
              <div
                className="rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  border: '1px solid rgba(195,134,54,0.15)',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(195,134,54,0.05) inset'
                }}
              >
                <BeforeAfterSlider
                  beforeUrl={getImageUrl(item.before_image)}
                  afterUrl={getImageUrl(item.after_image)}
                />

                {/* Caption bar */}
                {(item.title || item.description) && (
                  <div
                    className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 relative z-10"
                    style={{ background: '#0a0804', borderTop: '1px solid rgba(195,134,54,0.1)' }}
                  >
                    <div className="w-px h-8 hidden sm:block flex-shrink-0" style={{ background: '#C38636' }} />
                    <div className="flex-1">
                      {item.title && (
                        <h4 className="font-serif text-lg sm:text-xl font-medium mb-1" style={{ color: 'rgba(255,255,255,0.95)', letterSpacing: '0.02em' }}>
                          {item.title}
                        </h4>
                      )}
                      {item.description && (
                        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
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
