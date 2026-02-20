'use client';

import ScrollReveal from '@/components/shared/ScrollReveal';
import HeroGeometric from '@/components/ui/shape-landing-hero';
import API from '@/lib/api';
import type { CarouselItem } from '@/lib/types';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

export default function HeroSection() {
  const [slides, setSlides] = useState<CarouselItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    API.getCarousel().then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setSlides(res.data);
      }
      setLoaded(true);
    });
  }, []);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [slides.length, next]);

  return (
    <>
      {/* Primary cinematic hero */}
      <HeroGeometric
        badge="Professional Hair Care"
        title1="Elevate Your"
        title2="Beauty Ritual"
      />

      {/* Brand manifesto strip — anchors the hero to the page story */}
      <ScrollReveal>
        <div
          className="w-full py-20 px-5"
          style={{ background: '#faf8f4', borderBottom: '1px solid rgba(195,134,54,0.1)' }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <p
              className="font-serif mb-6"
              style={{
                fontSize: 'clamp(22px, 3vw, 34px)',
                fontWeight: 300,
                color: '#2c2c2c',
                lineHeight: 1.5,
                letterSpacing: '0.03em',
              }}
            >
              "We believe beauty&nbsp;is not a&nbsp;destination —
              <br className="hidden sm:block" />
              it&nbsp;is a&nbsp;daily&nbsp;
              <em style={{
                fontStyle: 'italic',
                background: 'linear-gradient(130deg, #C38636, #DCB264)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>ritual.</em>"
            </p>
            <Link href="/about/" className="cta-link">
              Discover Our Story
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* Optional: we removed the secondary campaign carousel since the main hero is now the carousel */}
    </>
  );
}
