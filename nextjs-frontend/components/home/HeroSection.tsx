'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import HeroGeometric from '@/components/ui/shape-landing-hero';
import API, { getImageUrl } from '@/lib/api';
import type { CarouselItem } from '@/lib/types';

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
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [slides.length, next]);

  return (
    <>
      {/* HeroGeometric — always the primary hero */}
      <HeroGeometric
        badge="Professional Hair Care"
        title1="Elevate Your"
        title2="Beauty Ritual"
      />

      {/* Brand Campaign Carousel — shown below hero once loaded */}
      {loaded && slides.length > 0 && (
        <div
          className="relative w-full overflow-hidden"
          style={{ height: 'min(68vh, 560px)' }}
        >
          {/* Slides */}
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{ opacity: i === current ? 1 : 0 }}
            >
              <Image
                src={getImageUrl(slide.image_url)}
                alt={slide.title || `Slide ${i + 1}`}
                fill
                className="object-cover"
                priority={i === 0}
                sizes="100vw"
              />
            </div>
          ))}

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/25" />

          {/* Slide title */}
          {slides[current]?.title && (
            <div className="absolute inset-0 flex items-end justify-center pb-16 px-4 text-center">
              <h2 className="font-serif text-3xl sm:text-5xl font-light text-white drop-shadow-lg">
                {slides[current].title}
              </h2>
            </div>
          )}

          {/* Nav arrows */}
          {slides.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/35 transition-all text-white border border-white/20"
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/35 transition-all text-white border border-white/20"
                aria-label="Next slide"
              >
                <ChevronRight size={20} />
              </button>
              {/* Dots */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Slide ${i + 1}`}
                    className="transition-all duration-300 rounded-full"
                    style={{
                      width: i === current ? 28 : 8,
                      height: 8,
                      background: i === current ? '#C38636' : 'rgba(255,255,255,0.45)',
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {/* Bottom fade into page */}
          <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#f5f2ed] to-transparent pointer-events-none" />
        </div>
      )}
    </>
  );
}
